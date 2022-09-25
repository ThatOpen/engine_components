import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

// This creates the bundle used by the examples
export default {
  input: "dist/index.js",
  external: ["three"], // so it's not included
  output: {
    file: "../examples/resources/openbim-components.js",
    format: "esm",
    inlineDynamicImports: true, // Necessary for jspdf
    paths: {
      three: "./three.module.js",
    },
  },
  plugins: [nodeResolve(), commonjs()],
};
