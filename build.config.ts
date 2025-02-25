import { defineBuildConfig } from "unbuild";
import { rm } from "node:fs/promises";

export default defineBuildConfig({
  hooks: {
    async "build:done"() {
      await rm("dist/index.d.ts");
    },
  },
});
