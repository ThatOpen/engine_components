import * as FRAGS from "@thatopen/fragments";
import { Components } from "../../../../core/Components";
import { IDSFacet } from "./Facet";
import { IDSFacetParameter } from "../types";
import { IfcCategoryMap } from "../../../../ifc";

// https://github.com/buildingSMART/IDS/blob/development/Documentation/UserManual/entity-facet.md

export class IDSEntity extends IDSFacet {
  name: IDSFacetParameter;
  predefinedType?: IDSFacetParameter;

  constructor(components: Components, name: IDSFacetParameter) {
    super(components);
    this.name = name;
  }

  async getEntities(
    model: FRAGS.FragmentsGroup,
    collector: FRAGS.IfcProperties = {},
  ) {
    const types = Object.entries(IfcCategoryMap);
    const typeIDs = types
      .filter(([, type]) => this.evalRequirement(type, this.name, "Name"))
      .map(([id]) => id);

    let entities: FRAGS.IfcProperties = {};
    for (const id of typeIDs) {
      const elements = await model.getAllPropertiesOfType(Number(id));
      if (elements) entities = { ...entities, ...elements };
    }

    if (!this.predefinedType) {
      for (const expressID in entities) {
        collector[expressID] = entities[expressID];
      }
      return Object.keys(entities).map(Number);
    }

    const result: number[] = [];
    for (const _expressID in entities) {
      const expressID = Number(_expressID);
      if (expressID in collector) continue;
      const attrs = entities[expressID];
      const validPredefinedType =
        attrs.PredefinedType?.value === this.predefinedType;
      if (validPredefinedType) {
        collector[expressID] = attrs;
        result.push(expressID);
      }
    }

    return result;
  }

  async test(entities: FRAGS.IfcProperties) {
    this.testResult = [];
    for (const expressID in entities) {
      const attrs = entities[expressID];
      if (!attrs.GlobalId?.value) continue;

      // Check if entity type matches
      const typeMatches = attrs.type === this.name;

      // Check if the predefined type matches
      let predefinedTypeMatches = true;
      if (typeMatches && this.predefinedType) {
        predefinedTypeMatches =
          attrs.PredefinedType?.value === this.predefinedType;
      }

      this.saveResult(attrs, typeMatches && predefinedTypeMatches);
    }

    return this.testResult;
  }
}
