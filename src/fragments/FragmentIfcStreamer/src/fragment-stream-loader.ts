import * as THREE from "three";
import * as FRAG from "bim-fragment";
import { FragmentsGroup } from "bim-fragment";
import { Component, Event } from "../../../base-types";
import { StreamedGeometries, StreamedAsset } from "./base-types";
import { Components, ToolComponent } from "../../../core";
import { GeometryCullerRenderer } from "./geometry-culler-renderer";
import { FragmentManager } from "../../FragmentManager";

interface StreamedInstance {
  id: number;
  color: number[];
  transformation: number[];
}

type StreamedInstances = Map<number, StreamedInstance[]>;

export interface StreamLoaderSettings {
  assets: StreamedAsset[];
  geometries: StreamedGeometries;
  globalDataFileId: string;
}

export class FragmentStreamLoader extends Component<any> {
  enabled = true;

  culler: GeometryCullerRenderer;

  readonly onFragmentsDeleted = new Event<FRAG.Fragment[]>();
  readonly onFragmentsLoaded = new Event<FRAG.Fragment[]>();

  models: {
    [modelID: string]: {
      assets: StreamedAsset[];
      geometries: StreamedGeometries;
    };
  } = {};

  serializer = new FRAG.StreamSerializer();

  url = "http://dev.api.thatopen.com/storage?fileId=";

  // private _hardlySeenGeometries: THREE.InstancedMesh;

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

    // const hardlyGeometry = new THREE.BoxGeometry();
    // this._hardlySeenGeometries = new THREE.InstancedMesh();

    this.culler = new GeometryCullerRenderer(components);

    this.culler.onViewUpdated.add(async ({ seen, unseen }) => {
      await this.handleSeenGeometries(seen);
      await this.handleUnseenGeometries(unseen);
    });
  }

  static readonly uuid = "22437e8d-9dbc-4b99-a04f-d2da280d50c8" as const;

  async load(settings: StreamLoaderSettings) {
    const { assets, geometries, globalDataFileId } = settings;

    const groupUrl = this.url + globalDataFileId;
    const groupData = await fetch(groupUrl);
    const groupArrayBuffer = await groupData.arrayBuffer();
    const groupBuffer = new Uint8Array(groupArrayBuffer);
    const fragments = this.components.tools.get(FragmentManager);
    const group = await fragments.load(groupBuffer);

    this.culler.add(group.uuid, assets, geometries);
    this.models[group.uuid] = { assets, geometries };
    const instances: StreamedInstances = new Map();

    for (const asset of assets) {
      const id = asset.id;
      for (const { transformation, geometryID, color } of asset.geometries) {
        if (!instances.has(geometryID)) {
          instances.set(geometryID, []);
        }
        const current = instances.get(geometryID);
        if (!current) {
          throw new Error("Malformed instances");
        }
        current.push({ id, transformation, color });
      }
    }

    this._geometryInstances[group.uuid] = instances;

    // Move it to DT
    this.culler.needsUpdate = true;

    // console.log("----Group----");
    // console.log(group);
  }

  get() {}

  update() {}

  // getMesh(): THREE.Mesh {
  //   const box = this.culler.boxes.getMesh();
  //   if (box) {
  // this.components.scene.get().add(box);
  // const boundingBox = new THREE.Box3().setFromObject(box);
  // // @ts-ignore
  // const bHelper = new THREE.Box3Helper(boundingBox, 0xff0000);
  // this.components.scene.get().add(bHelper);
  // }
  // return box;
  // }
  // getSphere() {
  //   return this.culler.boxes.getSphere();
  // }

  applyTransformation(modelID: string, transform: THREE.Matrix4) {
    if (!this.models[modelID]) {
      throw new Error(`Model ${modelID} not found!`);
    }
    const { assets } = this.models[modelID];
    this.culler.applyTransformation(modelID, assets, transform);
  }

  private async handleSeenGeometries(seen: { [modelID: string]: Set<number> }) {
    for (const modelID in seen) {
      const fragments = this.components.tools.get(FragmentManager);
      const group = fragments.groups.find((group) => group.uuid === modelID);
      if (!group) {
        throw new Error("Fragment group not found!");
      }

      const ids = new Set(seen[modelID]);
      const { geometries } = this.models[modelID];

      const files = new Set<string>();

      for (const id of ids) {
        const geometry = geometries[id];
        if (!geometry) {
          throw new Error("Geometry not found");
        }
        if (geometry.geometryFile) {
          const file = geometry.geometryFile;
          files.add(file);
        }
      }

      for (const file of files) {
        const url = this.url + file;
        const fetched = await fetch(url);
        const buffer = await fetched.arrayBuffer();
        const bytes = new Uint8Array(buffer);
        const result = this.serializer.import(bytes);

        const loaded: FRAG.Fragment[] = [];

        if (result) {
          for (const [geometryID, { position, index, normal }] of result) {
            if (!ids.has(geometryID)) continue;

            if (
              !this._geometryInstances[modelID] ||
              !this._geometryInstances[modelID].has(geometryID)
            ) {
              continue;
            }

            const geoms = this._geometryInstances[modelID];
            const instances = geoms.get(geometryID);

            if (!instances) {
              throw new Error("Instances not found!");
            }

            const geom = new THREE.BufferGeometry();

            const posAttr = new THREE.BufferAttribute(position, 3);
            const norAttr = new THREE.BufferAttribute(normal, 3);
            const blockBuffer = new Uint8Array(position.length / 3);
            const blockID = new THREE.BufferAttribute(blockBuffer, 1);

            geom.setAttribute("position", posAttr);
            geom.setAttribute("normal", norAttr);
            geom.setAttribute("blockID", blockID);

            geom.setIndex(Array.from(index));

            // Separating opaque and transparent items is neccesary for Three.js

            const transp: StreamedInstance[] = [];
            const opaque: StreamedInstance[] = [];
            for (const instance of instances) {
              if (instance.color[3] === 1) {
                opaque.push(instance);
              } else {
                transp.push(instance);
              }
            }

            this.newFragment(group, geometryID, geom, transp, true, loaded);
            this.newFragment(group, geometryID, geom, opaque, false, loaded);
          }
        }

        if (loaded.length) {
          await this.onFragmentsLoaded.trigger(loaded);
        }
      }
    }
  }

  private async handleUnseenGeometries(unseen: { [p: string]: Set<number> }) {
    const deletedFragments: FRAG.Fragment[] = [];
    for (const modelID in unseen) {
      const fragments = this.components.tools.get(FragmentManager);
      const group = fragments.groups.find((group) => group.uuid === modelID);
      if (!group) {
        throw new Error("Fragment group not found!");
      }

      if (!this._loadedFragments[modelID]) continue;
      const loadedFrags = this._loadedFragments[modelID];
      const geometries = unseen[modelID];

      for (const geometryID of geometries) {
        if (!loadedFrags[geometryID]) continue;
        const frags = loadedFrags[geometryID];
        for (const frag of frags) {
          group.items.splice(group.items.indexOf(frag), 1);
          deletedFragments.push(frag);
        }
        delete loadedFrags[geometryID];
      }
    }

    if (deletedFragments.length) {
      await this.onFragmentsDeleted.trigger(deletedFragments);
    }

    for (const frag of deletedFragments) {
      frag.mesh.material = [] as THREE.Material[];
      frag.dispose(true);
    }
  }

  // private async handleHardlySeenGeometries() {}

  private newFragment(
    group: FragmentsGroup,
    geometryID: number,
    geometry: THREE.BufferGeometry,
    instances: StreamedInstance[],
    transparent: boolean,
    result: FRAG.Fragment[]
  ) {
    if (instances.length === 0) return;

    const transform = new THREE.Matrix4();
    const col = new THREE.Color();

    const material = transparent ? this._baseMaterialT : this._baseMaterial;
    const fragment = new FRAG.Fragment(geometry, material, instances.length);
    group.add(fragment.mesh);
    group.items.push(fragment);

    if (!this._loadedFragments[group.uuid]) {
      this._loadedFragments[group.uuid] = {};
    }
    const geoms = this._loadedFragments[group.uuid];
    if (!geoms[geometryID]) {
      geoms[geometryID] = [];
    }
    geoms[geometryID].push(fragment);

    for (let i = 0; i < instances.length; i++) {
      const { id, transformation, color } = instances[i];
      transform.fromArray(transformation);
      const [r, g, b] = color;
      col.setRGB(r, g, b, "srgb");
      fragment.add([{ id, colors: [col], transforms: [transform] }]);
    }

    fragment.mesh.instanceColor!.needsUpdate = true;
    fragment.mesh.updateMatrix();

    result.push(fragment);
  }
}

ToolComponent.libraryUUIDs.add(FragmentStreamLoader.uuid);
