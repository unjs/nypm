import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { join, normalize } from "pathe";
import type { PackageManager } from "./types";

const packageManagers: PackageManager[] = [
  { name: "npm", command: "npm", lockFile: "package-lock.json" },
  { name: "yarn", command: "yarn", lockFile: "yarn.lock" },
  { name: "pnpm", command: "pnpm", lockFile: "pnpm-lock.yaml" },
  { name: "yarn@berry", command: "yarn" },
]

export interface DetectPackageManagerOptions {
  ignoreLockFile?: boolean;
  ignorePackageJSON?: boolean;
}

export async function detectPackageManager (cwd: string, options: DetectPackageManagerOptions = {}): Promise<PackageManager> {
  const detected = await findup(cwd, async (path) => {
    if (!options.ignorePackageJSON) {
      const packageJSONPath = join(path, "package.json");
      if (existsSync(packageJSONPath)) {
        const packageJSON = JSON.parse(await readFile(packageJSONPath, "utf8"));
        if (packageJSON?.packageManager) {
          const [name, version] = packageJSON.packageManager.split("@");
          const packageManager = packageManagers.find((pm) => pm.name === name);

          if (name.startsWith("yarn") && Number.parseInt(version) > 1) {
            return packageManagers.find((pm) => pm.name === "yarn@berry");
          }
          return packageManager;
        }
      }
    }
    if (!options.ignoreLockFile) {
      for (const packageManager of packageManagers) {
        if (packageManager.lockFile && existsSync(join(path, packageManager.lockFile))) {
            return { name: packageManager.name };
        }
      }
    }
  });
  return { ...packageManagers.find((pm) => pm.name === detected?.name) || packageManagers[0], version: "latest" }; // TODO: better version detection
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
