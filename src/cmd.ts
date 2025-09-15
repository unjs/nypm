import type { PackageManagerName } from "./types";
import { fmtCommand, getWorkspaceArgs2 as getWorkspaceArgs } from "./_utils";

/**
 * Get the command to install dependencies with the package manager.
 */
export function installDependenciesCommand(
  packageManager: PackageManagerName,
  options: {
    short?: boolean;
    frozenLockFile?: boolean;
  } = {},
): string {
  const installCmd = options.short ? "i" : "install";

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

  return fmtCommand([packageManager, ...commandArgs]);
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
    workspace?: boolean | string;
    short?: boolean;
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
          options.global && !options.yarnBerry ? "global" : "",
          "add",
          options.dev ? (options.short ? "-D" : "--dev") : "",
          ...names,
        ]
      : [
          packageManager === "npm" ? (options.short ? "i" : "install") : "add",
          ...getWorkspaceArgs({ packageManager, ...options }),
          options.dev ? (options.short ? "-D" : "--dev") : "",
          options.global ? "-g" : "",
          ...names,
        ]
  ).filter(Boolean);

  return fmtCommand([packageManager, ...args]);
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
  return fmtCommand([packageManager, ...args]);
}

/**
 * Get the command to download and execute a package with the package manager.
 */
export function dlxCommand(
  packageManager: PackageManagerName,
  name: string,
  options: {
    args?: string[];
    short?: boolean;
    packages?: string[];
  } = {},
): string {
  const pmToDlxCommand: Record<PackageManagerName, string> = {
    npm: options.short ? "npx" : "npm exec",
    yarn: "yarn dlx",
    pnpm: options.short ? "pnpx" : "pnpm dlx",
    bun: options.short ? "bunx" : "bun x",
    deno: "deno run -A",
  };

  const command = pmToDlxCommand[packageManager];

  // Deno does not support multiple packages https://github.com/denoland/deno/issues/30737
  if (
    packageManager === "deno" &&
    options.packages &&
    options.packages.length > 0
  ) {
    throw new Error(`${command} does not support multiple packages`);
  }

  if (packageManager === "deno" && !name.startsWith("npm:")) {
    name = `npm:${name}`;
  }

  const packageArgs: string[] = [];
  if (options.packages && options.packages.length > 0) {
    const packageFlag =
      options.short && (packageManager === "npm" || packageManager === "yarn")
        ? "-p"
        : "--package";
    for (const pkg of options.packages) {
      packageArgs.push(`${packageFlag}=${pkg}`);
    }
  }

  return fmtCommand([command, ...packageArgs, name, ...(options.args || [])]);
}
