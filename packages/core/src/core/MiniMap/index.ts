import { MiniMap } from "./src";
import {
  Component,
  Updateable,
  World,
  Event,
  Disposable,
  Configurable,
} from "../Types";
import { Components } from "../Components";

export * from "./src";

/**
 * A component that manages multiple {@link MiniMap} instances, each associated with a unique world ID. 📕 [Tutorial](https://docs.thatopen.com/Tutorials/Components/Core/MiniMap). 📘 [API](https://docs.thatopen.com/api/@thatopen/components/classes/MiniMaps).
 */
export class MiniMaps extends Component implements Updateable, Disposable {
  /**
   * A unique identifier for the component.
   * This UUID is used to register the component within the Components system.
   */
  static readonly uuid = "39ad6aad-84c8-4adf-a1e0-7f25313a9e7f" as const;

  /** {@link Updateable.onAfterUpdate} */
  readonly onAfterUpdate = new Event();

  /** {@link Updateable.onBeforeUpdate} */
  readonly onBeforeUpdate = new Event();

  /** {@link Disposable.onDisposed} */
  readonly onDisposed = new Event();

  /** {@link Configurable.onSetup} */
  readonly onSetup = new Event();

  /** {@link Component.enabled} */
  enabled = true;

  /**
   * A collection of {@link MiniMap} instances, each associated with a unique world ID.
   */
  list = new Map<string, MiniMap>();

  constructor(components: Components) {
    super(components);
    this.components.add(MiniMaps.uuid, this);
  }

  /**
   * Creates a new {@link MiniMap} instance associated with the given world.
   * If a {@link MiniMap} instance already exists for the given world, an error will be thrown.
   *
   * @param world - The {@link World} for which to create a {@link MiniMap} instance.
   * @returns The newly created {@link MiniMap} instance.
   * @throws Will throw an error if a {@link MiniMap} instance already exists for the given world.
   */
  create(world: World): MiniMap {
    if (this.list.has(world.uuid)) {
      throw new Error("This world already has a minimap!");
    }
    const map = new MiniMap(world, this.components);
    this.list.set(world.uuid, map);
    return map;
  }

  /**
   * Deletes a {@link MiniMap} instance associated with the given world ID.
   * If a {@link MiniMap} instance does not exist for the given ID, nothing happens.
   *
   * @param id - The unique identifier of the world for which to delete the {@link MiniMap} instance.
   * @returns {void}
   */
  delete(id: string) {
    const map = this.list.get(id);
    if (map) {
      map.dispose(); // Dispose the minimap before deleting it
    }
    this.list.delete(id); // Remove the minimap from the list
  }

  /** {@link Disposable.dispose} */
  dispose() {
    for (const [_id, map] of this.list) {
      map.dispose();
    }
    this.list.clear();
    this.onDisposed.trigger();
  }

  /** {@link Updateable.update} */
  update() {
    for (const [_id, map] of this.list) {
      map.update();
    }
  }
}
