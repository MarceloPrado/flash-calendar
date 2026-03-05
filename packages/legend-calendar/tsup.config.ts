import { defineConfig } from "tsup";

import { reactCompilerEsbuildPlugin } from "./src/build/reactCompilerPlugin";

const outDir = "dist";

export default defineConfig({
  entry: ["src/index.ts"],
  outDir,
  dts: false,
  sourcemap: true,
  clean: true,
  format: ["cjs", "esm"],
  external: ["react", "react-native", "react-native-web"],
  minify: false,
  esbuildPlugins: [reactCompilerEsbuildPlugin({ filter: /\.[jt]sx?$/ })],
});
