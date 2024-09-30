import * as THREE from "three";
import {
  acceleratedRaycast,
  computeBoundsTree,
  disposeBoundsTree,
} from "three-mesh-bvh";
import { Component, Disposable, Event } from "../Types";
import { UUID } from "../../utils";

/**
 * The entry point of the Components library. It can create, delete and access all the components of the library globally, update all the updatable components automatically and dispose all the components, preventing memory leaks.
 */
export class Components implements Disposable {
  /**
   * The version of the @thatopen/components library.
   */
  static readonly release = "2.2.12";

  /** {@link Disposable.onDisposed} */
  readonly onDisposed = new Event<void>();

  /**
   * The list of components created in this app.
   * The keys are UUIDs and the values are instances of the components.
   */
  readonly list = new Map<string, Component>();

  /**
   * If disabled, the animation loop will be stopped.
   * Default value is false.
   */
  enabled = false;

  private _clock: THREE.Clock;

  /**
   * Event that triggers the Components instance is initialized.
   *
   * @remarks
   * This event is triggered once when the {@link Components.init} method has been called and finish processing.
   * This is useful to set configuration placeholders that need to be executed when the components instance is initialized.
   * For example, enabling and configuring custom effects in a post-production renderer.
   *
   * @example
   * ```typescript
   * const components = new Components();
   * components.onInit.add(() => {
   *   // Enable custom effects in the post-production renderer
   *   // or any other operation dependant on the component initialization
   * });
   * components.init();
   * ```
   */
  readonly onInit = new Event<undefined>();

  /**
   * Adds a component to the list of components.
   * Throws an error if a component with the same UUID already exists.
   *
   * @param uuid - The unique identifier of the component.
   * @param instance - The instance of the component to be added.
   *
   * @throws Will throw an error if a component with the same UUID already exists.
   *
   * @internal
   */
  add(uuid: string, instance: Component) {
    if (this.list.has(uuid))
      throw new Error(
        `You're trying to add a component that already exists in the components instance. Use Components.get() instead.`,
      );
    UUID.validate(uuid);
    this.list.set(uuid, instance);
  }

  /**
   * Retrieves a component instance by its constructor function.
   * If the component does not exist in the list, it will be created and added.
   *
   * @template U - The type of the component to retrieve.
   * @param Component - The constructor function of the component to retrieve.
   *
   * @returns The instance of the requested component.
   *
   * @throws Will throw an error if a component with the same UUID already exists.
   *
   * @internal
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
   * Initializes the Components instance.
   * This method starts the animation loop, sets the enabled flag to true,
   * and calls the update method.
   */
  init() {
    this.enabled = true;
    this._clock.start();
    this.update();
    this.onInit.trigger();
  }

  /**
   * Disposes the memory of all the components and tools of this instance of
   * the library. A memory leak will be created if:
   *
   * - An instance of the library ends up out of scope and this function isn't
   * called. This is especially relevant in Single Page Applications (React,
   * Angular, Vue, etc).
   *
   * - Any of the objects of this instance (meshes, geometries,materials, etc) is
   * referenced by a reference type (object or array).
   *
   * You can learn more about how Three.js handles memory leaks
   * [here](https://threejs.org/docs/#manual/en/introduction/How-to-dispose-of-objects).
   *
   */
  dispose() {
    this.enabled = false;

    for (const [_id, component] of this.list) {
      component.enabled = false;
      if (component.isDisposeable()) {
        component.dispose();
      }
    }

    this._clock.stop();

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
