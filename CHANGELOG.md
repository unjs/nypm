# Changelog


## v0.6.1

[compare changes](https://github.com/unjs/nypm/compare/v0.6.0...v0.6.1)

### 🚀 Enhancements

- Allow removing multiple packages with one cli command ([#198](https://github.com/unjs/nypm/pull/198))
- Allow passing args to `runScript` ([#200](https://github.com/unjs/nypm/pull/200))
- Command generator utils ([#209](https://github.com/unjs/nypm/pull/209))
- Dry run mode ([#210](https://github.com/unjs/nypm/pull/210))

### 📖 Documentation

- Add missing docstrings ([#205](https://github.com/unjs/nypm/pull/205))

### 🏡 Chore

- Update deps ([a98828d](https://github.com/unjs/nypm/commit/a98828d))
- Apply automated updates ([bcba81e](https://github.com/unjs/nypm/commit/bcba81e))
- Update readme ([#196](https://github.com/unjs/nypm/pull/196))
- Update deps ([5de19b4](https://github.com/unjs/nypm/commit/5de19b4))
- Update fixture ([883775d](https://github.com/unjs/nypm/commit/883775d))
- Apply automated updates ([fa17ac5](https://github.com/unjs/nypm/commit/fa17ac5))
- Update to tinyexec v1 ([395ff3d](https://github.com/unjs/nypm/commit/395ff3d))

### ❤️ Contributors

- Pooya Parsa ([@pi0](https://github.com/pi0))
- Damian Głowala ([@DamianGlowala](https://github.com/DamianGlowala))
- Matvey <orlition@gmail.com>
- Abeer0 ([@iiio2](https://github.com/iiio2))
- Robin <robin.kehl@singular-it.de>

## v0.6.0

[compare changes](https://github.com/unjs/nypm/compare/v0.5.4...v0.6.0)

### 🚀 Enhancements

- Add `runScript` utility ([#191](https://github.com/unjs/nypm/pull/191))

### 🩹 Fixes

- ⚠️  Check `exitCode` for failed commands ([2d6cfbf](https://github.com/unjs/nypm/commit/2d6cfbf))
- **dedupeDependencies:** Use `install` for yarn v1 ([8ec61f3](https://github.com/unjs/nypm/commit/8ec61f3))
- ⚠️  Correctly detect yarn `majorVersion` ([#193](https://github.com/unjs/nypm/pull/193))

### 💅 Refactors

- Remove `ufo` dependency ([b295f7e](https://github.com/unjs/nypm/commit/b295f7e))

### 📦 Build

- ⚠️  Esm-only ([bd06ebc](https://github.com/unjs/nypm/commit/bd06ebc))

### 🏡 Chore

- Update deps ([8c45496](https://github.com/unjs/nypm/commit/8c45496))
- Update pkg-types to v2 ([b3169a0](https://github.com/unjs/nypm/commit/b3169a0))
- Apply automated updates ([f281923](https://github.com/unjs/nypm/commit/f281923))

#### ⚠️ Breaking Changes

- ⚠️  Check `exitCode` for failed commands ([2d6cfbf](https://github.com/unjs/nypm/commit/2d6cfbf))
- ⚠️  Correctly detect yarn `majorVersion` ([#193](https://github.com/unjs/nypm/pull/193))
- ⚠️  Esm-only ([bd06ebc](https://github.com/unjs/nypm/commit/bd06ebc))

### ❤️ Contributors

- Lennart <lekoarts@gmail.com>
- Pooya Parsa ([@pi0](http://github.com/pi0))
- Damian Głowala ([@DamianGlowala](http://github.com/DamianGlowala))

## v0.5.4

[compare changes](https://github.com/unjs/nypm/compare/v0.5.2...v0.5.4)

### 🩹 Fixes

- Stackblitz does not supports corepack ([#192](https://github.com/unjs/nypm/pull/192))

### 🏡 Chore

- Update deps ([06d8430](https://github.com/unjs/nypm/commit/06d8430))
- Update ci ([254c257](https://github.com/unjs/nypm/commit/254c257))
- **release:** V0.5.3 ([64a5d9a](https://github.com/unjs/nypm/commit/64a5d9a))

### ❤️ Contributors

- Pooya Parsa ([@pi0](http://github.com/pi0))

## v0.5.3

[compare changes](https://github.com/unjs/nypm/compare/v0.5.2...v0.5.3)

### 🏡 Chore

- Update deps ([06d8430](https://github.com/unjs/nypm/commit/06d8430))
- Update ci ([254c257](https://github.com/unjs/nypm/commit/254c257))

### ❤️ Contributors

- Pooya Parsa ([@pi0](http://github.com/pi0))

## v0.5.2

[compare changes](https://github.com/unjs/nypm/compare/v0.5.1...v0.5.2)

### 📦 Build

- Update `exports` for typescript compatibility ([#186](https://github.com/unjs/nypm/pull/186))

### ❤️ Contributors

- Tyler Butler ([@tylerbutler](http://github.com/tylerbutler))

## v0.5.1

[compare changes](https://github.com/unjs/nypm/compare/v0.5.0...v0.5.1)

### 🚀 Enhancements

- Normalize `packageManager` field when parsing ([#184](https://github.com/unjs/nypm/pull/184))

### 🏡 Chore

- Update deps ([9f041f1](https://github.com/unjs/nypm/commit/9f041f1))

### ❤️ Contributors

- Bobbie Goede <bobbiegoede@gmail.com>
- Pooya Parsa ([@pi0](http://github.com/pi0))

## v0.5.0

[compare changes](https://github.com/unjs/nypm/compare/v0.4.1...v0.5.0)

### 🚀 Enhancements

- Add `dedupeDependencies` utility ([#175](https://github.com/unjs/nypm/pull/175))

### 🔥 Performance

- Avoid lazy import ([#182](https://github.com/unjs/nypm/pull/182))

### 🩹 Fixes

- Correctly detect `corepack` for fallback ([#179](https://github.com/unjs/nypm/pull/179))

### 🏡 Chore

- Fix typo ([#167](https://github.com/unjs/nypm/pull/167))
- Update deps ([ea8db76](https://github.com/unjs/nypm/commit/ea8db76))

### ✅ Tests

- Increase timeout ([61741f4](https://github.com/unjs/nypm/commit/61741f4))

### ❤️ Contributors

- Pooya Parsa ([@pi0](http://github.com/pi0))
- Robin <robin.kehl@singular-it.de>
- Will K (pxslip) ([@pxslip](http://github.com/pxslip))
- Stephan De Vries ([@stephan281094](http://github.com/stephan281094))

## v0.4.1

[compare changes](https://github.com/unjs/nypm/compare/v0.4.0...v0.4.1)

### 🩹 Fixes

- **addDependency:** Compare `name` from resolved `package.json` ([#165](https://github.com/unjs/nypm/pull/165))

### ❤️ Contributors

- Daniel Roe ([@danielroe](http://github.com/danielroe))

## v0.4.0

[compare changes](https://github.com/unjs/nypm/compare/v0.3.12...v0.4.0)

### 🚀 Enhancements

- Experimental support for deno v2 ([#158](https://github.com/unjs/nypm/pull/158))

### 🔥 Performance

- ⚠️  Replace `execa` with `tinyexec` ([#151](https://github.com/unjs/nypm/pull/151))

### 🏡 Chore

- Update deps ([daa25d4](https://github.com/unjs/nypm/commit/daa25d4))
- Update eslint deps ([141a6a3](https://github.com/unjs/nypm/commit/141a6a3))
- Update readme ([2c8d761](https://github.com/unjs/nypm/commit/2c8d761))
- Update readme ([7ba6ebc](https://github.com/unjs/nypm/commit/7ba6ebc))
- Update tinyexec ([af2db8f](https://github.com/unjs/nypm/commit/af2db8f))
- Update readme ([171f7c9](https://github.com/unjs/nypm/commit/171f7c9))

#### ⚠️ Breaking Changes

- ⚠️  Replace `execa` with `tinyexec` ([#151](https://github.com/unjs/nypm/pull/151))

### ❤️ Contributors

- Pooya Parsa ([@pi0](http://github.com/pi0))
- Yasser Lahbibi ([@yassilah](http://github.com/yassilah))
- Pralkarz ([@ziebam](http://github.com/ziebam))

## v0.3.12

[compare changes](https://github.com/unjs/nypm/compare/v0.3.11...v0.3.12)

### 🚀 Enhancements

- Detect `bun.lock` ([#153](https://github.com/unjs/nypm/pull/153))

### 🏡 Chore

- Update dev dependencies ([1ef5ca0](https://github.com/unjs/nypm/commit/1ef5ca0))
- Update eslint config ([8cd67de](https://github.com/unjs/nypm/commit/8cd67de))

### ❤️ Contributors

- Pooya Parsa ([@pi0](http://github.com/pi0))

## v0.3.11

[compare changes](https://github.com/unjs/nypm/compare/v0.3.10...v0.3.11)

### 🩹 Fixes

- Correct yarn detection ([#140](https://github.com/unjs/nypm/pull/140))

### ❤️ Contributors

- Lennart <lekoarts@gmail.com>

## v0.3.10

[compare changes](https://github.com/unjs/nypm/compare/v0.3.9...v0.3.10)

### 🩹 Fixes

- Do not call `addDependency` with empty array ([#147](https://github.com/unjs/nypm/pull/147))

### 🏡 Chore

- Update link to nyan cat video ([#137](https://github.com/unjs/nypm/pull/137))
- Apply automated lint fixes ([909ac19](https://github.com/unjs/nypm/commit/909ac19))
- Update deps ([80b25a6](https://github.com/unjs/nypm/commit/80b25a6))
- Update vitest config ([8925eec](https://github.com/unjs/nypm/commit/8925eec))

### ❤️ Contributors

- Pooya Parsa ([@pi0](http://github.com/pi0))
- Daniel Roe ([@danielroe](http://github.com/danielroe))
- Matvey ([@ronanru](http://github.com/ronanru))

## v0.3.9

[compare changes](https://github.com/unjs/nypm/compare/v0.3.8...v0.3.9)

### 🚀 Enhancements

- Allow installing peerDeps when using `addDependency` ([#135](https://github.com/unjs/nypm/pull/135))
- **cli:** Support pnpm (rm, uninstall, un) aliases for removing packages ([#126](https://github.com/unjs/nypm/pull/126))
- Add option to install dependencies with a frozen lockfile ([#121](https://github.com/unjs/nypm/pull/121))

### 🩹 Fixes

- Use correct flag when getting pnpm workspace args ([#130](https://github.com/unjs/nypm/pull/130))

### 🏡 Chore

- Upgrade non-major deps ([91f062a](https://github.com/unjs/nypm/commit/91f062a))
- Upgrade to eslint v9 ([57890c8](https://github.com/unjs/nypm/commit/57890c8))
- Update pnpm to 9x ([1abaddf](https://github.com/unjs/nypm/commit/1abaddf))

### ❤️ Contributors

- Ryan Clements <ryanclementshax@gmail.com>
- Daniel Waltz ([@danielwaltz](http://github.com/danielwaltz))
- Damian Głowala ([@DamianGlowala](http://github.com/DamianGlowala))
- Pooya Parsa ([@pi0](http://github.com/pi0))
- Daniel Roe ([@danielroe](http://github.com/danielroe))

## v0.3.8

[compare changes](https://github.com/unjs/nypm/compare/v0.3.7...v0.3.8)

### 🚀 Enhancements

- Add `detect` command ([8fe78d1](https://github.com/unjs/nypm/commit/8fe78d1))

### 🩹 Fixes

- Findup until root from user `cwd` ([0309498](https://github.com/unjs/nypm/commit/0309498))

### 🏡 Chore

- Lint ([ee483e9](https://github.com/unjs/nypm/commit/ee483e9))

### ❤️ Contributors

- Pooya Parsa ([@pi0](http://github.com/pi0))

## v0.3.7

[compare changes](https://github.com/unjs/nypm/compare/v0.3.6...v0.3.7)

### 🚀 Enhancements

- Add global mode support ([#113](https://github.com/unjs/nypm/pull/113))
- Detect based on dlx command as fallback ([#117](https://github.com/unjs/nypm/pull/117))

### 🩹 Fixes

- **yarn:** Handle global for yarn 1.x only ([f5e4a39](https://github.com/unjs/nypm/commit/f5e4a39))

### 📖 Documentation

- Add jsdocs for `detectPackageManager` ([a7dfce7](https://github.com/unjs/nypm/commit/a7dfce7))

### 🏡 Chore

- Update deps ([d44ca3a](https://github.com/unjs/nypm/commit/d44ca3a))
- Update readme with automd ([d523b47](https://github.com/unjs/nypm/commit/d523b47))
- Update readme ([b36af77](https://github.com/unjs/nypm/commit/b36af77))
- Update deps ([9e69e36](https://github.com/unjs/nypm/commit/9e69e36))
- Fix lint/style issue ([e494591](https://github.com/unjs/nypm/commit/e494591))
- Update lockfile ([932be41](https://github.com/unjs/nypm/commit/932be41))

### ❤️ Contributors

- Pooya Parsa ([@pi0](http://github.com/pi0))
- Damian Głowala ([@DamianGlowala](http://github.com/DamianGlowala))

## v0.3.6

[compare changes](https://github.com/unjs/nypm/compare/v0.3.4...v0.3.6)

### 🚀 Enhancements

- Allow installing multiple dependencies ([#107](https://github.com/unjs/nypm/pull/107))

### 📦 Build

- **cli:** Only import required fields from `package.json` to the bundle ([591dd4d](https://github.com/unjs/nypm/commit/591dd4d))

### 🏡 Chore

- Update lockfile ([84d90d7](https://github.com/unjs/nypm/commit/84d90d7))

### 🤖 CI

- Increase timeout for windows ([da4a986](https://github.com/unjs/nypm/commit/da4a986))

### ❤️ Contributors

- Pooya Parsa ([@pi0](http://github.com/pi0))

## v0.3.4

[compare changes](https://github.com/unjs/nypm/compare/v0.3.3...v0.3.4)

### 🚀 Enhancements

- Allow specify `packageManager` by name ([5376aeb](https://github.com/unjs/nypm/commit/5376aeb))

### 🩹 Fixes

- **detectPackageManager:** Check parent dirs by default ([4cf3346](https://github.com/unjs/nypm/commit/4cf3346))

### 🏡 Chore

- Update dependencies ([0df4b12](https://github.com/unjs/nypm/commit/0df4b12))
- Include `bun.lockdb` in tests ([ffa2aee](https://github.com/unjs/nypm/commit/ffa2aee))

### ❤️ Contributors

- Pooya Parsa ([@pi0](http://github.com/pi0))

## v0.3.3

[compare changes](https://github.com/unjs/nypm/compare/v0.3.2...v0.3.3)

### 🚀 Enhancements

- Basic `nypm` cli ([#95](https://github.com/unjs/nypm/pull/95))

### 🩹 Fixes

- Fallback to local package manager when corepack not installed ([#94](https://github.com/unjs/nypm/pull/94))

### 🏡 Chore

- Update lockfile ([c32c998](https://github.com/unjs/nypm/commit/c32c998))

### ❤️ Contributors

- Pooya Parsa ([@pi0](http://github.com/pi0))

## v0.3.2

[compare changes](https://github.com/unjs/nypm/compare/v0.3.1...v0.3.2)

### 🩹 Fixes

- Remove extra `console.log` ([251c374](https://github.com/unjs/nypm/commit/251c374))
- Buffer stdio in silent mode ([b81da19](https://github.com/unjs/nypm/commit/b81da19))
- Pass appropriate workspace args and improve tests ([#90](https://github.com/unjs/nypm/pull/90))

### 🏡 Chore

- Set `git-checks: false` to allow publish ([af83d2d](https://github.com/unjs/nypm/commit/af83d2d))
- Update dependencies ([84357e0](https://github.com/unjs/nypm/commit/84357e0))

### ✅ Tests

- **bun:** Add `packageManager` field to allow tests passing ([a731666](https://github.com/unjs/nypm/commit/a731666))

### ❤️ Contributors

- Pooya Parsa ([@pi0](http://github.com/pi0))

## v0.3.1

[compare changes](https://github.com/unjs/nypm/compare/v0.3.0...v0.3.1)

### 🚀 Enhancements

- Add support for bun ([#87](https://github.com/unjs/nypm/pull/87))

### 🏡 Chore

- Apply automated lint fixes ([fa3405a](https://github.com/unjs/nypm/commit/fa3405a))
- Update dependencies ([c97e030](https://github.com/unjs/nypm/commit/c97e030))

### ❤️ Contributors

- Pooya Parsa ([@pi0](http://github.com/pi0))
- Daniel Roe <daniel@roe.dev>

## v0.3.0

[compare changes](https://github.com/unjs/nypm/compare/v0.2.2...v0.3.0)

### 💅 Refactors

- ⚠️  Improve library ([#75](https://github.com/unjs/nypm/pull/75))

### 📖 Documentation

- Fix typo ([#77](https://github.com/unjs/nypm/pull/77))

### 🏡 Chore

- Update badge ([#81](https://github.com/unjs/nypm/pull/81))
- Add autofix ci ([b326b98](https://github.com/unjs/nypm/commit/b326b98))
- Update ci node veriosion ([b048b6c](https://github.com/unjs/nypm/commit/b048b6c))
- Always ignore `.npm.loader.mjs` ([7bebeaf](https://github.com/unjs/nypm/commit/7bebeaf))
- Add `test:types` script ([a8a0c94](https://github.com/unjs/nypm/commit/a8a0c94))
- Update `.pnp.loader.mjs` snapshot ([10e10b0](https://github.com/unjs/nypm/commit/10e10b0))
- Update fixtures with autofix ci as well ([c16de18](https://github.com/unjs/nypm/commit/c16de18))
- Ignore `.pnp.cjs` as well ([c4c79bd](https://github.com/unjs/nypm/commit/c4c79bd))

### 🎨 Styles

- Format with prettier ([bb92395](https://github.com/unjs/nypm/commit/bb92395))
- Lint with prettier ([f3681a8](https://github.com/unjs/nypm/commit/f3681a8))

### 🤖 CI

- Run lint step only once ([333c077](https://github.com/unjs/nypm/commit/333c077))

#### ⚠️  Breaking Changes

- ⚠️  Improve library ([#75](https://github.com/unjs/nypm/pull/75))

### ❤️  Contributors

- Pooya Parsa ([@pi0](http://github.com/pi0))
- Damian Głowala ([@DamianGlowala](http://github.com/DamianGlowala))
- Luke Nelson <luke@nelson.zone>
- Adham Farrag <adham.farrag@hotmail.com>

## v0.2.2

[compare changes](https://github.com/unjs/nypm/compare/v0.2.1...v0.2.2)


### 🚀 Enhancements

  - Allow installing project dependencies ([#72](https://github.com/unjs/nypm/pull/72))

### 🏡 Chore

  - Update lockfile ([3c915d0](https://github.com/unjs/nypm/commit/3c915d0))
  - Update dependencies ([7e045be](https://github.com/unjs/nypm/commit/7e045be))

### ❤️  Contributors

- Damian Głowala 
- Pooya Parsa ([@pi0](http://github.com/pi0))

## v0.2.1

[compare changes](https://github.com/unjs/nypm/compare/v0.2.0...v0.2.1)


### 🩹 Fixes

  - **pkg:** Allow installing in node 20 ([#67](https://github.com/unjs/nypm/pull/67))
  - **pkg:** Simplify upper node version constraint ([#70](https://github.com/unjs/nypm/pull/70))

### 🏡 Chore

  - Update dev deps ([e975b93](https://github.com/unjs/nypm/commit/e975b93))
  - Format with prettier ([b5d55ff](https://github.com/unjs/nypm/commit/b5d55ff))

### ❤️  Contributors

- Pooya Parsa ([@pi0](http://github.com/pi0))
- Damian Głowala 
- Daniel Roe <daniel@roe.dev>

## v0.2.0

[compare changes](https://github.com/unjs/nypm/compare/v0.1.0...v0.2.0)


### 🚀 Enhancements

  - ⚠️  Refactor detection to support multi versions ([#42](https://github.com/unjs/nypm/pull/42))
  - Use execa for cross platform search path support ([#54](https://github.com/unjs/nypm/pull/54))
  - `removeDependency` and `addDevDependency` ([#55](https://github.com/unjs/nypm/pull/55))
  - Add workspace flag ([#57](https://github.com/unjs/nypm/pull/57))

### 🏡 Chore

  - Add egoist/dum to readme ([#21](https://github.com/unjs/nypm/pull/21))
  - Update dev dependencies ([6db58c4](https://github.com/unjs/nypm/commit/6db58c4))
  - Update lockfile ([ccbe0a5](https://github.com/unjs/nypm/commit/ccbe0a5))
  - Include yarn berry build in test fixtures ([cabbe7b](https://github.com/unjs/nypm/commit/cabbe7b))
  - Update release script ([f45608f](https://github.com/unjs/nypm/commit/f45608f))

### ✅ Tests

  - Add fixture for yarn berry version detect ([019a2ac](https://github.com/unjs/nypm/commit/019a2ac))
  - Disable silent to debug ([81975cd](https://github.com/unjs/nypm/commit/81975cd))

#### ⚠️  Breaking Changes

  - ⚠️  Refactor detection to support multi versions ([#42](https://github.com/unjs/nypm/pull/42))

### ❤️  Contributors

- Pooya Parsa ([@pi0](http://github.com/pi0))
- Christian Preston ([@cpreston321](http://github.com/cpreston321))
- Conner ([@Intevel](http://github.com/Intevel))
- Steven <steven@ceriously.com>

