import * as THREE from "three";
import CameraControls from "camera-controls";
import { Disposable, Updateable, Event, BaseCamera, World } from "../../Types";
import { Components } from "../../Components";
import {
  BoundingBoxer,
  FragmentsManager,
  ModelIdMap,
} from "../../../fragments";

/**
 * A basic camera that uses [yomotsu's cameracontrols](https://github.com/yomotsu/camera-controls) to control the camera in 2D and 3D. Check out it's API to find out what features it offers.
 */
export class SimpleCamera extends BaseCamera implements Updateable, Disposable {
  /** {@link Updateable.onBeforeUpdate} */
  readonly onBeforeUpdate = new Event<SimpleCamera>();

  /** {@link Updateable.onAfterUpdate} */
  readonly onAfterUpdate = new Event<SimpleCamera>();

  /**
   * Event that is triggered when the aspect of the camera has been updated.
   * This event is useful when you need to perform actions after the aspect of the camera has been changed.
   */
  readonly onAspectUpdated = new Event();

  /** {@link Disposable.onDisposed} */
  readonly onDisposed = new Event<string>();

  /**
   * A three.js PerspectiveCamera or OrthographicCamera instance.
   * This camera is used for rendering the scene.
   */
  three: THREE.PerspectiveCamera | THREE.OrthographicCamera;

  private _allControls = new Map<string, CameraControls>();

  /**
   * The object that controls the camera. An instance of
   * [yomotsu's cameracontrols](https://github.com/yomotsu/camera-controls).
   * Transforming the camera directly will have no effect: you need to use this
   * object to move, rotate, look at objects, etc.
   */
  get controls() {
    if (!this.currentWorld) {
      throw new Error("This camera needs a world to work!");
    }
    const controls = this._allControls.get(this.currentWorld.uuid);
    if (!controls) {
      throw new Error("Controls not found!");
    }
    return controls;
  }
  /**
   * Getter for the enabled state of the camera controls.
   * If the current world is null, it returns false.
   * Otherwise, it returns the enabled state of the camera controls.
   *
   * @returns {boolean} The enabled state of the camera controls.
   */
  get enabled() {
    if (this.currentWorld === null) {
      return false;
    }
    return this.controls.enabled;
  }

  /**
   * Setter for the enabled state of the camera controls.
   * If the current world is not null, it sets the enabled state of the camera controls to the provided value.
   *
   * @param {boolean} enabled - The new enabled state of the camera controls.
   */
  set enabled(enabled: boolean) {
    if (this.currentWorld !== null) {
      this.controls.enabled = enabled;
    }
  }

  set currentWorld(value: World | null) {
    super.currentWorld = value;
    if (!value) return;
    const existingWorld = this.worlds.get(value.uuid);
    if (!existingWorld) this.worlds.set(value.uuid, value);
  }

  get currentWorld() {
    return this._currentWorld;
  }

  constructor(components: Components) {
    super(components);
    this.three = this.setupCamera();

    this.setupEvents(true);

    this.worlds.onItemSet.add(({ value: world }) => {
      const controls = this.newCameraControls();
      this._allControls.set(world.uuid, controls);
    });

    this.worlds.onBeforeDelete.add(({ value: world }) => {
      const controls = this._allControls.get(world.uuid);
      if (controls) {
        controls.dispose();
        this._allControls.delete(world.uuid);
      }
    });

    // this.onWorldChanged.add(({ action, world }) => {
    //   // This makes sure the DOM element of the camera
    //   // controls matches the one of the renderer for
    //   // a specific world
    //   if (action === "added" && !this._allControls.get(world.uuid)) {
    //     const controls = this.newCameraControls();
    //     this._allControls.set(world.uuid, controls);
    //   }

    //   if (action === "removed") {
    //     const controls = this._allControls.get(world.uuid);
    //     if (controls) {
    //       controls.dispose();
    //       this._allControls.delete(world.uuid);
    //     }
    //   }
    // });
  }

  /** {@link Disposable.dispose} */
  dispose() {
    this.setupEvents(false);
    this.onAspectUpdated.reset();
    this.onBeforeUpdate.reset();
    this.onAfterUpdate.reset();
    this.three.removeFromParent();
    this.onDisposed.trigger();
    this.onDisposed.reset();
    for (const [_id, controls] of this._allControls) {
      controls.dispose();
    }
    this.worlds.clear();
  }

  async fitToItems(items?: ModelIdMap) {
    const sphere = await this.getItemsBounding(items);
    await this.controls.fitToSphere(sphere, true);
  }

  async setOrbitToItems(items?: ModelIdMap) {
    const sphere = await this.getItemsBounding(items);
    this.controls.setOrbitPoint(
      sphere.center.x,
      sphere.center.y,
      sphere.center.z,
    );
  }

  /** {@link Updateable.update} */
  update(_delta: number) {
    if (this.enabled) {
      this.onBeforeUpdate.trigger(this);
      this.controls.update(_delta);
      this.onAfterUpdate.trigger(this);
    }
  }

  /**
   * Updates the aspect of the camera to match the size of the
   * {@link Components.renderer}.
   */
  updateAspect = () => {
    if (!this.currentWorld || !this.currentWorld.renderer) return;
    if (this.three instanceof THREE.OrthographicCamera) {
      this.onAspectUpdated.trigger();
      return;
    }
    if (this.currentWorld.renderer?.isResizeable()) {
      const size = this.currentWorld.renderer.getSize();
      this.three.aspect = size.width / size.height;
      this.three.updateProjectionMatrix();
      this.onAspectUpdated.trigger();
    }
  };

  private async getItemsBounding(items?: ModelIdMap) {
    const fragments = this.components.get(FragmentsManager);
    const boxer = this.components.get(BoundingBoxer);
    boxer.list.clear();
    const sphere = new THREE.Sphere();
    if (items) {
      await boxer.addFromModelIdMap(items);
    } else {
      for (const [, model] of fragments.list) {
        boxer.list.add(model.box);
      }
    }
    boxer.get().getBoundingSphere(sphere);
    boxer.list.clear();
    return sphere;
  }

  private setupCamera() {
    const aspect = window.innerWidth / window.innerHeight;
    const camera = new THREE.PerspectiveCamera(60, aspect, 1, 1000);
    camera.position.set(50, 50, 50);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    return camera;
  }

  private newCameraControls() {
    if (!this.currentWorld) {
      throw new Error("This camera needs a world to work!");
    }
    if (!this.currentWorld.renderer) {
      throw new Error("This camera needs a renderer to work!");
    }
    CameraControls.install({ THREE: SimpleCamera.getSubsetOfThree() });
    const { domElement } = this.currentWorld.renderer.three;
    const controls = new CameraControls(this.three, domElement);
    controls.smoothTime = 0.2;
    controls.dollyToCursor = true;
    controls.infinityDolly = true;
    controls.minDistance = 6;
    return controls;
  }

  private setupEvents(active: boolean) {
    if (active) {
      window.addEventListener("resize", this.updateAspect);
    } else {
      window.removeEventListener("resize", this.updateAspect);
    }
  }

  private static getSubsetOfThree() {
    return {
      MOUSE: THREE.MOUSE,
      Vector2: THREE.Vector2,
      Vector3: THREE.Vector3,
      Vector4: THREE.Vector4,
      Quaternion: THREE.Quaternion,
      Matrix4: THREE.Matrix4,
      Spherical: THREE.Spherical,
      Box3: THREE.Box3,
      Sphere: THREE.Sphere,
      Raycaster: THREE.Raycaster,
      MathUtils: THREE.MathUtils,
    };
  }
}
