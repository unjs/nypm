import { expect, it, describe } from "vitest";
import { detectPackageManager } from "../src/index.ts";
import { fixtures } from "./_shared.ts";

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
});
