import type { PackageManagerName } from "./types";
import { getWorkspaceArgs2 as getWorkspaceArgs } from "./_utils";

/**
 * Get the command to install dependencies with the package manager.
 */
export function installDependenciesCommand(options: {
  packageManager: PackageManagerName;
  shortCommand?: boolean;
  frozenLockFile?: boolean;
}): string {
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
    ? pmToFrozenLockfileInstallCommand[options.packageManager]
    : [installCmd];

  return [options.packageManager, ...commandArgs].join(" ");
}

/**
 * Get the command to add a dependency with the package manager.
 */
export function addDependencyCommand(options: {
  name: string | string[];
  packageManager: PackageManagerName;
  dev?: boolean;
  global?: boolean;
  yarnBerry?: boolean;
  workspace?: string;
}): string {
  const names = Array.isArray(options.name) ? options.name : [options.name];

  if (options.packageManager === "deno") {
    for (let i = 0; i < names.length; i++) {
      if (!/^(npm|jsr|file):.+$/.test(names[i])) {
        names[i] = `npm:${names[i]}`;
      }
    }
  }

  const args = (
    options.packageManager === "yarn"
      ? [
          ...getWorkspaceArgs(options),
          // Global is not supported in berry: yarnpkg/berry#821
          options.global && options.yarnBerry ? "" : "global",
          "add",
          options.dev ? "-D" : "",
          ...names,
        ]
      : [
          options.packageManager === "npm" ? "install" : "add",
          ...getWorkspaceArgs(options),
          options.dev ? "-D" : "",
          options.global ? "-g" : "",
          ...names,
        ]
  ).filter(Boolean);

  return [options.packageManager, ...args].join(" ");
}

/**
 * Get the command to run a script with the package manager.
 */
export function runScriptCommand(options: {
  name: string;
  packageManager: PackageManagerName;
  args?: string[];
}): string {
  const args = [
    options.packageManager === "deno" ? "task" : "run",
    options.name,
    ...(options.args || []),
  ];
  return [options.packageManager, ...args].join(" ");
}

export function dlxCommand(options: {
  name: string;
  packageManager: PackageManagerName;
  args?: string[];
  shortCommand?: boolean;
}): string {
  const pmToDlxCommand: Record<PackageManagerName, string> = {
    npm: options.shortCommand ? "npx" : "npm dlx",
    yarn: "yarn dlx",
    pnpm: options.shortCommand ? "pnpx" : "pnpm dlx",
    bun: options.shortCommand ? "bunx" : "bun x",
    deno: "deno run -A",
  };

  const command = pmToDlxCommand[options.packageManager];

  let name = options.name;
  if (options.packageManager === "deno" && !name.startsWith("npm:")) {
    name = `npm:${name}`;
  }

  return [command, name, ...(options.args || [])].join(" ");
}
