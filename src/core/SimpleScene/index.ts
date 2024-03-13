import * as THREE from "three";
import { Component, Configurable, Disposable, Event } from "../../base-types";
import { Disposer } from "../Disposer";
import { Components } from "../Components";

export interface SimpleSceneConfig {
  directionalLight: {
    color: THREE.Color;
    intensity: number;
    position: THREE.Vector3;
  };
  ambientLight: {
    color: THREE.Color;
    intensity: number;
  };
}

/**
 * A basic 3D [scene](https://threejs.org/docs/#api/en/scenes/Scene) to add
 * objects hierarchically, and easily dispose them when you are finished with it.
 * @noInheritDoc
 */
export class SimpleScene
  extends Component<THREE.Scene>
  implements Disposable, Configurable<{}>
{
  /** {@link Component.enabled} */
  enabled = true;

  /** {@link Configurable.isSetup} */
  isSetup = false;

  /** {@link Disposable.onDisposed} */
  readonly onDisposed = new Event<undefined>();

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
    const disposer = this.components.tools.get(Disposer);
    for (const child of this._scene.children) {
      const mesh = child as THREE.Mesh;
      if (mesh.geometry) {
        disposer.destroy(mesh);
      }
    }
    this._scene.children = [];
    await this.onDisposed.trigger();
    this.onDisposed.reset();
  }

  config: Required<SimpleSceneConfig> = {
    directionalLight: {
      color: new THREE.Color("white"),
      intensity: 1.5,
      position: new THREE.Vector3(5, 10, 3),
    },
    ambientLight: {
      color: new THREE.Color("white"),
      intensity: 1,
    },
  };
  readonly onSetup = new Event<SimpleScene>();

  /** Creates a simple and nice default set up for the scene (e.g. lighting). */
  async setup(config?: Partial<SimpleSceneConfig>) {
    this.config = { ...this.config, ...config };
    const directionalLight = new THREE.DirectionalLight(
      this.config.directionalLight.color,
      this.config.directionalLight.intensity
    );
    directionalLight.position.copy(this.config.directionalLight.position);
    const ambientLight = new THREE.AmbientLight(
      this.config.ambientLight.color,
      this.config.ambientLight.intensity
    );
    this._scene.add(directionalLight, ambientLight);
    this.isSetup = true;
    this.onSetup.trigger(this);
  }
}
