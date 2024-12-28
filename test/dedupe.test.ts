import { describe, expect, it, vi } from "vitest";
import { fixtures } from "./_shared";
import { dedupeDependencies } from "../src";

describe("dedupe", () => {
  for (const fixture of fixtures.filter((f) => !f.workspace)) {
    describe(fixture.name, () => {
      it.skipIf(["bun", "deno"].includes(fixture.packageManager))(
        "dedupe dependencies",
        async () => {
          const dedupeDependenciesSpy = vi.fn(dedupeDependencies);
          const executeDedupeDependenciesSpy = () =>
            dedupeDependencies({
              cwd: fixture.dir,
              silent: !process.env.DEBUG,
            });
          await executeDedupeDependenciesSpy();

          expect(dedupeDependenciesSpy).not.toThrow();
        },
        60_000,
      );
    });
  }
});
