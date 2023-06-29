type PackageManagerName = "npm" | "yarn" | "pnpm";

export type PackageManager = {
  name: PackageManagerName;
  command: string;
  version?: string;
  majorVersion?: string;
  lockFile?: string;
  files?: string[];
};
