import { expect, it, describe, vi } from "vitest";
import { addDependency, removeDependency } from "../src";
import { fixtures } from "./_shared";

describe("api", () => {
  for (const fixture of fixtures.filter((f) => f.workspace)) {
    describe(fixture.name, () => {
      it("adds dependency to the workspace root", async () => {
        const addDependencySpy = vi.fn(addDependency);
        const executeAddDependencySpy = () =>
          addDependencySpy("pathe", {
            cwd: fixture.dir,
            silent: !process.env.DEBUG,
            workspace: true,
          });
        await executeAddDependencySpy();
        expect(addDependencySpy).toHaveReturned();
      }, 60_000);

      it("removes dependency from workspace root", async () => {
        const removeDependencySpy = vi.fn(removeDependency);
        const executeRemoveDependencySpy = () =>
          removeDependencySpy("pathe", {
            cwd: fixture.dir,
            silent: !process.env.DEBUG,
            workspace: true,
          });
        await executeRemoveDependencySpy();
        expect(removeDependencySpy).toHaveReturned();
      }, 60_000);

      const workspaceRef =
        fixture.name === "yarn-classic-workspace"
          ? "./packages/workspace-a"
          : "workspace-a";

      it("adds dependency to workspace package", async () => {
        const addDependencySpy = vi.fn(addDependency);
        const executeAddDependencySpy = () =>
          addDependencySpy("ufo", {
            cwd: fixture.dir,
            silent: !process.env.DEBUG,
            workspace: workspaceRef,
          });
        await executeAddDependencySpy();
        expect(addDependencySpy).toHaveReturned();
      }, 60_000);

      it("removes dependency from workspace package", async () => {
        const removeDependencySpy = vi.fn(removeDependency);
        const executeRemoveDependencySpy = () =>
          removeDependencySpy("ufo", {
            cwd: fixture.dir,
            silent: !process.env.DEBUG,
            workspace: workspaceRef,
          });
        await executeRemoveDependencySpy();
        expect(removeDependencySpy).toHaveReturned();
      }, 60_000);
    });
  }
});
