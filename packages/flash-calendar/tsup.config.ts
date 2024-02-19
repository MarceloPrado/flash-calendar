import { defineConfig } from "tsup";

const outDir = "dist";

export default defineConfig({
  entry: ["src/index.ts"],
  outDir,
  dts: false,
  sourcemap: true,
  clean: true,
  format: ["cjs", "esm"],
  external: ["react", "react-native", "react-native-web"],
  minify: true,
  noExternal: ["mitt"],
});
