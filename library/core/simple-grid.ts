import { IHideable, ToolComponent} from "./base-types";
import {Components} from "../components";
import * as THREE from "three";

export class SimpleGrid implements ToolComponent, IHideable {

  public readonly name = "grid";

  private readonly grid: THREE.GridHelper;

  constructor(components: Components) {
    this.grid = new THREE.GridHelper(50, 50)
    components.scene?.getScene()?.add(this.grid)
  }

  set visible(visible: boolean) {
    this.grid.visible = visible;
  }

  get visible(){
    return this.grid.visible;
  }

  update(_delta: number): void {
  }
}