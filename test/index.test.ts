import { fileURLToPath } from "node:url";
import { expect, it, describe } from "vitest";
import {
  detectPackageManager,
  addDependency,
  addDevDependency,
  removeDependency,
  removeDevDependency
} from "../src";

const resolveFixtureDirectory = (name: string) => fileURLToPath(new URL(`fixtures/${name}`, import.meta.url));

describe("detectPackageManager", () => {
  for (const pm of ["npm", "yarn", "pnpm"]) {
    describe(pm, () => {
      const fixtureDirectory = resolveFixtureDirectory(pm);
      it("should detect with lock file", async () => {
        const detected = await detectPackageManager(fixtureDirectory, { ignorePackageJSON: true });
        expect(detected).toMatchObject({ name: pm });
      });
      it("should detect with package.json", async () => {
        const detected = await detectPackageManager(fixtureDirectory, { ignoreLockFile: true });
        expect(detected).toMatchObject({ name: pm, version: expect.any(String) });
      });
    });
  }
  it("should return default", async () => {
    const fixtureDirectory = resolveFixtureDirectory("default");
    const detected = await detectPackageManager(fixtureDirectory, { ignoreLockFile: true, ignorePackageJSON: true });
    expect(detected).toMatchObject({ name: "npm", version: expect.any(String) });
  });
});

describe("api", () => {
  for (const pm of ["npm", "yarn", "pnpm"]) {
    const fixtureDirectory = resolveFixtureDirectory(pm);
    describe(pm, () => {
      it("addDependency", async () => {
        expect(await addDependency("pathe", { cwd: fixtureDirectory })).toBeTruthy();
        expect(await addDependency("ufo", { cwd: fixtureDirectory, dev: true })).toBeTruthy();
      });
      it("removeDependency", async () => {
        expect(await removeDependency("pathe", { cwd: fixtureDirectory })).toBeTruthy();
        expect(await removeDependency("ufo", { cwd: fixtureDirectory, dev: true })).toBeTruthy();
      });
    });

    describe(pm, () => {
      it("addDevDependency", async () => {
        expect(await addDevDependency("ufo", { cwd: fixtureDirectory })).toBeTruthy();
      });
      it("removeDevDependency", async () => {
        expect(await removeDevDependency("ufo", { cwd: fixtureDirectory })).toBeTruthy();
      });
    });
  }
});
