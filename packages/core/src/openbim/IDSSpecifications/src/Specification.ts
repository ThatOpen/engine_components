import * as FRAGS from "@thatopen/fragments";
import { Components } from "../../../core/Components";
import { IDSCheckResult, IDSSpecificationData, IfcVersion } from "./types";
import { UUID } from "../../../utils";
import { IDSFacet } from "./facets";
import { IDSSpecifications } from "..";
import { ModelIdMap } from "../../../fragments";

/**
 * Represents a single specification from the Information Delivery Specification (IDS) standard.
 *
 * @remarks This class provides methods for testing a model against the specification,
 * as well as serializing the specification into XML format.
 */
export class IDSSpecification implements IDSSpecificationData {
  name: string;
  ifcVersion = new Set<IfcVersion>();
  readonly identifier = UUID.create();
  description?: string;
  instructions?: string;
  requirementsDescription?: string;
  applicability = new FRAGS.DataSet<IDSFacet>();
  requirements = new FRAGS.DataSet<IDSFacet>();

  protected components: Components;

  constructor(components: Components, name: string, ifcVersion: IfcVersion[]) {
    this.components = components;
    this.name = name;
    for (const version of ifcVersion) {
      this.ifcVersion.add(version);
    }
  }

  set(data: Partial<IDSSpecificationData>) {
    const _data = data as any;
    const _this = this as any;
    for (const key in data) {
      if (key === "identifier") continue;
      const value = _data[key];
      if (key in this) _this[key] = value;
    }
    const manager = this.components.get(IDSSpecifications);
    manager.list.set(this.identifier, this);
    return this;
  }

  /**
   * Tests the model to test against the specification's requirements.
   *
   * @param modelId - The modelId of the model to be tested.
   * @returns An array representing the test results.
   * If no requirements are defined for the specification, an empty array is returned.
   */
  async test(modelIds: RegExp[]) {
    const result: IDSCheckResult = new FRAGS.DataMap();

    if (this.requirements.size === 0) return result;

    // Get applicable elements
    const entities: ModelIdMap = {};
    const applicabilityPromises = [];
    for (const facet of this.applicability) {
      applicabilityPromises.push(facet.getEntities(modelIds, entities));
    }

    await Promise.all(applicabilityPromises);

    // Test applicable elements against requirements
    const requirementPromises = [];
    for (const requirement of this.requirements) {
      requirementPromises.push(requirement.test(entities, result));
    }

    await Promise.all(requirementPromises);
    return result;
  }

  /**
   * Serializes the IDSSpecification instance into XML format.
   *
   * @remarks This method is not meant to be used directly. It is used by the IDSSpecifications component.
   *
   * @returns The XML representation of the IDSSpecification.
   */
  serialize() {
    const name = `name="${this.name}"`;
    const identifier = this.identifier ? `identifier="${this.identifier}"` : "";

    const description = this.description
      ? `description="${this.description}"`
      : "";

    const instructions = this.instructions
      ? `instructions="${this.instructions}"`
      : "";

    const xml = `<specification ifcVersion="${[...this.ifcVersion].join(" ")}" ${name} ${identifier} ${description} ${instructions}>
      <applicability minOccurs="1" maxOccurs="unbounded">
        ${[...this.applicability].map((facet) => facet.serialize("applicability")).join("\n")}
      </applicability>
      <requirements>
        ${[...this.requirements].map((facet) => facet.serialize("requirement")).join("\n")}
      </requirements>
    </specification>`;
    return xml;
  }
}
