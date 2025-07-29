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
      add: "npm install name",
      addShort: "npm i name",
      addDev: "npm install -D name",
      addGlobal: "npm install -g name",
      addWorkspace: "npm install -w workspace name",
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
      add: "yarn add name",
      addShort: "yarn add name",
      addDev: "yarn add -D name",
      addGlobal: "yarn global add name",
      addWorkspace: "yarn --cwd workspace add name",
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
      add: "pnpm add name",
      addShort: "pnpm add name",
      addDev: "pnpm add -D name",
      addGlobal: "pnpm add -g name",
      addWorkspace: "pnpm add --filter workspace name",
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
      add: "bun add name",
      addShort: "bun add name",
      addDev: "bun add -D name",
      addGlobal: "bun add -g name",
      addWorkspace: "bun add name", // TODO: workspace not supported
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
      add: "deno add npm:name",
      addShort: "deno add npm:name",
      addDev: "deno add -D npm:name",
      addGlobal: "deno add -g npm:name",
      addWorkspace: "deno add npm:name", // TODO: workspace not supported
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
      it(fixture.packageManager, () => {
        expect(addDependencyCommand(fixture.packageManager, "name")).toBe(
          fixture.commands.add,
        );

        expect(
          addDependencyCommand(fixture.packageManager, "name", { short: true }),
        ).toBe(fixture.commands.addShort);

        expect(
          addDependencyCommand(fixture.packageManager, "name", { dev: true }),
          "dev",
        ).toBe(fixture.commands.addDev);

        expect(
          addDependencyCommand(fixture.packageManager, "name", {
            global: true,
          }),
          "global",
        ).toBe(fixture.commands.addGlobal);

        expect(
          addDependencyCommand(fixture.packageManager, "name", {
            workspace: "workspace",
          }),
          "workspace",
        ).toBe(fixture.commands.addWorkspace);
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
