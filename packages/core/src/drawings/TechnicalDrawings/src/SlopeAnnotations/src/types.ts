import * as THREE from "three";
import { BaseAnnotationStyle } from "../../DrawingSystem";
import { LineTickBuilder, MeshTickBuilder } from "../../types";

// ─── Style ────────────────────────────────────────────────────────────────────

/** How the slope value is displayed in the text label. */
export type SlopeFormat = "percentage" | "ratio" | "degrees";

/** Visual appearance of a slope annotation. */
export interface SlopeAnnotationStyle extends BaseAnnotationStyle {
  /** Tick mark builder at the downhill tip of the arrow. */
  lineTick: LineTickBuilder;
  /** Optional filled tick mark builder at the downhill tip. */
  meshTick?: MeshTickBuilder;
  /** Tick size in drawing local units. */
  tickSize: number;
  /** Length of the arrow shaft in drawing local units. */
  length: number;
  /**
   * Distance from the arrow midpoint to the near edge of the text label,
   * measured perpendicularly to the slope direction.
   */
  textOffset: number;
  /** How the slope ratio is formatted in the text label. */
  format: SlopeFormat;
}

// ─── Persisted data ───────────────────────────────────────────────────────────

/**
 * A single committed slope annotation.
 * All coordinates are in drawing local space (XZ plane, Y = 0).
 */
export interface SlopeAnnotation {
  /** Unique identifier. */
  uuid: string;
  /** Anchor point of the arrow tail in drawing local space. */
  position: THREE.Vector3;
  /** Normalised downhill direction in the XZ plane. */
  direction: THREE.Vector3;
  /**
   * Slope ratio: rise / run (e.g. `0.15` for a 15 % slope).
   * Use {@link formatSlope} to convert to the desired display string.
   */
  slope: number;
  /** Name of the {@link SlopeAnnotationStyle} to use. */
  style: string;
}

/** Editable fields of {@link SlopeAnnotation} — everything except the `uuid`. */
export type SlopeAnnotationData = Omit<SlopeAnnotation, "uuid">;
