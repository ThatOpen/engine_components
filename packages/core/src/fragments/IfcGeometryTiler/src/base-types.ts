/**
 * A dictionary of geometries streamed from a server. Each geometry is identified by a unique number (id), and contains information about its bounding box, whether it has holes, and an optional file path for the geometry data.
 */
export interface StreamedGeometries {
  [id: number]: {
    /** The bounding box of the geometry as a Float32Array. */
    boundingBox: Float32Array;
    /** A boolean indicating whether the geometry has holes. */
    hasHoles: boolean;
    /** An optional file path for the geometry data. */
    geometryFile?: string;
  };
}

/**
 * A streamed asset, which consists of multiple geometries. Each geometry in the asset is identified by a unique number (geometryID), and contains information about its transformation and color.
 */
export interface StreamedAsset {
  /** The unique identifier of the asset. */
  id: number;
  /** An array of geometries associated with the asset. */
  geometries: {
    /** The unique identifier of the geometry. */
    geometryID: number;
    /** The transformation matrix of the geometry as a number array. */
    transformation: number[];
    /** The color of the geometry as a number array. */
    color: number[];
  }[];
}
