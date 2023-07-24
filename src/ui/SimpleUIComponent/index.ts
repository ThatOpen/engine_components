import { Hideable, UIComponent, Event } from "../../base-types/base-types";
import { Component } from "../../base-types/component";
import { Components } from "../../core/Components";
import { tooeenRandomId } from "../../utils/utils";

export class SimpleUIComponent<T extends HTMLElement = HTMLElement>
  extends Component<T>
  implements UIComponent, Hideable
{
  name: string = "SimpleUIComponent";
  domElement: T;
  children: UIComponent[] = [];
  id: string;
  data: Record<string, any> = {};

  static readonly Class: { Base: string; [elementName: string]: string };

  readonly onVisible: Event<T> = new Event();
  readonly onHidden: Event<T> = new Event();
  readonly onEnabled: Event<T> = new Event();
  readonly onDisabled: Event<T> = new Event();

  protected _components: Components;
  protected _parent: UIComponent | null = null;
  protected _enabled: boolean = true;
  protected _visible: boolean = true;
  protected _active: boolean = false;

  set parent(value: UIComponent | null) {
    this._parent = value;
  }

  get parent() {
    return this._parent;
  }

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
    this._components = components;
    this.id = id ?? tooeenRandomId();
    this.domElement = domElement ?? document.createElement("div");
    this.domElement.id = this.id;
  }

  cleanData() {
    this.data = {};
  }

  get(): T {
    return this.domElement;
  }

  dispose(onlyChildren = false) {
    this.children.forEach((child) => {
      child.dispose();
      this.removeChild(child);
    });
    if (!onlyChildren) this.domElement.remove();
  }

  addChild(...items: UIComponent[]) {
    for (const item of items) {
      this.children.push(item);
      this.domElement.append(item.domElement);
      if (item instanceof SimpleUIComponent) item.parent = this;
    }
  }

  removeChild(...items: UIComponent[]) {
    for (const item of items) {
      item.domElement.remove();
      if (item instanceof SimpleUIComponent) item.parent = null;
    }
    const filtered = this.children.filter((child) => !items.includes(child));
    this.children = filtered;
  }

  // htmlToElement(htmlString: string) {
  //   const template = document.createElement("template");
  //   htmlString = htmlString.trim();
  //   template.innerHTML = htmlString;
  //   return template.content.firstChild;
  // }
}
