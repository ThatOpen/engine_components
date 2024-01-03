export interface StreamedGeometries {
  [id: string]: {
    id: number;
    position: Float32Array;
    normal: Float32Array;
    index: Uint32Array;
    boundingBox: Float32Array;
    hasHoles: boolean;
  };
}

export interface StreamedAsset {
  id: number;
  geometries: {
    geometryID: number;
    transformation: number[];
    color: number[];
  }[];
}
