/* eslint-disable import/no-extraneous-dependencies */
import * as fs from "fs";
import * as path from "path";
import { defineConfig } from "vite";
import { globSync } from "glob";

const writeIndexHTML = () => {
  let links: string = "";
  const examplePaths = globSync("packages/**/src/**/example.html");
  for (const examplePath of examplePaths) {
    const directory = path.dirname(examplePath);
    const packageNameMatch = directory.match(/packages\\([^\\]+)/);
    if (!(packageNameMatch && packageNameMatch.length > 1)) continue;
    const packageName = packageNameMatch[1];
    const exampleName = path.basename(directory);
    links += `<a style="width: fit-content;" href="./${examplePath}">${packageName}/${exampleName}</a>\n`;
  }
  const index = `
  <!DOCTYPE html>
  <html lang="en">
  
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Examples Index</title>
    <style>
      * {
        margin: 0;
      }
  
      html {
        font-family: sans-serif;
      }
  
      body {
        padding: 1rem;
      }
    </style> 
  </head>
  
  <body>
    <div style="display: flex; flex-direction: column; gap: 1rem;">
      <h3>Choose an example</h3>
      ${links}
    </div>
  </body>
  
  </html>
      `;
  fs.writeFileSync("./index.html", index);
};

const createIndex = () => ({
  name: "create-index",
  configureServer() {
    // fs.watch("./packages", { recursive: true }, writeIndexHTML);
    writeIndexHTML();
  },
});

export default defineConfig({
  plugins: [createIndex()],
});
