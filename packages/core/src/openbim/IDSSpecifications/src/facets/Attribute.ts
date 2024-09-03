import * as FRAGS from "@thatopen/fragments";
import { IDSFacet, IDSFacetParameter, IDSCheckResult } from "../types";

// https://github.com/buildingSMART/IDS/blob/master/Documentation/attribute-facet.md
// Every entity in an IFC model has a list of standardised Attributes.
// Attributes are a limited set of fundamental data (usually less than 10) associated with all IFC entities.
// These are fixed by the IFC standard and cannot be customised.

export class IDSAttributeFacet {
  name: string;
  value?: IDSFacetParameter;

  constructor(name: string) {
    this.name = name;
  }

  // This can be very ineficcient as we do not have an easy way to get an entity based on an attribute
  // When the new IfcEntitiesFinder comes, this can become easier.
  async getEntities(
    model: FRAGS.FragmentsGroup,
    collector: { [expressID: string]: Record<string, any> },
  ) {
    // for (const expressID in model) {
    //   if (collector[expressID]) continue;
    //   const entity = model[expressID];
    //   // Check if the attribute exists
    //   const attribute = entity[this.name];
    //   const attributeExists = !!attribute;
    //   // Check if the attribute value matches
    //   let valueMatches = true;
    //   if (attributeExists && this.value && this.value.value) {
    //     if (this.value.type === "simpleValue") {
    //       valueMatches = attribute.value === this.value.value;
    //     }
    //     if (this.value.type === "restriction") {
    //       const regex = new RegExp(this.value.value);
    //       valueMatches = regex.test(attribute.value);
    //     }
    //   }
    //   if (attributeExists && valueMatches) {
    //     collector[entity.expressID] = entity;
    //   }
    // }
  }

  test(entities: FRAGS.IfcProperties) {
    const result: IDSCheckResult = { pass: [], fail: [] };
    for (const expressID in entities) {
      const attrs = entities[expressID];
      if (!attrs.GlobalId?.value) continue;

      // Check if the attribute exists
      const attribute = attrs[this.name];
      const attributeExists = !!attribute;

      // Check if the attribute value matches
      let valueMatches = true;
      if (attributeExists && this.value && this.value.value) {
        if (this.value.type === "simpleValue") {
          valueMatches = attribute.value === this.value.value;
        }
        if (this.value.type === "restriction") {
          const regex = new RegExp(this.value.value);
          valueMatches = regex.test(attribute.value);
        }
      }

      if (attributeExists && valueMatches) {
        result.pass.push(attrs.GlobalId.value);
      } else {
        result.fail.push(attrs.GlobalId.value);
      }
    }
    return result;
  }
}
