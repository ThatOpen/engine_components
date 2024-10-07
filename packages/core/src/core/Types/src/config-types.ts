import * as THREE from "three";

export interface BooleanSettingsControl {
  type: "Boolean";
  value: boolean;
}

export interface ColorSettingsControl {
  type: "Color";
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
  multiple: boolean;
  options: Set<string>;
  value: string;
}

export interface Vector3SettingControl {
  type: "Vector3";
  value: THREE.Vector3;
}

export interface TextSetSettingControl {
  type: "TextSet";
  value: Set<string>;
}

export interface NoControl {
  type: "None";
  value: any;
}

export type ControlEntry =
  | BooleanSettingsControl
  | ColorSettingsControl
  | TextSettingsControl
  | NumberSettingControl
  | SelectSettingControl
  | Vector3SettingControl
  | TextSetSettingControl
  | NoControl;

export interface ControlsSchema {
  [name: string]: ControlEntry | ControlsSchema;
}
