import {
  ControlsSchema,
  ControlEntry,
  BooleanSettingsControl,
  ColorSettingsControl,
  TextSettingsControl,
  NumberSettingControl,
  SelectSettingControl,
  Vector3SettingControl,
  TextSetSettingControl,
  NoControl,
} from "../../Types";
import { Components } from "../../Components";
import { ConfigManager } from "../index";
import { UUID } from "../../../utils";

export abstract class Configurator<T, U extends ControlsSchema> {
  protected abstract _config: U;

  protected _component: T;

  name: string;

  uuid: string;

  get controls(): U {
    const copy: any = {};
    for (const name in this._config) {
      const entry = this._config[name] as ControlEntry;
      copy[name] = this.copyEntry(entry);
    }
    return copy as U;
  }

  constructor(
    component: T,
    components: Components,
    name: string,
    uuid?: string,
  ) {
    this._component = component;
    this.name = name;
    this.uuid = uuid ?? UUID.create();
    const configManager = components.get(ConfigManager);
    configManager.list.set(this.uuid, this);
  }

  copyEntry(controlEntry: ControlEntry): ControlEntry {
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
