/* eslint-env node */
const path = require("path");

const withStorybook = require("@storybook/react-native/metro/withStorybook");
const { getDefaultConfig } = require("expo/metro-config");

// Find the project and workspace directories
const projectRoot = __dirname;
// This can be replaced with `find-yarn-workspace-root`
const monorepoRoot = path.resolve(projectRoot, "../..");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(projectRoot);

// 1. Watch all files within the monorepo
config.watchFolders = [monorepoRoot];
// 2. Let Metro know where to resolve packages and in what order
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(monorepoRoot, "node_modules"),
];

// Storybook setup
config.transformer.unstable_allowRequireContext = true;

module.exports = withStorybook(config, {
  enabled: true,
  // Path to your storybook config
  configPath: path.resolve(__dirname, "./.rnstorybook"),
});
