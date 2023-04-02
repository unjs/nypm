import { fileURLToPath } from "node:url";
import { expect, it, describe } from "vitest";
import { detectPackageManager, addDependency, getPackageInfo } from "../src";

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
  },
  {
    name: "yarn-berry",
    pm: "yarn",
  },
];

describe("getPackageInfo", () => {
  it("should get package info", async () => {
    const pkg = await getPackageInfo("pathe");
    expect(pkg._id).toBe("pathe");
  });
})

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
          version: expect.any(String),
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
          await addDependency("pathe", { cwd: fixtureDirectory })
        ).toBeTruthy();
        expect(
          await addDependency("ufo", { cwd: fixtureDirectory, dev: true })
        ).toBeTruthy();
      });
    });
  }
});
