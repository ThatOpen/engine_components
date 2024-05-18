import {
  Component,
  Disposable,
  Updateable,
  World,
  Event,
  BaseScene,
  BaseCamera,
  BaseRenderer,
} from "../Types";
import { Components } from "../Components";
import { SimpleWorld } from "./src";

export * from "./src";

export class Worlds extends Component implements Updateable, Disposable {
  static readonly uuid = "fdb61dc4-2ec1-4966-b83d-54ea795fad4a" as const;

  readonly onAfterUpdate = new Event();

  readonly onBeforeUpdate = new Event();

  readonly onDisposed = new Event();

  list = new Map<string, World>();

  enabled = true;

  constructor(components: Components) {
    super(components);
    components.add(Worlds.uuid, this);
  }

  create<
    T extends BaseScene = BaseScene,
    U extends BaseCamera = BaseCamera,
    S extends BaseRenderer = BaseRenderer,
  >() {
    const world = new SimpleWorld<T, U, S>(this.components);
    const id = world.uuid;
    if (this.list.has(id)) {
      throw new Error("There is already a world with this name!");
    }
    this.list.set(id, world);
    return world;
  }

  delete(world: World) {
    this.list.delete(world.uuid);
    world.dispose();
  }

  dispose() {
    this.enabled = false;
    for (const [_id, world] of this.list) {
      world.dispose();
    }
    this.list.clear();
    this.onDisposed.trigger();
  }

  update(delta?: number): void | Promise<void> {
    if (!this.enabled) return;
    for (const [_id, world] of this.list) {
      world.update(delta);
    }
  }
}
