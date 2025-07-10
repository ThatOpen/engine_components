import { DataMap } from "@thatopen/fragments";
import { Base } from "./base";
import { World } from "./world";
import { Event } from "./event";
import { Components } from "../../Components";

/**
 * One of the elements that make a world. It can be either a scene, a camera or a renderer.
 */
export abstract class BaseWorldItem extends Base {
  readonly worlds = new DataMap<string, World>();

  /**
   * Event that is triggered when a world is added or removed from the `worlds` map.
   * The event payload contains the world instance and the action ("added" or "removed").
   */
  readonly onWorldChanged = new Event<{
    world: World;
    action: "added" | "removed";
  }>();

  protected _currentWorld: World | null = null;

  /**
   * The current world this item is associated with. It can be null if no world is currently active.
   */
  set currentWorld(value: World | null) {
    this._currentWorld = value;
  }

  get currentWorld() {
    return this._currentWorld;
  }

  protected constructor(components: Components) {
    super(components);

    this.onWorldChanged.add(({ world, action }) => {
      if (action === "removed") {
        this.worlds.delete(world.uuid);
      }
    });
  }
}
