import * as THREE from "three";
import { Event } from "../../../base-types";

/**
 * The projection system of the camera.
 */
export type CameraProjection = "Perspective" | "Orthographic";

/**
 * The extensible list of supported navigation modes.
 */
export type NavModeID = "Orbit" | "FirstPerson" | "Plan";

/**
 * An object that determines the behavior of the camera controls
 * and the user input (e.g. 2D floor plan mode, first person mode, etc).
 */
export interface NavigationMode {
  /** The unique ID of this navigation mode. */
  id: NavModeID;

  /**
   * Enable or disable this navigation mode.
   * When a new navigation mode is enabled, the previous navigation mode
   * must be disabled.
   *
   * @param active - whether to enable or disable this mode.
   * @param options - any additional data required to enable or disable it.
   * */
  toggle: (active: boolean, options?: any) => void;

  /** Whether this navigation mode is active or not. */
  enabled: boolean;

  /**
   * Event that should fire when the camera {@link CameraProjection} changes.
   * */
  projectionChanged: Event<THREE.Camera>;
}
