export interface StreamedGeometries {
  [id: number]: {
    boundingBox: Float32Array;
    hasHoles: boolean;
    geometryFile?: string;
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
