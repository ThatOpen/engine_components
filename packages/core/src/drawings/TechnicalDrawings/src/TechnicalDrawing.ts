import * as THREE from "three";
import { LineSegmentsBVH } from "three-mesh-bvh";
import { Event, World } from "../../../core";
import { Components } from "../../../core/Components";
import { EdgeProjector } from "../../../fragments/EdgeProjector";
import { ModelIdMap } from "../../../fragments/FragmentsManager";
import { Disposer } from "../../../core/Disposer";
import { DrawingViewport } from "./DrawingViewport";
import { DrawingViewports } from "./DrawingViewports";
import { DrawingIntersection } from "./types";
import { computeAlignmentMatrix } from "./alignment";
import { DrawingLayers } from "./DrawingLayers";
import { DrawingAnnotations } from "./DrawingAnnotations";

/**
 * A single technical drawing — the core spatial aggregate.
 *
 * Brings together:
 * - A {@link three} (`THREE.Group`) that anchors the drawing in world space.
 *   All 2D geometry (projection lines, dimensions) must be added as children of
 *   this group so they inherit its world transform.
 * - A collection of {@link viewports}, each defining an orthographic framing
 *   window and owning a camera that is itself a child of the container.
 *
 * Moving or rotating the container repositions the entire drawing — including
 * all its viewport cameras — in the 3D world without affecting any local
 * coordinates.
 *
 * ---
 *
 * ### Rotation convention
 *
 * The drawing projects geometry along its **local −Y axis**. The drawing
 * plane is the local **XZ plane** (Y = 0).
 *
 * When rotating `drawing.three`, two constraints must hold at the same time:
 *
 * 1. **Projection direction** — local −Y must point toward the surface you
 *    want to capture.
 * 2. **Text orientation** — local +X must point toward the right side of the
 *    screen when the drawing is viewed from the projection direction.
 *    Violating this causes annotations and dimension text to appear mirrored.
 *
 * For the six standard orthographic views, use {@link orientTo} — it enforces
 * both constraints with a single call:
 *
 * ```ts
 * drawing.orientTo(new THREE.Vector3(0, -1, 0)); // top / plan
 * drawing.orientTo(new THREE.Vector3(0,  0, -1)); // front elevation
 * ```
 *
 * ---
 *
 * Typically created via {@link TechnicalDrawings.create}.
 */
export class TechnicalDrawing {
  /** Unique identifier for this drawing instance. */
  readonly uuid = THREE.MathUtils.generateUUID();

  private readonly _raycaster = new THREE.Raycaster();
  private readonly _components: Components;

  constructor(components: Components) {
    this._components = components;
  }

  /**
   * The world that hosts this drawing. Set automatically by
   * {@link TechnicalDrawings.create} — do not assign manually unless you are
   * managing the drawing's scene integration yourself.
   */
  world: World | null = null;

  /**
   * Root Three.js group for all 2D content belonging to this drawing.
   * All geometry (projection lines, dimensions) must be added as children so
   * they inherit its world transform.
   */
  readonly three = new THREE.Group();

  /**
   * Typed access to all annotation data stored on this drawing.
   *
   * ```ts
   * const dims = techDrawings.use(OBC.LinearAnnotations);
   * const data = drawing.annotations.getBySystem(dims);
   * // DataMap<annotationUuid, LinearAnnotation>
   * ```
   */
  readonly annotations = new DrawingAnnotations();

  /**
   * Layer manager for this drawing.
   * Use it to create layers, set colors, control visibility, and subscribe to
   * lifecycle events for reactive UI.
   *
   * ```ts
   * drawing.layers.create("walls", { color: 0x333333 });
   * drawing.layers.setColor("walls", 0x888888);
   * drawing.layers.setVisibility("walls", false);
   * ```
   */
  readonly layers = new DrawingLayers(this.three);

  /**
   * Name of the layer new annotations will be assigned to when added via any
   * drawing system. Must be a layer registered via {@link DrawingLayers.create}.
   * Defaults to `"0"`.
   */
  activeLayer = "0";

  /**
   * Depth of the projection capture volume, in world units, measured from the
   * drawing plane along the local -Y axis (the projection direction).
   *
   * Used by {@link TechnicalDrawingHelper} to visualise the volume, and by
   * `addProjectionFromItems` to set the far clipping plane of the
   * {@link EdgeProjector} automatically.
   *
   * Defaults to `10`.
   */
  far = 10;

  /** All viewports registered on this drawing, keyed by their UUID. */
  readonly viewports = new DrawingViewports(this.three);

  /** {@link Disposable.onDisposed} */
  readonly onDisposed = new Event<void>();

  /**
   * Intersects a pre-built ray against all layer-1 `LineSegments` in this drawing.
   *
   * The caller is responsible for building the ray (via `THREE.Raycaster.setFromCamera`
   * or any other method) so this method stays agnostic to which camera or canvas
   * the pick originated from.
   *
   * The returned {@link DrawingIntersection.point} is in drawing **local space**
   * (XZ plane, Y = 0), ready to use for dimension creation or snapping.
   *
   * @param ray - World-space ray to cast.
   * @param viewport - The viewport the ray was built from, if any. Pass `null`
   *   when picking from the 3D world camera.
   * @returns The closest intersection, or `null` if nothing was hit.
   */
  raycast(
    ray: THREE.Ray,
    viewport: DrawingViewport | null = null,
  ): DrawingIntersection | null {
    this._raycaster.set(ray.origin, ray.direction);
    this._raycaster.layers.set(1);
    if (this._raycaster.params.Line) {
      this._raycaster.params.Line.threshold = 0.1;
    }

    const targets: THREE.LineSegments[] = [];
    this.three.traverse((child) => {
      if (child instanceof THREE.LineSegments && !child.userData.isDimension)
        targets.push(child);
    });

    const hits = this._raycaster.intersectObjects(targets, false);
    if (hits.length === 0) return null;

    const hit = hits[0];
    const localPoint = this.three.worldToLocal(hit.point.clone());

    let line: THREE.Line3 | null = null;
    if (hit.object instanceof THREE.LineSegments && hit.index !== undefined) {
      const pos = hit.object.geometry.attributes.position as THREE.BufferAttribute;
      const i = hit.index;
      const start = new THREE.Vector3(pos.getX(i), pos.getY(i), pos.getZ(i));
      const end = new THREE.Vector3(pos.getX(i + 1), pos.getY(i + 1), pos.getZ(i + 1));
      start.applyMatrix4(hit.object.matrixWorld);
      this.three.worldToLocal(start);
      end.applyMatrix4(hit.object.matrixWorld);
      this.three.worldToLocal(end);
      line = new THREE.Line3(start, end);
    }

    return { point: localPoint, object: hit.object, viewport, line };
  }

  /**
   * Aligns this drawing to a target plane in 3D world space using three
   * point correspondences.
   *
   * Pass three points picked on the drawing (in drawing local space) and
   * three corresponding points picked on the 3D model (in world space).
   * The drawing's container will be repositioned, rotated, and uniformly
   * scaled so that the drawing points map to their world counterparts.
   *
   * @throws If either set of points is collinear or degenerate — see
   *   {@link computeAlignmentMatrix} for details.
   *
   * @param drawingPoints - Three non-collinear points in drawing local space.
   * @param worldPoints   - Three corresponding points in world space.
   */
  alignTo(drawingPoints: THREE.Vector3[], worldPoints: THREE.Vector3[]): void {
    const matrix = computeAlignmentMatrix(drawingPoints, worldPoints);
    matrix.decompose(
      this.three.position,
      this.three.quaternion,
      this.three.scale,
    );
  }

  /**
   * Projects a `THREE.LineSegments` from any world-space position onto the
   * given drawing's local XZ plane (Y = 0), returning a new `THREE.LineSegments`
   * ready to be added to {@link container}.
   *
   * Vertex coordinates are transformed from the input object's local space →
   * world space → drawing local space, then Y is zeroed.  The input object is
   * not modified.
   *
   * ```ts
   * const projected = TechnicalDrawing.toDrawingSpace(myIFCLines, drawing);
   * drawing.three.add(projected);
   * ```
   *
   * @param ls      - Source `LineSegments` to project. Its world matrix must be
   *   up-to-date (call `updateWorldMatrix(true, false)` if unsure).
   * @param drawing - Target drawing whose local XZ plane is used as destination.
   * @returns A new `LineSegments` with the projected geometry in drawing local
   *   space. No material is assigned — set one before rendering.
   */
  static toDrawingSpace(ls: THREE.LineSegments, drawing: TechnicalDrawing): THREE.LineSegments {
    ls.updateWorldMatrix(true, false);
    drawing.three.updateWorldMatrix(true, false);

    const combined = new THREE.Matrix4()
      .copy(drawing.three.matrixWorld)
      .invert()
      .multiply(ls.matrixWorld);

    const src = ls.geometry.attributes.position as THREE.BufferAttribute;
    const count = src.count;
    const out = new Float32Array(count * 3);
    const v = new THREE.Vector3();

    for (let i = 0; i < count; i++) {
      v.fromBufferAttribute(src, i).applyMatrix4(combined);
      out[i * 3] = v.x;
      out[i * 3 + 1] = 0;
      out[i * 3 + 2] = v.z;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(out, 3));

    return new THREE.LineSegments(geo);
  }

  /**
   * Adds a `THREE.LineSegments` to this drawing's {@link container} and
   * automatically computes a BVH on its geometry so that {@link raycast} can
   * pick individual line segments efficiently.
   *
   * Use this instead of `drawing.three.add()` whenever the geometry will
   * participate in picking. Plain `container.add()` still works for rendering,
   * but without BVH the raycast falls back to a brute-force O(n) test on every
   * segment — noticeably slow for dense projections.
   *
   * The layer assignment and Three.js rendering-layer setup (layer 1) are handled
   * internally — the caller does not need to touch `userData` or `ls.layers`.
   * If the named layer has a color defined, it is applied to the material immediately.
   *
   * ```ts
   * drawing.layers.create("walls", { color: 0x333333 });
   * drawing.addProjectionLines(wallLines, "walls");
   * ```
   *
   * @param ls    - The `LineSegments` to add.
   * @param layer - Layer name to assign. Defaults to `"0"`. If the layer does not
   *   exist, a warning is logged and the lines fall back to `"0"`.
   * @returns The same `LineSegments` instance, for chaining.
   */
  addProjectionLines(ls: THREE.LineSegments, layer = "0"): THREE.LineSegments {
    if (!this.layers.has(layer)) {
      console.warn(`[TechnicalDrawing] Layer "${layer}" does not exist. Falling back to "0".`);
      layer = "0";
    }
    this.layers.assign(ls, layer);
    ls.layers.set(1);
    // LineDashedMaterial requires line-distance attributes to place gaps correctly.
    if (ls.material instanceof THREE.LineDashedMaterial) ls.computeLineDistances();
    (ls.geometry as any).computeBoundsTree({ strategy: 0, indirect: true, type: LineSegmentsBVH });
    this.three.add(ls);
    return ls;
  }

  /**
   * Projects the visible and hidden edges of the given BIM model items onto
   * this drawing using {@link EdgeProjector}.
   *
   * The projection direction is inferred from the drawing's current world
   * orientation (local `-Y` axis). The capture volume extends from the drawing
   * plane by {@link far} world units along that direction. Items outside the
   * volume are excluded automatically.
   *
   * Both layer names must already exist on this drawing before calling this
   * method — create them with {@link DrawingLayers.create} beforehand.
   *
   * ```ts
   * drawing.layers.create("visible", { material: new THREE.LineBasicMaterial({ color: 0x000000 }) });
   * drawing.layers.create("hidden",  { material: new THREE.LineDashedMaterial({ color: 0x888888, dashSize: 0.2, gapSize: 0.1 }) });
   *
   * await drawing.addProjectionFromItems(modelIdMap, {
   *   layers: { visible: "visible", hidden: "hidden" },
   *   onProgress: (msg, pct) => console.log(msg, pct),
   * });
   * ```
   *
   * @param modelIdMap - Items to project, keyed by model ID.
   * @param config     - Required layer names and optional progress callback.
   */
  async addProjectionFromItems(
    modelIdMap: ModelIdMap,
    config: {
      layers: { visible: string; hidden: string };
      onProgress?: (message: string, progress?: number) => void;
    },
  ): Promise<void> {
    if (!this.world) {
      console.warn("[TechnicalDrawing] addProjectionFromItems: drawing has no world assigned.");
      return;
    }

    for (const name of [config.layers.visible, config.layers.hidden]) {
      if (!this.layers.has(name)) {
        console.warn(
          `[TechnicalDrawing] Layer "${name}" does not exist — ` +
          `create it before calling addProjectionFromItems.`,
        );
        return;
      }
    }

    const projector = this._components.get(EdgeProjector);

    // Save EdgeProjector state so we don't pollute it for the next caller.
    const savedDir  = projector.projectionDirection.clone();
    const savedNear = projector.nearPlane;
    const savedFar  = projector.farPlane;

    try {
      // Projection direction = drawing's local -Y axis in world space.
      this.three.updateWorldMatrix(true, false);
      const projDir = new THREE.Vector3(0, -1, 0)
        .transformDirection(this.three.matrixWorld)
        .normalize();
      projector.projectionDirection.copy(projDir);

      // EdgeProjector rotates everything so projDir → (0,-1,0).
      // near/far are Y values in that rotated coordinate space.
      const rotMat = new THREE.Matrix4().makeRotationFromQuaternion(
        new THREE.Quaternion().setFromUnitVectors(projDir, new THREE.Vector3(0, -1, 0)),
      );
      const planeY = new THREE.Vector3()
        .setFromMatrixPosition(this.three.matrixWorld)
        .applyMatrix4(rotMat).y;

      projector.farPlane  = planeY;
      projector.nearPlane = planeY - this.far;

      const result = await projector.get(modelIdMap, this.world, {
        onProgress: config.onProgress,
      });

      // Result geometries are in world space. Transform to drawing local space
      // and flatten onto the drawing plane (Y = 0).
      const toLocal = (geo: THREE.BufferGeometry) =>
        TechnicalDrawing.toDrawingSpace(new THREE.LineSegments(geo), this);

      this.addProjectionLines(toLocal(result.visible), config.layers.visible);
      this.addProjectionLines(toLocal(result.hidden),  config.layers.hidden);
    } finally {
      projector.projectionDirection.copy(savedDir);
      projector.nearPlane = savedNear;
      projector.farPlane  = savedFar;
    }
  }

  /**
   * Orients the drawing to one of the six standard orthographic projection
   * directions.
   *
   * Pass any of the six axis-aligned unit vectors. The method sets
   * `drawing.three.quaternion` to the correct rotation so that:
   * - The drawing's local **−Y** axis aligns with `direction`.
   * - The drawing's local **+X** axis points toward the right side of the
   *   screen when the drawing is viewed from that direction, ensuring
   *   annotations and text render without mirroring.
   *
   * ```ts
   * drawing.orientTo(new THREE.Vector3(0, -1,  0)); // top / plan
   * drawing.orientTo(new THREE.Vector3(0,  1,  0)); // bottom / RCP
   * drawing.orientTo(new THREE.Vector3(0,  0, -1)); // front elevation
   * drawing.orientTo(new THREE.Vector3(0,  0,  1)); // back elevation
   * drawing.orientTo(new THREE.Vector3(-1, 0,  0)); // right elevation
   * drawing.orientTo(new THREE.Vector3(1,  0,  0)); // left elevation
   * ```
   *
   * A console warning is emitted if `direction` does not match any of the six
   * standard axes.
   *
   * @param direction - Desired projection direction (need not be pre-normalized).
   */
  orientTo(direction: THREE.Vector3): void {
    const d = direction.clone().normalize();
    const s = Math.SQRT1_2; // 1/√2 ≈ 0.7071

    if      (d.x >  0.999) this.three.quaternion.set( 0.5,  -0.5,  0.5, 0.5); // left   (+X)
    else if (d.x < -0.999) this.three.quaternion.set( 0.5,   0.5, -0.5, 0.5); // right  (−X)
    else if (d.y >  0.999) this.three.quaternion.set(   0,     0,    1,   0); // bottom (+Y)
    else if (d.y < -0.999) this.three.quaternion.set(   0,     0,    0,   1); // top    (−Y)
    else if (d.z >  0.999) this.three.quaternion.set(   0,     s,   -s,   0); // back   (+Z)
    else if (d.z < -0.999) this.three.quaternion.set(   s,     0,    0,   s); // front  (−Z)
    else console.warn("[TechnicalDrawing] orientTo: direction does not match any of the 6 standard axes.");
  }

  /** Disposes all viewports, layers, annotations and removes the container (and all its Three.js geometry) from memory. */
  dispose(): void {
    this.viewports.clear();
    this.layers.clear();
    this.annotations.clear();
    const disposer = this._components.get(Disposer);
    disposer.destroy(this.three);
    this.onDisposed.trigger();
    this.onDisposed.reset();
  }
}
