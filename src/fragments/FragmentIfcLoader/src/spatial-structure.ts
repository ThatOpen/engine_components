import * as WEBIFC from "web-ifc";
import { Units } from "./units";
import { IfcItemsCategories } from "../../../ifc";

export class SpatialStructure {
  itemsByFloor: IfcItemsCategories = {};

  private _units = new Units();

  async setUp(webIfc: WEBIFC.IfcAPI) {
    this._units.setUp(webIfc);
    this.cleanUp();
    try {
      const spatialRels = webIfc.GetLineIDsWithType(
        0,
        WEBIFC.IFCRELCONTAINEDINSPATIALSTRUCTURE
      );
      const spatialRelsSize = spatialRels.size();
      for (let i = 0; i < spatialRelsSize; i++) {
        const id = spatialRels.get(i);
        const properties = webIfc.GetLine(0, id);
        if (
          !properties ||
          !properties.RelatingStructure ||
          !properties.RelatedElements
        ) {
          continue;
        }
        const floor = properties.RelatingStructure.value;
        const relatedItems = properties.RelatedElements;
        for (const related of relatedItems) {
          const id = related.value;
          this.itemsByFloor[id] = floor;
        }
      }
      const aggregates = webIfc.GetLineIDsWithType(0, WEBIFC.IFCRELAGGREGATES);
      const aggregatesSize = aggregates.size();
      for (let i = 0; i < aggregatesSize; i++) {
        const id = aggregates.get(i);
        const properties = webIfc.GetLine(0, id);
        if (
          !properties ||
          !properties.RelatingObject ||
          !properties.RelatedObjects
        ) {
          continue;
        }
        const container = properties.RelatingObject.value;
        const relatedItems = properties.RelatedObjects;
        for (const related of relatedItems) {
          const containerFloor = this.itemsByFloor[container];
          if (containerFloor === undefined) continue;
          const id = related.value;
          this.itemsByFloor[id] = containerFloor;
        }
      }
    } catch (e) {
      console.log("Could not get floors.");
    }
  }

  cleanUp() {
    this.itemsByFloor = {};
  }
}
