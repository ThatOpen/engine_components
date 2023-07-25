import { UIComponent } from "../../base-types";
import { Component } from "../../base-types/component";
import { Components } from "../../core";

type UIClass<T extends UIComponent> = new (
  components: Components,
  ...args: any[]
) => T;

export class UIPool<T extends UIComponent> extends Component<T> {
  name: string = "UIPool";
  enabled: boolean = true;
  list: T[] = [];

  private _components: Components;
  private _uiClass: UIClass<T>;

  constructor(components: Components, uiClass: UIClass<T>) {
    super();
    this._components = components;
    this._uiClass = uiClass;
  }

  return(element: T) {
    // @ts-ignore
    element.parent?.removeChild(element);
    this.list.push(element);
    console.log("Pool element returned");
  }

  get() {
    if (this.list.length > 0) {
      const existingUI = this.list.pop()!;
      console.log("Pool element taken");
      return existingUI;
    }
    const newUI = new this._uiClass(this._components);
    console.log("Pool element created");
    return newUI;
  }
}
