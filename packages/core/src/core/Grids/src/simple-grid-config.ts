import * as THREE from "three";
import {
  BooleanSettingsControl,
  ColorSettingsControl,
  NumberSettingControl,
} from "../../Types";
import { Configurator } from "../../ConfigManager";
import { SimpleGrid } from "./simple-grid";

type SimpleGridConfigType = {
  visible: BooleanSettingsControl;
  color: ColorSettingsControl;
  primarySize: NumberSettingControl;
  secondarySize: NumberSettingControl;
  distance: NumberSettingControl;
};

/**
 * Configuration interface for the {@link SimpleGrid}.
 */
export interface SimpleGridConfig {
  /**
   * The color of the grid lines.
   */
  color: THREE.Color;

  /**
   * The size of the primary grid lines.
   */
  primarySize: number;

  /**
   * The size of the secondary grid lines.
   */
  secondarySize: number;

  /**
   * The distance at which the grid lines start to fade away.
   */
  distance: number;
}

export class SimpleGridConfigManager extends Configurator<
  SimpleGrid,
  SimpleGridConfigType
> {
  protected _config: SimpleGridConfigType = {
    visible: {
      value: true,
      type: "Boolean" as const,
    },
    color: {
      value: new THREE.Color() as THREE.Color,
      type: "Color" as const,
    },
    primarySize: {
      type: "Number" as const,
      interpolable: true,
      value: 1,
      min: 0,
      max: 1000,
    },
    secondarySize: {
      type: "Number" as const,
      interpolable: true,
      value: 10,
      min: 0,
      max: 1000,
    },
    distance: {
      type: "Number" as const,
      interpolable: true,
      value: 500,
      min: 0,
      max: 500,
    },
  };

  get visible() {
    return this._config.visible.value;
  }

  set visible(value: boolean) {
    this._config.visible.value = value;
    this._component.visible = value;
  }

  get color() {
    return this._config.color.value;
  }

  set color(value: THREE.Color) {
    this._config.color.value = value;
    this._component.material.uniforms.uColor.value = value;
    this._component.material.uniformsNeedUpdate = true;
  }

  get primarySize() {
    return this._config.primarySize.value;
  }

  set primarySize(value: number) {
    this._config.primarySize.value = value;
    this._component.material.uniforms.uSize1.value = value;
    this._component.material.uniformsNeedUpdate = true;
  }

  get secondarySize() {
    return this._config.secondarySize.value;
  }

  set secondarySize(value: number) {
    this._config.secondarySize.value = value;
    this._component.material.uniforms.uSize2.value = value;
    this._component.material.uniformsNeedUpdate = true;
  }

  get distance() {
    return this._config.distance.value;
  }

  set distance(value: number) {
    this._config.distance.value = value;
    this._component.material.uniforms.uDistance.value = value;
    this._component.material.uniformsNeedUpdate = true;
  }
}
