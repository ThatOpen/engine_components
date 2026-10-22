// Raw point arrays  ->  a streamable Potree 2.0 octree (the point-cloud counterpart
// of {@link tileSplatToTiles}, ported into the library as an ISOMORPHIC function).
//
// Input: parallel coordinate + colour arrays (LAS-native, Z-up — the viewer's
// PointCloudLoader rotates -PI/2 to Y-up). Output: the three files of a Potree 2.0
// dataset — `metadata` (object), `hierarchy` (Uint8Array), `octree` (Uint8Array).
//
// Pure compute: it takes arrays + options and returns in-memory buffers — no Node, no
// filesystem, no three. The environment-specific part (reading/streaming the LAS) lives
// in the caller (the Node cloud component / app), so the library pulls no Node code.
//
// LOD: an additive octree where each node keeps a Poisson-disk subsample at its spacing
// (min point-to-point distance ~= node.spacing); every non-kept point cascades to a
// child octant; leaves keep everything. The union of a root->leaf path is the full
// cloud, exactly Potree's model.
//
// Binary layout (verified byte-for-byte against a real PotreeConverter dataset):
//  - octree.bin: per node, its kept points concatenated. Point = position int32[3]
//    (round((coord-offset)/scale)) + rgb uint16[3] -> 18 bytes. Minimal attribute set;
//    `metadata.attributes` declares exactly these two so the loader reads them.
//  - hierarchy.bin: 22-byte records in BFS order (root, then each node's children in
//    octant-bit order). Record = type:u8 (0=inner,1=leaf), childMask:u8, numPoints:u32,
//    byteOffset:i64, byteSize:i64. Emits ONE chunk (no type-2 proxy nodes).

/** Bytes per stored point in octree.bin: position int32[3] (12) + rgb uint16[3] (6). */
export const POTREE_POINT_BYTES = 18;

/** Parallel input arrays. Coordinates are world/LAS-native (Z-up); colours are 0..65535. */
export interface PotreePoints {
  x: ArrayLike<number>;
  y: ArrayLike<number>;
  z: ArrayLike<number>;
  r: ArrayLike<number>;
  g: ArrayLike<number>;
  b: ArrayLike<number>;
  /** Number of valid points in the arrays. */
  count: number;
}

/** Options for {@link buildPotreeOctree}. All optional. */
export interface PotreeBuildOptions {
  /** `metadata.name`. Default `"cloud"`. */
  name?: string;
  /** Quantization step for stored int32 positions (metres). Default `0.001` (1 mm). */
  scale?: number;
  /** Hard octree depth cap. Default `14`. */
  maxDepth?: number;
  /** Root grid resolution; node spacing = cubeSize / gridSize. Default `128`. */
  gridSize?: number;
  /** A node stops subdividing once it holds <= this many points. Default `2000`. */
  leafThreshold?: number;
  /** Progress callback (pct 0..100, message). */
  onProgress?: (pct: number, msg: string) => void;
  /**
   * ALIGNED-SUBTREE mode (distributed split→build→merge). When set, the octree is built
   * as a subtree of ONE shared global octree instead of computing its own cube: it uses
   * the global `offset`/`scale`/`rootCube` (so spacing + stored positions line up across
   * tiles) and roots the subtree at the global cell `cellMin`/`cellSize`/`cellLevel`. The
   * output hierarchy/octree describe just this tile; a merge step grafts it into the
   * global tree. Without it, the builder behaves as a standalone single octree.
   */
  grid?: {
    offset: [number, number, number];
    scale: number;
    rootCube: number;
    cellMin: [number, number, number];
    cellSize: number;
    cellLevel: number;
  };
}

/** A single Potree metadata attribute descriptor. */
export interface PotreeAttribute {
  name: string;
  description: string;
  size: number;
  numElements: number;
  elementSize: number;
  type: string;
  min: number[];
  max: number[];
  scale: number[];
  offset: number[];
}

/** Potree 2.0 `metadata.json` (the subset this emitter produces). */
export interface PotreeMetadata {
  version: "2.0";
  name: string;
  description: string;
  points: number;
  projection: string;
  hierarchy: { firstChunkSize: number; stepSize: number; depth: number };
  offset: number[];
  scale: number[];
  spacing: number;
  boundingBox: { min: number[]; max: number[] };
  encoding: "DEFAULT";
  attributes: PotreeAttribute[];
}

/** The three in-memory files of a Potree 2.0 dataset. */
export interface PotreeOutput {
  metadata: PotreeMetadata;
  hierarchy: Uint8Array;
  octree: Uint8Array;
}

interface OctNode {
  min: [number, number, number];
  size: number;
  level: number;
  spacing: number;
  keep: number[];
  children: (OctNode | null)[];
  childMask: number;
  byteOffset: number;
  byteSize: number;
}

/**
 * Build a Potree 2.0 octree from in-memory point arrays.
 *
 * @param pts Parallel coordinate + colour arrays.
 * @param opts Tuning + progress.
 * @returns `{ metadata, hierarchy, octree }` — the three Potree files in memory.
 */
export function buildPotreeOctree(
  pts: PotreePoints,
  opts: PotreeBuildOptions = {},
): PotreeOutput {
  const N = pts.count;
  const report = typeof opts.onProgress === "function" ? opts.onProgress : () => {};
  const GRID = opts.gridSize ?? 128; // root grid resolution (spacing = cubeSize / GRID)
  const DEEPEST_LEVEL = opts.maxDepth ?? 14;
  // A node stops subdividing once it holds few enough points (density-based depth, like
  // Potree's maxPointsPerNode) — otherwise sparse regions recurse to DEEPEST_LEVEL and
  // explode the node count.
  const LEAF_THRESHOLD = opts.leafThreshold ?? 2000;

  // ---- 1. bounds -> CUBIC root box (Potree's root node is a cube) ----
  let minX = Infinity, minY = Infinity, minZ = Infinity;
  let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
  for (let i = 0; i < N; i++) {
    const x = pts.x[i], y = pts.y[i], z = pts.z[i];
    if (x < minX) minX = x; if (x > maxX) maxX = x;
    if (y < minY) minY = y; if (y > maxY) maxY = y;
    if (z < minZ) minZ = z; if (z > maxZ) maxZ = z;
  }
  // ALIGNED mode: take the cube/origin/scale from the GLOBAL grid and root the subtree at
  // the given cell. Standalone mode: derive a cubic root from the point bounds.
  const g = opts.grid;
  const cube = g ? g.rootCube : (Math.max(maxX - minX, maxY - minY, maxZ - minZ) || 1);
  const offset: [number, number, number] = g ? g.offset : [minX, minY, minZ];
  const scale = g ? g.scale : (opts.scale ?? 0.001);
  const rootSpacing = cube / GRID; // GLOBAL root spacing (== global cube / GRID)
  report(35, `${g ? "aligned tile @ L" + g.cellLevel : "bounds"} + cube ${cube.toFixed(1)}, spacing ${rootSpacing.toFixed(3)}`);

  // ---- 2. octree build with Poisson-disk sampling ----
  let nodeCount = 0;
  const makeNode = (min: [number, number, number], size: number, level: number): OctNode => ({
    min, size, level, spacing: rootSpacing / 2 ** level,
    keep: [], children: new Array<OctNode | null>(8).fill(null), childMask: 0,
    byteOffset: 0, byteSize: 0,
  });
  const root = g ? makeNode(g.cellMin, g.cellSize, g.cellLevel) : makeNode([minX, minY, minZ], cube, 0);
  nodeCount++;

  // distribute(node, indices): Poisson-disk subsample into node.keep (min point-to-point
  // distance ~= node.spacing), cascade the rest to children. Grid-cell occupancy alone
  // over-keeps ~2x near cell boundaries (two points either side of a boundary are both
  // kept though they're <spacing apart) — that saturates a level early and starves the
  // deep nodes, so close-up detail never appears. A true min-distance check (this cell +
  // its 26 neighbours) matches PotreeConverter's bottom-heavy LOD.
  const distribute = (node: OctNode, indices: number[]): void => {
    if (node.level >= DEEPEST_LEVEL || indices.length <= LEAF_THRESHOLD) {
      node.keep = indices; return; // leaf: keep all
    }
    // one kept point per occupied cell, keyed by packed cell index (no hash collisions:
    // per-node grid is GRID^3, so cx,cy,cz are in [0,GRID) and pack losslessly).
    const cell = new Map<number, number>();
    const inv = 1 / node.spacing;
    const stepTwo = node.spacing * node.spacing;
    const GMAX = GRID - 1;
    const PLANE = GRID * GRID;
    const buckets: number[][] = [[], [], [], [], [], [], [], []];
    const half = node.size / 2;
    const mx = node.min[0] + half, my = node.min[1] + half, mz = node.min[2] + half;
    for (let k = 0; k < indices.length; k++) {
      const i = indices[k];
      const px = pts.x[i], py = pts.y[i], pz = pts.z[i];
      let cx = ((px - node.min[0]) * inv) | 0; if (cx > GMAX) cx = GMAX;
      let cy = ((py - node.min[1]) * inv) | 0; if (cy > GMAX) cy = GMAX;
      let cz = ((pz - node.min[2]) * inv) | 0; if (cz > GMAX) cz = GMAX;
      // reject if any already-kept point in the 3x3x3 neighbourhood is within spacing
      let tooClose = false;
      for (let dz = -1; dz <= 1 && !tooClose; dz++) {
        const z = cz + dz; if (z < 0 || z > GMAX) continue;
        for (let dy = -1; dy <= 1 && !tooClose; dy++) {
          const y = cy + dy; if (y < 0 || y > GMAX) continue;
          for (let dx = -1; dx <= 1; dx++) {
            const x = cx + dx; if (x < 0 || x > GMAX) continue;
            const kp = cell.get(x + y * GRID + z * PLANE);
            if (kp === undefined) continue;
            const ddx = pts.x[kp] - px, ddy = pts.y[kp] - py, ddz = pts.z[kp] - pz;
            if (ddx * ddx + ddy * ddy + ddz * ddz < stepTwo) { tooClose = true; break; }
          }
        }
      }
      if (!tooClose) { cell.set(cx + cy * GRID + cz * PLANE, i); node.keep.push(i); continue; }
      // not kept at this level -> cascade to the child octant it falls in.
      // CRITICAL: the octant bit order MUST match potree-core's createChildAABB, which
      // derives each node's box from its name digit as: bit1->Z, bit2->Y, bit4->X. If we
      // used bit1->X (the "obvious" order), every node's box would be mirrored across
      // X<->Z vs where its points actually are -> wrong LOD/frustum -> never refines.
      const oct = (pz >= mz ? 1 : 0) | (py >= my ? 2 : 0) | (px >= mx ? 4 : 0);
      buckets[oct].push(i);
    }
    for (let o = 0; o < 8; o++) {
      if (buckets[o].length === 0) continue;
      const cmin: [number, number, number] = [
        node.min[0] + (o & 4 ? half : 0), // x <- bit4
        node.min[1] + (o & 2 ? half : 0), // y <- bit2
        node.min[2] + (o & 1 ? half : 0), // z <- bit1 (potree convention)
      ];
      const child = makeNode(cmin, half, node.level + 1);
      node.children[o] = child;
      node.childMask |= 1 << o;
      nodeCount++;
      distribute(child, buckets[o]);
    }
  };
  const all = new Array<number>(N);
  for (let i = 0; i < N; i++) all[i] = i;
  distribute(root, all);
  report(60, `octree: ${nodeCount} nodes`);

  // ---- 3. BFS order + byte layout ----
  const bfs: OctNode[] = [];
  const queue: OctNode[] = [root];
  while (queue.length) {
    const n = queue.shift() as OctNode;
    bfs.push(n);
    for (let o = 0; o < 8; o++) {
      const c = n.children[o];
      if (c) queue.push(c);
    }
  }
  let octBytes = 0;
  for (const n of bfs) {
    n.byteOffset = octBytes;
    n.byteSize = n.keep.length * POTREE_POINT_BYTES;
    octBytes += n.byteSize;
  }

  // ---- 4. emit octree.bin ----
  const octree = new Uint8Array(octBytes);
  const odv = new DataView(octree.buffer);
  const sx = 1 / scale, sy = 1 / scale, sz = 1 / scale;
  let maxLevel = 0;
  for (const n of bfs) {
    if (n.level > maxLevel) maxLevel = n.level;
    let p = n.byteOffset;
    for (const i of n.keep) {
      odv.setInt32(p, Math.round((pts.x[i] - offset[0]) * sx), true);
      odv.setInt32(p + 4, Math.round((pts.y[i] - offset[1]) * sy), true);
      odv.setInt32(p + 8, Math.round((pts.z[i] - offset[2]) * sz), true);
      odv.setUint16(p + 12, pts.r[i], true);
      odv.setUint16(p + 14, pts.g[i], true);
      odv.setUint16(p + 16, pts.b[i], true);
      p += POTREE_POINT_BYTES;
    }
  }

  // ---- 5. emit hierarchy.bin (BFS, 22B records, single chunk) ----
  const REC = 22;
  const hierarchy = new Uint8Array(bfs.length * REC);
  const hdv = new DataView(hierarchy.buffer);
  for (let e = 0; e < bfs.length; e++) {
    const n = bfs[e];
    const o = e * REC;
    hdv.setUint8(o, n.childMask === 0 ? 1 : 0); // 1=leaf, 0=inner
    hdv.setUint8(o + 1, n.childMask);
    hdv.setUint32(o + 2, n.keep.length, true);
    hdv.setBigInt64(o + 6, BigInt(n.byteOffset), true);
    hdv.setBigInt64(o + 14, BigInt(n.byteSize), true);
  }

  // ---- 6. metadata ----
  const metadata: PotreeMetadata = {
    version: "2.0",
    name: opts.name ?? "cloud",
    description: "",
    points: N,
    projection: "",
    hierarchy: { firstChunkSize: hierarchy.length, stepSize: maxLevel + 1, depth: maxLevel },
    offset,
    scale: [scale, scale, scale],
    spacing: rootSpacing,
    // Global cubic root box (offset is the global origin in aligned mode).
    boundingBox: { min: [offset[0], offset[1], offset[2]], max: [offset[0] + cube, offset[1] + cube, offset[2] + cube] },
    encoding: "DEFAULT",
    attributes: [
      {
        name: "position", description: "", size: 12, numElements: 3, elementSize: 4, type: "int32",
        min: [minX, minY, minZ], max: [maxX, maxY, maxZ], scale: [1, 1, 1], offset: [0, 0, 0],
      },
      {
        name: "rgb", description: "", size: 6, numElements: 3, elementSize: 2, type: "uint16",
        min: [0, 0, 0], max: [65535, 65535, 65535], scale: [1, 1, 1], offset: [0, 0, 0],
      },
    ],
  };
  report(85, `emitted ${bfs.length} nodes, octree ${(octBytes / 1e6).toFixed(1)}MB, depth ${maxLevel}`);
  return { metadata, hierarchy, octree };
}
