import * as FRAGS from "@thatopen/fragments";
import { IDSCheck, IDSCheckResult, IDSFacetParameter } from "../types";
import { Components } from "../../../../core/Components";
import { IDSFacet } from "./Facet";

// https://github.com/buildingSMART/IDS/blob/development/Documentation/UserManual/attribute-facet.md

export class IDSAttribute extends IDSFacet {
  name: IDSFacetParameter;
  value?: IDSFacetParameter;

  constructor(components: Components, name: IDSFacetParameter) {
    super(components);
    this.name = name;
  }

  // This can be very ineficcient as we do not have an easy way to get an entity based on an attribute
  // Right now, all entities must be iterated.
  // When the new IfcEntitiesFinder comes, this can become easier.
  // This may be greatly increase in performance if the applicability has any of the other facets and this is applied the latest
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
    this.testResult = [];
    for (const _expressID in entities) {
      const expressID = Number(_expressID);
      const attrs = entities[expressID];

      const checks: IDSCheck[] = [];
      const result: IDSCheckResult = {
        expressID,
        pass: false,
        checks,
      };

      this.testResult.push(result);

      // Check if the attribute exists
      const attrNames = Object.keys(attrs);
      const matchingAttributes = attrNames.filter((name) => {
        const value = attrs[name];
        if (value === null) {
          if (
            this.cardinality === "optional" ||
            this.cardinality === "prohibited"
          ) {
            return true;
          }
          return false;
        }
        return this.evalRequirement(name, this.name, "Name");
      });

      const attributeMatches = matchingAttributes.length > 0;

      checks.push({
        parameter: "Name",
        currentValue: attributeMatches ? matchingAttributes[0] : null,
        requiredValue: this.name.parameter,
        pass:
          this.cardinality === "prohibited"
            ? !attributeMatches
            : attributeMatches,
      });

      // Check if the attribute value matches
      let valueMatches = true;
      if (this.value) {
        if (matchingAttributes[0]) {
          const attribute = attrs[matchingAttributes[0]];
          const isRef = attribute?.type === 5;
          if (isRef) {
            valueMatches = false;
            checks.push({
              parameter: "Value",
              currentValue: null,
              requiredValue: this.value.parameter,
              pass: this.cardinality === "prohibited",
            });
          } else {
            valueMatches = this.evalRequirement(
              attribute ? attribute.value : null,
              this.value,
              "Value",
              checks,
            );
          }
        } else {
          valueMatches = false;
          checks.push({
            parameter: "Value",
            currentValue: null,
            requiredValue: this.value.parameter,
            pass: this.cardinality === "prohibited",
          });
        }
      }

      result.pass = checks.every(({ pass }) => pass);
    }

    const result = [...this.testResult];
    this.testResult = [];
    return result;
  }
}
