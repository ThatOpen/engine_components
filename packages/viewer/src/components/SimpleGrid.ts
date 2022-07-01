import {ToolComponent} from "../base-types";
import {Components} from "../components";
import * as THREE from "three";

export class SimpleGrid implements ToolComponent {

  private readonly grid: THREE.GridHelper;

  constructor(components: Components) {
    this.grid = new THREE.GridHelper(50, 50)
    components.scene?.getScene()?.add(this.grid)
  }

  update(_delta: number): void {

  }

  set enabled(enabled: boolean){
    this.grid.visible = enabled;
  }

  get enabled(){
    return this.grid.visible
  }
}