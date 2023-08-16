import { readFile } from "node:fs/promises";
import { join } from "pathe";
import {
  executeCommand,
  resolveOperationOptions,
  getWorkspaceArgs,
  doesDependencyExist,
} from "./_utils";
import type { OperationOptions } from "./types";

/**
 * Installs project dependencies.
 *
 * @param options - Options to pass to the API call.
 * @param options.cwd - The directory to run the command in.
 * @param options.silent - Whether to run the command in silent mode.
 * @param options.packageManager - The package manager info to use (auto-detected).
 */
export async function installDependencies(
  options: Pick<OperationOptions, "cwd" | "silent" | "packageManager"> = {},
) {
  const resolvedOptions = await resolveOperationOptions(options);

  await executeCommand(resolvedOptions.packageManager.command, ["install"], {
    cwd: resolvedOptions.cwd,
    silent: resolvedOptions.silent,
  });
}

/**
 * Adds dependency to the project.
 *
 * @param name - Name of the dependency to add.
 * @param options - Options to pass to the API call.
 * @param options.cwd - The directory to run the command in.
 * @param options.silent - Whether to run the command in silent mode.
 * @param options.packageManager - The package manager info to use (auto-detected).
 * @param options.dev - Whether to add the dependency as dev dependency.
 * @param options.workspace - The name of the workspace to use.
 */
export async function addDependency(
  name: string,
  options: OperationOptions = {},
) {
  const resolvedOptions = await resolveOperationOptions(options);

  const args = (
    resolvedOptions.packageManager.name === "yarn"
      ? [
          ...getWorkspaceArgs(resolvedOptions),
          "add",
          resolvedOptions.dev ? "-D" : "",
          name,
        ]
      : [
          resolvedOptions.packageManager.name === "npm" ? "install" : "add",
          ...getWorkspaceArgs(resolvedOptions),
          resolvedOptions.dev ? "-D" : "",
          name,
        ]
  ).filter(Boolean);

  await executeCommand(resolvedOptions.packageManager.command, args, {
    cwd: resolvedOptions.cwd,
    silent: resolvedOptions.silent,
  });
}

/**
 * Adds dev dependency to the project.
 *
 * @param name - Name of the dev dependency to add.
 * @param options - Options to pass to the API call.
 * @param options.cwd - The directory to run the command in.
 * @param options.silent - Whether to run the command in silent mode.
 * @param options.packageManager - The package manager info to use (auto-detected).
 * @param options.workspace - The name of the workspace to use.
 *
 */
export async function addDevDependency(
  name: string,
  options: Omit<OperationOptions, "dev"> = {},
) {
  await addDependency(name, { ...options, dev: true });
}

/**
 * Removes dependency from the project.
 *
 * @param name - Name of the dependency to remove.
 * @param options - Options to pass to the API call.
 * @param options.cwd - The directory to run the command in.
 * @param options.silent - Whether to run the command in silent mode.
 * @param options.packageManager - The package manager info to use (auto-detected).
 * @param options.dev - Whether to remove dev dependency.
 * @param options.workspace - The name of the workspace to use.
 */
export async function removeDependency(
  name: string,
  options: OperationOptions = {},
) {
  const resolvedOptions = await resolveOperationOptions(options);

  const args = (
    resolvedOptions.packageManager.name === "yarn"
      ? [
          ...getWorkspaceArgs(resolvedOptions),
          "remove",
          resolvedOptions.dev ? "-D" : "",
          name,
        ]
      : [
          resolvedOptions.packageManager.name === "npm"
            ? "uninstall"
            : "remove",
          ...getWorkspaceArgs(resolvedOptions),
          resolvedOptions.dev ? "-D" : "",
          name,
        ]
  ).filter(Boolean);

  await executeCommand(resolvedOptions.packageManager.command, args, {
    cwd: resolvedOptions.cwd,
    silent: resolvedOptions.silent,
  });
}

/**
 * Ensures dependency is installed.
 *
 * @param name - Name of the dependency.
 * @param options - Options to pass to the API call.
 * @param options.cwd - The directory to run the command in.
 * @param options.dev - Whether to install as dev dependency (if not already installed).
 * @param options.workspace - The name of the workspace to install dependency in (if not already installed).
 */
export async function ensureDependencyInstalled(
  name: string,
  options: Pick<OperationOptions, "cwd" | "dev" | "workspace"> = {},
) {
  const resolvedOptions = await resolveOperationOptions(options);

  const dependencyExists = doesDependencyExist(name, resolvedOptions);

  if (dependencyExists) {
    return true;
  }

  await addDependency(name, resolvedOptions);
}

/**
 * Updates dependency version and type (dev/dependency) based on constraints.
 *
 * @param name - Name of the dependency to update.
 * @param _options - Options to pass to the API call.
 */
export async function updateDependency(
  name: string,
  _options: OperationOptions & { override?: "major" | "minor" | "atch" } = {},
) {
  const options = (await resolveOperationOptions(_options)) as typeof _options;
  const latestVersion = await getLatestVersion(name);
  const existingConstraint = await getDependencyConstraint(name, options);
  // Determine the new version constraint based on overrides (minor/major bump)
  let newConstraint = existingConstraint;
  if (options.override === "minor") {
    newConstraint = `^${existingConstraint.split(".")[0]}.x`;
  } else if (options.override === "major") {
    newConstraint = `^${
      Number.parseInt(existingConstraint.split(".")[0], 10) + 1
    }.x`;
  }
  // Check if the latest version is higher than the current version
  const semver = await import("semver").then((r) => r.default || r);
  if (latestVersion && semver.gt(latestVersion, newConstraint)) {
    options.dev
      ? await addDevDependency(`${name}@${latestVersion}`)
      : await addDependency(`${name}@${latestVersion}`);
  } else {
    options.dev
      ? await addDevDependency(`${name}@${newConstraint}`)
      : await addDependency(`${name}@${newConstraint}`);
  }
  return {};
}

/**
 * Retrieves the current version constraint for a dependency.
 *
 * @param name - Name of the dependency to retrieve the constraint for.
 * @param options - OperationOptions to retrieve the package manager and other context.
 */
async function getDependencyConstraint(
  name: string,
  options: OperationOptions,
): Promise<string> {
  const dependencyType = options.dev ? "devDependencies" : "dependencies";
  const packageJsonPath = join(options.cwd || process.cwd(), "package.json");
  const packageJsonContents = await readFile(packageJsonPath, "utf8");
  const packageJson = JSON.parse(packageJsonContents);
  const dependencyObject = packageJson[dependencyType];
  if (!dependencyObject || !dependencyObject[name]) {
    throw new Error(`Dependency "${name}" not found in ${dependencyType}`);
  }
  const currentConstraint = dependencyObject[name];
  // Handle non-standard version constraints
  if (["next", "latest"].includes(currentConstraint)) {
    return currentConstraint; // Keep "next" or "latest" as-is
  }
  // Parse version constraint with semantic versioning
  const versionParts = currentConstraint.split(".");
  const major = versionParts[0];
  const minor = versionParts[1];
  const patchAndRest = versionParts.slice(2).join(".");
  // Handle beta versions
  if (patchAndRest.startsWith("-beta")) {
    const betaVersion = patchAndRest.split("-")[1];
    return `${major}.${minor}.${betaVersion}-beta`;
  }
  // Handle other non-standard constraints (e.g., "3.0.0-beta.0")
  if (patchAndRest) {
    return `${major}.${minor}.${patchAndRest}`;
  }
  return `${major}.${minor}`;
}

async function getLatestVersion(
  packageName: string,
): Promise<string | undefined> {
  const { $fetch } = await import("ofetch");
  const response = await $fetch(
    `https://registry.npmjs.org/${packageName}/latest`,
    { parseResponse: JSON.parse },
  ).catch((error) =>
    console.error(`Error fetching latest version for ${packageName}:`, error),
  );
  if (response && response.data && response.data.version) {
    return response.data.version;
  } else {
    console.error(
      `Error fetching latest version for ${packageName}: Invalid response`,
    );
  }
  return undefined;
}
