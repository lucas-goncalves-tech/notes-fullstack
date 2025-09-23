// eslint.config.mjs
import tseslint from "typescript-eslint";
import prettier from "eslint-plugin-prettier";

export default [
  ...tseslint.configs.recommended,
  {
    ignores: ["dist"],
    plugins: { prettier },
    rules: {
      "no-console": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
    },
  },
];
