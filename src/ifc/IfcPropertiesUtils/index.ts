import * as WEBIFC from "web-ifc";
import * as FRAGS from "bim-fragment";
import { IfcCategoryMap } from "../ifc-category-map";

export class IfcPropertiesUtils {
  static async getUnits(group: FRAGS.FragmentsGroup) {
    const { IFCUNITASSIGNMENT } = WEBIFC;
    const allUnitsSets = await group.getAllPropertiesOfType(IFCUNITASSIGNMENT);
    if (!allUnitsSets) {
      return 1;
    }

    const unitIDs = Object.keys(allUnitsSets);
    const allUnits = allUnitsSets[parseInt(unitIDs[0], 10)];

    for (const unitRef of allUnits.Units) {
      if (unitRef.value === undefined || unitRef.value === null) continue;
      const unit = await group.getProperties(unitRef.value);
      if (!unit || !unit.UnitType || !unit.UnitType.value) {
        continue;
      }
      const value = unit.UnitType.value;
      if (value !== "LENGTHUNIT") continue;
      let factor = 1;
      let unitValue = 1;
      if (unit.Name.value === "METRE") {
        unitValue = 1;
      }
      if (unit.Name.value === "FOOT") {
        unitValue = 0.3048;
      }
      if (unit.Prefix?.value === "MILLI") {
        factor = 0.001;
      }
      return unitValue * factor;
    }
    return 1;
  }

  static async findItemByGuid(model: FRAGS.FragmentsGroup, guid: string) {
    const ids = model.getAllPropertiesIDs();
    for (const id of ids) {
      const property = await model.getProperties(id);
      if (property && property.GlobalId?.value === guid) {
        return property;
      }
    }
    return null;
  }

  static async getRelationMap(
    model: FRAGS.FragmentsGroup,
    relationType: number,
    onElementsFound?: (
      relatingID: number,
      relatedIDs: number[]
    ) => Promise<void>
  ) {
    const defaultCallback = () => {};
    const _onElementsFound = onElementsFound ?? defaultCallback;
    const result: { [relatingID: number]: number[] } = {};
    const ids = model.getAllPropertiesIDs();
    for (const expressID of ids) {
      const prop = await model.getProperties(expressID);

      if (!prop) {
        continue;
      }

      const isRelation = prop.type === relationType;
      const relatingKey = Object.keys(prop).find((key) =>
        key.startsWith("Relating")
      );

      const relatedKey = Object.keys(prop).find((key) =>
        key.startsWith("Related")
      );

      if (!(isRelation && relatingKey && relatedKey)) continue;
      const relating = await model.getProperties(prop[relatingKey]?.value);
      const related = prop[relatedKey];

      if (!relating || !related) {
        continue;
      }

      if (!(related && Array.isArray(related))) continue;
      const elements = related.map((el: any) => {
        return el.value;
      });

      _onElementsFound(relating.expressID, elements);
      result[relating.expressID] = elements;
    }
    return result;
  }

  static async getQsetQuantities(
    model: FRAGS.FragmentsGroup,
    expressID: number,
    onQuantityFound?: (expressID: number) => void
  ): Promise<number[] | null> {
    const defaultCallback = () => {};
    const _onQuantityFound = onQuantityFound ?? defaultCallback;
    const pset = await model.getProperties(expressID);
    if (!pset || pset.type !== WEBIFC.IFCELEMENTQUANTITY) {
      return null;
    }

    const quantities = pset.Quantities ?? [{}];
    const qtos = quantities.map((prop: any) => {
      if (prop.value) _onQuantityFound(prop.value);
      return prop.value;
    });
    return qtos.filter((prop: any) => prop !== null);
  }

  static async getPsetProps(
    model: FRAGS.FragmentsGroup,
    expressID: number,
    onPropFound?: (expressID: number) => void
  ): Promise<number[] | null> {
    const defaultCallback = () => {};
    const _onPropFound = onPropFound ?? defaultCallback;
    const pset = await model.getProperties(expressID);
    if (!pset || pset.type !== WEBIFC.IFCPROPERTYSET) {
      return null;
    }

    const hasProperties = pset.HasProperties ?? [{}];
    const props = hasProperties.map((prop: any) => {
      if (prop.value) _onPropFound(prop.value);
      return prop.value;
    });

    return props.filter((prop: any) => prop !== null);
  }

  static async getPsetRel(model: FRAGS.FragmentsGroup, psetID: number) {
    const prop = await model.getProperties(psetID);
    if (!prop) {
      return null;
    }

    const allPropsRels = await model.getAllPropertiesOfType(
      WEBIFC.IFCRELDEFINESBYPROPERTIES
    );

    if (!allPropsRels) {
      return null;
    }

    const allRels = Object.values(allPropsRels);

    let found: number | null = null;

    for (const rel of allRels) {
      if (rel.RelatingPropertyDefinition?.value === psetID) {
        found = rel.expressID;
      }
    }

    return found;
  }

  static async getQsetRel(model: FRAGS.FragmentsGroup, qsetID: number) {
    return IfcPropertiesUtils.getPsetRel(model, qsetID);
  }

  static async getEntityName(model: FRAGS.FragmentsGroup, entityID: number) {
    const entity = await model.getProperties(entityID);
    if (!entity) {
      return { key: null, name: null };
    }
    const key = Object.keys(entity).find((key) => key.endsWith("Name")) ?? null;
    const name = key ? (entity[key].value as string) : null;
    return { key, name };
  }

  static async getQuantityValue(
    model: FRAGS.FragmentsGroup,
    quantityID: number
  ) {
    const quantity = await model.getProperties(quantityID);
    if (!quantity) {
      return { key: null, value: null };
    }
    const key =
      Object.keys(quantity).find((key) => key.endsWith("Value")) ?? null;
    let value;
    if (key === null) {
      value = null;
    } else if (quantity[key] === undefined || quantity[key] === null) {
      value = null;
    } else {
      value = quantity[key].value as number;
    }

    return { key, value };
  }

  static isRel(expressID: number) {
    const entityName = IfcCategoryMap[expressID];
    return entityName.startsWith("IFCREL");
  }

  static async attributeExists(
    model: FRAGS.FragmentsGroup,
    expressID: number,
    attribute: string
  ) {
    const entity = await model.getProperties(expressID);
    if (!entity) {
      return false;
    }
    return Object.keys(entity).includes(attribute);
  }

  static async groupEntitiesByType(
    model: FRAGS.FragmentsGroup,
    expressIDs: Set<number> | number[]
  ) {
    const categoriesMap = new Map<number, Set<number>>();
    for (const expressID of expressIDs) {
      const entity = await model.getProperties(expressID);
      if (!entity) {
        continue;
      }
      const key = entity.type;
      const set = categoriesMap.get(key);
      if (!set) categoriesMap.set(key, new Set());
      categoriesMap.get(key)?.add(expressID);
    }
    return categoriesMap;
  }

  // static getPropertyUnits(properties: IfcProperties, expressID: number) {
  //   const entity = properties[expressID];
  //   if (!entity) return null;
  //   const propertyInstance =
  //     entity instanceof WEBIFC.IFC2X3.IfcProperty ||
  //     entity instanceof WEBIFC.IFC4.IfcProperty ||
  //     entity instanceof WEBIFC.IFC4X3.IfcProperty;
  //   if (!propertyInstance) return null;
  //   const { key: valueKey } = IfcPropertiesUtils.getQuantityValue(
  //     properties,
  //     expressID
  //   );
  //   if (!valueKey) return null;
  //   // @ts-ignore
  //   const measureName = entity[valueKey].constructor.name as string;
  //   const isMeasureAttribute = measureName.endsWith("Measure");
  //   if (!isMeasureAttribute) return null;
  //   const measureType = measureName.slice(3, measureName.length - 7);
  //   return propertyInstance;
  // }
}
