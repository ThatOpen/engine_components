/* eslint-disable import/no-extraneous-dependencies */
import dts from "vite-plugin-dts";
import { defineConfig } from "vite";
import { resolve } from "path";
import * as packageJson from "./package.json";

export default defineConfig({
  build: {
    copyPublicDir: false,
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      formats: ["es"],
    },
    rollupOptions: {
      external: Object.keys(packageJson.peerDependencies),
      output: {
        assetFileNames: "assets/[name][extname]",
        entryFileNames: "[name].js",
        globals: {
          three: "THREE",
          "bim-fragment": "FRAGS",
          "web-ifc": "WEB-IFC",
        },
      },
    },
  },
  plugins: [dts({ include: ["src"] })],
});
