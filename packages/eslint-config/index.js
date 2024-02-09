// Copied from Cedric's repo: https://github.com/byCedric/expo-monorepo-example/blob/main/packages/eslint-config/index.js

module.exports = {
  extends: "eslint-config-universe",
  // do some additional things with it
  rules: {
    "prettier/prettier": ["error", { endOfLine: "auto" }],
  },
  // Disable import/namespace due to https://github.com/facebook/react-native/issues/28549
  // By setting delimiters to `\|/`, this ignore is supported on Windows too
  settings: {
    "import/ignore": ["node_modules(\\\\|/)react-native(\\\\|/)index\\.js$"],
  },
};
