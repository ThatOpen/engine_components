import * as FRAGS from "@thatopen/fragments";
import * as THREE from "three";
import { IfcFinderQuery } from "./ifc-finder-query";
import { Components } from "../../../core";

/**
 * A group of queries to perform searches in one or many IFC files.
 */
export class IfcQueryGroup {
  /**
   * The list of queries contained in this group.
   */
  list = new Map<string, IfcFinderQuery>();

  /**
   * A unique string to identify this group instance.
   */
  id = THREE.MathUtils.generateUUID();

  /**
   * The way this group works when retrieving items.
   * - Combine: returns the sum of all items of all queries.
   * - Intersect: returns only the common elements of all queries.
   */
  mode: "combine" | "intersect" = "intersect";

  private _components: Components;

  /**
   * The list of unique queries contained in this group.
   */
  get queries() {
    return new Set(this.list.values());
  }

  /**
   * The items of all the queries contained in this group. The returned data depends on {@link IfcQueryGroup.mode}.
   */
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
    this._components = components;
  }

  /**
   * Adds a new query to this group.
   * @param query the query to add.
   */
  add(query: IfcFinderQuery) {
    if (this.list.has(query.name)) {
      throw new Error(
        `This group already has a query with the name ${query.name}.`,
      );
    }
    this.list.set(query.name, query);
  }

  /**
   * Clears the data of the given modelID of all queries contained in this group. If no modelID is provided, clears all data.
   * @param modelID the model whose data to remove.
   */
  clear(modelID?: string) {
    for (const query of this.queries) {
      query.clear(modelID);
    }
  }

  /**
   * Imports data that has been previously exported through {@link IfcQueryGroup.export}.
   * @param data the serializable object used to persist a group's data.
   */
  import(data: {
    mode: "combine" | "intersect";
    id: string;
    queries: { [guid: string]: any };
  }) {
    this.mode = data.mode;
    this.id = data.id;
    for (const id in data.queries) {
      const query = IfcFinderQuery.import(this._components, data.queries[id]);
      if (query) {
        this.list.set(id, query);
      }
    }
  }

  /**
   * Exports all the data of this group, so that it can be persisted and imported later using {@link IfcQueryGroup.import}.
   */
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

  /**
   * Updates all the queries contained in this group that need an update for the given file. It will skip those where {@link IfcFinderQuery.needsUpdate} is false.
   * @param modelID the identifier used to refer to the given file.
   * @param file the file to process.
   */
  async update(modelID: string, file: File) {
    for (const query of this.queries) {
      const needsUpdate = query.needsUpdate.get(modelID);
      if (needsUpdate === undefined || needsUpdate) {
        await query.update(modelID, file);
      }
    }
  }
}
