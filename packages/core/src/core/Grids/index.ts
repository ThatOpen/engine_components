import { Component, Disposable, World, Event } from "../Types";
import { SimpleGrid } from "./src";
import { Components } from "../Components";

export * from "./src";

/**
 * A component that manages grid instances. Each grid is associated with a unique world. 📕 [Tutorial](https://docs.thatopen.com/Tutorials/Components/Core/Grids). 📘 [API](https://docs.thatopen.com/api/@thatopen/components/classes/Grids).
 */
export class Grids extends Component implements Disposable {
  /**
   * A unique identifier for the component.
   * This UUID is used to register the component within the Components system.
   */
  static readonly uuid = "d1e814d5-b81c-4452-87a2-f039375e0489" as const;

  /**
   * A map of world UUIDs to their corresponding grid instances.
   */
  list = new Map<string, SimpleGrid>();

  /** {@link Disposable.onDisposed} */
  readonly onDisposed = new Event();

  /** {@link Component.enabled} */
  enabled = true;

  constructor(components: Components) {
    super(components);
    components.add(Grids.uuid, this);
  }

  /**
   * Creates a new grid for the given world.
   * Throws an error if a grid already exists for the world.
   *
   * @param world - The world to create the grid for.
   * @returns The newly created grid.
   *
   * @throws Will throw an error if a grid already exists for the given world.
   */
  create(world: World): SimpleGrid {
    if (this.list.has(world.uuid)) {
      throw new Error("This world already has a grid!");
    }
    const grid = new SimpleGrid(this.components, world);
    this.list.set(world.uuid, grid);
    world.onDisposed.add(() => {
      this.delete(world);
    });
    return grid;
  }

  /**
   * Deletes the grid associated with the given world.
   * If a grid does not exist for the given world, this method does nothing.
   *
   * @param world - The world for which to delete the grid.
   *
   * @remarks
   * This method will dispose of the grid and remove it from the internal list.
   * If the world is disposed before calling this method, the grid will be automatically deleted.
   */
  delete(world: World) {
    const grid = this.list.get(world.uuid);
    if (grid) {
      grid.dispose();
    }
    this.list.delete(world.uuid);
  }

  /** {@link Disposable.dispose} */
  dispose() {
    for (const [_id, grid] of this.list) {
      grid.dispose();
    }
    this.list.clear();
    this.onDisposed.trigger();
    this.onDisposed.reset();
  }
}
