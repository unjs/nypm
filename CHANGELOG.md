# Changelog


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

