import { afterEach, describe, expect, it, vi } from "vitest";

const x = vi.fn();

vi.mock("tinyexec", () => ({ x }));

const { executeCommand } = await import("../src/_utils.ts");

describe("executeCommand", () => {
  afterEach(() => {
    x.mockReset();
  });

  it("does not connect package manager commands to stdin", async () => {
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

  it("keeps piped stdio when silent", async () => {
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
