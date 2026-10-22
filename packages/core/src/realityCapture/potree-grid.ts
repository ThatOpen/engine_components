// Shared octree-grid geometry for the distributed Potree build (PLAN → BUILD → MERGE).
//
// Every stage — planning the tiles, building one tile as an aligned subtree, and merging the
// tiles into one global tree — must agree EXACTLY on where a point lives in the octree.
// This module is that single source of truth; {@link buildPotreeOctree} follows the same
// convention internally.
//
// OCTANT BIT ORDER (the load-bearing convention): bit1 -> Z, bit2 -> Y, bit4 -> X. This is
// what potree-core's `createChildAABB` derives each node's box from. Using the "obvious"
// bit1 -> X order instead mirrors every node's box across X<->Z relative to the points it
// actually holds, so the LOD/frustum test refers to the wrong region and the tree never
// refines. Do not "fix" this.
//
// NODE NAMES are Potree's: the root is `"r"`, and each subsequent character is the octant
// digit taken on the way down — so `"r041"` is depth 3, and a name's LEVEL is `length - 1`.
// Names may therefore be of DIFFERENT lengths across tiles (the plan splits adaptively).

/** Default minimum octree-piece size when chopping `octree.bin` for upload (8 MiB). */
export const POTREE_MIN_CHUNK = 8 * 1024 * 1024;

/** Chop `octree.bin` into roughly this many pieces, subject to {@link POTREE_MIN_CHUNK}. */
export const POTREE_TARGET_PIECES = 2000;

/** The global octree frame every tile is built against. */
export interface PotreeGrid {
  /** Global origin — the min corner of the cubic root node. */
  offset: [number, number, number];
  /** Quantization step for stored int32 positions (metres). */
  scale: number;
  /** Edge length of the cubic root node. */
  rootCube: number;
  /** Spacing of the root node (`rootCube / gridSize`). */
  rootSpacing: number;
  /** Deepest tile level in the plan. */
  K: number;
  /** Base name of the dataset (used for the `.potree` entry). */
  baseName: string;
  /** Source file the tiles are (re-)read from. */
  sourceFileId: string;
}

/**
 * Which child octant a point falls into, relative to a node's centre.
 * Bit order is bit1=Z, bit2=Y, bit4=X — see the module note.
 */
export function octantOf(
  x: number, y: number, z: number,
  halfwayX: number, halfwayY: number, midZ: number,
): number {
  return (z >= midZ ? 1 : 0) | (y >= halfwayY ? 2 : 0) | (x >= halfwayX ? 4 : 0);
}

/** The min corner of child `octant` of a node with min corner `min` and half-size `half`. */
export function childMin(
  min: ArrayLike<number>,
  half: number,
  octant: number,
): [number, number, number] {
  return [
    min[0] + (octant & 4 ? half : 0), // x <- bit4
    min[1] + (octant & 2 ? half : 0), // y <- bit2
    min[2] + (octant & 1 ? half : 0), // z <- bit1
  ];
}

/**
 * The Potree node name of the cell a point lands in at `depth` (e.g. `"r041"`).
 *
 * This is the EXACT cell-assignment used to filter the source during BUILD. Filtering by a
 * bounding-box test instead would double-count points that sit on a cell boundary (they lie
 * in two adjacent boxes); descending the octant digits assigns each point to exactly one cell.
 */
export function cellNameOf(
  x: number, y: number, z: number,
  gridMin: ArrayLike<number>,
  rootCube: number,
  depth: number,
): string {
  let min: [number, number, number] = [gridMin[0], gridMin[1], gridMin[2]];
  let size = rootCube;
  let name = "r";
  for (let level = 0; level < depth; level++) {
    const half = size / 2;
    const octant = octantOf(x, y, z, min[0] + half, min[1] + half, min[2] + half);
    name += octant;
    min = childMin(min, half, octant);
    size = half;
  }
  return name;
}

/** The box of the node called `name`, by replaying its octant digits from the root. */
export function boxForName(
  name: string,
  gridMin: ArrayLike<number>,
  rootCube: number,
): { min: [number, number, number]; size: number } {
  let min: [number, number, number] = [gridMin[0], gridMin[1], gridMin[2]];
  let size = rootCube;
  for (let i = 1; i < name.length; i++) {
    const half = size / 2;
    min = childMin(min, half, Number(name[i]));
    size = half;
  }
  return { min, size };
}

/**
 * Piece size to chop an `octree.bin` of `bytes` into: aims for {@link POTREE_TARGET_PIECES}
 * pieces, rounded up to a whole number of {@link POTREE_MIN_CHUNK} blocks (and never smaller
 * than one). The viewer byte-ranges these pieces, so they must be uniform except the last.
 */
export function octreeChunkSize(bytes: number, smallestChunk = POTREE_MIN_CHUNK): number {
  return Math.max(smallestChunk, Math.ceil(bytes / POTREE_TARGET_PIECES / smallestChunk) * smallestChunk);
}

/** Split `octree` into uniformly-sized upload pieces named `<prefix><i>.bin`. */
export function chopOctree(
  octree: Uint8Array,
  prefix: string,
  smallestChunk = POTREE_MIN_CHUNK,
): { name: string; data: Uint8Array }[] {
  const size = octreeChunkSize(octree.length, smallestChunk);
  const pieces: { name: string; data: Uint8Array }[] = [];
  for (let offset = 0, i = 0; offset < octree.length; offset += size, i++) {
    pieces.push({
      name: `${prefix}${i}.bin`,
      data: octree.subarray(offset, Math.min(offset + size, octree.length)),
    });
  }
  return pieces;
}

/** Concatenate byte runs into one buffer. */
export function concatBytes(parts: Uint8Array[]): Uint8Array {
  let total = 0;
  for (const p of parts) total += p.length;
  const out = new Uint8Array(total);
  let offset = 0;
  for (const p of parts) {
    out.set(p, offset);
    offset += p.length;
  }
  return out;
}
