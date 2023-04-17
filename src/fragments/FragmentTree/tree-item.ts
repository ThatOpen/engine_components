import { Component, UI } from "../../base-types";
import { TreeView } from "../../ui";
import { Fragments } from "../index";
import { Components } from "../../core";

interface TreeItem {
  name: string;
  filter: { [groupSystemName: string]: string };
  children: TreeItem[];
}

export class FragmentTreeItem extends Component<TreeItem> implements UI {
  name: string;
  enabled: boolean = true;
  filter: { [groupSystemName: string]: string } = {};
  #children: FragmentTreeItem[] = [];
  components: Components;
  uiElement: TreeView;
  fragments: Fragments;

  get children() {
    return this.#children;
  }

  set children(children: FragmentTreeItem[]) {
    this.#children = children;
    children.forEach((child) => this.uiElement.addChild(child.uiElement));
  }

  constructor(components: Components, name: string) {
    super();
    this.components = components;
    const fragments = components.tools.get("Fragments") as
      | Fragments
      | undefined;
    if (!fragments) {
      throw new Error();
    }
    this.fragments = fragments;
    this.name = name;
    this.uiElement = new TreeView(this.components, name);
    this.uiElement.onclick = () => this.select();
    this.uiElement.onmouseover = () => this.highlight();
  }

  get(): TreeItem {
    return { name: this.name, filter: this.filter, children: this.children };
  }

  select() {
    if (!this.fragments) {
      return;
    }
    const highlighter = this.fragments.highlighter;
    const groups = this.fragments.groups;
    highlighter.highlightByID("select", groups.get(this.filter));
  }

  highlight() {
    if (!this.fragments) {
      return;
    }
    const highlighter = this.fragments.highlighter;
    const groups = this.fragments.groups;
    highlighter.highlightByID("highlight", groups.get(this.filter));
  }
}
