import * as WEBIFC from "web-ifc";

export class IfcPropertiesUtils {
  static getUnits(properties: any) {
    const { IFCUNITASSIGNMENT } = WEBIFC;
    const allUnits = this.findItemOfType(properties, IFCUNITASSIGNMENT);
    for (const unitRef of allUnits.Units) {
      if (unitRef.value === undefined || unitRef.value === null) continue;
      const unit = properties[unitRef.value];
      if (!unit.UnitType || !unit.UnitType.value) continue;
      const value = unit.UnitType.value;
      if (value !== "LENGTHUNIT") continue;
      let factor = 1;
      let unitValue = 1;
      if (unit.Name.value === "METRE") unitValue = 1;
      if (unit.Name.value === "FOOT") unitValue = 0.3048;
      if (unit.Prefix?.value === "MILLI") factor = 0.001;
      return unitValue * factor;
    }
    return 1;
  }

  static findItemOfType(properties: any, type: number) {
    for (const id in properties) {
      const property = properties[id];
      if (property.type === type) {
        return property;
      }
    }
    return null;
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
