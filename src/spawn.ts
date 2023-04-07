import { spawn } from "node:child_process";
import { resolve } from "pathe";

export interface RunCommandOptions {
  cwd?: string;
  silent?: boolean;
}

export function runCorepack(
  pm: string,
  argv: string[],
  options: RunCommandOptions = {}
): Promise<boolean> {
  if (pm === "npm") {
    return runCommand("npm", argv, options);
  }
  return runCommand("corepack", [pm, ...argv], options);
}

async function runCommand(
  command: string,
  argv: string[],
  options: RunCommandOptions = {}
): Promise<boolean> {
  const { execa } = await import("execa");
  try {
    await execa(command, argv, {
      cwd: resolve(options.cwd || process.cwd()),
      stdio: options.silent ? "ignore" : "inherit",
    });
  } catch {
    return false;
  }
  return true;
}
