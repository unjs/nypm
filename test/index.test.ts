import { fileURLToPath } from "node:url";
import { expect, it, describe, vi } from "vitest";
import { isWindows } from "std-env";
import {
  installDependencies,
  addDependency,
  removeDependency,
  PackageManagerName,
  ensureDependencyInstalled,
  detectPackageManager,
} from "../src";
import { NO_PACKAGE_MANAGER_DETECTED_ERROR_MSG } from "../src/_utils";

const resolveFixtureDirectory = (name: string) =>
  fileURLToPath(new URL(`fixtures/${name}`, import.meta.url));

type Fixture = {
  name: string;
  packageManager?: PackageManagerName;
  majorVersion?: string;
};

const fixtures = [
  {
    name: "empty",
    packageManager: "pnpm",
  },
  {
    name: "bun",
    packageManager: "bun",
  },
  {
    name: "bun-workspace",
    packageManager: "bun",
  },
  {
    name: "npm",
    packageManager: "npm",
  },
  {
    name: "npm-workspace",
    packageManager: "npm",
  },
  {
    name: "pnpm",
    packageManager: "pnpm",
  },
  {
    name: "pnpm-workspace",
    packageManager: "pnpm",
  },
  {
    name: "yarn-classic",
    packageManager: "yarn",
    majorVersion: "1",
  },
  {
    name: "yarn-classic-workspace",
    packageManager: "yarn",
    majorVersion: "1",
  },
  {
    name: "yarn-berry-workspace",
    packageManager: "yarn",
    majorVersion: "3",
  },
  {
    name: "yarn-berry-workspace",
    packageManager: "yarn",
    majorVersion: "3",
  },
] as const satisfies readonly Fixture[];

describe("detectPackageManager", () => {
  for (const fixture of fixtures) {
    describe(fixture.name, () => {
      const fixtureDirectory = resolveFixtureDirectory(fixture.name);

      if (fixture.name === "empty") {
        it("should detect in parent directory", async () => {
          const detected = await detectPackageManager(fixtureDirectory, {
            includeParentDirs: true,
          });

          expect(detected).toMatchObject({ name: fixture.packageManager });
        });
      }

      it("should detect with package.json", async () => {
        const detected = await detectPackageManager(fixtureDirectory, {
          ignoreLockFile: true,
        });

        switch (fixture.name) {
          case "empty": {
            expect(detected).toBe(undefined);

            break;
          }

          case "npm":
          case "pnpm": {
            expect(detected).toMatchObject({
              name: fixture.packageManager,
              majorVersion: expect.any(String),
            });

            break;
          }

          case "yarn-berry":
          case "yarn-classic": {
            expect(detected).toMatchObject({
              name: fixture.packageManager,
              majorVersion: fixture.majorVersion,
            });

            break;
          }
        }
      });

      it("should detect with lock file", async () => {
        const detected = await detectPackageManager(fixtureDirectory, {
          ignorePackageJSON: true,
        });

        switch (fixture.name) {
          case "empty": {
            expect(detected).toBe(undefined);

            break;
          }

          case "npm":
          case "pnpm":
          case "yarn-berry":
          case "yarn-classic": {
            expect(detected).toMatchObject({ name: fixture.packageManager });

            break;
          }
        }
      });
    });
  }
});

describe("api", () => {
  for (const fixture of fixtures) {
    // bun is not yet supported on Windows
    if (isWindows && fixture.name === "bun") {
      continue;
    }

    describe(fixture.name, () => {
      const fixtureDirectory = resolveFixtureDirectory(fixture.name);
      const isWorkspace = fixture.name.includes("workspace");

      if (isWorkspace) {
        it("adds dependency to the workspace root", async () => {
          const addDependencySpy = vi.fn(addDependency);
          const executeAddDependencySpy = () =>
            addDependencySpy("pathe", {
              cwd: fixtureDirectory,
              silent: !process.env.DEBUG,
              workspace: true,
            });
          await executeAddDependencySpy();
          expect(addDependencySpy).toHaveReturned();
        }, 30_000);

        it("removes dependency from workspace root", async () => {
          const removeDependencySpy = vi.fn(removeDependency);
          const executeRemoveDependencySpy = () =>
            removeDependencySpy("pathe", {
              cwd: fixtureDirectory,
              silent: !process.env.DEBUG,
              workspace: true,
            });
          await executeRemoveDependencySpy();
          expect(removeDependencySpy).toHaveReturned();
        }, 30_000);

        const workspaceRef =
          fixture.name === "yarn-classic-workspace"
            ? "./packages/workspace-a"
            : "workspace-a";

        it("adds dependency to workspace package", async () => {
          const addDependencySpy = vi.fn(addDependency);
          const executeAddDependencySpy = () =>
            addDependencySpy("ufo", {
              cwd: fixtureDirectory,
              silent: !process.env.DEBUG,
              workspace: workspaceRef,
            });
          await executeAddDependencySpy();
          expect(addDependencySpy).toHaveReturned();
        }, 30_000);

        it("removes dependency from workspace package", async () => {
          const removeDependencySpy = vi.fn(removeDependency);
          const executeRemoveDependencySpy = () =>
            removeDependencySpy("ufo", {
              cwd: fixtureDirectory,
              silent: !process.env.DEBUG,
              workspace: workspaceRef,
            });
          await executeRemoveDependencySpy();
          expect(removeDependencySpy).toHaveReturned();
        }, 30_000);
      } else {
        it("installs dependencies", async () => {
          const installDependenciesSpy = vi.fn(installDependencies);

          const executeInstallDependenciesSpy = () =>
            installDependenciesSpy({
              cwd: fixtureDirectory,
              silent: !process.env.DEBUG,
            });

          if (fixture.name === "empty") {
            expect(
              async () => await executeInstallDependenciesSpy(),
            ).rejects.toThrowError(NO_PACKAGE_MANAGER_DETECTED_ERROR_MSG);
          } else {
            await executeInstallDependenciesSpy();

            expect(installDependenciesSpy).toHaveReturned();
          }
        }, 30_000);

        it("adds dependency", async () => {
          const addDependencySpy = vi.fn(addDependency);

          const executeAddDependencySpy = () =>
            addDependencySpy("pathe", {
              cwd: fixtureDirectory,
              silent: !process.env.DEBUG,
            });

          if (fixture.name === "empty") {
            expect(
              async () => await executeAddDependencySpy(),
            ).rejects.toThrowError(NO_PACKAGE_MANAGER_DETECTED_ERROR_MSG);
          } else {
            await executeAddDependencySpy();

            expect(addDependencySpy).toHaveReturned();
          }
        }, 30_000);

        it("ensures dependency is installed", async () => {
          const ensureDependencyInstalledSpy = vi.fn(ensureDependencyInstalled);

          const executeEnsureDependencyInstalledSpy = () =>
            ensureDependencyInstalledSpy("pathe", {
              cwd: fixtureDirectory,
            });

          if (fixture.name === "empty") {
            expect(
              async () => await executeEnsureDependencyInstalledSpy(),
            ).rejects.toThrowError(NO_PACKAGE_MANAGER_DETECTED_ERROR_MSG);
          } else {
            await executeEnsureDependencyInstalledSpy();

            expect(ensureDependencyInstalledSpy).toHaveReturned();
          }
        });

        it("removes dependency", async () => {
          const removeDependencySpy = vi.fn(removeDependency);

          const executeRemoveDependencySpy = () =>
            removeDependencySpy("pathe", {
              cwd: fixtureDirectory,
              silent: !process.env.DEBUG,
            });

          if (fixture.name === "empty") {
            expect(
              async () => await executeRemoveDependencySpy(),
            ).rejects.toThrowError(NO_PACKAGE_MANAGER_DETECTED_ERROR_MSG);
          } else {
            await executeRemoveDependencySpy();

            expect(removeDependencySpy).toHaveReturned();
          }
        }, 30_000);
      }
    });
  }
});
