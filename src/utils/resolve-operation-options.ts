import type { OperationOptions } from "../api";
import { detectPackageManager } from "./detect-package-manager";

type NonPartial<T> = { [P in keyof T]-?: T[P] };

export async function resolveOperationOptions(
  options: OperationOptions = {}
): Promise<
  NonPartial<
    Pick<OperationOptions, "cwd" | "silent" | "packageManager" | "dev">
  > &
    Pick<OperationOptions, "workspace">
> {
  const cwd = options.cwd || process.cwd();

  const packageManager =
    options.packageManager ||
    (await detectPackageManager(options.cwd || process.cwd()));

  if (!packageManager) {
    throw new Error("No package manager auto-detected.");
  }

  return {
    cwd,
    silent: options.silent ?? false,
    packageManager,
    dev: options.dev ?? false,
    workspace: options.workspace,
  };
}
