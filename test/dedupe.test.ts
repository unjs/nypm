import { describe, expect, it, vi } from "vitest";
import { fixtures } from "./_shared";
import { dedupeDependencies } from "../src";

const { rmSync } = vi.hoisted(() => {
  return { rmSync: vi.fn() };
});

vi.mock("fs", () => ({
  ...require("node:fs"),
  rmSync,
}));

describe("dedupe", () => {
  for (const fixture of fixtures.filter((f) => !f.workspace)) {
    describe(fixture.name, () => {
      it("dedupe dependencies", async () => {
        const dedupeDependenciesSpy = vi.fn(dedupeDependencies);
        const executeDedupeDependenciesSpy = async () =>
          await dedupeDependencies({
            cwd: fixture.dir,
            silent: !process.env.DEBUG,
          });
        await executeDedupeDependenciesSpy();
        if (["bun", "deno"].includes(fixture.packageManager)) {
          expect(rmSync).toHaveBeenCalled();
        }
        expect(dedupeDependenciesSpy).not.toThrow();
      }, 60_000);

      it("force lockfile recreation", async () => {
        const dedupeDependenciesSpy = vi.fn(dedupeDependencies);
        const executeDedupeDependenciesSpy = async () =>
          await dedupeDependencies({
            cwd: fixture.dir,
            silent: !process.env.DEBUG,
            recreateLockfile: true,
          });
        await executeDedupeDependenciesSpy();
        expect(dedupeDependenciesSpy).not.toThrow();
      }, 60_000);

      it.skipIf(["bun", "deno"].includes(fixture.packageManager))(
        "lockfile recreation set to false",
        async () => {
          const dedupeDependenciesSpy = vi.fn(dedupeDependencies);
          const executeDedupeDependenciesSpy = async () =>
            await dedupeDependencies({
              cwd: fixture.dir,
              silent: !process.env.DEBUG,
              recreateLockfile: false,
            });
          await executeDedupeDependenciesSpy();
          // if (["bun", "deno"].includes(fixture.packageManager)) {
          //   expect(dedupeDependenciesSpy).toThrowError();
          // }else {
          expect(dedupeDependenciesSpy).not.toThrowError();
          // }
        },
        60_000,
      );
    });
  }
});
