import { afterAll, beforeAll, expect, it, describe } from "vitest";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  parsePackageManagerField,
  readInstalledPackageJSON,
  readPackageJSONFromResolver,
  resolveOperationOptions,
} from "../src/_utils.ts";

describe("internal utils", () => {
  describe("readInstalledPackageJSON", () => {
    let root!: string;

    beforeAll(() => {
      root = mkdtempSync(join(tmpdir(), "nypm-test-"));
      mkdirSync(join(root, "project", "src"), { recursive: true });

      // scoped pure-ESM package whose `exports` only defines an `import`
      // condition - `ERR_PACKAGE_PATH_NOT_EXPORTED` from require.resolve
      const esmOnlyPkgDir = join(root, "project", "node_modules", "@scope", "esm-only");
      mkdirSync(esmOnlyPkgDir, { recursive: true });
      writeFileSync(
        join(esmOnlyPkgDir, "package.json"),
        JSON.stringify({
          name: "@scope/esm-only",
          version: "1.0.0",
          type: "module",
          exports: {
            ".": {
              types: "./dist/index.d.mts",
              import: "./dist/index.mjs",
            },
          },
          peerDependencies: { vue: "^3.0.0" },
        }),
      );

      // regular package - unscoped, with a plain main - installed higher up
      // in the tree to cover the parent-dir walk.
      const plainPkgDir = join(root, "node_modules", "plain-pkg");
      mkdirSync(plainPkgDir, { recursive: true });
      writeFileSync(
        join(plainPkgDir, "package.json"),
        JSON.stringify({ name: "plain-pkg", version: "2.0.0", main: "./index.js" }),
      );
    });

    afterAll(() => {
      rmSync(root, { recursive: true, force: true });
    });

    it("reads package.json of a pure-ESM package without tripping on exports", async () => {
      const pkg = await readInstalledPackageJSON("@scope/esm-only", join(root, "project", "src"));
      expect(pkg?.name).toBe("@scope/esm-only");
      expect(pkg?.peerDependencies).toEqual({ vue: "^3.0.0" });
    });

    it("walks parent directories to locate a hoisted package", async () => {
      const pkg = await readInstalledPackageJSON("plain-pkg", join(root, "project", "src"));
      expect(pkg?.name).toBe("plain-pkg");
      expect(pkg?.version).toBe("2.0.0");
    });

    it("returns null when the package is not installed", async () => {
      const pkg = await readInstalledPackageJSON("does-not-exist", join(root, "project"));
      expect(pkg).toBeNull();
    });
  });

  describe("readPackageJSONFromResolver", () => {
    it("resolves a package via Node's native resolver", async () => {
      // vitest is a devDependency of this repo and has a well-formed main
      // export reachable from `createRequire`.
      const _require = createRequire(join(process.cwd(), "_.js"));
      const pkg = await readPackageJSONFromResolver(_require, "vitest");
      expect(pkg?.name).toBe("vitest");
    });

    it("returns null for an unresolvable package", async () => {
      const _require = createRequire(join(process.cwd(), "_.js"));
      const pkg = await readPackageJSONFromResolver(_require, "definitely-not-installed-xyz");
      expect(pkg).toBeNull();
    });
  });

  describe("resolveOperationOptions", () => {
    it("resolved package manager by name", async () => {
      const r = await resolveOperationOptions({ packageManager: "yarn" });
      expect(r.packageManager.name).toBe("yarn");
    });
  });

  describe("parsePackageManagerField", () => {
    const cases = {
      "": [""],
      "-": [""],
      "*": [""],
      "^npm": ["npm"],
      npm: ["npm"],
      "unknown-name": ["unknown-name"],
      unknownName: ["unknownName"],
      "npm@1.2.3": ["npm", "1.2.3"],
      "pnpm@9.15.4+sha512.b2dc20e2fc72b3e": ["pnpm", "9.15.4", "sha512.b2dc20e2fc72b3e"],
    };
    for (const [input, [name, version, buildMeta]] of Object.entries(cases)) {
      it(input, () => {
        const p = parsePackageManagerField(input);
        expect(p.name).toBe(name);
        expect(p.version).toBe(version);
        expect(p.buildMeta).toBe(buildMeta);
        if (input.split("@")[0] !== name) {
          expect(p.warnings).toMatchObject([
            `Abnormal characters found in \`packageManager\` field, sanitizing from \`${input}\` to \`${name}\``,
          ]);
        }
      });
    }
  });
});
