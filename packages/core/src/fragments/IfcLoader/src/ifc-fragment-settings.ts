import * as WEBIFC from "web-ifc";

/** Configuration of the IFC-fragment conversion. */
export class IfcFragmentSettings {
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
