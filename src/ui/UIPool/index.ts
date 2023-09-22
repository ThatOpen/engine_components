import { Component } from "../../base-types";
import { Components } from "../../core";
import { SimpleUIComponent } from "../SimpleUIComponent";

type UIClass<T extends SimpleUIComponent> = new (
  components: Components,
  ...args: any[]
) => T;

export class UIPool<T extends SimpleUIComponent> extends Component<T> {
  name: string = "UIPool";
  enabled: boolean = true;
  list: T[] = [];

  private _components: Components;
  private _uiClass: UIClass<T>;

  constructor(components: Components, uiClass: UIClass<T>) {
    super(components);
    this._components = components;
    this._uiClass = uiClass;
  }

  return(element: T) {
    if (element.parent) {
      element.parent.removeChild(element);
    }
    this.list.push(element);
  }

  get() {
    if (this.list.length > 0) {
      return this.list.pop()!;
    }
    return new this._uiClass(this._components);
  }
}
