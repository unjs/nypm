import { expect, it, describe, vi, afterAll } from "vitest";
import {
  installDependencies,
  addDependency,
  removeDependency,
  ensureDependencyInstalled,
  runScript,
  dlx,
} from "../src";
import { fixtures } from "./_shared";
import { join } from "pathe";
import { existsSync, unlinkSync, rmSync, readFileSync } from "node:fs";

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

        const testFilePath = join(fixture.dir, "test-file.txt");
        rmSync(testFilePath, { force: true });

        const executeRunScriptSpy = () =>
          runScriptSpy("test-script", {
            cwd: fixture.dir,
            silent: !process.env.DEBUG,
          });

        await executeRunScriptSpy();
        expect(runScriptSpy).toHaveReturned();

        expect(existsSync(testFilePath)).toBe(true);
      }, 60_000);

      it("runs script with env", async () => {
        const runScriptSpy = vi.fn(runScript);

        const testFilePath = join(fixture.dir, "test-file-env.txt");
        rmSync(testFilePath, { force: true });

        const executeRunScriptSpy = () =>
          runScriptSpy("test-script-env", {
            cwd: fixture.dir,
            env: { TEST_CONTENT: "test-value" },
            silent: !process.env.DEBUG,
          });

        await executeRunScriptSpy();
        expect(runScriptSpy).toHaveReturned();

        expect(readFileSync(testFilePath, "utf8")).toBe("test-value");
      }, 60_000);

      it.skipIf(fixture.name.includes("yarn-classic"))(
        "executes dlx command",
        async () => {
          const dlxSpy = vi.fn(dlx);

          const executeDlxSpy = () =>
            dlxSpy("cowsay", {
              cwd: fixture.dir,
              silent: !process.env.DEBUG,
              args: ["Hello from dlx test!"],
            });

          await executeDlxSpy();
          expect(dlxSpy).toHaveReturned();
        },
        60_000,
      );

      it.skipIf(fixture.name.includes("yarn-classic"))(
        "executes dlx command with env",
        async () => {
          const dlxSpy = vi.fn(dlx);

          const executeDlxSpy = () =>
            dlxSpy("envinfo", {
              cwd: fixture.dir,
              env: {
                CUSTOM_TEST_VAR: "dlx-test-success",
                NODE_ENV: "test",
              },
              silent: !process.env.DEBUG,
              args: ["--json"],
            });

          await executeDlxSpy();
          expect(dlxSpy).toHaveReturned();
        },
        60_000,
      );
    });
  }

  afterAll(() => {
    for (const fixture of fixtures.filter((f) => !f.workspace)) {
      const testFilePath = join(fixture.dir, "test-file.txt");
      const testFileEnvPath = join(fixture.dir, "test-file-env.txt");

      if (existsSync(testFilePath)) {
        unlinkSync(testFilePath);
      }
      if (existsSync(testFileEnvPath)) {
        unlinkSync(testFileEnvPath);
      }
    }
  });
});
