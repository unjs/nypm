import { expect, it, describe } from "vitest";
import { resolveOperationOptions } from "../src/_utils";

describe("internal utils", () => {
  describe("resolveOperationOptions", () => {
    it("resolved package manager by name", async () => {
      const r = await resolveOperationOptions({ packageManager: "yarn" });
      expect(r.packageManager.name).toBe("yarn");
    });
  });
});
