import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    testTimeout: 30_000,
    setupFiles: ["./test/_setup.ts"],
  },
  server: {
    watch: {
      ignored: [
        "test/fixtures/**"
      ]
    }
  }
});
