import * as THREE from "three";
import { Components } from "../Components";
import { SimpleCamera } from "..";

import {
  NavigationMode,
  NavModeID,
  ProjectionManager,
  OrbitMode,
  FirstPersonMode,
  PlanMode,
} from "./src";
import { FragmentsManager } from "../../fragments";

export * from "./src";

/**
 * A flexible camera that uses [yomotsu's cameracontrols](https://github.com/yomotsu/camera-controls) to control the camera in 2D and 3D. It supports multiple navigation modes, such as 2D floor plan navigation, first person and 3D orbit. This class extends the SimpleCamera class and adds additional functionality for managing different camera projections and navigation modes. 📕 [Tutorial](https://docs.thatopen.com/Tutorials/Components/Core/OrthoPerspectiveCamera). 📘 [API](https://docs.thatopen.com/api/@thatopen/components/classes/OrthoPerspectiveCamera).
 */
export class OrthoPerspectiveCamera extends SimpleCamera {
  /**
   * A ProjectionManager instance that manages the projection modes of the camera.
   */
  readonly projection: ProjectionManager;

  /**
   * A THREE.OrthographicCamera instance that represents the orthographic camera.
   * This camera is used when the projection mode is set to orthographic.
   */
  readonly threeOrtho: THREE.OrthographicCamera;

  /**
   * A THREE.PerspectiveCamera instance that represents the perspective camera.
   * This camera is used when the projection mode is set to perspective.
   */
  readonly threePersp: THREE.PerspectiveCamera;

  protected readonly _userInputButtons: any = {};
  protected readonly _frustumSize = 50;
  protected readonly _navigationModes = new Map<NavModeID, NavigationMode>();
  protected _mode: NavigationMode | null = null;

  private previousSize: THREE.Vector2 | null = null;

  /**
   * Getter for the current navigation mode.
   * Throws an error if the mode is not found or the camera is not initialized.
   *
   * @returns {NavigationMode} The current navigation mode.
   *
   * @throws {Error} Throws an error if the mode is not found or the camera is not initialized.
   */
  get mode() {
    if (!this._mode) {
      throw new Error("Mode not found, camera not initialized");
    }
    return this._mode;
  }

  constructor(components: Components) {
    super(components);
    this.threePersp = this.three as THREE.PerspectiveCamera;
    this.threeOrtho = this.newOrthoCamera();
    this.projection = new ProjectionManager(this);

    this.onAspectUpdated.add(() => {
      this.setOrthoPerspCameraAspect();
    });

    this.projection.onChanged.add(
      (camera: THREE.PerspectiveCamera | THREE.OrthographicCamera) => {
        this.three = camera;
        this.updateAspect();
      },
    );

    this.worlds.onItemSet.add(() => {
      this._navigationModes.clear();
      this._navigationModes.set("Orbit", new OrbitMode(this));
      this._navigationModes.set("FirstPerson", new FirstPersonMode(this));
      this._navigationModes.set("Plan", new PlanMode(this));
      this._mode = this._navigationModes.get("Orbit")!;
      this.mode.set(true, { preventTargetAdjustment: true });
      if (this.currentWorld && this.currentWorld.renderer) {
        this.previousSize = this.currentWorld.renderer.getSize().clone();
      }
    });

    this.worlds.onItemDeleted.add(() => {
      this._navigationModes.clear();
    });
  }

  /** {@link Disposable.dispose} */
  dispose() {
    super.dispose();
    this.threeOrtho.removeFromParent();
  }

  /**
   * Sets a new {@link NavigationMode} and disables the previous one.
   *
   * @param mode - The {@link NavigationMode} to set.
   */
  set(mode: NavModeID) {
    if (this.mode === null) return;
    if (this.mode.id === mode) return;
    this.mode.set(false);
    if (!this._navigationModes.has(mode)) {
      throw new Error("The specified mode does not exist!");
    }
    this._mode = this._navigationModes.get(mode)!;
    this.mode.set(true);
  }

  /**
   * Make the camera view fit all the specified meshes.
   *
   * @param meshes the meshes to fit. If it is not defined, it will
   * evaluate {@link Components.meshes}.
   * @param offset the distance to the fit object
   */
  async fit(meshes: Iterable<THREE.Mesh>, offset = 1.5) {
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

    const fragments = this.components.get(FragmentsManager);
    if (fragments.initialized) {
      for (const [, model] of fragments.list) {
        const aabb = model.box;
        if (aabb.min.x < min.x) min.x = aabb.min.x;
        if (aabb.min.y < min.y) min.y = aabb.min.y;
        if (aabb.min.z < min.z) min.z = aabb.min.z;
        if (aabb.max.x > max.x) max.x = aabb.max.x;
        if (aabb.max.y > max.y) max.y = aabb.max.y;
        if (aabb.max.z > max.z) max.z = aabb.max.z;
      }
    }

    const sceneSize = new THREE.Vector3();
    box.getSize(sceneSize);
    const sceneCenter = new THREE.Vector3();
    box.getCenter(sceneCenter);
    const radius = Math.max(sceneSize.x, sceneSize.y, sceneSize.z) * offset;
    const sphere = new THREE.Sphere(sceneCenter, radius);
    await this.controls.fitToSphere(sphere, true);
  }

  /**
   * Allows or prevents all user input.
   *
   * @param active - whether to enable or disable user inputs.
   */
  setUserInput(active: boolean) {
    if (active) {
      this.enableUserInput();
    } else {
      this.disableUserInput();
    }
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
    const aspect = window.innerWidth / window.innerHeight;
    return new THREE.OrthographicCamera(
      (this._frustumSize * aspect) / -2,
      (this._frustumSize * aspect) / 2,
      this._frustumSize / 2,
      this._frustumSize / -2,
      0.1,
      1000,
    );
  }

  private setOrthoPerspCameraAspect() {
    if (!this.currentWorld || !this.currentWorld.renderer) {
      return;
    }

    if (!this.previousSize) return;

    const size = this.currentWorld.renderer.getSize();

    const previousHeight = this.threeOrtho.top;
    const previousWidth = this.threeOrtho.right;

    const heightSizeFactor = size.y / this.previousSize.y;
    const widthSizeFactor = size.x / this.previousSize.x;

    const newHeight = previousHeight * heightSizeFactor;
    const newWidth = previousWidth * widthSizeFactor;

    this.threeOrtho.left = -newWidth;
    this.threeOrtho.right = newWidth;
    this.threeOrtho.top = newHeight;
    this.threeOrtho.bottom = -newHeight;
    this.threeOrtho.updateProjectionMatrix();

    this.previousSize.copy(size);
  }
}
