import * as FRAG from "bim-fragment";
import { Component } from "../../../base-types";
import { StreamedAsset, StreamedGeometries } from "./base-types";
import { Components, ToolComponent } from "../../../core";
import { GeometryCullerRenderer } from "./geometry-culler-renderer";

export class FragmentStreamLoader extends Component<any> {
  enabled = true;

  culler: GeometryCullerRenderer;

  models: {
    [modelID: string]: {
      assets: StreamedAsset[];
      geometries: StreamedGeometries;
    };
  } = {};

  serializer = new FRAG.StreamSerializer();

  private _loadedFiles = new Set<string>();

  constructor(components: Components) {
    super(components);
    this.components.tools.add(FragmentStreamLoader.uuid, this);

    this.culler = new GeometryCullerRenderer(components);

    this.culler.onViewUpdated.add(async ({ seen }) => {
      for (const modelID in seen) {
        const ids = seen[modelID];
        const { geometries } = this.models[modelID];

        const files = new Set<string>();

        for (const id of ids) {
          const geometry = geometries[id] as any;
          if (!geometry) {
            throw new Error("Geometry not found");
          }
          if (geometry.geometryFile) {
            const file = geometry.geometryFile;
            if (!this._loadedFiles.has(file)) {
              this._loadedFiles.add(file);
              files.add(file);
            }
          }
        }

        const base = "http://dev.api.thatopen.com:3000/storage?fileId=";

        for (const file of files) {
          const url = base + file;
          const fetched = await fetch(url);
          const buffer = await fetched.arrayBuffer();
          const bytes = new Uint8Array(buffer);
          const result = this.serializer.import(bytes);

          if (result) {
            console.log(result);
          }
        }
      }
    });
  }

  static readonly uuid = "22437e8d-9dbc-4b99-a04f-d2da280d50c8" as const;

  async load(
    modelID: string,
    assets: StreamedAsset[],
    geometries: StreamedGeometries
  ) {
    this.culler.add(modelID, assets, geometries);
    this.models[modelID] = { assets, geometries };
  }

  get() {}

  update() {}
}

ToolComponent.libraryUUIDs.add(FragmentStreamLoader.uuid);
