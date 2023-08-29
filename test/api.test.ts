import { expect, it, describe, vi } from "vitest";
import {
  installDependencies,
  addDependency,
  removeDependency,
  ensureDependencyInstalled,
} from "../src";
import { fixtures } from "./_shared";

describe("api (workspace)", () => {
  for (const fixture of fixtures.filter((f) => !f.workspace)) {
    describe(fixture.name, () => {
      it("installs dependencies", async () => {
        const installDependenciesSpy = vi.fn(installDependencies);
        const executeInstallDependenciesSpy = () =>
          installDependenciesSpy({
            cwd: fixture.dir,
            silent: !process.env.DEBUG,
          });
        await executeInstallDependenciesSpy();
        expect(installDependenciesSpy).toHaveReturned();
      }, 30_000);

      it("adds dependency", async () => {
        const addDependencySpy = vi.fn(addDependency);
        const executeAddDependencySpy = () =>
          addDependencySpy("pathe", {
            cwd: fixture.dir,
            silent: !process.env.DEBUG,
          });

        await executeAddDependencySpy();
        expect(addDependencySpy).toHaveReturned();
      }, 30_000);

      it("ensures dependency is installed", async () => {
        const ensureDependencyInstalledSpy = vi.fn(ensureDependencyInstalled);

        const executeEnsureDependencyInstalledSpy = () =>
          ensureDependencyInstalledSpy("pathe", {
            cwd: fixture.dir,
          });

        await executeEnsureDependencyInstalledSpy();
        expect(ensureDependencyInstalledSpy).toHaveReturned();
      });

      it("removes dependency", async () => {
        const removeDependencySpy = vi.fn(removeDependency);

        const executeRemoveDependencySpy = () =>
          removeDependencySpy("pathe", {
            cwd: fixture.dir,
            silent: !process.env.DEBUG,
          });

        await executeRemoveDependencySpy();
        expect(removeDependencySpy).toHaveReturned();
      }, 30_000);
    });
  }
});
