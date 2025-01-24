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
    it("valid (unknown) name without warning", () => {
      const { name, warnings } = sanitizePackageManagerName("unknownName");
      expect(name).toBe("unknownName");
      expect(warnings).toMatchInlineSnapshot(`[]`);
    });

    it("sanitize abnormal characters with warning", () => {
      const { name, warnings } = sanitizePackageManagerName("~^&#-!yarn");
      expect(name).toBe("yarn");
      expect(warnings).toMatchInlineSnapshot(
        `
        [
          "Abnormal characters found in \`packageManager\` field, sanitizing from \`'~^&#-!yarn'\` to \`'yarn'\`",
        ]
      `,
      );
    });
  });
});
