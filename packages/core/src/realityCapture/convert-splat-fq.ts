// Raw 3DGS splat  ->  streamable FQ splat-LOD tree (lod-meta.json + .fq node blobs).
//
// The CPU-only, GPU-free, no-disk-scratch replacement for the splat-transform pipeline: it
// runs single-core in a memory-bounded cloud component. It produces the SAME manifest the
// SplatLoader streams (lodtree.ts `LodMeta`), but each node is one flat-quant `.fq` blob
// (see fq-codec.ts) instead of a SOG WebP bundle — so NO WebP, NO k-means, NO GPU.
//
// Input: a binary-little-endian 3DGS PLY, either plain INRIA (`property float x/…/rot_3`) or
// PlayCanvas `compressed.ply` (bit-packed chunk+vertex) — the two common splat exports. Both
// decode to the same in-memory gaussian arrays (centers, LINEAR scales, xyzw quats, rgba 0..1),
// via the SAME math the loader uses (SplatLoader/gsplat/ply.ts parsePly / parseCompressedPly).
//
// Structure (mirrors splat-transform's output that the loader already consumes):
//   - Octree-partition space into LEAF cells (subdivide until <= maxPerLeaf).
//   - Per leaf, emit `lodLevels` STANDALONE subsamples: lod 0 = all gaussians in the cell,
//     each coarser lod = a size-biased (largest-first) half. The loader draws exactly ONE lod
//     per leaf, so every lod must stand alone (lod 0 = full detail, safe).
//   - Each (leaf, lod) is one `.fq` file; the leaf references it as {file, offset:0, count}.
//   - Node bounds are in ORIGINAL splat space (pre Y-up flip); the loader's buildManifest flips
//     them, exactly as for SOG.
//
// AGNOSTIC: takes bytes, returns in-memory buffers + a manifest object. No three, no Node, no
// platform refs. A cloud component persists `files` (→ hidden files / S3) and the manifest.

import { packFqChunk, packShChunk, packShCoeff, shCoeffCount, type SplatBatch } from "./fq-codec.js";

export interface FqTreeOptions {
  /** Subdivide the octree until a cell holds <= this many gaussians. Default 200_000. */
  maxPerLeaf?: number;
  /** Max octree depth (safety bound). Default 12. */
  maxDepth?: number;
  /** Number of LOD levels per leaf (lod 0 = finest/all). Default 4. */
  lodLevels?: number;
  /** Prune gaussians whose alpha (opacity) is below this. Default 0.02. */
  minOpacity?: number;
  /** Prune gaussians whose max linear scale is below this. Default 1e-6. */
  minScale?: number;
  /** Spherical-harmonic bands to emit as `.sh` sidecars, when the source PLY carries them
   * (`f_rest_*`). 0 = none (flat colour, the pre-SH behaviour); 1 = degree 1. Default 1.
   * Costs ~9 bytes/splat on top of FQC1's 16 — the viewer streams it only on demand. */
  shBands?: number;
  /** Coarsest LOD level that still gets a `.sh` sidecar. Default 0: only the FINEST level.
   *
   * A leaf renders its finest level only when it is close to the camera, and the view-dependent
   * term is imperceptible at range — the same reasoning behind the viewer's `shMaxDistance`. So
   * shipping SH for the coarse levels buys nothing you can see and costs real bytes: on the FCC
   * capture the levels hold 6.22M / 3.11M / 1.56M / 0.78M splats, so restricting sidecars to
   * level 0 drops 47% of the SH payload. Raise it if you want the effect to persist further out.
   * The loader needs no matching change: a leaf with no sidecar simply renders flat. */
  shMaxLod?: number;
  /** Store ONE spherical-harmonic coefficient per basis (the mean of the three colour channels)
   * instead of three. Specular response in a built environment is close to achromatic, so this
   * costs the tint of a highlight and nothing else, while cutting the sidecar from 9 to 3 bytes
   * per splat. Off by default: it is a quality trade, not a free win. Emits its own SHQM magic,
   * so a reader that predates it falls back to flat colour rather than misreading the data. */
  shMono?: boolean;
  /** Progress callback (pct 0..100, message). */
  onProgress?: (pct: number, msg: string) => void;
}

export interface FqTreeFile {
  /** Relative path used as the manifest `filenames[]` entry, e.g. "n3_l0.fq". */
  name: string;
  bytes: Uint8Array;
}

export interface FqTreeResult {
  /** The lod-meta.json object (top-level `format: "fq"`). */
  manifest: Record<string, unknown>;
  /** Every node blob — the `.fq` bodies plus any `.sh` SH sidecars; persist each and serve at
   * `<baseUrl>/<name>`. The manifest addresses them by name, so the order here doesn't matter. */
  files: FqTreeFile[];
}

/** Post-parse gaussian arrays (LINEAR scales, xyzw quats, rgba 0..1) — the packFqChunk form. */
interface Gaussians {
  count: number;
  centers: Float32Array; // N*3
  scales: Float32Array; // N*3, linear
  quats: Float32Array; // N*4, (x,y,z,w)
  colors: Float32Array; // N*4, (r,g,b,a) 0..1
  /** ALREADY-QUANTIZED SH rest coefficients, N*shCoeffCount(shBands) bytes, in the SHQ1 layout
   * (basis-major, rgb interleaved). Quantized at parse time so a 6M-splat scene costs 56 MB here
   * instead of 224 MB of floats. `null` when the source carries no `f_rest_*` (or SH is off). */
  sh: Uint8Array | null;
  shBands: number;
  /** true when `sh` holds ONE coefficient per basis (averaged across rgb) instead of three. */
  shMono: boolean;
}

const SH_C0 = 0.28209479177387814;
const unitClamp = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
const sigmoid = (v: number) => 1 / (1 + Math.exp(-v));
const TYPE_SIZE: Record<string, number> = {
  float: 4, float32: 4, double: 8, uchar: 1, uint8: 1, int: 4, uint: 4, short: 2, ushort: 2,
};

function indexOfAscii(bytes: Uint8Array, needle: string): number {
  const n = needle.length, last = bytes.length - n;
  for (let i = 0; i <= last; i += 1) {
    let ok = true;
    for (let j = 0; j < n; j += 1) if (bytes[i + j] !== needle.charCodeAt(j)) { ok = false; break; }
    if (ok) return i;
  }
  return -1;
}
function latin1(bytes: Uint8Array, s: number, e: number): string {
  let out = ""; for (let i = s; i < e; i += 1) out += String.fromCharCode(bytes[i]); return out;
}
function headerEndOf(bytes: Uint8Array): number {
  const m = indexOfAscii(bytes, "end_header");
  if (m < 0) throw new Error("no end_header in PLY");
  let k = m + "end_header".length;
  while (k < bytes.length && bytes[k] !== 0x0a) k += 1; // skip \r and to \n
  return k + 1;
}

/** Decode a plain INRIA binary_little_endian 3DGS PLY → gaussian arrays.
 *
 * `wantShBands` > 0 additionally lifts the degree-1 SH rest coefficients out of `f_rest_*`.
 * INRIA writes those CHANNEL-MAJOR: `_features_rest` is (N, K, 3), saved transposed to (N, 3, K)
 * and flattened, so `f_rest_{c*K + k}` is channel c (0=R,1=G,2=B), basis k. K is 3/8/15 for
 * degree 1/2/3 — derive it from the property COUNT rather than assuming degree 3, or a
 * degree-1 export reads its green channel as red's higher bands. */
function parsePlain(data: Uint8Array, headEnd: number, header: string, wantShBands = 0, mono = false): Gaussians {
  let count = 0;
  const props: { name: string; size: number }[] = [];
  const off: Record<string, number> = {};
  for (const ln of header.split("\n")) {
    const t = ln.trim().split(/\s+/);
    if (t[0] === "element" && t[1] === "vertex") count = Number(t[2]);
    else if (t[0] === "property" && t[1] !== "list") props.push({ name: t[2], size: TYPE_SIZE[t[1]] ?? 4 });
  }
  let stride = 0;
  for (const p of props) { off[p.name] = stride; stride += p.size; }
  for (const n of ["x", "y", "z", "opacity", "scale_0", "scale_1", "scale_2", "rot_0", "rot_1", "rot_2", "rot_3", "f_dc_0", "f_dc_1", "f_dc_2"]) {
    if (!(n in off)) throw new Error(`missing property ${n}`);
  }
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
  const rf = (i: number, name: string) => view.getFloat32(headEnd + i * stride + off[name], true);

  // SH rest: K bases per channel, of which we keep the first `bands == 1 ? 3 : 0`.
  const nRest = props.filter((p) => /^f_rest_\d+$/.test(p.name)).length;
  const K = nRest / 3;
  const bands = wantShBands >= 1 && nRest > 0 && Number.isInteger(K) && K >= 3 ? 1 : 0;
  const per = shCoeffCount(bands, mono);
  // Byte offsets for the 9 coefficients we keep, in SHQ1 order (basis-major, rgb interleaved).
  // In mono mode the three channels of each basis are AVERAGED here, on the raw floats, rather
  // than after quantization — averaging quantized bytes would stack a second rounding on top.
  // The mean (not a luminance weighting) is what preserves the total r+g+b the term contributes.
  const shOff: number[] = [];
  for (let k = 0; k < 3 && bands; k += 1) {
    for (let c = 0; c < 3; c += 1) shOff.push(off[`f_rest_${c * K + k}`]);
  }

  const g: Gaussians = {
    count,
    centers: new Float32Array(count * 3),
    scales: new Float32Array(count * 3),
    quats: new Float32Array(count * 4),
    colors: new Float32Array(count * 4),
    sh: bands ? new Uint8Array(count * per) : null,
    shBands: bands,
    shMono: mono && bands > 0,
  };
  for (let i = 0; i < count; i += 1) {
    if (g.sh) {
      const row = headEnd + i * stride, dst = i * per;
      if (mono) {
        for (let k = 0; k < 3; k += 1) {
          const r = view.getFloat32(row + shOff[k * 3], true);
          const gr = view.getFloat32(row + shOff[k * 3 + 1], true);
          const bl = view.getFloat32(row + shOff[k * 3 + 2], true);
          g.sh[dst + k] = packShCoeff((r + gr + bl) / 3);
        }
      } else {
        for (let j = 0; j < per; j += 1) g.sh[dst + j] = packShCoeff(view.getFloat32(row + shOff[j], true));
      }
    }
    g.centers[i * 3] = rf(i, "x"); g.centers[i * 3 + 1] = rf(i, "y"); g.centers[i * 3 + 2] = rf(i, "z");
    g.scales[i * 3] = Math.exp(rf(i, "scale_0")); g.scales[i * 3 + 1] = Math.exp(rf(i, "scale_1")); g.scales[i * 3 + 2] = Math.exp(rf(i, "scale_2"));
    const qw = rf(i, "rot_0"), qx = rf(i, "rot_1"), qy = rf(i, "rot_2"), qz = rf(i, "rot_3");
    const l = Math.hypot(qw, qx, qy, qz) || 1;
    g.quats[i * 4] = qx / l; g.quats[i * 4 + 1] = qy / l; g.quats[i * 4 + 2] = qz / l; g.quats[i * 4 + 3] = qw / l;
    g.colors[i * 4] = unitClamp(0.5 + SH_C0 * rf(i, "f_dc_0"));
    g.colors[i * 4 + 1] = unitClamp(0.5 + SH_C0 * rf(i, "f_dc_1"));
    g.colors[i * 4 + 2] = unitClamp(0.5 + SH_C0 * rf(i, "f_dc_2"));
    g.colors[i * 4 + 3] = sigmoid(rf(i, "opacity"));
  }
  return g;
}

/** Decode a PlayCanvas compressed.ply (bit-packed chunk+vertex) → gaussian arrays. Same math as
 * SplatLoader/gsplat/ply.ts parseCompressedPly (256-sub-chunk min/max; pos 11-10-11, rot
 * 2-10-10-10 largest-component, log-scale 11-10-11, color 8888). */
function parseCompressed(buffer: ArrayBuffer, headEnd: number, header: string): Gaussians {
  const elements: { name: string; count: number; props: string[] }[] = [];
  for (const ln of header.split(/\r?\n/)) {
    const em = ln.match(/^element\s+(\S+)\s+(\d+)/);
    if (em) { elements.push({ name: em[1], count: parseInt(em[2], 10), props: [] }); continue; }
    const pm = ln.match(/^property\s+\S+\s+(\S+)/);
    if (pm && elements.length) elements[elements.length - 1].props.push(pm[1]);
  }
  const chunkEl = elements.find((e) => e.name === "chunk");
  const vertEl = elements.find((e) => e.name === "vertex");
  if (!chunkEl || !vertEl) throw new Error("not a compressed.ply");
  const cstride = chunkEl.props.length;
  const carriesTint = chunkEl.props.includes("min_r");
  const N = vertEl.count;
  const dv = new DataView(buffer);
  let p = headEnd;
  const chunk = new Float32Array(chunkEl.count * cstride);
  for (let i = 0; i < chunk.length; i++) { chunk[i] = dv.getFloat32(p, true); p += 4; }
  // No SH: PlayCanvas keeps the rest bands in a SEPARATE `sh` element with its own codebook,
  // which this bit-unpack doesn't read. A compressed.ply input therefore converts flat, exactly
  // as before. Feed the original INRIA .ply if you want view-dependent colour.
  const g: Gaussians = { count: N, centers: new Float32Array(N * 3), scales: new Float32Array(N * 3), quats: new Float32Array(N * 4), colors: new Float32Array(N * 4), sh: null, shBands: 0, shMono: false };
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
  const un = (v: number, bits: number) => (v & ((1 << bits) - 1)) / ((1 << bits) - 1);
  const S2 = Math.SQRT2;
  for (let i = 0; i < N; i++) {
    const pp = dv.getUint32(p, true), pr = dv.getUint32(p + 4, true), ps = dv.getUint32(p + 8, true), pc = dv.getUint32(p + 12, true); p += 16;
    const ci = Math.floor(i / 256) * cstride;
    g.centers[i * 3] = lerp(chunk[ci], chunk[ci + 3], un(pp >>> 21, 11));
    g.centers[i * 3 + 1] = lerp(chunk[ci + 1], chunk[ci + 4], un(pp >>> 11, 10));
    g.centers[i * 3 + 2] = lerp(chunk[ci + 2], chunk[ci + 5], un(pp, 11));
    const a = (un(pr >>> 20, 10) - 0.5) * S2, b = (un(pr >>> 10, 10) - 0.5) * S2, c = (un(pr, 10) - 0.5) * S2;
    const m = Math.sqrt(Math.max(0, 1 - (a * a + b * b + c * c)));
    const li = pr >>> 30;
    if (li === 0) { g.quats[i * 4] = a; g.quats[i * 4 + 1] = b; g.quats[i * 4 + 2] = c; g.quats[i * 4 + 3] = m; }
    else if (li === 1) { g.quats[i * 4] = m; g.quats[i * 4 + 1] = b; g.quats[i * 4 + 2] = c; g.quats[i * 4 + 3] = a; }
    else if (li === 2) { g.quats[i * 4] = b; g.quats[i * 4 + 1] = m; g.quats[i * 4 + 2] = c; g.quats[i * 4 + 3] = a; }
    else { g.quats[i * 4] = b; g.quats[i * 4 + 1] = c; g.quats[i * 4 + 2] = m; g.quats[i * 4 + 3] = a; }
    g.scales[i * 3] = Math.exp(lerp(chunk[ci + 6], chunk[ci + 9], un(ps >>> 21, 11)));
    g.scales[i * 3 + 1] = Math.exp(lerp(chunk[ci + 7], chunk[ci + 10], un(ps >>> 11, 10)));
    g.scales[i * 3 + 2] = Math.exp(lerp(chunk[ci + 8], chunk[ci + 11], un(ps, 11)));
    const rn = un(pc >>> 24, 8), gn = un(pc >>> 16, 8), bn = un(pc >>> 8, 8);
    g.colors[i * 4] = unitClamp(carriesTint ? lerp(chunk[ci + 12], chunk[ci + 15], rn) : rn);
    g.colors[i * 4 + 1] = unitClamp(carriesTint ? lerp(chunk[ci + 13], chunk[ci + 16], gn) : gn);
    g.colors[i * 4 + 2] = unitClamp(carriesTint ? lerp(chunk[ci + 14], chunk[ci + 17], bn) : bn);
    g.colors[i * 4 + 3] = un(pc, 8);
  }
  return g;
}

/** Decode a 3DGS PLY (plain INRIA or PlayCanvas compressed.ply) → gaussian arrays. */
export function decodeSplatPly(plyBytes: Uint8Array, wantShBands = 0, mono = false): Gaussians {
  const data = plyBytes instanceof Uint8Array ? plyBytes : new Uint8Array(plyBytes);
  const headEnd = headerEndOf(data);
  const header = latin1(data, 0, headEnd);
  if (!header.includes("binary_little_endian")) throw new Error("only binary_little_endian PLY supported");
  const buf = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);
  return /element\s+chunk\s+\d+/.test(header) ? parseCompressed(buf, headEnd, header) : parsePlain(data, headEnd, header, wantShBands, mono);
}

interface Node {
  x0: number; y0: number; z0: number; x1: number; y1: number; z1: number;
  idx: number[]; children: Node[];
}

/** Convert a 3DGS PLY (plain or compressed.ply) into an FQ LOD tree (in memory). */
export function convertSplatToFqTree(plyBytes: Uint8Array, options: FqTreeOptions = {}): FqTreeResult {
  const MAX_PER_LEAF = Number(options.maxPerLeaf || 200_000);
  const DEEPEST_LEVEL = Number(options.maxDepth || 12);
  const LODS = Math.max(1, Number(options.lodLevels ?? 4));
  const MIN_OPACITY = Number(options.minOpacity ?? 0.02);
  const SMALLEST_SCALE = Number(options.minScale ?? 1e-6);
  const WANT_SH = Math.max(0, Number(options.shBands ?? 1));
  const SH_MAX_LOD = Math.max(0, Number(options.shMaxLod ?? 0));
  const SH_MONO = options.shMono === true;
  const report = (pct: number, msg: string) => options.onProgress?.(pct, msg);

  report(5, "Decoding splat");
  const g = decodeSplatPly(plyBytes, WANT_SH, SH_MONO);
  const { centers, scales, colors } = g;
  const SH_PER = shCoeffCount(g.shBands, g.shMono);
  report(25, `Decoded ${g.count} gaussians; pruning + bounds`);

  // ---- prune + bounds + per-gaussian size -----------------------------------
  const size = new Float32Array(g.count);
  const valid: number[] = [];
  let minX = Infinity, minY = Infinity, minZ = Infinity, maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
  for (let i = 0; i < g.count; i += 1) {
    if (colors[i * 4 + 3] < MIN_OPACITY) continue;
    const s = Math.max(scales[i * 3], scales[i * 3 + 1], scales[i * 3 + 2]);
    if (s < SMALLEST_SCALE) continue;
    const x = centers[i * 3], y = centers[i * 3 + 1], z = centers[i * 3 + 2];
    if (!Number.isFinite(x + y + z)) continue;
    size[i] = s; valid.push(i);
    if (x < minX) minX = x; if (x > maxX) maxX = x;
    if (y < minY) minY = y; if (y > maxY) maxY = y;
    if (z < minZ) minZ = z; if (z > maxZ) maxZ = z;
  }
  if (!valid.length) throw new Error("no gaussians survived prune");
  report(40, `Kept ${valid.length}; building octree`);

  // ---- octree: subdivide into leaf cells ------------------------------------
  const leaves: Node[] = [];
  const split = (node: Node, depth: number) => {
    if (node.idx.length <= MAX_PER_LEAF || depth >= DEEPEST_LEVEL) { leaves.push(node); return; }
    const mx = (node.x0 + node.x1) / 2, my = (node.y0 + node.y1) / 2, mz = (node.z0 + node.z1) / 2;
    const q: number[][] = [[], [], [], [], [], [], [], []];
    for (const i of node.idx) {
      q[(centers[i * 3] >= mx ? 1 : 0) + (centers[i * 3 + 1] >= my ? 2 : 0) + (centers[i * 3 + 2] >= mz ? 4 : 0)].push(i);
    }
    node.idx = [];
    for (let c = 0; c < 8; c += 1) {
      if (!q[c].length) continue;
      const child: Node = {
        x0: c & 1 ? mx : node.x0, x1: c & 1 ? node.x1 : mx,
        y0: c & 2 ? my : node.y0, y1: c & 2 ? node.y1 : my,
        z0: c & 4 ? mz : node.z0, z1: c & 4 ? node.z1 : mz,
        idx: q[c], children: [],
      };
      node.children.push(child);
      split(child, depth + 1);
    }
  };
  const root: Node = { x0: minX, y0: minY, z0: minZ, x1: maxX, y1: maxY, z1: maxZ, idx: valid, children: [] };
  split(root, 0);
  report(55, `Octree: ${leaves.length} leaves; encoding`);

  // ---- per-leaf LOD subsamples → .fq blobs ----------------------------------
  // `fqFiles` is the array the manifest's `file` indices point into. `shFiles` is INDEX-ALIGNED
  // with it (shFiles[i] is the sidecar for fqFiles[i]) rather than interleaved, so the `file`
  // index keeps meaning the same thing whether or not SH was emitted. Both are concatenated into
  // the returned `files` — the cloud component persists them all as hidden files, keyed by name,
  // which is how the loader's request manager resolves a sidecar with no platform change.
  const fqFiles: FqTreeFile[] = [];
  const shFiles: FqTreeFile[] = [];
  const counts = new Array(LODS).fill(0);
  let leafIdentity = 0;

  const buildBatch = (idx: number[]): SplatBatch => {
    const n = idx.length;
    const c = new Float32Array(n * 3), s = new Float32Array(n * 3), q = new Float32Array(n * 4), col = new Float32Array(n * 4);
    for (let j = 0; j < n; j += 1) {
      const i = idx[j];
      c[j * 3] = centers[i * 3]; c[j * 3 + 1] = centers[i * 3 + 1]; c[j * 3 + 2] = centers[i * 3 + 2];
      s[j * 3] = scales[i * 3]; s[j * 3 + 1] = scales[i * 3 + 1]; s[j * 3 + 2] = scales[i * 3 + 2];
      q[j * 4] = g.quats[i * 4]; q[j * 4 + 1] = g.quats[i * 4 + 1]; q[j * 4 + 2] = g.quats[i * 4 + 2]; q[j * 4 + 3] = g.quats[i * 4 + 3];
      col[j * 4] = colors[i * 4]; col[j * 4 + 1] = colors[i * 4 + 1]; col[j * 4 + 2] = colors[i * 4 + 2]; col[j * 4 + 3] = colors[i * 4 + 3];
    }
    return { count: n, centers: c, scales: s, quats: q, colors: col };
  };

  /** Gather the same subsample's SH bytes, in the same order as `buildBatch` — the sidecar is
   * positional: splat j of the .fq is splat j of the .sh. */
  const buildSh = (idx: number[]): Uint8Array => {
    const out = new Uint8Array(idx.length * SH_PER);
    for (let j = 0; j < idx.length; j += 1) {
      out.set(g.sh!.subarray(idx[j] * SH_PER, idx[j] * SH_PER + SH_PER), j * SH_PER);
    }
    return out;
  };

  interface RawLeaf { bound: { min: number[]; max: number[] }; lods: Record<string, { file: number; offset: number; count: number }>; }
  const buildLeaf = (node: Node): RawLeaf => {
    const id = leafIdentity++;
    let lowBX = Infinity, lowBY = Infinity, bz0 = Infinity, highBX = -Infinity, highBY = -Infinity, bz1 = -Infinity;
    for (const i of node.idx) {
      const x = centers[i * 3], y = centers[i * 3 + 1], z = centers[i * 3 + 2];
      if (x < lowBX) lowBX = x; if (x > highBX) highBX = x;
      if (y < lowBY) lowBY = y; if (y > highBY) highBY = y;
      if (z < bz0) bz0 = z; if (z > bz1) bz1 = z;
    }
    const ordered = node.idx.slice().sort((a, b) => size[b] - size[a]); // largest first
    const lods: RawLeaf["lods"] = {};
    for (let k = 0; k < LODS; k += 1) {
      const n = k === 0 ? ordered.length : Math.max(1, Math.ceil(ordered.length / 2 ** k));
      const slice = ordered.slice(0, n);
      const fi = fqFiles.length;
      fqFiles.push({ name: `n${id}_l${k}.fq`, bytes: packFqChunk(buildBatch(slice)) });
      if (g.sh && k <= SH_MAX_LOD) shFiles[fi] = { name: `n${id}_l${k}.sh`, bytes: packShChunk(buildSh(slice), n, g.shBands, g.shMono) };
      lods[String(k)] = { file: fi, offset: 0, count: n };
      counts[k] += n;
    }
    return { bound: { min: [lowBX, lowBY, bz0], max: [highBX, highBY, bz1] }, lods };
  };

  interface RawNode { bound: { min: number[]; max: number[] }; children?: RawNode[]; lods?: RawLeaf["lods"]; }
  const buildTree = (node: Node): RawNode =>
    node.children.length
      ? { bound: { min: [node.x0, node.y0, node.z0], max: [node.x1, node.y1, node.z1] }, children: node.children.map(buildTree) }
      : (buildLeaf(node) as RawNode);
  const tree = buildTree(root);
  // `shFiles` is SPARSE when shMaxLod excludes coarse levels, so count and spread it explicitly:
  // a raw spread would inject `undefined` entries into `files` and break the upload loop.
  const shEmitted = shFiles.filter(Boolean);
  report(95, `Encoded ${fqFiles.length} .fq nodes${g.sh ? ` + ${shEmitted.length} .sh sidecars` : ""}`);

  const manifest = {
    version: 1,
    format: "fq" as const,
    asset: { version: "1.0" },
    count: valid.length,
    counts,
    lodLevels: LODS,
    filenames: fqFiles.map((f) => f.name),
    // Absent when the source had no `f_rest_*` (or SH was switched off) — a loader that finds no
    // `shBands` streams the flat-colour dataset exactly as it always did.
    // `shFilenames` stays index-aligned with `filenames`; a null means that node has no sidecar
    // and renders flat. The loader already skips the fetch on a falsy entry.
    ...(g.sh
      ? {
        shBands: g.shBands,
        ...(g.shMono ? { shMono: true } : {}),
        shFilenames: Array.from({ length: fqFiles.length }, (_, i) => shFiles[i]?.name ?? null),
      }
      : {}),
    tree,
  };
  return { manifest, files: [...fqFiles, ...shEmitted] };
}
