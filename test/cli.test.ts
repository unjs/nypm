import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const cli = fileURLToPath(new URL("../src/cli.ts", import.meta.url));

// runs src/cli.ts with plain node, which needs type stripping (default since Node 22.18)
describe.skipIf(!process.features.typescript)("cli", () => {
  let cwd!: string;

  beforeAll(() => {
    cwd = mkdtempSync(join(tmpdir(), "nypm-cli-"));
    writeFileSync(join(cwd, "package.json"), JSON.stringify({ packageManager: "pnpm@10.0.0" }));
  });

  afterAll(() => {
    rmSync(cwd, { recursive: true, force: true });
  });

  const cases: [flags: string[], command: string][] = [
    [[], "pnpm dedupe"],
    [["--recreateLockFile"], "pnpm install"],
    [["--recreate-lock-file"], "pnpm install"],
    [["--recreateLockfile"], "pnpm install"],
    [["--recreate-lockfile"], "pnpm install"],
  ];

  for (const [flags, command] of cases) {
    it(`dedupe ${flags.join(" ") || "without flags"} runs ${command}`, () => {
      const output = execFileSync(
        process.execPath,
        [cli, "dedupe", "--dry", ...flags, "--cwd", cwd],
        { encoding: "utf8", stdio: "pipe" },
      );
      expect(output.trim()).toBe(command);
    });
  }
});
