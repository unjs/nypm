#!/usr/bin/env node
import { defineCommand, runMain, ArgsDef } from "citty";
import { resolve } from "pathe";
import { consola } from "consola";
import { name, version, description } from "../package.json";
import { addDependency, installDependencies, removeDependency } from "./api";
import { detectPackageManager } from "./package-manager";

const operationArgs = {
  cwd: {
    type: "string",
    description: "Current working directory",
  },
  workspace: {
    type: "boolean",
    description: "Add to workspace",
  },
  silent: {
    type: "boolean",
    description: "Run in silent mode",
  },
} as const satisfies ArgsDef;

const install = defineCommand({
  meta: {
    description: "Install dependencies",
  },
  args: {
    ...operationArgs,
    name: {
      type: "positional",
      description: "Dependency name",
      required: false,
    },
    dev: {
      type: "boolean",
      alias: "D",
      description: "Add as dev dependency",
    },
    global: {
      type: "boolean",
      alias: "g",
      description: "Add globally",
    },
    "frozen-lockfile": {
      type: "boolean",
      description: "Install dependencies with frozen lock file",
    },
  },
  run: async ({ args }) => {
    await (args._.length > 0
      ? addDependency(args._, args)
      : installDependencies(args));
  },
});

const remove = defineCommand({
  meta: {
    description: "Remove dependencies",
  },
  args: {
    name: {
      type: "positional",
      description: "Dependency name",
      required: true,
    },
    ...operationArgs,
  },
  run: async ({ args }) => {
    await removeDependency(args.name, args);
  },
});

const detect = defineCommand({
  meta: {
    description: "Detect the current package manager",
  },
  args: {
    cwd: {
      type: "string",
      description: "Current working directory",
    },
  },
  run: async ({ args }) => {
    const cwd = resolve(args.cwd || ".");
    const packageManager = await detectPackageManager(cwd);
    if (!packageManager) {
      consola.error(`Cannot detect package manager in \`${cwd}\``);
      return process.exit(1);
    }
    consola.log(
      `Detected package manager in \`${cwd}\`: \`${packageManager.name}@${packageManager.version}\``,
    );
  },
});

const main = defineCommand({
  meta: {
    name,
    version,
    description,
  },
  subCommands: {
    install,
    i: install,
    add: install,
    remove,
    rm: remove,
    uninstall: remove,
    un: remove,
    detect,
  },
});

runMain(main);
