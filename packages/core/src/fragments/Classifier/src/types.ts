import { ModelIdMap } from "../../FragmentsManager";
import { QueryTestConfig } from "../../ItemsFinder";

/**
 * Represents a query for a classification group.
 */
export interface ClassificationGroupQuery {
  /**
   * The name of the query from the finder to use in the group.
   */
  name: string;
  /**
   * Optional configuration for the query.
   */
  config?: QueryTestConfig;
}

/**
 * Represents the input structure for a classifier intersection operation. Defines a record where the keys are classification names and the values are arrays of group names within those classifications.
 */
export type ClassifierIntersectionInput = Record<string, string[]>;

/**
 * Represents the data structure for a classification group.
 */
export interface ClassificationGroupData {
  /**
   * The ModelIdMap that represents the static collection of items within the group.
   */
  map: ModelIdMap;
  /**
   * Optional query used to dynamically find items using the ItemsFinder. Some groups may only rely on static items.
   */
  query?: ClassificationGroupQuery;
  /**
   * Asynchronously retrieves the combined map of static and dynamically found items.
   */
  get(): Promise<ModelIdMap>;
}

/**
 * Configuration options for removing items from a classifier.
 */
export interface RemoveClassifierItemsConfig {
  /**
   * The name of the classification from which items should be removed.
   */
  classificationName?: string;
  /**
   * The name of the group within the classification from which items should be removed.
   */
  groupName?: string;
}

/**
 * Configuration options for adding a classification.
 */
export interface AddClassificationConfig {
  /**
   * Optional name of the classification to be added.
   */
  classificationName?: string;
  /**
   * Optional array of regular expressions representing model IDs.
   */
  modelIds?: RegExp[];
}

/**
 * Configuration interface for classifying item by relation values.
 */
export interface ClassifyItemRelationsConfig {
  /**
   * The attribute whose value will be used to create the group.
   */
  attribute?: string;
  /**
   * An array of regular expressions representing model IDs to be used in the aggregation process.
   */
  modelIds?: RegExp[];
}

// export interface ExportedClassification {
//   [system: string]: {
//     [groupName: string]: {
//       map: { [name: string]: number[] };
//       name: string;
//       id: number | null;
//     };
//   };
// }
