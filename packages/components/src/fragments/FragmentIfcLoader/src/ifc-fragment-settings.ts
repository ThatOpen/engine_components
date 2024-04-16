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

  /** Whether to use the coordination data coming from the IFC files. */
  coordinate = true;

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

  /** Whether to save the absolute location of all IFC items. */
  saveLocations = false;

  /** Loader settings for [web-ifc](https://github.com/ThatOpen/engine_web-ifc). */
  webIfc: WEBIFC.LoaderSettings = {
    COORDINATE_TO_ORIGIN: true,
    OPTIMIZE_PROFILES: true,
  };

  autoSetWasm = true;

  customLocateFileHandler: WEBIFC.LocateFileHandlerFn | null = null;
}
