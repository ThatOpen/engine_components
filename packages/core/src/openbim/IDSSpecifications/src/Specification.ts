import * as FRAGS from "@thatopen/fragments";
import { Components } from "../../../core/Components";
import { IDSCheckResult, IDSSpecificationData, IfcVersion } from "./types";
import { UUID } from "../../../utils";
import { IDSFacet } from "./facets";
import { IDSSpecifications } from "..";
import { ModelIdMap } from "../../../fragments";
import { XML } from "../../../utils/xml";

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

  /**
   * Minimum number of applicable elements: `1` makes the specification
   * required, `0` optional. Read from `minOccurs` of the applicability.
   */
  minOccurs = 1;

  /**
   * Maximum number of applicable elements: `0` makes the specification
   * prohibited. Read from `maxOccurs` of the applicability.
   */
  maxOccurs: number | "unbounded" = "unbounded";
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
  async test(
    modelIds: RegExp[],
    config: { skipIfFails: boolean } = { skipIfFails: true },
  ) {
    return (await this.run(modelIds, config)).result;
  }

  /**
   * Tests the models and also applies the specification's cardinality
   * (`minOccurs` / `maxOccurs`): a required specification fails when too few
   * elements are applicable, a prohibited one fails when any is, and an
   * optional one may pass with none. Requirements of a prohibited
   * specification are not evaluated.
   *
   * @returns `pass` is the specification-level verdict, `applicable` the number
   * of applicable elements, and `result` the same per-element result as {@link test}.
   */
  async verify(
    modelIds: RegExp[],
    config: { skipIfFails: boolean } = { skipIfFails: true },
  ) {
    const { result, applicable } = await this.run(modelIds, config, true);
    const max = this.maxOccurs === "unbounded" ? Infinity : this.maxOccurs;
    let pass = applicable >= this.minOccurs && applicable <= max;
    if (max > 0) {
      for (const items of result.values()) {
        for (const item of items.values()) if (!item.pass) pass = false;
      }
    }
    return { pass, applicable, result };
  }

  private async run(
    modelIds: RegExp[],
    config: { skipIfFails: boolean },
    skipProhibitedRequirements = false,
  ) {
    const result: IDSCheckResult = new FRAGS.DataMap();

    // Get applicable elements
    const entities: ModelIdMap = {};
    const applicabilityPromises = [];
    for (const facet of this.applicability) {
      applicabilityPromises.push(facet.getEntities(modelIds, entities));
    }

    await Promise.all(applicabilityPromises);

    let applicable = 0;
    for (const ids of Object.values(entities)) applicable += ids.size;

    if (
      this.requirements.size === 0 ||
      (skipProhibitedRequirements && this.maxOccurs === 0)
    ) {
      return { result, applicable };
    }

    // Test applicable elements against requirements
    const requirementPromises = [];
    for (const requirement of this.requirements) {
      requirementPromises.push(requirement.test(entities, result, config));
    }

    await Promise.all(requirementPromises);
    return { result, applicable };
  }

  /**
   * Serializes the IDSSpecification instance into XML format.
   *
   * @remarks This method is not meant to be used directly. It is used by the IDSSpecifications component.
   *
   * @returns The XML representation of the IDSSpecification.
   */
  serialize() {
    const name = `name="${XML.escape(this.name)}"`;
    const identifier = this.identifier
      ? `identifier="${XML.escape(this.identifier)}"`
      : "";

    const description = this.description
      ? `description="${XML.escape(this.description)}"`
      : "";

    const instructions = this.instructions
      ? `instructions="${XML.escape(this.instructions)}"`
      : "";

    const xml = `<specification ifcVersion="${[...this.ifcVersion].join(" ")}" ${name} ${identifier} ${description} ${instructions}>
      <applicability minOccurs="${this.minOccurs}" maxOccurs="${this.maxOccurs}">
        ${[...this.applicability].map((facet) => facet.serialize("applicability")).join("\n")}
      </applicability>
      <requirements>
        ${[...this.requirements].map((facet) => facet.serialize("requirement")).join("\n")}
      </requirements>
    </specification>`;
    return xml;
  }
}
