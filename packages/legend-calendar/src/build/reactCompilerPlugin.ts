import { readFileSync } from "node:fs";

import * as babel from "@babel/core";
import BabelPluginReactCompiler from "babel-plugin-react-compiler";
import type { Plugin } from "esbuild";

export function reactCompilerEsbuildPlugin({
  filter,
}: {
  filter: RegExp;
}): Plugin {
  return {
    name: "react-compiler",
    setup(build) {
      build.onLoad({ filter, namespace: "" }, (args) => {
        const contents = readFileSync(args.path, "utf8");

        const transformResult = babel.transformSync(contents, {
          presets: [
            ["@babel/preset-typescript", { isTSX: true, allExtensions: true }],
            ["@babel/preset-react", { runtime: "automatic" }],
          ],
          plugins: [[BabelPluginReactCompiler]],
          filename: args.path,
          caller: {
            name: "react-compiler-esbuild-plugin",
            supportsStaticESM: true,
          },
          sourceMaps: false,
        });

        return {
          contents: transformResult?.code ?? undefined,
          loader: "js",
        };
      });
    },
  };
}
