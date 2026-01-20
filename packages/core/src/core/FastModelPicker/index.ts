import { Component, Disposable, World, Event } from "../Types";
import { FastModelPicker } from "./src";
import { Components } from "../Components";

export * from "./src";

/**
 * A component that manages a FastModelPicker for each world and automatically disposes it when its corresponding world is disposed.
 */
export class FastModelPickers extends Component implements Disposable {
  /**
   * A unique identifier for the component.
   * This UUID is used to register the component within the Components system.
   */
  static readonly uuid = "4a82430c-7ff2-49ea-9401-60807502dad6" as const;

  /** {@link Component.enabled} */
  enabled = true;

  /**
   * A Map that stores FastModelPicker instances for each world.
   * The key is the world's UUID, and the value is the corresponding FastModelPicker instance.
   */
  list = new Map<string, FastModelPicker>();

  /** {@link Disposable.onDisposed} */
  onDisposed = new Event();

  constructor(components: Components) {
    super(components);
    components.add(FastModelPickers.uuid, this);
  }

  /**
   * Retrieves a FastModelPicker instance for the given world.
   * If a FastModelPicker instance already exists for the world, it will be returned.
   * Otherwise, a new FastModelPicker instance will be created and added to the list.
   *
   * @param world - The world for which to retrieve or create a FastModelPicker instance.
   * @returns The FastModelPicker instance for the given world.
   */
  get(world: World): FastModelPicker {
    if (this.list.has(world.uuid)) {
      return this.list.get(world.uuid) as FastModelPicker;
    }
    const picker = new FastModelPicker(this.components, world);
    this.list.set(world.uuid, picker);

    // Automatically delete the picker when the world is disposed.
    world.onDisposed.add(() => {
      this.delete(world);
    });

    return picker;
  }

  /**
   * Deletes the FastModelPicker instance associated with the given world.
   * If a FastModelPicker instance exists for the given world, it will be disposed and removed from the list.
   *
   * @param world - The world for which to delete the FastModelPicker instance.
   * @returns {void}
   */
  delete(world: World): void {
    const picker = this.list.get(world.uuid);
    if (picker) {
      picker.dispose();
    }
    this.list.delete(world.uuid);
  }

  /** {@link Disposable.dispose} */
  dispose() {
    for (const [_id, picker] of this.list) {
      picker.dispose();
    }
    this.list.clear();
    this.onDisposed.trigger();
  }
}

