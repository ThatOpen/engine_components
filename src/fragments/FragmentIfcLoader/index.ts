import * as WEBIFC from "web-ifc";
import { FragmentsGroup } from "bim-fragment";
import {
  Disposable,
  Event,
  UI,
  Component,
  UIElement,
  Configurable,
} from "../../base-types";
import { FragmentManager } from "../FragmentManager";
import { DataConverter } from "./src/data-converter";
import { GeometryReader } from "./src/geometry-reader";
import { Button, ToastNotification } from "../../ui";
import { Components, ToolComponent } from "../../core";

export * from "./src/types";

export interface FragmentIfcLoaderConfig {
  autoSetWasm: boolean;
  logLevel: WEBIFC.LogLevel;
  customLocateFileHandler: WEBIFC.LocateFileHandlerFn | null;
}

/**
 * Reads all the geometry of the IFC file and generates a set of
 * [fragments](https://github.com/ifcjs/fragment). It can also return the
 * properties as a JSON file, as well as other sets of information within
 * the IFC file.
 */
export class FragmentIfcLoader
  extends Component<WEBIFC.IfcAPI>
  implements Disposable, UI, Configurable<FragmentIfcLoaderConfig>
{
  static readonly uuid = "a659add7-1418-4771-a0d6-7d4d438e4624" as const;

  /** {@link Disposable.onDisposed} */
  readonly onDisposed = new Event<string>();

  enabled: boolean = true;

  uiElement = new UIElement<{ main: Button; toast: ToastNotification }>();

  onIfcLoaded: Event<FragmentsGroup> = new Event();

  config: Required<FragmentIfcLoaderConfig> = {
    autoSetWasm: true,
    logLevel: WEBIFC.LogLevel.LOG_LEVEL_ERROR,
    customLocateFileHandler: null,
  };

  readonly onSetup = new Event<FragmentIfcLoader>();

  // For debugging purposes
  // isolatedItems = new Set<number>();

  onLocationsSaved = new Event<{ [id: number]: number[] }>();

  private _webIfc = new WEBIFC.IfcAPI();

  private readonly _geometry = new GeometryReader();
  private readonly _converter: DataConverter;

  constructor(components: Components) {
    super(components);

    this._converter = new DataConverter(components);
    this.components.tools.add(FragmentIfcLoader.uuid, this);

    if (components.uiEnabled) {
      this.setupUI();
    }
  }

  private async autoSetWasm() {
    const componentsPackage = await fetch(
      `https://unpkg.com/openbim-components@${Components.release}/package.json`
    );
    if (!componentsPackage.ok) {
      console.warn(
        "Couldn't get openbim-components package.json. Set wasm settings manually."
      );
      return;
    }
    const componentsPackageJSON = await componentsPackage.json();
    if (!("web-ifc" in componentsPackageJSON.peerDependencies ?? {})) {
      console.warn(
        "Couldn't get web-ifc from peer dependencies in openbim-components. Set wasm settings manually."
      );
    } else {
      const componentsWebIfcVersion =
        componentsPackageJSON.peerDependencies["web-ifc"];
      const path = `https://unpkg.com/web-ifc@${componentsWebIfcVersion}/`;
      this.settings.wasm = {
        path,
        absolute: true,
      };
    }
  }

  async setup(config?: Partial<FragmentIfcLoaderConfig>) {
    this.config = { ...this.config, ...config };
    if (this.config.autoSetWasm) await this.autoSetWasm();
    await this.onSetup.trigger();
  }

  get(): WEBIFC.IfcAPI {
    return this._webIfc;
  }

  get settings() {
    return this._converter.settings;
  }

  /** {@link Disposable.dispose} */
  async dispose() {
    this._geometry.cleanUp();
    this._converter.cleanUp();
    this.onIfcLoaded.reset();
    this.onLocationsSaved.reset();
    this.onSetup.reset();
    this.uiElement.dispose();
    (this._webIfc as any) = null;
    (this._geometry as any) = null;
    (this._converter as any) = null;
    await this.onDisposed.trigger(FragmentIfcLoader.uuid);
    this.onDisposed.reset();
  }

  /** Loads the IFC file and converts it to a set of fragments. */
  async load(data: Uint8Array, name: string) {
    if (this.settings.saveLocations) {
      this._geometry.saveLocations = true;
    }

    const before = performance.now();
    await this.readIfcFile(data);

    await this.readAllGeometries();
    this._geometry.streamAlignment(this._webIfc);
    this._geometry.streamCrossSection(this._webIfc);

    const items = this._geometry.items;
    const civItems = this._geometry.CivilItems;
    const model = await this._converter.generate(this._webIfc, items, civItems);
    model.name = name;

    if (this.settings.saveLocations) {
      await this.onLocationsSaved.trigger(this._geometry.locations);
    }

    const fragments = this.components.tools.get(FragmentManager);

    if (this.settings.coordinate) {
      const isFirstModel = fragments.groups.length === 0;
      if (isFirstModel) {
        fragments.baseCoordinationModel = model.uuid;
      } else {
        fragments.coordinate([model]);
      }
    }

    this.cleanUp();

    fragments.groups.push(model);
    for (const fragment of model.items) {
      fragment.group = model;
      fragments.list[fragment.id] = fragment;
      this.components.meshes.push(fragment.mesh);
    }

    await this.onIfcLoaded.trigger(model);
    console.log(`Loading the IFC took ${performance.now() - before} ms!`);

    return model;
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
        const model = await this.load(data, file.name);
        const scene = this.components.scene.get();
        scene.add(model);
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

  async readIfcFile(data: Uint8Array) {
    const { path, absolute } = this.settings.wasm;
    this._webIfc.SetWasmPath(path, absolute);
    await this._webIfc.Init(this.config.customLocateFileHandler ?? undefined);
    this._webIfc.SetLogLevel(this.config.logLevel);
    return this._webIfc.OpenModel(data, this.settings.webIfc);
  }

  private async readAllGeometries() {
    this._converter.saveIfcCategories(this._webIfc);

    // Some categories (like IfcSpace) need to be created explicitly
    const optionals = [...this.settings.optionalCategories];

    // Force IFC space to be transparent
    if (optionals.includes(WEBIFC.IFCSPACE)) {
      const index = optionals.indexOf(WEBIFC.IFCSPACE);
      optionals.splice(index, 1);
      this._webIfc.StreamAllMeshesWithTypes(0, [WEBIFC.IFCSPACE], (mesh) => {
        if (this.isExcluded(mesh.expressID)) {
          return;
        }
        this._geometry.streamMesh(this._webIfc, mesh, true);
      });
    }

    // Load rest of optional categories (if any)
    if (optionals.length) {
      this._webIfc.StreamAllMeshesWithTypes(0, optionals, (mesh) => {
        if (this.isExcluded(mesh.expressID)) {
          return;
        }
        this._geometry.streamMesh(this._webIfc, mesh);
      });
    }

    // Load common categories
    this._webIfc.StreamAllMeshes(0, (mesh: WEBIFC.FlatMesh) => {
      if (this.isExcluded(mesh.expressID)) {
        return;
      }
      this._geometry.streamMesh(this._webIfc, mesh);
    });

    // Load civil items
    this._geometry.streamAlignment(this._webIfc);
    this._geometry.streamCrossSection(this._webIfc);
  }

  cleanIfcApi() {
    (this._webIfc as any) = null;
    this._webIfc = new WEBIFC.IfcAPI();
  }

  private cleanUp() {
    this.cleanIfcApi();
    this._geometry.cleanUp();
    this._converter.cleanUp();
  }

  private isExcluded(id: number) {
    const category = this._converter.categories[id];
    return this.settings.excludedCategories.has(category);
  }
}

ToolComponent.libraryUUIDs.add(FragmentIfcLoader.uuid);
