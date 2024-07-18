import * as FRAGS from "@thatopen/fragments";
import * as WEBIFC from "web-ifc";

export class SpatialIdsFinder {
  static get(model: FRAGS.FragmentsGroup, webIfc: WEBIFC.IfcAPI) {
    const spatialTypes = [
      WEBIFC.IFCPROJECT,
      WEBIFC.IFCSITE,
      WEBIFC.IFCBUILDING,
      WEBIFC.IFCBUILDINGSTOREY,
      WEBIFC.IFCSPACE,
      WEBIFC.IFCROAD,
      WEBIFC.IFCFACILITY,
      WEBIFC.IFCFACILITYPART,
      WEBIFC.IFCBRIDGE,
    ];

    const data = model.data;

    for (const category of spatialTypes) {
      const ids = webIfc.GetLineIDsWithType(0, category);
      const size = ids.size();
      for (let i = 0; i < size; i++) {
        const id = ids.get(i);
        if (!data.has(id)) {
          data.set(id, [[], [0, category]]);
        }
      }
    }
  }
}
