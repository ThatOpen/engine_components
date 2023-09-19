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

  private readonly _scene: THREE.Scene;

  constructor(components: Components) {
    super(components);
    this._scene = new THREE.Scene();
    this._scene.background = new THREE.Color(0x202932);
  }

  /** {@link Component.get} */
  get() {
    return this._scene;
  }

  /** {@link Disposable.dispose} */
  async dispose() {
    const disposer = await this.components.tools.get(Disposer);
    for (const child of this._scene.children) {
      const mesh = child as THREE.Mesh;
      if (mesh.geometry) {
        disposer.destroy(mesh);
      }
    }
    this._scene.children = [];
  }

  /** Creates a simple and nice default set up for the scene (e.g. lighting). */
  setup() {
    const directionalLight = new THREE.DirectionalLight();
    directionalLight.position.set(5, 10, 3);
    directionalLight.intensity = 0.5;
    this._scene.add(directionalLight);
    const ambientLight = new THREE.AmbientLight();
    ambientLight.intensity = 0.5;
    this._scene.add(ambientLight);
  }
}
