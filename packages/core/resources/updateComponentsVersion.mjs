import * as fs from "fs";

const packageJsonPath = "./package.json";

const targetFilePath = "./src/core/Components/index.ts";

const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
const newVersion = packageJson.version;

const fileContent = fs.readFileSync(targetFilePath, "utf8");

const versionRegex = /static readonly release = "\d+\.\d+\.\d+";/;

const newContent = fileContent.replace(
  versionRegex,
  `static readonly release = "${newVersion}";`,
);

fs.writeFileSync(targetFilePath, newContent, "utf8");

console.log(`Version updated to ${newVersion} in ${targetFilePath}`);
