import { OperationOptions } from "../api";

export async function executeCommand(
  command: string,
  args: string[],
  options: Pick<OperationOptions, "cwd" | "silent"> = {}
): Promise<void> {
  const { execa } = await import("execa");
  const { resolve } = await import("pathe");

  // workaround issue with segmentation fault when using corepack with npm
  // on ubuntu-latest
  const execaArgs: [string, string[]] =
    command === "npm" ? [command, args] : ["corepack", [command, ...args]];

  await execa(execaArgs[0], execaArgs[1], {
    cwd: resolve(options.cwd || process.cwd()),
    stdio: options.silent ? "ignore" : "inherit",
  });
}
