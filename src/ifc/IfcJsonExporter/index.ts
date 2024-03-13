import * as WEBIFC from "web-ifc";
import * as FRAG from "bim-fragment";
import { GeometryTypes } from "./src/ifc-geometry-types";

/**
 * Object to export all the properties from an IFC to a JS object.
 */
export class IfcJsonExporter {
  /**
   * Exports all the properties of an IFC into an array of JS objects.
   * @param webIfc The instance of [web-ifc]{@link https://github.com/ThatOpen/engine_web-ifc} to use.
   * @param modelID ID of the IFC model whose properties to extract.
   * @param indirect whether to get the indirect relationships as well.
   * @param recursiveSpatial whether to get the properties of spatial items recursively
   * to make the location data available (e.g. absolute position of building).
   */
  async export(
    webIfc: WEBIFC.IfcAPI,
    modelID: number,
    indirect = false,
    recursiveSpatial = true
  ) {
    const properties: FRAG.IfcProperties = {};

    const allIfcEntities = new Set(webIfc.GetIfcEntityList(modelID));

    // let finalCount = 0;

    // Spatial items get their properties recursively to make
    // the location data available (e.g. absolute position of building)
    const spatialStructure = new Set([
      WEBIFC.IFCPROJECT,
      WEBIFC.IFCSITE,
      WEBIFC.IFCBUILDING,
      WEBIFC.IFCBUILDINGSTOREY,
      WEBIFC.IFCSPACE,
    ]);

    for (const type of spatialStructure) {
      allIfcEntities.add(type);
    }

    for (const type of allIfcEntities) {
      if (GeometryTypes.has(type)) {
        continue;
      }

      const recursive = spatialStructure.has(type) && recursiveSpatial;

      const ids = webIfc.GetLineIDsWithType(modelID, type);

      // const allIDs = this._webIfc.GetAllLines(0);
      for (const id of ids) {
        const property = webIfc.GetLine(0, id, recursive, indirect);
        properties[property.expressID] = property;
      }
    }

    return properties;
  }
}
