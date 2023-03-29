export type PackageManagerName = "npm" | "yarn" | "pnpm";

export interface PackageManager {
  name: PackageManagerName;
  command: string;
  version?: string;
  majorVersion?: string;
  lockFile?: string;
  files?: string[];
}
