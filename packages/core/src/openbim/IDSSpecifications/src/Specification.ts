import * as FRAGS from "@thatopen/fragments";
import { Components } from "../../../core/Components";
import { DataSet } from "../../../core/Types";
import { IDSCheckResult } from "./types";
import { UUID } from "../../../utils";
import { IDSFacet } from "./facets";

export class IDSSpecification {
  name: string;
  ifcVersion: FRAGS.IfcSchema;
  identifier?: string | number;
  description?: string;
  instructions?: string;
  applicability = new DataSet<IDSFacet>();
  requirements = new DataSet<IDSFacet>();

  readonly guid = UUID.create();

  protected components: Components;

  constructor(
    components: Components,
    name: string,
    ifcVersion: FRAGS.IfcSchema,
  ) {
    this.components = components;
    this.name = name;
    this.ifcVersion = ifcVersion;
  }

  async check(model: FRAGS.FragmentsGroup) {
    const result: IDSCheckResult[] = [];

    // Get applicable elements
    const entities: FRAGS.IfcProperties = {};
    for (const app of this.applicability) {
      await app.getEntities(model, entities);
    }

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
