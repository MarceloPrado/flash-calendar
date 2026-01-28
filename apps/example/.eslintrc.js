/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: ["@lazerlen/eslint-config"],
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
