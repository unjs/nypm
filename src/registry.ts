import type { PackageInfo, GetPackageInfoOptions } from "./types.ts";

const NPM_REGISTRY = "https://registry.npmjs.org";

export async function getPackageInfo(
  nameSpec: string,
  options: GetPackageInfoOptions = {},
): Promise<PackageInfo> {
  const registry = options.registry?.replace(/\/$/, "") || NPM_REGISTRY;
  const { name, version } = parsePackageSpec(nameSpec);
  const encodedName = encodePackageName(name);

  const response = await fetch(`${registry}/${encodedName}`);
  if (!response.ok) {
    const status = response.status === 404 ? "not found" : response.status === 403 ? "forbidden" : `error ${response.status}`;
    throw new Error(`Package ${name}: ${status}`, { cause: response });
  }

  const data = await response.json();
  const distTags: Record<string, string> = data["dist-tags"] || {};
  const allVersions = Object.keys(data.versions || {});

  // Resolve version: use provided version/tag, or default to "latest"
  const versionOrTag = version || "latest";
  const resolvedVersion = distTags[versionOrTag] ?? versionOrTag;

  const versionData = data.versions?.[resolvedVersion];
  if (!versionData) {
    throw new Error(`Version not found: ${name}@${resolvedVersion}`);
  }

  return {
    ...versionData,
    versions: allVersions,
    distTags,
  };
}

function encodePackageName(name: string): string {
  if (name.startsWith("@")) {
    return "@" + encodeURIComponent(name.slice(1));
  }
  return encodeURIComponent(name);
}

function parsePackageSpec(spec: string): { name: string; version?: string } {
  // Handle scoped packages: @scope/pkg@version
  if (spec.startsWith("@")) {
    const slashIndex = spec.indexOf("/");
    if (slashIndex === -1) {
      return { name: spec };
    }
    const afterSlash = spec.slice(slashIndex + 1);
    const atIndex = afterSlash.indexOf("@");
    if (atIndex === -1) {
      return { name: spec };
    }
    return {
      name: spec.slice(0, slashIndex + 1 + atIndex),
      version: afterSlash.slice(atIndex + 1),
    };
  }
  // Non-scoped: pkg@version
  const atIndex = spec.indexOf("@");
  if (atIndex === -1) {
    return { name: spec };
  }
  return { name: spec.slice(0, atIndex), version: spec.slice(atIndex + 1) };
}
