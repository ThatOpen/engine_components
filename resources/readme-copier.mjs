import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const targetPackages = ["core", "front"];

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

for (const dir of targetPackages) {
  // Get paths relative to this script
  const rootDir = path.resolve(__dirname, "..");
  const sourceReadme = path.join(rootDir, "README.md");
  const targetReadme = path.join(rootDir, "packages", dir, "README.md");

  // Copy the README file
  try {
    fs.copyFileSync(sourceReadme, targetReadme);
    console.log(`README.md successfully copied to packages/${dir}/`);
  } catch (err) {
    console.error("Error copying README.md:", err);
    process.exit(1);
  }
}
