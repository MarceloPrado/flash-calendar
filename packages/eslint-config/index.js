const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");

/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: [
    "eslint:recommended",
    "eslint-config-turbo",
    "universe/native",
    "universe/shared/typescript-analysis",
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

    // Alphabetical order for props and params
    "react/jsx-sort-props": "error",

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
