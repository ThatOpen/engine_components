import { build } from "esbuild";
import { spawnSync } from "node:child_process";
import { mkdir, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const output = new URL(
  "../node_modules/.cache/isolation-tests/",
  import.meta.url,
);
await mkdir(output, { recursive: true });
const filename = fileURLToPath(new URL("test.mjs", output));
try {
  await build({
    absWorkingDir: root,
    entryPoints: ["tests/highlighter-isolation.test.ts"],
    bundle: true,
    platform: "node",
    format: "esm",
    external: ["three", "@thatopen/*"],
    outfile: filename,
  });
  const result = spawnSync(process.execPath, ["--test", filename], {
    stdio: "inherit",
    timeout: 30000,
  });
  if (result.error) throw result.error;
  process.exitCode = result.status ?? 1;
} finally {
  await rm(filename, { force: true });
}
