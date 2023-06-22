import { Components } from "../../../../core/Components";
import { PropertyGroup } from "./PropertyGroup";

export class ElementPropertiesManager {
  expressID: number;
  propertyGroups: PropertyGroup[] = [];
  editable: boolean = true;
  private _components: Components;

  constructor(components: Components, expressID: number) {
    this._components = components;
    this.expressID = expressID;
  }

  getGroupByName(name: string) {
    return this.propertyGroups.find((group) => group.name === name);
  }

  addGroup(group: PropertyGroup) {
    const existingGroup = this.propertyGroups.find(
      (prop) => prop.name === group.name
    );
    if (!existingGroup) {
      this.propertyGroups.push(group);
    }
  }

  removeGroup(group: PropertyGroup) {}
}
