import * as FRAGS from "@thatopen/fragments";
import * as WEBIFC from "web-ifc";
import { Components } from "../../../../core/Components";
import { IDSFacet, IDSFacetParameter } from "../types";
import { IfcRelationsIndexer } from "../../../../ifc/IfcRelationsIndexer";

// https://github.com/buildingSMART/IDS/blob/development/Documentation/UserManual/classification-facet.md

export class IDSClassificationFacet extends IDSFacet {
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

      systemMatches = classificationAttrs.Name?.value === this.system.value;
      if (!systemMatches) continue;

      if (this.value) {
        valueMatches = attrs.Identification?.value === this.value.value;
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
    this.testResult = { pass: [], fail: [] };
    const indexer = this.components.get(IfcRelationsIndexer);
    for (const _expressID in entities) {
      const expressID = Number(_expressID);
      const attrs = entities[expressID];
      if (!attrs.GlobalId?.value) continue;

      let matches = false;

      const associations = indexer.getEntityRelations(
        model,
        expressID,
        "HasAssociations",
      );
      if (!associations) {
        this.saveResult(attrs, matches);
        continue;
      }

      for (const associationID of associations) {
        const associationAttrs = await model.getProperties(associationID);
        if (!associationAttrs) continue;
        if (associationAttrs.type !== WEBIFC.IFCCLASSIFICATIONREFERENCE)
          continue;

        const referencedSourceID = associationAttrs.ReferencedSource?.value;
        if (!referencedSourceID) continue;

        const classificationAttrs =
          await model.getProperties(referencedSourceID);
        if (!classificationAttrs) continue;

        let systemMatches = true;
        let valueMatches = true;
        let uriMatches = true;

        systemMatches = classificationAttrs.Name?.value === this.system.value;
        if (!systemMatches) continue;

        if (this.value) {
          valueMatches = attrs.Identification?.value === this.value.value;
          if (!valueMatches) continue;
        }
        if (this.uri) {
          uriMatches = attrs.Location?.value === this.uri;
          if (!uriMatches) continue;
        }

        matches = true;
        break;
      }

      this.saveResult(attrs, matches);
    }

    return this.testResult;
  }
}
