import { Components } from "../Components";
import { MeshCullerRenderer, CullerRendererSettings } from "./src";
import { Component, Event, Disposable, World } from "../Types";

export * from "./src";

/**
 * A tool to handle big scenes efficiently by automatically hiding the objects
 * that are not visible to the camera.
 */
export class Cullers extends Component implements Disposable {

  /**
   * A unique identifier for the Cullers component.
   */
  static readonly uuid = "69f2a50d-c266-44fc-b1bd-fa4d34be89e6" as const;

  /**
   * Indicates whether the Cullers component is enabled.
   */
  private _enabled = true;

  /**
   * A map of MeshCullerRenderer instances, keyed by their world UUIDs.
   */
  list = new Map<string, MeshCullerRenderer>();

  /**
   * An event that is triggered when the Cullers component is disposed.
   */
  readonly onDisposed = new Event();

  /**
   * Gets the enabled state of the Cullers component.
   *
   * @returns The current enabled state.
   */
  get enabled() {
    return this._enabled;
  }

  /**
   * Sets the enabled state of the Cullers component.
   * Also sets the enabled state of all MeshCullerRenderer instances.
   *
   * @param value - The new enabled state.
   */
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

  delete(world: World) {
    const culler = this.list.get(world.uuid);
    if (culler) {
      culler.dispose();
    }
    this.list.delete(world.uuid);
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
