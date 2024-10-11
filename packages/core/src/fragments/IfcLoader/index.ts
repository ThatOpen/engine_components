import * as WEBIFC from "web-ifc";
import * as THREE from "three";
import * as FRAGS from "@thatopen/fragments";
import { SpatialStructure } from "./src/spatial-structure";
import { CivilReader, IfcFragmentSettings, IfcMetadataReader } from "./src";
import { FragmentsManager } from "../FragmentsManager";
import { Component, Components, Event, Disposable } from "../../core";
import { IfcJsonExporter } from "../../ifc/IfcJsonExporter";
import { SpatialIdsFinder } from "./src/spatial-ids-finder.ts";

export * from "./src/ifc-fragment-settings";

/**
 * The IfcLoader component is responsible for loading and processing IFC files. It utilizes the Web-IFC library to handle the IFC data and the Three.js library for 3D rendering. The class provides methods for setting up, loading, and cleaning up IFC files. 📕 [Tutorial](https://docs.thatopen.com/Tutorials/Components/Core/IfcLoader). 📘 [API](https://docs.thatopen.com/api/@thatopen/components/classes/IfcLoader).
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

  private _material = new THREE.MeshLambertMaterial();
  private _spatialTree = new SpatialStructure();
  private _metaData = new IfcMetadataReader();
  private _fragmentInstances = new Map<string, Map<number, FRAGS.Item>>();
  private _civil = new CivilReader();

  private _visitedFragments = new Map<
    string,
    { index: number; fragment: FRAGS.Fragment }
  >();

  private _materialT = new THREE.MeshLambertMaterial({
    transparent: true,
    opacity: 0.5,
  });

  constructor(components: Components) {
    super(components);
    this.components.add(IfcLoader.uuid, this);
    this.settings.excludedCategories.add(WEBIFC.IFCOPENINGELEMENT);
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
   *
   * @returns A Promise that resolves to the FragmentsGroup containing the loaded and processed IFC data.
   *
   * @example
   * ```typescript
   * const ifcLoader = components.get(IfcLoader);
   * const group = await ifcLoader.load(ifcData);
   * ```
   */
  async load(data: Uint8Array, coordinate = true, name = "") {
    const before = performance.now();
    this.onIfcStartedLoading.trigger();
    await this.readIfcFile(data);
    const group = await this.getAllGeometries();
    group.name = name;

    const jsonExporter = this.components.get(IfcJsonExporter);
    const properties = await jsonExporter.export(this.webIfc, 0);
    group.setLocalProperties(properties);

    const fragments = this.components.get(FragmentsManager);
    fragments.groups.set(group.uuid, group);

    for (const frag of group.items) {
      fragments.list.set(frag.id, frag);
      frag.mesh.uuid = frag.id;
      frag.group = group;
    }

    fragments.onFragmentsLoaded.trigger(group);

    if (coordinate) {
      fragments.coordinate([group]);
    }

    for (const [expressID] of group.data) {
      const props = properties[expressID];
      if (!props || !props.GlobalId) continue;
      const globalID = props.GlobalId.value || props.GlobalId;
      group.globalToExpressIDs.set(globalID, expressID);
    }

    SpatialIdsFinder.get(group, this.webIfc);

    this.cleanUp();

    console.log(`Streaming the IFC took ${performance.now() - before} ms!`);

    return group;
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
    this._visitedFragments.clear(); // Clear the map of visited fragments
    this._fragmentInstances.clear(); // Clear the map of fragment instances
  }

  private async getAllGeometries() {
    // Precompute the level and category to which each item belongs
    this._spatialTree.setUp(this.webIfc);

    const allIfcEntities = this.webIfc.GetIfcEntityList(0);

    const group = new FRAGS.FragmentsGroup();

    group.ifcMetadata = {
      name: "",
      description: "",
      ...this._metaData.getNameInfo(this.webIfc),
      ...this._metaData.getDescriptionInfo(this.webIfc),
      schema: (this.webIfc.GetModelSchema(0) as FRAGS.IfcSchema) || "IFC2X3",
      maxExpressID: this.webIfc.GetMaxExpressID(0),
    };

    const ids: number[] = [];

    for (const type of allIfcEntities) {
      if (!this.webIfc.IsIfcElement(type) && type !== WEBIFC.IFCSPACE) {
        continue;
      }

      const included = this.settings.includedCategories;
      if (included.size > 0 && !included.has(type)) {
        continue;
      } else if (this.settings.excludedCategories.has(type)) {
        continue;
      }

      const result = this.webIfc.GetLineIDsWithType(0, type);
      const size = result.size();
      for (let i = 0; i < size; i++) {
        const itemID = result.get(i);
        ids.push(itemID);
        const level = this._spatialTree.itemsByFloor[itemID] || 0;
        group.data.set(itemID, [[], [level, type]]);
      }
    }

    this._spatialTree.cleanUp();

    this.webIfc.StreamMeshes(0, ids, (mesh) => {
      this.getMesh(mesh, group);
    });

    for (const entry of this._visitedFragments) {
      const { index, fragment } = entry[1];
      group.keyFragments.set(index, fragment.id);
    }

    for (const fragment of group.items) {
      const fragmentData = this._fragmentInstances.get(fragment.id);
      if (!fragmentData) {
        throw new Error("Fragment not found!");
      }
      const items: FRAGS.Item[] = [];
      for (const [_geomID, item] of fragmentData) {
        items.push(item);
      }
      fragment.add(items);
    }

    const matrix = this.webIfc.GetCoordinationMatrix(0);
    group.coordinationMatrix.fromArray(matrix);
    group.civilData = this._civil.read(this.webIfc);

    return group;
  }

  private getMesh(mesh: WEBIFC.FlatMesh, group: FRAGS.FragmentsGroup) {
    const size = mesh.geometries.size();

    const id = mesh.expressID;

    for (let i = 0; i < size; i++) {
      const geometry = mesh.geometries.get(i);

      const { x, y, z, w } = geometry.color;
      const transparent = w !== 1;
      const { geometryExpressID } = geometry;
      const geometryID = `${geometryExpressID}-${transparent}`;

      // Create geometry if it doesn't exist

      if (!this._visitedFragments.has(geometryID)) {
        const bufferGeometry = this.getGeometry(this.webIfc, geometryExpressID);

        const material = transparent ? this._materialT : this._material;
        const fragment = new FRAGS.Fragment(bufferGeometry, material, 1);

        group.add(fragment.mesh);
        group.items.push(fragment);

        const index = this._visitedFragments.size;
        this._visitedFragments.set(geometryID, { index, fragment });
      }

      // Save this instance of this geometry

      const color = new THREE.Color().setRGB(x, y, z, "srgb");
      const transform = new THREE.Matrix4();
      transform.fromArray(geometry.flatTransformation);

      const fragmentData = this._visitedFragments.get(geometryID);
      if (fragmentData === undefined) {
        throw new Error("Error getting geometry data for streaming!");
      }

      const data = group.data.get(id);
      if (!data) {
        throw new Error("Data not found!");
      }

      data[0].push(fragmentData.index);

      const { fragment } = fragmentData;

      if (!this._fragmentInstances.has(fragment.id)) {
        this._fragmentInstances.set(fragment.id, new Map());
      }

      const instances = this._fragmentInstances.get(fragment.id);
      if (!instances) {
        throw new Error("Instances not found!");
      }

      if (instances.has(id)) {
        // This item has more than one instance in this fragment
        const instance = instances.get(id);
        if (!instance) {
          throw new Error("Instance not found!");
        }
        instance.transforms.push(transform);
        if (instance.colors) {
          instance.colors.push(color);
        }
      } else {
        instances.set(id, { id, transforms: [transform], colors: [color] });
      }
    }
  }

  private getGeometry(webIfc: WEBIFC.IfcAPI, id: number) {
    const geometry = webIfc.GetGeometry(0, id);

    const index = webIfc.GetIndexArray(
      geometry.GetIndexData(),
      geometry.GetIndexDataSize(),
    ) as Uint32Array;

    const vertexData = webIfc.GetVertexArray(
      geometry.GetVertexData(),
      geometry.GetVertexDataSize(),
    ) as Float32Array;

    const position = new Float32Array(vertexData.length / 2);
    const normal = new Float32Array(vertexData.length / 2);

    for (let i = 0; i < vertexData.length; i += 6) {
      position[i / 2] = vertexData[i];
      position[i / 2 + 1] = vertexData[i + 1];
      position[i / 2 + 2] = vertexData[i + 2];

      normal[i / 2] = vertexData[i + 3];
      normal[i / 2 + 1] = vertexData[i + 4];
      normal[i / 2 + 2] = vertexData[i + 5];
    }

    const bufferGeometry = new THREE.BufferGeometry();
    const posAttr = new THREE.BufferAttribute(position, 3);
    const norAttr = new THREE.BufferAttribute(normal, 3);
    bufferGeometry.setAttribute("position", posAttr);
    bufferGeometry.setAttribute("normal", norAttr);
    bufferGeometry.setIndex(Array.from(index));

    geometry.delete();

    return bufferGeometry;
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
