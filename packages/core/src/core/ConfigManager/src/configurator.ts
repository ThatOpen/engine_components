import * as THREE from "three";
import { ControlsSchema, ControlsUtils } from "../../Types";
import { Components } from "../../Components";
import { ConfigManager } from "../index";
import { UUID } from "../../../utils";

export abstract class Configurator<
  T = any,
  U extends ControlsSchema = ControlsSchema,
> {
  protected abstract _config: U;

  protected _component: T;

  name: string;

  uuid: string;

  get controls(): U {
    return ControlsUtils.copySchema(this._config);
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

  set(data: Partial<U>) {
    for (const name in data) {
      if (name in this) {
        const key = name as keyof this;
        this[key] = (data[name] as any).value;
      }
    }
  }

  export(controls = this._config as ControlsSchema, exported: any = {}) {
    for (const id in controls) {
      const control = controls[id];
      const isControl = ControlsUtils.isEntry(control);
      if (isControl) {
        if (control.type === "Color") {
          const { r, g, b } = control.value;
          exported[id] = { ...control, value: { r, g, b } };
        } else if (control.type === "Vector3") {
          const { x, y, z } = control.value;
          exported[id] = { ...control, value: { x, y, z } };
        } else if (control.type === "TextSet") {
          const value = Array.from(control.value);
          exported[id] = { ...control, value };
        } else if (control.type === "Select") {
          const options = Array.from(control.options);
          exported[id] = { ...control, options };
        } else {
          exported[id] = { ...control };
        }
      } else {
        exported[id] = {};
        this.export(control as ControlsSchema, exported[id]);
      }
    }

    return exported;
  }

  import(exported: any, imported: any = {}, first = true) {
    for (const id in exported) {
      const control = exported[id];
      const isControl = ControlsUtils.isEntry(control);
      if (isControl) {
        if (control.type === "Color") {
          const { r, g, b } = control.value;
          imported[id] = { ...control, value: new THREE.Color(r, g, b) };
        } else if (control.type === "Vector3") {
          const { x, y, z } = control.value;
          imported[id] = { ...control, value: new THREE.Vector3(x, y, z) };
        } else if (control.type === "TextSet") {
          imported[id] = { ...control, value: new Set(control.value) };
        } else if (control.type === "Select") {
          imported[id] = { ...control, options: new Set(control.options) };
        } else {
          imported[id] = { ...control };
        }
      } else {
        imported[id] = {};
        this.import(control, imported[id], false);
      }
    }

    if (first) {
      this.set(imported);
    }
  }
}
