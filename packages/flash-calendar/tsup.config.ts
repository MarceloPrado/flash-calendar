import { defineConfig } from "tsup";

const outDir = "dist";

export default defineConfig({
  entry: ["src/index.ts"],
  outDir,
  dts: false,
  sourcemap: true,
  clean: true,
  external: ["react", "react-native", "react-native-web"],
});
