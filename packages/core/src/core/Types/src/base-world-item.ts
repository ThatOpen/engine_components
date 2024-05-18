import { Base } from "./base";
import { World } from "./world";
import { Event } from "./event";
import { Components } from "../../Components";

/**
 * One of the elements that make a world. It can be either a scene, a camera
 * or a renderer.
 */
export abstract class BaseWorldItem extends Base {
  readonly worlds = new Map<string, World>();

  readonly onWorldChanged = new Event<{
    world: World;
    action: "added" | "removed";
  }>();

  currentWorld: World | null = null;

  protected constructor(components: Components) {
    super(components);

    this.onWorldChanged.add(({ world, action }) => {
      if (action === "removed") {
        this.worlds.delete(world.uuid);
      }
    });
  }
}
