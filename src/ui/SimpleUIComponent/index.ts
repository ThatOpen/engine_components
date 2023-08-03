import {
  Hideable,
  // UIComponent,
  Event,
  Disposable,
} from "../../base-types/base-types";
import { Component } from "../../base-types/component";
import { Components } from "../../core/Components";
import { tooeenRandomId } from "../../utils";

export class SimpleUIComponent<T extends HTMLElement = HTMLElement>
  extends Component<T>
  implements Hideable, Disposable
{
  name: string = "SimpleUIComponent";
  domElement: T;
  children: SimpleUIComponent[] = [];
  id: string;
  data: Record<string, any> = {};

  // Slots are other UIComponents that inherits all the logic from SimpleUIComponent
  slots: { [name: string]: SimpleUIComponent } = {};

  // InnerElements are those HTML Elements which doesn't come from an UIComponent.
  innerElements: { [name: string]: HTMLElement } = {};

  static Class: { Base: string; [elementName: string]: string };

  readonly onVisible = new Event();
  readonly onHidden = new Event();
  readonly onEnabled = new Event();
  readonly onDisabled = new Event();

  protected _components: Components;
  protected _parent: SimpleUIComponent<HTMLElement> | null = null;
  protected _enabled: boolean = true;
  protected _visible: boolean = true;
  protected _active: boolean = false;

  set parent(value: SimpleUIComponent<HTMLElement> | null) {
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

  private set template(value: string) {
    const regex = /id="([^"]+)"/g;
    const template = value.replace(regex, `id="$1-${this.id}"`);
    this.domElement.innerHTML = template;
    const el = this.domElement.firstElementChild as HTMLElement;
    el.id = this.id;
    // @ts-ignore
    this.domElement = el;
  }

  constructor(components: Components, template?: string, id?: string) {
    super();
    this._components = components;
    this.id = id ?? tooeenRandomId();
    // @ts-ignore
    this.domElement = document.createElement("div");
    this.template = template ?? "<div></div>";
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

  addChild(...items: SimpleUIComponent[]) {
    for (const item of items) {
      this.children.push(item);
      this.domElement.append(item.domElement);
      item.parent = this;
    }
  }

  removeChild(...items: SimpleUIComponent[]) {
    for (const item of items) {
      item.domElement.remove();
      item.parent = null;
    }
    const filtered = this.children.filter((child) => !items.includes(child));
    this.children = filtered;
  }

  removeFromParent() {
    if (!this.parent) return;
    this.get().removeAttribute("data-tooeen-slot");
    this.parent.removeChild(this);
  }

  getInnerElement<T extends HTMLElement>(id: string) {
    return this.get().querySelector(`#${id}-${this.id}`) as T | null;
  }

  setSlot(name: string, uiComponent: SimpleUIComponent) {
    const slot = this.get().querySelector(`[data-tooeen-slot="${name}"]`);
    if (!slot)
      throw new Error(
        `Slot ${name} not found. You need to declare it in the UIComponent template using data-tooeen="${name}"`
      );
    const existingSlot = this.slots[name];
    if (existingSlot) existingSlot.removeFromParent();
    this.slots[name] = uiComponent;
    uiComponent.get().setAttribute("data-tooeen-slot", name);
    slot.replaceWith(uiComponent.get());
    this.children.push(uiComponent);
  }

  setSlots() {
    for (const name in this.slots) {
      const component = this.slots[name];
      this.setSlot(name, component);
    }
  }
}
