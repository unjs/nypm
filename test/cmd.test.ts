import { describe, expect, it } from "vitest";
import {
  addDependencyCommand,
  installDependenciesCommand,
  runScriptCommand,
  dlxCommand,
} from "../src";

const fixtures = [
  {
    packageManager: "npm",
    commands: {
      install: "npm install",
      installShort: "npm i",
      installFrozen: "npm ci",
      add: "npm install test",
      addShort: "npm i test",
      addDev: "npm install -D test",
      addGlobal: "npm install -g test",
      addWorkspace: "npm install --workspaces test",
      runScript: "npm run test --arg",
      dlx: "npm dlx test --arg",
      dlxShort: "npmx test --arg",
    },
  },
  {
    packageManager: "yarn",
    commands: {
      install: "yarn install",
      installShort: "yarn i",
      installFrozen: "yarn install --immutable",
      add: "yarn global add test",
      addShort: "yarn add test",
      addDev: "yarn add -D test",
      addGlobal: "yarn global add test",
      addWorkspace: "yarn workspace test add",
      runScript: "yarn run test --arg",
      dlx: "yarn dlx test --arg",
      dlxShort: "yarn dlx test --arg",
    },
  },
  {
    packageManager: "pnpm",
    commands: {
      install: "pnpm install",
      installShort: "pnpm i",
      installFrozen: "pnpm install --frozen-lockfile",
      add: "pnpm add test",
      addShort: "pnpm add test",
      addDev: "pnpm add -D test",
      addGlobal: "pnpm add -g test",
      addWorkspace: "pnpm --filter test add",
      runScript: "pnpm run test --arg",
      dlx: "pnpm dlx test --arg",
      dlxShort: "pnpx test --arg",
    },
  },
  {
    packageManager: "bun",
    commands: {
      install: "bun install",
      installShort: "bun i",
      installFrozen: "bun install --frozen-lockfile",
      add: "bun add test",
      addShort: "bun add test",
      addDev: "bun add -D test",
      addGlobal: "bun add -g test",
      addWorkspace: "bun workspace test add",
      runScript: "bun run test --arg",
      dlx: "bun x test --arg",
      dlxShort: "bunx test --arg",
    },
  },
  {
    packageManager: "deno",
    commands: {
      install: "deno install",
      installShort: "deno i",
      installFrozen: "deno install --frozen",
      add: "deno add npm:test",
      addShort: "deno i npm:test",
      addDev: "deno install -D npm:test",
      addGlobal: "deno install -g npm:test",
      addWorkspace: "deno install --workspace test",
      runScript: "deno task test --arg",
      dlx: "deno run -A npm:test --arg",
      dlxShort: "deno run -A npm:test --arg",
    },
  },
] as const;

describe("commands", () => {
  describe("installDependenciesCommand", () => {
    for (const fixture of fixtures) {
      it(fixture.packageManager, () => {
        expect(installDependenciesCommand(fixture.packageManager)).toBe(
          fixture.commands.install,
        );

        expect(
          installDependenciesCommand(fixture.packageManager, {
            shortCommand: true,
          }),
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
      it(fixture.packageManager, () => {
        expect(addDependencyCommand(fixture.packageManager, "test")).toBe(
          fixture.commands.add,
        );
      });
    }
  });

  describe("runScriptCommand", () => {
    for (const fixture of fixtures) {
      it(fixture.packageManager, () => {
        expect(
          runScriptCommand(fixture.packageManager, "test", {
            args: ["--arg"],
          }),
        ).toBe(fixture.commands.runScript);
      });
    }
  });

  describe("dlxCommand", () => {
    for (const fixture of fixtures) {
      it(fixture.packageManager, () => {
        expect(
          dlxCommand(fixture.packageManager, "test", {
            args: ["--arg"],
          }),
        ).toBe(fixture.commands.dlx);
      });
    }
  });
});
