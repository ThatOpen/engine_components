import * as WEBIFC from "web-ifc";

/** Configuration of the IFC-fragment conversion. */
export class IfcFragmentSettings {
  /** Whether to extract the IFC properties into a JSON. */
  includeProperties = true;

  /**
   * Generate the geometry for categories that are not included by default,
   * like IFCSPACE.
   */
  optionalCategories: number[] = [WEBIFC.IFCSPACE];

  /** Path of the WASM for [web-ifc](https://github.com/ThatOpen/engine_web-ifc). */
  wasm: {
    path: string;
    absolute: boolean;
    logLevel?: WEBIFC.LogLevel;
  } = {
    path: "",
    absolute: false,
    logLevel: WEBIFC.LogLevel.LOG_LEVEL_OFF,
  };

  /** List of categories that won't be converted to fragments. */
  excludedCategories = new Set<number>();

  /** Exclusive list of categories that will be converted to fragments. If this contains any category, any other categories will be ignored. */
  includedCategories = new Set<number>();

  /** Whether to save the absolute location of all IFC items. */
  saveLocations = false;

  /** Loader settings for [web-ifc](https://github.com/ThatOpen/engine_web-ifc). */
  webIfc: WEBIFC.LoaderSettings = {
    COORDINATE_TO_ORIGIN: true,
    // OPTIMIZE_PROFILES: true,
  };

  /**
   * Whether to automatically set the path to the WASM file for [web-ifc](https://github.com/ThatOpen/engine_web-ifc).
   * If set to true, the path will be set to the default path of the WASM file.
   * If set to false, the path must be provided manually in the `wasm.path` property.
   * Default value is true.
   */
  autoSetWasm = true;

  /**
   * Custom function to handle the file location for [web-ifc](https://github.com/ThatOpen/engine_web-ifc).
   * This function will be called when [web-ifc](https://github.com/ThatOpen/engine_web-ifc) needs to locate a file.
   * If set to null, the default file location handler will be used.
   *
   * @param url - The URL of the file to locate.
   * @returns The absolute path of the file.
   */
  customLocateFileHandler: WEBIFC.LocateFileHandlerFn | null = null;
}
