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

export type PackageInfo = {
  name: string;
  version: string;
  description?: string;
  license?: string;
  homepage?: string;
  repository?: { type?: string; url?: string } | string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  dist?: { tarball: string; shasum: string; integrity?: string };
  versions?: string[];
  distTags?: Record<string, string>;
};

export type GetPackageInfoOptions = {
  registry?: string;
};
