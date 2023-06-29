import { OperationOptions } from "../api";

export async function executeCommand(
  command: string,
  args: string[],
  options: Pick<OperationOptions, "cwd" | "silent"> = {}
): Promise<void> {
  const { execa } = await import("execa");
  const { resolve } = await import("pathe");

  await execa("corepack", [command, ...args], {
    cwd: resolve(options.cwd || process.cwd()),
    stdio: options.silent ? "ignore" : "inherit",
  });
}
