export interface BooleanSettingsControl {
  type: "Boolean";
  value: boolean;
}

export interface ColorSettingsControl {
  type: "Color";
  opacity: number;
  value: number;
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
  options?: string[];
  value: string;
}

export interface VectorSettingControl {
  type: "Vector";
  value: number[];
}

type ControlEntry =
  | BooleanSettingsControl
  | ColorSettingsControl
  | TextSettingsControl
  | NumberSettingControl
  | SelectSettingControl
  | VectorSettingControl;

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
