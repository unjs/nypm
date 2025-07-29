import type { PackageManagerName } from "./types";
import { getWorkspaceArgs2 as getWorkspaceArgs } from "./_utils";

/**
 * Get the command to install dependencies with the package manager.
 */
export function installDependenciesCommand(
  packageManager: PackageManagerName,
  options: {
    shortCommand?: boolean;
    frozenLockFile?: boolean;
  } = {},
): string {
  const installCmd = options.shortCommand ? "i" : "install";

  const pmToFrozenLockfileInstallCommand: Record<PackageManagerName, string[]> =
    {
      npm: ["ci"],
      yarn: [installCmd, "--immutable"],
      bun: [installCmd, "--frozen-lockfile"],
      pnpm: [installCmd, "--frozen-lockfile"],
      deno: [installCmd, "--frozen"],
    };

  const commandArgs = options.frozenLockFile
    ? pmToFrozenLockfileInstallCommand[packageManager]
    : [installCmd];

  return [packageManager, ...commandArgs].join(" ");
}

/**
 * Get the command to add a dependency with the package manager.
 */
export function addDependencyCommand(
  packageManager: PackageManagerName,
  name: string | string[],
  options: {
    dev?: boolean;
    global?: boolean;
    yarnBerry?: boolean;
    workspace?: string;
  } = {},
): string {
  const names = Array.isArray(name) ? name : [name];

  if (packageManager === "deno") {
    for (let i = 0; i < names.length; i++) {
      if (!/^(npm|jsr|file):.+$/.test(names[i])) {
        names[i] = `npm:${names[i]}`;
      }
    }
  }

  const args = (
    packageManager === "yarn"
      ? [
          ...getWorkspaceArgs({ packageManager, ...options }),
          // Global is not supported in berry: yarnpkg/berry#821
          options.global && options.yarnBerry ? "" : "global",
          "add",
          options.dev ? "-D" : "",
          ...names,
        ]
      : [
          packageManager === "npm" ? "install" : "add",
          ...getWorkspaceArgs({ packageManager, ...options }),
          options.dev ? "-D" : "",
          options.global ? "-g" : "",
          ...names,
        ]
  ).filter(Boolean);

  return [packageManager, ...args].join(" ");
}

/**
 * Get the command to run a script with the package manager.
 */
export function runScriptCommand(
  packageManager: PackageManagerName,
  name: string,
  options: {
    args?: string[];
  } = {},
): string {
  const args = [
    packageManager === "deno" ? "task" : "run",
    name,
    ...(options.args || []),
  ];
  return [packageManager, ...args].join(" ");
}

export function dlxCommand(
  packageManager: PackageManagerName,
  name: string,
  options: {
    args?: string[];
    shortCommand?: boolean;
  },
): string {
  const pmToDlxCommand: Record<PackageManagerName, string> = {
    npm: options.shortCommand ? "npx" : "npm dlx",
    yarn: "yarn dlx",
    pnpm: options.shortCommand ? "pnpx" : "pnpm dlx",
    bun: options.shortCommand ? "bunx" : "bun x",
    deno: "deno run -A",
  };

  const command = pmToDlxCommand[packageManager];

  if (packageManager === "deno" && !name.startsWith("npm:")) {
    name = `npm:${name}`;
  }

  return [command, name, ...(options.args || [])].join(" ");
}
