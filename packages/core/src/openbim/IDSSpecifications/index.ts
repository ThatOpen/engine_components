import * as FRAGS from "@thatopen/fragments";
import { XMLParser } from "fast-xml-parser";
import { Component, DataMap } from "../../core/Types";
import {
  IDSCheckResult,
  IDSFacet,
  IDSInfo,
  IDSSpecification,
  IfcVersion,
} from "./src";
import { Components } from "../../core";
import {
  createEntityFacets,
  createAttributeFacets,
  createClassificationFacets,
} from "./src/importers";
import { createPropertyFacets } from "./src/importers/property";

/**
 * Component that manages Information Delivery Specification (IDS) data. It provides functionality for importing, exporting, and manipulating IDS data.
 */
export class IDSSpecifications extends Component {
  static uuid = "9f0b9f78-9b2e-481a-b766-2fbfd01f342c" as const;
  enabled = true;
  static xmlParser = new XMLParser({
    allowBooleanAttributes: true,
    attributeNamePrefix: "",
    ignoreAttributes: false,
    ignoreDeclaration: true,
    ignorePiTags: true,
    numberParseOptions: { leadingZeros: true, hex: true },
    parseAttributeValue: true,
    preserveOrder: false,
    processEntities: false,
    removeNSPrefix: true,
    trimValues: true,
  });

  constructor(components: Components) {
    super(components);
    components.add(IDSSpecifications.uuid, this);
  }

  readonly list = new DataMap<string, IDSSpecification>();

  /**
   * Retrieves a FragmentIdMap based on the given IDSCheckResult array.
   * The map separates the IDs into two categories: pass and fail.
   *
   * @param model - The FragmentsGroup model from which to retrieve the fragment map.
   * @param result - An array of IDSCheckResult objects, each representing a check result.
   *
   * @returns An object containing two properties:
   * - `pass`: A FragmentIdMap that passed the checks.
   * - `fail`: A FragmentIdMap that failed the checks.
   */
  getFragmentIdMap(model: FRAGS.FragmentsGroup, result: IDSCheckResult[]) {
    const passResults = result.filter((check) => check.pass);
    const passIDs = passResults.map((check) => check.expressID);
    const pass = model.getFragmentMap(passIDs);

    const failResults = result.filter((check) => !check.pass);
    const failIDs = failResults.map((check) => check.expressID);
    const fail = model.getFragmentMap(failIDs);

    return { pass, fail };
  }

  /**
   * Creates a new IDSSpecification instance and adds it to the list.
   *
   * @param name - The name of the IDSSpecification.
   * @param ifcVersion - An array of IfcVersion values that the specification supports.
   *
   * @returns The newly created IDSSpecification instance.
   */
  create(name: string, ifcVersion: IfcVersion[], identifier?: string) {
    const specification = new IDSSpecification(
      this.components,
      name,
      ifcVersion,
    );

    if (identifier) (specification.identifier as any) = identifier;
    this.list.set(specification.identifier, specification);
    return specification;
  }

  /**
   * Parses and processes an XML string containing Information Delivery Specification (IDS) data.
   * It creates IDSSpecification instances based on the parsed data and returns them in an array.
   * Also, the instances are added to the list array.
   *
   * @param data - The XML string to parse.
   *
   * @returns An array of IDSSpecification instances created from the parsed data.
   */
  load(data: string) {
    const result: IDSSpecification[] = [];
    const ids = IDSSpecifications.xmlParser.parse(data).ids;
    const { specifications } = ids;
    if (specifications && specifications.specification) {
      const specs = Array.isArray(specifications.specification)
        ? specifications.specification
        : [specifications.specification];

      for (const spec of specs) {
        const { name, ifcVersion, description, instructions, identifier } =
          spec;
        if (!(name && ifcVersion)) continue;

        const applicabilities: IDSFacet[] = [];
        const reqs: IDSFacet[] = [];

        const { applicability, requirements } = spec;

        if (applicability) {
          const { maxOccurs, ...rest } = applicability;
          const facets = Array.isArray(rest) ? rest : [rest];
          for (const facet of facets) {
            for (const facetName in facet) {
              const elements = Array.isArray(facet[facetName])
                ? facet[facetName]
                : [facet[facetName]];
              if (facetName === "entity") {
                const facets = createEntityFacets(this.components, elements);
                applicabilities.push(...facets);
              }
            }
          }
        }

        let requirementsDescription: string | undefined;

        if (requirements) {
          const { maxOccurs, ...rest } = requirements;
          requirementsDescription = requirements.description;
          const facets = Array.isArray(rest) ? rest : [rest];
          for (const facet of facets) {
            for (const facetName in facet) {
              const elements = Array.isArray(facet[facetName])
                ? facet[facetName]
                : [facet[facetName]];
              if (facetName === "entity") {
                const facets = createEntityFacets(this.components, elements);
                reqs.push(...facets);
              }
              if (facetName === "attribute") {
                const facets = createAttributeFacets(this.components, elements);
                reqs.push(...facets);
              }
              if (facetName === "classification") {
                const facets = createClassificationFacets(
                  this.components,
                  elements,
                );
                reqs.push(...facets);
              }
              if (facetName === "property") {
                const facets = createPropertyFacets(this.components, elements);
                reqs.push(...facets);
              }
            }
          }
        }

        if (applicabilities.length > 0 && reqs.length > 0) {
          const specification = this.create(
            name,
            ifcVersion.split(/\s+/),
            identifier,
          );
          specification.description = description;
          specification.instructions = instructions;
          specification.requirementsDescription = requirementsDescription;
          specification.applicability.add(...applicabilities);
          specification.requirements.add(...reqs);
          result.push(specification);
        }
      }
    }
    return result;
  }

  /**
   * Exports the IDSSpecifications data into an XML string.
   *
   * @param info - The metadata information for the exported XML.
   * @param specifications - An optional iterable of IDSSpecification instances to export.
   * If not provided, all specifications in the list will be exported.
   *
   * @returns A string containing the exported IDSSpecifications data in XML format.
   */
  export(
    info: IDSInfo,
    specifications: Iterable<IDSSpecification> = this.list.values(),
  ) {
    const _specifications = specifications ?? this.list;
    const xml = `<ids:ids xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://standards.buildingsmart.org/IDS http://standards.buildingsmart.org/IDS/1.0/ids.xsd" xmlns:ids="http://standards.buildingsmart.org/IDS">
  <!-- Made with That Open Engine ${Components.release} (https://github.com/thatopen/engine_components) -->
  <ids:info>
    <ids:title>${info.title}</ids:title>
    ${info.copyright ? `<ids:copyright>${info.copyright}</ids:copyright>` : ""}
    ${info.version ? `<ids:version>${info.version}</ids:version>` : ""}
    ${info.description ? `<ids:description>${info.description}</ids:description>` : ""}
    ${info.author ? `<ids:author>${info.author}</ids:author>` : ""}
    ${info.date ? `<ids:date>${info.date.toISOString().split("T")[0]}</ids:date>` : ""}
    ${info.purpose ? `<ids:purpose>${info.purpose}</ids:purpose>` : ""}
    ${info.milestone ? `<ids:milestone>${info.milestone}</ids:milestone>` : ""}
  </ids:info>
  <ids:specifications>
    ${[..._specifications].map((spec) => spec.serialize()).join("\n")}
  </ids:specifications>
</ids:ids>`;

    return xml;
  }
}

export * from "./src";
