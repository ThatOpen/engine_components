import * as WEBIFC from "web-ifc";
import { GeometryTypes } from "./ifc-geometry-types";
import { Event } from "../base-types";

/**
 * Object to export all the properties from an IFC to a JS object.
 */
export class IfcJsonExporter {
  loadProgress = new Event<{ progress: number; total: number }>();
  propertiesSerialized = new Event<any>();
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
        this.propertiesSerialized.trigger(properties);
        properties = null;
        properties = {};
        counter = 0;
      }

      if (i / linesCount > this._progress) {
        this.loadProgress.trigger({
          progress: i,
          total: linesCount,
        });
        this._progress += 0.1;
      }
    }

    this.propertiesSerialized.trigger(properties);
    properties = null;
  }

  private async getAllGeometriesIDs(modelID: number, webIfc: WEBIFC.IfcAPI) {
    const geometriesIDs = new Set<number>();
    const geomTypesArray = Array.from(GeometryTypes);
    for (let i = 0; i < geomTypesArray.length; i++) {
      const category = geomTypesArray[i];
      // eslint-disable-next-line no-await-in-loop
      const ids = await webIfc.GetLineIDsWithType(modelID, category);
      const idsSize = ids.size();
      for (let j = 0; j < idsSize; j++) {
        geometriesIDs.add(ids.get(j));
      }
    }
    return geometriesIDs;
  }
}
