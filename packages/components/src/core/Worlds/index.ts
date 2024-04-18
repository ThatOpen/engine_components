import { Component, Disposable, Updateable, World, Event } from "../Types";
import { Components } from "../Components";

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

  add(world: World) {
    const id = world.uuid;
    if (this.list.has(id)) {
      throw new Error("There is already a world with this name!");
    }
    this.list.set(id, world);
  }

  dispose() {
    this.enabled = false;
    for (const [_id, world] of this.list) {
      world.dispose();
    }
    this.onDisposed.trigger();
  }

  update(delta?: number): void | Promise<void> {
    if (!this.enabled) return;
    for (const [_id, world] of this.list) {
      world.update(delta);
    }
  }
}
