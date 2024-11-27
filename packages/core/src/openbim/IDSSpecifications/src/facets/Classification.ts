import * as FRAGS from "@thatopen/fragments";
import * as WEBIFC from "web-ifc";
import { Components } from "../../../../core/Components";
import { IDSCheck, IDSCheckResult, IDSFacetParameter } from "../types";
import { IfcRelationsIndexer } from "../../../../ifc/IfcRelationsIndexer";
import { IDSFacet } from "./Facet";
import { getParameterXML } from "../exporters/parameter";

// https://github.com/buildingSMART/IDS/blob/development/Documentation/UserManual/classification-facet.md

export class IDSClassification extends IDSFacet {
  facetType = "Classification" as const;
  system: IDSFacetParameter;
  value?: IDSFacetParameter;
  uri?: string;

  constructor(components: Components, system: IDSFacetParameter) {
    super(components);
    this.system = system;
  }

  serialize(type: "applicability" | "requirement") {
    const systemXML = getParameterXML("System", this.system);
    const valueXML = getParameterXML("Value", this.value);
    let attributes = "";
    if (type === "requirement") {
      attributes += `cardinality="${this.cardinality}"`;
      attributes += this.uri ? `uri=${this.uri}` : "";
      attributes += this.instructions
        ? `instructions="${this.instructions}"`
        : "";
    }
    return `<ids:classification ${attributes}>
  ${systemXML}
  ${valueXML}
</ids:classification>`;
  }

  async getEntities(
    model: FRAGS.FragmentsGroup,
    collector: FRAGS.IfcProperties = {},
  ) {
    const result: number[] = [];

    const references = await model.getAllPropertiesOfType(
      WEBIFC.IFCCLASSIFICATIONREFERENCE,
    );

    const classifications = await model.getAllPropertiesOfType(
      WEBIFC.IFCCLASSIFICATION,
    );

    const systems = { ...references, ...classifications };

    const matchingClassifications: number[] = [];

    for (const id in systems) {
      const classificationID = Number(id);
      const attrs = await model.getProperties(classificationID);
      if (!attrs) continue;

      const referencedSourceID = attrs.ReferencedSource?.value;
      if (!referencedSourceID) continue;

      const classificationAttrs = await model.getProperties(referencedSourceID);
      if (!classificationAttrs) continue;

      const systemMatches = this.evalSystem(classificationAttrs);
      if (!systemMatches) continue;

      const valueMatches = this.evalValue(attrs);
      if (!valueMatches) continue;

      const uriMatches = this.evalURI(attrs);
      if (!uriMatches) continue;

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

      let missingClassification = true;
      const elementClassifications = await this.getSystems(model, expressID);

      const allSystemNames = elementClassifications
        .map((classification) => this.getSystemName(classification))
        .filter((system) => system) as string[];

      for (const classificationAttrs of elementClassifications) {
        const systemMatches = this.evalSystem(classificationAttrs, checks);
        if (!systemMatches) continue;
        missingClassification = false;

        if (!(this.value && this.system)) break;

        if (classificationAttrs.type !== WEBIFC.IFCCLASSIFICATIONREFERENCE) {
          continue;
        }

        const valueMatches =
          !this.value || this.evalValue(classificationAttrs, checks);

        const uriMatches =
          !this.uri || this.evalURI(classificationAttrs, checks);

        if (valueMatches && uriMatches) break;
      }

      if (missingClassification) {
        this.addCheckResult(
          {
            parameter: "System",
            currentValue: allSystemNames as any,
            requiredValue: this.system,
            pass: this.cardinality === "optional",
          },
          checks,
        );
      }

      result.pass = checks.every(({ pass }) => pass);
    }

    const result = [...this.testResult];
    this.testResult = [];
    return result;
  }

  private async processReferencedSource(
    model: FRAGS.FragmentsGroup,
    attrs: Record<string, any>,
  ) {
    const sourceID = attrs.ReferencedSource?.value;
    if (!sourceID) return null;
    const sourceAttrs = await model.getProperties(sourceID);
    if (!sourceAttrs) return null;
    if (sourceAttrs.type === WEBIFC.IFCCLASSIFICATIONREFERENCE) {
      sourceAttrs.ReferencedSource = await this.processReferencedSource(
        model,
        sourceAttrs,
      );
    }
    return sourceAttrs;
  }

  private async getSystems(model: FRAGS.FragmentsGroup, expressID: number) {
    const result: Record<string, any>[] = [];
    const indexer = this.components.get(IfcRelationsIndexer);
    const ocurrenceAssociations = indexer.getEntityRelations(
      model,
      expressID,
      "HasAssociations",
    );
    if (ocurrenceAssociations) {
      for (const id of ocurrenceAssociations) {
        const attrs = await model.getProperties(id);
        if (!attrs) continue;
        if (attrs.type === WEBIFC.IFCCLASSIFICATION) {
          result.push(attrs);
        }
        if (attrs.type === WEBIFC.IFCCLASSIFICATIONREFERENCE) {
          attrs.ReferencedSource = await this.processReferencedSource(
            model,
            attrs,
          );
          if (attrs.ReferencedSource) result.push(attrs);
        }
      }
    }

    // As occurence classifications prevail over type clasifications
    // the classification systems used by the occurrence are get
    // so type classifications are not included
    const occurrenceSystems = result
      .map((attrs) => {
        if (attrs.type === WEBIFC.IFCCLASSIFICATION) {
          return attrs.Name?.value;
        }
        if (attrs.type === WEBIFC.IFCCLASSIFICATIONREFERENCE) {
          return attrs.ReferencedSource?.Name?.value;
        }
        return null;
      })
      .filter((name) => name);

    const types = indexer.getEntityRelations(model, expressID, "IsTypedBy");
    if (!(types && types[0])) return result;
    const type = types[0];
    const typeAssociations = indexer.getEntityRelations(
      model,
      type,
      "HasAssociations",
    );
    if (typeAssociations) {
      for (const id of typeAssociations) {
        const attrs = await model.getProperties(id);
        if (!attrs) continue;
        if (attrs.type === WEBIFC.IFCCLASSIFICATION) {
          if (occurrenceSystems.includes(attrs.Name?.value)) continue;
          result.push(attrs);
        }
        if (attrs.type === WEBIFC.IFCCLASSIFICATIONREFERENCE) {
          attrs.ReferencedSource = await this.processReferencedSource(
            model,
            attrs,
          );
          if (attrs.ReferencedSource) result.push(attrs);
        }
      }
    }

    return result;
  }

  private getSystemName(attrs: Record<string, any>): string | null {
    if (attrs.type === WEBIFC.IFCCLASSIFICATION) {
      return attrs.Name?.value;
    }
    if (attrs.type === WEBIFC.IFCCLASSIFICATIONREFERENCE) {
      if (attrs.ReferencedSource?.type === WEBIFC.IFCCLASSIFICATIONREFERENCE) {
        return this.getSystemName(attrs.ReferencedSource);
      }
      if (attrs.ReferencedSource?.type === WEBIFC.IFCCLASSIFICATION) {
        return attrs.ReferencedSource.Name?.value;
      }
    }
    return null;
  }

  private getAllReferenceIdentifications(attrs: Record<string, any>) {
    if (attrs.type !== WEBIFC.IFCCLASSIFICATIONREFERENCE) return null;
    const identifications: string[] = [];
    if (attrs.Identification) identifications.push(attrs.Identification.value);
    if (attrs.ReferencedSource) {
      const identification = this.getAllReferenceIdentifications(
        attrs.ReferencedSource,
      );
      if (identification) identifications.push(...identification);
    }
    return identifications;
  }

  private evalSystem(attrs: Record<string, any>, checks?: IDSCheck[]) {
    const name = this.getSystemName(attrs);
    return this.evalRequirement(name, this.system, "System", checks);
  }

  private evalValue(attrs: any, checks?: IDSCheck[]) {
    if (!this.value) return true;
    const identifications = this.getAllReferenceIdentifications(attrs);
    if (!identifications) return false;
    const identifier = identifications.find((id) => {
      if (!this.value) return false;
      return this.evalRequirement(id, this.value, "Value");
    });
    if (checks) {
      this.addCheckResult(
        {
          parameter: "Value",
          currentValue: identifier ?? null,
          requiredValue: this.value,
          pass: !!identifier,
        },
        checks,
      );
    }
    return !!identifier;
  }

  private evalURI(attrs: any, checks?: IDSCheck[]) {
    if (!this.uri) return true;
    const result = this.evalRequirement(
      attrs.Location?.value,
      {
        type: "simple",
        parameter: this.uri,
      },
      "URI",
      checks,
    );
    return result;
  }
}
