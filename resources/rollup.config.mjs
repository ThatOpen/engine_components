import { nodeResolve } from "@rollup/plugin-node-resolve";
import extensions from './rollup-extensions.mjs';
import commonjs from "@rollup/plugin-commonjs";

// This creates the bundle used by the examples
export default {
	input: "dist/index.js",
	output: {
		file: "./resources/openbim-components.js",
		format: "esm",
	},
	plugins: [
		extensions({
			extensions: [ '.js' ],
		}),
		nodeResolve(),
		commonjs()
	],
};
