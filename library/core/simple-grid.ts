import * as THREE from "three";
import { IHideable, ToolComponent } from "./base-types";
import { Components } from "../components";

// TODO: Grid is not a tool, should live somewhere else
export class SimpleGrid implements ToolComponent, IHideable {
  public readonly name = "grid";

  readonly grid: THREE.GridHelper;

  constructor(components: Components) {
    this.grid = new THREE.GridHelper(50, 50);
    components.scene?.getScene()?.add(this.grid);
  }

  set visible(visible: boolean) {
    this.grid.visible = visible;
  }

  get visible() {
    return this.grid.visible;
  }

  update(_delta: number): void {}
}
