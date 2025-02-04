import * as FRAGS from "@thatopen/fragments";
import * as WEBIFC from "web-ifc";
import { IDSCheck, IDSCheckResult, IDSFacetParameter } from "../types";
import { Components } from "../../../../core/Components";
import { IfcRelationsIndexer } from "../../../../ifc";
import { IDSFacet } from "./Facet";
import { getParameterXML } from "../exporters/parameter";

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
    WEBIFC.IFCCOMPLEXPROPERTY,
    WEBIFC.IFCPHYSICALCOMPLEXQUANTITY,
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
    return `<ids:property ${dataTypeXML} ${attributes}>
  ${propertySetXML}
  ${baseNameXML}
  ${valueXML}
</ids:property>`;
  }

  async getEntities(
    model: FRAGS.FragmentsGroup,
    collector: FRAGS.IfcProperties = {},
  ) {
    let sets: FRAGS.IfcProperties = {};
    const psets = await model.getAllPropertiesOfType(WEBIFC.IFCPROPERTYSET);
    sets = { ...sets, ...psets };
    const qsets = await model.getAllPropertiesOfType(WEBIFC.IFCELEMENTQUANTITY);
    sets = { ...sets, ...qsets };
    if (Object.keys(sets).length === 0) return [];

    const matchingSets: number[] = [];

    for (const _setID in sets) {
      const setID = Number(_setID);
      const attrs = await model.getProperties(setID);
      if (!attrs) continue;

      const nameMatches = attrs.Name?.value === this.propertySet.parameter;
      if (!nameMatches) continue;

      let propsListName: string | undefined;
      if (attrs.type === WEBIFC.IFCPROPERTYSET) propsListName = "HasProperties";
      if (attrs.type === WEBIFC.IFCELEMENTQUANTITY)
        propsListName = "Quantities";
      if (!propsListName) continue;

      for (const handle of attrs[propsListName]) {
        const propAttrs = await model.getProperties(handle.value);
        if (!propAttrs) continue;

        const propNameMatches =
          propAttrs.Name?.value === this.baseName.parameter;
        if (!propNameMatches) continue;

        if (this.value) {
          const valueKey = Object.keys(propAttrs).find((name) =>
            name.endsWith("Value"),
          );
          if (!valueKey) continue;
          const valueMatches =
            propAttrs[valueKey].value === this.value.parameter;
          if (!valueMatches) continue;
        }

        matchingSets.push(setID);
      }
    }

    const result: number[] = [];
    const indexer = this.components.get(IfcRelationsIndexer);

    for (const setID of matchingSets) {
      const expressIDs = indexer.getEntitiesWithRelation(
        model,
        "IsDefinedBy",
        setID,
      );

      for (const expressID of expressIDs) {
        if (expressID in collector) continue;
        const attrs = await model.getProperties(expressID);
        if (!attrs) continue;
        collector[expressID] = attrs;
        result.push(expressID);
      }
    }

    return [];
  }

  async test(entities: FRAGS.IfcProperties, model: FRAGS.FragmentsGroup) {
    this.testResult = [];
    for (const _expressID in entities) {
      const expressID = Number(_expressID);
      const attrs = entities[expressID];

      const checks: IDSCheck[] = [];
      const result: IDSCheckResult = {
        guid: attrs.GlobalId?.value,
        expressID,
        pass: false,
        checks,
        cardinality: this.cardinality,
      };

      this.testResult.push(result);

      const sets = await this.getPsets(model, expressID);
      const matchingSets = sets.filter((set) => {
        const result = this.evalRequirement(
          set.Name ?? null,
          this.propertySet,
          "PropertySet",
        );
        if (!result) return false;
        checks.push({
          currentValue: set.Name,
          parameter: "PropertySet",
          pass: true,
          requiredValue: this.propertySet.parameter,
        });
        return true;
      });

      if (matchingSets.length === 0) {
        checks.push({
          currentValue: null,
          parameter: "PropertySet",
          pass: false,
          requiredValue: this.propertySet.parameter,
        });
        continue;
      }

      for (const set of matchingSets) {
        if (!("Properties" in set)) {
          checks.push({
            currentValue: null,
            parameter: "BaseName",
            pass: false,
            requiredValue: this.baseName.parameter,
          });
          continue;
        }

        const items = set.Properties;
        const matchingItems = items.filter((item: any) => {
          if (this._unsupportedTypes.includes(item.type)) {
            return false;
          }
          const result = this.evalRequirement(
            item.Name?.value ?? null,
            this.baseName,
            "BaseName",
          );
          if (!result) return false;
          checks.push({
            currentValue: item.Name.value,
            parameter: "BaseName",
            pass: true,
            requiredValue: this.baseName.parameter,
          });
          return true;
        });

        if (matchingItems.length === 0) {
          checks.push({
            currentValue: null,
            parameter: "BaseName",
            pass: false,
            requiredValue: this.baseName.parameter,
          });
          continue;
        }

        for (const item of matchingItems) {
          this.evalValue(item, checks);
          this.evalDataType(item, checks);
          this.evalURI();
        }
      }

      result.pass = checks.every(({ pass }) => pass);
    }

    const result = [...this.testResult];
    this.testResult = [];
    return result;
  }

  private getItemsAttrName(type: number) {
    let propsListName: "HasProperties" | "Quantities" | undefined;
    if (type === WEBIFC.IFCPROPERTYSET) propsListName = "HasProperties";
    if (type === WEBIFC.IFCELEMENTQUANTITY) propsListName = "Quantities";
    return propsListName;
  }

  private getValueKey(attrs: Record<string, any>) {
    return Object.keys(attrs).find(
      (name) => name.endsWith("Value") || name.endsWith("Values"),
    );
  }

  private async simplifyPset(
    model: FRAGS.FragmentsGroup,
    attrs: Record<string, any>,
    propsListName: "HasProperties" | "Quantities",
  ) {
    const props: Record<string, any>[] = [];
    const list = attrs[propsListName];
    if (!list) return attrs;
    for (const { value } of list) {
      const propAttrs = await model.getProperties(value);
      if (propAttrs) props.push(propAttrs);
    }
    const attrsClone = {
      Name: attrs.Name?.value,
      Properties: props,
      type: attrs.type,
    };
    return attrsClone;
  }

  private async getTypePsets(model: FRAGS.FragmentsGroup, expressID: number) {
    const sets: Record<string, any>[] = [];

    const indexer = this.components.get(IfcRelationsIndexer);
    const types = indexer.getEntityRelations(model, expressID, "IsTypedBy");
    if (!(types && types[0])) return sets;

    const typeAttrs = await model.getProperties(types[0]);
    if (
      !(
        typeAttrs &&
        "HasPropertySets" in typeAttrs &&
        Array.isArray(typeAttrs.HasPropertySets)
      )
    ) {
      return sets;
    }

    for (const { value } of typeAttrs.HasPropertySets) {
      const psetAttrs = await model.getProperties(value);
      if (
        !(
          psetAttrs &&
          "HasProperties" in psetAttrs &&
          Array.isArray(psetAttrs.HasProperties)
        )
      ) {
        continue;
      }

      const pset = await this.simplifyPset(model, psetAttrs, "HasProperties");
      sets.push(pset);
    }

    return sets;
  }

  private async getPsets(model: FRAGS.FragmentsGroup, expressID: number) {
    const typePsets = await this.getTypePsets(model, expressID);

    const indexer = this.components.get(IfcRelationsIndexer);
    const definitions = indexer.getEntityRelations(
      model,
      expressID,
      "IsDefinedBy",
    );

    if (!definitions) return typePsets;

    const sets: Record<string, any>[] = [];

    for (const definitionID of definitions) {
      const attrs = await model.getProperties(definitionID);
      if (!attrs) continue;

      const propsListName = this.getItemsAttrName(attrs.type);
      if (!propsListName) continue;

      const occurencePset = await this.simplifyPset(
        model,
        attrs,
        propsListName,
      );

      const typePset = typePsets.find(
        ({ Name }) => Name === occurencePset.Name,
      );

      if (typePset) {
        for (const prop of typePset.Properties) {
          const name = prop.Name?.value;
          const existingProp = occurencePset.Properties.find(
            ({ Name }: { Name: { value: string } }) => Name.value === name,
          );
          if (!existingProp) occurencePset.Properties.push(prop);
        }
      }

      sets.push(occurencePset);
    }

    return sets;
  }

  // IFCPROPERTYBOUNDEDVALUE are not supported yet
  // IFCPROPERTYTABLEVALUE are not supported yet
  // Work must to be done to convert numerical value units to IDS-nominated standard units https://github.com/buildingSMART/IDS/blob/development/Documentation/UserManual/units.md
  private evalValue(attrs: Record<string, any>, checks?: IDSCheck[]) {
    const valueKey = this.getValueKey(attrs) as any;
    const valueAttr = attrs[valueKey];
    if (this.value) {
      if (!valueAttr) {
        checks?.push({
          parameter: "Value",
          currentValue: null,
          pass: false,
          requiredValue: this.value.parameter,
        });
        return false;
      }

      const facetValue = structuredClone(this.value);
      if (valueAttr.name === "IFCLABEL" && facetValue.type === "simple") {
        facetValue.parameter = String(facetValue.parameter);
      }

      if (
        (attrs.type === WEBIFC.IFCPROPERTYLISTVALUE ||
          attrs.type === WEBIFC.IFCPROPERTYENUMERATEDVALUE) &&
        Array.isArray(valueAttr)
      ) {
        const values = valueAttr.map((value) => value.value);
        const matchingValue = valueAttr.find((value) => {
          if (!facetValue) return false;
          return this.evalRequirement(value.value, facetValue, "Value");
        });
        checks?.push({
          currentValue: values as any,
          pass: !!matchingValue,
          parameter: "Value",
          requiredValue: facetValue.parameter,
        });
        return !!matchingValue;
      }

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
    if (valueAttr.type === 3 && valueAttr.value === 2) {
      checks?.push({
        parameter: "Value",
        currentValue: null,
        pass: false,
        requiredValue: null,
      });
      return false;
    }

    // IDSDocs: An empty string is considered false
    if (valueAttr.type === 1 && valueAttr.value.trim() === "") {
      checks?.push({
        parameter: "Value",
        currentValue: "",
        pass: false,
        requiredValue: null,
      });
      return false;
    }

    return true;
  }

  private evalDataType(attrs: Record<string, any>, checks?: IDSCheck[]) {
    if (!this.dataType) return true;
    const valueKey = this.getValueKey(attrs) as any;
    const valueAttr = attrs[valueKey];

    if (!valueAttr) {
      checks?.push({
        parameter: "DataType",
        currentValue: null,
        pass: false,
        requiredValue: this.dataType,
      });
      return false;
    }

    if (
      (attrs.type === WEBIFC.IFCPROPERTYLISTVALUE ||
        attrs.type === WEBIFC.IFCPROPERTYENUMERATEDVALUE) &&
      Array.isArray(valueAttr) &&
      valueAttr[0]
    ) {
      const valueType = valueAttr[0].name;
      const result = this.evalRequirement(
        valueType,
        {
          type: "simple",
          parameter: this.dataType,
        },
        "DataType",
        checks,
      );
      return result;
    }

    const result = this.evalRequirement(
      valueAttr.name,
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
