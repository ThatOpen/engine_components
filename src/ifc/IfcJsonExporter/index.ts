import * as WEBIFC from "web-ifc";
import { GeometryTypes } from "./src/ifc-geometry-types";
import { Event } from "../../base-types";

/**
 * Object to export all the properties from an IFC to a JS object.
 */
export class IfcJsonExporter {
  readonly onLoadProgress = new Event<{ progress: number; total: number }>();
  readonly onPropertiesSerialized = new Event<any>();

  size?: number;

  private _progress = 0;

  /**
   * Exports all the properties of an IFC into an array of JS objects.
   * @webIfc The instance of [web-ifc]{@link https://github.com/ifcjs/web-ifc} to use.
   * @modelID ID of the IFC model whose properties to extract.
   */
  async export(webIfc: WEBIFC.IfcAPI, modelID: number) {
    const geometriesIDs = await this.getAllGeometriesIDs(modelID, webIfc);
    let properties: any = {};
    properties.coordinationMatrix = webIfc.GetCoordinationMatrix(modelID);
    const allLinesIDs = await webIfc.GetAllLines(modelID);
    const linesCount = allLinesIDs.size();

    this._progress = 0.1;

    let counter = 0;
    for (let i = 0; i < linesCount; i++) {
      const id = allLinesIDs.get(i);
      if (!geometriesIDs.has(id)) {
        try {
          properties[id] = await webIfc.GetLine(modelID, id);
        } catch (e) {
          console.log(`Properties of the element ${id} could not be processed`);
        }
        counter++;
      }

      if (this.size !== undefined && counter > this.size) {
        await this.onPropertiesSerialized.trigger(properties);
        properties = null;
        properties = {};
        counter = 0;
      }

      if (i / linesCount > this._progress) {
        await this.onLoadProgress.trigger({
          progress: i,
          total: linesCount,
        });
        this._progress += 0.1;
      }
    }

    await this.onPropertiesSerialized.trigger(properties);
    properties = null;
  }

  private async getAllGeometriesIDs(modelID: number, webIfc: WEBIFC.IfcAPI) {
    // Exclude location info of spatial structure

    const placementIDs = new Set<number>();

    const structures = new Set<number>();
    this.getStructure(WEBIFC.IFCPROJECT, structures, webIfc);
    this.getStructure(WEBIFC.IFCSITE, structures, webIfc);
    this.getStructure(WEBIFC.IFCBUILDING, structures, webIfc);
    this.getStructure(WEBIFC.IFCBUILDINGSTOREY, structures, webIfc);
    this.getStructure(WEBIFC.IFCSPACE, structures, webIfc);

    for (const id of structures) {
      const properties = webIfc.GetLine(0, id);

      const placementRef = properties.ObjectPlacement;
      if (!placementRef || placementRef.value === null) {
        continue;
      }
      const placementID = placementRef.value;
      placementIDs.add(placementID);

      const placementProps = webIfc.GetLine(0, placementID);

      const relPlacementID = placementProps.RelativePlacement;
      if (!relPlacementID || relPlacementID.value === null) {
        continue;
      }

      placementIDs.add(relPlacementID.value);
      const relPlacement = webIfc.GetLine(0, relPlacementID.value);

      const location = relPlacement.Location;

      if (location && location.value !== null) {
        placementIDs.add(location.value);
      }
    }

    const geometriesIDs = new Set<number>();
    const geomTypesArray = Array.from(GeometryTypes);
    for (let i = 0; i < geomTypesArray.length; i++) {
      const category = geomTypesArray[i];
      // eslint-disable-next-line no-await-in-loop
      const ids = await webIfc.GetLineIDsWithType(modelID, category);
      const idsSize = ids.size();
      for (let j = 0; j < idsSize; j++) {
        const id = ids.get(j);
        if (placementIDs.has(id)) {
          continue;
        }
        geometriesIDs.add(id);
      }
    }
    return geometriesIDs;
  }

  private getStructure(
    type: number,
    result: Set<number>,
    webIfc: WEBIFC.IfcAPI
  ) {
    const found = webIfc.GetLineIDsWithType(0, type);
    const size = found.size();
    for (let i = 0; i < size; i++) {
      const id = found.get(i);
      result.add(id);
    }
  }
}
