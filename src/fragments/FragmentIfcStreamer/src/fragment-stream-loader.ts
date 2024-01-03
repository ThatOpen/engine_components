import * as THREE from "three";
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
  private _fragmentsByGeometry: {
    [modelID: string]: { [geometryID: number]: FRAG.Items[][] };
  } = {};

  private _baseMaterial = new THREE.MeshLambertMaterial();

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
            for (const id in result) {
              const idNum = parseInt(id, 10);
              if (
                !this._fragmentsByGeometry[modelID] ||
                !this._fragmentsByGeometry[modelID][idNum]
              ) {
                continue;
              }

              const itemsGroups = this._fragmentsByGeometry[modelID][idNum];

              const { index, normal, position } = result[id];

              const geom = new THREE.BufferGeometry() as FRAG.IFragmentGeometry;

              const posAttr = new THREE.BufferAttribute(position, 3);
              const norAttr = new THREE.BufferAttribute(normal, 3);
              const blockBuffer = new Uint8Array(position.length / 3);
              const blockID = new THREE.BufferAttribute(blockBuffer, 1);

              geom.setAttribute("position", posAttr);
              geom.setAttribute("normal", norAttr);
              geom.setAttribute("blockID", blockID);

              geom.setIndex(Array.from(index));

              for (const items of itemsGroups) {
                const fragment = new FRAG.Fragment(
                  geom,
                  this._baseMaterial,
                  items.length
                );

                for (let i = 0; i < items.length; i++) {
                  const item = items[i];
                  fragment.setInstance(i, item);
                }

                this.components.scene.get().add(fragment.mesh);
              }
            }
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

    const fragData: {
      [geomID: number]: { id: string; transformation: number[] }[];
    } = {};

    for (const asset of assets) {
      const id = asset.id.toString();
      for (const { transformation, geometryID } of asset.geometries) {
        if (!fragData[geometryID]) {
          fragData[geometryID] = [];
        }
        fragData[geometryID].push({ id, transformation });
      }
    }

    for (const id in fragData) {
      const data = fragData[id];

      const items: FRAG.Items[] = [];
      for (const { transformation, id } of data) {
        const transform = new THREE.Matrix4().fromArray(transformation);
        items.push({ ids: [id], transform });
      }

      if (!this._fragmentsByGeometry[modelID]) {
        this._fragmentsByGeometry[modelID] = {};
      }
      if (!this._fragmentsByGeometry[modelID][id]) {
        this._fragmentsByGeometry[modelID][id] = [];
      }
      this._fragmentsByGeometry[modelID][id].push(items);
    }
  }

  get() {}

  update() {}
}

ToolComponent.libraryUUIDs.add(FragmentStreamLoader.uuid);
