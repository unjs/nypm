import { afterEach, describe, expect, it, vi } from "vitest";

const { x, runMain } = vi.hoisted(() => ({ x: vi.fn(), runMain: vi.fn() }));

vi.mock("tinyexec", () => ({ x }));
vi.mock("jup", () => ({ runMain }));

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

  it("runs the package manager through jup's runMain when jup is enabled", async () => {
    mockStdinTTY(undefined);
    runMain.mockResolvedValueOnce({ code: 0 });

    await executeCommand("npm", ["install"], {
      cwd: "/tmp/project",
      env: { FOO: "bar" },
      jup: true,
      corepack: true,
    });

    expect(runMain).toHaveBeenCalledWith(["npm", "install"], {
      cwd: "/tmp/project",
      env: { FOO: "bar" },
      stdio: ["ignore", "inherit", "inherit"],
    });
    expect(x).not.toHaveBeenCalled();
    runMain.mockReset();
  });

  it("includes jup's captured output in the error message when a silent command fails", async () => {
    mockStdinTTY(true);
    runMain.mockResolvedValueOnce({ code: 1, stdout: "some stdout", stderr: "some stderr" });

    await expect(executeCommand("pnpm", ["install"], { jup: true, silent: true })).rejects.toThrow(
      /`jup pnpm install` failed\.\nsome stdout\nsome stderr/,
    );
    expect(runMain).toHaveBeenCalledWith(
      ["pnpm", "install"],
      expect.objectContaining({ stdio: ["inherit", "pipe", "pipe"] }),
    );
    runMain.mockReset();
  });
});
