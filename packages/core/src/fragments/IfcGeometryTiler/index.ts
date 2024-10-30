import * as WEBIFC from "web-ifc";
import * as THREE from "three";
import * as FRAGS from "@thatopen/fragments";
import {
  Components,
  Disposable,
  Event,
  Component,
  AsyncEvent,
} from "../../core";
import { obbFromPoints } from "../../utils";
import { IfcStreamingSettings, StreamedGeometries, StreamedAsset } from "./src";
import {
  SpatialStructure,
  CivilReader,
  IfcMetadataReader,
  SpatialIdsFinder,
} from "../IfcLoader/src";

export * from "./src";

/**
 * A component that handles the tiling of IFC geometries for efficient streaming. 📕 [Tutorial](https://docs.thatopen.com/Tutorials/Components/Core/IfcGeometryTiler). 📘 [API](https://docs.thatopen.com/api/@thatopen/components/classes/IfcGeometryTiler).
 */
export class IfcGeometryTiler extends Component implements Disposable {
  /**
   * A unique identifier for the component.
   * This UUID is used to register the component within the Components system.
   */
  static readonly uuid = "d9999a00-e1f5-4d3f-8cfe-c56e08609764" as const;

  /**
   * Event triggered when geometry is streamed.
   * Contains the streamed geometry data and its buffer.
   */
  readonly onGeometryStreamed = new AsyncEvent<{
    buffer: Uint8Array;
    data: StreamedGeometries;
  }>();

  /**
   * Event triggered when assets are streamed.
   * Contains the streamed assets.
   */
  readonly onAssetStreamed = new AsyncEvent<StreamedAsset[]>();

  /**
   * Event triggered to indicate the progress of the streaming process.
   * Contains the progress percentage.
   */
  readonly onProgress = new AsyncEvent<number>();

  /**
   * Event triggered when the IFC file is loaded.
   * Contains the loaded IFC file data.
   */
  readonly onIfcLoaded = new AsyncEvent<Uint8Array>();

  /** {@link Disposable.onDisposed} */
  readonly onDisposed = new Event();

  /**
   * Settings for the IfcGeometryTiler.
   */
  settings = new IfcStreamingSettings();

  /** {@link Component.enabled} */
  enabled: boolean = true;

  /**
   * The WebIFC API instance used for IFC file processing.
   */
  webIfc = new WEBIFC.IfcAPI();

  private _nextAvailableID = 0;

  private _splittedGeometries = new Map<number, Set<number>>();

  private _spatialTree = new SpatialStructure();

  private _metaData = new IfcMetadataReader();

  private _visitedGeometries = new Map<
    number,
    { uuid: string; index: number }
  >();
  private _streamSerializer = new FRAGS.StreamSerializer();

  private _geometries: Map<
    number,
    {
      position: Float32Array;
      normal: Float32Array;
      index: Uint32Array;
      boundingBox: Float32Array;
      hasHoles: boolean;
    }
  > = new Map();

  private _geometryCount = 0;

  private _civil = new CivilReader();
  private _groupSerializer = new FRAGS.Serializer();

  private _assets: StreamedAsset[] = [];

  private _meshesWithHoles = new Set<number>();

  constructor(components: Components) {
    super(components);
    this.components.add(IfcGeometryTiler.uuid, this);
    this.settings.excludedCategories.add(WEBIFC.IFCOPENINGELEMENT);
  }

  /** {@link Disposable.dispose} */
  dispose() {
    this.onIfcLoaded.reset();
    this.onGeometryStreamed.reset();
    this.onAssetStreamed.reset();
    (this.webIfc as any) = null;
    this.onDisposed.trigger();
    this.onDisposed.reset();
  }

  /**
   * This method streams the IFC file from a given buffer.
   *
   * @param data - The Uint8Array containing the IFC file data.
   * @returns A Promise that resolves when the streaming process is complete.
   *
   * @remarks
   * This method cleans up any resources after the streaming process is complete.
   *
   * @example
   * ```typescript
   * const ifcData = await fetch('path/to/ifc/file.ifc');
   * const rawBuffer = await response.arrayBuffer();
   * const ifcBuffer = new Uint8Array(rawBuffer);
   * await ifcGeometryTiler.streamFromBuffer(ifcBuffer);
   * ```
   */
  async streamFromBuffer(data: Uint8Array) {
    // const before = performance.now();
    await this.readIfcFile(data);

    await this.streamAllGeometries();
    this.cleanUp();

    // console.log(`Streaming the IFC took ${performance.now() - before} ms!`);
  }

  /**
   * This method streams the IFC file from a given callback.
   *
   * @param loadCallback - The callback function that will be used to load the IFC file.
   * @returns A Promise that resolves when the streaming process is complete.
   *
   * @remarks
   * This method cleans up any resources after the streaming process is complete.
   *
   */
  async streamFromCallBack(loadCallback: WEBIFC.ModelLoadCallback) {
    // const before = performance.now();
    await this.streamIfcFile(loadCallback);

    await this.streamAllGeometries();
    this.cleanUp();

    // console.log(`Streaming the IFC took ${performance.now() - before} ms!`);
  }

  private async readIfcFile(data: Uint8Array) {
    const { path, absolute, logLevel } = this.settings.wasm;
    this.webIfc.SetWasmPath(path, absolute);
    await this.webIfc.Init();
    if (logLevel) {
      this.webIfc.SetLogLevel(logLevel);
    }
    this.webIfc.OpenModel(data, this.settings.webIfc);
    this._nextAvailableID = this.webIfc.GetMaxExpressID(0);
  }

  private async streamIfcFile(loadCallback: WEBIFC.ModelLoadCallback) {
    const { path, absolute, logLevel } = this.settings.wasm;
    this.webIfc.SetWasmPath(path, absolute);
    await this.webIfc.Init();
    if (logLevel) {
      this.webIfc.SetLogLevel(logLevel);
    }
    this.webIfc.OpenModelFromCallback(loadCallback, this.settings.webIfc);
    this._nextAvailableID = this.webIfc.GetMaxExpressID(0);
  }

  private async streamAllGeometries() {
    console.log("Converting geometries to tiles...");

    const { minGeometrySize, minAssetsSize } = this.settings;

    // Precompute the level to which each item belongs
    this._spatialTree.setUp(this.webIfc);

    // Get all IFC objects and group them in chunks of specified size

    const allIfcEntities = this.webIfc.GetIfcEntityList(0);
    const chunks: number[][] = [[]];

    const group = new FRAGS.FragmentsGroup();

    group.ifcMetadata = {
      name: "",
      description: "",
      ...this._metaData.getNameInfo(this.webIfc),
      ...this._metaData.getDescriptionInfo(this.webIfc),
      schema: (this.webIfc.GetModelSchema(0) as FRAGS.IfcSchema) || "IFC2X3",
      maxExpressID: this.webIfc.GetMaxExpressID(0),
    };

    let counter = 0;
    let index = 0;
    for (const type of allIfcEntities) {
      if (!this.webIfc.IsIfcElement(type) && type !== WEBIFC.IFCSPACE) {
        continue;
      }
      if (this.settings.excludedCategories.has(type)) {
        continue;
      }
      const result = this.webIfc.GetLineIDsWithType(0, type);
      const size = result.size();
      for (let i = 0; i < size; i++) {
        if (counter > minGeometrySize) {
          counter = 0;
          index++;
          chunks.push([]);
        }
        const itemID = result.get(i);
        chunks[index].push(itemID);

        const props = this.webIfc.GetLine(0, itemID);
        if (props.GlobalId) {
          const globalID = props?.GlobalId.value || props?.GlobalId;
          group.globalToExpressIDs.set(globalID, itemID);
        }

        const level = this._spatialTree.itemsByFloor[itemID] || 0;
        group.data.set(itemID, [[], [level, type]]);
        counter++;
      }
    }

    this._spatialTree.cleanUp();

    let nextProgress = 0.01;
    let chunkCounter = 0;

    for (const chunk of chunks) {
      chunkCounter++;

      this.webIfc.StreamMeshes(0, chunk, (mesh) => {
        this.getMesh(this.webIfc, mesh, group);
      });

      if (this._geometryCount > this.settings.minGeometrySize) {
        await this.streamGeometries();
      }

      if (this._assets.length > minAssetsSize) {
        await this.streamAssets();
      }

      const currentProgress = chunkCounter / chunks.length;
      if (currentProgress > nextProgress) {
        nextProgress += 0.01;
        nextProgress = Math.max(nextProgress, currentProgress);
        await this.onProgress.trigger(Math.round(nextProgress * 100) / 100);
      }
    }

    // Stream remaining assets and geometries
    if (this._geometryCount) {
      await this.streamGeometries();
    }

    if (this._assets.length) {
      await this.streamAssets();
    }

    const { opaque, transparent } = group.geometryIDs;
    for (const [id, { index, uuid }] of this._visitedGeometries) {
      group.keyFragments.set(index, uuid);
      const geometryID = id > 1 ? opaque : transparent;
      geometryID.set(id, index);
    }

    SpatialIdsFinder.get(group, this.webIfc);

    const matrix = this.webIfc.GetCoordinationMatrix(0);
    group.coordinationMatrix.fromArray(matrix);
    group.civilData = this._civil.read(this.webIfc);

    const buffer = this._groupSerializer.export(group);
    await this.onIfcLoaded.trigger(buffer);
    group.dispose(true);
  }

  private cleanUp() {
    try {
      this.webIfc.Dispose();
    } catch (e) {
      // Problem disposing memory (maybe already disposed?)
    }
    (this.webIfc as any) = null;
    this.webIfc = new WEBIFC.IfcAPI();
    this._visitedGeometries.clear();
    this._geometries.clear();
    this._assets = [];
    this._meshesWithHoles.clear();
  }

  private getMesh(
    webIfc: WEBIFC.IfcAPI,
    mesh: WEBIFC.FlatMesh,
    group: FRAGS.FragmentsGroup,
  ) {
    const size = mesh.geometries.size();

    const id = mesh.expressID;

    const asset: StreamedAsset = { id, geometries: [] };

    for (let i = 0; i < size; i++) {
      const geometry = mesh.geometries.get(i);
      const geometryID = geometry.geometryExpressID;

      // Distinguish between opaque and transparent geometries
      const isOpaque = geometry.color.w === 1;
      const factor = isOpaque ? 1 : -1;
      const transpGeometryID = geometryID * factor;

      if (!this._visitedGeometries.has(transpGeometryID)) {
        // This is the first time we see this geometry
        this.getGeometry(webIfc, geometryID, isOpaque);
      }

      this.registerGeometryData(
        group,
        id,
        geometry,
        asset,
        geometryID,
        transpGeometryID,
      );

      // Also save splits, if any
      const splits = this._splittedGeometries.get(geometryID);
      if (splits) {
        for (const split of splits) {
          this.registerGeometryData(group, id, geometry, asset, split, split);
        }
      }
    }

    this._assets.push(asset);
  }

  private getGeometry(webIfc: WEBIFC.IfcAPI, id: number, isOpaque: boolean) {
    const geometry = webIfc.GetGeometry(0, id);

    // Get the full index, position and normal data

    const index = webIfc.GetIndexArray(
      geometry.GetIndexData(),
      geometry.GetIndexDataSize(),
    ) as Uint32Array;

    const vertexData = webIfc.GetVertexArray(
      geometry.GetVertexData(),
      geometry.GetVertexDataSize(),
    ) as Float32Array;

    const position = new Float32Array(vertexData.length / 2);
    const normal = new Float32Array(vertexData.length / 2);

    for (let i = 0; i < vertexData.length; i += 6) {
      position[i / 2] = vertexData[i];
      position[i / 2 + 1] = vertexData[i + 1];
      position[i / 2 + 2] = vertexData[i + 2];

      normal[i / 2] = vertexData[i + 3];
      normal[i / 2 + 1] = vertexData[i + 4];
      normal[i / 2 + 2] = vertexData[i + 5];
    }

    // Take transparency into account
    const factor = isOpaque ? 1 : -1;

    // Empty geometry
    if (index.length === 0) {
      // prettier-ignore
      const boundingBox = new Float32Array([
          0, 0, 0, 0,
          0, 0, 0, 0,
          0, 0, 0, 0,
          0, 0, 0, 1
      ]);

      this._geometries.set(id, {
        position,
        normal,
        index,
        boundingBox,
        hasHoles: false,
      });

      const geomIndex = this._visitedGeometries.size;
      const uuid = THREE.MathUtils.generateUUID();

      const transpGeometryID = id * factor;
      this._visitedGeometries.set(transpGeometryID, { uuid, index: geomIndex });
      this._geometryCount++;
      geometry.delete();
      return;
    }

    const maxTris = this.settings.maxTriangles || index.length / 3;
    const maxIndexSize = maxTris * 3;

    let firstSplit = true;

    // Split geometries to normalize fragment size
    for (let i = 0; i < index.length; i += maxIndexSize) {
      const distanceToEnd = index.length - i;
      const distance = Math.min(distanceToEnd, maxIndexSize);
      const end = i + distance;

      const splittedIndexArray = [] as number[];
      const splittedPosArray = [] as number[];
      const splittedNorArray = [] as number[];

      // Now, let's generate a new sub-geometry
      let indexCounter = 0;
      for (let j = i; j < end; j++) {
        splittedIndexArray.push(indexCounter++);

        const previousIndex = index[j];
        splittedPosArray.push(position[previousIndex * 3]);
        splittedPosArray.push(position[previousIndex * 3 + 1]);
        splittedPosArray.push(position[previousIndex * 3 + 2]);

        splittedNorArray.push(normal[previousIndex * 3]);
        splittedNorArray.push(normal[previousIndex * 3 + 1]);
        splittedNorArray.push(normal[previousIndex * 3 + 2]);
      }

      const splittedIndex = new Uint32Array(splittedIndexArray);
      const splittedPosition = new Float32Array(splittedPosArray);
      const splittedNormal = new Float32Array(splittedNorArray);

      // const bbox = makeApproxBoundingBox(position, index);
      const obb = obbFromPoints(splittedPosition);
      const boundingBox = new Float32Array(obb.transformation.elements);

      // Deprecated, we don't need this anymore
      const hasHoles = false;

      // Get the ID for the geometry. If just 1 split, keep original ID.
      // If more than 1 split, create extra IDs
      const geometryID = firstSplit ? id : this._nextAvailableID++;

      this._geometries.set(geometryID, {
        position: splittedPosition,
        normal: splittedNormal,
        index: splittedIndex,
        boundingBox,
        hasHoles,
      });

      if (!firstSplit) {
        if (!this._splittedGeometries.has(id)) {
          this._splittedGeometries.set(id, new Set());
        }
        const splits = this._splittedGeometries.get(id) as Set<number>;
        splits.add(geometryID);
      }

      // Register visited geometry, distinguishing between transparent and opaque

      const geomIndex = this._visitedGeometries.size;
      const uuid = THREE.MathUtils.generateUUID();
      const transpGeometryID = geometryID * factor;
      this._visitedGeometries.set(transpGeometryID, { uuid, index: geomIndex });
      this._geometryCount++;
      firstSplit = false;
    }

    geometry.delete();
  }

  private async streamAssets() {
    await this.onAssetStreamed.trigger(this._assets);
    this._assets = null as any;
    this._assets = [];
  }

  private async streamGeometries() {
    const exportMap: typeof this._geometries = new Map();

    // Split geometries to control the maximum size of fragment files
    for (const [id, value] of this._geometries) {
      exportMap.set(id, value);
      if (exportMap.size > this.settings.minGeometrySize) {
        await this.outputGeometries(exportMap);
      }
    }

    // Output remaining geometries
    await this.outputGeometries(exportMap);

    this._geometries.clear();
    this._geometryCount = 0;
  }

  private async outputGeometries(exportMap: typeof this._geometries) {
    let buffer = this._streamSerializer.export(exportMap) as Uint8Array;
    let data: StreamedGeometries = {};
    for (const [id, { boundingBox, hasHoles }] of exportMap) {
      data[id] = { boundingBox, hasHoles };
    }
    await this.onGeometryStreamed.trigger({ data, buffer });
    // Force memory disposal of all created items
    data = null as any;
    buffer = null as any;
    exportMap.clear();
  }

  private registerGeometryData(
    group: FRAGS.FragmentsGroup,
    itemID: number,
    geometry: WEBIFC.PlacedGeometry,
    asset: StreamedAsset,
    geometryID: number,
    transpGeometryID: number,
  ) {
    const geometryData = this._visitedGeometries.get(transpGeometryID);
    if (geometryData === undefined) {
      throw new Error("Error getting geometry data for streaming!");
    }
    const data = group.data.get(itemID);
    if (!data) {
      throw new Error("Data not found!");
    }

    data[0].push(geometryData.index);

    const { x, y, z, w } = geometry.color;
    const color = [x, y, z, w];
    const transformation = geometry.flatTransformation;
    asset.geometries.push({ color, geometryID, transformation });
  }
}
