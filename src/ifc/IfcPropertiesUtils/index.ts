import * as WEBIFC from "web-ifc";
import { IfcCategoryMap } from "../ifc-category-map";

export type IfcProperties = {
  [expressID: number]: { [attribute: string]: any };
};
export type IfcSchemas = "IFC2X3" | "IFC4" | "IFC4X3";

export class IfcPropertiesUtils {
  static getUnits(properties: IfcProperties) {
    const { IFCUNITASSIGNMENT } = WEBIFC;
    const allUnits = this.findItemOfType(properties, IFCUNITASSIGNMENT);
    if (!allUnits) return 1;
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

  static findItemByGuid(properties: IfcProperties, guid: string) {
    for (const id in properties) {
      const property = properties[id];
      if (property.GlobalId?.value === guid) {
        return property;
      }
    }
    return null;
  }

  static findItemOfType(properties: IfcProperties, type: number) {
    for (const id in properties) {
      const property = properties[id];
      if (property.type === type) {
        return property;
      }
    }
    return null;
  }

  static getAllItemsOfType(properties: IfcProperties, type: number) {
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
    properties: IfcProperties,
    relationType: number,
    onElementsFound?: (relatingID: number, relatedIDs: number[]) => void
  ) {
    const defaultCallback = () => {};
    const _onElementsFound = onElementsFound ?? defaultCallback;
    const result: { [relatingID: number]: number[] } = {};
    for (const expressID in properties) {
      const prop = properties[expressID];
      const isRelation = prop.type === relationType;
      const relatingKey = Object.keys(prop).find((key) =>
        key.startsWith("Relating")
      );
      const relatedKey = Object.keys(prop).find((key) =>
        key.startsWith("Related")
      );
      if (!(isRelation && relatingKey && relatedKey)) continue;
      const relating = properties[prop[relatingKey]?.value];
      const related = prop[relatedKey];
      if (!(related && Array.isArray(related))) continue;
      const elements = related.map((el: any) => {
        return el.value;
      });
      _onElementsFound(relating.expressID, elements);
      result[relating.expressID] = elements;
    }
    return result;
  }

  static getQsetQuantities(
    properties: IfcProperties,
    expressID: number,
    onQuantityFound?: (expressID: number) => void
  ): number[] | null {
    const defaultCallback = () => {};
    const _onQuantityFound = onQuantityFound ?? defaultCallback;
    const pset = properties[expressID];
    if (pset?.type !== WEBIFC.IFCELEMENTQUANTITY) return null;
    const quantities = pset.Quantities ?? [{}];
    const qtos = quantities.map((prop: any) => {
      if (prop.value) _onQuantityFound(prop.value);
      return prop.value;
    });
    return qtos.filter((prop: any) => prop !== null);
  }

  static getPsetProps(
    properties: IfcProperties,
    expressID: number,
    onPropFound?: (expressID: number) => void
  ): number[] | null {
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

  static getPsetRel(properties: IfcProperties, psetID: number) {
    const arrayProperties = Object.values(properties);
    if (!properties[psetID]) return null;
    const rel = arrayProperties.find((data) => {
      const isRelation = data.type === WEBIFC.IFCRELDEFINESBYPROPERTIES;
      const relatesToPset = data.RelatingPropertyDefinition?.value === psetID;
      return isRelation && relatesToPset;
    });
    return rel ? (rel.expressID as number) : null;
  }

  static getQsetRel(properties: IfcProperties, qsetID: number) {
    return IfcPropertiesUtils.getPsetRel(properties, qsetID);
  }

  static getEntityName(properties: IfcProperties, entityID: number) {
    const entity = properties[entityID];
    const key = Object.keys(entity).find((key) => key.endsWith("Name")) ?? null;
    const name = key ? (entity[key].value as string) : null;
    return { key, name };
  }

  static getQuantityValue(properties: IfcProperties, quantityID: number) {
    const quantity = properties[quantityID];
    const key =
      Object.keys(quantity).find((key) => key.endsWith("Value")) ?? null;
    const value = key ? (quantity[key].value as number) : null;
    return { key, value };
  }

  static isRel(expressID: number) {
    const entityName = IfcCategoryMap[expressID];
    return entityName.startsWith("IFCREL");
  }

  static attributeExists(
    properties: IfcProperties,
    expressID: number,
    attribute: string
    // caseSensitive = true
  ) {
    const entity = properties[expressID];
    if (!entity) return false;
    return Object.keys(properties[expressID]).includes(attribute);
  }
}
