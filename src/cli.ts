#!/usr/bin/env node
import { defineCommand, runMain, type ArgsDef } from "citty";
import { resolve } from "pathe";
import pkg from "../package.json" with { type: "json" };
import {
  addDependency,
  installDependencies,
  removeDependency,
  dedupeDependencies,
  runScript,
} from "./api.ts";
import { getPackageInfo } from "./registry.ts";
import { detectPackageManager } from "./package-manager.ts";
import type { OperationResult } from "./types.ts";

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
  corepack: {
    type: "boolean",
    default: true,
    description: "Use corepack",
  },
  dry: {
    type: "boolean",
    description: "Run in dry run mode (does not execute commands)",
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
    "install-peer-dependencies": {
      type: "boolean",
      description: "Also install peer dependencies",
    },
  },
  run: async ({ args }) => {
    const result = await (args._.length > 0
      ? addDependency(args._, args)
      : installDependencies(args));
    handleRes(result, args);
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
    const result = await removeDependency(args._, args);
    handleRes(result, args);
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

    if (packageManager?.warnings) {
      for (const warning of packageManager.warnings) {
        console.warn(warning);
      }
    }

    if (!packageManager) {
      console.error(`Cannot detect package manager in "${cwd}"`);
      return process.exit(1);
    }

    console.log(
      `Detected package manager in "${cwd}": "${packageManager.name}@${packageManager.version}"`,
    );
  },
});

const dedupe = defineCommand({
  meta: {
    description: "Dedupe dependencies",
  },
  args: {
    cwd: {
      type: "string",
      description: "Current working directory",
    },
    silent: {
      type: "boolean",
      description: "Run in silent mode",
    },
    recreateLockFile: {
      type: "boolean",
      description: "Recreate lock file",
    },
  },
  run: async ({ args }) => {
    const result = await dedupeDependencies(args);
    handleRes(result, args);
  },
});

const run = defineCommand({
  meta: {
    description: "Run script",
  },
  args: {
    name: {
      type: "positional",
      description: "Script name",
      required: true,
    },
    ...operationArgs,
  },
  run: async ({ args }) => {
    const result = await runScript(args.name, {
      ...args,
      args: args._.slice(1),
    });
    handleRes(result, args);
  },
});

const info = defineCommand({
  meta: {
    description: "Show package info from registry",
  },
  args: {
    name: {
      type: "positional",
      description: "Package name (e.g. vue, vue@3.0.0, vue@next)",
      required: true,
    },
    registry: { type: "string", description: "Custom registry URL" },
    json: { type: "boolean", description: "Output as JSON" },
  },
  run: async ({ args }) => {
    try {
      const pkgInfo = await getPackageInfo(args.name, {
        registry: args.registry,
      });
      if (args.json) {
        console.log(JSON.stringify(pkgInfo, null, 2));
      } else {
        console.log(`${pkgInfo.name}@${pkgInfo.version}`);
        if (pkgInfo.description) console.log(pkgInfo.description);
        if (pkgInfo.license) console.log(`license: ${pkgInfo.license}`);
      }
    } catch (error_: any) {
      console.error(error_.message);
      process.exit(1);
    }
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
    rm: remove,
    uninstall: remove,
    un: remove,
    detect,
    dedupe,
    run,
    info,
  },
});

runMain(main);

// --- internal utils ---

function handleRes(result: OperationResult, args: { dry?: boolean; silent?: boolean }) {
  if (args.dry && !args.silent) {
    console.log(`${result.exec?.command} ${result.exec?.args.join(" ")}`);
  }
}
