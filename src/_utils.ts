import { createRequire } from "node:module";
import { normalize } from "pathe";
import { withTrailingSlash } from "ufo";
import type { OperationOptions } from "./types";
import type { DetectPackageManagerOptions } from "./package-manager";
import { detectPackageManager } from "./package-manager";

export async function findup<T>(
  cwd: string,
  match: (path: string) => T | Promise<T>,
  options: Pick<DetectPackageManagerOptions, "includeParentDirs"> = {},
): Promise<T | undefined> {
  const segments = normalize(cwd).split("/");

  while (segments.length > 0) {
    const path = segments.join("/");
    const result = await match(path);

    if (result || !options.includeParentDirs) {
      return result;
    }

    segments.pop();
  }
}

export async function executeCommand(
  command: string,
  args: string[],
  options: Pick<OperationOptions, "cwd" | "silent"> = {},
): Promise<void> {
  const { execa } = await import("execa");
  const { resolve } = await import("pathe");

  // work around issue with segmentation fault when using corepack with npm
  // on ubuntu-latest
  const execaArgs: [string, string[]] =
    command === "npm" || command === "bun"
      ? [command, args]
      : ["corepack", [command, ...args]];

  await execa(execaArgs[0], execaArgs[1], {
    cwd: resolve(options.cwd || process.cwd()),
    stdio: options.silent ? "pipe" : "inherit",
  });
}

type NonPartial<T> = { [P in keyof T]-?: T[P] };

export const NO_PACKAGE_MANAGER_DETECTED_ERROR_MSG =
  "No package manager auto-detected.";

export async function resolveOperationOptions(
  options: OperationOptions = {},
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
    throw new Error(NO_PACKAGE_MANAGER_DETECTED_ERROR_MSG);
  }

  return {
    cwd,
    silent: options.silent ?? false,
    packageManager,
    dev: options.dev ?? false,
    workspace: options.workspace,
  };
}

export function getWorkspaceArgs(
  options: Awaited<ReturnType<typeof resolveOperationOptions>>,
): string[] {
  if (!options.workspace) {
    return [];
  }

  const workspacePkg =
    typeof options.workspace === "string" && options.workspace !== ""
      ? options.workspace
      : undefined;

  if (options.packageManager.name === "pnpm") {
    return workspacePkg ? ["--dir", workspacePkg] : ["--workspace-root"];
  }

  if (options.packageManager.name === "npm") {
    return workspacePkg ? ["-w", workspacePkg] : ["--workspaces"];
  }

  if (options.packageManager.name === "yarn") {
    if (
      !options.packageManager.majorVersion ||
      options.packageManager.majorVersion === "1"
    ) {
      // Classic
      return workspacePkg ? ["-W"] : ["-W"];
    } else {
      // Berry
      return workspacePkg ? [] : [];
    }
  }

  return [];
}

export function doesDependencyExist(
  name: string,
  options: Pick<
    Awaited<ReturnType<typeof resolveOperationOptions>>,
    "cwd" | "workspace"
  >,
) {
  const require = createRequire(withTrailingSlash(options.cwd));

  try {
    const resolvedPath = require.resolve(name);

    return resolvedPath.startsWith(options.cwd);
  } catch {
    return false;
  }
}
