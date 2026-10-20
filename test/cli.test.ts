import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const cli = fileURLToPath(new URL("../src/cli.ts", import.meta.url));

describe("cli", () => {
  let cwd!: string;

  beforeAll(() => {
    cwd = mkdtempSync(join(tmpdir(), "nypm-cli-"));
    writeFileSync(join(cwd, "package.json"), JSON.stringify({ packageManager: "pnpm@10.0.0" }));
  });

  afterAll(() => {
    rmSync(cwd, { recursive: true, force: true });
  });

  it("dedupe passes --recreateLockFile to dedupeDependencies", () => {
    const output = execFileSync(
      process.execPath,
      [cli, "dedupe", "--dry", "--recreateLockFile", "--cwd", cwd],
      { encoding: "utf8", stdio: "pipe" },
    );
    expect(output.trim()).toBe("pnpm install");
  });
});
