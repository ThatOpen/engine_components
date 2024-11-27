import * as FRAGS from "@thatopen/fragments";
import { Components } from "../../../../core/Components";
import { IDSFacet } from "./Facet";
import { IDSCheck, IDSCheckResult, IDSFacetParameter } from "../types";
import { IfcCategoryMap, IfcRelationsIndexer } from "../../../../ifc";
import { getParameterXML } from "../exporters/parameter";

// https://github.com/buildingSMART/IDS/blob/development/Documentation/UserManual/entity-facet.md

export class IDSEntity extends IDSFacet {
  facetType = "Entity" as const;
  name: IDSFacetParameter;
  predefinedType?: IDSFacetParameter;

  constructor(components: Components, name: IDSFacetParameter) {
    super(components);
    this.name = name;
  }

  serialize(type: "applicability" | "requirement") {
    const nameXML = getParameterXML("Name", this.name);
    const predefinedTypeXML = getParameterXML("Name", this.predefinedType);
    let attributes = "";
    if (type === "requirement") {
      attributes += `cardinality="${this.cardinality}"`;
      attributes += this.instructions
        ? `instructions="${this.instructions}"`
        : "";
    }
    return `<ids:entity ${attributes}>
  ${nameXML}
  ${predefinedTypeXML}
</ids:entity>`;
  }

  // IFCSURFACESTYLEREFRACTION is not present in the FragmentsGroup
  // IFCSURFACESTYLERENDERING is not present in the FragmentsGroup
  async getEntities(
    model: FRAGS.FragmentsGroup,
    collector: FRAGS.IfcProperties = {},
  ) {
    const types = Object.entries(IfcCategoryMap);
    const typeIDs: number[] = [];
    for (const [type] of types) {
      const validName = await this.evalName({ type });
      if (!validName) continue;
      typeIDs.push(Number(type));
    }

    let entities: FRAGS.IfcProperties = {};
    for (const id of typeIDs) {
      const elements = await model.getAllPropertiesOfType(id);
      if (elements) entities = { ...entities, ...elements };
    }

    if (!this.predefinedType) {
      for (const expressID in entities) {
        if (expressID in collector) continue;
        collector[expressID] = entities[expressID];
      }
      return Object.keys(entities).map(Number);
    }

    const result: number[] = [];
    for (const _expressID in entities) {
      const expressID = Number(_expressID);
      if (expressID in collector) continue;
      const attrs = entities[expressID];
      const validPredefinedType = await this.evalPredefinedType(model, attrs);
      if (validPredefinedType) {
        collector[expressID] = attrs;
        result.push(expressID);
      }
    }

    return result;
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

      await this.evalName(attrs, checks);
      await this.evalPredefinedType(model, attrs, checks);

      result.pass = checks.every(({ pass }) => pass);
    }

    return this.testResult;
  }

  protected async evalName(attrs: any, checks?: IDSCheck[]) {
    const entityName = IfcCategoryMap[attrs.type];
    const result = this.evalRequirement(entityName, this.name, "Name", checks);
    return result;
  }

  protected async evalPredefinedType(
    model: FRAGS.FragmentsGroup,
    attrs: any,
    checks?: IDSCheck[],
  ) {
    if (!this.predefinedType) return null;
    const indexer = this.components.get(IfcRelationsIndexer);
    const isRequirementUserDefined =
      typeof this.predefinedType.parameter === "string" &&
      this.predefinedType.parameter === "USERDEFINED";
    let value = attrs.PredefinedType?.value;

    if (value === "USERDEFINED" && !isRequirementUserDefined) {
      const attrNames = Object.keys(attrs);
      const result = attrNames.find((str) =>
        /^((?!Predefined).)*Type$/.test(str),
      );
      value = result ? attrs[result]?.value : "USERDEFINED";
    }

    if (!value) {
      const types = indexer.getEntityRelations(
        model,
        attrs.expressID,
        "IsTypedBy",
      );
      if (types && types[0]) {
        const typeAttrs = await model.getProperties(types[0]);
        if (typeAttrs) {
          value = typeAttrs.PredefinedType?.value;
          if (value === "USERDEFINED" && !isRequirementUserDefined) {
            const attrNames = Object.keys(typeAttrs);
            const result = attrNames.find((str) =>
              /^((?!Predefined).)*Type$/.test(str),
            );
            value = result ? typeAttrs[result]?.value : "USERDEFINED";
          }
        }
      }
    }

    const result = this.evalRequirement(
      value,
      this.predefinedType,
      "PredefinedType",
      checks,
    );

    return result;
  }
}
