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
      const [name, warning] = sanitizePackageManagerName("unknownName@0.0.0");
      expect(name).toBe("unknownName@0.0.0");
      expect(warning).toMatchInlineSnapshot(`undefined`);
    });

    it("sanitize abnormal characters with warning", () => {
      const [name, warning] = sanitizePackageManagerName("~^&#-!yarn@0.0.0");
      expect(name).toBe("yarn@0.0.0");
      expect(warning).toMatchInlineSnapshot(
        `"Abnormal characters found in \`packageManager\` field, sanitizing from \`'~^&#-!yarn@0.0.0'\` to \`'yarn@0.0.0'\`"`,
      );
    });
  });
});
