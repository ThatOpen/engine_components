import { Hideable, UIComponent, Event } from "../../base-types/base-types";
import { Component } from "../../base-types/component";
import { Components } from "../../core/Components";
import { tooeenRandomId } from "../../utils";

export class SimpleUIComponent<T extends HTMLElement = HTMLElement>
  extends Component<T>
  implements UIComponent, Hideable
{
  name: string = "SimpleUIComponent";
  domElement: T;
  children: UIComponent[] = [];
  components: Components;
  id: string;
  onVisible: Event<T> = new Event();
  onHidden: Event<T> = new Event();
  onEnabled: Event<T> = new Event();
  onDisabled: Event<T> = new Event();

  protected _enabled: boolean = true;
  protected _visible: boolean = true;
  protected _active: boolean = false;

  get active() {
    return this._active;
  }
  set active(active: boolean) {
    this.domElement.setAttribute("data-active", String(active));
    this._active = active;
  }

  get visible() {
    return this._visible;
  }

  set visible(value: boolean) {
    this._visible = value;
    if (value) {
      this.domElement.classList.remove("hidden");
      this.onVisible.trigger(this.get());
    } else {
      this.domElement.classList.add("hidden");
      this.onHidden.trigger(this.get());
    }
    // this.onVisibilityChanged.trigger(value);
  }

  get enabled() {
    return this._enabled;
  }

  set enabled(value: boolean) {
    this._enabled = value;
    if (value) {
      this.onEnabled.trigger(this.get());
    } else {
      this.onDisabled.trigger(this.get());
    }
    // this.onVisibilityChanged.trigger(value);
  }

  get hasElements() {
    return this.children.length > 0;
  }

  constructor(components: Components, domElement: T, id?: string) {
    super();
    this.components = components;
    this.id = id ?? tooeenRandomId();
    domElement.id = this.id;
    this.domElement = domElement;
  }

  get(): T {
    return this.domElement;
  }

  dispose(onlyChildren = false) {
    this.children.forEach((child) => child.dispose());
    if (!onlyChildren) {
      this.domElement.remove();
    }
  }

  addChild(...items: UIComponent[]) {
    items.forEach((item) => {
      this.children.push(item);
      this.domElement.append(item.domElement);
    });
  }

  // htmlToElement(htmlString: string) {
  //   const template = document.createElement("template");
  //   htmlString = htmlString.trim();
  //   template.innerHTML = htmlString;
  //   return template.content.firstChild;
  // }
}
