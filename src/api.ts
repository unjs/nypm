import { readPackageJSON } from "pkg-types";
import {
  executeCommand,
  resolveOperationOptions,
  getWorkspaceArgs,
  doesDependencyExist,
} from "./_utils";
import type {
  OperationOptions,
  OperationResult,
  PackageManagerName,
} from "./types";
import * as fs from "node:fs";
import { resolve } from "pathe";

/**
 * Installs project dependencies.
 *
 * @param options - Options to pass to the API call.
 * @param options.cwd - The directory to run the command in.
 * @param options.silent - Whether to run the command in silent mode.
 * @param options.packageManager - The package manager info to use (auto-detected).
 * @param options.frozenLockFile - Whether to install dependencies with frozen lock file.
 */
export async function installDependencies(
  options: Pick<
    OperationOptions,
    "cwd" | "silent" | "packageManager" | "dry"
  > & {
    frozenLockFile?: boolean;
  } = {},
): Promise<OperationResult> {
  const resolvedOptions = await resolveOperationOptions(options);

  const pmToFrozenLockfileInstallCommand: Record<PackageManagerName, string[]> =
    {
      npm: ["ci"],
      yarn: ["install", "--immutable"],
      bun: ["install", "--frozen-lockfile"],
      pnpm: ["install", "--frozen-lockfile"],
      deno: ["install", "--frozen"],
    };

  const commandArgs = options.frozenLockFile
    ? pmToFrozenLockfileInstallCommand[resolvedOptions.packageManager.name]
    : ["install"];

  if (!resolvedOptions.dry) {
    await executeCommand(resolvedOptions.packageManager.command, commandArgs, {
      cwd: resolvedOptions.cwd,
      silent: resolvedOptions.silent,
    });
  }

  return {
    exec: {
      command: resolvedOptions.packageManager.command,
      args: commandArgs,
    },
  };
}

/**
 * Adds dependency to the project.
 *
 * @param name - Name of the dependency to add.
 * @param options - Options to pass to the API call.
 * @param options.cwd - The directory to run the command in.
 * @param options.silent - Whether to run the command in silent mode.
 * @param options.packageManager - The package manager info to use (auto-detected).
 * @param options.dev - Whether to add the dependency as dev dependency.
 * @param options.workspace - The name of the workspace to use.
 * @param options.global - Whether to run the command in global mode.
 */
export async function addDependency(
  name: string | string[],
  options: OperationOptions = {},
): Promise<OperationResult> {
  const resolvedOptions = await resolveOperationOptions(options);

  const names = Array.isArray(name) ? name : [name];

  if (resolvedOptions.packageManager.name === "deno") {
    for (let i = 0; i < names.length; i++) {
      if (!/^(npm|jsr|file):.+$/.test(names[i])) {
        names[i] = `npm:${names[i]}`;
      }
    }
  }

  // TOODO: we might filter for empty values too for more safety
  if (names.length === 0) {
    return {};
  }

  const args = (
    resolvedOptions.packageManager.name === "yarn"
      ? [
          ...getWorkspaceArgs(resolvedOptions),
          // Global is not supported in berry: yarnpkg/berry#821
          resolvedOptions.global &&
          resolvedOptions.packageManager.majorVersion === "1"
            ? "global"
            : "",
          "add",
          resolvedOptions.dev ? "-D" : "",
          ...names,
        ]
      : [
          resolvedOptions.packageManager.name === "npm" ? "install" : "add",
          ...getWorkspaceArgs(resolvedOptions),
          resolvedOptions.dev ? "-D" : "",
          resolvedOptions.global ? "-g" : "",
          ...names,
        ]
  ).filter(Boolean);

  if (!resolvedOptions.dry) {
    await executeCommand(resolvedOptions.packageManager.command, args, {
      cwd: resolvedOptions.cwd,
      silent: resolvedOptions.silent,
    });
  }

  if (!resolvedOptions.dry && options.installPeerDependencies) {
    const existingPkg = await readPackageJSON(resolvedOptions.cwd);
    const peerDeps: string[] = [];
    const peerDevDeps: string[] = [];
    for (const _name of names) {
      const pkgName = _name.match(/^(.[^@]+)/)?.[0];
      const pkg = await readPackageJSON(pkgName, {
        url: resolvedOptions.cwd,
      }).catch(() => ({}) as Record<string, undefined>);
      if (!pkg.peerDependencies || pkg.name !== pkgName) {
        continue;
      }
      for (const [peerDependency, version] of Object.entries(
        pkg.peerDependencies,
      )) {
        if (pkg.peerDependenciesMeta?.[peerDependency]?.optional) {
          continue;
        }
        // TODO: refactor to getSpecifiedPackageInfo later on
        if (
          existingPkg.dependencies?.[peerDependency] ||
          existingPkg.devDependencies?.[peerDependency]
        ) {
          continue;
        }
        // TODO: Make sure peerDependency is not already installed in user project
        const isDev = pkg.peerDependenciesMeta?.[peerDependency]?.dev;
        (isDev ? peerDevDeps : peerDeps).push(`${peerDependency}@${version}`);
      }
    }
    if (peerDeps.length > 0) {
      await addDependency(peerDeps, { ...resolvedOptions });
    }
    if (peerDevDeps.length > 0) {
      await addDevDependency(peerDevDeps, { ...resolvedOptions });
    }
  }

  return {
    exec: {
      command: resolvedOptions.packageManager.command,
      args,
    },
  };
}

/**
 * Adds dev dependency to the project.
 *
 * @param name - Name of the dev dependency to add.
 * @param options - Options to pass to the API call.
 * @param options.cwd - The directory to run the command in.
 * @param options.silent - Whether to run the command in silent mode.
 * @param options.packageManager - The package manager info to use (auto-detected).
 * @param options.workspace - The name of the workspace to use.
 * @param options.global - Whether to run the command in global mode.
 *
 */
export async function addDevDependency(
  name: string | string[],
  options: Omit<OperationOptions, "dev"> = {},
): Promise<OperationResult> {
  return await addDependency(name, { ...options, dev: true });
}

/**
 * Removes dependency from the project.
 *
 * @param name - Name of the dependency to remove.
 * @param options - Options to pass to the API call.
 * @param options.cwd - The directory to run the command in.
 * @param options.silent - Whether to run the command in silent mode.
 * @param options.packageManager - The package manager info to use (auto-detected).
 * @param options.dev - Whether to remove dev dependency.
 * @param options.workspace - The name of the workspace to use.
 * @param options.global - Whether to run the command in global mode.
 */
export async function removeDependency(
  name: string | string[],
  options: OperationOptions = {},
): Promise<OperationResult> {
  const resolvedOptions = await resolveOperationOptions(options);

  const names = Array.isArray(name) ? name : [name];

  if (names.length === 0) {
    return {};
  }

  const args = (
    resolvedOptions.packageManager.name === "yarn"
      ? [
          // Global is not supported in berry: yarnpkg/berry#821
          resolvedOptions.global &&
          resolvedOptions.packageManager.majorVersion === "1"
            ? "global"
            : "",
          ...getWorkspaceArgs(resolvedOptions),
          "remove",
          resolvedOptions.dev ? "-D" : "",
          resolvedOptions.global ? "-g" : "",
          ...names,
        ]
      : [
          resolvedOptions.packageManager.name === "npm"
            ? "uninstall"
            : "remove",
          ...getWorkspaceArgs(resolvedOptions),
          resolvedOptions.dev ? "-D" : "",
          resolvedOptions.global ? "-g" : "",
          ...names,
        ]
  ).filter(Boolean);

  if (!resolvedOptions.dry) {
    await executeCommand(resolvedOptions.packageManager.command, args, {
      cwd: resolvedOptions.cwd,
      silent: resolvedOptions.silent,
    });
  }

  return {
    exec: {
      command: resolvedOptions.packageManager.command,
      args,
    },
  };
}

/**
 * Ensures dependency is installed.
 *
 * @param name - Name of the dependency.
 * @param options - Options to pass to the API call.
 * @param options.cwd - The directory to run the command in.
 * @param options.dev - Whether to install as dev dependency (if not already installed).
 * @param options.workspace - The name of the workspace to install dependency in (if not already installed).
 */
export async function ensureDependencyInstalled(
  name: string,
  options: Pick<OperationOptions, "cwd" | "dev" | "workspace"> = {},
): Promise<true | undefined> {
  const resolvedOptions = await resolveOperationOptions(options);

  const dependencyExists = doesDependencyExist(name, resolvedOptions);

  if (dependencyExists) {
    return true;
  }

  await addDependency(name, resolvedOptions);
}

/**
 * Dedupe dependencies in the project.
 *
 * @param options - Options to pass to the API call.
 * @param options.cwd - The directory to run the command in.
 * @param options.packageManager - The package manager info to use (auto-detected).
 * @param options.silent - Whether to run the command in silent mode.
 * @param options.recreateLockfile - Whether to recreate the lockfile instead of deduping.
 */
export async function dedupeDependencies(
  options: Pick<
    OperationOptions,
    "cwd" | "silent" | "packageManager" | "dry"
  > & {
    recreateLockfile?: boolean;
  } = {},
): Promise<OperationResult> {
  const resolvedOptions = await resolveOperationOptions(options);
  const isSupported = !["bun", "deno"].includes(
    resolvedOptions.packageManager.name,
  );
  const recreateLockfile = options.recreateLockfile ?? !isSupported;
  if (recreateLockfile) {
    const lockfiles = Array.isArray(resolvedOptions.packageManager.lockFile)
      ? resolvedOptions.packageManager.lockFile
      : [resolvedOptions.packageManager.lockFile];
    for (const lockfile of lockfiles) {
      if (lockfile)
        fs.rmSync(resolve(resolvedOptions.cwd, lockfile), { force: true });
    }
    return await installDependencies(resolvedOptions);
  }
  if (isSupported) {
    // https://classic.yarnpkg.com/en/docs/cli/dedupe
    const isyarnv1 =
      resolvedOptions.packageManager.name === "yarn" &&
      resolvedOptions.packageManager.majorVersion === "1";
    if (!resolvedOptions.dry) {
      await executeCommand(
        resolvedOptions.packageManager.command,
        [isyarnv1 ? "install" : "dedupe"],
        {
          cwd: resolvedOptions.cwd,
          silent: resolvedOptions.silent,
        },
      );
    }
    return {
      exec: {
        command: resolvedOptions.packageManager.command,
        args: [isyarnv1 ? "install" : "dedupe"],
      },
    };
  }
  throw new Error(
    `Deduplication is not supported for ${resolvedOptions.packageManager.name}`,
  );
}

/**
 * Runs a script defined in the package.json file.
 *
 * @param name - Name of the script to run.
 * @param options - Options to pass to the API call.
 * @param options.cwd - The directory to run the command in.
 * @param options.silent - Whether to run the command in silent mode.
 * @param options.packageManager - The package manager info to use (auto-detected).
 */
export async function runScript(
  name: string,
  options: Pick<
    OperationOptions,
    "cwd" | "silent" | "packageManager" | "dry"
  > & {
    args?: string[];
  } = {},
): Promise<OperationResult> {
  const resolvedOptions = await resolveOperationOptions(options);

  const args = [
    resolvedOptions.packageManager.name === "deno" ? "task" : "run",
    name,
    ...(options.args || []),
  ];

  if (!resolvedOptions.dry) {
    await executeCommand(resolvedOptions.packageManager.command, args, {
      cwd: resolvedOptions.cwd,
      silent: resolvedOptions.silent,
    });
  }

  return {
    exec: {
      command: resolvedOptions.packageManager.command,
      args,
    },
  };
}
