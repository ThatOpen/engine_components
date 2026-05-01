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

const DEFAULT_IDLE_MS = 30_000;
const VERTEX_QUANT = 1_000; // 1mm grid

/**
 * Main-thread snap resolver: takes a world-space pick point + the
 * picked item, returns the closest face / line / point of that item
 * for any requested snap classes. The heavy work (fetching the item's
 * shell geometry through the fragments edit API and composing
 * world-space polygons) runs once per item and is cached; subsequent
 * calls for the same item are pure CPU geometry.
 *
 * Caching strategy: per `(modelId, localId)` key, with an idle timer
 * that evicts after {@link idleMs} of no `resolve()` / `touch()`
 * call. Tools that drive `castRay` from hover (Hoverer, Highlighter)
 * naturally warm the cache before a click, so snap-aware clicks feel
 * instant.
 */
export class SnapResolver implements Disposable {
  /** {@link Disposable.onDisposed} */
  readonly onDisposed = new Event();

  /** Eviction window for cached item geometry. */
  idleMs = DEFAULT_IDLE_MS;

  private readonly components: Components;
  private readonly cache = new Map<string, ItemSnapData>();
  private readonly idleTimers = new Map<string, ReturnType<typeof setTimeout>>();

  constructor(components: Components) {
    this.components = components;
  }

  /** {@link Disposable.dispose} */
  dispose() {
    for (const t of this.idleTimers.values()) clearTimeout(t);
    this.idleTimers.clear();
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
    localId: number,
    classes: Iterable<SnapClass>,
  ): Promise<SnapResult | null> {
    const key = SnapResolver.keyOf(modelId, localId);
    let data: ItemSnapData | null | undefined = this.cache.get(key);
    if (!data) {
      data = await this.fetchItemSnapData(modelId, localId);
      if (!data) return null;
      this.cache.set(key, data);
    }
    this.bumpIdleTimer(key);

    let best: { result: SnapResult; distance: number } | null = null;
    for (const cls of classes) {
      const candidate = this.snap(point, data, cls);
      if (!candidate) continue;
      const d = candidate.result.point.distanceTo(point);
      if (!best || d < best.distance) best = { result: candidate.result, distance: d };
    }
    return best?.result ?? null;
  }

  /**
   * Bump the idle timer for an item without doing snap work. Hoverer
   * can call this on each hover tick to keep the geometry warm so
   * the user's eventual click is instant.
   */
  touch(modelId: string, localId: number) {
    const key = SnapResolver.keyOf(modelId, localId);
    if (this.cache.has(key)) this.bumpIdleTimer(key);
  }

  /** Drop a specific item from the cache (e.g. after an edit). */
  invalidate(modelId: string, localId: number) {
    const key = SnapResolver.keyOf(modelId, localId);
    this.cache.delete(key);
    const t = this.idleTimers.get(key);
    if (t) clearTimeout(t);
    this.idleTimers.delete(key);
  }

  // ---------------------------------------------------------------------------
  // Internals
  // ---------------------------------------------------------------------------

  private static keyOf(modelId: string, localId: number) {
    return `${modelId}:${localId}`;
  }

  private bumpIdleTimer(key: string) {
    const prev = this.idleTimers.get(key);
    if (prev) clearTimeout(prev);
    const t = setTimeout(() => {
      this.cache.delete(key);
      this.idleTimers.delete(key);
    }, this.idleMs);
    this.idleTimers.set(key, t);
  }

  private async fetchItemSnapData(
    modelId: string,
    localId: number,
  ): Promise<ItemSnapData | null> {
    const fragments = this.components.get(FragmentsManager);
    const model = fragments.list.get(modelId);
    if (!model) return null;

    // `_getElements` resolves to an array of `Element` wrappers. The
    // raw `ElementData` (samples / representations / transforms) lives
    // at `element.core`. We always pass a single localId so taking
    // index 0 is safe.
    const elements = (await (model as any)._getElements([localId])) as Array<{
      core: FRAGS.ElementData;
    }>;
    const data = elements?.[0]?.core;
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
    let bestIdx = 0;
    let bestSq = Infinity;
    for (let i = 0; i < v.length; i += 3) {
      const dx = v[i] - point.x;
      const dy = v[i + 1] - point.y;
      const dz = v[i + 2] - point.z;
      const sq = dx * dx + dy * dy + dz * dz;
      if (sq < bestSq) {
        bestSq = sq;
        bestIdx = i;
      }
    }
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
    const closest = new THREE.Vector3();
    const tmp = new THREE.Vector3();
    let bestSq = Infinity;
    let bestIdx = 0;
    for (let i = 0; i < e.length; i += 6) {
      const sq = pointToSegmentSq(
        point,
        e[i], e[i + 1], e[i + 2],
        e[i + 3], e[i + 4], e[i + 5],
        tmp,
      );
      if (sq < bestSq) {
        bestSq = sq;
        bestIdx = i;
        closest.copy(tmp);
      }
    }
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
      if (abs < bestAbs) {
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
