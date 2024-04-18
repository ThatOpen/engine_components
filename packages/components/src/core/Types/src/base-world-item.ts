import { Base } from "./base";
import { World } from "./world";
import { Event } from "./event";

/**
 * One of the elements that make a world. It can be either a scene, a camera
 * or a renderer.
 */
export abstract class BaseWorldItem extends Base {
  private _world: World | null = null;

  readonly onWorldChanged = new Event<World | null>();

  get world() {
    if (!this._world) {
      throw new Error("World not initialized!");
    }
    return this._world;
  }

  set world(world: World | null) {
    this._world = world;
    this.onWorldChanged.trigger(world);
  }
}
