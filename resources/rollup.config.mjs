import { nodeResolve } from "@rollup/plugin-node-resolve";
import extensions from './rollup-extensions.mjs';
import commonjs from "@rollup/plugin-commonjs";

// This creates the bundle used by the examples
export default {
	input: "dist/index.js",
	output: {
		file: "./resources/openbim-components.js",
		format: "esm",
		paths: {
			three: "https://unpkg.com/three@0.152.2/build/three.module.js",
		},
	},
	external: ["three"], // so it's not included
	plugins: [
		extensions({
			extensions: [ '.js' ],
		}),
		nodeResolve(),
		commonjs()
	],
};
