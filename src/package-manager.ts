import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { join, resolve } from "pathe";
import { consola } from "consola";
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

  /**
   * Whether to disable package manager sanitization warning
   *
   * @default false
   */
  disableSanitizationWarning?: boolean;

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
    majorVersion: "1",
    lockFile: "yarn.lock",
  },
  {
    name: "yarn",
    command: "yarn",
    majorVersion: "3",
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

function parsePackageManagerName(name: string, disableWarn: boolean): any {
  const sanitized = name.replace(/^\W+/, "");
  if (name !== sanitized) {
    if (!disableWarn) {
      consola.warn(
        `Abnormal characters found in \`packageManager\` field, sanitizing from \`'${name}'\` to \`'${sanitized}'\``,
      );
    }
    return sanitized;
  }
  return name;
}

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
): Promise<PackageManager | undefined> {
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
            const [rawName, version = "0.0.0"] =
              packageJSON.packageManager.split("@");
            const name = parsePackageManagerName(
              rawName,
              !!options.disableSanitizationWarning,
            );
            const majorVersion = version.split(".")[0];
            const packageManager =
              packageManagers.find(
                (pm) => pm.name === name && pm.majorVersion === majorVersion,
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
