import { resolveOperationOptions } from "./resolve-operation-options";

export function getWorkspaceArgs(
  options: Awaited<ReturnType<typeof resolveOperationOptions>>
): string[] {
  if (!options.workspace) {
    if (options.packageManager.name === "pnpm") {
      return ["-w"];
    }

    if (
      options.packageManager.name === "yarn" &&
      options.packageManager.majorVersion === "1"
    ) {
      return ["-W"];
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
      return ["workspace", options.workspace];
    }
  }
}
