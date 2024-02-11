/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: ["@marceloterreiro/eslint-config"],
  rules: {
    'import/order': 'off',
  }
};
