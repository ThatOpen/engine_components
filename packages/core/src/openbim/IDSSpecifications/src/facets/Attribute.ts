import { IDSFacetParameter, IDSItemCheckResult } from "../types";
import { Components } from "../../../../core/Components";
import { IDSFacet } from "./Facet";
import { getParameterXML } from "../exporters/parameter";
import {
  FragmentsManager,
  ModelIdDataMap,
  ModelIdMap,
} from "../../../../fragments";

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
    return `<attribute ${attributes}>
  ${nameXML}
  ${valueXML}
</attribute>`;
  }

  // This can be very ineficcient as we do not have an easy way to get an entity based on an attribute
  // Right now, all entities must be iterated.
  // When the new IfcEntitiesFinder comes, this can become easier.
  // This may be greatly increase in performance if the applicability has any of the other facets and this is applied the latest
  async getEntities() {}
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
  async test(items: ModelIdMap, collector: ModelIdDataMap<IDSItemCheckResult>) {
    const fragments = this._components.get(FragmentsManager);
    for (const [modelId, localIds] of Object.entries(items)) {
      const model = fragments.list.get(modelId);
      if (!model) continue;
      const data = await model.getItemsData([...localIds]);
      for (const item of data) {
        const checks = this.getItemChecks(collector, modelId, item);
        if (!checks) continue;

        const attrNames = Object.keys(item);
        const matchingAttributes = attrNames.filter((name) => {
          const nameMatches = this.evalRequirement(name, this.name, "Name");
          if (!nameMatches) return false;

          const attribute = item[name];
          if (Array.isArray(attribute)) return true;

          // IDSDocs: Attributes with null values always fail
          if (attribute === null || attribute.value === null) {
            if (
              this.cardinality === "optional" ||
              this.cardinality === "prohibited"
            ) {
              return true;
            }
            return false;
          }

          // IDSDocs: Attributes with a logical unknown always fail
          // TODO: Can this be replicated with Fragments 2.0?
          // if (nameMatches && attribute?.type === 3 && attribute.value === 2) {
          //   return false;
          // }

          // IDSDocs: Attributes with an empty list always fail
          // TODO: How to know for sure if the attribute value is an array
          if (Array.isArray(attribute.value) && attribute.value.length === 0) {
            return false;
          }

          // IDSDocs: Attributes with empty strings always fail
          if (
            typeof attribute.value === "string" &&
            attribute.value.trim() === ""
          ) {
            return false;
          }

          return nameMatches;
        });

        const attributeMatches = matchingAttributes.length > 0;

        checks.push({
          parameter: "Name",
          currentValue: attributeMatches ? matchingAttributes[0] : null,
          requiredValue: this.name,
          pass:
            this.cardinality === "prohibited"
              ? !attributeMatches
              : attributeMatches,
        });

        // Check if the attribute value matches
        if (this.value) {
          if (matchingAttributes[0]) {
            const attribute = item[matchingAttributes[0]];
            if (Array.isArray(attribute)) {
              checks.push({
                parameter: "Value",
                currentValue: null,
                requiredValue: this.value,
                pass: this.cardinality === "prohibited",
              });
            } else {
              // IDSDocs: Value checks always fail for objects
              const isRef = Array.isArray(attribute.value);
              if (isRef) {
                checks.push({
                  parameter: "Value",
                  currentValue: null,
                  requiredValue: this.value,
                  pass: this.cardinality === "prohibited",
                });
              } else {
                this.evalRequirement(
                  attribute.value,
                  this.value,
                  "Value",
                  checks,
                );
              }
            }
          } else {
            checks.push({
              parameter: "Value",
              currentValue: null,
              requiredValue: this.value,
              pass: this.cardinality === "prohibited",
            });
          }
        }
      }
    }
  }
}
