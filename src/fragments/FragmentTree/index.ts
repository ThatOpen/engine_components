import { Component, UI } from "../../base-types";
import { TreeView } from "../../ui";
import { FragmentTreeItem } from "./tree-item";
import { Fragments } from "../index";
import { Components } from "../../core";

export class ModelTree extends Component<FragmentTreeItem> implements UI {
  uiElement: TreeView;
  name: string;
  enabled: boolean = true;
  components: Components;
  groupSystemNames: string[];
  functionsMap: { [groupSystemName: string]: () => void } = {};
  fragments: Fragments;

  private readonly _tree: FragmentTreeItem;

  constructor(
    components: Components,
    name: string,
    groupSystemNames: string[]
  ) {
    super();
    this.components = components;
    const fragments = components.tools.get("Fragments") as
      | Fragments
      | undefined;
    if (!fragments) {
      throw new Error(
        "ModelTree needs Fragments in order to work properly. Try const fragments = new Fragments(components) and then components.tools.add(fragments)."
      );
    }
    this.fragments = fragments;
    this.name = name;
    this.groupSystemNames = groupSystemNames;
    this._tree = new FragmentTreeItem(this.components, this.name);
    this.uiElement = this._tree.uiElement;
  }

  get(): FragmentTreeItem {
    return this._tree;
  }

  build() {
    this._tree.children = this.#process(this.groupSystemNames);
    return this.get();
  }

  // TODO: Check more in detail this update method.
  update() {
    this.uiElement.dispose();
    this._tree.uiElement.dispose();
    this.build();
    return this.get();
  }

  #process(groupSystemNames: string[], result = {}) {
    const groups: FragmentTreeItem[] = [];
    if (!this.fragments) {
      return groups;
    }
    const currentSystemName = groupSystemNames[0]; // storeys
    const systemGroups = this.fragments.groups.groupSystems[currentSystemName];
    if (!currentSystemName || !systemGroups) {
      return groups;
    }
    for (const name in systemGroups) {
      // name is N00, N01, N02...
      const filter = { ...result, [currentSystemName]: name }; // { storeys: "N00" }, { storeys: "N01" }...
      const hasElements =
        Object.keys(this.fragments.groups.get(filter)).length > 0;
      if (hasElements) {
        const treeItemName =
          currentSystemName[0].toUpperCase() + currentSystemName.slice(1); // Storeys
        const treeItem = new FragmentTreeItem(
          this.components,
          `${treeItemName}: ${name}`
        ); // Storeys: N01
        treeItem.filter = filter;
        groups.push(treeItem);
        treeItem.children = this.#process(groupSystemNames.slice(1), filter);
      }
    }
    return groups;
  }
}
