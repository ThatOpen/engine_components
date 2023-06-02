import * as THREE from "three";
import { Components, SimpleCamera } from "../../core";
import { Event, UI } from "../../base-types";
import { CameraProjection, NavigationMode, NavModeID } from "./src/types";
import { ProjectionManager } from "./src/projections";
import { OrbitMode } from "./src/orbit-mode";
import { FirstPersonMode } from "./src/first-person-mode";
import { PlanMode } from "./src/plan-mode";
import { Button } from "../../ui";

/**
 * A flexible camera that uses
 * [yomotsu's cameracontrols](https://github.com/yomotsu/camera-controls) to
 * easily control the camera in 2D and 3D. It supports multiple navigation
 * modes, such as 2D floor plan navigation, first person and 3D orbit.
 */
export class OrthoPerspectiveCamera extends SimpleCamera implements UI {
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
  uiElement!: Button;

  constructor(components: Components) {
    super(components);

    this._orthoCamera = this.newOrthoCamera();

    this._navigationModes.set("Orbit", new OrbitMode(this));
    this._navigationModes.set("FirstPerson", new FirstPersonMode(this));
    this._navigationModes.set("Plan", new PlanMode(this));

    this.currentMode = this._navigationModes.get("Orbit")!;
    this.currentMode.toggle(true, { preventTargetAdjustment: true });

    this.toggleEvents(true);

    this._projectionManager = new ProjectionManager(components, this);
    this.setUI();
  }

  private setUI() {
    const mainButton = new Button(this.components, {
      materialIconName: "video_camera_back",
    });

    const projection = new Button(this.components, {
      materialIconName: "camera",
      name: "Projection",
    });
    const perspective = new Button(this.components, { name: "Perspective" });
    perspective.active = true;
    perspective.onclick = () => this.setProjection("Perspective");
    const orthographic = new Button(this.components, { name: "Orthographic" });
    orthographic.onclick = () => this.setProjection("Orthographic");
    projection.addButton(perspective, orthographic);

    const navigation = new Button(this.components, {
      materialIconName: "open_with",
      name: "Navigation",
    });
    const orbit = new Button(this.components, { name: "Orbit Around" });
    orbit.onclick = () => this.setNavigationMode("Orbit");
    const plan = new Button(this.components, { name: "Plan View" });
    plan.onclick = () => this.setNavigationMode("Plan");
    navigation.addButton(orbit, plan);

    mainButton.addButton(navigation, projection);

    this.projectionChanged.on((camera) => {
      if (camera instanceof THREE.PerspectiveCamera) {
        perspective.active = true;
        orthographic.active = false;
      } else {
        perspective.active = false;
        orthographic.active = true;
      }
    });

    this.uiElement = mainButton;
  }

  /** {@link Disposable.dispose} */
  dispose() {
    super.dispose();
    this.toggleEvents(false);
    this._orthoCamera.removeFromParent();
  }

  /**
   * Similar to {@link Component.get}, but with an optional argument
   * to specify which camera to get.
   *
   * @param projection - The camera corresponding to the
   * {@link CameraProjection} specified. If no projection is specified,
   * the active camera will be returned.
   */
  get(projection?: CameraProjection) {
    if (!projection) {
      return this.activeCamera;
    }
    return projection === "Orthographic"
      ? this._orthoCamera
      : this._perspectiveCamera;
  }

  /** Returns the current {@link CameraProjection}. */
  getProjection() {
    return this._projectionManager.projection;
  }

  /**
   * Changes the current {@link CameraProjection} from Ortographic to Perspective
   * and Viceversa.
   */
  async toggleProjection() {
    const projection = this.getProjection();
    const newProjection =
      projection === "Perspective" ? "Orthographic" : "Perspective";
    await this.setProjection(newProjection);
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

  /**
   * Make the camera view fit all the specified meshes.
   *
   * @param meshes the meshes to fit. If it is not defined, it will
   * evaluate {@link Components.meshes}.
   * @param offset the distance to the fit object
   */
  async fit(meshes: THREE.Mesh[] = this.components.meshes, offset = 1.5) {
    if (!this.enabled) return;

    const maxNum = Number.MAX_VALUE;
    const minNum = Number.MIN_VALUE;
    const min = new THREE.Vector3(maxNum, maxNum, maxNum);
    const max = new THREE.Vector3(minNum, minNum, minNum);

    for (const mesh of meshes) {
      const box = new THREE.Box3().setFromObject(mesh);
      if (box.min.x < min.x) min.x = box.min.x;
      if (box.min.y < min.y) min.y = box.min.y;
      if (box.min.z < min.z) min.z = box.min.z;
      if (box.max.x > max.x) max.x = box.max.x;
      if (box.max.y > max.y) max.y = box.max.y;
      if (box.max.z > max.z) max.z = box.max.z;
    }

    const box = new THREE.Box3(min, max);

    const sceneSize = new THREE.Vector3();
    box.getSize(sceneSize);
    const sceneCenter = new THREE.Vector3();
    box.getCenter(sceneCenter);
    const radius = Math.max(sceneSize.x, sceneSize.y, sceneSize.z) * offset;
    const sphere = new THREE.Sphere(sceneCenter, radius);
    await this.controls.fitToSphere(sphere, true);
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

  private toggleEvents(active: boolean) {
    const modes = Object.values(this._navigationModes);
    for (const mode of modes) {
      if (active) {
        mode.projectionChanged.on(this.projectionChanged.trigger);
      } else {
        mode.projectionChanged.reset();
      }
    }
  }
}
