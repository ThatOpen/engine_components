import * as THREE from "three";
import { Component, Disposable } from "../../base-types";
import { Disposer } from "../Disposer";
import { Components } from "../Components";

/**
 * A basic 3D [scene](https://threejs.org/docs/#api/en/scenes/Scene) to add
 * objects hierarchically, and easily dispose them when you are finished with it.
 * @noInheritDoc
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
    this._scene.background = new THREE.Color(0x202932);
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
