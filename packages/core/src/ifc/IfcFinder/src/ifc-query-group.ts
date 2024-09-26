import * as FRAGS from "@thatopen/fragments";
import * as THREE from "three";
import { IfcFinderQuery } from "./ifc-finder-query";
import { Components } from "../../../core";

export class IfcQueryGroup {
  list = new Map<string, IfcFinderQuery>();

  id = THREE.MathUtils.generateUUID();

  mode: "combine" | "intersect" = "intersect";

  components: Components;

  get queries() {
    return new Set(this.list.values());
  }

  get items(): FRAGS.FragmentIdMap {
    // Returns intersection of getElements of all queries
    const maps: FRAGS.FragmentIdMap[] = [];
    for (const query of this.queries) {
      maps.push(query.items);
    }
    if (this.mode === "combine") {
      return FRAGS.FragmentUtils.combine(maps);
    }
    return FRAGS.FragmentUtils.intersect(maps);
  }

  constructor(components: Components) {
    this.components = components;
  }

  add(query: IfcFinderQuery) {
    if (this.list.has(query.name)) {
      throw new Error(
        `This group already has a query with the name ${query.name}.`,
      );
    }
    this.list.set(query.name, query);
  }

  clear(modelID: string) {
    for (const query of this.queries) {
      query.clear(modelID);
    }
  }

  import(data: {
    mode: "combine" | "intersect";
    id: string;
    queries: { [guid: string]: any };
  }) {
    this.mode = data.mode;
    this.id = data.id;
    for (const id in data.queries) {
      const query = IfcFinderQuery.import(this.components, data.queries[id]);
      if (query) {
        this.list.set(id, query);
      }
    }
  }

  export() {
    const queries: { [guid: string]: any } = {};
    for (const [id, query] of this.list) {
      queries[id] = query.export();
    }
    return {
      mode: this.mode,
      id: this.id,
      queries,
    };
  }

  async update(modelID: string, file: File) {
    for (const query of this.queries) {
      const needsUpdate = query.needsUpdate.get(modelID);
      if (needsUpdate === undefined || needsUpdate) {
        await query.update(modelID, file);
      }
    }
  }
}
