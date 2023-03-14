import * as THREE from "three";
import { Components } from "../../types/components";
import { Component } from "../../types/component";
import { Disposable } from "../../types";
import { Disposer } from "../MemoryComponent";

/**
 * A basic 3D [scene](https://threejs.org/docs/#api/en/scenes/Scene) to add
 * objects hierarchically.
 */
export class SimpleScene extends Component<THREE.Scene> implements Disposable {
  /** {@link Component.enabled} */
  enabled = true;

  /** {@link Component.name} */
  name = "SimpleScene";

  private readonly _scene: THREE.Scene;
  private readonly _disposer = new Disposer();

  constructor(_components: Components) {
    super();
    this._scene = new THREE.Scene();
    this._scene.background = new THREE.Color(0xcccccc);
  }

  /** {@link Component.get} */
  get() {
    return this._scene;
  }

  /** {@link Disposable.dispose} */
  dispose() {
    for (const child of this._scene.children) {
      const mesh = child as THREE.Mesh;
      if (mesh.geometry) {
        this._disposer.dispose(mesh);
      }
    }
    this._scene.children = [];
  }
}
