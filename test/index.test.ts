import { fileURLToPath } from "node:url";
import { expect, it, describe, vi } from "vitest";
import { installDependencies, addDependency, removeDependency } from "../src";
import { detectPackageManager } from "../src/utils/detect-package-manager";

const resolveFixtureDirectory = (name: string) =>
  fileURLToPath(new URL(`fixtures/${name}`, import.meta.url));

const fixtures = [
  {
    name: "npm",
    pm: "npm",
  },
  {
    name: "pnpm",
    pm: "pnpm",
  },
  {
    name: "yarn-classic",
    pm: "yarn",
    majorVersion: "1",
  },
  {
    name: "yarn-berry",
    pm: "yarn",
    majorVersion: "3",
  },
];

describe("detectPackageManager", () => {
  for (const fixture of fixtures) {
    describe(fixture.name, () => {
      const fixtureDirectory = resolveFixtureDirectory(fixture.name);

      it("should detect with lock file", async () => {
        const detected = await detectPackageManager(fixtureDirectory, {
          ignorePackageJSON: true,
        });

        expect(detected).toMatchObject({ name: fixture.pm });
      });

      it("should detect with package.json", async () => {
        const detected = await detectPackageManager(fixtureDirectory, {
          ignoreLockFile: true,
        });

        expect(detected).toMatchObject({
          name: fixture.pm,
          majorVersion: fixture.majorVersion || expect.any(String),
        });
      });
    });
  }
});

describe("api", () => {
  for (const fixture of fixtures) {
    describe(fixture.name, () => {
      const fixtureDirectory = resolveFixtureDirectory(fixture.name);

      it("installDependencies", async () => {
        const installDependenciesSpy = vi.fn(installDependencies);

        await installDependenciesSpy({
          cwd: fixtureDirectory,
          silent: false,
        });

        expect(installDependenciesSpy).toHaveReturned();
      }, 30_000);

      it("addDependency", async () => {
        const addDependencySpy = vi.fn(addDependency);

        await addDependencySpy("pathe", {
          cwd: fixtureDirectory,
          silent: false,
          workspace: "workspace-a",
        });

        expect(addDependencySpy).toHaveReturned();
      }, 30_000);

      it("removeDependency", async () => {
        const removeDependencySpy = vi.fn(removeDependency);

        await removeDependencySpy("pathe", {
          cwd: fixtureDirectory,
          silent: false,
          workspace: "workspace-a",
        });

        expect(removeDependencySpy).toHaveReturned();
      }, 30_000);
    });
  }
});
