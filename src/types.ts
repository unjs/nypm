export type PackageManagerName = "npm" | "yarn" | "pnpm"

export interface DetectPackageManagerOptions {
  /**
   * Whether to ignore the lock file
   *
   * @default false
   */
  ignoreLockFile?: boolean

  /**
   * Whether to ignore the package.json file
   *
   * @default false
   */
  ignorePackageJSON?: boolean
}

export interface APICallOptions {
  /**
   * The directory to run the command in
   *
   * @default process.cwd()
   */
  cwd: string

  /**
   * Whether to run the command in silent mode
   *
   * @default false
   */
  silent: boolean

  /**
   * The package manager to use
   *
   * @example "npm" | "yarn" | "pnpm"
   */
  packageManager: PackageManagerName
}

export interface DepApiCallOptions extends Partial<APICallOptions> {
  /**
   * Shortcut to install as a dev dependency
   *
   * @default false
   */
  dev?: boolean
}

export interface RunCommandOptions {
  /**
   * The current working directory to run the command
   *
   * @default process.cwd()
   */
  cwd?: string

  /**
   * Whether to run the command in silent mode
   *
   * @default false
   */
  silent?: boolean
}
