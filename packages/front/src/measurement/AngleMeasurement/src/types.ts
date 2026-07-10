import * as THREE from "three";
import { Line2 } from "three/examples/jsm/lines/Line2.js";
import { Mark } from "../../../core";
import { Angle } from "../../../utils";

/**
 * A measurement line: a plain `THREE.Line` in `Basic` mode, or a fat `Line2` in
 * `Fat` mode.
 */
export type MeasureLine = THREE.Line | Line2;

/** The set of THREE.js objects that make up a single angle measurement visual. */
export interface AngleVisual {
  /** The parent group containing all visual elements. */
  group: THREE.Group;
  /** Line from the vertex to the start point. */
  line1: MeasureLine;
  /** Line from the vertex to the end point. */
  line2: MeasureLine;
  /** The arc curve drawn between the two rays. */
  arc: MeasureLine;
  /** The CSS2D label displaying the angle value. */
  label: Mark;
  /** Endpoint markers at the start, vertex, and end positions. */
  endpoints: Mark[];
  /** An invisible sphere used for raycasting to detect deletion. */
  boundingBox: THREE.Mesh;
}

/** Internal state tracked during the multi-click creation workflow. */
export interface AngleMeasurerTempData {
  /** How many points the user has placed so far (0, 1, or 2). */
  clickCount: number;
  /** The angle being constructed. */
  angle: Angle;
  /** The group used for the first-click rubber-band preview. */
  previewGroup?: THREE.Group;
  /** The rubber-band line shown after the first click. */
  previewLine?: MeasureLine;
  /** The endpoint marker at the first click position. */
  previewEndpoint?: Mark;
  /** The full angle visual used after the second click. */
  visual?: AngleVisual;
}

/** The available measurement modes for the angle measurer. */
export type AngleMeasurerModes = ["free"];
