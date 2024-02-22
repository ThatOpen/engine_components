import * as THREE from "three";
import * as FRAG from "bim-fragment";
import { unzip } from "unzipit";
import { FragmentIdMap, FragmentsGroup } from "bim-fragment";
import { Component, Disposable, Event } from "../../../base-types";
import { StreamedGeometries, StreamedAsset } from "./base-types";
import { Components, ToolComponent } from "../../../core";
import { GeometryCullerRenderer } from "./geometry-culler-renderer";
import { FragmentManager } from "../../FragmentManager";
import { IfcPropertiesProcessor } from "../../../ifc";

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

export interface StreamPropertiesSettings {
  ids: { [id: number]: number };
  types: { [type: number]: number[] };
  indexesFile: string;
}

export class FragmentStreamLoader extends Component<any> implements Disposable {
  enabled = true;

  culler: GeometryCullerRenderer;

  readonly onFragmentsDeleted = new Event<FRAG.Fragment[]>();
  readonly onFragmentsLoaded = new Event<FRAG.Fragment[]>();
  readonly onDisposed = new Event<string>();

  models: {
    [modelID: string]: {
      assets: StreamedAsset[];
      geometries: StreamedGeometries;
    };
  } = {};

  serializer = new FRAG.StreamSerializer();

  private _url: string | null = null;

  private _isDisposing = false;

  // private _hardlySeenGeometries: THREE.InstancedMesh;

  private _geometryInstances: {
    [modelID: string]: StreamedInstances;
  } = {};

  private _loadedFragments: {
    [modelID: string]: { [geometryID: number]: FRAG.Fragment[] };
  } = {};

  // FragID, [model, geometryID, hiddenItems]
  private fragIDData = new Map<
    string,
    [FRAG.FragmentsGroup, number, Set<number>]
  >();

  private _baseMaterial = new THREE.MeshLambertMaterial();
  private _baseMaterialT = new THREE.MeshLambertMaterial({
    transparent: true,
    opacity: 0.5,
  });

  get url() {
    if (!this._url) {
      throw new Error("url must be set before using the streaming service!");
    }
    return this._url;
  }

  set url(value: string) {
    this._url = value;
  }

  constructor(components: Components) {
    super(components);
    this.components.tools.add(FragmentStreamLoader.uuid, this);

    // const hardlyGeometry = new THREE.BoxGeometry();
    // this._hardlySeenGeometries = new THREE.InstancedMesh();

    this.culler = new GeometryCullerRenderer(components);
    this.setupCullerEvents();
  }

  static readonly uuid = "22437e8d-9dbc-4b99-a04f-d2da280d50c8" as const;

  async dispose() {
    this._isDisposing = true;
    this.onFragmentsLoaded.reset();
    this.onFragmentsDeleted.reset();

    this.models = {};
    this._geometryInstances = {};
    // Disposed by fragment manager
    this._loadedFragments = {};
    this.fragIDData.clear();

    this._baseMaterial.dispose();
    this._baseMaterialT.dispose();

    await this.culler.dispose();
    this.culler = new GeometryCullerRenderer(this.components);
    this.setupCullerEvents();

    await this.onDisposed.trigger(FragmentStreamLoader.uuid);
    this.onDisposed.reset();
    this._isDisposing = false;
  }

  async load(
    settings: StreamLoaderSettings,
    coordinate = true,
    properties?: StreamPropertiesSettings
  ) {
    const { assets, geometries, globalDataFileId } = settings;

    const groupUrl = this.url + globalDataFileId;
    const groupData = await fetch(groupUrl);
    const groupArrayBuffer = await groupData.arrayBuffer();
    const groupBuffer = new Uint8Array(groupArrayBuffer);
    const fragments = this.components.tools.get(FragmentManager);
    const group = await fragments.load(groupBuffer, coordinate);

    const { opaque, transparent } = group.geometryIDs;
    for (const [geometryID, key] of opaque) {
      const fragID = group.keyFragments.get(key);
      if (fragID === undefined) {
        throw new Error("Malformed fragments group!");
      }
      this.fragIDData.set(fragID, [group, geometryID, new Set()]);
    }
    for (const [geometryID, key] of transparent) {
      const fragID = group.keyFragments.get(key);
      if (fragID === undefined) {
        throw new Error("Malformed fragments group!");
      }
      this.fragIDData.set(fragID, [group, Math.abs(geometryID), new Set()]);
    }

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

    if (properties) {
      const ids = new Map<number, number>();
      const types = new Map<number, number[]>();

      for (const id in properties.ids) {
        const value = properties.ids[id];
        const idNum = parseInt(id, 10);
        ids.set(idNum, value);
      }

      for (const type in properties.types) {
        const value = properties.types[type];
        const idNum = parseInt(type, 10);
        types.set(idNum, value);
      }

      // TODO: Make this better when backend is ready
      const propertiesFileID = globalDataFileId.replace(
        "-global",
        "-properties"
      );
      group.streamSettings = {
        baseUrl: this.url,
        baseFileName: propertiesFileID,
        ids,
        types,
      };

      const { indexesFile } = properties;
      const fetched = await fetch(this.url + indexesFile);
      const data = await fetched.arrayBuffer();
      const file = new File([new Blob([data])], indexesFile);
      const fileURL = URL.createObjectURL(file);
      const result = await unzip(fileURL);
      const first = Object.keys(result.entries)[0];
      const indices = await result.entries[first].json();

      const processor = this.components.tools.get(IfcPropertiesProcessor);
      const indexMap = processor.get();
      indexMap[group.uuid] = {};
      for (const index of indices) {
        const id = index.shift();
        indexMap[group.uuid][id] = new Set(index);
      }
    }

    this.culler.needsUpdate = true;
  }

  remove(modelID: string) {
    this._isDisposing = true;

    const fragments = this.components.tools.get(FragmentManager);
    const group = fragments.groups.find((group) => group.uuid === modelID);
    if (group === undefined) {
      console.log("Group to delete not found.");
      return;
    }

    delete this.models[modelID];
    delete this._geometryInstances[modelID];
    delete this._loadedFragments[modelID];

    const ids = group.keyFragments.values();
    for (const id of ids) {
      this.fragIDData.delete(id);
    }

    this.culler.remove(modelID);

    this._isDisposing = false;
  }

  setVisibility(visible: boolean, filter: FragmentIdMap) {
    const modelGeomsAssets = new Map<string, Map<number, Set<number>>>();
    for (const fragID in filter) {
      const found = this.fragIDData.get(fragID);
      if (found === undefined) {
        throw new Error("Geometry not found!");
      }
      const [group, geometryID, hiddenItems] = found;
      const modelID = group.uuid;
      if (!modelGeomsAssets.has(modelID)) {
        modelGeomsAssets.set(modelID, new Map());
      }
      const geometriesAsset = modelGeomsAssets.get(modelID)!;
      const assets = filter[fragID];

      // Store the visible filter so that it's applied if this fragment
      // is loaded later
      for (const itemID of assets) {
        if (visible) {
          hiddenItems.delete(itemID);
        } else {
          hiddenItems.add(itemID);
        }
      }

      if (!geometriesAsset.get(geometryID)) {
        geometriesAsset.set(geometryID, new Set());
      }

      const assetGroup = geometriesAsset.get(geometryID)!;
      for (const asset of assets) {
        assetGroup.add(asset);
      }
    }
    for (const [modelID, geometriesAssets] of modelGeomsAssets) {
      // Set visibility of stream culler
      this.culler.setVisibility(visible, modelID, geometriesAssets);
      // set visibility of loaded fragments
      for (const [geometryID] of geometriesAssets) {
        const allFrags = this._loadedFragments[modelID];
        if (!allFrags) continue;
        const frags = allFrags[geometryID];
        if (!frags) continue;
        for (const frag of frags) {
          const ids = filter[frag.id];
          if (!ids) continue;
          frag.setVisibility(visible, ids);
        }
      }
    }

    this.culler.needsUpdate = true;
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

  private async loadFoundGeometries(seen: { [modelID: string]: Set<number> }) {
    for (const modelID in seen) {
      if (this._isDisposing) return;

      const fragments = this.components.tools.get(FragmentManager);
      const group = fragments.groups.find((group) => group.uuid === modelID);
      if (!group) {
        // throw new Error("Fragment group not found!");
        // Might happen when disposing
        return;
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
            if (this._isDisposing) return;

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

        if (loaded.length && !this._isDisposing) {
          await this.onFragmentsLoaded.trigger(loaded);
        }
      }
    }
  }

  private async unloadLostGeometries(unseen: { [p: string]: Set<number> }) {
    if (this._isDisposing) return;

    const deletedFragments: FRAG.Fragment[] = [];
    const fragments = this.components.tools.get(FragmentManager);
    for (const modelID in unseen) {
      const group = fragments.groups.find((group) => group.uuid === modelID);
      if (!group) {
        throw new Error("Fragment group not found!");
      }

      if (!this._loadedFragments[modelID]) continue;
      const loadedFrags = this._loadedFragments[modelID];
      const geometries = unseen[modelID];

      for (const geometryID of geometries) {
        this.culler.removeFragment(group.uuid, geometryID);

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
      delete fragments.list[frag.id];
      this.components.meshes.delete(frag.mesh);
      frag.mesh.material = [] as THREE.Material[];
      frag.dispose(true);
    }
  }

  private setMeshVisibility(
    filter: { [modelID: string]: Set<number> },
    visible: boolean
  ) {
    for (const modelID in filter) {
      for (const geometryID of filter[modelID]) {
        const geometries = this._loadedFragments[modelID];
        if (!geometries) continue;
        const frags = geometries[geometryID];
        if (!frags) continue;
        for (const frag of frags) {
          frag.mesh.visible = visible;
        }
      }
    }
  }

  private newFragment(
    group: FragmentsGroup,
    geometryID: number,
    geometry: THREE.BufferGeometry,
    instances: StreamedInstance[],
    transparent: boolean,
    result: FRAG.Fragment[]
  ) {
    if (instances.length === 0) return;
    if (this._isDisposing) return;

    const uuids = group.geometryIDs;
    const uuidMap = transparent ? uuids.transparent : uuids.opaque;
    const factor = transparent ? -1 : 1;
    const tranpsGeomID = geometryID * factor;
    const key = uuidMap.get(tranpsGeomID);
    if (key === undefined) {
      // throw new Error("Malformed fragment!");
      return;
    }
    const fragID = group.keyFragments.get(key);
    if (fragID === undefined) {
      // throw new Error("Malformed fragment!");
      return;
    }

    const fragments = this.components.tools.get(FragmentManager);
    const fragmentAlreadyExists = fragments.list[fragID] !== undefined;
    if (fragmentAlreadyExists) {
      return;
    }

    const material = transparent ? this._baseMaterialT : this._baseMaterial;
    const fragment = new FRAG.Fragment(geometry, material, instances.length);

    fragment.id = fragID;
    fragment.mesh.uuid = fragID;

    fragment.group = group;
    group.add(fragment.mesh);
    group.items.push(fragment);

    fragments.list[fragment.id] = fragment;
    this.components.meshes.add(fragment.mesh);

    if (!this._loadedFragments[group.uuid]) {
      this._loadedFragments[group.uuid] = {};
    }
    const geoms = this._loadedFragments[group.uuid];
    if (!geoms[geometryID]) {
      geoms[geometryID] = [];
    }

    geoms[geometryID].push(fragment);

    const itemsMap = new Map<number, FRAG.Item>();
    for (let i = 0; i < instances.length; i++) {
      const transform = new THREE.Matrix4();
      const col = new THREE.Color();
      const { id, transformation, color } = instances[i];
      transform.fromArray(transformation);
      const [r, g, b] = color;
      col.setRGB(r, g, b, "srgb");
      if (itemsMap.has(id)) {
        const item = itemsMap.get(id)!;
        if (!item) continue;
        item.transforms.push(transform);
        if (item.colors) {
          item.colors.push(col);
        }
      } else {
        itemsMap.set(id, { id, colors: [col], transforms: [transform] });
      }
    }

    const items = Array.from(itemsMap.values());
    fragment.add(items);

    const data = this.fragIDData.get(fragment.id);
    if (!data) {
      throw new Error("Fragment data not found!");
    }

    const hiddenItems = data[2];
    if (hiddenItems.size) {
      fragment.setVisibility(false, hiddenItems);
    }

    this.culler.addFragment(group.uuid, geometryID, fragment);

    result.push(fragment);
  }

  private setupCullerEvents() {
    this.culler.onViewUpdated.add(
      async ({ toLoad, toRemove, toShow, toHide }) => {
        await this.loadFoundGeometries(toLoad);
        await this.unloadLostGeometries(toRemove);
        this.setMeshVisibility(toShow, true);
        this.setMeshVisibility(toHide, false);
      }
    );
  }
}

ToolComponent.libraryUUIDs.add(FragmentStreamLoader.uuid);
