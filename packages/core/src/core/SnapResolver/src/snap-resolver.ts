import * as THREE from "three";
import * as FRAGS from "@thatopen/fragments";
import { Components } from "../../Components";
import { Disposable, Event } from "../../Types";
import { FragmentsManager } from "../../../fragments";

/**
 * Snap classes the resolver supports. Mirrors fragments' `SnappingClass`.
 */
export enum SnapClass {
  POINT = 0,
  LINE = 1,
  FACE = 2,
}

/**
 * One result of a {@link SnapResolver.resolve} call. Fields match what
 * the worker raycast snap path historically produces, so consumers
 * (length / area measurements, drawing tools) keep working unchanged
 * when their input switches from worker raycast to GPU pick + this.
 */
export type SnapResult = {
  /** Snapped world-space position (vertex / segment closest point /
   *  point projected onto the snapped face). */
  point: THREE.Vector3;
  /** World-space surface normal where applicable (always set for FACE,
   *  unset for POINT, derived from the picked surface for LINE). */
  normal?: THREE.Vector3;
  /** Which snap class this result represents. */
  snappingClass: SnapClass;
  /** Polygon vertices of the snapped face (FACE only). Flat array of
   *  `[x, y, z, x, y, z, ...]`. */
  facePoints?: Float32Array;
  /** Triangulation indices into `facePoints` (FACE only). For convex
   *  polygons we emit a fan; for concave the consumer can re-tessellate. */
  faceIndices?: Uint32Array;
  /** Endpoints of the snapped edge (LINE only). */
  snappedEdgeP1?: THREE.Vector3;
  snappedEdgeP2?: THREE.Vector3;
};

type Polygon = {
  /** Flat `[x, y, z, ...]` of polygon vertices in world space, in
   *  insertion order. */
  points: Float32Array;
  /** Polygon-plane normal (unit, world space). */
  normal: THREE.Vector3;
  /** Plane constant: `dot(normal, p0)`. Cached to avoid recomputing
   *  for each FACE distance check. */
  d: number;
};

type ItemSnapData = {
  faces: Polygon[];
  /** Flat edge segment array `[ax,ay,az, bx,by,bz, ...]`. Edges are
   *  deduplicated across triangulation seams via canonical (a, b)
   *  pair where `a` < `b` lexicographically. */
  edges: Float32Array;
  /** Flat unique-vertex array `[x, y, z, ...]`. Quantised to 1mm to
   *  collapse near-duplicates. */
  vertices: Float32Array;
};

const VERTEX_QUANT = 1_000; // 1mm grid

/**
 * Main-thread snap resolver: takes a world-space pick point + the
 * picked item, returns the closest face / line / point of that item
 * for any requested snap classes. The heavy work (fetching the item's
 * shell geometry through the fragments edit API and composing
 * world-space polygons) runs once per item; subsequent calls for the
 * same item are pure CPU geometry against the LRU-bounded cache.
 * Call {@link invalidate} when an item changes (e.g. via the
 * fragments edit API) so the cached snap data gets refreshed on the
 * next request.
 */
export class SnapResolver implements Disposable {
  /** {@link Disposable.onDisposed} */
  readonly onDisposed = new Event();

  /**
   * Maximum world-space distance for a snap candidate to be
   * considered valid. Vertices, edges or face planes beyond this
   * range are rejected. Set this in the same units as your model
   * (typical BIM scenes are metres, so the default of 1 means
   * "snap only when within 1 m of the cursor"). Tools that want a
   * different feel can override per-instance.
   */
  maxDistance = 1;

  /**
   * Maximum number of items to keep in the snap cache. Beyond this,
   * the least-recently-used item is dropped on the next insertion.
   * Each cached item is on the order of a few KB (per-shell faces +
   * deduped edges + deduped vertices), so the default of 1000 caps
   * memory at a few MB even on huge models. Bump it for workflows
   * that revisit thousands of distinct items in a single session.
   */
  maxCacheSize = 1000;

  private readonly components: Components;
  // Map insertion order is recency order (LRU). On every read we
  // delete + re-set the entry to bump it to most-recent; on every
  // write we drop oldest entries until size <= maxCacheSize.
  private readonly cache = new Map<string, ItemSnapData>();

  constructor(components: Components) {
    this.components = components;
  }

  /** {@link Disposable.dispose} */
  dispose() {
    this.cache.clear();
    this.onDisposed.trigger();
    this.onDisposed.reset();
  }

  /**
   * Returns the best snap candidate among the requested classes for a
   * pre-picked surface point on a known item, or `null` if the item
   * has no shell geometry. When multiple classes are requested, the
   * winner is whichever produces the smallest distance to the input
   * `point`.
   *
   * @param point - Pick point in world space (typically from the GPU
   *   picker's `getFullPick`).
   * @param modelId - Model the picked item belongs to.
   * @param localId - The picked item's localId.
   * @param classes - Subset of {@link SnapClass} the caller cares about.
   */
  async resolve(
    point: THREE.Vector3,
    modelId: string,
    /**
     * Internal **itemId** (the FlatBuffer `sample.item()` index, key
     * for `boxes.sampleOf`), not the user-facing localId. The picker
     * exposes this on its full-pick result; passing it through here
     * lets us hit the O(1) item→samples reverse index on the worker
     * via `_getItemSnapData(itemId)`. Keying by localId would force a
     * full sample-table scan (~1 s on big models).
     */
    itemId: number,
    classes: Iterable<SnapClass>,
  ): Promise<SnapResult | null> {
    const key = SnapResolver.keyOf(modelId, itemId);
    let data: ItemSnapData | null | undefined = this.cache.get(key);
    if (data) {
      // Bump recency: delete + re-insert moves to end of iteration
      // order (newest), where Map insertion order = LRU recency.
      this.cache.delete(key);
      this.cache.set(key, data);
    } else {
      data = await this.fetchItemSnapData(modelId, itemId);
      if (!data) return null;
      this.storeWithLRU(key, data);
    }

    // Always compute the closest face — we attach its polygon to
    // every result regardless of which class wins, so consumers
    // that need the surface (e.g. AreaMeasurement's `face` and
    // `square` modes) can always reach it.
    const faceCandidate = this.snap(point, data, SnapClass.FACE);

    // Priority order matches CAD tool conventions: POINT beats LINE
    // beats FACE. The first class with a candidate inside
    // {@link maxDistance} wins. Candidates beyond `maxDistance` are
    // rejected so the caller falls through to the next class.
    const requested = new Set(classes);
    const priority = [SnapClass.POINT, SnapClass.LINE, SnapClass.FACE];
    let winner: SnapResult | null = null;
    for (const cls of priority) {
      if (!requested.has(cls)) continue;
      const candidate = this.snap(point, data, cls);
      if (candidate) {
        winner = candidate.result;
        break;
      }
    }
    // If no snap class qualified but we have a face, surface the
    // face metadata anyway — `face` / `square` measurement modes
    // need it even when the cursor isn't near a snappable vertex
    // or edge. In that case the result's `point` falls back to the
    // GPU pick's surface point (caller-provided).
    if (!winner) {
      if (!faceCandidate) return null;
      return faceCandidate.result;
    }
    if (faceCandidate && winner.snappingClass !== SnapClass.FACE) {
      const f = faceCandidate.result;
      if (!winner.normal && f.normal) winner.normal = f.normal;
      if (!winner.facePoints && f.facePoints) winner.facePoints = f.facePoints;
      if (!winner.faceIndices && f.faceIndices) winner.faceIndices = f.faceIndices;
    }
    return winner;
  }

  /**
   * Fire-and-forget prefetch of an item's snap geometry. Hoverer calls
   * this on lock-onto-new-item so by the time the user clicks, the
   * worker round-trip is already paid and `resolve` resolves
   * synchronously off the cache.
   *
   * Returns a Promise so callers who *do* want to await can; most
   * won't.
   */
  async prefetch(modelId: string, itemId: number) {
    const key = SnapResolver.keyOf(modelId, itemId);
    if (this.cache.has(key)) return;
    const data = await this.fetchItemSnapData(modelId, itemId);
    if (!data) return;
    this.storeWithLRU(key, data);
  }

  /** Drop a specific item from the cache (e.g. after an edit). */
  invalidate(modelId: string, itemId: number) {
    const key = SnapResolver.keyOf(modelId, itemId);
    this.cache.delete(key);
  }

  /** Drop the entire cache. Useful when many items have changed. */
  clear() {
    this.cache.clear();
  }

  // ---------------------------------------------------------------------------
  // Internals
  // ---------------------------------------------------------------------------

  private static keyOf(modelId: string, localId: number) {
    return `${modelId}:${localId}`;
  }

  private storeWithLRU(key: string, data: ItemSnapData) {
    this.cache.set(key, data);
    while (this.cache.size > this.maxCacheSize) {
      const oldest = this.cache.keys().next().value;
      if (oldest === undefined) break;
      this.cache.delete(oldest);
    }
  }

  private async fetchItemSnapData(
    modelId: string,
    itemId: number,
  ): Promise<ItemSnapData | null> {
    const fragments = this.components.get(FragmentsManager);
    const model = fragments.list.get(modelId);
    if (!model) return null;

    // Itemid-keyed fast path: fragments looks up the item's samples in
    // O(1) via `boxes.sampleOf(itemId)` and returns just the snap-
    // relevant slice (samples + transforms + SHELL representations).
    // Compare to the previous `_getElements([localId])` path, which
    // scanned the full sample table (~1 s on superbig regardless of
    // how few items you ask for).
    const data = (await (model as any)._getItemSnapData(
      itemId,
    )) as FRAGS.ElementData | null;
    if (!data) return null;

    const modelWorldMatrix = model.object.matrixWorld;
    const polygons: Polygon[] = [];

    for (const sampleIdStr of Object.keys(data.samples ?? {})) {
      const sample = data.samples[Number(sampleIdStr)];
      const repr = data.representations[sample.representation];
      if (!repr || repr.representationClass !== 1 /* SHELL */) continue;
      const shell = repr.geometry as FRAGS.RawShell | undefined;
      if (!shell) continue;

      const lt = data.localTransforms[sample.localTransform];
      const gt = data.globalTransforms[sample.item];

      const worldMatrix = composeWorldMatrix(modelWorldMatrix, gt, lt);
      this.collectPolygonsFromShell(shell, worldMatrix, polygons);
    }

    if (polygons.length === 0) return null;

    const edges = deriveUniqueEdges(polygons);
    const vertices = deriveUniqueVertices(polygons);
    return { faces: polygons, edges, vertices };
  }

  private collectPolygonsFromShell(
    shell: FRAGS.RawShell,
    worldMatrix: THREE.Matrix4,
    out: Polygon[],
  ) {
    const points = shell.points;
    const profiles = shell.profiles ?? new Map();
    const bigProfiles = shell.bigProfiles ?? new Map();
    // Holes are subtractive cutouts referencing a profile_id. We don't
    // model them yet — for snap purposes, a face that has a hole still
    // has its outer ring as the snap target, which is what consumers
    // expect (you snap to the wall, not to the hole punched in it).
    const tmp = new THREE.Vector3();
    const collect = (indices: number[]) => {
      if (indices.length < 3) return;
      const flat = new Float32Array(indices.length * 3);
      for (let i = 0; i < indices.length; i++) {
        const p = points[indices[i]];
        tmp.set(p[0], p[1], p[2]).applyMatrix4(worldMatrix);
        flat[i * 3] = tmp.x;
        flat[i * 3 + 1] = tmp.y;
        flat[i * 3 + 2] = tmp.z;
      }
      const normal = polygonNormal(flat);
      if (!normal) return; // degenerate
      const d = normal.x * flat[0] + normal.y * flat[1] + normal.z * flat[2];
      out.push({ points: flat, normal, d });
    };
    for (const indices of profiles.values()) collect(indices);
    for (const indices of bigProfiles.values()) collect(indices);
  }

  // ---------------------------------------------------------------------------
  // Snap algorithms
  // ---------------------------------------------------------------------------

  private snap(
    point: THREE.Vector3,
    data: ItemSnapData,
    cls: SnapClass,
  ): { result: SnapResult } | null {
    if (cls === SnapClass.POINT) return this.snapToPoint(point, data);
    if (cls === SnapClass.LINE) return this.snapToLine(point, data);
    if (cls === SnapClass.FACE) return this.snapToFace(point, data);
    return null;
  }

  private snapToPoint(point: THREE.Vector3, data: ItemSnapData) {
    const v = data.vertices;
    if (v.length === 0) return null;
    const maxSq = this.maxDistance * this.maxDistance;
    let bestIdx = -1;
    let bestSq = Infinity;
    for (let i = 0; i < v.length; i += 3) {
      const dx = v[i] - point.x;
      const dy = v[i + 1] - point.y;
      const dz = v[i + 2] - point.z;
      const sq = dx * dx + dy * dy + dz * dz;
      if (sq <= maxSq && sq < bestSq) {
        bestSq = sq;
        bestIdx = i;
      }
    }
    if (bestIdx < 0) return null;
    return {
      result: {
        point: new THREE.Vector3(v[bestIdx], v[bestIdx + 1], v[bestIdx + 2]),
        snappingClass: SnapClass.POINT,
      } as SnapResult,
    };
  }

  private snapToLine(point: THREE.Vector3, data: ItemSnapData) {
    const e = data.edges;
    if (e.length === 0) return null;
    const maxSq = this.maxDistance * this.maxDistance;
    const closest = new THREE.Vector3();
    const tmp = new THREE.Vector3();
    let bestSq = Infinity;
    let bestIdx = -1;
    for (let i = 0; i < e.length; i += 6) {
      const sq = pointToSegmentSq(
        point,
        e[i], e[i + 1], e[i + 2],
        e[i + 3], e[i + 4], e[i + 5],
        tmp,
      );
      if (sq <= maxSq && sq < bestSq) {
        bestSq = sq;
        bestIdx = i;
        closest.copy(tmp);
      }
    }
    if (bestIdx < 0) return null;
    return {
      result: {
        point: closest.clone(),
        snappingClass: SnapClass.LINE,
        snappedEdgeP1: new THREE.Vector3(
          e[bestIdx], e[bestIdx + 1], e[bestIdx + 2],
        ),
        snappedEdgeP2: new THREE.Vector3(
          e[bestIdx + 3], e[bestIdx + 4], e[bestIdx + 5],
        ),
      } as SnapResult,
    };
  }

  private snapToFace(point: THREE.Vector3, data: ItemSnapData) {
    const faces = data.faces;
    if (faces.length === 0) return null;
    let best: Polygon | null = null;
    let bestAbs = Infinity;
    for (const f of faces) {
      const signed =
        f.normal.x * point.x +
        f.normal.y * point.y +
        f.normal.z * point.z -
        f.d;
      const abs = Math.abs(signed);
      if (abs <= this.maxDistance && abs < bestAbs) {
        bestAbs = abs;
        best = f;
      }
    }
    if (!best) return null;
    // Project pick point onto the polygon's plane.
    const projected = point
      .clone()
      .sub(best.normal.clone().multiplyScalar(
        best.normal.x * point.x +
          best.normal.y * point.y +
          best.normal.z * point.z -
          best.d,
      ));
    return {
      result: {
        point: projected,
        normal: best.normal.clone(),
        snappingClass: SnapClass.FACE,
        facePoints: best.points,
        faceIndices: fanTriangulation(best.points.length / 3),
      } as SnapResult,
    };
  }
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

const _tmpMatrix = new THREE.Matrix4();
const _tmpX = new THREE.Vector3();
const _tmpY = new THREE.Vector3();
const _tmpZ = new THREE.Vector3();

/**
 * Build a 4×4 matrix from `position + xDirection + yDirection`. zDir is
 * derived as `xDir × yDir`. Three components default to identity if a
 * transform is missing.
 */
function transformToMatrix(
  t: FRAGS.RawTransformData | undefined,
  out: THREE.Matrix4,
): THREE.Matrix4 {
  if (!t) return out.identity();
  const px = t.position[0], py = t.position[1], pz = t.position[2];
  _tmpX.set(t.xDirection[0], t.xDirection[1], t.xDirection[2]);
  _tmpY.set(t.yDirection[0], t.yDirection[1], t.yDirection[2]);
  _tmpZ.crossVectors(_tmpX, _tmpY);
  out.set(
    _tmpX.x, _tmpY.x, _tmpZ.x, px,
    _tmpX.y, _tmpY.y, _tmpZ.y, py,
    _tmpX.z, _tmpY.z, _tmpZ.z, pz,
    0, 0, 0, 1,
  );
  return out;
}

const _gtMat = new THREE.Matrix4();
const _ltMat = new THREE.Matrix4();
function composeWorldMatrix(
  modelMatrix: THREE.Matrix4,
  gt: FRAGS.RawTransformData | undefined,
  lt: FRAGS.RawTransformData | undefined,
): THREE.Matrix4 {
  transformToMatrix(gt, _gtMat);
  transformToMatrix(lt, _ltMat);
  // worldMatrix = modelMatrix · gt · lt
  return _tmpMatrix.copy(modelMatrix).multiply(_gtMat).multiply(_ltMat).clone();
}

/**
 * Newell's method for polygon normal — robust for non-triangle and
 * slightly non-planar polygons that arise from coordinate rounding.
 * Returns `null` if the polygon collapses to a line.
 */
function polygonNormal(flat: Float32Array): THREE.Vector3 | null {
  const n = new THREE.Vector3();
  const count = flat.length / 3;
  for (let i = 0; i < count; i++) {
    const j = (i + 1) % count;
    const xi = flat[i * 3], yi = flat[i * 3 + 1], zi = flat[i * 3 + 2];
    const xj = flat[j * 3], yj = flat[j * 3 + 1], zj = flat[j * 3 + 2];
    n.x += (yi - yj) * (zi + zj);
    n.y += (zi - zj) * (xi + xj);
    n.z += (xi - xj) * (yi + yj);
  }
  const len = n.length();
  if (len < 1e-10) return null;
  return n.divideScalar(len);
}

function fanTriangulation(vertexCount: number): Uint32Array {
  if (vertexCount < 3) return new Uint32Array(0);
  const triCount = vertexCount - 2;
  const out = new Uint32Array(triCount * 3);
  for (let i = 0; i < triCount; i++) {
    out[i * 3] = 0;
    out[i * 3 + 1] = i + 1;
    out[i * 3 + 2] = i + 2;
  }
  return out;
}

function deriveUniqueEdges(faces: Polygon[]): Float32Array {
  // Edge dedup keyed by quantised endpoint pair, canonical-ordered so
  // (a, b) and (b, a) collapse.
  const seen = new Set<string>();
  const collected: number[] = [];
  for (const f of faces) {
    const p = f.points;
    const count = p.length / 3;
    for (let i = 0; i < count; i++) {
      const j = (i + 1) % count;
      const ax = p[i * 3], ay = p[i * 3 + 1], az = p[i * 3 + 2];
      const bx = p[j * 3], by = p[j * 3 + 1], bz = p[j * 3 + 2];
      const k = canonicalEdgeKey(ax, ay, az, bx, by, bz);
      if (seen.has(k)) continue;
      seen.add(k);
      collected.push(ax, ay, az, bx, by, bz);
    }
  }
  return new Float32Array(collected);
}

function deriveUniqueVertices(faces: Polygon[]): Float32Array {
  const seen = new Set<string>();
  const collected: number[] = [];
  for (const f of faces) {
    const p = f.points;
    const count = p.length / 3;
    for (let i = 0; i < count; i++) {
      const x = p[i * 3], y = p[i * 3 + 1], z = p[i * 3 + 2];
      const k = quantKey(x, y, z);
      if (seen.has(k)) continue;
      seen.add(k);
      collected.push(x, y, z);
    }
  }
  return new Float32Array(collected);
}

function quantKey(x: number, y: number, z: number) {
  // 1mm bin so coordinate rounding doesn't fragment the unique set.
  return `${Math.round(x * VERTEX_QUANT)},${Math.round(y * VERTEX_QUANT)},${Math.round(z * VERTEX_QUANT)}`;
}

function canonicalEdgeKey(
  ax: number, ay: number, az: number,
  bx: number, by: number, bz: number,
) {
  const a = quantKey(ax, ay, az);
  const b = quantKey(bx, by, bz);
  return a < b ? `${a}|${b}` : `${b}|${a}`;
}

function pointToSegmentSq(
  p: THREE.Vector3,
  ax: number, ay: number, az: number,
  bx: number, by: number, bz: number,
  out: THREE.Vector3,
): number {
  const dx = bx - ax;
  const dy = by - ay;
  const dz = bz - az;
  const len2 = dx * dx + dy * dy + dz * dz;
  let t = 0;
  if (len2 > 0) {
    t = ((p.x - ax) * dx + (p.y - ay) * dy + (p.z - az) * dz) / len2;
    if (t < 0) t = 0;
    else if (t > 1) t = 1;
  }
  const cx = ax + t * dx;
  const cy = ay + t * dy;
  const cz = az + t * dz;
  out.set(cx, cy, cz);
  const ex = p.x - cx;
  const ey = p.y - cy;
  const ez = p.z - cz;
  return ex * ex + ey * ey + ez * ez;
}
