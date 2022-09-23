import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

// This creates the bundle used by the examples
export default {
  input: "dist/index.js",
  output: {
    file: "../examples/resources/openbim-components.js",
    format: "esm",
    inlineDynamicImports: true, // Necessary for jspdf
  },
  plugins: [nodeResolve(), commonjs()],
};
