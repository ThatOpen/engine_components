import { Components } from "../../../../core/Components";
import { UIComponentsStack } from "../../../../ui";
import { TreeView } from "../../../../ui/TreeView";
import { Property } from "./Property";

export class PropertyGroup {
  properties: Property[] = [];
  groups: PropertyGroup[] = [];
  custom: boolean = false;
  editable: boolean = true;
  buttons: UIComponentsStack | null = null;
  private _components: Components;
  private _uiElement: TreeView | null = null;
  private _name: string | null = null;
  private _description: string | null = null;

  set description(value: string | null) {
    this._description = value;
    if (this._uiElement) {
      this.uiElement.titleElement.description = value;
    }
  }

  get description() {
    return this._description;
  }

  set name(value: string | null) {
    this._name = value;
    if (this._uiElement) {
      this.uiElement.titleElement.title = value;
    }
  }

  get name() {
    return this._name;
  }

  get uiElement() {
    if (!this._uiElement) {
      const treeView = new TreeView(this._components);
      treeView.titleElement.title = this.name;
      treeView.titleElement.description = this.description;
      treeView.get().addEventListener("mouseenter", () => {
        if (this.buttons && this.editable) {
          treeView.titleElement.rightContainer.get().append(this.buttons.get());
        }
        treeView.titleElement.rightContainer.visible = true;
        treeView.titleElement.get().classList.add("bg-ifcjs-120");
      });
      treeView.get().addEventListener("mouseleave", () => {
        if (treeView.expanded) {
          treeView.titleElement.get().classList.add("bg-ifcjs-120");
          return;
        }
        treeView.titleElement.get().classList.remove("bg-ifcjs-120");
        treeView.titleElement.rightContainer.visible = false;
        this.buttons?.get().remove();
      });
      this._uiElement = treeView;
      this.appendProperties();
    }
    return this._uiElement;
  }

  private appendProperties() {
    if (!this._uiElement) {
      return;
    }
    for (const property of this.properties) {
      this._uiElement.addChild(property.uiElement);
    }
  }

  constructor(components: Components, name: string) {
    this._components = components;
    this.name = name;
  }

  getPropertyByName(name: string) {
    return this.properties.find((property) => property.name === name);
  }

  addProperty(property: Property) {
    const existingProperty = this.properties.find(
      (prop) => prop.name === property.name
    );
    if (!existingProperty) {
      this.properties.push(property);
      this.appendProperties();
    }
  }
}
