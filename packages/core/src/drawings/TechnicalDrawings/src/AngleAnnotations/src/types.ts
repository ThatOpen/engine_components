import * as THREE from "three";
import { LineTickBuilder, MeshTickBuilder } from "../../types";
import { BaseAnnotationStyle } from "../../DrawingSystem";
import { TechnicalDrawing } from "../../TechnicalDrawing";

// ─── Style ────────────────────────────────────────────────────────────────────

export interface AngleAnnotationStyle extends BaseAnnotationStyle {
  /** Tick mark builder at each end of the arc. */
  lineTick: LineTickBuilder;
  /**
   * Optional filled tick mark builder. When provided, a `THREE.Mesh` triangle
   * is rendered at each arc endpoint. Set `tick` to {@link NoTick} when you
   * only want the filled shape.
   */
  meshTick?: MeshTickBuilder;
  /** Tick size in drawing local units. */
  tickSize: number;
  /** Gap between the vertex and the start of each extension line. */
  extensionGap: number;
  /** Distance from the arc to the text label, along the bisector ray. */
  textOffset: number;
}

// ─── Persisted data ───────────────────────────────────────────────────────────

export interface AngleAnnotation {
  /** Unique identifier. */
  uuid: string;
  /** Snapped point on the first line — defines the first ray direction from the vertex. */
  pointA: THREE.Vector3;
  /** Computed intersection of the two measured lines. */
  vertex: THREE.Vector3;
  /** Snapped point on the second line — defines the second ray direction from the vertex. */
  pointB: THREE.Vector3;
  /** Radius of the arc at commit time, in drawing local units. */
  arcRadius: number;
  /**
   * When `true`, the arc measures the reflex angle (360° − interior).
   * The arc is drawn going the long way around and the bisector flips 180°.
   */
  flipped?: boolean;
  /** Name of the {@link AngleAnnotationStyle} to use when rendering. */
  style: string;
}

/** Editable fields of {@link AngleAnnotation} — everything except the `uuid`. */
export type AngleAnnotationData = Omit<AngleAnnotation, "uuid">;

// ─── State machine ────────────────────────────────────────────────────────────

export type AngleAnnotationState =
  /** Waiting for the user to click the first measured line. */
  | { kind: "awaitingFirstLine" }
  /** First line picked. Waiting for the second line. */
  | { kind: "awaitingSecondLine"; line1: THREE.Line3; pointA: THREE.Vector3 }
  /**
   * Both lines picked, vertex computed. User moves the cursor to set the
   * arc radius, then clicks to commit.
   */
  | {
      kind: "positioningArc";
      pointA: THREE.Vector3;
      vertex: THREE.Vector3;
      pointB: THREE.Vector3;
      cursor: THREE.Vector3 | null;
      flipped: boolean;
    }
  /** Annotation just committed. */
  | { kind: "committed"; dimension: AngleAnnotation };

// ─── Events ───────────────────────────────────────────────────────────────────

export type AngleAnnotationEvent =
  /**
   * A point was clicked. Carries `drawing` so the machine caches it on the first
   * click — subsequent events reuse that context.
   * `line` is required in `awaitingFirstLine` and `awaitingSecondLine`;
   * free-space clicks are accepted in `positioningArc`.
   */
  | { type: "CLICK"; point: THREE.Vector3; line?: THREE.Line3; drawing?: TechnicalDrawing }
  /** Cursor moved — drawing context already cached from the initial CLICK. */
  | { type: "MOUSE_MOVE"; point: THREE.Vector3; line?: THREE.Line3 }
  /** Cancel and return to the initial state. */
  | { type: "ESCAPE" };
