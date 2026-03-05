import { readFileSync } from "node:fs";
import { dirname } from "node:path";

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
      build.onLoad({ filter }, (args) => {
        if (args.path.includes("node_modules")) {
          return null;
        }

        const contents = readFileSync(args.path, "utf8");

        const transformResult = babel.transformSync(contents, {
          babelrc: false,
          configFile: false,
          presets: [
            ["@babel/preset-typescript", { isTSX: true, allExtensions: true }],
            ["@babel/preset-react", { runtime: "automatic" }],
          ],
          plugins: [[BabelPluginReactCompiler, { target: "19" }]],
          filename: args.path,
          sourceFileName: args.path,
          caller: {
            name: "react-compiler-esbuild-plugin",
            supportsStaticESM: true,
          },
          sourceMaps: "inline",
        });

        if (!transformResult?.code) {
          throw new Error(`react-compiler: no output for ${args.path}`);
        }

        return {
          contents: transformResult.code,
          loader: "js",
          resolveDir: dirname(args.path),
          watchFiles: [args.path],
        };
      });
    },
  };
}
