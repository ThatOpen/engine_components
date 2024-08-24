// eslint-disable-next-line max-classes-per-file
import * as THREE from "three";
import { SimpleScene } from "./simple-scene";
import {
  ColorSettingsControl,
  ConfigManager,
  NumberSettingControl,
  VectorSettingControl,
} from "../../Types";

type SimpleSceneConfigType = {
  backgroundColor: ColorSettingsControl;
  ambientLight: {
    color: ColorSettingsControl;
    intensity: NumberSettingControl;
  };
  directionalLight: {
    color: ColorSettingsControl;
    intensity: NumberSettingControl;
    position: VectorSettingControl;
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

  set color(value: number) {
    this._list.directionalLight.color.value = value;
    for (const [, light] of this._scene.directionalLights) {
      light.color = new THREE.Color(value);
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
    return this._list.directionalLight.position.value;
  }

  set position(value: number[]) {
    this._list.directionalLight.position.value = value;
    const [x, y, z] = value;
    for (const [, light] of this._scene.directionalLights) {
      light.position.set(x, y, z);
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

  set color(value: number) {
    this._list.ambientLight.color.value = value;
    for (const [, light] of this._scene.ambientLights) {
      light.color = new THREE.Color(value);
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

export class SimpleSceneConfigManager extends ConfigManager<
  SimpleScene,
  SimpleSceneConfigType
> {
  protected _list = {
    backgroundColor: {
      value: 0,
      opacity: 1,
      type: "Color" as const,
    },
    ambientLight: {
      color: {
        type: "Color" as const,
        opacity: 1,
        value: 1,
      },
      intensity: {
        type: "Number" as const,
        interpolable: false,
        value: 2,
      },
    },
    directionalLight: {
      color: {
        type: "Color" as const,
        opacity: 1,
        value: 1,
      },
      intensity: {
        type: "Number" as const,
        interpolable: false,
        value: 2,
      },
      position: {
        type: "Vector" as const,
        value: [],
      },
    },
  };

  ambientLight = new AmbientLightConfig(this._list, this._component);

  directionalLight = new DirectionalLightConfig(this._list, this._component);

  get backgroundColor() {
    return this._list.backgroundColor.value;
  }

  set backgroundColor(value: number) {
    this._list.backgroundColor.value = value;
    this._component.three.background = new THREE.Color(value);
  }
}
