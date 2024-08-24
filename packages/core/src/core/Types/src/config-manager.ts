import * as THREE from "three";

export interface BooleanSettingsControl {
  type: "Boolean";
  value: boolean;
}

export interface ColorSettingsControl {
  type: "Color";
  opacity: number;
  value: THREE.Color;
}

export interface TextSettingsControl {
  type: "Text";
  value: string;
}

export interface NumberSettingControl {
  type: "Number";
  interpolable: boolean;
  min?: number;
  max?: number;
  value: number;
}

export interface SelectSettingControl {
  type: "Select";
  options: Set<string>;
  value: string;
}

export interface MultiSelectSettingControl {
  type: "MultiSelect";
  options: Set<string>;
  value: Set<string>;
}

export interface Vector3SettingControl {
  type: "Vector";
  value: THREE.Vector3;
}

export interface TextSetSettingControl {
  type: "TextSet";
  value: Set<string>;
}

type ControlEntry =
  | BooleanSettingsControl
  | ColorSettingsControl
  | TextSettingsControl
  | NumberSettingControl
  | SelectSettingControl
  | Vector3SettingControl
  | TextSetSettingControl
  | MultiSelectSettingControl;

interface ControlsSchema {
  [name: string]: ControlEntry | ControlsSchema;
}

export abstract class ConfigManager<T, U extends ControlsSchema> {
  protected abstract _list: U;

  protected _component: T;

  get controls() {
    return JSON.parse(JSON.stringify(this._list));
  }

  constructor(component: T) {
    this._component = component;
  }
}
