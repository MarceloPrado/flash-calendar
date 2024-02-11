/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: ["@marceloterreiro/eslint-config", "plugin:react-hooks/recommended"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
  },
  rules: {
    "react-hooks/exhaustive-deps": "error",
  },
};
