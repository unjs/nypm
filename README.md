# 🌈 [nypm](https://www.youtube.com/watch?v=QH2-TGUlwu4)

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![Github Actions][github-actions-src]][github-actions-href]
[![Codecov][codecov-src]][codecov-href]

> Unified Package Manager for Node.js

🚧 This project is under development. Please follow [issues](https://github.com/unjs/nypm/issues) for the roadmap. 🚧

## What does **nypm** do?

✅ Supports **npm, yarn and pnpm** out of the box with a unified API

✅ Provides an **API interface** to interact with package managers

✅ **Autodetects** project's package manager using package.json and known lockfiles

✅ **Auto-installs and use exactly expected version** of package manager using [nodejs/corepack](https://github.com/nodejs/corepack)

✅ **Minimal** implementation

nypm, detects package manager type and version and converts command into package manager CLI arguments. It then uses corepack to execute package manager's command (and download it if necessary).

```
  +------------------------------------+
  |                nypm                |
  +------------------------------------+
  +------------------------------------+
  |              Corepack              |
  +------------------------------------+
  +---------+  +---------+   +---------+
  |   npm   |  |  yarn   |   |  pnpm   |
  +---------+  +---------+   +---------+
  +------------------------------------+
  |         Node.js project            |
  +------------------------------------+
```

## CLI Usage

[TBA]

## API Usage

Install package:

```sh
# npm
npm install nypm

# pnpm
pnpm install nypm

# yarn
yarn add nypm
```

Import:

```js
// ESM
import {
  detectPackageManager,
  installDependencies,
  addDependency,
  addDevDependency,
  removeDependendency,
} from "nypm";

// CommonJS
const {
  detectPackageManager,
  installDependencies,
  addDependency,
  addDevDependency,
  removeDependendency,
} = require("nypm");
```

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
[github-actions-src]: https://img.shields.io/github/workflow/status/unjs/nypm/ci/main?style=flat-square
[github-actions-href]: https://github.com/unjs/nypm/actions?query=workflow%3Aci
[codecov-src]: https://img.shields.io/codecov/c/gh/unjs/nypm/main?style=flat-square
[codecov-href]: https://codecov.io/gh/unjs/nypm
