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

export class ControlsUtils {
  static isEntry(item: any) {
    const types = new Set([
      "Boolean",
      "Color",
      "Text",
      "Number",
      "Select",
      "Vector3",
      "TextSet",
      "None",
    ]);
    return types.has(item.type);
  }

  static copySchema<T extends ControlsSchema = ControlsSchema>(
    schema: T,
    copy: ControlsSchema = {},
  ) {
    for (const name in schema) {
      const entry = schema[name];
      if (this.isEntry(entry)) {
        copy[name] = this.copyEntry(entry as ControlEntry);
      } else {
        copy[name] = {};
        this.copySchema(entry as ControlsSchema, copy[name] as ControlsSchema);
      }
    }
    return copy as T;
  }

  static copyEntry(controlEntry: ControlEntry): ControlEntry {
    if (controlEntry.type === "Boolean") {
      const entry = controlEntry as BooleanSettingsControl;
      return {
        type: entry.type,
        value: entry.value,
      };
    }
    if (controlEntry.type === "Color") {
      const entry = controlEntry as ColorSettingsControl;
      return {
        type: entry.type,
        value: entry.value.clone(),
      };
    }
    if (controlEntry.type === "Text") {
      const entry = controlEntry as TextSettingsControl;
      return {
        type: entry.type,
        value: entry.value,
      };
    }
    if (controlEntry.type === "Number") {
      const entry = controlEntry as NumberSettingControl;
      return {
        type: entry.type,
        value: entry.value,
        min: entry.min,
        max: entry.max,
        interpolable: entry.interpolable,
      };
    }
    if (controlEntry.type === "Select") {
      const entry = controlEntry as SelectSettingControl;
      return {
        type: entry.type,
        value: entry.value,
        multiple: entry.multiple,
        options: new Set(entry.options),
      };
    }
    if (controlEntry.type === "Vector3") {
      const entry = controlEntry as Vector3SettingControl;
      return {
        type: entry.type,
        value: entry.value.clone(),
      };
    }
    if (controlEntry.type === "TextSet") {
      const entry = controlEntry as TextSetSettingControl;
      return {
        type: entry.type,
        value: new Set(entry.value),
      };
    }
    if (controlEntry.type === "None") {
      const entry = controlEntry as NoControl;
      return {
        type: entry.type,
        value: entry.value,
      };
    }
    throw new Error("Invalid entry!");
  }
}
