import * as FRAGS from "@thatopen/fragments";
import { Components } from "../../../core/Components";
import { DataSet } from "../../../core/Types";
import { IDSCheckResult, IfcVersion } from "./types";
import { UUID } from "../../../utils";
import { IDSFacet } from "./facets";

export class IDSSpecification {
  name: string;
  ifcVersion = new Set<IfcVersion>();
  identifier? = UUID.create();
  description?: string;
  instructions?: string;
  requirementsDescription?: string;
  applicability = new DataSet<IDSFacet>();
  requirements = new DataSet<IDSFacet>();

  protected components: Components;

  constructor(components: Components, name: string, ifcVersion: IfcVersion[]) {
    this.components = components;
    this.name = name;
    for (const version of ifcVersion) {
      this.ifcVersion.add(version);
    }
  }

  async test(model: FRAGS.FragmentsGroup) {
    let result: IDSCheckResult[] = [];

    if (this.requirements.size === 0) return result;

    // Get applicable elements
    const entities: FRAGS.IfcProperties = {};
    for (const facet of this.applicability) {
      await facet.getEntities(model, entities);
    }

    // Test applicable elements against requirements
    const requirement = [...this.requirements][0];
    result = await requirement.test(entities, model);
    return result;
    // const requirementsResult: { [expressId: string]: boolean } = {};
    // for (const expressID in entities) {
    //   requirementsResult[expressID] = true;
    // }

    // for (const requirement of this.requirements) {
    //   const arrayEntities = Object.values(entities);
    //   const checkingElements = arrayEntities.filter(
    //     (entity) => requirementsResult[entity.expressID],
    //   );
    //   const test = await requirement.test(checkingElements, model);
    //   for (const expressID in test.fail) {
    //     requirementsResult[expressID] = false;
    //   }
    // }

    // for (const expressID in requirementsResult) {
    //   const entity = entities[expressID];
    //   if (!entity) continue;
    //   if (requirementsResult[expressID]) {
    //     result.pass[expressID] = entity;
    //   } else {
    //     result.fail[expressID] = entity;
    //   }
    // }
  }

  serialize() {
    const name = `name="${this.name}"`;
    const identifier = this.identifier ? `identifier="${this.identifier}"` : "";

    const description = this.description
      ? `description="${this.description}"`
      : "";

    const instructions = this.instructions
      ? `instructions="${this.instructions}"`
      : "";

    const xml = `<ids:specification ifcVersion="${[...this.ifcVersion].join(" ")}" ${name} ${identifier} ${description} ${instructions}>
      <ids:applicability minOccurs="1" maxOccurs="unbounded">
        ${[...this.applicability].map((facet) => facet.serialize("applicability"))}
      </ids:applicability>
      <ids:requirements>
        ${[...this.requirements].map((facet) => facet.serialize("requirement"))}
      </ids:requirements>
    </ids:specification>`;
    return xml;
  }
}
