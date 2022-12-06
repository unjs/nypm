import { detectPackageManager } from "./detect";
import { runCorepack } from "./spawn";
import { PackageManagerName } from "./types";

export interface APICallOptions {
  cwd: string;
  packageManager: PackageManagerName;
  silent: boolean;
}

export interface AddDependencyOptions extends Partial<APICallOptions> { dev?: boolean; }
export async function addDependency (name: string, _options: AddDependencyOptions = {}) {
  const options = await _resolveOptions(_options);
  const command = options.packageManager === "npm" ? "install" : "add";
  const argv = [options.dev ? "-D" : ""].filter(Boolean);
  await runCorepack(options.packageManager, [command, ...argv, name], { cwd: options.cwd, silent: options.silent });
  return {};
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
