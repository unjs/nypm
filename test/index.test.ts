import { fileURLToPath } from "node:url";
import { expect, it, describe } from "vitest";
import { detectPackageManager, addDependency, removeDependency } from "../src";

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
      it("addDependency", async () => {
        expect(
          await addDependency("pathe", {
            cwd: fixtureDirectory,
            silent: false,
            workspace: true,
          })
        ).toBeTruthy();
      }, 30_000);
      it("removeDependency", async () => {
        expect(
          await removeDependency("pathe", {
            cwd: fixtureDirectory,
            silent: false,
          })
        ).toBeTruthy();
      }, 30_000);
    });
  }
});
