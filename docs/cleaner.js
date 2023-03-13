const fs = require("fs");

fs.rmSync("dist", { recursive: true, force: true });
fs.mkdirSync("dist");