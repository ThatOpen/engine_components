// eslint-disable-next-line max-classes-per-file
import * as THREE from "three";
import { SimpleScene } from "./simple-scene";
import {
  ColorSettingsControl,
  NumberSettingControl,
  Vector3SettingControl,
} from "../../Types";
import { Configurator } from "../../ConfigManager";

type SimpleSceneConfigType = {
  backgroundColor: ColorSettingsControl;
  ambientLight: {
    color: ColorSettingsControl;
    intensity: NumberSettingControl;
  };
  directionalLight: {
    color: ColorSettingsControl;
    intensity: NumberSettingControl;
    position: Vector3SettingControl;
  };
};

class DirectionalLightConfig {
  private _list: SimpleSceneConfigType;
  private _scene: SimpleScene;

  constructor(list: SimpleSceneConfigType, scene: SimpleScene) {
    this._list = list;
    this._scene = scene;
  }

  get color() {
    return this._list.directionalLight.color.value;
  }

  set color(value: THREE.Color) {
    this._list.directionalLight.color.value = value;
    for (const [, light] of this._scene.directionalLights) {
      light.color.copy(value);
    }
  }

  get intensity() {
    return this._list.directionalLight.intensity.value;
  }

  set intensity(value: number) {
    this._list.directionalLight.intensity.value = value;
    for (const [, light] of this._scene.directionalLights) {
      light.intensity = value;
    }
  }

  get position() {
    return this._list.directionalLight.position.value.clone();
  }

  set position(value: THREE.Vector3) {
    this._list.directionalLight.position.value = value;
    for (const [, light] of this._scene.directionalLights) {
      light.position.copy(value);
    }
  }
}

class AmbientLightConfig {
  private _list: SimpleSceneConfigType;
  private _scene: SimpleScene;

  constructor(list: SimpleSceneConfigType, scene: SimpleScene) {
    this._list = list;
    this._scene = scene;
  }

  get color() {
    return this._list.ambientLight.color.value;
  }

  set color(value: THREE.Color) {
    this._list.ambientLight.color.value = value;
    for (const [, light] of this._scene.ambientLights) {
      light.color.copy(value);
    }
  }

  get intensity() {
    return this._list.ambientLight.intensity.value;
  }

  set intensity(value: number) {
    this._list.ambientLight.intensity.value = value;
    for (const [, light] of this._scene.ambientLights) {
      light.intensity = value;
    }
  }
}

/**
 * Configuration interface for the {@link SimpleScene}.
 */
export interface SimpleSceneConfig {
  backgroundColor: THREE.Color;
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

export class SimpleSceneConfigManager extends Configurator<
  SimpleScene,
  SimpleSceneConfigType
> {
  protected _config: SimpleSceneConfigType = {
    backgroundColor: {
      value: new THREE.Color() as THREE.Color,
      type: "Color" as const,
    },
    ambientLight: {
      color: {
        type: "Color" as const,
        value: new THREE.Color(),
      },
      intensity: {
        type: "Number" as const,
        interpolable: true,
        min: 0,
        max: 10,
        value: 2,
      },
    },
    directionalLight: {
      color: {
        type: "Color" as const,
        value: new THREE.Color(),
      },
      intensity: {
        type: "Number" as const,
        interpolable: true,
        min: 0,
        max: 10,
        value: 2,
      },
      position: {
        type: "Vector3" as const,
        value: new THREE.Vector3(),
      },
    },
  };

  ambientLight = new AmbientLightConfig(this._config, this._component);

  directionalLight = new DirectionalLightConfig(this._config, this._component);

  get backgroundColor() {
    return this._config.backgroundColor.value;
  }

  set backgroundColor(value: THREE.Color) {
    this._config.backgroundColor.value = value;
    this._component.three.background = value;
  }
}
