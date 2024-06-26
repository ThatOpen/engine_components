interface GeometrySettings {
  /** The bounding box of the geometry as a Float32Array. */
  boundingBox: Float32Array;
  /** A boolean indicating whether the geometry has holes. */
  hasHoles: boolean;
}

export interface StreamedGeometries {
  [id: number]: GeometrySettings;
}

/**
 * A streamed asset, which consists of multiple geometries. Each geometry in the asset is identified by a unique number (geometryID), and contains information about its transformation and color.
 */
export interface StreamedAsset {
  id: number;
  /** An array of geometries associated with the asset. */
  geometries: Array<{
    geometryID: number;
    /** The transformation matrix of the geometry. */
    transformation: number[];
    color: number[];
  }>;
}

export type GeometryTileFileName = `${string}-${number}`;
export type GlobalDataFileName = `${string}-global`;

export interface GeometryTilesJson {
  assets: Array<StreamedAsset>;
  geometries: {
    [id: number]: GeometrySettings & {
      /** path to the geometry data file. Must have the index of the file as suffix. `-0` */
      geometryFile: GeometryTileFileName;
    };
  };
  /** path to the global data file. must have `-global` suffix. */
  globalDataFileId: GlobalDataFileName;
}
