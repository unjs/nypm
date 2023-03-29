import { detectPackageManager } from "./detect";
import { runCorepack } from "./spawn";
import { PackageManager } from "./types";

export interface APICallOptions {
  cwd: string;
  packageManager: PackageManager;
  silent: boolean;
}

export interface AddDependencyOptions extends Partial<APICallOptions> { dev?: boolean; }
export async function addDependency (name: string, _options: AddDependencyOptions = {}) {
  const options = await _resolveOptions(_options);
  const command = options.packageManager.name === "npm" ? "install" : "add";
  const argv = [options.dev ? "-D" : ""].filter(Boolean);
  await runCorepack(options.packageManager.command, [command, ...argv, name], { cwd: options.cwd, silent: options.silent });
  return {};
}

async function _resolveOptions<T extends APICallOptions> (options: Partial<T> = {}): Promise<T> {
  options.cwd = options.cwd || process.cwd();
  options.silent = options.silent ?? (process.env.NODE_ENV === "test");
  if (!options.packageManager) {
    const detected = await detectPackageManager(options.cwd);
    options.packageManager = detected;
  }
  return options as T;
}
