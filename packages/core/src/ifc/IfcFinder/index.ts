import { Component, Components, Event } from "../../core";
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

  constructor(components: Components) {
    super(components);
  }

  async find(file: File, queries: IfcFinderQuery[]) {
    let wasPreviousQueryUpdated = false;

    // Handle the rest of query parts
    for (let i = 0; i < queries.length; i++) {
      const query = queries[i];
      const previousQuery = queries[i - 1];

      if (!query.needsUpdate && !wasPreviousQueryUpdated) {
        // This query is up to date and previous queries were not updated, so let's skip it
        continue;
      }

      const queryInput = previousQuery?.lines || file;
      await query.update(queryInput);
      wasPreviousQueryUpdated = true;
    }

    const lastQuery = queries[queries.length - 1];
    return new Set(lastQuery.ids);
  }
}
