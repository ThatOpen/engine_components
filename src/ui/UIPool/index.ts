import { Component } from "../../base-types/component";
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
