import * as THREE from "three";
import { Components } from "../components";
import { Component } from "./base-components";

/**
 * A basic 3D [scene](https://threejs.org/docs/#api/en/scenes/Scene) to add
 * objects hierarchically.
 */
export class SimpleScene extends Component<THREE.Scene> {
  /** {@link Component.enabled} */
  enabled = true;

  /** {@link Component.name} */
  name = "SimpleScene";

  private readonly _scene: THREE.Scene;

  constructor(_components: Components) {
    super();
    this._scene = new THREE.Scene();
    this._scene.background = new THREE.Color(0xcccccc);
  }

  /** {@link Component.get} */
  get() {
    return this._scene;
  }
}
