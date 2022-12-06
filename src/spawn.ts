import { spawn } from "node:child_process";
import { resolve } from "pathe";

export interface RunCommandOptions {
  cwd?: string;
  silent?: boolean;
}

export function runCorepack (pm: string, argv: string[], options: RunCommandOptions = {}): Promise<true> {
  return runCommand("corepack", [pm, ...argv], options);
}

function runCommand (command: string, argv: string[], options: RunCommandOptions = {}): Promise<true> {
  const child = spawn(command, argv, {
    cwd: resolve(options.cwd || process.cwd()),
    stdio: options.silent ? "ignore" : "inherit"
  });
  return new Promise((resolve, reject) => {
    child.on("exit", (code) => {
      if (code !== 0) {
        return reject(new Error(`${command} ${argv.join(" ")} failed (exit code: ${code})`));
      }
      return resolve(true);
    });
  });
}
