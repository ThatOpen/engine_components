import * as FRAGS from "@thatopen/fragments";
import * as THREE from "three";
import { IfcFinderQuery } from "./ifc-finder-query";

export class IfcQueryGroup {
  list = new Map<string, IfcFinderQuery>();

  uuid = THREE.MathUtils.generateUUID();

  mode: "combine" | "intersect" = "intersect";

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

  async update(modelID: string, file: File) {
    for (const query of this.queries) {
      const needsUpdate = query.needsUpdate.get(modelID);
      if (needsUpdate === undefined || needsUpdate) {
        await query.update(modelID, file);
      }
    }
  }
}
