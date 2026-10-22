// MERGE — graft the independently-built tiles (see {@link planPotreeTiles} / the aligned-subtree
// mode of {@link buildPotreeOctree}) into ONE global Potree 2.0 octree.
//
// The trick that makes this cheap: the merged `octree.bin` is never actually assembled. Each
// tile already uploaded its own point pieces, and those bytes are correct as-is — a tile was
// built as an ALIGNED SUBTREE of the global tree, so its points, spacing and quantization
// already line up. All MERGE has to produce is:
//
//   1. the global TOP — the interior levels above the tiles. Each tile handed up a subsample of
//      its own root node; running the same Poisson-disk sampling over the union of those gives
//      the coarse LOD levels, and the walk stops at each tile (whose subtree already exists).
//   2. one global `hierarchy.bin` whose byteOffsets address the LOGICAL concatenation
//      `[top ++ tile0 ++ tile1 ...]`.
//   3. a sized MANIFEST mapping that logical byte range onto the real, already-uploaded pieces.
//
// So merging a billion-point cloud copies only the top's points. The viewer byte-ranges the
// manifest and never knows the octree is stitched.
//
// Pure compute: takes the tiles' already-fetched bytes, returns buffers. The fetching and the
// uploading are the caller's.

import { octantOf, childMin, chopOctree, concatBytes, PotreeGrid } from "./potree-grid.js";
import { POTREE_POINT_BYTES, PotreeMetadata } from "./tile-potree.js";

/** Bytes per hierarchy record: type:u8, childMask:u8, numPoints:u32, byteOffset:i64, byteSize:i64. */
const HIERARCHY_RECORD_BYTES = 22;

/** One BUILD output, with its two intermediate buffers already fetched. */
export interface PotreeTileInput {
  /** The tile's Potree node name (`"r041"`). */
  cell: string;
  /** childMask of the tile's ROOT node — its children live in the tile's own subtree. */
  rootChildMask: number;
  /** The tile root's subsample, as stored points (18 B each). Feeds the global top. */
  rootPoints: Uint8Array;
  /** The tile's DEEP hierarchy records (BFS, tile-local byteOffsets). Empty for a leaf-only tile. */
  deepHierarchy: Uint8Array;
  /** Total bytes of the tile's deep `octree.bin` (0 for a leaf-only tile). */
  octreeBytes: number;
  /** The tile's already-uploaded octree pieces, in order. */
  pieces: { id: string; size: number }[];
}

/**
 * One slot of the logical `octree.bin`, in byte order.
 *
 * A `"cell"` slot already has its `id` — the tile uploaded that piece during BUILD. A `"top"`
 * slot has no `id` yet: it refers to {@link PotreeMergeResult.topPieces}`[index]`, which the
 * caller uploads, and the caller then fills the id in. That is the ONLY thing MERGE cannot
 * finish on its own, because ids are assigned at upload.
 */
export interface PotreeManifestSlot {
  kind: "top" | "cell";
  /** Set when `kind === "cell"`. */
  cell?: string;
  /** Index of the piece within its group. */
  index: number;
  size: number;
  /** Hidden-file id. Present for `"cell"`; the caller fills it for `"top"`. */
  id?: string;
}

/** The result of {@link mergePotreeTiles}. */
export interface PotreeMergeResult {
  metadata: PotreeMetadata;
  /** The global `hierarchy.bin`. */
  hierarchy: Uint8Array;
  /** The top's points, already chopped for upload — the ONLY new octree bytes. */
  topPieces: { name: string; data: Uint8Array }[];
  /** The logical `octree.bin`, in byte order. See {@link PotreeManifestSlot}. */
  manifest: PotreeManifestSlot[];
  /** Total points in the merged tree. */
  totalPoints: number;
  /** Total bytes of the logical `octree.bin`. */
  totalOctreeBytes: number;
  /** Number of nodes in the merged hierarchy. */
  nodeCount: number;
}

/** Options for {@link mergePotreeTiles}. */
export interface PotreeMergeOptions {
  /** Root grid resolution — MUST match the value the tiles were built with. Default `128`. */
  gridSize?: number;
  /** Name prefix for the top's octree pieces. Default `"top_"`. */
  topPiecePrefix?: string;
}

interface CellInfo {
  rootChildMask: number;
  rootBytes: number;
  deep: { childMask: number; numPoints: number; byteOffset: number }[];
  pieces: { id: string; size: number }[];
  octreeBytes: number;
}

interface GlobalNode {
  childMask: number;
  numPoints: number;
  byteOffset: number;
  level: number;
}

/**
 * Merge built tiles into one global Potree octree.
 *
 * @param grid The global frame the tiles were built against.
 * @param tiles The BUILD outputs (skip empty tiles before calling).
 */
export function mergePotreeTiles(
  grid: PotreeGrid,
  tiles: PotreeTileInput[],
  opts: PotreeMergeOptions = {},
): PotreeMergeResult {
  const GRID = opts.gridSize ?? 128;
  const { offset, rootCube: cube, rootSpacing, scale } = grid;
  const PB = POTREE_POINT_BYTES;
  const REC = HIERARCHY_RECORD_BYTES;

  // ---- 1. unpack each tile: its root subsample (as points) + its deep hierarchy records ----
  const rx: number[] = [], ry: number[] = [], rz: number[] = [];
  const rr: number[] = [], rg: number[] = [], rb: number[] = [];
  const cellInfo = new Map<string, CellInfo>();

  for (const tile of tiles) {
    const rp = tile.rootPoints;
    const rdv = new DataView(rp.buffer, rp.byteOffset, rp.byteLength);
    for (let p = 0; p < rp.length / PB; p++) {
      const o = p * PB;
      rx.push(rdv.getInt32(o, true));
      ry.push(rdv.getInt32(o + 4, true));
      rz.push(rdv.getInt32(o + 8, true));
      rr.push(rdv.getUint16(o + 12, true));
      rg.push(rdv.getUint16(o + 14, true));
      rb.push(rdv.getUint16(o + 16, true));
    }

    // A leaf-only tile has no deep nodes at all (its whole subtree is the root).
    const deep: CellInfo["deep"] = [];
    if (tile.octreeBytes > 0 && tile.deepHierarchy.length > 0) {
      const dh = tile.deepHierarchy;
      const ddv = new DataView(dh.buffer, dh.byteOffset, dh.byteLength);
      for (let e = 0; e < dh.length / REC; e++) {
        deep.push({
          childMask: ddv.getUint8(e * REC + 1),
          numPoints: ddv.getUint32(e * REC + 2, true),
          byteOffset: Number(ddv.getBigInt64(e * REC + 6, true)),
        });
      }
    }

    cellInfo.set(tile.cell, {
      rootChildMask: tile.rootChildMask,
      rootBytes: (rp.length / PB) * PB,
      deep,
      pieces: tile.pieces,
      octreeBytes: tile.octreeBytes,
    });
  }

  // Tiles sit at VARIABLE depths (the plan splits adaptively), so the top's skeleton is every
  // tile name plus all of its ancestors — forced, so a sparse path to a tile is never pruned.
  const cellSet = new Set(cellInfo.keys());
  const prefixSet = new Set<string>();
  for (const name of cellSet) {
    for (let i = 1; i <= name.length; i++) prefixSet.add(name.slice(0, i));
  }

  // ---- 2. build the global TOP over the tile-root points ----
  // Same Poisson-disk sampling as buildPotreeOctree, but over the union of the tiles' root
  // subsamples, and it STOPS at a tile (whose children already exist inside that tile).
  const pointCount = rx.length;
  const worldX = (i: number) => offset[0] + rx[i] * scale;
  const worldY = (i: number) => offset[1] + ry[i] * scale;
  const worldZ = (i: number) => offset[2] + rz[i] * scale;

  const top = new Map<string, { level: number; childMask: number; keep: number[] }>();

  const distribute = (
    name: string,
    level: number,
    min: ArrayLike<number>,
    size: number,
    indices: number[],
  ): void => {
    const node = { level, childMask: 0, keep: indices };
    top.set(name, node);

    // Reached a tile: adopt its root's childMask (its subtree is grafted in step 3b) and stop.
    if (cellSet.has(name)) {
      node.childMask = cellInfo.get(name)!.rootChildMask;
      return;
    }

    node.keep = [];
    const cell = new Map<number, number>();
    const spacing = rootSpacing / 2 ** level;
    const inv = 1 / spacing;
    const stepTwo = spacing * spacing;
    const GMAX = GRID - 1;
    const PLANE = GRID * GRID;
    const half = size / 2;
    const halfwayX = min[0] + half, halfwayY = min[1] + half, midZ = min[2] + half;
    const buckets: number[][] = [[], [], [], [], [], [], [], []];

    for (let k = 0; k < indices.length; k++) {
      const i = indices[k];
      const x = worldX(i), y = worldY(i), z = worldZ(i);
      let cx = ((x - min[0]) * inv) | 0; if (cx > GMAX) cx = GMAX; if (cx < 0) cx = 0;
      let cy = ((y - min[1]) * inv) | 0; if (cy > GMAX) cy = GMAX; if (cy < 0) cy = 0;
      let cz = ((z - min[2]) * inv) | 0; if (cz > GMAX) cz = GMAX; if (cz < 0) cz = 0;

      // Keep only if no already-kept point in the 3x3x3 neighbourhood is within `spacing`.
      let tooClose = false;
      for (let dz = -1; dz <= 1 && !tooClose; dz++) {
        const zz = cz + dz; if (zz < 0 || zz > GMAX) continue;
        for (let dy = -1; dy <= 1 && !tooClose; dy++) {
          const yy = cy + dy; if (yy < 0 || yy > GMAX) continue;
          for (let dx = -1; dx <= 1; dx++) {
            const xx = cx + dx; if (xx < 0 || xx > GMAX) continue;
            const kept = cell.get(xx + yy * GRID + zz * PLANE);
            if (kept === undefined) continue;
            const ox = worldX(kept) - x, oy = worldY(kept) - y, oz = worldZ(kept) - z;
            if (ox * ox + oy * oy + oz * oz < stepTwo) { tooClose = true; break; }
          }
        }
      }
      if (!tooClose) {
        cell.set(cx + cy * GRID + cz * PLANE, i);
        node.keep.push(i);
        continue;
      }
      buckets[octantOf(x, y, z, halfwayX, halfwayY, midZ)].push(i);
    }

    // Recurse into octants that hold points OR that lead to a tile (forcing the skeleton path).
    for (let o = 0; o < 8; o++) {
      const child = name + o;
      if (!buckets[o].length && !prefixSet.has(child)) continue;
      node.childMask |= 1 << o;
      distribute(child, level + 1, childMin(min, half, o), half, buckets[o]);
    }
  };

  const all = new Array<number>(pointCount);
  for (let i = 0; i < pointCount; i++) all[i] = i;
  distribute("r", 0, offset, cube, all);

  // ---- 3. lay out the logical octree.bin as [top ++ cell0 ++ cell1 ...] ----
  const cellOrder = [...cellInfo.keys()].sort();
  const gnodes = new Map<string, GlobalNode>();

  // 3a. top nodes, in top-BFS order; emit their points in the same order.
  const topParts: Uint8Array[] = [];
  let topSize = 0;
  {
    const queue = ["r"];
    while (queue.length) {
      const name = queue.shift()!;
      const node = top.get(name);
      if (!node) continue;
      gnodes.set(name, {
        childMask: node.childMask,
        numPoints: node.keep.length,
        byteOffset: topSize,
        level: node.level,
      });
      const buf = new Uint8Array(node.keep.length * PB);
      const bdv = new DataView(buf.buffer);
      let p = 0;
      for (const i of node.keep) {
        bdv.setInt32(p, rx[i], true);
        bdv.setInt32(p + 4, ry[i], true);
        bdv.setInt32(p + 8, rz[i], true);
        bdv.setUint16(p + 12, rr[i], true);
        bdv.setUint16(p + 14, rg[i], true);
        bdv.setUint16(p + 16, rb[i], true);
        p += PB;
      }
      topParts.push(buf);
      topSize += node.keep.length * PB;
      // A tile's childMask refers to nodes in ITS segment, not the top — don't walk into it here.
      if (!cellSet.has(name)) {
        for (let o = 0; o < 8; o++) if (node.childMask & (1 << o)) queue.push(name + o);
      }
    }
  }

  // 3b. each tile's deep nodes: replay the tile's BFS to recover global names, and rebase its
  // tile-local byteOffsets into the global layout.
  const cellBase = new Map<string, number>();
  {
    let base = 0;
    for (const name of cellOrder) {
      cellBase.set(name, base);
      base += cellInfo.get(name)!.octreeBytes;
    }
  }
  for (const name of cellOrder) {
    const info = cellInfo.get(name)!;
    const base = topSize + cellBase.get(name)!;
    const queue: string[] = [];
    for (let o = 0; o < 8; o++) if (info.rootChildMask & (1 << o)) queue.push(name + o);
    let r = 0;
    while (queue.length) {
      const nodeName = queue.shift()!;
      const rec = info.deep[r++];
      if (!rec) break;
      gnodes.set(nodeName, {
        childMask: rec.childMask,
        numPoints: rec.numPoints,
        // Tile offsets are measured past the tile root's own points; rebase onto the segment.
        byteOffset: base + (rec.byteOffset - info.rootBytes),
        level: nodeName.length - 1,
      });
      for (let o = 0; o < 8; o++) if (rec.childMask & (1 << o)) queue.push(nodeName + o);
    }
  }

  // ---- 4. emit the global hierarchy, in global BFS order ----
  const order: string[] = [];
  {
    const queue = ["r"];
    while (queue.length) {
      const name = queue.shift()!;
      const node = gnodes.get(name);
      if (!node) continue;
      order.push(name);
      for (let o = 0; o < 8; o++) if (node.childMask & (1 << o)) queue.push(name + o);
    }
  }

  const hierarchy = new Uint8Array(order.length * REC);
  const hdv = new DataView(hierarchy.buffer);
  let maxLevel = 0;
  let totalPoints = 0;
  let totalOctreeBytes = topSize;
  for (const name of cellOrder) totalOctreeBytes += cellInfo.get(name)!.octreeBytes;

  for (let e = 0; e < order.length; e++) {
    const node = gnodes.get(order[e])!;
    const o = e * REC;
    hdv.setUint8(o, node.childMask === 0 ? 1 : 0); // 1 = leaf
    hdv.setUint8(o + 1, node.childMask);
    hdv.setUint32(o + 2, node.numPoints, true);
    hdv.setBigInt64(o + 6, BigInt(node.byteOffset), true);
    hdv.setBigInt64(o + 14, BigInt(node.numPoints * PB), true);
    if (node.level > maxLevel) maxLevel = node.level;
    totalPoints += node.numPoints;
  }

  // ---- 5. metadata ----
  const boxMax = [offset[0] + cube, offset[1] + cube, offset[2] + cube];
  const metadata: PotreeMetadata = {
    version: "2.0",
    name: grid.baseName,
    description: "",
    points: totalPoints,
    projection: "",
    hierarchy: { firstChunkSize: hierarchy.length, stepSize: maxLevel + 1, depth: maxLevel },
    offset: [offset[0], offset[1], offset[2]],
    scale: [scale, scale, scale],
    spacing: rootSpacing,
    boundingBox: { min: [offset[0], offset[1], offset[2]], max: boxMax },
    encoding: "DEFAULT",
    attributes: [
      {
        name: "position", description: "", size: 12, numElements: 3, elementSize: 4, type: "int32",
        min: [offset[0], offset[1], offset[2]], max: boxMax, scale: [1, 1, 1], offset: [0, 0, 0],
      },
      {
        name: "rgb", description: "", size: 6, numElements: 3, elementSize: 2, type: "uint16",
        min: [0, 0, 0], max: [65535, 65535, 65535], scale: [1, 1, 1], offset: [0, 0, 0],
      },
    ],
  };

  // ---- 6. chop the top + build the manifest in byte order: [top pieces ++ each tile's pieces] ----
  const topPieces = chopOctree(concatBytes(topParts), opts.topPiecePrefix ?? "top_");
  const manifest: PotreeManifestSlot[] = topPieces.map((piece, index) => ({
    kind: "top" as const,
    index,
    size: piece.data.length,
  }));
  for (const name of cellOrder) {
    const info = cellInfo.get(name)!;
    info.pieces.forEach((piece, index) => {
      manifest.push({ kind: "cell", cell: name, index, size: piece.size, id: piece.id });
    });
  }

  return {
    metadata,
    hierarchy,
    topPieces,
    manifest,
    totalPoints,
    totalOctreeBytes,
    nodeCount: order.length,
  };
}
