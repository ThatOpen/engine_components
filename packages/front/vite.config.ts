/* eslint-disable import/no-extraneous-dependencies */
import dts from "vite-plugin-dts";
import { defineConfig } from "vite";
import * as path from "path";
import pluginTerser from "@rollup/plugin-terser";
import * as packageJson from "./package.json";

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "./src/index.ts"),
    },
    rollupOptions: {
      external: Object.keys(packageJson.peerDependencies),
      output: [
        {
          entryFileNames: `index.js`,
          format: "es",
          globals: {
            three: "THREE",
            "@thatopen/fragments": "FRAGS",
            "@thatopen/components": "OBC",
            "web-ifc": "WEB-IFC",
          },
        },
        {
          entryFileNames: `index.min.js`,
          plugins: [pluginTerser()],
          format: "es",
          globals: {
            three: "THREE",
            "@thatopen/fragments": "FRAGS",
            "@thatopen/components": "OBC",
            "web-ifc": "WEB-IFC",
          },
        },
      ],
    },
  },
  plugins: [
    dts({
      rollupTypes: true,
    }),
  ],
});
