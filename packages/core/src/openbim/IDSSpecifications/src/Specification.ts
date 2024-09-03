import * as FRAGS from "@thatopen/fragments";
import { Components } from "../../../core/Components";
import { Component } from "../../../core/Types";
import { IDSCheckResult, IDSFacet, IfcVersion } from "./types";

export class IDSSpecification extends Component {
  name: string;
  ifcVersion: IfcVersion;
  identifier?: string | number;
  description?: string;
  instructions?: string;
  applicability: IDSFacet[] = [];
  requirements: IDSFacet[] = [];
  enabled = true;

  constructor(components: Components, name: string, ifcVersion: IfcVersion) {
    super(components);
    this.name = name;
    this.ifcVersion = ifcVersion;
  }

  addApplicability(applicability: IDSFacet) {
    this.applicability.push(applicability);
  }

  addRequirement(requirement: IDSFacet) {
    this.requirements.push(requirement);
  }

  check(model: FRAGS.FragmentsGroup) {
    if (!model.hasProperties)
      throw new Error(`${model.name || model.uuid} doesn't have properties`);
    const result: IDSCheckResult = { pass: {}, fail: {} };

    // Get applicable elements
    const entities: { [expressID: string]: Record<string, any> } = {};
    this.applicability.forEach((applicability) => {
      applicability.getEntities(model.properties, entities);
    });
    // return

    // Test applicable elements against requirements
    const requirementsResult: { [expressId: string]: boolean } = {};
    for (const expressID in entities) {
      requirementsResult[expressID] = true;
    }
    this.requirements.forEach((requirement) => {
      const arrayEntities = Object.values(entities);
      const checkingElements = arrayEntities.filter(
        (entity) => requirementsResult[entity.expressID],
      );
      const test = requirement.test(model.properties, checkingElements);
      if (!test) {
        return;
      }
      for (const expressID in test.fail) {
        requirementsResult[expressID] = false;
      }
    });
    for (const expressID in requirementsResult) {
      const entity = entities[expressID];
      if (!entity) {
        continue;
      }
      if (requirementsResult[expressID]) {
        result.pass[expressID] = entity;
      } else {
        result.fail[expressID] = entity;
      }
    }
    return result;
  }

  resultToGlobalIds(facetResult: IdsSpecificationResult) {
    const result: { pass: string[]; fail: string[] } = { pass: [], fail: [] };
    const passed = Object.values(facetResult.pass);
    const failed = Object.values(facetResult.fail);
    result.pass = passed.map((entity) => {
      return entity.GlobalId.value;
    });
    result.fail = failed.map((entity) => {
      return entity.GlobalId.value;
    });
    return result;
  }

  resultToFragmentMap(
    models: FRAGS.FragmentsGroup[],
    facetResult: IDSCheckResult,
  ) {
    const result: {
      pass: { [fragmentID: string]: string[] };
      fail: { [fragmentID: string]: string[] };
    } = { pass: {}, fail: {} };
    models.forEach((model) => {
      const expressIDFragmentIDMap = model.expressIDFragmentIDMap;
      for (const expressID in facetResult.pass) {
        const fragmentID = expressIDFragmentIDMap[expressID];
        if (!fragmentID) {
          continue;
        }
        if (!result.pass[fragmentID]) {
          result.pass[fragmentID] = [];
        }
        result.pass[fragmentID].push(String(expressID));
      }
      for (const expressID in facetResult.fail) {
        const fragmentID = expressIDFragmentIDMap[expressID];
        if (!fragmentID) {
          continue;
        }
        if (!result.fail[fragmentID]) {
          result.fail[fragmentID] = [];
        }
        result.fail[fragmentID].push(String(expressID));
      }
    });
    return result;
  }

  highlightResult(
    result: {
      pass: { [fragmentID: string]: string[] };
      fail: { [fragmentID: string]: string[] };
    },
    applyTransparency = false,
  ) {
    const fragments = this.components.tools.get("Fragments") as
      | Fragments
      | undefined;
    if (!fragments) {
      return;
    }
    if (applyTransparency) {
      fragments.materials.apply(
        new MeshLambertMaterial({ transparent: true, opacity: 0.01 }),
      );
    }
    fragments.highlighter.highlightByID("ids-check-pass", result.pass);
    fragments.highlighter.highlightByID("ids-check-fail", result.fail);
  }
}
