import { createRequire } from "node:module";
import { normalize, resolve } from "pathe";
import { x } from "tinyexec";
import type {
  OperationOptions,
  PackageManager,
  PackageManagerName,
} from "./types.ts";
import type { DetectPackageManagerOptions } from "./package-manager.ts";
import { detectPackageManager, packageManagers } from "./package-manager.ts";

export async function findup<T>(
  cwd: string,
  match: (path: string) => T | Promise<T>,
  options: Pick<DetectPackageManagerOptions, "includeParentDirs"> = {},
): Promise<T | undefined> {
  const segments = normalize(cwd).split("/");

  while (segments.length > 0) {
    const path = segments.join("/") || "/";
    const result = await match(path);

    if (result || !options.includeParentDirs) {
      return result;
    }

    segments.pop();
  }
}

function cached<T>(fn: () => Promise<T>): () => T | Promise<T> {
  let v: T | Promise<T> | undefined;
  return () => {
    if (v === undefined) {
      v = fn().then((r) => {
        v = r;
        return v;
      });
    }
    return v;
  };
}

const hasCorepack = cached(async () => {
  if (globalThis.process?.versions?.webcontainer) {
    return false;
  }
  try {
    const { exitCode } = await x("corepack", ["--version"]);
    return exitCode === 0;
  } catch {
    return false;
  }
});

export async function executeCommand(
  command: string,
  args: string[],
  options: Pick<OperationOptions, "cwd" | "env" | "silent"> = {},
): Promise<void> {
  const xArgs: [string, string[]] =
    command === "npm" ||
    command === "bun" ||
    command === "deno" ||
    !(await hasCorepack())
      ? [command, args]
      : ["corepack", [command, ...args]];

  const { exitCode, stdout, stderr } = await x(xArgs[0], xArgs[1], {
    nodeOptions: {
      cwd: resolve(options.cwd || process.cwd()),
      env: options.env,
      stdio: options.silent ? "pipe" : "inherit",
    },
  });

  if (exitCode !== 0) {
    throw new Error(
      `\`${xArgs.flat().join(" ")}\` failed.${options.silent ? ["", stdout, stderr].join("\n") : ""}`,
    );
  }
}

type NonPartial<T> = { [P in keyof T]-?: T[P] };

export const NO_PACKAGE_MANAGER_DETECTED_ERROR_MSG =
  "No package manager auto-detected.";

export async function resolveOperationOptions(
  options: OperationOptions = {},
): Promise<
  NonPartial<
    Pick<OperationOptions, "cwd" | "env" | "silent" | "dev" | "global" | "dry">
  > &
    Pick<OperationOptions, "workspace"> & {
      packageManager: PackageManager;
    }
> {
  const cwd = options.cwd || process.cwd();
  const env = { ...process.env, ...options.env } as Record<string, string>;

  const packageManager =
    (typeof options.packageManager === "string"
      ? packageManagers.find((pm) => pm.name === options.packageManager)
      : options.packageManager) ||
    (await detectPackageManager(options.cwd || process.cwd()));

  if (!packageManager) {
    throw new Error(NO_PACKAGE_MANAGER_DETECTED_ERROR_MSG);
  }

  return {
    cwd,
    env,
    silent: options.silent ?? false,
    packageManager,
    dev: options.dev ?? false,
    workspace: options.workspace,
    global: options.global ?? false,
    dry: options.dry ?? false,
  };
}

// TODO: Refactor to simplified version2
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

  // pnpm
  if (options.packageManager.name === "pnpm") {
    return workspacePkg ? ["--filter", workspacePkg] : ["--workspace-root"];
  }

  // npm
  if (options.packageManager.name === "npm") {
    return workspacePkg ? ["-w", workspacePkg] : ["--workspaces"];
  }

  if (options.packageManager.name === "yarn") {
    if (
      !options.packageManager.majorVersion ||
      options.packageManager.majorVersion === "1"
    ) {
      // Yarn classic
      return workspacePkg ? ["--cwd", workspacePkg] : ["-W"];
    } else {
      // Yarn berry
      return workspacePkg ? ["workspace", workspacePkg] : [];
    }
  }

  return [];
}

export function getWorkspaceArgs2(options: {
  workspace?: boolean | string;
  packageManager: PackageManagerName;
  yarnBerry?: boolean;
}): string[] {
  if (!options.workspace) {
    return [];
  }

  const workspacePkg =
    typeof options.workspace === "string" && options.workspace !== ""
      ? options.workspace
      : undefined;

  // pnpm
  if (options.packageManager === "pnpm") {
    return workspacePkg ? ["--filter", workspacePkg] : ["--workspace-root"];
  }

  // npm
  if (options.packageManager === "npm") {
    return workspacePkg ? ["-w", workspacePkg] : ["--workspaces"];
  }

  if (options.packageManager === "yarn") {
    if (options.yarnBerry) {
      // Yarn berry
      return workspacePkg ? ["workspace", workspacePkg] : [];
    } else {
      // Yarn classic
      return workspacePkg ? ["--cwd", workspacePkg] : ["-W"];
    }
  }

  return [];
}

export function fmtCommand(args: string[]): string {
  return args
    .filter(Boolean)
    .map((arg, i) => (i > 0 && arg.includes(" ") ? `"${arg}"` : arg))
    .join(" ");
}

export function doesDependencyExist(
  name: string,
  options: Pick<
    Awaited<ReturnType<typeof resolveOperationOptions>>,
    "cwd" | "workspace"
  >,
) {
  const require = createRequire(
    options.cwd.endsWith("/") ? options.cwd : options.cwd + "/",
  );

  try {
    const resolvedPath = require.resolve(name);

    return resolvedPath.startsWith(options.cwd);
  } catch {
    return false;
  }
}

export function parsePackageManagerField(packageManager?: string): {
  name?: PackageManagerName;
  version?: string;
  buildMeta?: string;
  warnings?: string[];
} {
  const [name, _version] = (packageManager || "").split("@");
  const [version, buildMeta] = _version?.split("+") || [];

  if (
    name &&
    name !== "-" &&
    /^(@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(name)
  ) {
    return { name: name as PackageManagerName, version, buildMeta };
  }

  const sanitized = (name || "").replace(/\W+/g, "");
  const warnings = [
    `Abnormal characters found in \`packageManager\` field, sanitizing from \`${name}\` to \`${sanitized}\``,
  ];
  return {
    name: sanitized as PackageManagerName,
    version,
    buildMeta,
    warnings,
  };
}
