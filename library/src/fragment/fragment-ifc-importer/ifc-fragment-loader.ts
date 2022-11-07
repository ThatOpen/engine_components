import * as WEBIFC from "web-ifc";
import { IfcToFragmentItems, MaterialList } from "./base-types";
import { Settings } from "./settings";
import { LoadProgress } from "./load-progress";
import { Geometry } from "./geometry";
import { DataConverter } from "./data-converter";

/**
 * Reads all the geometry of the IFC file and generates an optimized `THREE.Mesh`.
 */
export class IfcFragmentLoader {
  settings = new Settings();
  progress = new LoadProgress();
  webIfc = new WEBIFC.IfcAPI();

  private _items: IfcToFragmentItems = {};
  private _materials: MaterialList = {};

  private readonly _geometry = new Geometry(
    this.webIfc,
    this._items,
    this._materials
  );

  private readonly _converter = new DataConverter(
    this._items,
    this._materials,
    this.settings
  );

  async load(ifcURL: URL) {
    const file = await fetch(ifcURL);
    const buffer = await file.arrayBuffer();
    const data = new Uint8Array(buffer);
    await this.resetWebIfc();
    await this.webIfc.OpenModel(data, this.settings.webIfc);
    return this.loadAllGeometry();
  }

  private async resetWebIfc() {
    (this.webIfc as any) = null;
    this.webIfc = new WEBIFC.IfcAPI();
    this.webIfc.SetWasmPath(this.settings.wasmPath);
    await this.webIfc.Init();
  }

  private async loadAllGeometry() {
    await this.progress.setupLoadProgress(this.webIfc);
    this.loadAllCategories();
    const model = await this._converter.generateFragmentData(this.webIfc);
    this.progress.updateLoadProgress();
    this.reset();
    return model;
  }

  private loadAllCategories() {
    this._converter.setupCategories(this.webIfc);
    this.loadOptionalCategories();
    this.loadMainCategories();
  }

  private loadMainCategories() {
    this.webIfc.StreamAllMeshes(0, (mesh: WEBIFC.FlatMesh) => {
      this.progress.updateLoadProgress();
      this._geometry.streamMesh(this.webIfc, mesh);
    });
  }

  // Some categories (like IfcSpace) need to be set explicitly
  private loadOptionalCategories() {
    const optionals = this.settings.optionalCategories;
    const callback = (mesh: WEBIFC.FlatMesh) => {
      this._geometry.streamMesh(this.webIfc, mesh);
    };
    this.webIfc.StreamAllMeshesWithTypes(0, optionals, callback);
  }

  private reset() {
    (this.webIfc as any) = null;
    this.webIfc = new WEBIFC.IfcAPI();
    this.resetObject(this._items);
    this.resetObject(this._materials);
  }

  private resetObject(object: any) {
    const keys = Object.keys(object);
    for (const key of keys) {
      delete object[key];
    }
  }
}
