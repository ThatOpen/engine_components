import { Components } from "../../../../core/Components";
import { PropertyTag } from "../property-tag";

export class Property {
  custom: boolean = false;
  editable: boolean = true;
  private _components: Components;
  private _uiElement: PropertyTag | null = null;
  private _name: string | null = null;
  private _value: string | boolean | number | null = null;

  get uiElement() {
    if (!this._uiElement) {
      const tag = new PropertyTag(this._components);
      tag.label = this.name;
      tag.value = this.value;
      this._uiElement = tag;
    }
    return this._uiElement;
  }

  get name() {
    return this._name;
  }

  set name(value: string | null) {
    this._name = value;
    if (this._uiElement) {
      this.uiElement.label = value;
    }
  }

  get value() {
    return this._value;
  }

  set value(value: string | number | boolean | null) {
    this._value = value;
    if (this._uiElement) {
      this.uiElement.value = value;
    }
  }

  constructor(
    components: Components,
    name: string,
    value: string | boolean | number
  ) {
    this._components = components;
    this.name = name;
    this.value = value;
  }
}
