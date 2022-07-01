import {SceneComponent} from "../base-types";
import * as THREE from 'three'
import {Components} from "../components";

export class SimpleScene implements SceneComponent {
  readonly scene: THREE.Scene;

  constructor(_components: Components) {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color( 0xcccccc );
  }

  update(_delta: number): void {

  }

  getScene(): THREE.Scene {
    return this.scene
  }
}