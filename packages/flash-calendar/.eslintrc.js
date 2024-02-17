/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: ["@marceloterreiro/eslint-config"],
  rules: {
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          {
            group: ["date-fns"],
            message:
              "Please use the custom date functions from @/helpers/dates instead. This decreases the bundle size significantly.",
          },
        ],
      },
    ],
  },

  // Allow date-fns imports in test files since we use them to test our custom date functions
  overrides: [
    {
      files: ["**/*.test.ts", "**/*.test.tsx", "**/*.stories.tsx"],
      rules: {
        "no-restricted-imports": ["error", { patterns: [] }],
      },
    },
  ],
};
