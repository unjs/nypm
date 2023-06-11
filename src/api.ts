import { detectPackageManager } from "./detect";
import { runCorepack } from "./spawn";
import { PackageManager } from "./types";

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
   * Whether to use the workspace package manager.
   * Works only with yarn@2+, pnpm and npm.
   *
   * @default false
   */
  workspace?: boolean;
};

/**
 * Installs project dependencies.
 *
 * @param _options - Options to pass to the API call.
 */
export async function installDependencies(
  _options: Omit<OperationOptions, "dev" | "workspace"> = {}
) {
  const options = await _resolveOptions(_options);

  return await runCorepack(options.packageManager.command, ["install"], {
    cwd: options.cwd,
    silent: options.silent,
  });
}

/**
 * Adds dependency to the project.
 *
 * @param name - Name of the dependency to add.
 * @param _options - Options to pass to the API call.
 */
export async function addDependency(
  name: string,
  _options: OperationOptions = {}
) {
  const options = await _resolveOptions(_options);

  const args = [
    options.packageManager.name === "npm" ? "install" : "add",
    options.workspace
      ? options.packageManager.name === "yarn" // eslint-disable-line unicorn/no-nested-ternary
        ? "-W"
        : "-w"
      : "",
    options.dev ? "-D" : "",
    name,
  ].filter(Boolean);

  await runCorepack(options.packageManager.command, args, {
    cwd: options.cwd,
    silent: options.silent,
  });
  return {};
}

/**
 * Adds dev dependency to the project.
 *
 * @param name - Name of the dependency to add.
 * @param _options - Options to pass to the API call.
 */
export async function addDevDependency(
  name: string,
  _options: Omit<OperationOptions, "dev"> = {}
) {
  return await addDependency(name, { ..._options, dev: true });
}

/**
 * Removes dependency from the project.
 *
 * @param name - Name of the dependency to remove.
 * @param _options - Options to pass to the API call.
 */
export async function removeDependency(
  name: string,
  _options: Omit<OperationOptions, "workspace"> = {}
) {
  const options = await _resolveOptions(_options);

  const args = [
    options.packageManager.name === "npm" ? "uninstall" : "remove",
    options.dev ? "-D" : "",
    name,
  ].filter(Boolean);

  await runCorepack(options.packageManager.command, args, {
    cwd: options.cwd,
    silent: options.silent,
  });
  return {};
}

type NonPartial<T> = { [P in keyof T]-?: T[P] };

async function _resolveOptions(
  options: OperationOptions = {}
): Promise<NonPartial<OperationOptions>> {
  options.cwd = options.cwd || process.cwd();
  options.silent = options.silent ?? process.env.NODE_ENV === "test";
  if (!options.packageManager) {
    const detected = await detectPackageManager(options.cwd);
    options.packageManager = detected;
  }
  return options as NonPartial<OperationOptions>;
}
