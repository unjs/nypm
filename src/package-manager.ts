import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { join, resolve } from "pathe";
import { findup } from "./_utils";
import type { PackageManager } from "./types";

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
};

const _packageManagers: PackageManager[] = [
  { name: "npm", command: "npm", lockFile: "package-lock.json" },
  {
    name: "pnpm",
    command: "pnpm",
    lockFile: "pnpm-lock.yaml",
    files: ["pnpm-workspace.yaml"],
  },
  {
    name: "bun",
    command: "bun",
    lockFile: "bun.lockb",
  },
  {
    name: "yarn",
    command: "yarn",
    majorVersion: "1.0.0",
    lockFile: "yarn.lock",
  },
  {
    name: "yarn",
    command: "yarn",
    majorVersion: "3.0.0",
    lockFile: "yarn.lock",
    files: [".yarnrc.yml"],
  },
];

export async function detectPackageManager(
  cwd: string,
  options: DetectPackageManagerOptions = {},
): Promise<PackageManager | undefined> {
  const detected = await findup(
    cwd,
    async (path) => {
      // 1. Use `packageManager` field from package.json
      if (!options.ignorePackageJSON) {
        const packageJSONPath = join(path, "package.json");
        if (existsSync(packageJSONPath)) {
          const packageJSON = JSON.parse(
            await readFile(packageJSONPath, "utf8"),
          );
          if (packageJSON?.packageManager) {
            const [name, version = "0.0.0"] =
              packageJSON.packageManager.split("@");
            const majorVersion = version.split(".")[0];
            const packageManager =
              _packageManagers.find(
                (pm) => pm.name === name && pm.majorVersion === majorVersion,
              ) || _packageManagers.find((pm) => pm.name === name);
            return {
              ...packageManager,
              name,
              command: name,
              version,
              majorVersion,
            };
          }
        }
      }

      // 2. Use implicit file detection
      if (!options.ignoreLockFile) {
        for (const packageManager of _packageManagers) {
          const detectionsFiles = [
            packageManager.lockFile,
            ...(packageManager.files || []),
          ].filter(Boolean) as string[];

          if (detectionsFiles.some((file) => existsSync(resolve(path, file)))) {
            return {
              ...packageManager,
            };
          }
        }
      }
    },
    {
      includeParentDirs: options.includeParentDirs,
    },
  );

  return detected;
}
