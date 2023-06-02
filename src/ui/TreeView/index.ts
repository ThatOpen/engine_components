import { UIComponent } from "../../base-types/base-types";
import { Component } from "../../base-types/component";
import { Components } from "../../core";
import { VerticalStack } from "../VerticalStack";

export class TreeView extends Component<HTMLElement> implements UIComponent {
  name: string;
  enabled: boolean = true;
  visible: boolean = true;
  components: Components;
  domElement: HTMLElement = document.createElement("div");
  children: UIComponent[] = [];
  private _childrenContainer: VerticalStack;
  private _expanded: boolean = false;

  get expanded() {
    return this._expanded;
  }

  set expanded(expanded: boolean) {
    this._expanded = expanded;
    this._childrenContainer.visible = expanded;
  }

  set onclick(listener: (e?: MouseEvent) => void) {
    this.domElement.onclick = (e) => {
      e.stopImmediatePropagation();
      listener(e);
    };
  }

  set onmouseover(listener: (e?: MouseEvent) => void) {
    this.domElement.onmouseover = (e) => {
      e.stopImmediatePropagation();
      listener(e);
    };
  }

  constructor(components: Components, name: string) {
    super();
    this.components = components;
    this.name = name;

    this.domElement.className = "tooeen-tree-item";

    const div = document.createElement("div");
    div.className = "tooeen-tree-item-title";
    const arrow = document.createElement("span");
    arrow.onclick = () => this.toggle();
    arrow.className = "material-icons";
    arrow.innerText = "arrow_right";
    const p = document.createElement("p");
    p.innerText = name;
    div.append(arrow, p);
    this.domElement.append(div);

    this._childrenContainer = new VerticalStack(components);
    this._childrenContainer.get().classList.add("ml-[14px]");
    this.domElement.append(this._childrenContainer.get());
  }

  get(): HTMLElement {
    return this.domElement;
  }

  dispose(onlyChildren = false) {
    this.children.forEach((child) => child.dispose());
    if (!onlyChildren) {
      this.domElement.remove();
      this._childrenContainer.dispose();
    }
  }

  toggle(deep = false) {
    if (deep) {
      if (this.expanded) {
        this.collapse();
      } else {
        this.expand();
      }
    } else {
      this.expanded = !this.expanded;
    }
  }

  addChild(...items: UIComponent[]) {
    items.forEach((item) => {
      this.children.push(item);
      this._childrenContainer.addChild(item);
    });
  }

  collapse(deep = true) {
    this.expanded = false;
    if (deep) {
      this.children.forEach((child) => {
        if (child instanceof TreeView) {
          child.collapse(deep);
        }
      });
    }
  }

  expand(deep = true) {
    this.expanded = true;
    if (deep) {
      this.children.forEach((child) => {
        if (child instanceof TreeView) {
          child.expand(deep);
        }
      });
    }
  }
}
