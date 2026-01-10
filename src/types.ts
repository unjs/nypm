export type PackageManagerName = "npm" | "yarn" | "pnpm" | "bun" | "deno";

export type PackageManager = {
  name: PackageManagerName;
  command: string;
  version?: string;
  buildMeta?: string;
  majorVersion?: string;
  lockFile?: string | string[];
  files?: string[];
};

export type OperationOptions = {
  cwd?: string;
  env?: Record<string, string>;
  silent?: boolean;
  packageManager?: PackageManager | PackageManagerName;
  installPeerDependencies?: boolean;
  dev?: boolean;
  workspace?: boolean | string;
  global?: boolean;
  corepack?: boolean;
  /** Do not execute actual command */
  dry?: boolean;
};

export type OperationResult = {
  exec?: { command: string; args: string[] };
};
