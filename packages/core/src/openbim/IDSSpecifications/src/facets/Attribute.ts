import * as FRAGS from "@thatopen/fragments";
import { IDSCheck, IDSCheckResult, IDSFacetParameter } from "../types";
import { Components } from "../../../../core/Components";
import { IDSFacet } from "./Facet";
import { getParameterXML } from "../exporters/parameter";

// https://github.com/buildingSMART/IDS/blob/development/Documentation/UserManual/attribute-facet.md

export class IDSAttribute extends IDSFacet {
  facetType = "Attribute" as const;
  name: IDSFacetParameter;
  value?: IDSFacetParameter;

  constructor(components: Components, name: IDSFacetParameter) {
    super(components);
    this.name = name;
  }

  serialize(type: "applicability" | "requirement") {
    const nameXML = getParameterXML("Name", this.name);
    const valueXML = getParameterXML("Value", this.value);
    let attributes = "";
    if (type === "requirement") {
      attributes += `cardinality="${this.cardinality}"`;
      attributes += this.instructions
        ? `instructions="${this.instructions}"`
        : "";
    }
    return `<ids:attribute ${attributes}>
  ${nameXML}
  ${valueXML}
</ids:attribute>`;
  }

  // This can be very ineficcient as we do not have an easy way to get an entity based on an attribute
  // Right now, all entities must be iterated.
  // When the new IfcEntitiesFinder comes, this can become easier.
  // This may be greatly increase in performance if the applicability has any of the other facets and this is applied the latest
  async getEntities() {
    return [];
  }
  // async getEntities(
  //   model: FRAGS.FragmentsGroup,
  //   collector: FRAGS.IfcProperties = {},
  // ) {
  //   return [];
  //   // for (const expressID in model) {
  //   //   if (collector[expressID]) continue;
  //   //   const entity = model[expressID];
  //   //   // Check if the attribute exists
  //   //   const attribute = entity[this.name];
  //   //   const attributeExists = !!attribute;
  //   //   // Check if the attribute value matches
  //   //   let valueMatches = true;
  //   //   if (attributeExists && this.value && this.value.value) {
  //   //     if (this.value.type === "simpleValue") {
  //   //       valueMatches = attribute.value === this.value.value;
  //   //     }
  //   //     if (this.value.type === "restriction") {
  //   //       const regex = new RegExp(this.value.value);
  //   //       valueMatches = regex.test(attribute.value);
  //   //     }
  //   //   }
  //   //   if (attributeExists && valueMatches) {
  //   //     collector[entity.expressID] = entity;
  //   //   }
  //   // }
  // }

  // https://github.com/buildingSMART/IDS/tree/development/Documentation/ImplementersDocumentation/TestCases/attribute
  // Test cases from buildingSMART repo have been tested and they all match with the expected result
  // All invalid cases have been treated as failures
  // FragmentsGroup do not hold some of the entities used in the tests
  async test(entities: FRAGS.IfcProperties) {
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

      // Check if the attribute exists
      const attrNames = Object.keys(attrs);
      const matchingAttributes = attrNames.filter((name) => {
        const nameMatches = this.evalRequirement(name, this.name, "Name");
        const attrValue = attrs[name];
        // IDSDocs: Attributes with null values always fail
        if (nameMatches && attrValue === null) {
          if (
            this.cardinality === "optional" ||
            this.cardinality === "prohibited"
          ) {
            return true;
          }
          return false;
        }
        // IDSDocs: Attributes with a logical unknown always fail
        if (nameMatches && attrValue?.type === 3 && attrValue.value === 2) {
          return false;
        }
        // IDSDocs: Attributes with an empty list always fail
        if (nameMatches && Array.isArray(attrValue) && attrValue.length === 0) {
          return false;
        }
        // IDSDocs: Attributes with empty strings always fail
        if (
          nameMatches &&
          attrValue?.type === 1 &&
          attrValue.value.trim() === ""
        ) {
          return false;
        }
        return nameMatches;
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
      if (this.value) {
        if (matchingAttributes[0]) {
          const attribute = attrs[matchingAttributes[0]];
          // Value checks always fail for objects
          const isRef = attribute?.type === 5;
          if (isRef) {
            checks.push({
              parameter: "Value",
              currentValue: null,
              requiredValue: this.value.parameter,
              pass: this.cardinality === "prohibited",
            });
          } else {
            this.evalRequirement(
              attribute ? attribute.value : null,
              this.value,
              "Value",
              checks,
            );
          }
        } else {
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
