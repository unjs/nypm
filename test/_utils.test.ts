import { expect, it, describe } from "vitest";
import {
  sanitizePackageManagerName,
  resolveOperationOptions,
} from "../src/_utils";

describe("internal utils", () => {
  describe("resolveOperationOptions", () => {
    it("resolved package manager by name", async () => {
      const r = await resolveOperationOptions({ packageManager: "yarn" });
      expect(r.packageManager.name).toBe("yarn");
    });
  });

  describe("parsePackageManagerName", () => {
    it("preserves valid (unknown) name", () => {
      const r = sanitizePackageManagerName("unknownName@0.0.0");
      expect(r[0]).toBe("unknownName@0.0.0");
      expect(r[1]).toMatchInlineSnapshot(`undefined`);
    });

    it("sanitize abnormal characters with warning", () => {
      const r = sanitizePackageManagerName("~^&#-!yarn@0.0.0");
      expect(r[0]).toBe("yarn@0.0.0");
      expect(r[1]).toMatchInlineSnapshot(
        `"Abnormal characters found in \`packageManager\` field, sanitizing from \`'~^&#-!yarn@0.0.0'\` to \`'yarn@0.0.0'\`"`,
      );
    });
  });
});
