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

  static getRelationMap(
    properties: Record<string, Record<string, any>>,
    relationType: number,
    onElementsFound?: (relatingID: number, relatedIDs: number[]) => void
  ) {
    const defaultCallback = () => {};
    const _onElementsFound = onElementsFound ?? defaultCallback;
    const arrayProperties = Object.values(properties);
    const result: { [groupID: string]: string[] } = {};
    arrayProperties.forEach((prop: any) => {
      const isRelation = prop.type === relationType;
      const relatingKey = Object.keys(prop).find((key) =>
        key.startsWith("Relating")
      );
      const relatedKey = Object.keys(prop).find((key) =>
        key.startsWith("Related")
      );
      if (!(isRelation && relatingKey && relatedKey)) return;
      const relating = properties[prop[relatingKey]?.value];
      const related = prop[relatedKey];
      if (!related) return;
      const elements = related.map((el: any) => {
        return el.value;
      });
      _onElementsFound(relating.expressID, elements);
      result[relating.expressID] = elements;
    });
    return result;
  }

  static getQsetQuantities(
    properties: Record<string, Record<string, any>>,
    expressID: number,
    onQuantityFound?: (expressID: number) => void
  ) {
    const defaultCallback = () => {};
    const _onQuantityFound = onQuantityFound ?? defaultCallback;
    const pset = properties[expressID];
    if (pset?.type !== WEBIFC.IFCELEMENTQUANTITY) {
      return null;
    }
    const quantities = pset.Quantities ?? [{}];
    const qtos = quantities.map((prop: any) => {
      if (prop.value) {
        _onQuantityFound(prop.value);
      }
      return prop.value;
    });
    return qtos.filter((prop: any) => prop !== null);
  }

  static getPsetProps(
    properties: Record<string, Record<string, any>>,
    expressID: number,
    onPropFound?: (expressID: number) => void
  ) {
    const defaultCallback = () => {};
    const _onPropFound = onPropFound ?? defaultCallback;
    const pset = properties[expressID];
    if (pset?.type !== WEBIFC.IFCPROPERTYSET) return null;
    const hasProperties = pset.HasProperties ?? [{}];
    const props = hasProperties.map((prop: any) => {
      if (prop.value) _onPropFound(prop.value);
      return prop.value;
    });
    return props.filter((prop: any) => prop !== null);
  }
}
