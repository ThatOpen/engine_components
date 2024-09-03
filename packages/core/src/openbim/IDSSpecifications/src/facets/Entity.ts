import * as FRAGS from "@thatopen/fragments";
import { IDSCheckResult, IDSFacet } from "../types";

// https://github.com/buildingSMART/IDS/blob/development/Documentation/UserManual/entity-facet.md

export class IDSEntityFacet {
  type: number;
  private _predefinedType?: string;

  set predefinedType(predefinedType: string | undefined) {
    this._predefinedType = predefinedType?.toUpperCase();
  }
  get predefinedType() {
    return this._predefinedType;
  }

  constructor(type: number) {
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
      return Object.keys(entities) as unknown as number[];
    }
    const validEntities: number[] = [];
    for (const _expressID in entities) {
      const expressID = Number(_expressID);
      if (expressID in collector) continue;
      const attrs = entities[expressID];
      const validPredefinedType =
        attrs.PredefinedType?.value === this.predefinedType;
      if (validPredefinedType) {
        collector[expressID] = attrs;
        validEntities.push(expressID);
      }
    }
    return validEntities;
  }

  test(entities: FRAGS.IfcProperties) {
    const result: IDSCheckResult = { pass: [], fail: [] };
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

      if (typeMatches && predefinedTypeMatches) {
        result.pass.push(attrs.GlobalId.value);
      } else {
        result.fail.push(attrs.GlobalId.value);
      }
    }
    return result;
  }
}
