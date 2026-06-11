import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { isWindows } from "std-env";
import type { PackageManagerName } from "../src/index.ts";

export type Fixture = {
  name: string;
  dir: string;
  packageManager: PackageManagerName;
  majorVersion?: string;
  workspace: boolean;
  files?: string[];
};

export const fixtures = (
  [
    {
      name: "deno",
      packageManager: "deno",
    },
    {
      name: "deno-workspace",
      packageManager: "deno",
    },
    {
      name: "aube",
      packageManager: "aube",
    },
    {
      name: "bun",
      packageManager: "bun",
    },
    {
      name: "bun-workspace",
      packageManager: "bun",
    },
    {
      name: "npm",
      packageManager: "npm",
    },
    {
      name: "npm-workspace",
      packageManager: "npm",
    },
    {
      name: "pnpm",
      packageManager: "pnpm",
    },
    {
      name: "pnpm-workspace",
      packageManager: "pnpm",
    },
    {
      name: "yarn-classic",
      packageManager: "yarn",
    },
    {
      name: "yarn-classic-workspace",
      packageManager: "yarn",
    },
    {
      name: "yarn-berry",
      packageManager: "yarn",
      majorVersion: "3",
      files: [".yarnrc.yml"],
    },
    {
      name: "yarn-berry-v4",
      packageManager: "yarn",
      majorVersion: "4",
    },
    {
      name: "yarn-berry-workspace",
      packageManager: "yarn",
      majorVersion: "3",
      files: [".yarnrc.yml"],
    },
  ] satisfies Partial<Fixture>[]
)
  .map((fixture) => ({
    ...fixture,
    dir: resolveFixtureDirectory(fixture.name),
    workspace: fixture.name.includes("workspace"),
  }))
  .filter((fixture) => {
    // Bun is not yet supported on Windows.
    // aube runs on Windows (the install step verifies the binary), but its
    // network-heavy fixtures are skipped there: the Windows runner already
    // times out on such install/dlx tests for npm/pnpm/deno, and adding more
    // concurrent installs only worsens that flakiness.
    if (isWindows && (fixture.packageManager === "bun" || fixture.packageManager === "aube")) {
      return false;
    }
    return true;
  });

export function resolveFixtureDirectory(name: string) {
  return fileURLToPath(new URL(`fixtures/${name}`, import.meta.url));
}

const availabilityCache = new Map<PackageManagerName, boolean>();

/**
 * Whether a package manager's CLI is installed and runnable.
 *
 * Used to skip fixtures that drive the real CLI (install/add/dlx/...) when the
 * binary is missing locally. `aube` is not provided by corepack and is only
 * installed in CI, so its tests are ignored on machines without it.
 */
export function isPackageManagerAvailable(
  packageManager: PackageManagerName,
): boolean {
  if (!availabilityCache.has(packageManager)) {
    const result = spawnSync(packageManager, ["--version"], {
      stdio: "ignore",
      shell: isWindows,
    });
    availabilityCache.set(
      packageManager,
      !result.error && result.status === 0,
    );
  }
  return availabilityCache.get(packageManager)!;
}
