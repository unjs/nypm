import { createRequire } from "node:module";
import { withTrailingSlash } from "ufo";
import { resolveOperationOptions } from "./resolve-operation-options";

export function doesDependencyExist(
  name: string,
  options: Pick<
    Awaited<ReturnType<typeof resolveOperationOptions>>,
    "cwd" | "workspace"
  >
) {
  const require = createRequire(withTrailingSlash(options.cwd));

  try {
    const resolvedPath = require.resolve(name);

    return resolvedPath.startsWith(options.cwd);
  } catch {
    return false;
  }
}
