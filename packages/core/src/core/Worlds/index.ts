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
  /**
   * A unique identifier for the component.
   * This UUID is used to register the component within the Components system.
   */
  static readonly uuid = "fdb61dc4-2ec1-4966-b83d-54ea795fad4a" as const;

  /**
   * Event triggered after the update process of all worlds.
   * Subscribers can listen to this event to perform actions post-update.
   */
  readonly onAfterUpdate = new Event();

  /**
   * Event triggered before the update process of all worlds.
   * Subscribers can listen to this event to perform actions pre-update.
   */
  readonly onBeforeUpdate = new Event();

  /**
   * Event triggered when the Worlds component is disposed.
   * Subscribers can listen to this event to perform cleanup actions.
   */
  readonly onDisposed = new Event();

  /**
   * A collection of worlds managed by this component.
   * The key is the unique identifier (UUID) of the world, and the value is the World instance.
   */
  list = new Map<string, World>();

  /**
   * A flag indicating whether the Worlds component is enabled.
   * If false, the update process will be skipped.
   */
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
 * @returns {SimpleWorld<T, U, S>} - The newly created SimpleWorld instance.
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
