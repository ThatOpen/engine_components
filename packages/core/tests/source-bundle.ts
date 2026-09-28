/* eslint-disable import/no-extraneous-dependencies */
import { build } from "esbuild";
import * as fs from "fs";
import * as path from "path";
import { pathToFileURL } from "url";

/**
 * Loads the package from its current sources as ONE module.
 *
 * Why: the sources form import cycles through their barrels
 * (`core/Types` <-> `core/Components` <-> `fragments` <-> `utils`). The
 * browser and the library build resolve them, because native ESM re-exports
 * are live bindings and rollup orders a single scope. Vite's module runner,
 * which vitest runs tests through, is not: an `export *` of a module that is
 * still evaluating copies only the names defined so far, so e.g. `Disposer`
 * reads `Component` from a half-filled `core/Types` and throws "Class extends
 * value undefined". Any test that needs `Components` itself hits it.
 *
 * Bundling `src/index.ts` with esbuild gives the same single-scope ordering
 * as the published build, from the sources as they are right now, so a test
 * can use the real `Components`. Dependencies stay external, so `three` and
 * `@thatopen/fragments` are the same instances the test file imports.
 *
 * Tests that only need a leaf module should import it directly instead, as
 * the FastModelPicker suite does; this is for tests that need the graph.
 */
export async function loadSourceBundle(): Promise<
  typeof import("../src/index")
> {
  const root = path.resolve(__dirname, "..");
  // Inside the package, so bare imports resolve from its node_modules.
  const dir = path.join(root, "node_modules", ".source-bundle");
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(
    dir,
    `index-${process.pid}-${Date.now()}-${Math.random().toString(36).slice(2)}.mjs`,
  );
  await build({
    entryPoints: [path.join(root, "src", "index.ts")],
    outfile: file,
    bundle: true,
    format: "esm",
    platform: "neutral",
    packages: "external",
    sourcemap: "inline",
    logLevel: "silent",
  });
  try {
    return await import(/* @vite-ignore */ pathToFileURL(file).href);
  } finally {
    fs.rmSync(file, { force: true });
  }
}
