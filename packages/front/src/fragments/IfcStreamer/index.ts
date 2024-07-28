import * as THREE from "three";
import * as FRAG from "@thatopen/fragments";
import * as OBC from "@thatopen/components";
import {
  GeometryCullerRenderer,
  StreamFileDatabase,
  StreamPropertiesSettings,
  StreamedInstances,
  StreamedInstance,
  StreamLoaderSettings,
  StreamerDbCleaner,
} from "./src";

export * from "./src";

/**
 * The IfcStreamer component is responsible for managing and streaming tiled IFC data. It provides methods for loading, removing, and managing IFC models, as well as handling visibility and caching. 📕 [Tutorial](https://docs.thatopen.com/Tutorials/Components/Front/IfcStreamer). 📘 [API](https://docs.thatopen.com/api/@thatopen/components-front/classes/IfcStreamer).
 */
export class IfcStreamer extends OBC.Component implements OBC.Disposable {
  /**
   * A unique identifier for the component.
   * This UUID is used to register the component within the Components system.
   */
  static readonly uuid = "22437e8d-9dbc-4b99-a04f-d2da280d50c8" as const;

  /** {@link OBC.Component.enabled} */
  enabled = true;

  /**
   * Event triggered when fragments are deleted.
   */
  readonly onFragmentsDeleted = new OBC.Event<FRAG.Fragment[]>();

  /**
   * Event triggered when fragments are loaded.
   */
  readonly onFragmentsLoaded = new OBC.Event<FRAG.Fragment[]>();

  /** {@link OBC.Disposable.onDisposed} */
  readonly onDisposed = new OBC.Event();

  /**
   * The data of the streamed models. It defines the geometries, their instances, its bounding box (OBB) and the assets to which they belong.
   */
  models: {
    [modelID: string]: {
      assets: OBC.StreamedAsset[];
      geometries: OBC.StreamedGeometries;
    };
  } = {};

  /**
   * Importer of binary IFC data previously converted to fragment tiles.
   */
  serializer = new FRAG.StreamSerializer();

  /**
   * Maximum time in milliseconds for a geometry to stay in the RAM cache.
   */
  maxRamTime = 5000;

  /**
   * Flag indicating whether to use the local cache for storing geometry files.
   */
  useCache = true;

  dbCleaner: StreamerDbCleaner;

  fetch = async (url: string) => {
    return fetch(url);
  };

  private _culler: GeometryCullerRenderer | null = null;

  private _world: OBC.World | null = null;

  private _ramCache = new Map<
    string,
    { data: FRAG.StreamedGeometries; time: number }
  >();

  private _fileCache = new StreamFileDatabase();

  private _url: string | null = null;

  private _isDisposing = false;

  private _geometryInstances: {
    [modelID: string]: StreamedInstances;
  } = {};

  private _loadedFragments: {
    [modelID: string]: { [geometryID: number]: FRAG.Fragment[] };
  } = {};

  private fragIDData = new Map<
    string,
    [FRAG.FragmentsGroup, number, Set<number>]
  >();

  private _baseMaterial = new THREE.MeshLambertMaterial();

  private _baseMaterialT = new THREE.MeshLambertMaterial({
    transparent: true,
    opacity: 0.5,
  });

  /**
   * The URL of the data source for the streaming service.
   * It must be set before using the streaming service.
   * If not set, an error will be thrown when trying to access the URL.
   */
  get url() {
    if (!this._url) {
      throw new Error("url must be set before using the streaming service!");
    }
    return this._url;
  }

  /**
   * Sets the URL of the data source for the streaming service.
   * @param value - The new URL to be set.
   */
  set url(value: string) {
    this._url = value;
  }

  /**
   * The world in which the fragments will be displayed.
   * It must be set before using the streaming service.
   * If not set, an error will be thrown when trying to access the world.
   */
  get world() {
    if (!this._world) {
      throw new Error("You must set a world before using the streamer!");
    }
    return this._world;
  }

  /**
   * Sets the world in which the fragments will be displayed.
   * @param world - The new world to be set.
   */
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

  /**
   * The culler used for managing and rendering the fragments.
   * It is automatically created when the world is set.
   */
  get culler() {
    if (!this._culler) {
      throw new Error("You must set a world before using the streamer!");
    }
    return this._culler;
  }

  constructor(components: OBC.Components) {
    super(components);
    this.components.add(IfcStreamer.uuid, this);
    this.dbCleaner = new StreamerDbCleaner(this._fileCache);

    const fragments = this.components.get(OBC.FragmentsManager);
    fragments.onFragmentsDisposed.add(this.disposeStreamedGroup);

    // const hardlyGeometry = new THREE.BoxGeometry();
    // this._hardlySeenGeometries = new THREE.InstancedMesh();
  }

  /** {@link OBC.Disposable.dispose} */
  dispose() {
    this._isDisposing = true;
    this.onFragmentsLoaded.reset();
    this.onFragmentsDeleted.reset();

    this._ramCache.clear();

    const fragments = this.components.get(OBC.FragmentsManager);
    fragments.onFragmentsDisposed.remove(this.disposeStreamedGroup);

    this.models = {};
    this._geometryInstances = {};
    // Disposed by fragment manager
    this._loadedFragments = {};
    this.fragIDData.clear();

    this._baseMaterial.dispose();
    this._baseMaterialT.dispose();

    this._culler?.dispose();

    this.onDisposed.trigger(IfcStreamer.uuid);
    this.onDisposed.reset();
    this._isDisposing = false;
  }

  /**
   * Loads a new fragment group into the scene using streaming.
   *
   * @param settings - The settings for the new fragment group.
   * @param coordinate - Whether to federate this model with the rest.
   * @param properties - Optional properties for the new fragment group.
   * @returns The newly loaded fragment group.
   */
  async load(
    settings: StreamLoaderSettings,
    coordinate: boolean,
    properties?: StreamPropertiesSettings,
  ) {
    const { assets, geometries, globalDataFileId } = settings;

    const groupUrl = this.url + globalDataFileId;
    const groupData = await this.fetch(groupUrl);
    const groupArrayBuffer = await groupData.arrayBuffer();
    const groupBuffer = new Uint8Array(groupArrayBuffer);
    const fragments = this.components.get(OBC.FragmentsManager);
    const group = fragments.load(groupBuffer, { coordinate, isStreamed: true });

    group.name = globalDataFileId.replace("-processed-global", "");

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
      const indexURL = this.url + indexesFile;
      const fetched = await this.fetch(indexURL);
      const rels = await fetched.text();
      const indexer = this.components.get(OBC.IfcRelationsIndexer);
      indexer.setRelationMap(group, indexer.getRelationsMapFromJSON(rels));
    }

    this.culler.updateTransformations(group.uuid);
    this.culler.needsUpdate = true;

    return group;
  }

  /**
   * Removes a fragment group from the scene.
   *
   * @param modelID - The unique identifier of the fragment group to remove.
   *
   * @deprecated use OBC.FragmentsManager.disposeGroup instead.
   */
  remove(modelID: string) {
    const fragments = this.components.get(OBC.FragmentsManager);
    const group = fragments.groups.get(modelID);
    if (group) {
      fragments.disposeGroup(group);
    }
  }

  /**
   * Sets the visibility of items in fragments based on the provided filter.
   *
   * @param visible - The visibility state to set.
   * @param filter - A map of fragment IDs to arrays of item IDs.
   *                  Only items with IDs present in the arrays will be visible.
   */
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

  /**
   * Clears the local cache used for storing downloaded fragment files.
   *
   * @returns A Promise that resolves when the cache is cleared.
   */
  async clearCache() {
    await this._fileCache.delete();
  }

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
            // Add or update this file to clean it up from indexedDB automatically later
            this.dbCleaner.update(url);

            const found = await this._fileCache.files.get(url);

            if (found) {
              bytes = found.file;
            } else {
              const fetched = await this.fetch(url);
              const buffer = await fetched.arrayBuffer();
              bytes = new Uint8Array(buffer);
              // await this._fileCache.files.delete(url);
              this._fileCache.files.add({ file: bytes, id: url });
            }
          } else {
            const fetched = await this.fetch(url);
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

  private disposeStreamedGroup = (data: {
    groupID: string;
    fragmentIDs: string[];
  }) => {
    this._isDisposing = true;

    const { groupID, fragmentIDs } = data;

    delete this.models[groupID];
    delete this._geometryInstances[groupID];
    delete this._loadedFragments[groupID];

    for (const id of fragmentIDs) {
      this.fragIDData.delete(id);
    }

    this.culler.remove(groupID);

    this._isDisposing = false;
  };
}
