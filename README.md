# 🌈 [nypm](https://www.youtube.com/watch?v=QH2-TGUlwu4)

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![Github Actions][github-actions-src]][github-actions-href]
[![Codecov][codecov-src]][codecov-href]

> Unified Package Manager for Node.js and Bun

## What does **nypm** do?

✅ Supports [npm](https://docs.npmjs.com/cli/v10/commands/npm), [yarn](https://yarnpkg.com/), [pnpm](https://pnpm.io/) and [bun](https://bun.sh/package-manager) out of the box with a unified API.

✅ Provides an **API interface** to interact with package managers.

✅ **Autodetects** project's package manager using `package.json` and known lockfiles.

✅ **Auto-installs and use exactly expected version** of supported package managers using [nodejs/corepack](https://github.com/nodejs/corepack) when available.

✅ **Minimal** implementation.

nypm, detects package manager type and version and converts command into package manager CLI arguments. It then uses corepack or proper command to execute package manager's command and download it if necessary.

```
  +------------------------------------------------+
  |                nypm                            |
  +------------------------------------------------+
  +-----------------------------------+  +---------+
  |              Corepack             |  |  bun    |
  +-----------------------------------+  +---------+
  +---------+  +---------+  +---------+
  |   npm   |  |  yarn   |  |  pnpm   |
  +---------+  +---------+  +---------+
```

## `nypm` Command

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

<!-- AUTOMD_START generator="pm-install" name="nypm" -->

```sh
# ✨ Auto-detect
npx nypm i nypm

# npm
npm install nypm

# yarn
yarn add nypm

# pnpm
pnpm install nypm

# bun
bun install nypm
```

<!-- AUTOMD_END -->

Import:

```js
// ESM
import { addDependency } from "nypm";

// CommonJS
const { addDependency } = require("nypm");
```

<!-- AUTOMD_START generator="jsdocs" -->

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


<!-- AUTOMD_END -->

## 💻 Development

- Clone this repository
- Play [Nyan Cat](https://www.youtube.com/watch?v=QH2-TGUlwu4) in the background (really important!)
- Enable [Corepack](https://github.com/nodejs/corepack) using `corepack enable` (use `npm i -g corepack` for Node.js < 16.10)
- Install dependencies using `pnpm install`
- Run interactive tests using `pnpm dev`

## Related Projects

NYPM is inspired from previous attempts and projects for unifying package manager exeperience.

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
