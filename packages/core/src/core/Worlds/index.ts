import {
  Component,
  Disposable,
  Updateable,
  World,
  Event,
  BaseScene,
  BaseCamera,
  BaseRenderer,
  DataMap,
} from "../Types";
import { Components } from "../Components";
import { SimpleWorld } from "./src";

export * from "./src";

/**
 * A class representing a collection of worlds within a game engine. It manages the creation, deletion, and update of worlds. 📕 [Tutorial](https://docs.thatopen.com/Tutorials/Components/Core/Worlds). 📘 [API](https://docs.thatopen.com/api/@thatopen/components/classes/Worlds).
 */
export class Worlds extends Component implements Updateable, Disposable {
  /**
   * A unique identifier for the component.
   * This UUID is used to register the component within the Components system.
   */
  static readonly uuid = "fdb61dc4-2ec1-4966-b83d-54ea795fad4a" as const;

  /** {@link Updateable.onAfterUpdate} */
  readonly onAfterUpdate = new Event();

  /** {@link Updateable.onBeforeUpdate} */
  readonly onBeforeUpdate = new Event();

  /** {@link Disposable.onDisposed} */
  readonly onDisposed = new Event();

  /**
   * A collection of worlds managed by this component.
   * The key is the unique identifier (UUID) of the world, and the value is the World instance.
   */
  list = new DataMap<string, World>();

  /** {@link Component.enabled} */
  enabled = true;

  constructor(components: Components) {
    super(components);
    components.add(Worlds.uuid, this);
  }

  /**
   * Creates a new instance of a SimpleWorld and adds it to the list of worlds.
   *
   * @template T - The type of the scene, extending from BaseScene. Defaults to BaseScene.
   * @template U - The type of the camera, extending from BaseCamera. Defaults to BaseCamera.
   * @template S - The type of the renderer, extending from BaseRenderer. Defaults to BaseRenderer.
   *
   * @throws {Error} - Throws an error if a world with the same UUID already exists in the list.
   */
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

  /**
   * Deletes a world from the list of worlds.
   *
   * @param {World} world - The world to be deleted.
   *
   * @throws {Error} - Throws an error if the provided world is not found in the list.
   */
  delete(world: World) {
    if (!this.list.has(world.uuid)) {
      throw new Error("The provided world is not found in the list!");
    }
    this.list.delete(world.uuid);
    world.dispose();
  }

  /**
   * Disposes of the Worlds component and all its managed worlds.
   * This method sets the enabled flag to false, disposes of all worlds, clears the list,
   * and triggers the onDisposed event.
   */
  dispose() {
    this.enabled = false;
    for (const [_id, world] of this.list) {
      world.dispose();
    }
    this.list.clear();
    this.onDisposed.trigger();
  }

  /** {@link Updateable.update} */
  update(delta?: number): void | Promise<void> {
    if (!this.enabled) return;
    for (const [_id, world] of this.list) {
      world.update(delta);
    }
  }
}
