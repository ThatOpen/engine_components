import { Components } from "../Components";
import { MeshCullerRenderer, CullerRendererSettings } from "./src";
import { Component, Event, Disposable, World } from "../Types";

export * from "./src";

/**
 * A component that manages and provides culling functionality for meshes in a 3D scene.
 */
export class Cullers extends Component implements Disposable {

  /**
   * A unique identifier for the component.
   * This UUID is used to register the component within the Components system.
   */
  static readonly uuid = "69f2a50d-c266-44fc-b1bd-fa4d34be89e6" as const;

    /**
   * An event that is triggered when the Cullers component is disposed.
   */
  readonly onDisposed = new Event();

  private _enabled = true;

  /**
   * A map of MeshCullerRenderer instances, keyed by their world UUIDs.
   */
  list = new Map<string, MeshCullerRenderer>();

  /** {@link Component.enabled} */
  get enabled() {
    return this._enabled;
  }

  /** {@link Component.enabled} */
  set enabled(value: boolean) {
    this._enabled = value;
    for (const [_id, renderer] of this.list) {
      renderer.enabled = value;
    }
  }

  constructor(components: Components) {
    super(components);
    components.add(Cullers.uuid, this);
  }

/**
 * Creates a new MeshCullerRenderer for the given world.
 * If a MeshCullerRenderer already exists for the world, it will return the existing one.
 *
 * @param world - The world for which to create the MeshCullerRenderer.
 * @param config - Optional configuration settings for the MeshCullerRenderer.
 *
 * @returns The newly created or existing MeshCullerRenderer for the given world.
 */
create(world: World, config?: Partial<CullerRendererSettings>): MeshCullerRenderer {
  if (this.list.has(world.uuid)) {
    return this.list.get(world.uuid) as MeshCullerRenderer;
  }
  const culler = new MeshCullerRenderer(this.components, world, config);
  this.list.set(world.uuid, culler);
  return culler;
}

/**
 * Deletes the MeshCullerRenderer associated with the given world.
 * If a MeshCullerRenderer exists for the given world, it will be disposed and removed from the list.
 *
 * @param world - The world for which to delete the MeshCullerRenderer.
 *
 * @returns {void}
 */
delete(world: World): void {
    const culler = this.list.get(world.uuid);
    if (culler) {
      culler.dispose(); // Dispose the MeshCullerRenderer before removing it from the list
    }
    this.list.delete(world.uuid); // Remove the MeshCullerRenderer from the list
}

  /** {@link Disposable.dispose} */
  dispose() {
    this.enabled = false;
    this.onDisposed.trigger(Cullers.uuid);
    this.onDisposed.reset();
    for (const [_id, culler] of this.list) {
      culler.dispose();
    }
    this.list.clear();
  }
}
