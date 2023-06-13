import { Component, UI } from "../../base-types";
import { TreeView } from "../../ui";
import { FragmentTreeItem } from "./tree-item";
import { Components } from "../../core";
import { FragmentGrouper } from "../FragmentGrouper";
import { FragmentHighlighter } from "../FragmentHighlighter";

export class FragmentTree extends Component<FragmentTreeItem> implements UI {
  uiElement: TreeView;
  name: string;
  enabled: boolean = true;
  private _components: Components;
  groupSystemNames: string[];
  functionsMap: { [groupSystemName: string]: () => void } = {};

  private readonly _tree: FragmentTreeItem;

  constructor(
    components: Components,
    private _fragmentHighlighter: FragmentHighlighter,
    private _fragmentGrouper: FragmentGrouper,
    name: string,
    groupSystemNames: string[]
  ) {
    super();
    this._components = components;
    this.name = name;
    this.groupSystemNames = groupSystemNames;

    this._tree = new FragmentTreeItem(
      this._components,
      this._fragmentHighlighter,
      this._fragmentGrouper,
      this.name
    );
    this.uiElement = this._tree.uiElement;
  }

  get(): FragmentTreeItem {
    return this._tree;
  }

  build() {
    this._tree.children = this.process(this.groupSystemNames);
    return this.get();
  }

  // TODO: Check more in detail this update method.
  update() {
    this.uiElement.dispose();
    this._tree.uiElement.dispose();
    this.build();
    return this.get();
  }

  private process(groupSystemNames: string[], result = {}) {
    const groups: FragmentTreeItem[] = [];
    const currentSystemName = groupSystemNames[0]; // storeys
    const systems = this._fragmentGrouper.get();
    const systemGroups = systems[currentSystemName];
    if (!currentSystemName || !systemGroups) {
      return groups;
    }
    for (const name in systemGroups) {
      // name is N00, N01, N02...
      const filter = { ...result, [currentSystemName]: name }; // { storeys: "N00" }, { storeys: "N01" }...
      const hasElements =
        Object.keys(this._fragmentGrouper.find(filter)).length > 0;
      if (hasElements) {
        const treeItemName =
          currentSystemName[0].toUpperCase() + currentSystemName.slice(1); // Storeys
        const treeItem = new FragmentTreeItem(
          this._components,
          this._fragmentHighlighter,
          this._fragmentGrouper,
          `${treeItemName}: ${name}`
        ); // Storeys: N01
        treeItem.filter = filter;
        groups.push(treeItem);
        treeItem.children = this.process(groupSystemNames.slice(1), filter);
      }
    }
    return groups;
  }
}
