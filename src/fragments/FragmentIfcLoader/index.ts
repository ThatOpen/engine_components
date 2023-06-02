import * as WEBIFC from "web-ifc";
import { Disposable, Event, UI } from "../../base-types/base-types";
import { Component } from "../../base-types/component";
import { FragmentManager } from "../index";
import {
  DataConverter,
  IfcToFragmentItems,
  MaterialList,
  IfcFragmentSettings,
  Geometry,
  FragmentGroup,
} from "./src";
import { Button } from "../../ui";
import { Components } from "../../core";

// TODO: Clean up UI logic and component type

/**
 * Reads all the geometry of the IFC file and generates a set of
 * [fragments](https://github.com/ifcjs/fragment). It can also return the
 * properties as a JSON file, as well as other sets of information within
 * the IFC file.
 */
export class FragmentIfcLoader
  extends Component<WEBIFC.IfcAPI>
  implements Disposable, UI
{
  name: string = "FragmentIfcLoader";
  enabled: boolean = true;

  /** Configuration of the IFC-fragment conversion. */
  settings = new IfcFragmentSettings();

  uiElement: Button;

  private _fragments: FragmentManager;
  private _webIfc = new WEBIFC.IfcAPI();
  private _items: IfcToFragmentItems = {};
  private _materials: MaterialList = {};
  private _components: Components;

  onIfcLoaded: Event<FragmentGroup> = new Event();

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

  constructor(components: Components, fragments: FragmentManager) {
    super();
    this._components = components;
    this._fragments = fragments;
    this.uiElement = new Button(components, {
      materialIconName: "upload_file",
    });
    this.setupOpenButton();
  }

  get(): WEBIFC.IfcAPI {
    return this._webIfc;
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
  async load(data: Uint8Array) {
    await this.initializeWebIfc();
    this._webIfc.OpenModel(data, this.settings.webIfc);
    const model = await this.loadAllGeometry();
    this.onIfcLoaded.trigger(model);
    return model;
  }

  private setupOpenButton() {
    const fileOpener = document.createElement("input");
    fileOpener.type = "file";
    fileOpener.accept = ".ifc";
    fileOpener.style.visibility = "collapse";
    document.body.appendChild(fileOpener);
    fileOpener.onchange = async () => {
      if (fileOpener.files === null || fileOpener.files.length === 0) return;
      const file = fileOpener.files[0];
      const buffer = await file.arrayBuffer();
      const data = new Uint8Array(buffer);
      const result = await this.load(data);
      const scene = this._components.scene.get();
      scene.add(result);
      this.uiElement.clicked.trigger(result);
    };
    this.uiElement.onclick = () => {
      fileOpener.click();
    };
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
      this._components.meshes.push(fragment.mesh);
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

export * from "./src";
