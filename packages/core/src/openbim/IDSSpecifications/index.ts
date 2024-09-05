import * as FRAGS from "@thatopen/fragments";
import { XMLParser } from "fast-xml-parser";
import { Component, DataMap } from "../../core/Types";
import { IDSFacet, IDSInfo, IDSSpecification } from "./src";
import { Components } from "../../core";
import {
  createEntityFacets,
  createAttributeFacets,
  createClassificationFacets,
} from "./src/importers";

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

  create(name: string, ifcVersion: FRAGS.IfcSchema[]) {
    const specification = new IDSSpecification(
      this.components,
      name,
      ifcVersion,
    );

    this.list.set(specification.identifier!, specification);

    return specification;
  }

  load(data: string) {
    const result: IDSSpecification[] = [];
    const ids = IDSSpecifications.xmlParser.parse(data).ids;
    const { specifications } = ids;
    if (specifications && specifications.specification) {
      const specs = Array.isArray(specifications.specification)
        ? specifications.specification
        : [specifications.specification];

      for (const spec of specs) {
        const { name, ifcVersion } = spec;
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

        if (requirements) {
          const { maxOccurs, ...rest } = requirements;
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
            }
          }
        }

        if (applicabilities.length > 0 && reqs.length > 0) {
          const specification = this.create(name, ifcVersion.split(/\s+/));
          specification.applicability.add(...applicabilities);
          specification.requirements.add(...reqs);
          result.push(specification);
        }
      }
    }
    return result;
  }

  export(
    info: IDSInfo,
    specifications: Iterable<IDSSpecification> = this.list.values(),
  ) {}
}

export * from "./src";
