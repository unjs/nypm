import { createHash } from "node:crypto";
import { existsSync, mkdirSync, rmSync, createWriteStream } from "node:fs";
import { readFile } from "node:fs/promises";
import { homedir, tmpdir } from "node:os";
import { join, resolve } from "pathe";
import * as tar from "tar";
import type { PackageManager } from "./types";

const NPM_REGISTRY = "https://registry.npmjs.org";

/**
 * Get the cache directory path for nypm
 * Respects NYPM_HOME environment variable, defaults to ~/.nypm
 */
export function getCacheDir(): string {
  const home = process.env.NYPM_HOME || join(homedir(), ".nypm");
  return join(home, "cache");
}

/**
 * Get the cache path for a specific package manager version
 */
export function getVersionCachePath(name: string, version: string): string {
  return join(getCacheDir(), name, version);
}

/**
 * Check if a specific version is already cached
 */
export function isVersionCached(name: string, version: string): boolean {
  const cachePath = getVersionCachePath(name, version);
  const packageJsonPath = join(cachePath, "package", "package.json");
  return existsSync(packageJsonPath);
}

/**
 * Get the bin path for a cached package manager
 */
export async function getBinPath(
  name: string,
  version: string,
): Promise<string | undefined> {
  const cachePath = getVersionCachePath(name, version);
  const packageJsonPath = join(cachePath, "package", "package.json");

  if (!existsSync(packageJsonPath)) {
    return undefined;
  }

  const packageJson = JSON.parse(await readFile(packageJsonPath, "utf8"));
  const bin = packageJson.bin;

  if (typeof bin === "string") {
    return resolve(cachePath, "package", bin);
  }

  if (typeof bin === "object" && bin[name]) {
    return resolve(cachePath, "package", bin[name]);
  }

  return undefined;
}

/**
 * Verify integrity of a file against a hash
 * Supports sha224, sha256, sha384, sha512 formats from buildMeta
 */
export async function verifyIntegrity(
  filePath: string,
  buildMeta: string,
): Promise<boolean> {
  // buildMeta format: sha512.BASE64_HASH or sha256.HEX_HASH
  const match = buildMeta.match(/^(sha\d+)[.-](.+)$/i);
  if (!match) {
    // Unknown format, skip verification
    return true;
  }

  const [, algorithm, expectedHash] = match;
  const fileBuffer = await readFile(filePath);
  const hash = createHash(algorithm.toLowerCase());
  hash.update(fileBuffer);

  // Check if it's base64 or hex encoded
  const isBase64 = expectedHash.includes("/") || expectedHash.includes("+");
  const computedHash = hash.digest(isBase64 ? "base64" : "hex");

  return computedHash === expectedHash;
}

/**
 * Download a package manager from npm registry
 */
export async function downloadPackageManager(
  name: string,
  version: string,
  buildMeta?: string,
): Promise<void> {
  const tarballUrl = `${NPM_REGISTRY}/${name}/-/${name}-${version}.tgz`;
  const cachePath = getVersionCachePath(name, version);
  const tempFile = join(tmpdir(), `nypm-${name}-${version}-${Date.now()}.tgz`);

  // Create cache directory
  mkdirSync(cachePath, { recursive: true });

  try {
    // Download tarball
    const response = await fetch(tarballUrl);
    if (!response.ok) {
      throw new Error(
        `Failed to download ${name}@${version}: ${response.status} ${response.statusText}`,
      );
    }

    // Write to temp file
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    await new Promise<void>((resolve, reject) => {
      const writeStream = createWriteStream(tempFile);
      writeStream.on("finish", resolve);
      writeStream.on("error", reject);
      writeStream.write(buffer);
      writeStream.end();
    });

    // Verify integrity if buildMeta is provided
    if (buildMeta) {
      const isValid = await verifyIntegrity(tempFile, buildMeta);
      if (!isValid) {
        throw new Error(
          `Integrity check failed for ${name}@${version}. Expected hash from buildMeta does not match downloaded file.`,
        );
      }
    }

    // Extract tarball
    await tar.extract({
      file: tempFile,
      cwd: cachePath,
    });
  } catch (error) {
    // Clean up on failure
    rmSync(cachePath, { recursive: true, force: true });
    throw error;
  } finally {
    // Clean up temp file
    rmSync(tempFile, { force: true });
  }
}

/**
 * Ensure a package manager version is available and return the bin path
 * Returns undefined if the package manager should be executed directly
 */
export async function ensurePackageManager(
  pm: PackageManager,
): Promise<string | undefined> {
  // Only manage versions for pnpm and yarn classic (v1)
  // Yarn Berry (v2+) uses a different distribution model (bundled in .yarn/releases)
  // and is not available on npm under the "yarn" package name
  if (pm.name !== "pnpm" && pm.name !== "yarn") {
    return undefined;
  }

  // If no version specified, execute directly
  if (!pm.version) {
    return undefined;
  }

  // Yarn Berry (v2+) is not available on npm, execute directly
  // It's typically bundled in the project via .yarn/releases
  if (pm.name === "yarn" && pm.majorVersion && pm.majorVersion !== "1") {
    return undefined;
  }

  // Check if already cached
  if (!isVersionCached(pm.name, pm.version)) {
    await downloadPackageManager(pm.name, pm.version, pm.buildMeta);
  }

  return getBinPath(pm.name, pm.version);
}

/**
 * Execute a command using the version manager
 * Returns the command and args to use (either node + bin path, or direct command)
 */
export async function getExecutionArgs(
  pm: PackageManager,
  args: string[],
): Promise<[string, string[]]> {
  const binPath = await ensurePackageManager(pm);

  if (binPath) {
    // Execute via Node.js with the cached bin
    return ["node", [binPath, ...args]];
  }

  // Execute directly
  return [pm.command || pm.name, args];
}
