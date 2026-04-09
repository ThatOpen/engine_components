import * as THREE from "three";
import { BaseAnnotationStyle } from "../../DrawingSystem";
import { LineTickBuilder, MeshTickBuilder } from "../../types";
import type { TechnicalDrawing } from "../../TechnicalDrawing";

// ─── Enclosure builder ────────────────────────────────────────────────────────

/**
 * Defines a closed shape (cloud, rectangle, circle, etc.) that forms the
 * body of a callout annotation.
 *
 * `buildGeometry` returns flat XYZ triplet pairs suitable for `THREE.LineSegments`.
 * `getAttachmentPoint` returns the point on the enclosure boundary in the
 * given direction — needed because non-circular shapes have non-radial boundaries.
 */
export type EnclosureBuilder = {
  /** Returns flat XYZ line-segment pairs forming the enclosure outline. */
  buildGeometry: (center: THREE.Vector3, halfW: number, halfH: number) => number[];
  /**
   * Returns the point on the enclosure boundary in the direction `dir` from
   * `center`. `dir` is a unit vector in the XZ plane.
   */
  getAttachmentPoint: (
    center: THREE.Vector3,
    halfW: number,
    halfH: number,
    dir: THREE.Vector3,
  ) => THREE.Vector3;
};

// ─── Style ────────────────────────────────────────────────────────────────────

/** Visual appearance of a callout annotation. */
export interface CalloutAnnotationStyle extends BaseAnnotationStyle {
  /** The enclosure shape builder (cloud, rectangle, circle). */
  enclosure: EnclosureBuilder;
  /** Size of the optional tick at the extension end in drawing local units. */
  tickSize: number;
  /**
   * Line-segment tick at the extension end — included in the same `LineSegments`
   * as the extension line. Omit to suppress.
   */
  lineTick?: LineTickBuilder;
  /**
   * Filled (mesh) tick at the extension end — rendered as a separate `THREE.Mesh`.
   * Can be combined with `tick`.
   */
  meshTick?: MeshTickBuilder;
}

// ─── Persisted data ───────────────────────────────────────────────────────────

/**
 * The committed data for a single callout annotation.
 * All coordinates are in drawing local space (XZ plane, Y = 0).
 */
export interface CalloutAnnotation {
  /** Unique identifier. */
  uuid: string;
  /** Centre of the enclosure shape. */
  center: THREE.Vector3;
  /** Half-width of the enclosure along the X axis. */
  halfW: number;
  /** Half-height of the enclosure along the Z axis. */
  halfH: number;
  /** Elbow — the bend between the extension line and its horizontal run. */
  elbow: THREE.Vector3;
  /** End of the horizontal extension line — anchor for the text label. */
  extensionEnd: THREE.Vector3;
  /** The annotation text. */
  text: string;
  /** Name of the {@link CalloutAnnotationStyle} to use when rendering. */
  style: string;
}

/** Editable fields of {@link CalloutAnnotation} — everything except `uuid`. */
export type CalloutAnnotationData = Omit<CalloutAnnotation, "uuid">;

// ─── State machine ────────────────────────────────────────────────────────────

export type CalloutAnnotationState =
  /** Waiting for the user to click the enclosure centre. */
  | { kind: "awaitingCenter" }
  /**
   * Centre placed. User moves the cursor to the SE corner of the enclosure
   * to define its half-width (X) and half-height (Z) simultaneously.
   */
  | { kind: "awaitingRadius"; center: THREE.Vector3; cursor: THREE.Vector3 | null }
  /** Size set. User clicks to place the line elbow. */
  | {
      kind: "awaitingElbow";
      center: THREE.Vector3;
      halfW: number;
      halfH: number;
      cursor: THREE.Vector3 | null;
    }
  /** Elbow set. User clicks the extension endpoint. */
  | {
      kind: "awaitingExtension";
      center: THREE.Vector3;
      halfW: number;
      halfH: number;
      elbow: THREE.Vector3;
      cursor: THREE.Vector3 | null;
    }
  /**
   * All geometry is set. Paused waiting for the consumer to supply the text
   * via a `SUBMIT_TEXT` event.
   */
  | {
      kind: "enteringText";
      center: THREE.Vector3;
      halfW: number;
      halfH: number;
      elbow: THREE.Vector3;
      extensionEnd: THREE.Vector3;
    }
  /** Annotation just committed. */
  | { kind: "committed"; annotation: CalloutAnnotation };

// ─── Events ───────────────────────────────────────────────────────────────────

export type CalloutAnnotationEvent =
  /** A point in drawing local space was clicked. */
  | { type: "CLICK"; point: THREE.Vector3; drawing?: TechnicalDrawing }
  /** The cursor moved to a new position in drawing local space. */
  | { type: "MOUSE_MOVE"; point: THREE.Vector3; drawing?: TechnicalDrawing }
  /**
   * Consumer supplies the annotation text after the machine enters
   * `enteringText`. Ignored in all other states.
   */
  | { type: "SUBMIT_TEXT"; text: string }
  /** Cancel the current operation and return to the initial state. */
  | { type: "ESCAPE" };
