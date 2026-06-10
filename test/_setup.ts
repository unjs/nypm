// Strip inherited `YARN_*` environment variables so that fixtures only honor
// their own `.yarnrc.yml`. CI/sandbox environments may inject Yarn config via
// `YARN_*` vars (e.g. `YARN_NPM_MINIMAL_AGE_GATE`), and older Yarn versions
// pinned by the fixtures hard-error on settings they don't recognize.
for (const key of Object.keys(process.env)) {
  if (key.startsWith("YARN_")) {
    delete process.env[key];
  }
}
