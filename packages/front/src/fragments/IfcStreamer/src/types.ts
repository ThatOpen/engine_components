import * as OBC from "@thatopen/components";

/**
 * Represents an instance of a streamed object.
 */
export interface StreamedInstance {
  /**
   * Unique identifier of the instance.
   */
  id: number;

  /**
   * Color of the instance.
   */
  color: number[];

  /**
   * Transformation matrix of the instance.
   */
  transformation: number[];
}

/**
 * A map of streamed instances, grouped by their unique identifier.
 */
export type StreamedInstances = Map<number, StreamedInstance[]>;

/**
 * Settings for the stream loader.
 */
export interface StreamLoaderSettings {
  /**
   * Array of streamed assets.
   */
  assets: OBC.StreamedAsset[];

  /**
   * Streamed geometries.
   */
  geometries: OBC.StreamedGeometries;

  /**
   * Identifier of the global data file.
   */
  globalDataFileId: string;
}

/**
 * Settings for the stream properties.
 */
export interface StreamPropertiesSettings {
  /**
   * Map of identifiers to numbers.
   */
  ids: { [id: number]: number };

  /**
   * Map of types to arrays of numbers.
   */
  types: { [type: number]: number[] };

  /**
   * Identifier of the indexes file.
   */
  indexesFile: string;
}
