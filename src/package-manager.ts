import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { join, resolve } from "pathe";
import { findup, parsePackageManagerField } from "./_utils";
import type { PackageManager, PackageManagerName } from "./types";

export type DetectPackageManagerOptions = {
  /**
   * Whether to ignore the lock file
   *
   * @default false
   */
  ignoreLockFile?: boolean;

  /**
   * Whether to ignore the package.json file
   *
   * @default false
   */
  ignorePackageJSON?: boolean;

  /**
   * Whether to include parent directories
   *
   * @default false
   */
  includeParentDirs?: boolean;

  /**
   * Weather to ignore argv[1] to detect script
   */
  ignoreArgv?: boolean;
};

export const packageManagers: PackageManager[] = [
  {
    name: "npm",
    command: "npm",
    lockFile: "package-lock.json",
  },
  {
    name: "pnpm",
    command: "pnpm",
    lockFile: "pnpm-lock.yaml",
    files: ["pnpm-workspace.yaml"],
  },
  {
    name: "bun",
    command: "bun",
    lockFile: ["bun.lockb", "bun.lock"],
  },
  {
    name: "yarn",
    command: "yarn",
    lockFile: "yarn.lock",
    files: [".yarnrc.yml"],
  },
  {
    name: "deno",
    command: "deno",
    lockFile: "deno.lock",
    files: ["deno.json"],
  },
] as const;

/**
 * Detect the package manager used in a directory (and up) by checking various sources:
 *
 * 1. Use `packageManager` field from package.json
 *
 * 2. Known lock files and other files
 */
export async function detectPackageManager(
  cwd: string,
  options: DetectPackageManagerOptions = {},
): Promise<(PackageManager & { warnings?: string[] }) | undefined> {
  const detected = await findup(
    resolve(cwd || "."),
    async (path) => {
      // 1. Use `packageManager` field from package.json / deno.json
      if (!options.ignorePackageJSON) {
        const packageJSONPath = join(path, "package.json");
        if (existsSync(packageJSONPath)) {
          const packageJSON = JSON.parse(
            await readFile(packageJSONPath, "utf8"),
          );
          if (packageJSON?.packageManager) {
            const {
              name,
              version = "0.0.0",
              buildMeta,
              warnings,
            } = parsePackageManagerField(packageJSON.packageManager);
            if (name) {
              const majorVersion = version.split(".")[0];
              const packageManager =
                packageManagers.find(
                  (pm) => pm.name === name && pm.majorVersion === majorVersion,
                ) || packageManagers.find((pm) => pm.name === name);
              return {
                name,
                command: name,
                version,
                majorVersion,
                buildMeta,
                warnings,
                files: packageManager?.files,
                lockFile: packageManager?.lockFile,
              };
            }
          }
        }

        const denoJSONPath = join(path, "deno.json");
        if (existsSync(denoJSONPath)) {
          return packageManagers.find((pm) => pm.name === "deno");
        }
      }

      // 2. Use implicit file detection
      if (!options.ignoreLockFile) {
        for (const packageManager of packageManagers) {
          const detectionsFiles = [
            packageManager.lockFile,
            packageManager.files,
          ]
            .flat()
            .filter(Boolean) as string[];

          if (detectionsFiles.some((file) => existsSync(resolve(path, file)))) {
            return {
              ...packageManager,
            };
          }
        }
      }
    },
    {
      includeParentDirs: options.includeParentDirs ?? true,
    },
  );

  if (!detected && !options.ignoreArgv) {
    // 3. Try to detect based on dlx/exec command
    // https://github.com/unjs/nypm/issues/116
    const scriptArg = process.argv[1];
    if (scriptArg) {
      for (const packageManager of packageManagers) {
        // Check /.[name] or /[name] in path
        const re = new RegExp(`[/\\\\]\\.?${packageManager.command}`);
        if (re.test(scriptArg)) {
          return packageManager;
        }
      }
    }
  }

  return detected;
}
