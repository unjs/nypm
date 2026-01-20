import { expect, it, describe } from "vitest";
import {
  parsePackageManagerField,
  resolveOperationOptions,
} from "../src/_utils.ts";

describe("internal utils", () => {
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
      "pnpm@9.15.4+sha512.b2dc20e2fc72b3e": [
        "pnpm",
        "9.15.4",
        "sha512.b2dc20e2fc72b3e",
      ],
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
