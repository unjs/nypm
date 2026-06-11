import { defineConfig } from "vitest/config";
import { isWindows } from "std-env";

export default defineConfig({
  test: {
    testTimeout: 30_000,
    setupFiles: ["./test/_setup.ts"],
    // The Windows runner is slow and the network-heavy install/dlx tests
    // contend for network + disk when test files run in parallel, randomly
    // pushing a single `dlx` past its per-test timeout. Run files serially on
    // Windows to remove that contention (other platforms stay fully parallel).
    ...(isWindows && { maxWorkers: 1, minWorkers: 1 }),
  },
  server: {
    watch: {
      ignored: [
        "test/fixtures/**"
      ]
    }
  }
});
