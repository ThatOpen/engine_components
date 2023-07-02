export class IfcPropertiesUtils {
  static getLevels(properties: any) {
    console.log(properties);
    // properties[floor.expressID];
    // const props = await properties.getItemProperties(0, floor.expressID, false);
    // props.SceneHeight = await this.getHeight(props, webIfc, properties, units);
    // const placementID = props.ObjectPlacement.value;
    // const coordArray = webIfc.GetCoordinationMatrix(0);
    // const coordHeight = coordArray[13] * units.factor;
    // const placement = await properties.getItemProperties(0, placementID, true);
    // return this.getPlacementHeight(placement, units) + coordHeight;
  }
}
