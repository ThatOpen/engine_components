import * as WEBIFC from "web-ifc";
// import * as THREE from "three";
import * as FRAGS from "@thatopen/fragments";
import { IfcFragmentSettings } from "./src";
import { FragmentsManager } from "../FragmentsManager";
import { Component, Components, Event, Disposable } from "../../core";

export * from "./src/ifc-fragment-settings";

/**
 * The IfcLoader component is responsible of converting IFC files into Fragments. 📕 [Tutorial](https://docs.thatopen.com/Tutorials/Components/Core/IfcLoader). 📘 [API](https://docs.thatopen.com/api/@thatopen/components/classes/IfcLoader).
 */
export class IfcLoader extends Component implements Disposable {
  /**
   * A unique identifier for the component.
   * This UUID is used to register the component within the Components system.
   */
  static readonly uuid = "a659add7-1418-4771-a0d6-7d4d438e4624" as const;

  /** {@link Disposable.onDisposed} */
  readonly onDisposed = new Event<string>();

  /**
   * An event triggered when the IFC file starts loading.
   */
  readonly onIfcStartedLoading = new Event<void>();

  /**
   * An event triggered when the setup process is completed.
   */
  readonly onSetup = new Event<void>();

  /**
   * The settings for the IfcLoader.
   * It includes options for excluding categories, setting WASM paths, and more.
   */
  settings = new IfcFragmentSettings();

  /**
   * The instance of the Web-IFC library used for handling IFC data.
   */
  webIfc = new WEBIFC.IfcAPI();

  /** {@link Component.enabled} */
  enabled: boolean = true;

  constructor(components: Components) {
    super(components);
    this.components.add(IfcLoader.uuid, this);
  }

  /** {@link Disposable.dispose} */
  dispose() {
    (this.webIfc as any) = null;
    this.onDisposed.trigger(IfcLoader.uuid);
    this.onDisposed.reset();
  }

  /**
   * Sets up the IfcLoader component with the provided configuration.
   *
   * @param config - Optional configuration settings for the IfcLoader.
   * If not provided, the existing settings will be used.
   *
   * @returns A Promise that resolves when the setup process is completed.
   *
   * @remarks
   * If the `autoSetWasm` option is enabled in the configuration,
   * the method will automatically set the WASM paths for the Web-IFC library.
   *
   * @example
   * ```typescript
   * const ifcLoader = new IfcLoader(components);
   * await ifcLoader.setup({ autoSetWasm: true });
   * ```
   */
  async setup(config?: Partial<IfcFragmentSettings>) {
    this.settings = { ...this.settings, ...config };
    if (this.settings.autoSetWasm) {
      await this.autoSetWasm();
    }
    this.onSetup.trigger();
  }

  /**
   * Loads an IFC file and processes it for 3D visualization.
   *
   * @param data - The Uint8Array containing the IFC file data.
   * @param coordinate - Optional boolean indicating whether to coordinate the loaded IFC data. Default is true.
   * @param name - Optional name for the fragments model.
   * @param config - Optional extra data for loading the IFC.
   *
   * @returns A Promise that resolves to the FragmentsModel containing the loaded and processed IFC data.
   *
   * @example
   * ```typescript
   * const ifcLoader = components.get(IfcLoader);
   * const model = await ifcLoader.load(ifcData);
   * ```
   */
  async load(
    data: Uint8Array,
    coordinate: boolean,
    name: string,
    config?: {
      userData?: Record<string, any>;
      processData?: Omit<FRAGS.ProcessData, "bytes">;
      instanceCallback?: (importer: FRAGS.IfcImporter) => void;
    },
  ) {
    const fragments = this.components.get(FragmentsManager);
    if (!fragments.initialized) {
      throw new Error("You need to initialize fragments first.");
    }

    if (this.settings.autoSetWasm) {
      await this.autoSetWasm();
    }

    fragments.core.settings.autoCoordinate = coordinate;

    const serializer = new FRAGS.IfcImporter();
    serializer.wasm.path = this.settings.wasm.path;
    serializer.wasm.absolute = this.settings.wasm.absolute;

    if (config?.instanceCallback) config.instanceCallback(serializer);

    const bytes = await serializer.process({
      ...config?.processData,
      bytes: data,
    });

    const model = await fragments.core.load(bytes, {
      modelId: name,
      userData: config?.userData,
    });

    return model;
  }

  /**
   * Reads an IFC file and initializes the Web-IFC library.
   *
   * @param data - The Uint8Array containing the IFC file data.
   *
   * @returns A Promise that resolves when the IFC file is opened and initialized.
   *
   * @remarks
   * This method sets the WASM path and initializes the Web-IFC library based on the provided settings.
   * It also opens the IFC model using the provided data and settings.
   *
   * @example
   * ```typescript
   * const ifcLoader = components.get(IfcLoader);
   * await ifcLoader.readIfcFile(ifcData);
   * ```
   */
  async readIfcFile(data: Uint8Array) {
    const { path, absolute, logLevel } = this.settings.wasm;
    this.webIfc.SetWasmPath(path, absolute);
    await this.webIfc.Init(this.settings.customLocateFileHandler || undefined);
    if (logLevel) {
      this.webIfc.SetLogLevel(logLevel);
    }
    return this.webIfc.OpenModel(data, this.settings.webIfc);
  }

  /**
   * Cleans up the IfcLoader component by resetting the Web-IFC library,
   * clearing the visited fragments and fragment instances maps, and creating a new instance of the Web-IFC library.
   *
   * @remarks
   * This method is called automatically after using the .load() method, so usually you don't need to use it manually.
   *
   * @example
   * ```typescript
   * const ifcLoader = components.get(IfcLoader);
   * ifcLoader.cleanUp();
   * ```
   */
  cleanUp() {
    try {
      this.webIfc.Dispose();
    } catch (e) {
      console.log("Web-ifc wasn't disposed.");
    }
    (this.webIfc as any) = null; // Clear the reference to the Web-IFC library
    this.webIfc = new WEBIFC.IfcAPI(); // Create a new instance of the Web-IFC library
  }

  private async autoSetWasm() {
    const componentsPackage = await fetch(
      `https://unpkg.com/@thatopen/components@${Components.release}/package.json`,
    );
    if (!componentsPackage.ok) {
      console.warn(
        "Couldn't get openbim-components package.json. Set wasm settings manually.",
      );
      return;
    }
    const componentsPackageJSON = await componentsPackage.json();
    if (!("web-ifc" in componentsPackageJSON.peerDependencies)) {
      console.warn(
        "Couldn't get web-ifc from peer dependencies in openbim-components. Set wasm settings manually.",
      );
    } else {
      const webIfcVer = componentsPackageJSON.peerDependencies["web-ifc"];
      this.settings.wasm.path = `https://unpkg.com/web-ifc@${webIfcVer}/`;
      this.settings.wasm.absolute = true;
    }
  }
}
