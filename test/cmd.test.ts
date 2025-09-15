import { describe, expect, it } from "vitest";
import {
  addDependencyCommand,
  installDependenciesCommand,
  runScriptCommand,
  dlxCommand,
} from "../src";

const fixtures = [
  {
    name: "npm",
    packageManager: "npm",
    opts: {},
    commands: {
      install: "npm install",
      installShort: "npm i",
      installFrozen: "npm ci",
      add: "npm install name",
      addShort: "npm i name",
      addDev: "npm install --dev name",
      addGlobal: "npm install -g name",
      addWorkspace: "npm install -w workspace name",
      runScript: "npm run test --arg",
      dlx: "npm dlx test --arg",
      dlxShort: "npx test --arg",
      dlxWithPkg: "npm dlx --package=dep1 --package=dep2 test --arg",
      dlxWithPkgShort: "npx -p=dep1 -p=dep2 test --arg",
    },
  },
  {
    name: "pnpm",
    packageManager: "pnpm",
    opts: {},
    commands: {
      install: "pnpm install",
      installShort: "pnpm i",
      installFrozen: "pnpm install --frozen-lockfile",
      add: "pnpm add name",
      addShort: "pnpm add name",
      addDev: "pnpm add --dev name",
      addGlobal: "pnpm add -g name",
      addWorkspace: "pnpm add --filter workspace name",
      runScript: "pnpm run test --arg",
      dlx: "pnpm dlx test --arg",
      dlxShort: "pnpx test --arg",
      dlxWithPkg: "pnpm dlx --package=dep1 --package=dep2 test --arg",
      dlxWithPkgShort: "pnpx --package=dep1 --package=dep2 test --arg",
    },
  },
  {
    name: "bun",
    packageManager: "bun",
    opts: {},
    commands: {
      install: "bun install",
      installShort: "bun i",
      installFrozen: "bun install --frozen-lockfile",
      add: "bun add name",
      addShort: "bun add name",
      addDev: "bun add --dev name",
      addGlobal: "bun add -g name",
      addWorkspace: "bun add name", // TODO: workspace not supported
      runScript: "bun run test --arg",
      dlx: "bun x test --arg",
      dlxShort: "bunx test --arg",
      dlxWithPkg: "bun x --package=dep1 --package=dep2 test --arg",
      dlxWithPkgShort: "bunx --package=dep1 --package=dep2 test --arg",
    },
  },
  {
    name: "deno",
    packageManager: "deno",
    opts: {},
    commands: {
      install: "deno install",
      installShort: "deno i",
      installFrozen: "deno install --frozen",
      add: "deno add npm:name",
      addShort: "deno add npm:name",
      addDev: "deno add --dev npm:name",
      addGlobal: "deno add -g npm:name",
      addWorkspace: "deno add npm:name", // TODO: workspace not supported
      runScript: "deno task test --arg",
      dlx: "deno run -A npm:test --arg",
      dlxShort: "deno run -A npm:test --arg",
      dlxWithPkg: "deno run -A --package=test --package=dep2 test --arg",
      dlxWithPkgShort: "deno run -A --package=test --package=dep2 test --arg",
    },
  },
  {
    name: "yarn classic",
    packageManager: "yarn",
    opts: {},
    commands: {
      install: "yarn install",
      installShort: "yarn i",
      installFrozen: "yarn install --immutable",
      add: "yarn add name",
      addShort: "yarn add name",
      addDev: "yarn add --dev name",
      addGlobal: "yarn global add name",
      addWorkspace: "yarn --cwd workspace add name",
      runScript: "yarn run test --arg",
      dlx: "yarn dlx test --arg",
      dlxShort: "yarn dlx test --arg",
      dlxWithPkg: "yarn dlx --package=dep1 --package=dep2 test --arg",
      dlxWithPkgShort: "yarn dlx -p=dep1 -p=dep2 test --arg",
    },
  },
  {
    name: "yarn berry",
    packageManager: "yarn",
    opts: { yarnBerry: true },
    commands: {
      install: "yarn install",
      installShort: "yarn i",
      installFrozen: "yarn install --immutable",
      add: "yarn add name",
      addShort: "yarn add name",
      addDev: "yarn add --dev name",
      addGlobal: "yarn add name", // TODO: global not supported in berry
      addWorkspace: "yarn workspace workspace add name",
      runScript: "yarn run test --arg",
      dlx: "yarn dlx test --arg",
      dlxShort: "yarn dlx test --arg",
      dlxWithPkg: "yarn dlx --package=dep1 --package=dep2 test --arg",
      dlxWithPkgShort: "yarn dlx -p=dep1 -p=dep2 test --arg",
    },
  },
] as const;

describe("commands", () => {
  describe("installDependenciesCommand", () => {
    for (const fixture of fixtures) {
      it(fixture.name, () => {
        expect(installDependenciesCommand(fixture.packageManager)).toBe(
          fixture.commands.install,
        );

        expect(
          installDependenciesCommand(fixture.packageManager, { short: true }),
          "shortCommand",
        ).toBe(fixture.commands.installShort);

        expect(
          installDependenciesCommand(fixture.packageManager, {
            frozenLockFile: true,
          }),
          "frozenLockFile",
        ).toBe(fixture.commands.installFrozen);
      });
    }
  });

  describe("addDependencyCommand", () => {
    for (const fixture of fixtures) {
      it(fixture.name, () => {
        expect(
          addDependencyCommand(fixture.packageManager, "name", fixture.opts),
        ).toBe(fixture.commands.add);

        expect(
          addDependencyCommand(fixture.packageManager, "name", {
            ...fixture.opts,
            short: true,
          }),
        ).toBe(fixture.commands.addShort);

        expect(
          addDependencyCommand(fixture.packageManager, "name", {
            ...fixture.opts,
            dev: true,
          }),
          "dev",
        ).toBe(fixture.commands.addDev);

        expect(
          addDependencyCommand(fixture.packageManager, "name", {
            ...fixture.opts,
            global: true,
          }),
          "global",
        ).toBe(fixture.commands.addGlobal);

        expect(
          addDependencyCommand(fixture.packageManager, "name", {
            ...fixture.opts,
            workspace: "workspace",
          }),
          "workspace",
        ).toBe(fixture.commands.addWorkspace);
      });
    }
  });

  describe("runScriptCommand", () => {
    for (const fixture of fixtures) {
      it(fixture.name, () => {
        expect(
          runScriptCommand(fixture.packageManager, "test", {
            ...fixture.opts,
            args: ["--arg"],
          }),
        ).toBe(fixture.commands.runScript);
      });
    }
  });

  describe("dlxCommand", () => {
    for (const fixture of fixtures) {
      it(fixture.name, () => {
        expect(
          dlxCommand(fixture.packageManager, "test", {
            ...fixture.opts,
            args: ["--arg"],
          }),
        ).toBe(fixture.commands.dlx);

        expect(
          dlxCommand(fixture.packageManager, "test", {
            ...fixture.opts,
            args: ["--arg"],
            short: true,
          }),
        ).toBe(fixture.commands.dlxShort);

        if (fixture.name !== "deno") {
          expect(
            dlxCommand(fixture.packageManager, "test", {
              ...fixture.opts,
              args: ["--arg"],
              packages: ["dep1", "dep2"],
            }),
          ).toBe(fixture.commands.dlxWithPkg);

          expect(
            dlxCommand(fixture.packageManager, "test", {
              ...fixture.opts,
              args: ["--arg"],
              packages: ["dep1", "dep2"],
              short: true,
            }),
          ).toBe(fixture.commands.dlxWithPkgShort);
        }
      });
    }
  });
});
