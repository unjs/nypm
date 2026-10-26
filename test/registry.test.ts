import { expect, it, describe, vi, beforeEach, afterEach } from "vitest";
import { getPackageInfo } from "../src/registry.ts";

const mockVueResponse = {
  name: "vue",
  "dist-tags": { latest: "3.4.0", next: "3.5.0-beta.1" },
  versions: {
    "3.4.0": {
      name: "vue",
      version: "3.4.0",
      description: "Vue.js",
      license: "MIT",
      homepage: "https://vuejs.org",
      dist: {
        tarball: "https://registry.npmjs.org/vue/-/vue-3.4.0.tgz",
        shasum: "abc123",
      },
    },
    "3.5.0-beta.1": {
      name: "vue",
      version: "3.5.0-beta.1",
      description: "Vue.js (beta)",
      license: "MIT",
      dist: {
        tarball: "https://registry.npmjs.org/vue/-/vue-3.5.0-beta.1.tgz",
        shasum: "def456",
      },
    },
  },
};

const mockNuxtKitResponse = {
  name: "@nuxt/kit",
  "dist-tags": { latest: "3.10.0" },
  versions: {
    "3.10.0": {
      name: "@nuxt/kit",
      version: "3.10.0",
      description: "Nuxt Kit",
      license: "MIT",
      dependencies: { pathe: "^1.0.0" },
      dist: {
        tarball: "https://registry.npmjs.org/@nuxt/kit/-/kit-3.10.0.tgz",
        shasum: "ghi789",
      },
    },
  },
};

describe("getPackageInfo", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    globalThis.fetch = vi.fn();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it("fetches basic package info", async () => {
    vi.mocked(fetch).mockResolvedValue(
      Response.json(mockVueResponse, { status: 200 }),
    );

    const info = await getPackageInfo("vue");

    expect(fetch).toHaveBeenCalledWith("https://registry.npmjs.org/vue");
    expect(info.name).toBe("vue");
    expect(info.version).toBe("3.4.0");
    expect(info.description).toBe("Vue.js");
    expect(info.license).toBe("MIT");
    expect(info.distTags).toEqual({ latest: "3.4.0", next: "3.5.0-beta.1" });
    expect(info.versions).toEqual(["3.4.0", "3.5.0-beta.1"]);
  });

  it("fetches scoped package info", async () => {
    vi.mocked(fetch).mockResolvedValue(
      Response.json(mockNuxtKitResponse, { status: 200 }),
    );

    const info = await getPackageInfo("@nuxt/kit");

    expect(fetch).toHaveBeenCalledWith(
      "https://registry.npmjs.org/@nuxt%2Fkit",
    );
    expect(info.name).toBe("@nuxt/kit");
    expect(info.version).toBe("3.10.0");
    expect(info.dependencies).toEqual({ pathe: "^1.0.0" });
  });

  it("resolves version tag (next)", async () => {
    vi.mocked(fetch).mockResolvedValue(
      Response.json(mockVueResponse, { status: 200 }),
    );

    const info = await getPackageInfo("vue@next");

    expect(info.version).toBe("3.5.0-beta.1");
    expect(info.description).toBe("Vue.js (beta)");
  });

  it("resolves explicit version", async () => {
    vi.mocked(fetch).mockResolvedValue(
      Response.json(mockVueResponse, { status: 200 }),
    );

    const info = await getPackageInfo("vue@3.4.0");

    expect(info.version).toBe("3.4.0");
  });

  it("resolves scoped package with version", async () => {
    vi.mocked(fetch).mockResolvedValue(
      Response.json(mockNuxtKitResponse, { status: 200 }),
    );

    const info = await getPackageInfo("@nuxt/kit@3.10.0");

    expect(info.version).toBe("3.10.0");
  });

  it("throws on 404", async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response("Not found", { status: 404 }),
    );

    await expect(getPackageInfo("nonexistent-package-xyz")).rejects.toThrow(
      "Package not found: nonexistent-package-xyz",
    );
  });

  it("throws on version not found", async () => {
    vi.mocked(fetch).mockResolvedValue(
      Response.json(mockVueResponse, { status: 200 }),
    );

    await expect(getPackageInfo("vue@99.0.0")).rejects.toThrow(
      "Version not found: vue@99.0.0",
    );
  });

  it("uses custom registry", async () => {
    vi.mocked(fetch).mockResolvedValue(
      Response.json(mockVueResponse, { status: 200 }),
    );

    await getPackageInfo("vue", { registry: "https://custom.registry.com/" });

    expect(fetch).toHaveBeenCalledWith("https://custom.registry.com/vue");
  });
});
