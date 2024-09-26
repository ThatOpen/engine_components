import { Component, Components, Event } from "../../core";
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

  readonly onProgress = new Event<number>();

  /** {@link Component.enabled} */
  enabled = true;

  list = new Map<string, IfcQueryGroup>();

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
  }

  import(data: { [groupID: string]: any }) {
    for (const id in data) {
      const group = new IfcQueryGroup(this.components);
      group.import(data[id]);
      this.list.set(id, group);
    }
  }

  export() {
    const result: { [groupID: string]: any } = {};
    for (const [id, group] of this.list) {
      result[id] = group.export();
    }
    return result;
  }

  create() {
    const group = new IfcQueryGroup(this.components);
    this.list.set(group.id, group);
    return group;
  }

  delete(id: string) {
    this.list.delete(id);
  }
}
