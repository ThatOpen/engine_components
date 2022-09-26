import * as THREE from "three";
import { CameraComponent } from "../core";

export class MapboxCamera implements CameraComponent {
  enabled = true;
  camera = new THREE.Camera();

  get() {
    return this.camera;
  }

  resize(): void {}

  update(_delta: number): void {}
}
