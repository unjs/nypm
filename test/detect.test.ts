import { expect, it, describe } from "vitest";
import { detectPackageManager } from "../src/index.ts";
import { fixtures, resolveFixtureDirectory } from "./_shared.ts";

describe("detectPackageManager", () => {
  for (const fixture of fixtures) {
    describe(fixture.name, () => {
      it("should detect with package.json", async () => {
        const detected = await detectPackageManager(fixture.dir, {
          ignoreLockFile: true,
        });
        expect(detected?.name).toBe(fixture.packageManager);
        if (fixture.majorVersion) {
          expect(detected?.majorVersion).toBe(fixture.majorVersion);
        }
        if (fixture.files) {
          expect(detected?.files).toEqual(fixture.files);
        }
      });

      it.skipIf(fixture.name.includes("berry") /* TODO */)(
        "should detect with lock file",
        async () => {
          const detected = await detectPackageManager(fixture.dir, {
            ignorePackageJSON: true,
          });
          expect(detected?.name).toBe(fixture.packageManager);
          if (fixture.majorVersion) {
            expect(detected?.majorVersion).toBe(fixture.majorVersion);
          }
        },
      );
    });
  }

  // aube is not executed in CI, so it is kept out of the shared fixtures
  // (which run real package manager binaries) and tested standalone here.
  describe("aube", () => {
    const dir = resolveFixtureDirectory("aube");

    it("should detect with package.json", async () => {
      const detected = await detectPackageManager(dir, { ignoreLockFile: true });
      expect(detected?.name).toBe("aube");
    });

    it("should detect with lock file", async () => {
      const detected = await detectPackageManager(dir, { ignorePackageJSON: true });
      expect(detected?.name).toBe("aube");
    });
  });
});
