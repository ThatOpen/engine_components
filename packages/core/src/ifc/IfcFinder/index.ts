import { Component, Components } from "../../core";
import { IfcQueryGroup } from "./src/ifc-query-group";
import { IfcFinderQuery } from "./src";

export * from "./src";

/**
 * Component to make text queries in the IFC.
 */
export class IfcFinder extends Component {
  /**
   * A unique identifier for the component.
   * This UUID is used to register the component within the Components system.
   */
  static readonly uuid = "0da7ad77-f734-42ca-942f-a074adfd1e3a" as const;

  /** {@link Component.enabled} */
  enabled = true;

  /**
   * List of all created {@link IfcQueryGroup} instances.
   */
  list = new Map<string, IfcQueryGroup>();

  /**
   * List of all queries from all created {@link IfcQueryGroup} instances.
   */
  get queries() {
    // return list of all queries traversing all groups
    const queries = new Set<IfcFinderQuery>();
    for (const [, group] of this.list) {
      for (const query of group.queries) {
        queries.add(query);
      }
    }
    return queries;
  }

  constructor(components: Components) {
    super(components);
    components.add(IfcFinder.uuid, this);
  }

  /**
   * Imports all the query groups provided in the given data. You can generate this data to save the result of queries and persist it over time.
   * @param data The data containing the serialized query groups to import.
   */
  import(data: { [groupID: string]: any }) {
    for (const id in data) {
      const group = new IfcQueryGroup(this.components);
      group.import(data[id]);
      this.list.set(id, group);
    }
  }

  /**
   * Exports all the query groups created. You can then import this data back using the import method.
   */
  export() {
    const result: { [groupID: string]: any } = {};
    for (const [id, group] of this.list) {
      result[id] = group.export();
    }
    return result;
  }

  /**
   * Creates a new {@link IfcQueryGroup}.
   */
  create() {
    const group = new IfcQueryGroup(this.components);
    this.list.set(group.id, group);
    return group;
  }

  /**
   * Creates the {@link IfcQueryGroup} with the given ID.
   */
  delete(id: string) {
    this.list.delete(id);
  }

  /**
   * Deletes all {@link IfcQueryGroup} instances.
   */
  clear() {
    this.list.clear();
  }
}
