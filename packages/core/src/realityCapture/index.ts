/**
 * Reality capture — isomorphic functions that turn raw captures (point clouds and gaussian
 * splats) into the streamable octrees the viewer consumes.
 *
 * READING captures: {@link decodeLasStream} / {@link streamLasPoints} (LAS), {@link openE57}
 * (E57), and the `.ply` decoding inside {@link convertSplatToFqTree} (gaussian splats).
 *
 * BUILDING octrees: {@link buildPotreeOctree} (point clouds → Potree 2.0, streamed by the
 * viewer's `PointCloudLoader`) and {@link convertSplatToFqTree} (gaussian splats → an FQ LOD
 * tree, streamed by `SplatLoader`).
 *
 * BUILDING BIG octrees — a cloud too large to build in one worker is cut into tiles that are
 * built independently and grafted back together: {@link planPotreeTiles} decides the tiles,
 * {@link buildPotreeOctree}'s aligned-subtree (`grid`) mode builds each one, and
 * {@link mergePotreeTiles} stitches them into a single global tree without copying their bytes.
 *
 * Everything here is ENVIRONMENT-AGNOSTIC: it takes bytes/arrays plus options and returns
 * in-memory buffers. No `fs`, no `three`, no transport. Anything environment-specific is
 * INJECTED by the caller — an async iterable of chunks for LAS, a `readBytes` for E57, an
 * `encodeSpz` for {@link tileSplatToTiles} — so the same code runs in a cloud component, in a
 * Node script, and in the browser.
 */
export * from "./tile-splat.js";
export * from "./tile-potree.js";
export * from "./zip-3tz.js";
export * from "./hash.js";
export * from "./fq-codec.js";
export * from "./convert-splat-fq.js";
export * from "./las.js";
export * from "./e57.js";
export * from "./potree-grid.js";
export * from "./potree-plan.js";
export * from "./potree-merge.js";
