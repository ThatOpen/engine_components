import * as THREE from "three";
import { BaseAnnotationStyle } from "../../DrawingSystem";
import { LineTickBuilder, MeshTickBuilder } from "../../types";

// ─── Tick builders ────────────────────────────────────────────────────────────

// ─── Style ────────────────────────────────────────────────────────────────────

/** Visual appearance of a leader annotation. */
export interface LeaderAnnotationStyle extends BaseAnnotationStyle {
  /** Size of the tick at the arrow tip in drawing local units. */
  tickSize: number;
  /**
   * Distance from `extensionEnd` to the text label anchor,
   * measured along the extension direction.
   */
  textOffset: number;
  /**
   * Leader line shape.
   * - `"angular"` (default) — two straight segments: arrowTip → elbow → extensionEnd.
   * - `"curved"` — quadratic Bézier with `elbow` as the control point.
   */
  leaderShape?: "angular" | "curved";
  /**
   * Line-segment tick at the arrow tip — geometry is included in the same
   * `LineSegments` as the leader line.
   * When both `tick` and `meshTick` are absent, nothing is drawn at the tip.
   */
  lineTick?: LineTickBuilder;
  /**
   * Filled (mesh) tick at the arrow tip — rendered as a separate `THREE.Mesh`.
   * Can be combined with `tick` (e.g. open circle + filled disc = target).
   */
  meshTick?: MeshTickBuilder;
}

// ─── Persisted data ───────────────────────────────────────────────────────────

/**
 * The committed data for a single leader annotation.
 * Stored in drawing local space (XZ plane, Y = 0).
 */
export interface LeaderAnnotation {
  /** Unique identifier. */
  uuid: string;
  /** Tip of the arrow — the annotated point. */
  arrowTip: THREE.Vector3;
  /** Elbow — the bend between the leader line and the extension. */
  elbow: THREE.Vector3;
  /** End of the horizontal extension line — anchor for the text. */
  extensionEnd: THREE.Vector3;
  /** The annotation text. */
  text: string;
  /** Name of the {@link LeaderAnnotationStyle} to use when rendering. */
  style: string;
}

/** Editable fields of {@link LeaderAnnotation} — everything except `uuid`. */
export type LeaderAnnotationData = Omit<LeaderAnnotation, "uuid">;

// ─── State machine ────────────────────────────────────────────────────────────

export type LeaderAnnotationState =
  /** Tool active, waiting for the first click (arrow tip). */
  | { kind: "awaitingArrowTip" }
  /** Arrow tip placed. User moves toward the elbow point. */
  | { kind: "placingElbow"; arrowTip: THREE.Vector3; cursor: THREE.Vector3 | null }
  /** Elbow placed. User moves toward the extension end. */
  | {
      kind: "placingExtension";
      arrowTip: THREE.Vector3;
      elbow: THREE.Vector3;
      cursor: THREE.Vector3 | null;
    }
  /**
   * All geometry is set. The machine is paused waiting for the consumer to
   * supply the annotation text via a `SUBMIT_TEXT` event.
   */
  | { kind: "enteringText"; arrowTip: THREE.Vector3; elbow: THREE.Vector3; extensionEnd: THREE.Vector3 }
  /** Annotation just committed. */
  | { kind: "committed"; annotation: LeaderAnnotation };

// ─── Events ───────────────────────────────────────────────────────────────────

import { TechnicalDrawing } from "../../TechnicalDrawing";

export type LeaderAnnotationEvent =
  /** First event that starts the machine — carries the target drawing. */
  | { type: "CLICK"; point: THREE.Vector3; drawing?: TechnicalDrawing }
  /** The cursor moved — drawing context is already set from the initial CLICK. */
  | { type: "MOUSE_MOVE"; point: THREE.Vector3 }
  /**
   * Consumer supplies the annotation text after the machine enters
   * `enteringText`. Ignored in all other states.
   */
  | { type: "SUBMIT_TEXT"; text: string }
  /** Cancel the current operation and return to the initial state. */
  | { type: "ESCAPE" };
