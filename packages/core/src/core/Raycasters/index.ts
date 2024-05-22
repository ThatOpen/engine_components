import { Component, Disposable, World, Event } from "../Types";
import { SimpleRaycaster } from "./src";
import { Components } from "../Components";

export class Raycasters extends Component implements Disposable {
  static readonly uuid = "d5d8bdf0-db25-4952-b951-b643af207ace" as const;

  enabled = true;

  list = new Map<string, SimpleRaycaster>();

  onDisposed = new Event();

  constructor(components: Components) {
    super(components);
    components.add(Raycasters.uuid, this);
  }

  get(world: World) {
    if (this.list.has(world.uuid)) {
      return this.list.get(world.uuid) as SimpleRaycaster;
    }
    const raycaster = new SimpleRaycaster(this.components, world);
    this.list.set(world.uuid, raycaster);

    world.onDisposed.add(() => {
      this.delete(world);
    });

    return raycaster;
  }

  delete(world: World) {
    const raycaster = this.list.get(world.uuid);
    if (raycaster) {
      raycaster.dispose();
    }
    this.list.delete(world.uuid);
  }

  dispose() {
    for (const [_id, raycaster] of this.list) {
      raycaster.dispose();
    }
    this.list.clear();
    this.onDisposed.trigger();
  }
}
