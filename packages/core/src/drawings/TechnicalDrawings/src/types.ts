import * as THREE from "three";
import { DrawingViewport } from "./DrawingViewport";

// ─── Tick builders ────────────────────────────────────────────────────────────

/**
 * A function that produces tick mark geometry at one endpoint of a dimension
 * or leader line. Returns a flat array of XYZ triplets (vertex pairs for
 * `LineSegments`).
 *
 * @param tip     - The endpoint of the line (drawing local space).
 * @param lineDir - Normalised direction FROM `tip` TOWARD the other endpoint.
 * @param size    - Tick size in drawing local units.
 */
export type LineTickBuilder = (
  tip: THREE.Vector3,
  lineDir: THREE.Vector3,
  size: number,
) => number[];

/**
 * A function that produces filled tick mark geometry (triangles) at one
 * endpoint. Returns a flat array of XYZ triplets forming non-indexed triangles
 * for a `THREE.Mesh`.
 *
 * Same signature as {@link LineTickBuilder} — swap one for the other freely.
 *
 * @param tip     - The endpoint of the dimension or leader line.
 * @param lineDir - Normalised direction FROM `tip` TOWARD the other endpoint.
 * @param size    - Tick/arrow size in drawing local units.
 */
export type MeshTickBuilder = (
  tip: THREE.Vector3,
  lineDir: THREE.Vector3,
  size: number,
) => number[];

/**
 * A named organizational layer on a {@link TechnicalDrawing}.
 * Mirrors the layer concept in CAD applications (AutoCAD, DXF, etc.).
 */
export interface DrawingLayer {
  /** Unique name identifying this layer. */
  name: string;
  /** Whether objects on this layer are visible. Defaults to `true`. */
  visible: boolean;
  /**
   * Material applied to all projection `LineSegments` on this layer.
   * All objects on the same layer share this instance, so mutating it
   * (e.g. via {@link DrawingLayers.setColor}) is reflected immediately
   * without any traversal. Use {@link DrawingLayers.setMaterial} to
   * swap the instance entirely.
   *
   * Annotation systems always use their own style material — this field
   * does not affect them.
   */
  material: THREE.LineBasicMaterial;
}

/**
 * Result of a successful raycast against a {@link TechnicalDrawing}.
 * The `point` is in the drawing's **local coordinate space** (XZ plane, Y = 0).
 */
export interface DrawingIntersection {
  /** Hit position in drawing local space (X right, Z down-screen, Y = 0). */
  point: THREE.Vector3;
  /** The Three.js object that was intersected (e.g. a LineSegments). */
  object: THREE.Object3D;
  /**
   * The viewport whose camera was used for the raycast, or `null` when the
   * pick originated from a world-space camera (e.g. the 3D viewer).
   */
  viewport: DrawingViewport | null;
  /**
   * The specific line segment that was hit, expressed as a `THREE.Line3`
   * in drawing local space. `null` when the hit object is not a LineSegments.
   */
  line: THREE.Line3 | null;
}
