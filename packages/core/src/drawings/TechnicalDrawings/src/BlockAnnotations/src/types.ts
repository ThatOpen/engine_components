import * as THREE from "three";
import { BaseAnnotationStyle } from "../../DrawingSystem";

// ─── Block style ───────────────────────────────────────────────────────────────

/**
 * Style for a {@link BlockAnnotations} system.
 * `textOffset` and `fontSize` are unused for blocks but required by
 * {@link BaseAnnotationStyle} — set them to `0` in the default style.
 */
export interface BlockStyle extends BaseAnnotationStyle {}

// ─── Block definition ──────────────────────────────────────────────────────────

/**
 * The geometry content of a named block.
 * At least one of `lines` or `mesh` must be provided.
 *
 * - `lines` — `BufferGeometry` rendered as `LineSegments` (wire outlines).
 * - `mesh`  — `BufferGeometry` rendered as a filled `THREE.Mesh` (e.g. hatches
 *              or solid fills imported from DXF `SOLID`/`HATCH` entities).
 */
export interface BlockDefinition {
  /** Line geometry for `LineSegments`. */
  lines?: THREE.BufferGeometry;
  /** Triangle geometry for a filled `THREE.Mesh`. */
  mesh?: THREE.BufferGeometry;
}

// ─── Block insertion ───────────────────────────────────────────────────────────

/**
 * A single placed instance of a named block definition.
 * All coordinates are in drawing local space (XZ plane, Y = 0).
 */
export interface BlockInsertion {
  /** Unique identifier for this insertion. */
  uuid: string;
  /** Name of the block definition to draw. Must be registered via {@link BlockAnnotations.define}. */
  blockName: string;
  /** Insertion point in drawing local space (Y is ignored — always 0). */
  position: THREE.Vector3;
  /** Rotation around the Y axis in radians. */
  rotation: number;
  /** Uniform scale applied to the block geometry. */
  scale: number;
  /** Style name — references a {@link BlockStyle} registered on the system. */
  style: string;
}

/** Editable fields of {@link BlockInsertion} — everything except the `uuid`. */
export type BlockInsertionData = Omit<BlockInsertion, "uuid">;
