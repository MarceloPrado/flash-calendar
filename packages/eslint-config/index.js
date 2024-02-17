const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");

/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: [
    "universe/native",
    "universe/shared/typescript-analysis",
    "eslint-config-turbo",
  ],
  parserOptions: {
    project,
  },
  settings: {
    "import/resolver": {
      typescript: {
        project,
      },
    },
  },
  rules: {
    "react-hooks/exhaustive-deps": "error",
    "turbo/no-undeclared-env-vars": "off",

    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/consistent-type-imports": "error",
    "@typescript-eslint/consistent-type-definitions": "error",

    "import/order": [
      "error",
      {
        "newlines-between": "always",
        pathGroups: [
          {
            pattern: "@/**",
            group: "external",
            position: "after",
          },
        ],
        distinctGroup: true,
      },
    ],
  },
};
