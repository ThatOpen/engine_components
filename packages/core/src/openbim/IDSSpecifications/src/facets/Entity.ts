import * as FRAGS from "@thatopen/fragments";
import { IDSFacet } from "../types";
import { Components } from "../../../../core/Components";

// https://github.com/buildingSMART/IDS/blob/development/Documentation/UserManual/entity-facet.md

export class IDSEntityFacet extends IDSFacet {
  type: number;
  private _predefinedType?: string;

  set predefinedType(predefinedType: string | undefined) {
    this._predefinedType = predefinedType?.toUpperCase();
  }
  get predefinedType() {
    return this._predefinedType;
  }

  constructor(components: Components, type: number) {
    super(components);
    this.type = type;
  }

  async getEntities(
    model: FRAGS.FragmentsGroup,
    collector: FRAGS.IfcProperties = {},
  ) {
    const entities = await model.getAllPropertiesOfType(this.type);
    if (!entities) return [];
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
    this.testResult = { pass: [], fail: [] };
    for (const expressID in entities) {
      const attrs = entities[expressID];
      if (!attrs.GlobalId?.value) continue;

      // Check if entity type matches
      const typeMatches = attrs.type === this.type;

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
