import type { PackageManager } from "./types";
import { executeCommand } from "./utils/execute-command";
import { resolveOperationOptions } from "./utils/resolve-operation-options";
import { getWorkspaceArgs } from "./utils/get-workspace-args";

export type OperationOptions = {
  /**
   * The directory to run the command in.
   *
   * @default process.cwd()
   */
  cwd?: string;

  /**
   * Whether to run the command in silent mode.
   *
   * @default false
   */
  silent?: boolean;

  /**
   * The package manager info to use (auto-detected).
   */
  packageManager?: PackageManager;

  /**
   * Whether to add the dependency as dev dependency.
   *
   * @default false
   */
  dev?: boolean;

  /**
   * The name of the workspace to use.
   * Works only with yarn@2+, pnpm and npm.
   */
  workspace?: string;
};

/**
 * Installs project dependencies.
 *
 * @param options - Options to pass to the API call.
 */
export async function installDependencies(
  options: Partial<Omit<OperationOptions, "dev" | "workspace">> = {}
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
 */
export async function addDependency(
  name: string,
  options: Partial<OperationOptions> = {}
) {
  const resolvedOptions = await resolveOperationOptions(options);

  const args = [
    resolvedOptions.packageManager.name === "npm" ? "install" : "add",
    ...getWorkspaceArgs(resolvedOptions),
    resolvedOptions.dev ? "-D" : "",
    name,
  ].filter(Boolean);

  await executeCommand(resolvedOptions.packageManager.command, args, {
    cwd: resolvedOptions.cwd,
    silent: resolvedOptions.silent,
  });
}

/**
 * Adds dev dependency to the project.
 *
 * @param name - Name of the dependency to add.
 * @param options - Options to pass to the API call.
 *
 * @deprecated Use {@link addDependency} with `dev: true` instead
 */
export async function addDevDependency(
  name: string,
  options: Partial<Omit<OperationOptions, "dev">> = {}
) {
  await addDependency(name, { ...options, dev: true });
}

/**
 * Removes dependency from the project.
 *
 * @param name - Name of the dependency to remove.
 * @param options - Options to pass to the API call.
 */
export async function removeDependency(
  name: string,
  options: Partial<OperationOptions> = {}
) {
  const resolvedOptions = await resolveOperationOptions(options);

  const args = [
    resolvedOptions.packageManager.name === "npm" ? "uninstall" : "remove",
    ...getWorkspaceArgs(resolvedOptions),
    resolvedOptions.dev ? "-D" : "",
    name,
  ].filter(Boolean);

  await executeCommand(resolvedOptions.packageManager.command, args, {
    cwd: resolvedOptions.cwd,
    silent: resolvedOptions.silent,
  });
}
