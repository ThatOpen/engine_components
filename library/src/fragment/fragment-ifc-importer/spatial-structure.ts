import * as WEBIFC from "web-ifc";
import { IfcItemsCategories } from "../../ifc/ifc-categories";

export class SpatialStructure {
  floorProperties: any[] = [];
  itemsByFloor: IfcItemsCategories = {};

  async setupFloors(webIfc: WEBIFC.IfcAPI) {
    this.reset();
    const floors = await this.getFloors(webIfc);
    for (const floor of floors) {
      await this.getFloorProperties(webIfc, floor);
      this.saveFloorRelations(floor);
    }
  }

  private reset() {
    this.floorProperties = [];
    this.itemsByFloor = {};
  }

  private async getFloorProperties(webIfc: WEBIFC.IfcAPI, floor: any) {
    const id = floor.expressID;
    const props = await webIfc.properties.getItemProperties(0, id, false);
    this.floorProperties.push(props);
  }

  private saveFloorRelations(floor: any) {
    for (const item of floor.children) {
      this.itemsByFloor[item.expressID] = floor.expressID;
      if (item.children.length) {
        for (const child of item.children) {
          this.itemsByFloor[child.expressID] = floor.expressID;
        }
      }
    }
  }

  private async getFloors(webIfc: WEBIFC.IfcAPI) {
    const project = await webIfc.properties.getSpatialStructure(0);

    // TODO: This is fixed from web-ifc 0.0.37
    // TODO: This fails with IFCs with uncommon spatial structure
    // @ts-ignore
    const floors = project.children[0].children[0].children;
    return floors;
  }
}
