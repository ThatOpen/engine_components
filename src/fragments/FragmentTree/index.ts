import { Component, Event, UI } from "../../base-types";
import { FragmentTreeItem } from "./src/tree-item";
import { Components } from "../../core";
import { FragmentClassifier } from "../FragmentClassifier";

export class FragmentTree extends Component<FragmentTreeItem> implements UI {
  name = "FragmentTree";
  title = "Model Tree";
  enabled: boolean = true;

  selected = new Event<{ [name: string]: string[] }>();
  hovered = new Event<{ [name: string]: string[] }>();

  private _components: Components;
  private _classifier: FragmentClassifier;
  private _tree: FragmentTreeItem;

  get uiElement() {
    return this._tree.uiElement;
  }

  constructor(components: Components, classifier: FragmentClassifier) {
    super();
    this._components = components;
    this._classifier = classifier;
    this._tree = new FragmentTreeItem(this._components, classifier, this.title);
  }

  get(): FragmentTreeItem {
    return this._tree;
  }

  update(groupSystems: string[]) {
    if (this._tree.children.length) {
      this._tree.dispose();
      this._tree = new FragmentTreeItem(
        this._components,
        this._classifier,
        this.title
      );
    }
    this._tree.children = this.regenerate(groupSystems);
    return this.get();
  }

  private regenerate(groupSystemNames: string[], result = {}) {
    const groups: FragmentTreeItem[] = [];
    const currentSystemName = groupSystemNames[0]; // storeys
    const systems = this._classifier.get();
    const systemGroups = systems[currentSystemName];
    if (!currentSystemName || !systemGroups) {
      return groups;
    }
    for (const name in systemGroups) {
      // name is N00, N01, N02...
      // { storeys: "N00" }, { storeys: "N01" }...
      const filter = { ...result, [currentSystemName]: [name] };
      const found = this._classifier.find(filter);
      const hasElements = Object.keys(found).length > 0;
      if (hasElements) {
        const firstLetter = currentSystemName[0].toUpperCase();
        const treeItemName = firstLetter + currentSystemName.slice(1); // Storeys

        const treeItem = new FragmentTreeItem(
          this._components,
          this._classifier,
          `${treeItemName}: ${name}`
        );

        treeItem.hovered.on((result) => this.hovered.trigger(result));
        treeItem.selected.on((result) => this.selected.trigger(result));

        treeItem.filter = filter;
        groups.push(treeItem);
        treeItem.children = this.regenerate(groupSystemNames.slice(1), filter);
      }
    }
    return groups;
  }
}
