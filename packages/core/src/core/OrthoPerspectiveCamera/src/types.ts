/**
 * The projection system of the camera.
 */
export type CameraProjection = "Perspective" | "Orthographic";

/**
 * The extensible list of supported navigation modes.
 */
export type NavModeID = "Orbit" | "FirstPerson" | "Plan";

/**
 * Optional data passed to {@link NavigationMode.set} when enabling or
 * disabling a navigation mode.
 */
export interface NavigationModeOptions {
  /**
   * If `true`, the mode must not readjust the camera controls target when
   * it activates (i.e. it must skip any `moveTo` re-framing). Used by the
   * {@link OrthoPerspectiveCamera} on world assignment, where the initial
   * mode setup has already framed the camera and a second adjustment would
   * move the target again.
   */
  preventTargetAdjustment?: boolean;
}

/**
 * An object that determines the behavior of the camera controls and the user input (e.g. 2D floor plan mode, first person mode, etc).
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
  set: (active: boolean, options?: NavigationModeOptions) => void;

  /** Whether this navigation mode is active or not. */
  enabled: boolean;
}
