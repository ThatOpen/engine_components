import * as THREE from "three";
import { BaseScene, Configurable, Event } from "../../Types";
import { Components } from "../../Components";
import {
  SimpleSceneConfig,
  SimpleSceneConfigManager,
} from "./simple-scene-config";
import { ConfigManager } from "../../ConfigManager";

/**
 * A basic 3D [scene](https://threejs.org/docs/#api/en/scenes/Scene) to add objects hierarchically, and easily dispose them when you are finished with it.
 */
export class SimpleScene
  extends BaseScene
  implements Configurable<SimpleSceneConfigManager, SimpleSceneConfig>
{
  /** {@link Configurable.onSetup} */
  readonly onSetup = new Event();

  /** {@link Configurable.isSetup} */
  isSetup = false;

  /**
   * The underlying Three.js scene object.
   * It is used to define the 3D space containing objects, lights, and cameras.
   */
  three: THREE.Scene;

  /** {@link Configurable.config} */
  config = new SimpleSceneConfigManager(this, this.components, "Scene");

  protected _defaultConfig: SimpleSceneConfig = {
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

  constructor(components: Components) {
    super(components);
    this.three = new THREE.Scene();
    this.three.background = new THREE.Color(0x202932);
  }

  /** {@link Configurable.setup} */
  setup(config?: Partial<SimpleSceneConfig>) {
    const fullConfig = { ...this._defaultConfig, ...config };

    this.config.backgroundColor = fullConfig.backgroundColor;

    const ambLightData = fullConfig.ambientLight;
    this.config.ambientLight.color = ambLightData.color;
    this.config.ambientLight.intensity = ambLightData.intensity;

    const dirLightData = fullConfig.directionalLight;
    this.config.directionalLight.color = dirLightData.color;
    this.config.directionalLight.intensity = dirLightData.intensity;
    this.config.directionalLight.position = dirLightData.position;

    this.deleteAllLights();

    const { color: dc, intensity: di } = this.config.directionalLight;
    const directionalLight = new THREE.DirectionalLight(dc, di);
    directionalLight.position.copy(dirLightData.position);

    const { color: ac, intensity: ai } = this.config.directionalLight;
    const ambientLight = new THREE.AmbientLight(ac, ai);

    this.three.add(directionalLight, ambientLight);
    this.directionalLights.set(directionalLight.uuid, directionalLight);
    this.ambientLights.set(ambientLight.uuid, ambientLight);

    this.isSetup = true;
    this.onSetup.trigger();
  }

  dispose() {
    super.dispose();
    const configs = this.components.get(ConfigManager);
    configs.list.delete(this.config.uuid);
  }
}
