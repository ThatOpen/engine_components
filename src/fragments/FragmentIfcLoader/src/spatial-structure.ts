import * as WEBIFC from "web-ifc";
import { Units } from "./units";
import { IfcItemsCategories } from "../../../ifc";

export class SpatialStructure {
  floorProperties: any[] = [];
  itemsByFloor: IfcItemsCategories = {};

  async setUp(webIfc: WEBIFC.IfcAPI, units: Units) {
    this.reset();
    try {
      const floors = await this.getFloors(webIfc);
      for (const floor of floors) {
        await this.getFloorProperties(webIfc, floor, units);
        this.saveFloorRelations(floor);
      }
    } catch (e) {
      console.log("Could not get floors.");
    }
  }

  cleanUp() {
    this.floorProperties = [];
    this.itemsByFloor = {};
  }

  private reset() {
    this.floorProperties = [];
    this.itemsByFloor = {};
  }

  private async getFloorProperties(
    webIfc: WEBIFC.IfcAPI,
    floor: any,
    units: Units
  ) {
    const id = floor.expressID;
    const properties = webIfc.properties;
    const props = await properties.getItemProperties(0, id, false);
    props.SceneHeight = await this.getHeight(props, webIfc, properties, units);
    this.floorProperties.push(props);
  }

  private async getHeight(
    props: any,
    webIfc: WEBIFC.IfcAPI,
    properties: any,
    units: Units
  ) {
    const placementID = props.ObjectPlacement.value;
    const coordArray = webIfc.GetCoordinationMatrix(0);
    const coordHeight = coordArray[13] * units.factor;
    const placement = await properties.getItemProperties(0, placementID, true);
    return this.getPlacementHeight(placement, units) + coordHeight;
  }

  private getPlacementHeight(placement: any, units: Units) {
    let value = 0;
    const heightCoords = placement.RelativePlacement?.Location?.Coordinates;
    if (heightCoords) {
      value += heightCoords[2].value * units.complement * units.factor;
    }
    if (placement.PlacementRelTo) {
      value += this.getPlacementHeight(placement.PlacementRelTo, units);
    }
    return value;
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
