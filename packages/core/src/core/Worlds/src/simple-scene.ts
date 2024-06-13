import * as THREE from "three";
import { BaseScene, Configurable, Event } from "../../Types";
import { Components } from "../../Components";

/**
 * Configuration interface for the {@link SimpleScene}. Defines properties for directional and ambient lights.
 */
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
 * A basic 3D [scene](https://threejs.org/docs/#api/en/scenes/Scene) to add objects hierarchically, and easily dispose them when you are finished with it.
 */
export class SimpleScene extends BaseScene implements Configurable<{}> {
  /** {@link Configurable.isSetup} */
  isSetup = false;

  /**
   * The underlying Three.js scene object.
   * It is used to define the 3D space containing objects, lights, and cameras.
   */
  three: THREE.Scene;

  /** {@link Configurable.onSetup} */
  readonly onSetup = new Event<SimpleScene>();

  /**
   * Configuration interface for the {@link SimpleScene}.
   * Defines properties for directional and ambient lights.
   */
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

  constructor(components: Components) {
    super(components);
    this.three = new THREE.Scene();
    this.three.background = new THREE.Color(0x202932);
  }

  /** {@link Configurable.setup} */
  setup(config?: Partial<SimpleSceneConfig>) {
    this.config = { ...this.config, ...config };
    const directionalLight = new THREE.DirectionalLight(
      this.config.directionalLight.color,
      this.config.directionalLight.intensity,
    );
    directionalLight.position.copy(this.config.directionalLight.position);
    const ambientLight = new THREE.AmbientLight(
      this.config.ambientLight.color,
      this.config.ambientLight.intensity,
    );
    this.three.add(directionalLight, ambientLight);
    this.isSetup = true;
    this.onSetup.trigger(this);
  }
}
