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
      external: (id) => {
        const peers = Object.keys(packageJson.peerDependencies);
        return peers.some((p) => id === p || id.startsWith(`${p}/`));
      },
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
      // This overrides tsconfig-build.json's exclude rather than adding to
      // it, so the example files have to be repeated here or they come back
      // in and report TS2307 for their doc-only imports.
      exclude: [
        "node_modules/**",
        "./src/**/example.ts",
        "./src/**/*.test.ts",
        "./src/**/*.spec.ts",
      ],
    }),
  ],
});
