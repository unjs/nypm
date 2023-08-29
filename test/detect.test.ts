import { expect, it, describe } from "vitest";
import { detectPackageManager } from "../src";
import { fixtures } from "./_shared";

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
