import { fileURLToPath } from "node:url";
import * as path from "node:path";
import * as fs from "node:fs";
import { expect, it, describe, beforeAll, afterAll } from "vitest";
import { detectPackageManager, addDependency, removeDependency, sortPackageJSON, } from "../src";

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

describe("sortDependencies", () => {
    const fixtureDirectory = resolveFixtureDirectory("sort");
    const packageJsonPath = path.join(fixtureDirectory, "package.json");
    const backupPackageJsonPath = path.join(fixtureDirectory, "package.json.bak");

    beforeAll(() => {
        fs.copyFileSync(packageJsonPath, backupPackageJsonPath);
    });

    it("should sort dependencies", () => {
        const expectedPackageJson = {
            name: "not-sorted-project",
            version: "1.0.0",
            dependencies: {
                "sort-object-keys": "1.0.0",
                "sort-package-json": "1.0.0"
            }
        };
        expect(sortPackageJSON(packageJsonPath)).toBeTruthy();

        const data = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        expect(data).toStrictEqual(expectedPackageJson);
    }, 30_000);

    afterAll(() => {
        fs.renameSync(backupPackageJsonPath, packageJsonPath);
    });
});
