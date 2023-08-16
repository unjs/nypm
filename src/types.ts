export type PackageManagerName = "npm" | "yarn" | "pnpm";

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
  packageManager?: PackageManager;
  dev?: boolean;
  workspace?: string;
};
