import { Fragments } from '../fragment';
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
  fragments: Fragments;

  private _webIfc = new WEBIFC.IfcAPI();
  private _progress = new LoadProgress();
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
    this.fragments = fragments;
  }

  get progress() {
    return this._progress.event;
  }

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
    await this._progress.setupLoadProgress(this._webIfc);
    await this.loadAllCategories();
    const model = await this._converter.generateFragmentData(this._webIfc);
    this.fragments.models.push(model);
    const fragmentIds = model.fragments.map( fragment => {return fragment.id} );
    fragmentIds.forEach( id => this.fragments.fragmentIDModelIDMap[id] = model.uuid );
    this._progress.updateLoadProgress();
    this.cleanUp();
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
      this._progress.updateLoadProgress();
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

  // Some categories (like IfcSpace) need to be set explicitly
  private loadOptionalCategories() {
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
    (this._webIfc as any) = null;
    this._webIfc = new WEBIFC.IfcAPI();
  }

  private resetObject(object: any) {
    const keys = Object.keys(object);
    for (const key of keys) {
      delete object[key];
    }
  }
}
