import * as WEBIFC from "web-ifc";
import * as FRAG from "@thatopen/fragments";
import { GeometryTypes } from "./src/ifc-geometry-types";
import { Component, Components } from "../../core";

export * from "./src";

/**
 * Component to export all the properties from an IFC to a JS object. 📕 [Tutorial](https://docs.thatopen.com/Tutorials/Components/Core/IfcJsonExporter). 📘 [API](https://docs.thatopen.com/api/@thatopen/components/classes/IfcJsonExporter).
 */
export class IfcJsonExporter extends Component {
  /**
   * A unique identifier for the component.
   * This UUID is used to register the component within the Components system.
   */
  static readonly uuid = "b32c4332-cd67-436e-ba7f-196646c7a635" as const;

  /** {@link Component.enabled} */
  enabled = true;

  constructor(components: Components) {
    super(components);
    components.add(IfcJsonExporter.uuid, this);
  }

  /**
   * Exports all the properties of an IFC into an array of JS objects.
   * @param webIfc The instance of [web-ifc](https://github.com/ThatOpen/engine_web-ifc) to use.
   * @param modelID ID of the IFC model whose properties to extract.
   * @param indirect whether to get the indirect relationships as well.
   * @param recursiveSpatial whether to get the properties of spatial items recursively
   * to make the location data available (e.g. absolute position of building).
   */
  async export(
    webIfc: WEBIFC.IfcAPI,
    modelID: number,
    indirect = false,
    recursiveSpatial = true,
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
        try {
          const property = webIfc.GetLine(0, id, recursive, indirect);
          properties[property.expressID] = property;
        } catch (e) {
          console.log(
            `Could not get property ${id}, with recursive ${recursive} and indirect ${indirect}.`,
          );
        }
      }
    }

    return properties;
  }
}
