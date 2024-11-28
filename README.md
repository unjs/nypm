# 🌈 nypm

<!-- automd:badges color="yellow" codecov -->

[![npm version](https://img.shields.io/npm/v/nypm?color=yellow)](https://npmjs.com/package/nypm)
[![npm downloads](https://img.shields.io/npm/dm/nypm?color=yellow)](https://npm.chart.dev/nypm)
[![codecov](https://img.shields.io/codecov/c/gh/unjs/nypm?color=yellow)](https://codecov.io/gh/unjs/nypm)

<!-- /automd -->

🌈 Unified Package Manager for Node.js (npm, pnpm, yarn), Bun and Deno.

✅ Supports [npm](https://docs.npmjs.com/cli/v10/commands/npm), [yarn](https://yarnpkg.com/), [pnpm](https://pnpm.io/) and [bun](https://bun.sh/package-manager) and [deno](https://deno.com/) out of the box with a unified API.

✅ Provides an **API interface** to interact with package managers.

✅ **Autodetects** project's package manager using `package.json` and known lockfiles.

✅ **[corepack](https://github.com/nodejs/corepack)** integration for **pnpm** and **yarn**.

## `nypm` command

**Install dependencies:**

```sh
npx nypm i
```

**Add a dependency:**

```sh
npx nypm add defu
```

**Remove a dependency:**

```sh
npx nypm remove defu
```

## API Usage

Install package:

<!-- automd:pm-i -->

```sh
# ✨ Auto-detect
npx nypm install nypm

# npm
npm install nypm

# yarn
yarn add nypm

# pnpm
pnpm install nypm

# bun
bun install nypm

# deno
deno install nypm
```

<!-- /automd -->

Import:

```js
// ESM
import { addDependency } from "nypm";

// CommonJS
const { addDependency } = require("nypm");
```

### `addDependency(name, options)`

Adds dependency to the project.

### `addDevDependency(name, options)`

Adds dev dependency to the project.

### `detectPackageManager(cwd, options)`

Detect the package manager used in a directory (and up) by checking various sources:

1. Use `packageManager` field from package.json
2. Known lock files and other files

### `ensureDependencyInstalled(name, options)`

Ensures dependency is installed.

### `installDependencies(options)`

Installs project dependencies.

### `removeDependency(name, options)`

Removes dependency from the project.

## 💻 Development

- Clone this repository
- Play [Nyan Cat](https://www.nyan.cat/) in the background (really important!)
- Enable [Corepack](https://github.com/nodejs/corepack) using `corepack enable`
- Install dependencies using `pnpm install`
- Run interactive tests using `pnpm dev`

## Related Projects

NYPM is inspired from previous attempts and projects for unifying package manager experience.

- [pi0/yarnpm](https://github.com/pi0/yarnpm)
- [unjs/lmify](https://github.com/unjs/lmify)
- [antfu/ni](https://github.com/antfu/ni)
- [antfu/install-pkg](https://github.com/antfu/install-pkg)
- [egoist/dum](https://github.com/egoist/dum)
- [nodejs/corepack](https://github.com/nodejs/corepack)

## License

Made with 💛

Published under [MIT License](./LICENSE).

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/nypm?style=flat-square
[npm-version-href]: https://npmjs.com/package/nypm
[npm-downloads-src]: https://img.shields.io/npm/dm/nypm?style=flat-square
[npm-downloads-href]: https://npmjs.com/package/nypm
[github-actions-src]: https://img.shields.io/github/actions/workflow/status/unjs/nypm/ci.yml?branch=main&style=flat-square
[github-actions-href]: https://github.com/unjs/nypm/actions?query=workflow%3Aci
[codecov-src]: https://img.shields.io/codecov/c/gh/unjs/nypm/main?style=flat-square
[codecov-href]: https://codecov.io/gh/unjs/nypm
