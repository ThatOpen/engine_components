import * as THREE from "three";
import { Component, Disposable, World, Event } from "../Types";
import { GridConfig, SimpleGrid } from "./src";

export class Grids extends Component implements Disposable {
  static readonly uuid = "d1e814d5-b81c-4452-87a2-f039375e0489" as const;

  list = new Map<string, SimpleGrid>();

  onDisposed = new Event();

  config: Required<GridConfig> = {
    color: new THREE.Color(0xbbbbbb),
    size1: 1,
    size2: 10,
    distance: 500,
  };

  /** {@link Component.enabled} */
  enabled = true;

  create(world: World) {
    if (this.list.has(world.uuid)) {
      throw new Error("This world already has a grid!");
    }
    const grid = new SimpleGrid(this.components, world, this.config);
    this.list.set(world.uuid, grid);
    world.onDisposed.add(() => {
      this.delete(world);
    });
    return grid;
  }

  delete(world: World) {
    const grid = this.list.get(world.uuid);
    if (grid) {
      grid.dispose();
    }
    this.list.delete(world.uuid);
  }

  dispose() {
    for (const [_id, grid] of this.list) {
      grid.dispose();
    }
    this.list.clear();
    this.onDisposed.trigger();
  }
}
