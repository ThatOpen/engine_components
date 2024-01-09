import * as WEBIFC from "web-ifc";
import { StreamSerializer } from "bim-fragment";
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

  /** {@link Disposable.onDisposed} */
  readonly onDisposed = new Event<string>();

  settings = new IfcStreamingSettings();

  enabled: boolean = true;

  uiElement = new UIElement<{ main: Button; toast: ToastNotification }>();

  onIfcLoaded = new Event();

  private _visitedGeometries = new Set<number>();
  private _webIfc = new WEBIFC.IfcAPI();
  private _serializer = new StreamSerializer();
  private _geometries: StreamedGeometries = {};
  private _geometryCount = 0;

  private _assets: StreamedAsset[] = [];

  private _meshesWithHoles = new Set<number>();

  constructor(components: Components) {
    super(components);
    this.components.tools.add(FragmentIfcStreamConverter.uuid, this);

    if (components.uiEnabled) {
      this.setupUI();
    }
  }

  get(): WEBIFC.IfcAPI {
    return this._webIfc;
  }

  async dispose() {
    this.onIfcLoaded.reset();
    await this.uiElement.dispose();
    (this._webIfc as any) = null;
    await this.onDisposed.trigger(FragmentIfcStreamConverter.uuid);
    this.onDisposed.reset();
  }

  async stream(data: Uint8Array) {
    const before = performance.now();
    await this.readIfcFile(data);

    await this.streamAllGeometries();
    this.cleanUp();

    await this.onIfcLoaded.trigger();
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
        await this.stream(data);
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

  private async streamAllGeometries() {
    const { minGeometrySize, minAssetsSize } = this.settings;

    // Get all IFC objects and group them in chunks of specified size

    const allIfcEntities = this._webIfc.GetIfcEntityList(0);
    const chunks: number[][] = [[]];

    let counter = 0;
    let index = 0;
    for (const type of allIfcEntities) {
      if (!this._webIfc.IsIfcElement(type) && type !== WEBIFC.IFCSPACE) {
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
        chunks[index].push(result.get(i));
        counter++;
      }
    }

    for (const chunk of chunks) {
      this._webIfc.StreamMeshes(0, chunk, (mesh) => {
        this.getMesh(this._webIfc, mesh);
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

    // Some categories (like IfcSpace) need to be created explicitly
    // const optionals = [...this.settings.optionalCategories];

    // Force IFC space to be transparent
    // if (optionals.includes(WEBIFC.IFCSPACE)) {
    //   const index = optionals.indexOf(WEBIFC.IFCSPACE);
    //   optionals.splice(index, 1);
    //   this._webIfc.StreamAllMeshesWithTypes(0, [WEBIFC.IFCSPACE], (mesh) => {
    //     this.streamMesh(this._webIfc, mesh);
    //   });
    // }

    // Load civil items
    // this.streamAlignment(this._webIfc);
    // this.streamCrossSection(this._webIfc);
  }

  private cleanUp() {
    (this._webIfc as any) = null;
    this._webIfc = new WEBIFC.IfcAPI();
    this._visitedGeometries.clear();
    this._geometries = {};
    this._assets = [];
    this._meshesWithHoles.clear();
  }

  private getMesh(webIfc: WEBIFC.IfcAPI, mesh: WEBIFC.FlatMesh) {
    const size = mesh.geometries.size();

    const asset: StreamedAsset = {
      id: mesh.expressID,
      geometries: [],
    };

    for (let i = 0; i < size; i++) {
      const geometry = mesh.geometries.get(i);
      const geometryID = geometry.geometryExpressID;

      if (!this._visitedGeometries.has(geometryID)) {
        this.getGeometry(webIfc, geometryID);
        this._visitedGeometries.add(geometryID);
      }

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
    let buffer = this._serializer.export(this._geometries) as Uint8Array;
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
