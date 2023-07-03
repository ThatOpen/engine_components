import * as WEBIFC from "web-ifc";

export class IfcPropertiesUtils {
  static getLevels(properties: any) {
    const floors: { data: any; height: number }[] = [];

    const floorsProps = IfcPropertiesUtils.getAllItemsOfType(
      properties,
      WEBIFC.IFCBUILDINGSTOREY
    );

    for (const data of floorsProps) {
      const height = data.Elevation.value;
      floors.push({ data, height });
    }

    console.log(floors);

    // properties[floor.expressID];
    // const props = await properties.getItemProperties(0, floor.expressID, false);
    // props.SceneHeight = await this.getHeight(props, webIfc, properties, units);
    // const placementID = props.ObjectPlacement.value;
    // const coordArray = webIfc.GetCoordinationMatrix(0);
    // const coordHeight = coordArray[13] * units.factor;
    // const placement = await properties.getItemProperties(0, placementID, true);
    // return this.getPlacementHeight(placement, units) + coordHeight;
  }

  static getAllItemsOfType(properties: any, type: number) {
    const found: any[] = [];
    for (const id in properties) {
      const property = properties[id];
      if (property.type === type) {
        found.push(property);
      }
    }
    return found;
  }
}
