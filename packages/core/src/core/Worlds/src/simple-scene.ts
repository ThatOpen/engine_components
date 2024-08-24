import * as THREE from "three";
import { BaseScene, Configurable, Event } from "../../Types";
import { Components } from "../../Components";
import {
  SimpleSceneConfig,
  SimpleSceneConfigManager,
} from "./simple-scene-config";

/**
 * A basic 3D [scene](https://threejs.org/docs/#api/en/scenes/Scene) to add objects hierarchically, and easily dispose them when you are finished with it.
 */
export class SimpleScene
  extends BaseScene
  implements Configurable<SimpleSceneConfigManager, SimpleSceneConfig>
{
  /** {@link Configurable.isSetup} */
  isSetup = false;

  /**
   * The underlying Three.js scene object.
   * It is used to define the 3D space containing objects, lights, and cameras.
   */
  three: THREE.Scene;

  /** {@link Configurable.onSetup} */
  readonly onSetup = new Event<SimpleScene>();

  /** {@link Configurable.config} */
  config = new SimpleSceneConfigManager(this);

  constructor(components: Components) {
    super(components);
    this.three = new THREE.Scene();
    this.three.background = new THREE.Color(0x202932);
  }

  /** {@link Configurable.setup} */
  setup(config?: Partial<SimpleSceneConfig>) {
    const defaultConfig = {
      backgroundColor: new THREE.Color(0x202932),
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

    const fullConfig = { ...defaultConfig, ...config };

    this.config.backgroundColor = fullConfig.backgroundColor.getHex();

    const ambLight = fullConfig.ambientLight;
    this.config.ambientLight.color = ambLight.color.getHex();
    this.config.ambientLight.intensity = ambLight.intensity;

    const dirLight = fullConfig.directionalLight;
    this.config.directionalLight.color = dirLight.color.getHex();
    this.config.directionalLight.intensity = dirLight.intensity;
    const { x, y, z } = dirLight.position;
    this.config.directionalLight.position = [x, y, z];

    this.deleteAllLights();

    const { color: dc, intensity: di } = this.config.directionalLight;
    const directionalLight = new THREE.DirectionalLight(dc, di);
    directionalLight.position.set(x, y, z);

    const { color: ac, intensity: ai } = this.config.directionalLight;
    const ambientLight = new THREE.AmbientLight(ac, ai);

    this.three.add(directionalLight, ambientLight);
    this.directionalLights.set(directionalLight.uuid, directionalLight);
    this.ambientLights.set(ambientLight.uuid, ambientLight);

    this.isSetup = true;
    this.onSetup.trigger();
  }
}
