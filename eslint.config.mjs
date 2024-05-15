import unjs from 'eslint-config-unjs';

export default unjs(
    {
        ignores: [
            "test/fixtures/yarn-berry-workspace/.pnp.loader.mjs",
            "test/fixtures/yarn-berry/.pnp.loader.mjs"
        ]
    },
    {
        rules: {
            "unicorn/no-null": 0
        }
    }
)