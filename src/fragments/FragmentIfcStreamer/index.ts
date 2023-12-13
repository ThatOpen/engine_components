import * as WEBIFC from "web-ifc";
import { StreamSerializer } from "bim-fragment";
import { Disposable, Event, UI, Component, UIElement } from "../../base-types";
import { FragmentManager } from "../FragmentManager";
import { Button, ToastNotification } from "../../ui";
import { Components, ToolComponent } from "../../core";
import { IfcStreamingSettings } from "./src";
import { StreamedAsset, StreamedGeometries } from "./src/base-types";

export * from "./src";

export class FragmentIfcStreamer
  extends Component<WEBIFC.IfcAPI>
  implements Disposable, UI
{
  static readonly uuid = "d9999a00-e1f5-4d3f-8cfe-c56e08609764" as const;

  onGeometryStreamed = new Event<{
    buffer: Uint8Array;
    data: { [id: number]: Float32Array };
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
  private _assets: StreamedAsset[] = [];
  private _currentGeometrySize = 0;

  constructor(components: Components) {
    super(components);
    this.components.tools.add(FragmentIfcStreamer.uuid, this);

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
    await this.onDisposed.trigger(FragmentIfcStreamer.uuid);
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
    const { path, absolute } = this.settings.wasm;
    this._webIfc.SetWasmPath(path, absolute);
    await this._webIfc.Init();
    this._webIfc.OpenModel(data, this.settings.webIfc);
  }

  private async streamAllGeometries() {
    // Some categories (like IfcSpace) need to be created explicitly
    const optionals = [...this.settings.optionalCategories];

    // Force IFC space to be transparent
    if (optionals.includes(WEBIFC.IFCSPACE)) {
      const index = optionals.indexOf(WEBIFC.IFCSPACE);
      optionals.splice(index, 1);
      this._webIfc.StreamAllMeshesWithTypes(0, [WEBIFC.IFCSPACE], (mesh) => {
        this.streamMesh(this._webIfc, mesh);
      });
    }

    // Load rest of optional categories (if any)
    if (optionals.length) {
      this._webIfc.StreamAllMeshesWithTypes(0, optionals, (mesh) => {
        this.streamMesh(this._webIfc, mesh);
      });
    }

    // Load common categories
    this._webIfc.StreamAllMeshes(0, (mesh: WEBIFC.FlatMesh) => {
      this.streamMesh(this._webIfc, mesh);
    });

    // Stream remaining items
    if (this._assets.length) {
      this.streamAssets();
    }
    if (Object.keys(this._geometries).length) {
      this.streamGeometries();
    }

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
  }

  private streamMesh(webIfc: WEBIFC.IfcAPI, mesh: WEBIFC.FlatMesh) {
    const size = mesh.geometries.size();

    const asset: StreamedAsset = {
      id: mesh.expressID,
      geometries: [],
    };

    for (let i = 0; i < size; i++) {
      const geometry = mesh.geometries.get(i);
      const geometryID = geometry.geometryExpressID;

      if (!this._visitedGeometries.has(geometryID)) {
        this.updateGeometryData(webIfc, geometryID);
        this._visitedGeometries.add(geometryID);
      }

      const { x, y, z, w } = geometry.color;
      const color = [x, y, z, w];

      const transformation = geometry.flatTransformation;
      asset.geometries.push({ color, geometryID, transformation });
    }

    this._assets.push(asset);

    if (this._assets.length > this.settings.maxAssetSize) {
      this.streamAssets();
    }
  }

  private updateGeometryData(webIfc: WEBIFC.IfcAPI, id: number) {
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

    const min = -Number.MAX_VALUE;
    const max = Number.MAX_VALUE;

    // Min and max points
    const boundingBox = new Float32Array([max, max, max, min, min, min]);

    for (let i = 0; i < vertexData.length; i += 6) {
      const x = vertexData[i];
      const y = vertexData[i + 1];
      const z = vertexData[i + 2];

      if (x < boundingBox[0]) boundingBox[0] = x;
      if (y < boundingBox[1]) boundingBox[1] = y;
      if (z < boundingBox[2]) boundingBox[2] = z;
      if (x > boundingBox[3]) boundingBox[3] = x;
      if (y > boundingBox[4]) boundingBox[4] = y;
      if (z > boundingBox[5]) boundingBox[5] = z;

      position[i / 2] = x;
      position[i / 2 + 1] = y;
      position[i / 2 + 2] = z;

      normal[i / 2] = vertexData[i + 3];
      normal[i / 2 + 1] = vertexData[i + 4];
      normal[i / 2 + 2] = vertexData[i + 5];

      this._currentGeometrySize++;
    }

    this._geometries[id] = { position, normal, index, boundingBox, id };

    if (this._currentGeometrySize > this.settings.maxGeometrySize) {
      this.streamGeometries();
    }
  }

  private streamAssets() {
    this.onAssetStreamed.trigger(this._assets);
    this._assets = [];
  }

  private streamGeometries() {
    const buffer = this._serializer.export(this._geometries);
    const data: { [id: number]: Float32Array } = {};
    for (const geomID in this._geometries) {
      const { id, boundingBox } = this._geometries[geomID];
      data[id] = boundingBox;
    }
    this.onGeometryStreamed.trigger({ data, buffer });
    this._geometries = {};
  }
}

ToolComponent.libraryUUIDs.add(FragmentIfcStreamer.uuid);
