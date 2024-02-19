/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: ["@marceloterreiro/eslint-config"],
  rules: {
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
        distinctGroup: false,
      },
    ],
  },
};
