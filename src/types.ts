export type PackageManagerName = "npm" | "yarn" | "pnpm";

export interface PackageManager {
  name: PackageManagerName;
  command: string;
  version?: string;
  majorVersion?: string;
  lockFile?: string;
  files?: string[];
}

export interface PackageMaintainer {
  name: string;
  email: string;
}

export interface Package {
  _id: string;
  _rev: string;
  time: Record<string, string>;
  name: string;
  versions: Record<string, Record<string, unknown>>;
  maintainers: PackageMaintainer[]
  readme: string;
  readmeFilename: string;
  description: string;
  homepage: string;
  repository: string;
  license: string;
}
