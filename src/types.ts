export type PackageManagerName = "npm" | "yarn" | "pnpm" |  "yarn@berry";

export interface PackageManager {
    name: PackageManagerName;
    command: string;
    lockFile?: string;
    version?: string;
}
