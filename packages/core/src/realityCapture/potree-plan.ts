// PLAN — decide how to cut a point cloud that is too big to build in one pass into tiles
// that each fit in a worker, so BUILD can run them concurrently and MERGE can graft them
// back into one global octree.
//
// The cut is ADAPTIVE, not a uniform grid. A uniform split at depth K is wrong for real
// scans: a scan is wildly non-uniform, so a K that keeps the dense cells under the memory
// cap explodes the empty sky into thousands of pointless jobs, while a K small enough to
// keep the job count sane leaves the dense cells too big to build. Instead we count once at
// a FINE level, then walk top-down and cut a node into a tile as soon as its point count
// fits the cap. Dense regions end up deep, sparse regions stay shallow, and every tile is
// bounded — with the fewest jobs.
//
// Both stages here are pure compute. The caller streams the source (that's the I/O) and
// feeds points to {@link PotreeCellCounter}; the counting itself is O(1) memory per cell.

import { cellNameOf } from "./potree-grid.js";

/** Level at which cells are counted. Deep enough that a dense cell still lands under the cap. */
export const POTREE_COUNT_DEPTH = 7;

/** Default per-tile point cap. Sized so one tile fits a ~7 GB / 2 CPU worker. */
export const POTREE_MAX_CELL_POINTS = 50_000_000;

/** One tile of the plan: a Potree node name and how many points fall inside it. */
export interface PotreeTileCell {
  /** Potree node name (`"r041"`); its LEVEL is `name.length - 1`. */
  name: string;
  count: number;
}

/** The result of {@link planPotreeTiles}. */
export interface PotreePlan {
  /** The tiles to BUILD, largest first (so the slowest jobs start earliest). */
  cells: PotreeTileCell[];
  /** Deepest tile level in the plan. */
  maxDepth: number;
  /**
   * Tiles that STILL exceed the cap at {@link POTREE_COUNT_DEPTH} — they cannot be split
   * further without a finer counting pass. Non-zero means raising the count depth; the
   * caller should surface it rather than silently building an over-sized tile.
   */
  overCap: number;
}

/**
 * Counts points per octree cell at a fixed depth, in bounded memory.
 *
 * Feed it every point of the source (one streaming pass); it keeps only a count per OCCUPIED
 * cell, so memory tracks the occupied surface of the scan, not its point count.
 */
export class PotreeCellCounter {
  /** Occupied cell name -> point count, at {@link depth}. */
  readonly counts = new Map<string, number>();

  /** Total points seen. */
  total = 0;

  constructor(
    private readonly gridMin: ArrayLike<number>,
    private readonly rootCube: number,
    /** Counting level. */
    readonly depth: number = POTREE_COUNT_DEPTH,
  ) {}

  /** Record one point. */
  add(x: number, y: number, z: number): void {
    const name = cellNameOf(x, y, z, this.gridMin, this.rootCube, this.depth);
    this.counts.set(name, (this.counts.get(name) ?? 0) + 1);
    this.total++;
  }
}

/** Options for {@link planPotreeTiles}. */
export interface PotreePlanOptions {
  /** Per-tile point cap. Default {@link POTREE_MAX_CELL_POINTS}. */
  maxCellPoints?: number;
  /**
   * Force every tile to at least this depth, even when a shallower node would already fit
   * the cap. Default `0` (cut as shallow as fits). Use to reproduce a uniform-depth tiling.
   */
  minDepth?: number;
  /** The depth the counts were taken at. Default {@link POTREE_COUNT_DEPTH}. */
  countDepth?: number;
}

/**
 * Turn per-cell counts into an adaptive set of tiles.
 *
 * @param counts Occupied-cell counts at `countDepth` — from {@link PotreeCellCounter}.
 * @returns The tiles to BUILD, largest first.
 */
export function planPotreeTiles(
  counts: ReadonlyMap<string, number>,
  opts: PotreePlanOptions = {},
): PotreePlan {
  const cap = opts.maxCellPoints ?? POTREE_MAX_CELL_POINTS;
  const minDepth = opts.minDepth ?? 0;
  const countDepth = opts.countDepth ?? POTREE_COUNT_DEPTH;

  // Aggregate the fine leaf counts up to EVERY ancestor prefix ("r", "r0", "r04", ...), so
  // the count of any node is an O(1) lookup during the top-down walk.
  const aggregate = new Map<string, number>();
  for (const [name, count] of counts) {
    for (let len = 1; len <= name.length; len++) {
      const prefix = name.slice(0, len);
      aggregate.set(prefix, (aggregate.get(prefix) ?? 0) + count);
    }
  }

  const cells: PotreeTileCell[] = [];
  let maxDepth = 0;
  let overCap = 0;

  // Top-down: cut here if this node already fits the cap (and is deep enough), otherwise
  // recurse into the octants that actually hold points.
  const split = (name: string): void => {
    const count = aggregate.get(name) ?? 0;
    if (count === 0) return;
    const depth = name.length - 1;

    if ((depth >= minDepth && count <= cap) || depth >= countDepth) {
      cells.push({ name, count });
      if (depth > maxDepth) maxDepth = depth;
      // Bottomed out at the counting depth and STILL too big — cannot split further.
      if (count > cap) overCap++;
      return;
    }
    for (let octant = 0; octant < 8; octant++) {
      const child = name + octant;
      if (aggregate.has(child)) split(child);
    }
  };
  split("r");

  // Largest tiles first: the longest jobs should start earliest.
  cells.sort((a, b) => b.count - a.count);

  return { cells, maxDepth, overCap };
}
