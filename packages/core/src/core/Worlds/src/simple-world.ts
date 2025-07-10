import * as THREE from "three";
import { UUID } from "../../../utils";
import {
  Event,
  Base,
  World,
  BaseScene,
  BaseCamera,
  BaseRenderer,
  Disposable,
  Updateable,
} from "../../Types";
import { Disposer } from "../../Disposer";
import { Worlds } from "..";
import { Raycasters } from "../../Raycasters";

// TODO: Fix dyanmic anchoring

/**
 * A class representing a simple world in a 3D environment. It extends the Base class and implements the World interface.
 *
 * @template T - The type of the scene. Default is BaseScene.
 * @template U - The type of the camera. Default is BaseCamera.
 * @template S - The type of the renderer. Default is BaseRenderer.
 */
export class SimpleWorld<
    T extends BaseScene = BaseScene,
    U extends BaseCamera = BaseCamera,
    S extends BaseRenderer = BaseRenderer,
  >
  extends Base
  implements World, Disposable, Updateable
{
  readonly onCameraChanged = new Event<U>();

  /**
   * All the loaded [meshes](https://threejs.org/docs/#api/en/objects/Mesh). These meshes will be taken into account in operations like raycasting.
   */
  readonly meshes = new Set<THREE.Mesh>();

  /** {@link Updateable.onAfterUpdate} */
  readonly onAfterUpdate = new Event();

  /** {@link Updateable.onBeforeUpdate} */
  readonly onBeforeUpdate = new Event();

  /** {@link Disposable.onDisposed} */
  readonly onDisposed = new Event();

  /**
   * Indicates whether the world is currently being disposed. This is useful to prevent trying to access world's elements when it's being disposed, which could cause errors when you dispose a world.
   */
  isDisposing = false;

  /**
   * Indicates whether the world is currently enabled.
   * When disabled, the world will not be updated.
   */
  enabled = true;

  private _dynamicAnchor = false;

  set dynamicAnchor(value: boolean) {
    const container = this.renderer?.three.domElement.parentElement;
    if (!container) {
      throw new Error(
        "World: the renderer must have a parentElement to set dynamic anchoring.",
      );
    }
    if (value) {
      if (this.camera.controls) this.camera.controls.minDistance = 0.01;
      container.addEventListener("pointerdown", this.onPointerDown);
    } else {
      container.removeEventListener("pointerdown", this.onPointerDown);
    }
  }

  get dynamicAnchor() {
    return this._dynamicAnchor;
  }

  /**
   * A unique identifier for the world. Is not meant to be changed at any moment.
   */
  readonly uuid = UUID.create();

  /**
   * An optional name for the world.
   */
  name?: string;

  private _scene?: T;

  private _camera?: U;

  private _renderer: S | null = null;

  private onPointerDown = async (event: PointerEvent) => {
    if (!this.camera.hasCameraControls()) {
      throw new Error(
        "World: can't set dynamic anchor if the camera doesn't have controls.",
      );
    }
    const caster = this.components.get(Raycasters).get(this);
    const result = await caster.castRay();
    if (result && result.point && event.button === 0) {
      this.camera.controls.setOrbitPoint(
        result.point.x,
        result.point.y,
        result.point.z,
      );
    }
  };

  private _defaultCamera?: U;

  get defaultCamera() {
    if (!this._defaultCamera) {
      throw new Error("World: there is no default camera defined.");
    }
    return this._defaultCamera;
  }

  set defaultCamera(value: U) {
    this._defaultCamera = value;
  }

  /**
   * Getter for the scene. If no scene is initialized, it throws an error.
   * @returns The current scene.
   */
  get scene(): T {
    if (!this._scene) {
      throw new Error("No scene initialized!");
    }
    return this._scene;
  }

  /**
   * Setter for the scene. It sets the current scene, adds the world to the scene's worlds set,
   * sets the current world in the scene, and triggers the scene's onWorldChanged event with the added action.
   * @param scene - The new scene to be set.
   */
  set scene(scene: T) {
    this._scene = scene;
    scene.worlds.set(this.uuid, this);
    scene.currentWorld = this;
    scene.onWorldChanged.trigger({ world: this, action: "added" });
  }

  /**
   * Getter for the camera. If no camera is initialized, it throws an error.
   * @returns The current camera.
   */
  get camera(): U {
    if (!this._camera) {
      throw new Error("No camera initialized!");
    }
    return this._camera;
  }

  /**
   * Setter for the camera. It sets the current camera, adds the world to the camera's worlds set,
   * sets the current world in the camera, and triggers the camera's onWorldChanged event with the added action.
   * @param camera - The new camera to be set.
   */
  set camera(camera: U) {
    if (!this._camera) this.defaultCamera = camera;
    this._camera = camera;
    camera.currentWorld = this;
    this.onCameraChanged.trigger(camera);
  }

  /**
   * Getter for the renderer.
   * @returns The current renderer or null if no renderer is set. Some worlds don't need a renderer to work (when your mail goal is not to display a 3D viewport to the user).
   */
  get renderer(): S | null {
    return this._renderer;
  }

  /**
   * Setter for the renderer. It sets the current renderer, adds the world to the renderer's worlds set,
   * sets the current world in the renderer, and triggers the renderer's onWorldChanged event with the added action.
   * If a new renderer is set, it also triggers the onWorldChanged event with the removed action for the old renderer.
   * @param renderer - The new renderer to be set or null to remove the current renderer.
   */
  set renderer(renderer: S | null) {
    this._renderer = renderer;
    if (renderer) {
      renderer.worlds.set(this.uuid, this);
      renderer.currentWorld = this;
      renderer.onWorldChanged.trigger({ world: this, action: "added" });
    }
  }

  useDefaultCamera() {
    this.camera = this.defaultCamera;
  }

  /** {@link Updateable.update} */
  update(delta?: number) {
    if (!this.enabled) return;

    if (!this._scene || !this._camera) {
      return;
    }

    this.scene.currentWorld = this;
    this.camera.currentWorld = this;
    if (this.renderer) {
      this.renderer.currentWorld = this;
    }

    this.onBeforeUpdate.trigger();

    if (this.scene.isUpdateable()) {
      this.scene.update(delta);
    }

    if (this.camera.isUpdateable()) {
      this.camera.update(delta);
    }

    if (this.renderer) {
      this.renderer.update(delta);
    }

    this.onAfterUpdate.trigger();
  }

  /** {@link Disposable.dispose} */
  dispose(disposeResources = true) {
    this.enabled = false;
    this.isDisposing = true;

    this.scene.onWorldChanged.trigger({ world: this, action: "removed" });
    this.camera.onWorldChanged.trigger({ world: this, action: "removed" });
    if (this.renderer) {
      this.renderer.onWorldChanged.trigger({ world: this, action: "removed" });
    }

    if (disposeResources) {
      const disposer = this.components.get(Disposer);

      this.scene.dispose();
      if (this.camera.isDisposeable()) {
        this.camera.dispose();
      }
      if (this.renderer) {
        this.renderer.dispose();
      }
      for (const mesh of this.meshes) {
        disposer.destroy(mesh);
      }

      this.meshes.clear();
    }

    this._scene = null as any;
    this._camera = null as any;
    this._renderer = null as any;

    const worlds = this.components.get(Worlds);
    worlds.list.delete(this.uuid);

    this.onDisposed.trigger();
    this.onDisposed.reset();
  }
}
