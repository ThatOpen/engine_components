import { MiniMap } from "./src";
import { Component, Updateable, World, Event, Disposable } from "../Types";
import { Components } from "../Components";

export class MiniMaps extends Component implements Updateable, Disposable {
  static readonly uuid = "39ad6aad-84c8-4adf-a1e0-7f25313a9e7f" as const;

  readonly onAfterUpdate = new Event();

  readonly onBeforeUpdate = new Event();

  readonly onDisposed = new Event();

  enabled = true;

  list = new Map<string, MiniMap>();

  constructor(components: Components) {
    super(components);
    this.components.add(MiniMaps.uuid, this);
  }

  create(world: World) {
    if (this.list.has(world.uuid)) {
      throw new Error("This world already has a minimap!");
    }
    const map = new MiniMap(world);
    this.list.set(world.uuid, map);
    return map;
  }

  delete(id: string) {
    const map = this.list.get(id);
    if (map) {
      map.dispose();
    }
    this.list.delete(id);
  }

  dispose() {
    for (const [_id, map] of this.list) {
      map.dispose();
    }
    this.list.clear();
    this.onDisposed.trigger();
  }

  update() {
    for (const [_id, map] of this.list) {
      map.update();
    }
  }
}
