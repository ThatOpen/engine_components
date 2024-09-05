import * as FRAGS from "@thatopen/fragments";
import * as WEBIFC from "web-ifc";
import { Components } from "../../../../core/Components";
import { IDSCheck, IDSCheckResult, IDSFacetParameter } from "../types";
import { IfcRelationsIndexer } from "../../../../ifc/IfcRelationsIndexer";
import { IDSFacet } from "./Facet";

// https://github.com/buildingSMART/IDS/blob/development/Documentation/UserManual/classification-facet.md

export class IDSClassification extends IDSFacet {
  system: IDSFacetParameter;
  value?: IDSFacetParameter;
  uri?: string;

  constructor(components: Components, system: IDSFacetParameter) {
    super(components);
    this.system = system;
  }

  async getEntities(
    model: FRAGS.FragmentsGroup,
    collector: FRAGS.IfcProperties = {},
  ) {
    const result: number[] = [];
    const classificationReferences = await model.getAllPropertiesOfType(
      WEBIFC.IFCCLASSIFICATIONREFERENCE,
    );

    if (!classificationReferences) return result;

    const matchingClassifications: number[] = [];

    for (const _classificationID in classificationReferences) {
      const classificationID = Number(_classificationID);
      const attrs = await model.getProperties(classificationID);
      if (!attrs) continue;

      const referencedSourceID = attrs.ReferencedSource?.value;
      if (!referencedSourceID) continue;

      const classificationAttrs = await model.getProperties(referencedSourceID);
      if (!classificationAttrs) continue;

      let systemMatches = true;
      let valueMatches = true;
      let uriMatches = true;

      systemMatches = classificationAttrs.Name?.value === this.system.parameter;
      if (!systemMatches) continue;

      if (this.value) {
        valueMatches = attrs.Identification?.value === this.value.parameter;
        if (!valueMatches) continue;
      }
      if (this.uri) {
        uriMatches = attrs.Location?.value === this.uri;
        if (!uriMatches) continue;
      }
      matchingClassifications.push(classificationID);
    }

    const indexer = this.components.get(IfcRelationsIndexer);

    for (const classificationID of matchingClassifications) {
      const expressIDs = indexer.getEntitiesWithRelation(
        model,
        "HasAssociations",
        classificationID,
      );

      for (const expressID of expressIDs) {
        if (expressID in collector) continue;
        const attrs = await model.getProperties(expressID);
        if (!attrs) continue;
        collector[expressID] = attrs;
        result.push(expressID);
      }
    }

    return result;
  }

  async test(entities: FRAGS.IfcProperties, model: FRAGS.FragmentsGroup) {
    this.testResult = [];
    const indexer = this.components.get(IfcRelationsIndexer);
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

      const associations = indexer.getEntityRelations(
        model,
        expressID,
        "HasAssociations",
      );
      if (!associations) {
        checks.push({
          parameter: "System",
          currentValue: null,
          requiredValue: this.system,
          pass: false,
        });
        continue;
      }

      for (const associationID of associations) {
        const associationAttrs = await model.getProperties(associationID);
        if (!associationAttrs) {
          checks.push({
            parameter: "System",
            currentValue: null,
            requiredValue: this.system,
            pass: false,
          });
          continue;
        }

        if (associationAttrs.type !== WEBIFC.IFCCLASSIFICATIONREFERENCE) {
          checks.push({
            parameter: "System",
            currentValue: null,
            requiredValue: this.system,
            pass: false,
          });
          continue;
        }

        const referencedSourceID = associationAttrs.ReferencedSource?.value;
        if (!referencedSourceID) {
          checks.push({
            parameter: "System",
            currentValue: null,
            requiredValue: this.system,
            pass: false,
          });
          continue;
        }

        const classificationAttrs =
          await model.getProperties(referencedSourceID);
        if (!classificationAttrs) {
          checks.push({
            parameter: "System",
            currentValue: null,
            requiredValue: this.system,
            pass: false,
          });
          continue;
        }

        let systemMatches = true;
        let valueMatches = true;
        let uriMatches = true;

        systemMatches = this.evalRequirement(
          classificationAttrs.Name?.value,
          this.system,
          "System",
          checks,
        );

        if (this.value) {
          const currentValue = attrs.Identification?.value;
          valueMatches = this.evalRequirement(
            currentValue,
            this.value,
            "System",
            checks,
          );
        }

        if (this.uri) {
          const currentValue = attrs.Location?.value;
          uriMatches = this.evalRequirement(
            currentValue,
            {
              type: "simple",
              parameter: this.uri,
            },
            "System",
            checks,
          );
        }

        if (systemMatches && valueMatches && uriMatches) break;
      }

      result.pass = checks.every(({ pass }) => pass);
    }

    const result = [...this.testResult];
    this.testResult = [];
    return result;
  }
}
