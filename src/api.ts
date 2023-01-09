import { runCorepack } from "./spawn";
import { detectPackageManager } from "./detect";
import { APICallOptions, DepApiCallOptions } from "./types";

/**
 * Add Dependency to the project
 *
 * @param name- Name of the dependency to add
 * @param _options - Options to pass to the API call
 */
export async function addDependency (name: string, _options: Partial<DepApiCallOptions> = {}) {
  const { command, argv, options } = await _resolveCommandOpts(["install", "add"], _options);
  await runCorepack(options.packageManager, [command, ...argv, name], { cwd: options.cwd, silent: options.silent });
  return {};
}

/**
 * Add a dev dependency to the project
 *
 * @param name - Name of the dependency to add
 * @param _options - Options to pass to the API call
 */
export async function addDevDependency (name: string, _options: Partial<APICallOptions> = {}) {
  return await addDependency(name, { ..._options, dev: true });
}

/**
 * This function removes a dependency from the project
 *
 * @param name - Name of the dependency to remove
 * @param _options - Options to pass to the API call
 */
export async function removeDependency (name: string, _options: Partial<DepApiCallOptions> = {}) {
  const { command, argv, options } = await _resolveCommandOpts(["uninstall", "remove"], _options);
  await runCorepack(options.packageManager, [command, ...argv, name], { cwd: options.cwd, silent: options.silent });
  return {};
}

/**
 * This function removes a dev dependency from the project
 *
 * @param name - Name of the dependency to remove
 * @param _options - Options to pass to the API call
 */
export async function removeDevDependency (name: string, _options: Partial<APICallOptions> = {}) {
  return await removeDependency(name, { ..._options, dev: true });
}

async function _resolveCommandOpts (commandName: string | string[], _options: DepApiCallOptions = {}) {
  const options = await _resolveOptions(_options);
  let argv = [options.dev ? "-D" : ""].filter(Boolean);
  const command = typeof commandName === "string" ? commandName : (options.packageManager === "npm" ? commandName[0] : commandName[1]);

  // yarn doesn't support --dev remove command
  if (options.packageManager === "yarn" && commandName.includes("uninstall")) { argv = [] }

  return {
    command,
    argv,
    options
  };
}

async function _resolveOptions<T extends APICallOptions> (options: Partial<T> = {}): Promise<T> {
  options.cwd = options.cwd || process.cwd();
  options.silent = options.silent ?? (process.env.NODE_ENV === "test");
  if (!options.packageManager) {
    const detected = await detectPackageManager(options.cwd);
    options.packageManager = detected?.name || "npm";
  }
  return options as T;
}
