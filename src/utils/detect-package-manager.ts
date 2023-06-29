import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { join, normalize } from "pathe";
import type { PackageManager } from "../types";

type DetectPackageManagerOptions = {
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
};

const packageManagers: PackageManager[] = [
  { name: "npm", command: "npm", lockFile: "package-lock.json" },
  {
    name: "pnpm",
    command: "pnpm",
    lockFile: "pnpm-lock.yaml",
    files: ["pnpm-workspace.yaml"],
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

async function findup<T>(
  cwd: string,
  match: (path: string) => T | Promise<T>
): Promise<T | undefined> {
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

export async function detectPackageManager(
  cwd: string,
  options: DetectPackageManagerOptions = {}
): Promise<PackageManager | undefined> {
  const detected = await findup(cwd, async (path) => {
    // 1. Use `packageManager` field from package.json
    if (!options.ignorePackageJSON) {
      const packageJSONPath = join(path, "package.json");
      if (existsSync(packageJSONPath)) {
        const packageJSON = JSON.parse(await readFile(packageJSONPath, "utf8"));
        if (packageJSON?.packageManager) {
          const [name, version = "0.0.0"] =
            packageJSON.packageManager.split("@");
          const majorVersion = version.split(".")[0];
          const packageManager =
            packageManagers.find(
              (pm) => pm.name === name && pm.majorVersion === majorVersion
            ) || packageManagers.find((pm) => pm.name === name);
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
      for (const packageManager of packageManagers) {
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
  });

  return detected;
}
