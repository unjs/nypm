import { fileURLToPath } from "node:url";
import { isWindows } from "std-env";
import type { PackageManagerName } from "../src";

export type Fixture = {
  name: string;
  dir: string;
  packageManager: PackageManagerName;
  majorVersion?: string;
  workspace: boolean;
};

export const fixtures = (
  [
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
    },
    {
      name: "yarn-berry-workspace",
      packageManager: "yarn",
      majorVersion: "3",
    },
  ] satisfies Partial<Fixture>[]
)
  .map((fixture) => ({
    ...fixture,
    dir: resolveFixtureDirectory(fixture.name),
    workspace: fixture.name.includes("workspace"),
  }))
  .filter((fixture) => {
    // Bun is not yet supported on Windows
    if (isWindows && fixture.packageManager === "bun") {
      return false;
    }
    return true;
  });

export function resolveFixtureDirectory(name: string) {
  return fileURLToPath(new URL(`fixtures/${name}`, import.meta.url));
}
