import { afterAll, beforeAll, expect, it, describe } from "vitest";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
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

      // nub is lockfile-compatible and has no lockfile of its own, so it is
      // only detectable via the `packageManager` field, not an implicit file.
      it.skipIf(fixture.name.includes("berry") /* TODO */ || fixture.packageManager === "nub")(
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

describe("detectPackageManager (devEngines.packageManager)", () => {
  let root!: string;

  beforeAll(() => {
    root = mkdtempSync(join(tmpdir(), "nypm-devengines-"));
  });

  afterAll(() => {
    rmSync(root, { recursive: true, force: true });
  });

  const detectFrom = async (packageJSON: unknown) => {
    const dir = mkdtempSync(join(root, "case-"));
    writeFileSync(join(dir, "package.json"), JSON.stringify(packageJSON));
    return detectPackageManager(dir, {
      ignoreLockFile: true,
      includeParentDirs: false,
    });
  };

  it("detects from a plain object entry", async () => {
    const detected = await detectFrom({
      name: "fixture",
      devEngines: { packageManager: { name: "pnpm", version: "^9.0.0" } },
    });
    expect(detected?.name).toBe("pnpm");
    expect(detected?.majorVersion).toBe("9");
    expect(detected?.lockFile).toBe("pnpm-lock.yaml");
    expect(detected?.files).toEqual(["pnpm-workspace.yaml"]);
  });

  it("detects yarn berry from the range major version", async () => {
    const detected = await detectFrom({
      name: "fixture",
      devEngines: { packageManager: { name: "yarn", version: "^4.0.0" } },
    });
    expect(detected?.name).toBe("yarn");
    expect(detected?.majorVersion).toBe("4");
  });

  it("uses the first entry when given an array", async () => {
    const detected = await detectFrom({
      name: "fixture",
      devEngines: {
        packageManager: [{ name: "bun", version: "^1.0.0" }, { name: "npm" }],
      },
    });
    expect(detected?.name).toBe("bun");
  });

  it("prefers the `packageManager` field over `devEngines`", async () => {
    const detected = await detectFrom({
      name: "fixture",
      packageManager: "npm@10.0.0",
      devEngines: { packageManager: { name: "pnpm", version: "^9.0.0" } },
    });
    expect(detected?.name).toBe("npm");
    expect(detected?.majorVersion).toBe("10");
  });
});
