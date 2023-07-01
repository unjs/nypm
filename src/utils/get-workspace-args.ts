import { resolveOperationOptions } from "./resolve-operation-options";

export function getWorkspaceArgs(
  options: Awaited<ReturnType<typeof resolveOperationOptions>>
): string[] {
  if (!options.workspace) {
    if (options.packageManager.name === "pnpm") {
      return ["-w"];
    }

    return [];
  }

  switch (options.packageManager.name) {
    case "npm": {
      return ["-w", options.workspace];
    }

    case "pnpm": {
      return ["-F", options.workspace];
    }

    case "yarn": {
      if (options.packageManager.majorVersion === "1") {
        return ["-W", options.workspace];
      }

      return ["workspace", options.workspace];
    }
  }
}
