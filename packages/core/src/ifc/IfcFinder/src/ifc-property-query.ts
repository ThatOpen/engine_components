import * as FRAGS from "@thatopen/fragments";
import { IfcFinderQuery } from "./ifc-finder-query";
import { IfcOperatorRule, IfcPropertyRule, SerializedQuery } from "./types";
import { Components } from "../../../core";
import { IfcRelationsIndexer } from "../../IfcRelationsIndexer";
import { FragmentsManager } from "../../../fragments";

/**
 * A query that checks the properties in the property sets assigned to IFC items.
 */
export class IfcPropertyQuery extends IfcFinderQuery {
  /**
   * {@link IfcFinderQuery.name}
   */
  name: string;

  /**
   * The type of this query.
   */
  static type = "IfcPropertyQuery" as const;

  private psets: string[] = [];

  /**
   * {@link IfcFinderQuery.items}
   */
  get items() {
    // Use the indexer to get all items related to the found psets
    const indexer = this.components.get(IfcRelationsIndexer);
    const fragments = this.components.get(FragmentsManager);
    const maps: FRAGS.FragmentIdMap[] = [];
    for (const modelID in this.ids) {
      const model = fragments.groups.get(modelID);
      if (!model) {
        console.log(`Model not found: ${modelID}.`);
        continue;
      }
      const ids = this.ids[modelID];
      for (const id of ids) {
        const elements = indexer.getEntityRelations(
          modelID,
          id,
          "DefinesOcurrence",
        );
        if (elements) {
          const map = model.getFragmentMap(elements);
          maps.push(map);
        }
      }
    }
    return FRAGS.FragmentUtils.combine(maps);
  }

  constructor(
    components: Components,
    data: {
      name: string;
      inclusive: boolean;
      rules: (IfcPropertyRule | IfcOperatorRule)[];
    },
  ) {
    super(components);
    this.name = data.name;
    this.rules = data.rules;
    this.inclusive = data.inclusive;
  }

  /**
   * {@link IfcFinderQuery.export}
   */
  export() {
    const data = this.getData();
    data.type = IfcPropertyQuery.type;
    return data;
  }

  /**
   * {@link IfcFinderQuery.update}
   */
  async update(modelID: string, file: File) {
    // 1. Gather all propertysinglevalues that match the filters
    // also gather all ifcpropertysets and save them in this.psets
    await this.findInFile(modelID, file);

    // Now, let's see which psets contain the found ifcpropertysinglevalues
    const psetIDs = new Set<number>();
    for (const pset of this.psets) {
      const attrs = this.getAttributesFromLine(pset);
      if (attrs === null) {
        continue;
      }

      const idsString = attrs[4]
        .replace("(", "[")
        .replace(")", "]")
        .replace(/#/g, "");

      const containedPropertySingleValues = JSON.parse(idsString) as number[];

      for (const id of containedPropertySingleValues) {
        const ids = this.ids[modelID];
        if (ids && ids.has(id)) {
          const psetID = this.getIdFromLine(pset);
          psetIDs.add(psetID);
          break;
        }
      }
    }

    this.ids[modelID] = psetIDs;
    this.psets = [];

    this.needsUpdate.set(modelID, false);
  }

  protected findInLines(modelID: string, lines: string[]) {
    for (const line of lines) {
      const category = this.getCategoryFromLine(line);

      // If it's pset, gather it
      if (category === "IfcPropertySet") {
        this.psets.push(line);
        continue;
      }

      // Otherwise, only process property single values
      if (category !== "IfcPropertySingleValue") {
        continue;
      }

      // Check if property filters apply
      const filtersPass = this.testRules(line);

      if (filtersPass) {
        const id = this.getIdFromLine(line);
        this.addID(modelID, id);
      }
    }
  }
}

IfcFinderQuery.importers.set(
  IfcPropertyQuery.type,
  (components: Components, data: SerializedQuery) => {
    type PropRules = (IfcPropertyRule | IfcOperatorRule)[];
    const query = new IfcPropertyQuery(components, {
      name: data.name,
      inclusive: data.inclusive,
      rules: IfcFinderQuery.importRules(data.rules) as PropRules,
    });
    query.ids = IfcFinderQuery.importIds(data);
    return query;
  },
);
