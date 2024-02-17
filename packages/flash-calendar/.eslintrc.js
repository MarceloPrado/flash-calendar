/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: ["@marceloterreiro/eslint-config"],
  rules: {
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          // {
          //   group: ["date-fns"],
          //   importNames: ["startOfMonth", "startOfWeek"],
          //   message:
          //     "Please use the respective function from @/helpers/dates instead.",
          // },
          {
            group: ["date-fns"],
            importNames: ["add", "sub"],
            message:
              "Please use `addDays`, `addWeeks`, `subDays`, `subWeeks` instead for smaller bundles.",
          },
        ],
      },
    ],
  },
};
