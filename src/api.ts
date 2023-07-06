import type { PackageManager } from "./types";
import { executeCommand } from "./utils/execute-command";
import { resolveOperationOptions } from "./utils/resolve-operation-options";
import { getWorkspaceArgs } from "./utils/get-workspace-args";
import { doesDependencyExist } from "./utils/does-dependency-exist";

export type OperationOptions = {
  cwd?: string;
  silent?: boolean;
  packageManager?: PackageManager;
  dev?: boolean;
  workspace?: string;
};

/**
 * Installs project dependencies.
 *
 * @param options - Options to pass to the API call.
 * @param options.cwd - The directory to run the command in.
 * @param options.silent - Whether to run the command in silent mode.
 * @param options.packageManager - The package manager info to use (auto-detected).
 */
export async function installDependencies(
  options: Pick<OperationOptions, "cwd" | "silent" | "packageManager"> = {}
) {
  const resolvedOptions = await resolveOperationOptions(options);

  await executeCommand(resolvedOptions.packageManager.command, ["install"], {
    cwd: resolvedOptions.cwd,
    silent: resolvedOptions.silent,
  });
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
 */
export async function addDependency(
  name: string,
  options: OperationOptions = {}
) {
  const resolvedOptions = await resolveOperationOptions(options);

  const args = (
    resolvedOptions.packageManager.name === "yarn"
      ? [
          ...getWorkspaceArgs(resolvedOptions),
          "add",
          resolvedOptions.dev ? "-D" : "",
          name,
        ]
      : [
          resolvedOptions.packageManager.name === "npm" ? "install" : "add",
          ...getWorkspaceArgs(resolvedOptions),
          resolvedOptions.dev ? "-D" : "",
          name,
        ]
  ).filter(Boolean);

  await executeCommand(resolvedOptions.packageManager.command, args, {
    cwd: resolvedOptions.cwd,
    silent: resolvedOptions.silent,
  });
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
 *
 * @deprecated Use {@link addDependency} with `dev: true` instead
 */
export async function addDevDependency(
  name: string,
  options: Omit<OperationOptions, "dev"> = {}
) {
  await addDependency(name, { ...options, dev: true });
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
 */
export async function removeDependency(
  name: string,
  options: OperationOptions = {}
) {
  const resolvedOptions = await resolveOperationOptions(options);

  const args = (
    resolvedOptions.packageManager.name === "yarn"
      ? [
          ...getWorkspaceArgs(resolvedOptions),
          "remove",
          resolvedOptions.dev ? "-D" : "",
          name,
        ]
      : [
          resolvedOptions.packageManager.name === "npm"
            ? "uninstall"
            : "remove",
          ...getWorkspaceArgs(resolvedOptions),
          resolvedOptions.dev ? "-D" : "",
          name,
        ]
  ).filter(Boolean);

  await executeCommand(resolvedOptions.packageManager.command, args, {
    cwd: resolvedOptions.cwd,
    silent: resolvedOptions.silent,
  });
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
  options: Pick<OperationOptions, "cwd" | "dev" | "workspace"> = {}
) {
  const resolvedOptions = await resolveOperationOptions(options);

  const dependencyExists = doesDependencyExist(name, resolvedOptions);

  if (dependencyExists) {
    return true;
  }

  await addDependency(name, resolvedOptions);
}
