/* eslint-disable import/no-extraneous-dependencies */

/**
 * Runs before every test file, in that file's own environment.
 *
 * The default environment is node, because most of the suite is plain logic
 * over three and fragments objects. A file that needs a DOM opts in with
 *
 *   // @vitest-environment happy-dom
 *
 * as its first line.
 * The canvas mock and the web-worker shim both patch browser globals, so they
 * follow that opt-in rather than being installed over a node environment.
 * happy-dom returns `null` from `getContext("2d")` and has no `Worker`; the
 * mock supplies a context that records what was drawn, which is what makes
 * canvas snapshots possible, and the shim runs workers on the main thread.
 */
if (typeof window !== "undefined") {
  await import("vitest-canvas-mock");
  const { defineWebWorkers } = await import("@vitest/web-worker/pure");
  defineWebWorkers();
}

export {};
