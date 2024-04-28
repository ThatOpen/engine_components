import * as WEBIFC from "web-ifc";
import * as THREE from "three";
import * as FRAGS from "bim-fragment";
import { FragmentsGroup } from "bim-fragment";
import { SpatialStructure } from "./src/spatial-structure";
import { CivilReader, IfcFragmentSettings, IfcMetadataReader } from "./src";
import { FragmentManager } from "../FragmentManager";
import { Component, Components, Event, Disposable } from "../../core";
import { IfcJsonExporter } from "../../ifc/IfcJsonExporter";

export class FragmentIfcLoader extends Component implements Disposable {
  static readonly uuid = "a659add7-1418-4771-a0d6-7d4d438e4624" as const;

  readonly onIfcLoaded = new Event<FragmentsGroup>();
  readonly onIfcStartedLoading = new Event<void>();

  readonly onSetup = new Event<void>();

  /** {@link Disposable.onDisposed} */
  readonly onDisposed = new Event<string>();

  settings = new IfcFragmentSettings();

  enabled: boolean = true;

  webIfc = new WEBIFC.IfcAPI();

  private _material = new THREE.MeshLambertMaterial();
  private _spatialTree = new SpatialStructure();
  private _metaData = new IfcMetadataReader();
  private _fragmentInstances = new Map<string, Map<number, FRAGS.Item>>();
  private _civil = new CivilReader();
  private _propertyExporter = new IfcJsonExporter();

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
    this.components.add(FragmentIfcLoader.uuid, this);
    this.settings.excludedCategories.add(WEBIFC.IFCOPENINGELEMENT);
  }

  dispose() {
    this.onIfcLoaded.reset();
    (this.webIfc as any) = null;
    this.onDisposed.trigger(FragmentIfcLoader.uuid);
    this.onDisposed.reset();
  }

  async setup(config?: Partial<IfcFragmentSettings>) {
    this.settings = { ...this.settings, ...config };
    if (this.settings.autoSetWasm) {
      await this.autoSetWasm();
    }
    this.onSetup.trigger();
  }

  async load(data: Uint8Array, coordinate = true) {
    const before = performance.now();
    this.onIfcStartedLoading.trigger();
    await this.readIfcFile(data);
    const group = await this.getAllGeometries();

    const properties = await this._propertyExporter.export(this.webIfc, 0);
    group.setLocalProperties(properties);

    this.cleanUp();
    console.log(`Streaming the IFC took ${performance.now() - before} ms!`);

    const fragments = this.components.get(FragmentManager);
    fragments.groups.set(group.uuid, group);

    for (const frag of group.items) {
      fragments.list.set(frag.id, frag);
      frag.mesh.uuid = frag.id;
      frag.group = group;
    }

    if (coordinate) {
      fragments.coordinate([group]);
    }

    this.onIfcLoaded.trigger(group);

    return group;
  }

  async readIfcFile(data: Uint8Array) {
    const { path, absolute, logLevel } = this.settings.wasm;
    this.webIfc.SetWasmPath(path, absolute);
    await this.webIfc.Init();
    if (logLevel) {
      this.webIfc.SetLogLevel(logLevel);
    }
    return this.webIfc.OpenModel(data, this.settings.webIfc);
  }

  private async getAllGeometries() {
    // Precompute the level and category to which each item belongs
    this._spatialTree.setUp(this.webIfc);

    const allIfcEntities = this.webIfc.GetIfcEntityList(0);

    const group = new FRAGS.FragmentsGroup();

    const { FILE_NAME, FILE_DESCRIPTION } = WEBIFC;
    group.ifcMetadata = {
      name: this._metaData.get(this.webIfc, FILE_NAME),
      description: this._metaData.get(this.webIfc, FILE_DESCRIPTION),
      schema: (this.webIfc.GetModelSchema(0) as FRAGS.IfcSchema) || "IFC2X3",
      maxExpressID: this.webIfc.GetMaxExpressID(0),
    };

    const ids: number[] = [];

    for (const type of allIfcEntities) {
      if (!this.webIfc.IsIfcElement(type) && type !== WEBIFC.IFCSPACE) {
        continue;
      }
      if (this.settings.excludedCategories.has(type)) {
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

  cleanUp() {
    (this.webIfc as any) = null;
    this.webIfc = new WEBIFC.IfcAPI();
    this._visitedFragments.clear();
    this._fragmentInstances.clear();
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
      `https://unpkg.com/openbim-components@${Components.release}/package.json`,
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
