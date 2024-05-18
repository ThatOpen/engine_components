import * as THREE from "three";
import * as FRAG from "@thatopen/fragments";
import * as OBC from "@thatopen/components";
import { GeometryCullerRenderer } from "./geometry-culler-renderer";
import { StreamFileDatabase } from "./streamer-db";

interface StreamedInstance {
  id: number;
  color: number[];
  transformation: number[];
}

type StreamedInstances = Map<number, StreamedInstance[]>;

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

export class FragmentStreamLoader
  extends OBC.Component
  implements OBC.Disposable
{
  static readonly uuid = "22437e8d-9dbc-4b99-a04f-d2da280d50c8" as const;

  enabled = true;

  readonly onFragmentsDeleted = new OBC.Event<FRAG.Fragment[]>();

  readonly onFragmentsLoaded = new OBC.Event<FRAG.Fragment[]>();
  readonly onDisposed = new OBC.Event();
  models: {
    [modelID: string]: {
      assets: OBC.StreamedAsset[];
      geometries: OBC.StreamedGeometries;
    };
  } = {};

  serializer = new FRAG.StreamSerializer();

  maxRamTime = 5000;

  useCache = true;

  private _culler: GeometryCullerRenderer | null = null;

  private _world: OBC.World | null = null;

  private _ramCache = new Map<
    string,
    { data: FRAG.StreamedGeometries; time: number }
  >();

  private _fileCache = new StreamFileDatabase();

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

  get world() {
    if (!this._world) {
      throw new Error("You must set a world before using the streamer!");
    }
    return this._world;
  }

  set world(world: OBC.World) {
    this._world = world;
    this._culler?.dispose();

    this._culler = new GeometryCullerRenderer(this.components, world);
    this._culler.onViewUpdated.add(
      async ({ toLoad, toRemove, toShow, toHide }) => {
        await this.loadFoundGeometries(toLoad);
        await this.unloadLostGeometries(toRemove);
        this.setMeshVisibility(toShow, true);
        this.setMeshVisibility(toHide, false);
      },
    );
  }

  get culler() {
    if (!this._culler) {
      throw new Error("You must set a world before using the streamer!");
    }
    return this._culler;
  }

  constructor(components: OBC.Components) {
    super(components);
    this.components.add(FragmentStreamLoader.uuid, this);

    // const hardlyGeometry = new THREE.BoxGeometry();
    // this._hardlySeenGeometries = new THREE.InstancedMesh();
  }

  dispose() {
    this._isDisposing = true;
    this.onFragmentsLoaded.reset();
    this.onFragmentsDeleted.reset();

    this._ramCache.clear();

    this.models = {};
    this._geometryInstances = {};
    // Disposed by fragment manager
    this._loadedFragments = {};
    this.fragIDData.clear();

    this._baseMaterial.dispose();
    this._baseMaterialT.dispose();

    this._culler?.dispose();

    this.onDisposed.trigger(FragmentStreamLoader.uuid);
    this.onDisposed.reset();
    this._isDisposing = false;
  }

  async load(
    settings: StreamLoaderSettings,
    coordinate: boolean,
    properties?: StreamPropertiesSettings,
  ) {
    const { assets, geometries, globalDataFileId } = settings;

    const groupUrl = this.url + globalDataFileId;
    const groupData = await fetch(groupUrl);
    const groupArrayBuffer = await groupData.arrayBuffer();
    const groupBuffer = new Uint8Array(groupArrayBuffer);
    const fragments = this.components.get(OBC.FragmentsManager);
    const group = fragments.load(groupBuffer, { coordinate });
    this.world.scene.three.add(group);

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
        "-properties",
      );

      group.streamSettings = {
        baseUrl: this.url,
        baseFileName: propertiesFileID,
        ids,
        types,
      };

      const { indexesFile } = properties;
      const fetched = await fetch(this.url + indexesFile);
      const rels = await fetched.text();
      const indexer = this.components.get(OBC.IfcRelationsIndexer);
      indexer.setRelationMap(group, indexer.getRelationsMapFromJSON(rels));
    }

    this.culler.needsUpdate = true;

    return group;
  }

  remove(modelID: string) {
    this._isDisposing = true;

    const fragments = this.components.get(OBC.FragmentsManager);
    const group = fragments.groups.get(modelID);
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

  setVisibility(visible: boolean, filter: FRAG.FragmentIdMap) {
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

  async clearCache() {
    await this._fileCache.delete();
  }

  get() {}

  update() {}

  private async loadFoundGeometries(seen: {
    [modelID: string]: Map<number, Set<number>>;
  }) {
    for (const modelID in seen) {
      if (this._isDisposing) return;

      const fragments = this.components.get(OBC.FragmentsManager);
      const group = fragments.groups.get(modelID);
      if (!group) {
        // throw new Error("Fragment group not found!");
        // Might happen when disposing
        return;
      }

      const { geometries } = this.models[modelID];

      const files = new Map<string, number>();

      const allIDs = new Set<number>();

      for (const [priority, ids] of seen[modelID]) {
        for (const id of ids) {
          allIDs.add(id);
          const geometry = geometries[id];
          if (!geometry) {
            throw new Error("Geometry not found");
          }
          if (geometry.geometryFile) {
            const file = geometry.geometryFile;
            const value = files.get(file) || 0;
            files.set(file, value + priority);
          }
        }
      }

      const sortedFiles = Array.from(files).sort((a, b) => b[1] - a[1]);

      for (const [file] of sortedFiles) {
        const url = this.url + file;

        // If this file is still in the ram, get it

        if (!this._ramCache.has(url)) {
          let bytes = new Uint8Array();

          // If this file is in the local cache, get it
          if (this.useCache) {
            const found = await this._fileCache.files.get(url);

            if (found) {
              bytes = found.file;
            } else {
              const fetched = await fetch(url);
              const buffer = await fetched.arrayBuffer();
              bytes = new Uint8Array(buffer);
              // await this._fileCache.files.delete(url);
              this._fileCache.files.add({ file: bytes, id: url });
            }
          } else {
            const fetched = await fetch(url);
            const buffer = await fetched.arrayBuffer();
            bytes = new Uint8Array(buffer);
          }

          const data = this.serializer.import(bytes);
          this._ramCache.set(url, { data, time: performance.now() });
        }

        const result = this._ramCache.get(url);
        if (!result) {
          continue;
        }

        result.time = performance.now();

        const loaded: FRAG.Fragment[] = [];

        if (result) {
          for (const [geometryID, { position, index, normal }] of result.data) {
            if (this._isDisposing) return;

            if (!allIDs.has(geometryID)) continue;

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

            geom.setAttribute("position", posAttr);
            geom.setAttribute("normal", norAttr);

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
          this.onFragmentsLoaded.trigger(loaded);
        }
      }

      const expiredIDs = new Set<string>();
      const now = performance.now();
      for (const [id, { time }] of this._ramCache) {
        if (now - time > this.maxRamTime) {
          expiredIDs.add(id);
        }
      }

      for (const id of expiredIDs) {
        this._ramCache.delete(id);
      }

      // this._storageCache.close();
    }
  }

  private async unloadLostGeometries(unseen: { [p: string]: Set<number> }) {
    if (this._isDisposing) return;

    const deletedFragments: FRAG.Fragment[] = [];
    const fragments = this.components.get(OBC.FragmentsManager);
    for (const modelID in unseen) {
      const group = fragments.groups.get(modelID);
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
      this.onFragmentsDeleted.trigger(deletedFragments);
    }

    for (const frag of deletedFragments) {
      fragments.list.delete(frag.id);
      this.world.meshes.delete(frag.mesh);
      frag.mesh.material = [] as THREE.Material[];
      frag.dispose(true);
    }
  }

  private setMeshVisibility(
    filter: { [modelID: string]: Set<number> },
    visible: boolean,
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
    group: FRAG.FragmentsGroup,
    geometryID: number,
    geometry: THREE.BufferGeometry,
    instances: StreamedInstance[],
    transparent: boolean,
    result: FRAG.Fragment[],
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

    const fragments = this.components.get(OBC.FragmentsManager);
    const fragmentAlreadyExists = fragments.list.has(fragID);
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

    fragments.list.set(fragment.id, fragment);
    this.world.meshes.add(fragment.mesh);

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
}
