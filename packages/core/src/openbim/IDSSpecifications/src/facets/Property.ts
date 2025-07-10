import * as FRAGS from "@thatopen/fragments";
import { IDSCheck, IDSFacetParameter, IDSItemCheckResult } from "../types";
import { Components } from "../../../../core/Components";
import { IDSFacet } from "./Facet";
import { getParameterXML } from "../exporters/parameter";
import {
  FragmentsManager,
  ModelIdDataMap,
  ModelIdMap,
} from "../../../../fragments";
import { ModelIdMapUtils } from "../../../../utils";

// https://github.com/buildingSMART/IDS/blob/development/Documentation/UserManual/property-facet.md

export class IDSProperty extends IDSFacet {
  facetType = "Property" as const;
  propertySet: IDSFacetParameter;
  baseName: IDSFacetParameter;
  value?: IDSFacetParameter;
  dataType?: string;
  uri?: string;

  // These are defined by the IDS specification
  private _unsupportedTypes = [
    "IFCCOMPLEXPROPERTY",
    "IFCPHYSICALCOMPLEXQUANTITY",
  ];

  constructor(
    components: Components,
    propertySet: IDSFacetParameter,
    baseName: IDSFacetParameter,
  ) {
    super(components);
    this.propertySet = propertySet;
    this.baseName = baseName;
  }

  serialize(type: "applicability" | "requirement") {
    const propertySetXML = getParameterXML("PropertySet", this.propertySet);
    const baseNameXML = getParameterXML("BaseName", this.baseName);
    const valueXML = getParameterXML("Value", this.value);
    const dataTypeXML = this.dataType ? `dataType=${this.dataType}` : "";
    let attributes = "";
    if (type === "requirement") {
      attributes += `cardinality="${this.cardinality}"`;
      attributes += this.uri ? `uri=${this.uri}` : "";
      attributes += this.instructions
        ? `instructions="${this.instructions}"`
        : "";
    }
    return `<property ${dataTypeXML} ${attributes}>
  ${propertySetXML}
  ${baseNameXML}
  ${valueXML}
</property>`;
  }

  async getEntities(modelIds: RegExp[], collector: ModelIdMap) {
    const fragments = this._components.get(FragmentsManager);

    for (const [modelId, model] of fragments.list) {
      const isValidModel = modelIds.find((regex) => regex.test(modelId));
      if (!isValidModel) continue;
      const items = await model.getItemsOfCategories([
        /PROPERTYSET/,
        /ELEMENTQUANTITY/,
      ]);
      const localIds = Object.values(items).flat();
      if (localIds.length === 0) continue;
      const data = await model.getItemsData(localIds, {
        relations: {
          HasProperties: { attributes: true, relations: false },
          DefinesOcurrence: { attributes: true, relations: false },
        },
      });

      for (const set of data) {
        if (
          !(
            "value" in set._localId &&
            "value" in set._category &&
            "value" in set.Name &&
            Array.isArray(set.DefinesOcurrence)
          )
        ) {
          continue;
        }

        const nameMatches = this.evalRequirement(
          set.Name.value,
          this.propertySet,
          "PropertySet",
        );

        if (!nameMatches) continue;

        let propsListName: string | undefined;
        if (set._category.value === "IFCPROPERTYSET")
          propsListName = "HasProperties";
        if (set._category.value === "IFCELEMENTQUANTITY")
          propsListName = "Quantities";

        if (!propsListName) continue;
        const props = set[propsListName];
        if (!Array.isArray(props)) continue;

        for (const prop of props) {
          const keys = Object.keys(prop);
          const nameKey = keys.find((key) => /Name/.test(key));
          if (!(nameKey && "value" in prop[nameKey])) continue;
          const attribute = prop[nameKey];
          if (!("value" in attribute)) continue;

          const propNameMatches = this.evalRequirement(
            attribute.value,
            this.baseName,
            "BaseName",
          );

          if (!propNameMatches) continue;

          if (this.value) {
            const valueKey = keys.find((key) => /Value/.test(key));
            if (!valueKey) continue;
            const attribute = prop[valueKey];
            if (!("value" in attribute)) continue;

            const valueMatches = this.evalRequirement(
              attribute.value,
              this.value,
              "Value",
            );
            if (!valueMatches) continue;
          }

          const items = set.DefinesOcurrence.map((ocurrence) => {
            if (
              !(
                "value" in ocurrence._localId &&
                typeof ocurrence._localId.value === "number"
              )
            ) {
              return null;
            }

            return ocurrence._localId.value;
          }).filter((id) => id !== null) as number[];

          ModelIdMapUtils.append(collector, modelId, ...items);
        }
      }
    }
  }

  async test(items: ModelIdMap, collector: ModelIdDataMap<IDSItemCheckResult>) {
    const fragments = this._components.get(FragmentsManager);
    for (const [modelId, localIds] of Object.entries(items)) {
      const model = fragments.list.get(modelId);
      if (!model) continue;
      const data = await model.getItemsData([...localIds], {
        relations: {
          IsDefinedBy: { attributes: true, relations: true },
          IsTypedBy: { attributes: true, relations: false },
          HasPropertySets: { attributes: true, relations: true },
          DefinesOcurrence: { attributes: false, relations: false },
        },
      });

      for (const item of data) {
        const checks = this.getItemChecks(collector, modelId, item);
        if (!checks) continue;

        const sets = await this.getPsets(item);
        const matchingSets = sets.filter((set) => {
          if (!("value" in set.Name)) return false;
          const result = this.evalRequirement(
            set.Name.value,
            this.propertySet,
            "PropertySet",
          );
          if (!result) return false;
          checks.push({
            currentValue: set.Name.value,
            parameter: "PropertySet",
            pass: true,
            requiredValue: this.propertySet,
          });
          return true;
        });

        if (matchingSets.length === 0) {
          checks.push({
            currentValue: null,
            parameter: "PropertySet",
            pass: false,
            requiredValue: this.propertySet,
          });
          continue;
        }

        for (const set of matchingSets) {
          const propsListName = this.getPropertyListName(set);
          if (!propsListName) continue;

          const props = set[propsListName];
          if (!Array.isArray(props)) {
            checks.push({
              currentValue: null,
              parameter: "BaseName",
              pass: false,
              requiredValue: this.baseName,
            });
            continue;
          }

          const matchingProps = props.filter((item) => {
            if (!("value" in item._category && "value" in item.Name))
              return false;
            if (this._unsupportedTypes.includes(item._category.value)) {
              return false;
            }

            const result = this.evalRequirement(
              item.Name.value,
              this.baseName,
              "BaseName",
            );
            if (!result) return false;

            checks.push({
              currentValue: item.Name.value,
              parameter: "BaseName",
              pass: true,
              requiredValue: this.baseName,
            });
            return true;
          });

          if (matchingProps.length === 0) {
            checks.push({
              currentValue: null,
              parameter: "BaseName",
              pass: false,
              requiredValue: this.baseName,
            });
            continue;
          }

          for (const item of matchingProps) {
            this.evalValue(item, checks);
            this.evalDataType(item, checks);
            this.evalURI();
          }
        }
      }
    }
  }

  private getPropertyListName(item: FRAGS.ItemData) {
    let propsListName: "HasProperties" | "Quantities" | undefined;
    if (!("value" in item._category)) return propsListName;

    if (item._category.value === "IFCPROPERTYSET")
      propsListName = "HasProperties";
    if (item._category.value === "IFCELEMENTQUANTITY")
      propsListName = "Quantities";

    return propsListName;
  }

  private getValueKey(item: FRAGS.ItemData) {
    return Object.keys(item).find(
      (name) => /Value/.test(name) || /Values/.test(name),
    );
  }

  private getTypePsets(item: FRAGS.ItemData) {
    if (!Array.isArray(item.IsTypedBy)) return [];

    const [type] = item.IsTypedBy;
    if (!(type && Array.isArray(type.HasPropertySets))) {
      return [];
    }

    return type.HasPropertySets;
  }

  private async getPsets(item: FRAGS.ItemData) {
    const typeSets = this.getTypePsets(item);
    if (!Array.isArray(item.IsDefinedBy)) return typeSets;

    const sets: FRAGS.ItemData[] = [];

    for (const definition of item.IsDefinedBy) {
      if (!("value" in definition.Name)) continue;
      const definitionName = definition.Name.value;
      const propsListName = this.getPropertyListName(definition);
      if (!(definitionName && propsListName)) continue;

      const typeSet = typeSets.find((set) => {
        if (!("value" in set.Name)) return false;
        return set.Name.value === definitionName;
      });

      if (
        typeSet &&
        Array.isArray(typeSet.HasProperties) &&
        Array.isArray(definition.HasProperties)
      ) {
        for (const prop of typeSet.HasProperties) {
          if (!("value" in prop.Name)) continue;
          const name = prop.Name.value;
          const existingProp = definition.HasProperties.find((p) => {
            if (!("value" in p.Name)) return false;
            return p.Name.value === name;
          });
          if (!existingProp) definition.HasProperties.push(prop);
        }
      }

      sets.push(definition);
    }

    return sets;
  }

  // IFCPROPERTYBOUNDEDVALUE are not supported yet
  // IFCPROPERTYTABLEVALUE are not supported yet
  // TODO: Work must to be done to convert numerical value units to IDS-nominated standard units https://github.com/buildingSMART/IDS/blob/development/Documentation/UserManual/units.md
  private evalValue(item: FRAGS.ItemData, checks?: IDSCheck[]) {
    const valueKey = this.getValueKey(item) as any;
    const valueAttr = item[valueKey];
    if (!("value" in valueAttr)) return false;

    if (this.value) {
      if (!valueKey) {
        checks?.push({
          parameter: "Value",
          currentValue: null,
          pass: false,
          requiredValue: this.value,
        });
        return false;
      }

      const facetValue = structuredClone(this.value);
      if (valueAttr.type === "IFCLABEL" && facetValue.type === "simple") {
        facetValue.parameter = String(facetValue.parameter);
      }

      // if (
      //   (item.type === WEBIFC.IFCPROPERTYLISTVALUE ||
      //     item.type === WEBIFC.IFCPROPERTYENUMERATEDVALUE) &&
      //   Array.isArray(valueAttr)
      // ) {
      //   const values = valueAttr.map((value) => value.value);
      //   const matchingValue = valueAttr.find((value) => {
      //     if (!facetValue) return false;
      //     return this.evalRequirement(value.value, facetValue, "Value");
      //   });

      //   checks?.push({
      //     currentValue: values as any,
      //     pass: !!matchingValue,
      //     parameter: "Value",
      //     requiredValue: facetValue.parameter,
      //   });

      //   return !!matchingValue;
      // }

      const result = this.evalRequirement(
        valueAttr.value,
        facetValue,
        "Value",
        checks,
      );

      return result;
    }

    if (!valueKey) return true;

    // IDSDocs: Values with a logical unknown always fail
    // if (valueAttr.type === 3 && valueAttr.value === 2) {
    //   checks?.push({
    //     parameter: "Value",
    //     currentValue: null,
    //     pass: false,
    //     requiredValue: null,
    //   });
    //   return false;
    // }

    // IDSDocs: An empty string is considered false
    if (typeof valueAttr.value === "string" && valueAttr.value.trim() === "") {
      checks?.push({
        parameter: "Value",
        currentValue: "",
        pass: false,
        requiredValue: this.value,
      });
      return false;
    }

    return true;
  }

  private evalDataType(item: FRAGS.ItemData, checks?: IDSCheck[]) {
    if (!this.dataType) return true;
    const valueKey = this.getValueKey(item);

    if (!(valueKey && "value" in item[valueKey])) {
      checks?.push({
        parameter: "DataType",
        currentValue: null,
        pass: false,
        requiredValue: this.dataType,
      });
      return false;
    }

    const valueAttr = item[valueKey];

    // TODO: Redo this
    // if (
    //   (item.type === WEBIFC.IFCPROPERTYLISTVALUE ||
    //     item.type === WEBIFC.IFCPROPERTYENUMERATEDVALUE) &&
    //   Array.isArray(valueAttr) &&
    //   valueAttr[0]
    // ) {
    //   const valueType = valueAttr[0].name;
    //   const result = this.evalRequirement(
    //     valueType,
    //     {
    //       type: "simple",
    //       parameter: this.dataType,
    //     },
    //     "DataType",
    //     checks,
    //   );
    //   return result;
    // }

    const result = this.evalRequirement(
      (valueAttr as any).type ?? null,
      {
        type: "simple",
        parameter: this.dataType,
      },
      "DataType",
      checks,
    );

    return result;
  }

  private evalURI() {
    return true;
  }
}
