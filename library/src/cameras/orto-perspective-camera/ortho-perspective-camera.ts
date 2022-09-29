import * as THREE from "three";
import { Event, SimpleCamera } from "../../core";
import { NavigationMode, NavModeID, CameraProjection } from "./base-types";
import { ProjectionManager } from "./projection-manager";
import { Components } from "../../components";
import { OrbitMode } from "./navigation-modes/orbit-mode";
import { PlanMode } from "./navigation-modes/2d-plan-mode";
import { FirstPersonMode } from "./navigation-modes/first-person-mode";

/**
 * A flexible camera that uses
 * [yomotsu's cameracontrols](https://github.com/yomotsu/camera-controls) to
 * easily control the camera in 2D and 3D. It supports multiple navigation
 * modes, such as 2D floor plan navigation, first person and 3D orbit.
 */
export class OrthoPerspectiveCamera extends SimpleCamera {
  /**
   * The current {@link NavigationMode}.
   */
  currentMode: NavigationMode;

  /**
   * Event that fires when the {@link CameraProjection} changes.
   */
  readonly projectionChanged = new Event<THREE.Camera>();

  protected readonly _orthoCamera: THREE.OrthographicCamera;
  protected readonly _projectionManager: ProjectionManager;
  protected readonly _userInputButtons: any = {};
  protected readonly _frustumSize = 50;
  protected readonly _navigationModes = new Map<NavModeID, NavigationMode>();

  constructor(components: Components) {
    super(components);

    this._orthoCamera = this.newOrthoCamera();

    this._navigationModes.set("Orbit", new OrbitMode(components, this));
    this._navigationModes.set("FirstPerson", new FirstPersonMode(this));
    this._navigationModes.set("Plan", new PlanMode(components, this));

    this.currentMode = this._navigationModes.get("Orbit")!;
    this.currentMode.toggle(true, { preventTargetAdjustment: true });

    const modes = Object.values(this._navigationModes);
    for (const mode of modes) {
      mode.projectionChanged.on(this.projectionChanged.trigger);
    }

    this._projectionManager = new ProjectionManager(components, this);
  }

  get(projection?: CameraProjection) {
    return projection === "Orthographic"
      ? this._orthoCamera
      : this._perspectiveCamera;
  }

  /** Returns the current {@link CameraProjection}. */
  getProjection() {
    return this._projectionManager.projection;
  }

  /**
   * Sets the current {@link CameraProjection}. This triggers the event
   * {@link projectionChanged}.
   *
   * @param projection - The new {@link CameraProjection} to set.
   */
  async setProjection(projection: CameraProjection) {
    await this._projectionManager.setProjection(projection);
    this.projectionChanged.trigger(this.activeCamera);
  }

  /**
   * Allows or prevents all user input.
   *
   * @param active - whether to enable or disable user inputs.
   */
  toggleUserInput(active: boolean) {
    if (active) {
      this.enableUserInput();
    } else {
      this.disableUserInput();
    }
  }

  /**
   * Sets a new {@link NavigationMode} and disables the previous one.
   *
   * @param mode - The {@link NavigationMode} to set.
   */
  setNavigationMode(mode: NavModeID) {
    if (this.currentMode.id === mode) return;
    this.currentMode.toggle(false);
    if (!this._navigationModes.has(mode)) {
      throw new Error("The specified mode does not exist!");
    }
    this.currentMode = this._navigationModes.get(mode)!;
    this.currentMode.toggle(true);
  }

  /** Updates the aspect ratio of the camera to match the Renderer's aspect ratio. */
  updateAspect() {
    super.updateAspect();
    this.setOrthoCameraAspect();
  }

  private disableUserInput() {
    this._userInputButtons.left = this.controls.mouseButtons.left;
    this._userInputButtons.right = this.controls.mouseButtons.right;
    this._userInputButtons.middle = this.controls.mouseButtons.middle;
    this._userInputButtons.wheel = this.controls.mouseButtons.wheel;
    this.controls.mouseButtons.left = 0;
    this.controls.mouseButtons.right = 0;
    this.controls.mouseButtons.middle = 0;
    this.controls.mouseButtons.wheel = 0;
  }

  private enableUserInput() {
    if (Object.keys(this._userInputButtons).length === 0) return;
    this.controls.mouseButtons.left = this._userInputButtons.left;
    this.controls.mouseButtons.right = this._userInputButtons.right;
    this.controls.mouseButtons.middle = this._userInputButtons.middle;
    this.controls.mouseButtons.wheel = this._userInputButtons.wheel;
  }

  private newOrthoCamera() {
    const dims = this.components.renderer.getSize();
    const aspect = dims.x / dims.y;
    return new THREE.OrthographicCamera(
      (this._frustumSize * aspect) / -2,
      (this._frustumSize * aspect) / 2,
      this._frustumSize / 2,
      this._frustumSize / -2,
      0.1,
      1000
    );
  }

  private setOrthoCameraAspect() {
    const size = this.components.renderer.getSize();
    const aspect = size.x / size.y;
    this._orthoCamera.left = (-this._frustumSize * aspect) / 2;
    this._orthoCamera.right = (this._frustumSize * aspect) / 2;
    this._orthoCamera.top = this._frustumSize / 2;
    this._orthoCamera.bottom = -this._frustumSize / 2;
    this._orthoCamera.updateProjectionMatrix();
  }
}
