#!/usr/bin/env node
import { defineCommand, runMain, ArgsDef } from "citty";
import pkg from "../package.json";
import { addDependency, installDependencies, removeDependency } from "./api";

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

const main = defineCommand({
  meta: {
    name: pkg.name,
    version: pkg.version,
    description: pkg.description,
  },
  subCommands: {
    install,
    i: install,
    add: install,
    remove,
  },
});

runMain(main);
