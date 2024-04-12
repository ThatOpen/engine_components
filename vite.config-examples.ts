/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from "vite";
import * as path from "path";
import * as fs from "fs";
import { globSync } from "glob";

const restructureExamples = () => {
  return {
    name: "examples-refactor",
    async writeBundle() {
      const outDir = "examples/packages";
      const files = globSync(`${outDir}/**/example.html`);

      for (const file of files) {
        const directory = path.dirname(file);
        const exampleName = path.basename(directory);
        const rootFolder = directory.split(path.sep)[0];
        const targetDirectory = path.join(rootFolder, exampleName);
        if (!fs.existsSync(targetDirectory)) fs.mkdirSync(targetDirectory);

        const buffer = fs.readFileSync(file);
        const newBuffer = buffer
          .toString()
          .replace(/(\.\.\/)+assets/g, "../assets")
          .replace(/(\.\.\/)+resources/g, "../../resources");
        fs.writeFileSync(path.join(targetDirectory, "index.html"), newBuffer);
      }

      if (fs.existsSync(outDir)) fs.rmSync(outDir, { recursive: true });
    },
  };
};

const entries = globSync("packages/**/src/**/example.html").map((file) => {
  const directory = path.dirname(file);
  const exampleName = path.basename(directory);
  const fixedName = exampleName[0].toLowerCase() + exampleName.slice(1);
  const entry = [fixedName, path.resolve(file)];
  return entry;
});

const input = Object.fromEntries(entries);

export default defineConfig({
  base: "./",
  esbuild: {
    supported: {
      "top-level-await": true,
    },
  },
  build: {
    outDir: "./examples",
    rollupOptions: {
      input,
      output: {
        entryFileNames: "assets/[name].js",
      },
    },
  },
  plugins: [restructureExamples()],
});
