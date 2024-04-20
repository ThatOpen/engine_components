import * as THREE from "three";
import {
  acceleratedRaycast,
  computeBoundsTree,
  disposeBoundsTree,
} from "three-mesh-bvh";
import { Component, Disposable, Event } from "../Types";
import { Disposer, UUID } from "../Utils";

/**
 * The entry point of the Components library.
 * It can:
 * - Create and access all the components of the library.
 * - Update all the updatable components automatically.
 * - Dispose all the components, preventing memory leaks.
 */
export class Components implements Disposable {
  static readonly release = "1.4.21";

  /**
   * All the loaded [meshes](https://threejs.org/docs/#api/en/objects/Mesh).
   */
  readonly meshes = new Set<THREE.Mesh>();

  /** {@link Disposable.onDisposed} */
  readonly onDisposed = new Event<void>();

  /** The list of components created in this app. */
  readonly list = new Map<string, Component>();

  /** If disabled, the animation loop will be stopped. */
  enabled = false;

  private _clock: THREE.Clock;

  add(uuid: string, instance: Component) {
    if (this.list.has(uuid))
      throw new Error(
        `You're trying to add a component that already exists in the components intance. Use Components.get() instead.`,
      );
    UUID.validate(uuid);
    this.list.set(uuid, instance);
  }

  /**
   * Retrieves a component. If it already exists in this app, it returns the instance of the component. If it
   * doesn't exist, it will instance it automatically.
   *
   * @param Component - The component to get or create.
   */
  get<U extends Component>(Component: new (components: Components) => U): U {
    const uuid = (Component as any).uuid;
    if (!this.list.has(uuid)) {
      const toolInstance = new Component(this);
      if (!this.list.has(uuid)) {
        // In case the component is not auto-registered.
        this.add(uuid, toolInstance);
      }
      return toolInstance;
    }
    return this.list.get(uuid) as U;
  }

  constructor() {
    this._clock = new THREE.Clock();
    Components.setupBVH();
  }

  /**
   * Initializes the library. It should be called at the start of the app after
   * initializing the scene, the renderer and the
   * camera. Additionally, if any component that need a raycaster is
   * used, the {@link raycaster} will need to be initialized.
   */
  init() {
    this.enabled = true;
    this._clock.start();
    this.update();
  }

  /**
   * Disposes the memory of all the components and tools of this instance of
   * the library. A memory leak will be created if:
   *
   * - An instance of the library ends up out of scope and this function isn't
   * called. This is especially relevant in Single Page Applications (React,
   * Angular, Vue, etc).
   *
   * - Any of the objects of this instance (meshes, geometries, etc) is
   * referenced by a reference type (object or array).
   *
   * You can learn more about how Three.js handles memory leaks
   * [here](https://threejs.org/docs/#manual/en/introduction/How-to-dispose-of-objects).
   *
   */
  dispose() {
    const disposer = this.get(Disposer);
    this.enabled = false;

    for (const [_id, component] of this.list) {
      component.enabled = false;
      if (component.isDisposeable()) {
        component.dispose();
      }
    }

    this._clock.stop();
    for (const mesh of this.meshes) {
      disposer.destroy(mesh);
    }

    this.meshes.clear();
    this.onDisposed.trigger();
    this.onDisposed.reset();
  }

  private update = () => {
    if (!this.enabled) return;

    const delta = this._clock.getDelta();

    for (const [_id, component] of this.list) {
      if (component.enabled && component.isUpdateable()) {
        component.update(delta);
      }
    }

    requestAnimationFrame(this.update);
  };

  private static setupBVH() {
    // @ts-ignore
    THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
    // @ts-ignore
    THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;
    THREE.Mesh.prototype.raycast = acceleratedRaycast;
  }
}
