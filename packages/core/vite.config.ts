/* eslint-disable import/no-extraneous-dependencies */
import dts from "vite-plugin-dts";
import { defineConfig } from "vite";
import * as path from "path";
import * as fs from "fs";
import * as packageJson from "./package.json";

const generateTSNamespace = (dts: Map<string, string>) => {
  if (!fs.existsSync("./dist")) return;
  console.log("Generating namespace!");
  let types = "";
  dts.forEach((declaration) => {
    const cleanedType = declaration
      .replace(/export\s+\*?\s+from\s+"[^"]+";/g, "")
      .replace(/^\s*[\r\n]/gm, "")
      .replace(/`/g, "'");
    types += cleanedType;
  });
  fs.writeFileSync(
    "./dist/namespace.d.ts",
    `declare namespace OBC {\n${types}\n}`,
  );
};

export default defineConfig({
  build: {
    outDir: "./dist",
    lib: {
      entry: path.resolve(__dirname, "./src/index.ts"),
      formats: ["es", "cjs"],
      fileName: (format) => {
        const map = {
          cjs: "cjs",
          es: "mjs",
        };
        return `index.${map[format]}`;
      },
    },
    rollupOptions: {
      external: Object.keys(packageJson.peerDependencies),
      output: {
        globals: {
          three: "THREE",
          "@thatopen/fragments": "FRAGS",
          "web-ifc": "WEB-IFC",
        },
      },
    },
  },
  plugins: [
    dts({
      include: ["./src"],
      exclude: ["./src/**/example.ts", "./src/**/*.test.ts"],
      afterBuild: generateTSNamespace,
    }),
  ],
});
