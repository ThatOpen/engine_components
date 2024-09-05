import * as FRAGS from "@thatopen/fragments";
import { Components } from "../../../core/Components";
import { DataSet } from "../../../core/Types";
import { IDSCheckResult } from "./types";
import { UUID } from "../../../utils";
import { IDSFacet } from "./facets";

export class IDSSpecification {
  name: string;
  ifcVersion = new Set<FRAGS.IfcSchema>();
  identifier? = UUID.create();
  description?: string;
  instructions?: string;
  requirementsDescription?: string;
  applicability = new DataSet<IDSFacet>();
  requirements = new DataSet<IDSFacet>();

  protected components: Components;

  constructor(
    components: Components,
    name: string,
    ifcVersion: FRAGS.IfcSchema[],
  ) {
    this.components = components;
    this.name = name;
    for (const version of ifcVersion) {
      this.ifcVersion.add(version);
    }
  }

  async test(model: FRAGS.FragmentsGroup) {
    const result: IDSCheckResult[] = [];

    // Get applicable elements
    const entities: FRAGS.IfcProperties = {};
    for (const facet of this.applicability) {
      await facet.getEntities(model, entities);
    }

    console.log(entities);

    // Test applicable elements against requirements
    const requirementsResult: { [expressId: string]: boolean } = {};
    for (const expressID in entities) {
      requirementsResult[expressID] = true;
    }

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

    return result;
  }
}
