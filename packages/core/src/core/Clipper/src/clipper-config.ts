import * as THREE from "three";
import {
  BooleanSettingsControl,
  ColorSettingsControl,
  NumberSettingControl,
} from "../../Types";
import { Configurator } from "../../ConfigManager";
import { Clipper } from "../index";

type ClipperConfigType = {
  enabled: BooleanSettingsControl;
  visible: BooleanSettingsControl;
  color: ColorSettingsControl;
  opacity: NumberSettingControl;
  size: NumberSettingControl;
};

/**
 * Configuration interface for the {@link Clipper}.
 */
export interface ClipperConfig {
  color: THREE.Color;
  opacity: number;
  size: number;
}

export class ClipperConfigManager extends Configurator<
  Clipper,
  ClipperConfigType
> {
  protected _config: ClipperConfigType = {
    enabled: {
      value: true,
      type: "Boolean" as const,
    },
    visible: {
      value: true,
      type: "Boolean" as const,
    },
    color: {
      value: new THREE.Color() as THREE.Color,
      type: "Color" as const,
    },
    opacity: {
      type: "Number" as const,
      interpolable: true,
      value: 1,
      min: 0,
      max: 1,
    },
    size: {
      type: "Number" as const,
      interpolable: true,
      value: 2,
      min: 0,
      max: 100,
    },
  };

  get enabled() {
    return this._config.enabled.value;
  }

  set enabled(value: boolean) {
    this._config.enabled.value = value;
    this._component.enabled = value;
  }

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
    this._component.material.color.copy(value);
  }

  get opacity() {
    return this._config.opacity.value;
  }

  set opacity(value: number) {
    this._config.opacity.value = value;
    this._component.material.opacity = value;
  }

  get size() {
    return this._config.size.value;
  }

  set size(value: number) {
    this._config.size.value = value;
    this._component.size = value;
  }
}
