// Raw 3DGS .ply  ->  streamable splat-LOD tileset (the reality-capture tiling
// pipeline, ported into the library as an ISOMORPHIC function).
//
// Design (tuned for efficient streaming + render):
//  - REPLACE refinement with STANDALONE per-node subsamples: each node holds a
//    representative (size-biased) subset of ALL splats in its region; children
//    hold denser subsets; leaves hold everything. The renderer draws one cut
//    through the tree, so each region is drawn ONCE at the right detail — no ADD
//    overdraw stacking coarse levels under fine ones.
//  - Per-tile splat cap -> bounded tile size + visible count, fast first paint.
//  - SH truncation (shDegree, default 0): drop f_rest coeffs we don't render.
//  - Prune degenerate splats (near-zero scale / opacity).
//
// Each tile is emitted as SPZ by default (Niantic gaussian-splat compression,
// ~4x smaller than deg0 PLY). SPZ transcoding is the ONE environment-specific
// dependency: it is INJECTED via `options.encodeSpz` (the Node cloud component
// wires Spark's `transcodeSpz` + its DOM shim; a browser caller passes Spark
// directly). `format: "ply"` needs no encoder.

/** Transcodes a binary-little-endian 3DGS PLY tile into Niantic SPZ bytes. */
export type SpzEncoder = (
  plyBytes: Uint8Array,
) => Uint8Array | Promise<Uint8Array>;

/** Options for {@link tileSplatToTiles}. All optional except `encodeSpz` when SPZ. */
export interface SplatTileOptions {
  /** Tile encoding. Default `"spz"` (requires `encodeSpz`); `"ply"` needs no encoder. */
  format?: "spz" | "ply";
  /** Max splats per tile -> bounds tile size + visible count. Default 30000. */
  maxPerTile?: number;
  /** Max octree depth. Default 14. */
  depth?: number;
  /** Prune splats whose sigmoid(opacity) is below this. Default 0.02. */
  minOpacity?: number;
  /** Prune splats whose max exp(scale) is below this. Default 1e-6. */
  minScale?: number;
  /** Spherical-harmonics degree to keep (drops higher f_rest). Default 0. */
  shDegree?: 0 | 1 | 2 | 3;
  /** Progress callback (pct 0..100, message). */
  onProgress?: (pct: number, msg: string) => void;
  /** Injected SPZ transcoder — REQUIRED when `format` is `"spz"`. */
  encodeSpz?: SpzEncoder;
}

/** A produced tile: a RELATIVE `content.uri` and the encoded tile bytes. */
export interface SplatTile {
  uri: string;
  data: Uint8Array;
}

/** The result of tiling: a standard 3D-Tiles `tileset.json` object + the tiles. */
export interface SplatTileResult {
  /** Standard 3D-Tiles tileset (no `hiddenFiles` map — the caller adds that post-upload). */
  tileset: Record<string, any>;
  tiles: SplatTile[];
}

interface PlyProp {
  name: string;
  type: string;
  size: number;
  line: string;
  srcOff: number;
  dstOff: number;
}

interface OctNode {
  id: number;
  x0: number;
  y0: number;
  z0: number;
  x1: number;
  y1: number;
  z1: number;
  depth: number;
  keep: number[];
  children: OctNode[];
  bb?: {
    x0: number;
    y0: number;
    z0: number;
    x1: number;
    y1: number;
    z1: number;
  } | null;
}

const REST_FOR_DEG: Record<number, number> = { 0: 0, 1: 9, 2: 24, 3: 45 };
const TYPE_SIZE: Record<string, number> = {
  float: 4,
  float32: 4,
  double: 8,
  uchar: 1,
  uint8: 1,
  int: 4,
  uint: 4,
  short: 2,
  ushort: 2,
};
const textEncoder = new TextEncoder();

/** Index of the first occurrence of an ASCII `needle` within `bytes`, or -1. */
function indexOfAscii(bytes: Uint8Array, needle: string): number {
  const n = needle.length;
  const last = bytes.length - n;
  for (let i = 0; i <= last; i += 1) {
    let ok = true;
    for (let j = 0; j < n; j += 1) {
      if (bytes[i + j] !== needle.charCodeAt(j)) {
        ok = false;
        break;
      }
    }
    if (ok) return i;
  }
  return -1;
}

/** Decode `bytes[start..end)` as latin1 (1 byte = 1 code unit). */
function latin1(bytes: Uint8Array, start: number, end: number): string {
  let s = "";
  for (let i = start; i < end; i += 1) s += String.fromCharCode(bytes[i]);
  return s;
}

function concat(parts: Uint8Array[]): Uint8Array {
  let total = 0;
  for (const p of parts) total += p.length;
  const out = new Uint8Array(total);
  let o = 0;
  for (const p of parts) {
    out.set(p, o);
    o += p.length;
  }
  return out;
}

/**
 * Tile a binary-little-endian 3DGS PLY (`inputBytes`) into a streamable 3D-Tiles
 * octree, fully in memory. Returns the `tileset.json` object plus each tile as a
 * standalone `{ uri, data }` (relative `content.uri`, no `hiddenFiles` map — the
 * caller persists the tiles and fills that in).
 */
export async function tileSplatToTiles(
  inputBytes: Uint8Array,
  options: SplatTileOptions = {},
): Promise<SplatTileResult> {
  const FORMAT = (options.format || "spz").toLowerCase();
  const MAX_PER_TILE = Number(options.maxPerTile || 30_000);
  const DEEPEST_LEVEL = Number(options.depth || 14);
  const MIN_OPACITY = Number(options.minOpacity ?? 0.02);
  const SMALLEST_SCALE = Number(options.minScale ?? 1e-6);
  const SH_DEGREE = Number(options.shDegree ?? 0);
  const KEEP_REST = REST_FOR_DEG[SH_DEGREE] ?? 0;
  const onProgress =
    typeof options.onProgress === "function" ? options.onProgress : null;
  const report = (pct: number, msg: string) => {
    if (onProgress) onProgress(pct, msg);
  };
  const { encodeSpz } = options;
  if (FORMAT === "spz" && typeof encodeSpz !== "function") {
    throw new Error(
      'tileSplatToTiles: format "spz" requires an injected `encodeSpz` ' +
        "(e.g. wired to Spark's transcodeSpz). Pass `format: \"ply\"` to skip transcoding.",
    );
  }

  // ---- parse PLY header (from in-memory bytes) ------------------------------
  const data =
    inputBytes instanceof Uint8Array ? inputBytes : new Uint8Array(inputBytes);
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
  const marker = indexOfAscii(data, "end_header");
  if (marker < 0) throw new Error("no end_header in PLY");
  const headEnd = marker + "end_header\n".length;
  const headerText = latin1(data, 0, headEnd);
  if (!headerText.includes("binary_little_endian")) {
    throw new Error("only binary_little_endian PLY supported");
  }

  let count = 0;
  const props: PlyProp[] = [];
  for (const ln of headerText.split("\n")) {
    const t = ln.trim().split(/\s+/);
    if (t[0] === "element" && t[1] === "vertex") count = Number(t[2]);
    else if (t[0] === "property" && t[1] !== "list") {
      props.push({
        name: t[2],
        type: t[1],
        size: TYPE_SIZE[t[1]] ?? 4,
        line: ln,
        srcOff: 0,
        dstOff: 0,
      });
    }
  }
  let SRC_STRIDE = 0;
  const off: Record<string, number> = {};
  for (const p of props) {
    off[p.name] = SRC_STRIDE;
    p.srcOff = SRC_STRIDE;
    SRC_STRIDE += p.size;
  }
  for (const n of ["x", "y", "z", "opacity", "scale_0", "scale_1", "scale_2"]) {
    if (!(n in off)) throw new Error(`missing ${n}`);
  }

  const restIdx = (name: string) => {
    const m = /^f_rest_(\d+)$/.exec(name);
    return m ? Number(m[1]) : -1;
  };
  const kept = props.filter((p) => {
    const r = restIdx(p.name);
    return r < 0 || r < KEEP_REST;
  });
  let DST_STRIDE = 0;
  for (const p of kept) {
    p.dstOff = DST_STRIDE;
    DST_STRIDE += p.size;
  }
  report(10, `Parsing ${count} splats`);

  const rf = (i: number, name: string) =>
    view.getFloat32(headEnd + i * SRC_STRIDE + off[name], true);
  const sigmoid = (v: number) => 1 / (1 + Math.exp(-v));

  // ---- pass 1: bounds, size, prune ------------------------------------------
  let minX = Infinity;
  let minY = Infinity;
  let minZ = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  let maxZ = -Infinity;
  const size = new Float32Array(count);
  const valid: number[] = [];
  for (let i = 0; i < count; i += 1) {
    if (sigmoid(rf(i, "opacity")) < MIN_OPACITY) continue;
    const s = Math.max(
      Math.exp(rf(i, "scale_0")),
      Math.exp(rf(i, "scale_1")),
      Math.exp(rf(i, "scale_2")),
    );
    if (s < SMALLEST_SCALE) continue;
    const x = rf(i, "x");
    const y = rf(i, "y");
    const z = rf(i, "z");
    if (!Number.isFinite(x + y + z)) continue;
    size[i] = s;
    valid.push(i);
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
    if (z < minZ) minZ = z;
    if (z > maxZ) maxZ = z;
  }
  report(30, `Kept ${valid.length} splats after prune`);

  // size-desc so a node's first-N subsample is the largest (coarse-appropriate) splats
  valid.sort((a, b) => size[b] - size[a]);

  // ---- OCTREE build (split X, Y AND Z), REPLACE + standalone nodes ----------
  let nodeId = 0;
  const makeNode = (
    x0: number,
    y0: number,
    z0: number,
    x1: number,
    y1: number,
    z1: number,
    depth: number,
  ): OctNode => ({
    id: nodeId++,
    x0,
    y0,
    z0,
    x1,
    y1,
    z1,
    depth,
    keep: [],
    children: [],
  });
  const distribute = (node: OctNode, indices: number[]) => {
    if (indices.length <= MAX_PER_TILE || node.depth >= DEEPEST_LEVEL) {
      node.keep = indices; // leaf = full region
      return;
    }
    node.keep = indices.slice(0, MAX_PER_TILE); // standalone coarse representation (largest)
    const mx = (node.x0 + node.x1) / 2;
    const my = (node.y0 + node.y1) / 2;
    const mz = (node.z0 + node.z1) / 2;
    const q: number[][] = [[], [], [], [], [], [], [], []];
    for (let j = 0; j < indices.length; j += 1) {
      const i = indices[j];
      q[
        (rf(i, "x") >= mx ? 1 : 0) +
          (rf(i, "y") >= my ? 2 : 0) +
          (rf(i, "z") >= mz ? 4 : 0)
      ].push(i);
    }
    for (let c = 0; c < 8; c += 1) {
      if (!q[c].length) continue;
      const lowCX = c & 1 ? mx : node.x0;
      const highCX = c & 1 ? node.x1 : mx;
      const lowCY = c & 2 ? my : node.y0;
      const highCY = c & 2 ? node.y1 : my;
      const cz0 = c & 4 ? mz : node.z0;
      const cz1 = c & 4 ? node.z1 : mz;
      const child = makeNode(lowCX, lowCY, cz0, highCX, highCY, cz1, node.depth + 1);
      distribute(child, q[c]);
      node.children.push(child);
    }
  };
  const root = makeNode(minX, minY, minZ, maxX, maxY, maxZ, 0);
  distribute(root, valid);
  report(45, "Built octree");

  // ---- collect tiles in memory ----------------------------------------------
  const tiles: SplatTile[] = [];
  let tileCount = 0;

  const makeHeader = (n: number): Uint8Array => {
    const out = ["ply", "format binary_little_endian 1.0", `element vertex ${n}`];
    for (const p of kept) out.push(p.line.trim());
    out.push("end_header");
    return textEncoder.encode(`${out.join("\n")}\n`);
  };
  const writeTile = async (node: OctNode): Promise<string> => {
    const n = node.keep.length;
    const body = new Uint8Array(n * DST_STRIDE);
    // per-node ACTUAL 3D bounds over node.keep (the splats this tile renders).
    let lowBX = Infinity;
    let lowBY = Infinity;
    let bz0 = Infinity;
    let highBX = -Infinity;
    let highBY = -Infinity;
    let bz1 = -Infinity;
    for (let j = 0; j < n; j += 1) {
      const i = node.keep[j];
      const base = headEnd + i * SRC_STRIDE;
      const dbase = j * DST_STRIDE;
      for (const p of kept) {
        body.set(
          data.subarray(base + p.srcOff, base + p.srcOff + p.size),
          dbase + p.dstOff,
        );
      }
      const x = rf(i, "x");
      const y = rf(i, "y");
      const z = rf(i, "z");
      if (x < lowBX) lowBX = x;
      if (x > highBX) highBX = x;
      if (y < lowBY) lowBY = y;
      if (y > highBY) highBY = y;
      if (z < bz0) bz0 = z;
      if (z > bz1) bz1 = z;
    }
    node.bb = n ? { x0: lowBX, y0: lowBY, z0: bz0, x1: highBX, y1: highBY, z1: bz1 } : null;
    const ply = concat([makeHeader(n), body]); // valid 3DGS PLY for this node
    let fileNameText: string;
    let outBytes: Uint8Array;
    if (FORMAT === "spz") {
      outBytes = await (encodeSpz as SpzEncoder)(ply);
      fileNameText = `n${node.id}_d${node.depth}.spz`;
    } else {
      outBytes = ply;
      fileNameText = `n${node.id}_d${node.depth}.ply`;
    }
    tiles.push({ uri: `tiles/${fileNameText}`, data: outBytes });
    tileCount += 1;
    return fileNameText;
  };
  // geometricError from the node's real 3D extent (half the bbox diagonal); leaves = 0.
  // Monotonic-decreasing with depth -> correct REPLACE refinement.
  const geometricError = (node: OctNode): number => {
    if (node.children.length === 0 || !node.bb) return 0;
    const b = node.bb;
    return Math.hypot(b.x1 - b.x0, b.y1 - b.y0, b.z1 - b.z0) * 0.5;
  };
  const writeOut = async (node: OctNode): Promise<Record<string, any>> => {
    const fileNameText = await writeTile(node);
    const b =
      node.bb ||
      ({
        x0: node.x0,
        y0: node.y0,
        z0: node.z0,
        x1: node.x1,
        y1: node.y1,
        z1: node.z1,
      } as NonNullable<OctNode["bb"]>);
    const cx = (b.x0 + b.x1) / 2;
    const cy = (b.y0 + b.y1) / 2;
    const cz = (b.z0 + b.z1) / 2;
    const hx = Math.max(1e-4, (b.x1 - b.x0) / 2);
    const hy = Math.max(1e-4, (b.y1 - b.y0) / 2);
    const hz = Math.max(1e-4, (b.z1 - b.z0) / 2);
    const tile: Record<string, any> = {
      boundingVolume: { box: [cx, cy, cz, hx, 0, 0, 0, hy, 0, 0, 0, hz] },
      geometricError: geometricError(node),
      refine: "REPLACE",
      content: { uri: `tiles/${fileNameText}` },
    };
    if (node.children.length) {
      tile.children = await Promise.all(node.children.map(writeOut));
    }
    return tile;
  };
  report(50, FORMAT === "spz" ? "Transcoding tiles to SPZ" : "Writing tiles");
  const topTile = await writeOut(root);
  const tileset = {
    asset: { version: "1.0" },
    geometricError: geometricError(root) * 2,
    root: topTile,
  };
  report(85, `Built ${tileCount} tiles`);

  return { tileset, tiles };
}
