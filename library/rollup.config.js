import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

export default {
  input: "dist/index.js",
  output: {
    file: "../examples/resources/components.js",
    format: "esm",
    inlineDynamicImports: true, // Necessary for jspdf
  },
  plugins: [nodeResolve(), commonjs()],
};
