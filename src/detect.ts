import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { join, normalize } from "pathe";
import type { PackageManagerName } from "./types";

const packageManagerLocks: Record<string, PackageManagerName> = {
  "yarn.lock": "yarn",
  "package-lock.json": "npm",
  "pnpm-lock.yaml": "pnpm"
};

export interface DetectPackageManagerOptions {
  ignoreLockFile?: boolean;
  ignorePackageJSON?: boolean;
}

export async function detectPackageManager (cwd: string, options: DetectPackageManagerOptions = {}): Promise<{ name: PackageManagerName, version?: string }> {
  const detected = await findup(cwd, async (path) => {
    if (!options.ignorePackageJSON) {
      const packageJSONPath = join(path, "package.json");
      if (existsSync(packageJSONPath)) {
        const packageJSON = JSON.parse(await readFile(packageJSONPath, "utf8"));
        if (packageJSON?.packageManager) {
          const [name, version] = packageJSON.packageManager.split("@");
          return { name, version };
        }
      }
    }
    if (!options.ignoreLockFile) {
      for (const lockFile in packageManagerLocks) {
        if (existsSync(join(path, lockFile))) {
          return { name: packageManagerLocks[lockFile] };
        }
      }
    }
  });
  return {
    name: "npm",
    version: "latest", // TODO
    ...detected
  };
}

async function findup<T> (cwd: string, match: (path: string) => T | Promise<T>): Promise<T | undefined> {
  const segments = normalize(cwd).split("/");
  while (segments.length > 0) {
    const path = segments.join("/");
    const result = await match(path);
    if (result) {
      return result;
    }
    segments.pop();
  }
}
