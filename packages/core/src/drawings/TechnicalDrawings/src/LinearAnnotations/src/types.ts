import * as THREE from "three";
import { BaseAnnotationStyle } from "../../DrawingSystem";
import type { TechnicalDrawing } from "../../TechnicalDrawing";
import { LineTickBuilder, MeshTickBuilder } from "../../types";

export type { LineTickBuilder, MeshTickBuilder };

// ─── Style ────────────────────────────────────────────────────────────────────

/** Visual appearance of a linear annotation. Registered by name on the component. */
export interface LinearAnnotationStyle extends BaseAnnotationStyle {
  /** Tick mark geometry builder. Use one of the built-in exports or provide a custom one. */
  lineTick: LineTickBuilder;
  /**
   * Optional filled tick mark builder. When provided, a `THREE.Mesh` triangle
   * is rendered at each dimension endpoint in addition to (or instead of) the
   * line tick. Set `tick` to {@link NoTick} when you only want the filled shape.
   */
  meshTick?: MeshTickBuilder;
  /** Size of the tick mark in drawing local units. */
  tickSize: number;
  /** Gap between the measured geometry and the start of each extension line. */
  extensionGap: number;
  /** How far extension lines overshoot beyond the dimension line. */
  extensionOvershoot: number;
  /**
   * Signed perpendicular distance from the dimension line to the text label,
   * measured outward from the measured geometry.
   * Positive moves the text away from the geometry; negative moves it inward.
   */
  textOffset: number;
}

// ─── Persisted data ───────────────────────────────────────────────────────────

/**
 * The committed data for a single linear annotation.
 * Stored in drawing local space (XZ plane, Y = 0).
 */
export interface LinearAnnotation {
  /** Unique identifier. */
  uuid: string;
  /** First measured point in drawing local space. */
  pointA: THREE.Vector3;
  /** Second measured point in drawing local space. */
  pointB: THREE.Vector3;
  /**
   * Signed distance from the AB segment to the dimension line,
   * measured along the direction perpendicular to the measurement axis.
   */
  offset: number;
  /** Name of the {@link LinearAnnotationStyle} to use when rendering this annotation. */
  style: string;
}

/** Editable fields of {@link LinearAnnotation} — everything except the `uuid`. */
export type LinearAnnotationData = Omit<LinearAnnotation, "uuid">;

// ─── State machine ────────────────────────────────────────────────────────────

export type LinearAnnotationState =
  /** Tool is active but no interaction has started. */
  | { kind: "awaitingFirstPoint" }
  /**
   * First point placed. Stores the direction of the measured lines so that
   * subsequent clicks can be validated (must be on parallel lines) and the
   * cursor preview constrained to the orthogonal measurement direction.
   *
   * In `individual` mode the tool auto-advances after the second CLICK.
   * In `sequential` mode the user accumulates points and sends CONFIRM when done.
   */
  | {
      kind: "placingPoints";
      points: THREE.Vector3[];
      cursor: THREE.Vector3 | null;
      /** Normalised direction of the first (and all subsequent) measured lines. */
      lineDir: THREE.Vector3;
      /** The first line segment hit — used to reject clicks on the same segment. */
      firstLine: THREE.Line3;
    }
  /**
   * All measurement points are set. The user drags to define the perpendicular
   * offset of the dimension line, then clicks to commit.
   */
  | { kind: "positioningOffset"; points: THREE.Vector3[]; cursor: THREE.Vector3 | null }
  /** One or more annotations have just been committed. */
  | { kind: "committed"; dimensions: LinearAnnotation[] };

// ─── Events ───────────────────────────────────────────────────────────────────

export type LinearAnnotationEvent =
  /**
   * A point in drawing local space was clicked.
   * Carries `drawing` so the machine can lock it in as `_previewDrawing` on the
   * first click — subsequent events reuse that cached context.
   *
   * `line` MUST be provided when in `awaitingFirstPoint` or `placingPoints` —
   * the machine silently ignores the click without it (only line snaps accepted).
   * It is optional in `positioningOffset` (free-space placement).
   */
  | { type: "CLICK"; point: THREE.Vector3; line?: THREE.Line3; drawing?: TechnicalDrawing }
  /** The cursor moved — drawing context is already cached from the initial CLICK or SELECT_LINE. */
  | { type: "MOUSE_MOVE"; point: THREE.Vector3 }
  /**
   * Consumer signals "done placing points — move to offset positioning".
   * Relevant only in `sequential` mode; in `individual` the machine auto-advances.
   * The consumer decides the DOM mapping (Enter, double-click, etc.).
   */
  | { type: "CONFIRM" }
  /**
   * Alternative first event: selects an entire line as the dimension's measured
   * segment, jumping directly to `positioningOffset`.
   * Carries `drawing` to set the drawing context (same role as the first CLICK).
   */
  | { type: "SELECT_LINE"; line: THREE.Line3; drawing?: TechnicalDrawing }
  /** Cancel the current operation and return to the initial state. */
  | { type: "ESCAPE" };

