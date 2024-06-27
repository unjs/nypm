export type PackageManagerName = "npm" | "yarn" | "pnpm" | "bun";

export type PackageManager = {
  name: PackageManagerName;
  command: string;
  version?: string;
  majorVersion?: string;
  lockFile?: string;
  files?: string[];
};

export type OperationOptions = {
  cwd?: string;
  silent?: boolean;
  packageManager?: PackageManager | PackageManagerName;
  installPeerDependencies?: boolean;
  dev?: boolean;
  workspace?: boolean | string;
  global?: boolean;
};
