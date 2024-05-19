import * as OBC from "@thatopen/components";

export interface StreamedInstance {
  id: number;
  color: number[];
  transformation: number[];
}

export type StreamedInstances = Map<number, StreamedInstance[]>;

export interface StreamLoaderSettings {
  assets: OBC.StreamedAsset[];
  geometries: OBC.StreamedGeometries;
  globalDataFileId: string;
}

export interface StreamPropertiesSettings {
  ids: { [id: number]: number };
  types: { [type: number]: number[] };
  indexesFile: string;
}
