import { Component, Disposable, World, Event } from "../Types";
import { SimpleRaycaster } from "./src";
import { Components } from "../Components";

export * from "./src";

/**
 * A component that manages a raycaster for each world and automatically disposes it when its corresponding world is disposed. 📕 [Tutorial](https://docs.thatopen.com/Tutorials/Components/Core/Raycasters). 📘 [API](https://docs.thatopen.com/api/@thatopen/components/classes/Raycasters).
 */
export class Raycasters extends Component implements Disposable {
  /**
   * A unique identifier for the component.
   * This UUID is used to register the component within the Components system.
   */
  static readonly uuid = "d5d8bdf0-db25-4952-b951-b643af207ace" as const;

  /** {@link Component.enabled} */
  enabled = true;

  /**
   * A Map that stores raycasters for each world.
   * The key is the world's UUID, and the value is the corresponding SimpleRaycaster instance.
   */
  list = new Map<string, SimpleRaycaster>();

  /** {@link Disposable.onDisposed} */
  onDisposed = new Event();

  constructor(components: Components) {
    super(components);
    components.add(Raycasters.uuid, this);
  }

  /**
   * Retrieves a SimpleRaycaster instance for the given world.
   * If a SimpleRaycaster instance already exists for the world, it will be returned.
   * Otherwise, a new SimpleRaycaster instance will be created and added to the list.
   *
   * @param world - The world for which to retrieve or create a SimpleRaycaster instance.
   * @returns The SimpleRaycaster instance for the given world.
   */
  get(world: World): SimpleRaycaster {
    if (this.list.has(world.uuid)) {
      return this.list.get(world.uuid) as SimpleRaycaster;
    }
    const raycaster = new SimpleRaycaster(this.components, world);
    this.list.set(world.uuid, raycaster);

    // Automatically delete the raycaster when the world is disposed.
    world.onDisposed.add(() => {
      this.delete(world);
    });

    return raycaster;
  }

  /**
   * Deletes the SimpleRaycaster instance associated with the given world.
   * If a SimpleRaycaster instance exists for the given world, it will be disposed and removed from the list.
   *
   * @param world - The world for which to delete the SimpleRaycaster instance.
   * @returns {void}
   */
  delete(world: World): void {
    const raycaster = this.list.get(world.uuid);
    if (raycaster) {
      raycaster.dispose();
    }
    this.list.delete(world.uuid);
  }

  /** {@link Disposable.dispose} */
  dispose() {
    for (const [_id, raycaster] of this.list) {
      raycaster.dispose();
    }
    this.list.clear();
    this.onDisposed.trigger();
  }
}
