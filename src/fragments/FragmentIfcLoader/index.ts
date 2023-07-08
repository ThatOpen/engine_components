import * as WEBIFC from "web-ifc";
import { FragmentsGroup } from "bim-fragment";
import { Disposable, Event, UI, Component } from "../../base-types";
import { FragmentManager } from "../index";
import { DataConverter, GeometryReader } from "./src";
import { Button } from "../../ui";
import { Components } from "../../core";

export * from "./src/types";

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

  uiElement: Button;

  ifcLoaded: Event<FragmentsGroup> = new Event();

  private _webIfc = new WEBIFC.IfcAPI();

  private readonly _fragments: FragmentManager;
  private readonly _components: Components;
  private readonly _geometry = new GeometryReader();
  private readonly _converter = new DataConverter();

  constructor(components: Components, fragments: FragmentManager) {
    super();
    this._components = components;
    this._fragments = fragments;
    this.uiElement = this.setupOpenButton();
  }

  get(): WEBIFC.IfcAPI {
    return this._webIfc;
  }

  get settings() {
    return this._converter.settings;
  }

  /** {@link Disposable.dispose} */
  dispose() {
    this._geometry.cleanUp();
    this._converter.cleanUp();
    (this._webIfc as any) = null;
    (this._geometry as any) = null;
    (this._converter as any) = null;
  }

  /** Loads the IFC file and converts it to a set of fragments. */
  async load(data: Uint8Array) {
    const before = performance.now();
    await this.readIfcFile(data);

    await this.readAllGeometries();

    const items = this._geometry.items;
    const model = await this._converter.generate(this._webIfc, items);

    this.cleanUp();

    this._fragments.groups.push(model);
    for (const fragment of model.items) {
      this._fragments.list[fragment.id] = fragment;
      this._components.meshes.push(fragment.mesh);
    }

    this.ifcLoaded.trigger(model);
    console.log(`This took ${performance.now() - before} ms!`);
    return model;
  }

  private setupOpenButton() {
    const button = new Button(this._components, {
      materialIconName: "upload_file",
    });

    const fileOpener = document.createElement("input");
    fileOpener.type = "file";
    fileOpener.accept = ".ifc";
    fileOpener.style.display = "none";
    document.body.appendChild(fileOpener);

    fileOpener.onchange = async () => {
      if (fileOpener.files === null || fileOpener.files.length === 0) return;
      const file = fileOpener.files[0];
      const buffer = await file.arrayBuffer();
      const data = new Uint8Array(buffer);
      const result = await this.load(data);
      const scene = this._components.scene.get();
      scene.add(result);
      button.onClicked.trigger(result);
    };

    button.onclick = () => {
      fileOpener.click();
    };

    return button;
  }

  private async readIfcFile(data: Uint8Array) {
    const { path, absolute } = this.settings.wasm;
    this._webIfc.SetWasmPath(path, absolute);
    await this._webIfc.Init();
    this._webIfc.OpenModel(data, this.settings.webIfc);
  }

  private async readAllGeometries() {
    this._converter.saveIfcCategories(this._webIfc);

    // Some categories (like IfcSpace) need to be created explicitly
    const optionals = this.settings.optionalCategories;
    const callback = (mesh: WEBIFC.FlatMesh) => {
      this._geometry.streamMesh(this._webIfc, mesh);
    };
    this._webIfc.StreamAllMeshesWithTypes(0, optionals, callback);

    this._webIfc.StreamAllMeshes(0, (mesh: WEBIFC.FlatMesh) => {
      this._geometry.streamMesh(this._webIfc, mesh);
    });
  }

  private cleanUp() {
    (this._webIfc as any) = null;
    this._webIfc = new WEBIFC.IfcAPI();
    this._geometry.cleanUp();
    this._converter.cleanUp();
  }
}
