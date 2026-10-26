import { afterEach, describe, expect, it, vi } from "vitest";

const { x, rmSync } = vi.hoisted(() => ({ x: vi.fn(), rmSync: vi.fn() }));

vi.mock("tinyexec", () => ({ x }));

// `recreateLockfile` removes lockfiles before reinstalling
vi.mock("node:fs", async (importOriginal) => ({
  ...(await importOriginal<typeof import("node:fs")>()),
  rmSync,
}));

const {
  installDependencies,
  addDependency,
  addDevDependency,
  ensureDependencyInstalled,
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
    rmSync.mockReset();
  });

  const operations: Record<string, () => Promise<unknown>> = {
    installDependencies: () => installDependencies(options),
    addDependency: () => addDependency("pathe", options),
    addDevDependency: () => addDevDependency("pathe", options),
    ensureDependencyInstalled: () => ensureDependencyInstalled("pathe", options),
    removeDependency: () => removeDependency("pathe", options),
    dedupeDependencies: () => dedupeDependencies(options),
    "dedupeDependencies (recreateLockfile)": () =>
      dedupeDependencies({ ...options, recreateLockfile: true }),
    runScript: () => runScript("build", options),
    dlx: () => dlx("envinfo", options),
  };

  for (const [name, run] of Object.entries(operations)) {
    it(name, async () => {
      x.mockResolvedValue({ exitCode: 0, stdout: "", stderr: "" });

      await run();

      if (name.includes("recreateLockfile")) {
        expect(rmSync).toHaveBeenCalled();
      }

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
