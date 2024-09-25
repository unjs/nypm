import unjs from "eslint-config-unjs";

// https://github.com/unjs/eslint-config
export default unjs({
  ignores: ["test/fixtures/**"],
  rules: {
    "@typescript-eslint/no-require-imports": 0,
  },
});
