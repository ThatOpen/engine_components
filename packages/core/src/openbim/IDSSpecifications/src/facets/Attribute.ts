import * as FRAGS from "@thatopen/fragments";
import { IDSFacet, IDSFacetParameter } from "../types";
import { Components } from "../../../../core/Components";

// https://github.com/buildingSMART/IDS/blob/development/Documentation/UserManual/attribute-facet.md

export class IDSAttributeFacet extends IDSFacet {
  name: string;
  value?: IDSFacetParameter;

  constructor(components: Components, name: string) {
    super(components);
    this.name = name;
  }

  // This can be very ineficcient as we do not have an easy way to get an entity based on an attribute
  // Right now, all entities must be iterated.
  // When the new IfcEntitiesFinder comes, this can become easier.
  // This may be greatly increase in performance if the applicability has any of the other facets
  async getEntities(
    model: FRAGS.FragmentsGroup,
    collector: FRAGS.IfcProperties = {},
  ) {
    return [];
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

  async test(entities: FRAGS.IfcProperties) {
    this.testResult = { pass: [], fail: [] };
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
        if (this.value.value && this.value.type === "restriction") {
          const regex = new RegExp(String(this.value.value));
          valueMatches = regex.test(attribute.value);
        }
      }

      this.saveResult(attrs, attributeExists && valueMatches);
    }

    return this.testResult;
  }
}
