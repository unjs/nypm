import { afterEach, describe, expect, it, vi } from "vitest";

const { x } = vi.hoisted(() => ({ x: vi.fn() }));

vi.mock("tinyexec", () => ({ x }));

const {
  installDependencies,
  addDependency,
  addDevDependency,
  removeDependency,
  dedupeDependencies,
  runScript,
  dlx,
} = await import("../src/index.ts");

const options = {
  cwd: "/tmp/project",
  packageManager: "pnpm",
  corepack: false,
  silent: true,
  env: { NODE_ENV: "development" },
} as const;

describe("forwards env to the package manager", () => {
  afterEach(() => {
    x.mockReset();
  });

  const operations: Record<string, () => Promise<unknown>> = {
    installDependencies: () => installDependencies(options),
    addDependency: () => addDependency("pathe", options),
    addDevDependency: () => addDevDependency("pathe", options),
    removeDependency: () => removeDependency("pathe", options),
    dedupeDependencies: () => dedupeDependencies(options),
    runScript: () => runScript("build", options),
    dlx: () => dlx("envinfo", options),
  };

  for (const [name, run] of Object.entries(operations)) {
    it(name, async () => {
      x.mockResolvedValue({ exitCode: 0, stdout: "", stderr: "" });

      await run();

      expect(x).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Array),
        expect.objectContaining({
          nodeOptions: expect.objectContaining({
            env: expect.objectContaining({ NODE_ENV: "development" }),
          }),
        }),
      );
    });
  }
});
