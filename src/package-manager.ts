import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { join, resolve } from "pathe";
import { env, process } from "std-env";
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
   * Weather to ignore runtime checks to detect package manager or script runner
  */
  ignoreRuntime?: boolean;

  /**
  * Whether to ignore argv[1] to detect package manager or script runner, implied if `ignoreRuntimeChecks` is `true`
  */
  ignoreArgv?: boolean;
};

export const packageManagers: PackageManager[] = [
  {
    name: "npm",
    command: "npm",
    lockFile: "package-lock.json",
    packageRunner: "npx"
  },
  {
    name: "pnpm",
    command: "pnpm",
    lockFile: "pnpm-lock.yaml",
    files: ["pnpm-workspace.yaml"],
    packageRunner: "pnpm dlx"
  },
  {
    name: "bun",
    command: "bun",
    lockFile: ["bun.lockb", "bun.lock"],
    packageRunner: "bunx"
  },
  {
    name: "yarn",
    command: "yarn",
    majorVersion: "1",
    lockFile: "yarn.lock",
    packageRunner: undefined
  },
  {
    name: "yarn",
    command: "yarn",
    majorVersion: "3",
    lockFile: "yarn.lock",
    files: [".yarnrc.yml"],
    packageRunner: "yarn dlx"
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
): Promise<PackageManager | undefined> {
  const detected = await findup(
    resolve(cwd || "."),
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

  if (!detected && !options.ignoreRuntime) {
    return detectRuntimePackageManager(options)
  }

  return detected;
}

export function detectRuntimePackageManager(options: DetectPackageManagerOptions = {}): PackageManager | undefined {
  const userAgent = env['npm_config_user_agent']

  const engine = userAgent?.split(' ')?.[0] ?? ''

  const [name, version = '0.0.0'] = engine.split('/')

  if (name) {
    const majorVersion = version.split(".")[0];
    const packageManager =
      packageManagers.find(
        (pm) => pm.name === name && pm.majorVersion === majorVersion,
      ) || packageManagers.find((pm) => pm.name === name);
    if (packageManager) {
      return {
        ...packageManager,
        command: name,
        version,
        majorVersion,
      };
    }
  }
  if (!options.ignoreArgv) {
    // Fallback to detecting based on argv
    // https://github.com/unjs/nypm/issues/116
    const scriptArg = process.argv?.[1];
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

}