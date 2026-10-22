// Streamed-LOD (lod-meta.json) tree: load the spatial B-tree, pick a LOD per leaf by camera
// distance, and depth-sort a leaf's splat range (tile-level sort — option A). Spec: FORMAT-SPEC §C.

export interface LeafLod { file: number; offset: number; count: number; }
export interface Leaf { min: [number, number, number]; max: [number, number, number]; lods: LeafLod[]; }
// spatial tree node — bounds + either children (branch) or a leaf index. Used for back-to-front
// (BSP/octree) traversal so disjoint tiles are ordered exactly, not by centroid distance.
export interface LodCell { min: [number, number, number]; max: [number, number, number]; children?: LodCell[]; leaf?: number; }
// `format` selects the per-node codec: undefined/"sog" = SOG WebP bundle (dir/meta.json), "fq" =
// flat-quant FQC1 blob (a single byte-range-able .fq file). See the SplatLoader decode worker.
// `shBands`/`shFilenames` mark an FQ dataset that ALSO ships spherical-harmonic sidecars — one
// `.sh` (SHQ1) per `.fq`, INDEX-ALIGNED with `filenames`, carrying the view-dependent colour the
// flat FQC1 body drops. Absent on every dataset converted before SH support; the loader then
// streams flat colour exactly as it always did.
export interface LodMeta { filenames: string[]; leaves: Leaf[]; tree: LodCell; lodLevels: number; counts: number[]; format?: "sog" | "fq"; shBands?: number; shFilenames?: string[]; }

interface RawNode { bound: { min: number[]; max: number[] }; children?: RawNode[]; lods?: Record<string, LeafLod>; }

export async function loadLodMeta(baseUrl: string): Promise<LodMeta> {
  // A dev server answers a missing path with its index.html and a 200; name the URL instead of
  // letting `.json()` throw "Unexpected token '<'" with no clue which fetch it was.
  const res = await fetch(`${baseUrl}/lod-meta.json`);
  const text = await res.text();
  if (!res.ok || text.trimStart().startsWith("<")) {
    throw new Error(
      `[SplatLoader] no splat manifest at ${baseUrl}/lod-meta.json ` +
        `(HTTP ${res.status}${text.trimStart().startsWith("<") ? ", got HTML" : ""}) — ` +
        `does that dataset folder exist?`,
    );
  }
  const m = JSON.parse(text);
  const leaves: Leaf[] = [];
  const build = (n: RawNode): LodCell => {
    const min = n.bound.min as [number, number, number], max = n.bound.max as [number, number, number];
    if (n.children) return { min, max, children: n.children.map(build) };
    const lods: LeafLod[] = [];
    for (const k of Object.keys(n.lods!).sort((a, b) => +a - +b)) lods[+k] = n.lods![k];
    const leaf = leaves.length;
    leaves.push({ min, max, lods });
    return { min, max, leaf };
  };
  const tree = build(m.tree);
  return { filenames: m.filenames, leaves, tree, lodLevels: m.lodLevels, counts: m.counts, format: m.format };
}

// nearest distance from a point to an axis-aligned box (0 if inside).
export function closestDist(min: number[], max: number[], px: number, py: number, pz: number): number {
  const dx = Math.max(min[0] - px, 0, px - max[0]);
  const dy = Math.max(min[1] - py, 0, py - max[1]);
  const dz = Math.max(min[2] - pz, 0, pz - max[2]);
  return Math.hypot(dx, dy, dz);
}

// LOD 0 = finest. Larger distance → higher (coarser) level. base = distance at which LOD steps
// from 0→1; each further level is `mult`× farther.
export function pickLod(dist: number, base: number, mult: number, maxLod: number): number {
  if (dist < base) return 0;
  let lod = Math.floor(Math.log(dist / base) / Math.log(mult)) + 1;
  return Math.max(0, Math.min(maxLod, lod));
}

// depth-sort a leaf's splat range [offset, offset+count) back-to-front along dir; write the
// file-relative splat indices into `out` (length >= count). O(count) counting sort.
const BUCKETS = 8192;
const counts = new Uint32Array(BUCKETS);
let rangeTmp = new Uint32Array(0);
export function sortRange(
  centers: Float32Array, offset: number, count: number,
  dx: number, dy: number, dz: number, out: Float32Array,
): void {
  let dmin = Infinity, dmax = -Infinity;
  for (let i = 0; i < count; i++) {
    const o = (offset + i) * 3;
    const d = centers[o] * dx + centers[o + 1] * dy + centers[o + 2] * dz;
    if (d < dmin) dmin = d; if (d > dmax) dmax = d;
  }
  const scale = (BUCKETS - 1) / (dmax - dmin || 1);
  counts.fill(0);
  for (let i = 0; i < count; i++) {
    const o = (offset + i) * 3;
    const d = centers[o] * dx + centers[o + 1] * dy + centers[o + 2] * dz;
    counts[((d - dmin) * scale) | 0]++;
  }
  let acc = 0;
  for (let b = 0; b < BUCKETS; b++) { const c = counts[b]; counts[b] = acc; acc += c; }
  // scatter ascending (near→far), then we want far→near: write reversed.
  if (rangeTmp.length < count) rangeTmp = new Uint32Array(count);
  const tmp = rangeTmp;
  for (let i = 0; i < count; i++) {
    const o = (offset + i) * 3;
    const d = centers[o] * dx + centers[o + 1] * dy + centers[o + 2] * dz;
    tmp[counts[((d - dmin) * scale) | 0]++] = offset + i; // file-relative index
  }
  for (let i = 0; i < count; i++) out[i] = tmp[count - 1 - i]; // far first (back-to-front)
}
