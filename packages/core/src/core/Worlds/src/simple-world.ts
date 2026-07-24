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
import { setOrbitPoint, Worlds } from "..";
import { Raycasters } from "../../Raycasters";

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

  // Bumped on every anchor press so a slow geometry pick that resolves after a
  // newer press is ignored (see onPointerDown).
  private _anchorRequestId = 0;

  set dynamicAnchor(value: boolean) {
    const container = this.renderer?.three.domElement.parentElement;
    if (!container) {
      throw new Error(
        "World: the renderer must have a parentElement to set dynamic anchoring.",
      );
    }
    if (value) {
      container.addEventListener("pointerdown", this.onPointerDown);
    } else {
      container.removeEventListener("pointerdown", this.onPointerDown);
    }
    this._dynamicAnchor = value;
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

  private onPointerDown = (event: PointerEvent) => {
    if (!this.camera.hasCameraControls()) {
      throw new Error(
        "World: can't set dynamic anchor if the camera doesn't have controls.",
      );
    }

    if (event.button !== 0) return;

    const position = this.getPointerPosition(event);
    if (!position) return;

    const caster = this.components.get(Raycasters).get(this);

    // Anchor immediately on the plane through the current orbit target facing
    // the camera. That plane is always hit, so the anchor follows the pointer
    // even over empty space (issue #768: previously a miss left the pivot where
    // it was, so the same gesture behaved differently on geometry vs void).
    // Holding the current focus depth keeps the orbit radius stable instead of
    // snapping around as the pointer crosses gaps between objects.
    const planePoint = this.getPlaneAnchor(caster, position);
    if (planePoint) {
      setOrbitPoint(this.camera.controls, planePoint);
    }

    // Then refine to the real geometry depth once the (asynchronous) pick
    // resolves. Both points sit on the same pointer ray and setOrbitPoint
    // preserves the rendered image, so this only corrects the depth. Guarded by
    // a request id so a stale pick from an earlier press can't win.
    const requestId = ++this._anchorRequestId;
    caster.castRay({ position }).then((result) => {
      const isStale = requestId !== this._anchorRequestId;
      if (isStale || this.isDisposing || !this._dynamicAnchor) return;
      if (!result?.point || !this.camera.hasCameraControls()) return;
      setOrbitPoint(this.camera.controls, result.point);
    });
  };

  /**
   * The pointer position in normalized device coordinates, derived from the
   * event rather than the raycaster's mouse: that one only tracks pointermove
   * and touchstart, so on a bare pointerdown it would still report the center of
   * the viewport.
   */
  private getPointerPosition(event: PointerEvent) {
    const dom = this.renderer?.three.domElement;
    if (!dom) return null;
    const bounds = dom.getBoundingClientRect();
    return new THREE.Vector2(
      ((event.clientX - bounds.left) / (bounds.right - bounds.left)) * 2 - 1,
      -((event.clientY - bounds.top) / (bounds.bottom - bounds.top)) * 2 + 1,
    );
  }

  /**
   * The point where the pointer ray crosses the plane that contains the current
   * orbit target and faces the camera. Used as the anchor when the pointer
   * doesn't land on any geometry.
   */
  private getPlaneAnchor(
    caster: ReturnType<Raycasters["get"]>,
    position: THREE.Vector2,
  ) {
    if (!this.camera.hasCameraControls()) return null;
    const camera = this.camera.three as
      | THREE.PerspectiveCamera
      | THREE.OrthographicCamera;
    caster.three.setFromCamera(position, camera);
    const target = this.camera.controls.getTarget(new THREE.Vector3());
    const normal = camera.getWorldDirection(new THREE.Vector3());
    const plane = new THREE.Plane().setFromNormalAndCoplanarPoint(
      normal,
      target,
    );
    // The ray points into the frustum, so it can never be parallel to a plane
    // whose normal is the camera direction, but intersectPlane is nullable.
    return caster.three.ray.intersectPlane(plane, new THREE.Vector3());
  }

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
    // Being disposed twice is normal in component frameworks: components.dispose()
    // tears the world down on unmount, and then the UI element that owns the world
    // gets removed from the DOM and disposes it again. Without this, the second
    // call reaches the scene / camera getters, which throw once the world is gone.
    if (this.isDisposing) return;

    this.enabled = false;
    this.isDisposing = true;

    // Remove the dynamic anchoring listener before the renderer is disposed
    const container = this.renderer?.three.domElement.parentElement;
    if (container) {
      container.removeEventListener("pointerdown", this.onPointerDown);
    }
    this._dynamicAnchor = false;

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
