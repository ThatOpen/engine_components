import * as WEBIFC from "web-ifc";
import { Units } from "./units";
import { IfcItemsCategories } from "../../../ifc";

export class SpatialStructure {
  itemsByFloor: IfcItemsCategories = {};

  private _units = new Units();

  // TODO: Maybe make this more flexible so that it also support more exotic spatial structures?
  setUp(webIfc: WEBIFC.IfcAPI) {
    this._units.setUp(webIfc);
    this.cleanUp();
    try {
      const spatialRels = webIfc.GetLineIDsWithType(
        0,
        WEBIFC.IFCRELCONTAINEDINSPATIALSTRUCTURE,
      );

      const allRooms = new Set<number>();
      const rooms = webIfc.GetLineIDsWithType(0, WEBIFC.IFCSPACE);
      for (let i = 0; i < rooms.size(); i++) {
        allRooms.add(rooms.get(i));
      }

      // First add rooms (if any) to floors
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
        const parentID = properties.RelatingObject.value;
        const childsIDs = properties.RelatedObjects;
        for (const child of childsIDs) {
          const childID = child.value;
          if (allRooms.has(childID)) {
            this.itemsByFloor[childID] = parentID;
          }
        }
      }

      // Now add items contained in floors and rooms
      // If items contained in room, look for the floor where that room is and assign it to it
      const itemsContainedInRooms: { [roomID: number]: number[] } = {};

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
        const structureID = properties.RelatingStructure.value;
        const relatedItems = properties.RelatedElements;
        if (allRooms.has(structureID)) {
          for (const related of relatedItems) {
            if (!itemsContainedInRooms[structureID]) {
              itemsContainedInRooms[structureID] = [];
            }
            const id = related.value;
            itemsContainedInRooms[structureID].push(id);
          }
        } else {
          for (const related of relatedItems) {
            const id = related.value;
            this.itemsByFloor[id] = structureID;
          }
        }
      }

      for (const roomID in itemsContainedInRooms) {
        const roomFloor = this.itemsByFloor[roomID];
        if (roomFloor !== undefined) {
          const items = itemsContainedInRooms[roomID];
          for (const item of items) {
            this.itemsByFloor[item] = roomFloor;
          }
        }
      }

      // Finally, add nested items (e.g. elements of curtain walls)
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
        const parentID = properties.RelatingObject.value;
        const childsIDs = properties.RelatedObjects;
        for (const child of childsIDs) {
          const childID = child.value;
          const parentStructure = this.itemsByFloor[parentID];
          if (parentStructure !== undefined) {
            this.itemsByFloor[childID] = parentStructure;
          }
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
