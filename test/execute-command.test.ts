import { afterEach, describe, expect, it, vi } from "vitest";

const x = vi.fn();

vi.mock("tinyexec", () => ({ x }));

const { executeCommand } = await import("../src/_utils.ts");

function mockStdinTTY(isTTY: boolean) {
  Object.defineProperty(process.stdin, "isTTY", {
    configurable: true,
    value: isTTY,
  });
}

describe("executeCommand", () => {
  afterEach(() => {
    x.mockReset();
    vi.restoreAllMocks();
  });

  it("does not connect package manager commands to stdin without a parent TTY", async () => {
    mockStdinTTY(false);
    x.mockResolvedValueOnce({ exitCode: 0, stdout: "", stderr: "" });

    await executeCommand("pnpm", ["install"], {
      cwd: "/tmp/project",
      corepack: false,
    });

    expect(x).toHaveBeenCalledWith(
      "pnpm",
      ["install"],
      expect.objectContaining({
        nodeOptions: expect.objectContaining({
          stdio: ["ignore", "inherit", "inherit"],
        }),
      }),
    );
  });

  it("inherits stdio when the parent process has a TTY", async () => {
    mockStdinTTY(true);
    x.mockResolvedValueOnce({ exitCode: 0, stdout: "", stderr: "" });

    await executeCommand("pnpm", ["install"], {
      cwd: "/tmp/project",
      corepack: false,
    });

    expect(x).toHaveBeenCalledWith(
      "pnpm",
      ["install"],
      expect.objectContaining({
        nodeOptions: expect.objectContaining({ stdio: "inherit" }),
      }),
    );
  });

  it("keeps piped stdio when silent", async () => {
    mockStdinTTY(true);
    x.mockResolvedValueOnce({ exitCode: 0, stdout: "", stderr: "" });

    await executeCommand("pnpm", ["install"], {
      corepack: false,
      silent: true,
    });

    expect(x).toHaveBeenCalledWith(
      "pnpm",
      ["install"],
      expect.objectContaining({
        nodeOptions: expect.objectContaining({ stdio: "pipe" }),
      }),
    );
  });
});
