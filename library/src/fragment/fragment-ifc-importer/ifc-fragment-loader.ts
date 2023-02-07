import * as WEBIFC from "web-ifc";
import { IfcToFragmentItems, MaterialList } from "./base-types";
import { Settings } from "./settings";
import { Geometry } from "./geometry";
import { DataConverter } from "./data-converter";
import { Disposable } from "../../core";
import { Fragments } from "../fragment";

/**
 * Reads all the geometry of the IFC file and generates a set of
 * [fragments](https://github.com/ifcjs/fragment).
 */
export class IfcFragmentLoader implements Disposable {
  /** Configuration of the IFC-fragment conversion. */
  settings = new Settings();

  private _fragments: Fragments;
  private _webIfc = new WEBIFC.IfcAPI();
  private _items: IfcToFragmentItems = {};
  private _materials: MaterialList = {};

  private readonly _geometry = new Geometry(
    this._webIfc,
    this._items,
    this._materials
  );

  private readonly _converter = new DataConverter(
    this._items,
    this._materials,
    this.settings
  );

  constructor(fragments: Fragments) {
    this._fragments = fragments;
  }

  /** {@link Disposable.dispose} */
  dispose() {
    this.disposeWebIfc();
    this.disposeMaterials();
    this.disposeItems();
    this._geometry.cleanUp();
    (this._geometry as any) = null;
    this._converter.cleanUp();
    (this._converter as any) = null;
  }

  /** Loads the IFC file and converts it to a set of fragments. */
  async load(ifcURL: URL) {
    await this.initializeWebIfc();
    const file = await fetch(ifcURL);
    const buffer = await file.arrayBuffer();
    const data = new Uint8Array(buffer);
    this._webIfc.OpenModel(data, this.settings.webIfc);
    return this.loadAllGeometry();
  }

  private async initializeWebIfc() {
    const { path, absolute } = this.settings.wasm;
    this._webIfc.SetWasmPath(path, absolute);
    await this._webIfc.Init();
  }

  private async loadAllGeometry() {
    await this.loadAllCategories();
    const model = await this._converter.generateFragmentData(this._webIfc);
    this.cleanUp();
    for (const fragment of model.fragments) {
      this._fragments.list[fragment.id] = fragment;
    }
    return model;
  }

  private async loadAllCategories() {
    this._converter.setupCategories(this._webIfc);
    this.loadOptionalCategories();
    await this.setupVoids();
    await this.loadMainCategories();
  }

  private async loadMainCategories() {
    this._webIfc.StreamAllMeshes(0, (mesh: WEBIFC.FlatMesh) => {
      this._geometry.streamMesh(this._webIfc, mesh);
    });
  }

  private async setupVoids() {
    const voids = this._webIfc.GetLineIDsWithType(0, WEBIFC.IFCRELVOIDSELEMENT);
    const props = this._webIfc.properties;
    const size = voids.size();
    for (let i = 0; i < size; i++) {
      const voidsProperties = await props.getItemProperties(0, voids.get(i));
      const voidID = voidsProperties.RelatingBuildingElement.value;
      this._geometry.addVoid(voidID);
    }
  }

  private loadOptionalCategories() {
    // Some categories (like IfcSpace) need to be set explicitly
    const optionals = this.settings.optionalCategories;
    const callback = (mesh: WEBIFC.FlatMesh) => {
      this._geometry.streamMesh(this._webIfc, mesh);
    };
    this._webIfc.StreamAllMeshesWithTypes(0, optionals, callback);
  }

  private cleanUp() {
    this.resetWebIfc();
    this._geometry.cleanUp();
    this._converter.cleanUp();
    this.resetObject(this._items);
    this.resetObject(this._materials);
  }

  private resetWebIfc() {
    this.disposeWebIfc();
    this._webIfc = new WEBIFC.IfcAPI();
  }

  private resetObject(object: any) {
    const keys = Object.keys(object);
    for (const key of keys) {
      delete object[key];
    }
  }

  private disposeWebIfc() {
    (this._webIfc as any) = null;
  }

  private disposeMaterials() {
    for (const materialID in this._materials) {
      this._materials[materialID].dispose();
    }
  }

  private disposeItems() {
    for (const geometryID in this._items) {
      const geometriesByMat = this._items[geometryID].geometriesByMaterial;
      for (const matID in geometriesByMat) {
        for (const geom of geometriesByMat[matID]) {
          geom.dispose();
        }
      }
    }
  }
}
