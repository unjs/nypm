import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { join } from "pathe";
import { _findup } from "./_utils";
import type { PackageManagerName, DetectPackageManagerOptions } from "./types";

const packageManagerLocks: Record<string, PackageManagerName> = {
  "yarn.lock": "yarn",
  "package-lock.json": "npm",
  "pnpm-lock.yaml": "pnpm"
};

export async function detectPackageManager (cwd: string, options: DetectPackageManagerOptions = {}): Promise<{ name: PackageManagerName, version?: string }> {
  const detected = await _findup(cwd, async (path) => {
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
