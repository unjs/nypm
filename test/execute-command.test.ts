import { afterEach, describe, expect, it, vi } from "vitest";

const { x } = vi.hoisted(() => ({ x: vi.fn() }));

vi.mock("tinyexec", () => ({ x }));

const { executeCommand } = await import("../src/_utils.ts");
const originalStdinIsTTY = Object.getOwnPropertyDescriptor(process.stdin, "isTTY");

function mockStdinTTY(isTTY: boolean | undefined) {
  Object.defineProperty(process.stdin, "isTTY", {
    configurable: true,
    writable: true,
    value: isTTY,
  });
}

function expectStdio(stdio: unknown) {
  expect(x).toHaveBeenCalledWith(
    "pnpm",
    ["install"],
    expect.objectContaining({
      nodeOptions: expect.objectContaining({ stdio }),
    }),
  );
}

describe("executeCommand", () => {
  afterEach(() => {
    x.mockReset();
    if (originalStdinIsTTY) {
      Object.defineProperty(process.stdin, "isTTY", originalStdinIsTTY);
    } else {
      delete (process.stdin as { isTTY?: boolean }).isTTY;
    }
  });

  it("does not connect package manager commands to stdin without a parent TTY", async () => {
    // Node leaves `isTTY` undefined (rather than `false`) when stdin is not a terminal
    mockStdinTTY(undefined);
    x.mockResolvedValueOnce({ exitCode: 0, stdout: "", stderr: "" });

    await executeCommand("pnpm", ["install"], {
      cwd: "/tmp/project",
      corepack: false,
    });

    expectStdio(["ignore", "inherit", "inherit"]);
  });

  it("inherits stdio when the parent process has a TTY", async () => {
    mockStdinTTY(true);
    x.mockResolvedValueOnce({ exitCode: 0, stdout: "", stderr: "" });

    await executeCommand("pnpm", ["install"], {
      cwd: "/tmp/project",
      corepack: false,
    });

    expectStdio(["inherit", "inherit", "inherit"]);
  });

  it("keeps piped output when silent", async () => {
    mockStdinTTY(true);
    x.mockResolvedValueOnce({ exitCode: 0, stdout: "", stderr: "" });

    await executeCommand("pnpm", ["install"], {
      corepack: false,
      silent: true,
    });

    expectStdio(["inherit", "pipe", "pipe"]);
  });

  it("does not connect silent commands to stdin without a parent TTY", async () => {
    mockStdinTTY(undefined);
    x.mockResolvedValueOnce({ exitCode: 0, stdout: "", stderr: "" });

    await executeCommand("pnpm", ["install"], {
      corepack: false,
      silent: true,
    });

    expectStdio(["ignore", "pipe", "pipe"]);
  });

  it("includes captured output in the error message when a silent command fails", async () => {
    mockStdinTTY(undefined);
    x.mockResolvedValueOnce({ exitCode: 1, stdout: "some stdout", stderr: "some stderr" });

    await expect(
      executeCommand("pnpm", ["install"], { corepack: false, silent: true }),
    ).rejects.toThrow(/`pnpm install` failed\.\nsome stdout\nsome stderr/);
  });

  it("runs the package manager through the jup package bin when jup is enabled", async () => {
    x.mockResolvedValueOnce({ exitCode: 0, stdout: "", stderr: "" });

    await executeCommand("npm", ["install"], { jup: true });

    expect(x).toHaveBeenCalledWith(
      process.execPath,
      [expect.stringMatching(/[/\\]jup[/\\]bin[/\\]jup\.mjs$/), "npm", "install"],
      expect.anything(),
    );
  });

  it("prefers jup over corepack", async () => {
    x.mockResolvedValueOnce({ exitCode: 1, stdout: "", stderr: "" });

    await expect(
      executeCommand("pnpm", ["install"], { jup: true, corepack: true }),
    ).rejects.toThrow("`jup pnpm install` failed.");
    expect(x).toHaveBeenCalledTimes(1);
    expect(x.mock.calls[0]![1]).toEqual([expect.any(String), "pnpm", "install"]);
  });
});
