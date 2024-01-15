import * as WEBIFC from "web-ifc";
import * as THREE from "three";
import * as FRAGS from "bim-fragment";
import {
  Disposable,
  Event,
  UI,
  Component,
  UIElement,
} from "../../../base-types";
import { FragmentManager } from "../../FragmentManager";
import { Button, ToastNotification } from "../../../ui";
import { Components, ToolComponent } from "../../../core";
import { IfcStreamingSettings } from "./streaming-settings";
import { StreamedAsset, StreamedGeometries } from "./base-types";
import { isPointInFrontOfPlane, obbFromPoints } from "../../../utils";
import { SpatialStructure } from "../../FragmentIfcLoader/src/spatial-structure";
import { CivilReader } from "../../FragmentIfcLoader/src/civil-reader";
import { IfcMetadataReader } from "../../FragmentIfcLoader/src/ifc-metadata-reader";

export class FragmentIfcStreamConverter
  extends Component<WEBIFC.IfcAPI>
  implements Disposable, UI
{
  static readonly uuid = "d9999a00-e1f5-4d3f-8cfe-c56e08609764" as const;

  onGeometryStreamed = new Event<{
    buffer: Uint8Array;
    data: {
      [id: number]: {
        boundingBox: Float32Array;
        hasHoles: boolean;
      };
    };
  }>();

  onAssetStreamed = new Event<StreamedAsset[]>();

  onIfcLoaded = new Event<Uint8Array>();

  /** {@link Disposable.onDisposed} */
  readonly onDisposed = new Event<string>();

  settings = new IfcStreamingSettings();

  enabled: boolean = true;

  uiElement = new UIElement<{ main: Button; toast: ToastNotification }>();

  private _spatialTree = new SpatialStructure();
  private _metaData = new IfcMetadataReader();

  private _visitedGeometries = new Map<
    number,
    { uuid: string; index: number }
  >();

  private _webIfc = new WEBIFC.IfcAPI();
  private _streamSerializer = new FRAGS.StreamSerializer();
  private _geometries: StreamedGeometries = {};
  private _geometryCount = 0;

  private _civil = new CivilReader();
  private _groupSerializer = new FRAGS.Serializer();

  private _assets: StreamedAsset[] = [];

  private _meshesWithHoles = new Set<number>();

  constructor(components: Components) {
    super(components);
    this.components.tools.add(FragmentIfcStreamConverter.uuid, this);

    if (components.uiEnabled) {
      this.setupUI();
    }

    this.settings.excludedCategories.add(WEBIFC.IFCOPENINGELEMENT);
  }

  get(): WEBIFC.IfcAPI {
    return this._webIfc;
  }

  async dispose() {
    this.onIfcLoaded.reset();
    this.onGeometryStreamed.reset();
    this.onAssetStreamed.reset();
    await this.uiElement.dispose();
    (this._webIfc as any) = null;
    await this.onDisposed.trigger(FragmentIfcStreamConverter.uuid);
    this.onDisposed.reset();
  }

  async streamFromBuffer(data: Uint8Array) {
    const before = performance.now();
    await this.readIfcFile(data);

    await this.streamAllGeometries();
    this.cleanUp();

    console.log(`Streaming the IFC took ${performance.now() - before} ms!`);
  }

  async streamFromCallBack(loadCallback: WEBIFC.ModelLoadCallback) {
    const before = performance.now();
    await this.streamIfcFile(loadCallback);

    await this.streamAllGeometries();
    this.cleanUp();

    console.log(`Streaming the IFC took ${performance.now() - before} ms!`);
  }

  private setupUI() {
    const main = new Button(this.components);
    main.materialIcon = "upload_file";
    main.tooltip = "Load IFC";

    const toast = new ToastNotification(this.components, {
      message: "IFC model successfully loaded!",
    });

    main.onClick.add(() => {
      const fileOpener = document.createElement("input");
      fileOpener.type = "file";
      fileOpener.accept = ".ifc";
      fileOpener.style.display = "none";

      fileOpener.onchange = async () => {
        const fragments = this.components.tools.get(FragmentManager);
        if (fileOpener.files === null || fileOpener.files.length === 0) return;
        const file = fileOpener.files[0];
        const buffer = await file.arrayBuffer();
        const data = new Uint8Array(buffer);
        await this.streamFromBuffer(data);
        toast.visible = true;
        await fragments.updateWindow();
        fileOpener.remove();
      };

      fileOpener.click();
    });

    this.components.ui.add(toast);
    toast.visible = false;

    this.uiElement.set({ main, toast });
  }

  private async readIfcFile(data: Uint8Array) {
    const { path, absolute, logLevel } = this.settings.wasm;
    this._webIfc.SetWasmPath(path, absolute);
    await this._webIfc.Init();
    if (logLevel) {
      this._webIfc.SetLogLevel(logLevel);
    }
    this._webIfc.OpenModel(data, this.settings.webIfc);
  }

   private async streamIfcFile(loadCallback: WEBIFC.ModelLoadCallback) {
    const { path, absolute, logLevel } = this.settings.wasm;
    this._webIfc.SetWasmPath(path, absolute);
    await this._webIfc.Init();
    if (logLevel) {
      this._webIfc.SetLogLevel(logLevel);
    }
    this._webIfc.OpenModelFromCallback(loadCallback, this.settings.webIfc);
  }

  private async streamAllGeometries() {
    const { minGeometrySize, minAssetsSize } = this.settings;

    // Precompute the level to which each item belongs
    this._spatialTree.setUp(this._webIfc);

    // Get all IFC objects and group them in chunks of specified size

    const allIfcEntities = this._webIfc.GetIfcEntityList(0);
    const chunks: number[][] = [[]];

    const group = new FRAGS.FragmentsGroup();
    const matrix = this._webIfc.GetCoordinationMatrix(0);
    group.coordinationMatrix.fromArray(matrix);
    group.ifcCivil = this._civil.read(this._webIfc);

    const { FILE_NAME, FILE_DESCRIPTION } = WEBIFC;
    group.ifcMetadata = {
      name: this._metaData.get(this._webIfc, FILE_NAME),
      description: this._metaData.get(this._webIfc, FILE_DESCRIPTION),
      schema: (this._webIfc.GetModelSchema(0) as FRAGS.IfcSchema) || "IFC2X3",
      maxExpressID: this._webIfc.GetMaxExpressID(0),
    };

    let counter = 0;
    let index = 0;
    for (const type of allIfcEntities) {
      if (!this._webIfc.IsIfcElement(type) && type !== WEBIFC.IFCSPACE) {
        continue;
      }
      if (this.settings.excludedCategories.has(type)) {
        continue;
      }
      const result = this._webIfc.GetLineIDsWithType(0, type);
      const size = result.size();
      for (let i = 0; i < size; i++) {
        if (counter > minGeometrySize) {
          counter = 0;
          index++;
          chunks.push([]);
        }
        const itemID = result.get(i);
        chunks[index].push(itemID);
        const level = this._spatialTree.itemsByFloor[itemID] || 0;
        group.data[itemID] = [[], [level, type]];
        counter++;
      }
    }

    this._spatialTree.cleanUp();

    for (const chunk of chunks) {
      this._webIfc.StreamMeshes(0, chunk, (mesh) => {
        this.getMesh(this._webIfc, mesh, group);
      });

      if (this._geometryCount > minGeometrySize) {
        await this.streamGeometries();
      }

      if (this._assets.length > minAssetsSize) {
        await this.streamAssets();
      }
    }

    // Stream remaining assets and geometries
    if (this._geometryCount) {
      await this.streamGeometries();
    }

    if (this._assets.length) {
      await this.streamAssets();
    }

    for (const entry of this._visitedGeometries) {
      const { index, uuid } = entry[1];
      group.keyFragments[index] = uuid;
    }

    const buffer = this._groupSerializer.export(group);
    await this.onIfcLoaded.trigger(buffer);
    group.dispose(true);
  }

  private cleanUp() {
    (this._webIfc as any) = null;
    this._webIfc = new WEBIFC.IfcAPI();
    this._visitedGeometries.clear();
    this._geometries = {};
    this._assets = [];
    this._meshesWithHoles.clear();
  }

  private getMesh(
    webIfc: WEBIFC.IfcAPI,
    mesh: WEBIFC.FlatMesh,
    group: FRAGS.FragmentsGroup
  ) {
    const size = mesh.geometries.size();

    const id = mesh.expressID;

    const asset: StreamedAsset = { id, geometries: [] };

    for (let i = 0; i < size; i++) {
      const geometry = mesh.geometries.get(i);
      const geometryID = geometry.geometryExpressID;

      if (!this._visitedGeometries.has(geometryID)) {
        this.getGeometry(webIfc, geometryID);
        const index = this._visitedGeometries.size;
        const uuid = THREE.MathUtils.generateUUID();
        this._visitedGeometries.set(geometryID, { uuid, index });
      }

      const geometryData = this._visitedGeometries.get(geometryID);
      if (geometryData === undefined) {
        throw new Error("Error getting geometry data for streaming!");
      }
      group.data[id][0].push(geometryData.index);

      const { x, y, z, w } = geometry.color;
      const color = [x, y, z, w];
      const transformation = geometry.flatTransformation;
      asset.geometries.push({ color, geometryID, transformation });
    }

    this._assets.push(asset);
  }

  private getGeometry(webIfc: WEBIFC.IfcAPI, id: number) {
    const geometry = webIfc.GetGeometry(0, id);

    const index = webIfc.GetIndexArray(
      geometry.GetIndexData(),
      geometry.GetIndexDataSize()
    ) as Uint32Array;

    const vertexData = webIfc.GetVertexArray(
      geometry.GetVertexData(),
      geometry.GetVertexDataSize()
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

    // const bbox = makeApproxBoundingBox(position, index);
    const obb = obbFromPoints(position);
    const boundingBox = new Float32Array(obb.transformation.elements);

    // Simple hole test: see if all triangles are facing away the center
    // Using the vertex normal because it's easier
    // Geometries with holes are treated as transparent items
    // in the visibility test for geometry streaming
    // Not perfect, but it will work for most cases and all the times it fails
    // are false positives, so it's always on the safety side

    const centerArray = [obb.center.x, obb.center.y, obb.center.z];

    let hasHoles = false;
    for (let i = 0; i < position.length - 2; i += 3) {
      const x = position[i];
      const y = position[i + 1];
      const z = position[i + 2];

      const nx = normal[i];
      const ny = normal[i + 1];
      const nz = normal[i + 2];

      const pos = [x, y, z];
      const nor = [nx, ny, nz];
      if (isPointInFrontOfPlane(centerArray, pos, nor)) {
        hasHoles = true;
        break;
      }
    }

    this._geometries[id] = {
      position,
      normal,
      index,
      boundingBox,
      id,
      hasHoles,
    };

    this._geometryCount++;
  }

  private async streamAssets() {
    await this.onAssetStreamed.trigger(this._assets);
    this._assets = null as any;
    this._assets = [];
  }

  private async streamGeometries() {
    let buffer = this._streamSerializer.export(this._geometries) as Uint8Array;
    let data: {
      [id: number]: {
        boundingBox: Float32Array;
        hasHoles: boolean;
      };
    } = {};
    for (const geomID in this._geometries) {
      const { id, boundingBox, hasHoles } = this._geometries[geomID];
      data[id] = { boundingBox, hasHoles };
    }
    await this.onGeometryStreamed.trigger({ data, buffer });
    // Force memory disposal of all created items
    data = null as any;
    buffer = null as any;
    this._geometries = null as any;
    this._geometries = {};
    this._geometryCount = 0;
  }
}

ToolComponent.libraryUUIDs.add(FragmentIfcStreamConverter.uuid);
