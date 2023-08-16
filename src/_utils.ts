import { createRequire } from "node:module";
import { normalize } from "pathe";
import { withTrailingSlash } from "ufo";
import type { PackageJson } from "pkg-types";
import { readPackageJSON } from "pkg-types";
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
    command === "npm" ? [command, args] : ["corepack", [command, ...args]];

  await execa(execaArgs[0], execaArgs[1], {
    cwd: resolve(options.cwd || process.cwd()),
    stdio: options.silent ? "ignore" : "inherit",
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
    if (options.packageManager.name === "pnpm") {
      return ["-w"];
    }

    if (
      options.packageManager.name === "yarn" &&
      options.packageManager.majorVersion === "1"
    ) {
      return ["-W"];
    }

    return [];
  }

  switch (options.packageManager.name) {
    case "npm": {
      return ["-w", options.workspace];
    }

    case "pnpm": {
      return ["-F", options.workspace];
    }

    case "yarn": {
      return ["workspace", options.workspace];
    }
  }
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

export async function fetchNpmPackageInfo(
  packageName: string,
  tagOrVersion: string,
): Promise<PackageJson> {
  const { $fetch } = await import("ofetch");
  const response = await $fetch(
    `https://registry.npmjs.org/${packageName}/${tagOrVersion}`,
  ).catch((error) => {
    throw new Error(
      `Cannot fetch package info for ${packageName}@${tagOrVersion} from NPM registry:`,
      error,
    );
  });
  if (response && response.data && response.data.version) {
    return response;
  } else {
    throw new Error(
      `Error fetching latest version for ${packageName}: Invalid response: ${JSON.stringify(
        response,
      )}`,
    );
  }
}

export async function getLocalDependencyConstraint(
  name: string,
  cwd: string = process.cwd(),
): Promise<
  | undefined
  | {
      constraint: string;
      type?: "dependencies" | "devDependencies" | "peerDependencies";
    }
> {
  const packageJson = await readPackageJSON(cwd);
  if (!packageJson) {
    return;
  }

  for (const type of [
    "dependencies",
    "devDependencies",
    "peerDependencies",
  ] as const) {
    const _type = packageJson[type];
    if (!_type || !_type[name]) {
      continue;
    }
    return { constraint: _type[name], type };
  }
}
