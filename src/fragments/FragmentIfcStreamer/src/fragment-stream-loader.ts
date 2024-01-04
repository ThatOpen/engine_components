import * as THREE from "three";
import * as FRAG from "bim-fragment";
import { Component } from "../../../base-types";
import { StreamedAsset, StreamedGeometries } from "./base-types";
import { Components, ToolComponent } from "../../../core";
import { GeometryCullerRenderer } from "./geometry-culler-renderer";

interface StreamedInstance {
  id: string;
  color: number[];
  transformation: number[];
}

interface StreamedInstances {
  [geometryID: number]: StreamedInstance[];
}

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

  private _geometryInstances: {
    [modelID: string]: StreamedInstances;
  } = {};

  private _loadedFragments: {
    [modelID: string]: { [geometryID: number]: FRAG.Fragment[] };
  } = {};

  private _baseMaterial = new THREE.MeshLambertMaterial();
  private _baseMaterialT = new THREE.MeshLambertMaterial({
    transparent: true,
    opacity: 0.5,
  });

  constructor(components: Components) {
    super(components);
    this.components.tools.add(FragmentStreamLoader.uuid, this);

    this.culler = new GeometryCullerRenderer(components);

    this.culler.onViewUpdated.add(async ({ seen, unseen }) => {
      await this.handleSeenGeometries(seen);
      await this.handleUnseenGeometries(unseen);
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

    const instances: StreamedInstances = {};

    for (const asset of assets) {
      const id = asset.id.toString();
      for (const { transformation, geometryID, color } of asset.geometries) {
        if (!instances[geometryID]) {
          instances[geometryID] = [];
        }
        instances[geometryID].push({ id, transformation, color });
      }
    }

    this._geometryInstances[modelID] = instances;
  }

  get() {}

  update() {}

  private async handleSeenGeometries(seen: { [modelID: string]: number[] }) {
    for (const modelID in seen) {
      const ids = new Set(seen[modelID]);
      const { geometries } = this.models[modelID];

      const files = new Set<string>();

      for (const id of ids) {
        const geometry = geometries[id] as any;
        if (!geometry) {
          throw new Error("Geometry not found");
        }
        if (geometry.geometryFile) {
          const file = geometry.geometryFile;
          files.add(file);
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
            const geometryID = parseInt(id, 10);
            if (!ids.has(geometryID)) continue;

            if (
              !this._geometryInstances[modelID] ||
              !this._geometryInstances[modelID][geometryID]
            ) {
              continue;
            }

            const geoms = this._geometryInstances[modelID];
            const instances = geoms[geometryID] || geoms[-geometryID];
            // const isTrans = geoms[geometryID] === undefined;

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

            // Separating opaque and transparent items is neccesary for Three.js

            const transparent: StreamedInstance[] = [];
            const opaque: StreamedInstance[] = [];
            for (const instance of instances) {
              if (instance.color[3] === 1) {
                opaque.push(instance);
              } else {
                transparent.push(instance);
              }
            }

            this.createFragment(modelID, geometryID, geom, transparent, true);
            this.createFragment(modelID, geometryID, geom, opaque, false);
          }
        }
      }
    }
  }

  private async handleUnseenGeometries(unseen: { [p: string]: number[] }) {
    for (const modelID in unseen) {
      if (!this._loadedFragments[modelID]) continue;
      const fragments = this._loadedFragments[modelID];
      const geometries = unseen[modelID];
      for (const geometryID of geometries) {
        if (!fragments[geometryID]) continue;
        const frags = fragments[geometryID];
        for (const frag of frags) {
          frag.mesh.material = [] as THREE.Material[];
          frag.dispose(true);
        }
        delete fragments[geometryID];
      }
    }
  }

  private createFragment(
    modelID: string,
    geometryID: number,
    geometry: FRAG.IFragmentGeometry,
    instances: StreamedInstance[],
    transparent: boolean
  ) {
    if (instances.length === 0) return;

    const transform = new THREE.Matrix4();
    const col = new THREE.Color();

    const material = transparent ? this._baseMaterialT : this._baseMaterial;
    const fragment = new FRAG.Fragment(geometry, material, instances.length);

    if (!this._loadedFragments[modelID]) {
      this._loadedFragments[modelID] = {};
    }
    const geoms = this._loadedFragments[modelID];
    if (!geoms[geometryID]) {
      geoms[geometryID] = [];
    }
    geoms[geometryID].push(fragment);

    for (let i = 0; i < instances.length; i++) {
      const { id, transformation, color } = instances[i];
      transform.fromArray(transformation);
      fragment.setInstance(i, { ids: [id], transform });
      const [r, g, b] = color;
      col.setRGB(r, g, b, "srgb");
      fragment.mesh.setColorAt(i, col);
    }

    fragment.mesh.instanceColor!.needsUpdate = true;
    this.components.scene.get().add(fragment.mesh);
  }
}

ToolComponent.libraryUUIDs.add(FragmentStreamLoader.uuid);
