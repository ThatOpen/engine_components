import * as FRAGS from "@thatopen/fragments";
import { IfcFinderRule, SerializedQuery } from "./types";
import { IfcFinderQuery } from "./ifc-finder-query";
import { Components } from "../../../core";
import { FragmentsManager } from "../../../fragments";

/**
 * A query that checks the direct attributes of IFC items.
 */
export class IfcBasicQuery extends IfcFinderQuery {
  /**
   * {@link IfcFinderQuery.name}
   */
  name: string;

  /**
   * The type of this query.
   */
  static type = "IfcBasicQuery" as const;

  /**
   * {@link IfcFinderQuery.items}
   */
  get items() {
    const fragments = this.components.get(FragmentsManager);
    const maps: FRAGS.FragmentIdMap[] = [];
    for (const modelID in this.ids) {
      const ids = this.ids[modelID];
      const found = fragments.groups.get(modelID);
      if (!found) {
        console.warn(`Model ${modelID} not found!`);
        continue;
      }
      const map = found.getFragmentMap(ids);
      maps.push(map);
    }
    return FRAGS.FragmentUtils.combine(maps);
  }

  constructor(
    components: Components,
    data: {
      name: string;
      rules: IfcFinderRule[];
      inclusive: boolean;
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
    data.type = IfcBasicQuery.type;
    return data;
  }

  /**
   * {@link IfcFinderQuery.update}
   */
  async update(modelID: string, file: File) {
    this.ids[modelID] = new Set<number>();
    await this.findInFile(modelID, file);
    this.needsUpdate.set(modelID, false);
  }

  protected findInLines(modelID: string, lines: string[]) {
    for (const line of lines) {
      const filtersPass = this.testRules(line);
      if (filtersPass) {
        const id = this.getIdFromLine(line);
        this.addID(modelID, id);
      }
    }
  }
}

IfcFinderQuery.importers.set(
  IfcBasicQuery.type,
  (components: Components, data: SerializedQuery) => {
    const query = new IfcBasicQuery(components, {
      name: data.name,
      rules: IfcFinderQuery.importRules(data.rules),
      inclusive: data.inclusive,
    });
    query.ids = IfcFinderQuery.importIds(data);
    return query;
  },
);
