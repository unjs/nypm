import { expect, it, describe, vi } from "vitest";
import {
  installDependencies,
  addDependency,
  removeDependency,
  ensureDependencyInstalled,
  runScript,
} from "../src";
import { fixtures } from "./_shared";

describe("api", () => {
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
      }, 60_000);

      it("installs dependencies with lockfile", async () => {
        const installDependenciesSpy = vi.fn(installDependencies);
        const executeInstallDependenciesSpy = () =>
          installDependenciesSpy({
            cwd: fixture.dir,
            silent: !process.env.DEBUG,
            frozenLockFile: true,
          });
        await executeInstallDependenciesSpy();
        expect(installDependenciesSpy).toHaveReturned();
      }, 60_000);

      it("adds dependency", async () => {
        const addDependencySpy = vi.fn(addDependency);
        const executeAddDependencySpy = () =>
          addDependencySpy("pathe", {
            cwd: fixture.dir,
            silent: !process.env.DEBUG,
          });

        await executeAddDependencySpy();
        expect(addDependencySpy).toHaveReturned();
      }, 60_000);

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
      }, 60_000);

      it("runs script", async () => {
        const runScriptSpy = vi.fn(runScript);

        const executeRunScriptSpy = () =>
          runScriptSpy("test-script", {
            cwd: fixture.dir,
            silent: !process.env.DEBUG,
          });

        await executeRunScriptSpy();
        expect(runScriptSpy).toHaveReturned();
      }, 60_000);
    });
  }
});
