import { Components } from "../Components";
import { MeshCullerRenderer, CullerRendererSettings } from "./src";
import { Component, Event, Disposable, World } from "../Types";

/**
 * A tool to handle big scenes efficiently by automatically hiding the objects
 * that are not visible to the camera.
 */
export class Cullers extends Component implements Disposable {
  static readonly uuid = "69f2a50d-c266-44fc-b1bd-fa4d34be89e6" as const;

  private _enabled = true;

  list = new Map<string, MeshCullerRenderer>();

  /** {@link Disposable.onDisposed} */
  readonly onDisposed = new Event();

  /** {@link Component.enabled} */
  get enabled() {
    return this._enabled;
  }

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

  create(world: World, config?: Partial<CullerRendererSettings>) {
    if (this.list.has(world.uuid)) {
      return this.list.get(world.uuid) as MeshCullerRenderer;
    }
    const culler = new MeshCullerRenderer(this.components, world, config);
    this.list.set(world.uuid, culler);
    return culler;
  }

  remove(world: World) {
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
