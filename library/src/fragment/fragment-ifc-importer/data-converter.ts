import * as THREE from "three";
import * as WEBIFC from "web-ifc";
import { GeometryUtils } from "bim-fragment/geometry-utils";
import { Fragment } from "bim-fragment/fragment";
import { BufferGeometry } from "three";
import {
  IfcCategories,
  IfcItemsCategories,
  IfcCategoryMap,
  IfcJsonExporter,
} from "../../ifc";
import { SpatialStructure } from "./spatial-structure";
import { Settings } from "./settings";
import { Units } from "./units";
import {
  FragmentData,
  FragmentGroup,
  IfcToFragmentItems,
  IfcToFragmentUniqueItems,
  MaterialList,
} from "./base-types";
import { TransformHelper } from "./transform-helper";

export class DataConverter {
  private _categories: IfcItemsCategories = {};
  private _model = new FragmentGroup();
  private _ifcCategories = new IfcCategories();
  private _uniqueItems: IfcToFragmentUniqueItems = {};
  private _units = new Units();
  private _boundingBoxes: { [id: string]: number[] } = {};
  private _transparentBoundingBoxes: { [id: string]: number[] } = {};
  private _expressIDfragmentIDMap: { [expressID: string]: string } = {};
  private _transform = new TransformHelper();
  private _propertyExporter = new IfcJsonExporter();

  private readonly _items: IfcToFragmentItems;
  private readonly _materials: MaterialList;
  private readonly _spatialStructure = new SpatialStructure();
  private readonly _settings: Settings;

  constructor(
    items: IfcToFragmentItems,
    materials: MaterialList,
    settings: Settings
  ) {
    this._items = items;
    this._materials = materials;
    this._settings = settings;
  }

  reset() {
    this._model = new FragmentGroup();
    this._uniqueItems = {};
    this._boundingBoxes = {};
    this._transparentBoundingBoxes = {};
  }

  cleanUp() {
    this._spatialStructure.cleanUp();
    this._categories = {};
    this._model = new FragmentGroup();
    this._ifcCategories = new IfcCategories();
    this._uniqueItems = {};
    this._units = new Units();
    this._propertyExporter = new IfcJsonExporter();
  }

  setupCategories(webIfc: WEBIFC.IfcAPI) {
    this._categories = this._ifcCategories.getAll(webIfc, 0);
  }

  async generateFragmentData(webIfc: WEBIFC.IfcAPI) {
    await this._units.setUp(webIfc);
    await this._spatialStructure.setupFloors(webIfc, this._units);
    this.processAllFragmentsData();
    this.processAllUniqueItems();
    this.saveModelData(webIfc);
    return this._model;
  }

  private async saveModelData(webIfc: WEBIFC.IfcAPI) {
    this._model.boundingBoxes = this._boundingBoxes;
    this._model.transparentBoundingBoxes = this._transparentBoundingBoxes;
    this._model.expressIDFragmentIDMap = this._expressIDfragmentIDMap;
    this._model.levelRelationships = this._spatialStructure.itemsByFloor;
    this._model.floorsProperties = this._spatialStructure.floorProperties;
    this._model.allTypes = IfcCategoryMap;
    this._model.itemTypes = this._categories;
    this._model.coordinationMatrix = this.getCoordinationMatrix(webIfc);
    this._model.properties = await this.getModelProperties(webIfc);
  }

  private getCoordinationMatrix(webIfc: WEBIFC.IfcAPI) {
    const coordArray = webIfc.GetCoordinationMatrix(0);
    return new THREE.Matrix4().fromArray(coordArray);
  }

  private async getModelProperties(webIfc: WEBIFC.IfcAPI) {
    if (!this._settings.includeProperties) {
      return {};
    }
    return new Promise<any>((resolve) => {
      this._propertyExporter.propertiesSerialized.on((properties) => {
        resolve(properties);
      });
      this._propertyExporter.export(webIfc, 0);
    });
  }

  private processAllFragmentsData() {
    const fragmentsData = Object.values(this._items);
    for (const data of fragmentsData) {
      this.processFragmentData(data);
    }
  }

  private processFragmentData(data: FragmentData) {
    const id = data.instances[0].id;
    const categoryID = this._categories[id];
    // TODO: use settings.instanceLimit and implement merging many instances
    //  (e.g. for a model with thousands of objects that repeat 2 times)
    const isUnique = data.instances.length === 1;
    const isInstanced = this._settings.instancedCategories.has(categoryID);
    if (!isUnique || isInstanced) {
      this.processInstancedItems(data);
    } else {
      this.processMergedItems(data);
    }
  }

  private processMergedItems(data: FragmentData) {
    for (const matID in data.geometriesByMaterial) {
      const instance = data.instances[0];
      const category = this._categories[instance.id];
      const level = this._spatialStructure.itemsByFloor[instance.id];
      this.initializeItem(data, category, level, matID);
      this.applyTransformToMergedGeometries(data, category, level, matID);
    }
  }

  private applyTransformToMergedGeometries(
    data: FragmentData,
    category: number,
    level: number,
    matID: string
  ) {
    const geometries = data.geometriesByMaterial[matID];
    const instance = data.instances[0];
    this._units.apply(instance.matrix);
    for (const geometry of geometries) {
      geometry.userData.id = instance.id;
      this._uniqueItems[category][level][matID].geoms.push(geometry);
      geometry.applyMatrix4(instance.matrix);
    }
  }

  private initializeItem(
    data: FragmentData,
    category: number,
    level: number,
    matID: string
  ) {
    if (!this._uniqueItems[category]) {
      this._uniqueItems[category] = {};
    }
    if (!this._uniqueItems[category][level]) {
      this._uniqueItems[category][level] = {};
    }
    if (!this._uniqueItems[category][level][matID]) {
      this._uniqueItems[category][level][matID] = {
        geoms: [],
        hasVoids: data.instances[0].hasVoids,
      };
    }
  }

  private processInstancedItems(data: FragmentData) {
    const fragment = this.createInstancedFragment(data);
    this.setFragmentInstances(data, fragment);
    fragment.mesh.updateMatrix();
    this._model.fragments.push(fragment);
    this._model.add(fragment.mesh);

    const materialIDs = Object.keys(data.geometriesByMaterial);
    const mats = materialIDs.map((id) => this._materials[id]);

    const matsTransparent = this.areMatsTransparent(mats);
    const isTransparent = matsTransparent || data.instances[0].hasVoids;
    const boxes = this.getBoxes(isTransparent);

    const baseHelper = this._transform.getHelper([fragment.mesh.geometry]);

    for (let i = 0; i < fragment.mesh.count; i++) {
      const instanceTransform = new THREE.Matrix4();
      const instanceHelper = new THREE.Object3D();
      fragment.getInstance(i, instanceTransform);
      instanceHelper.applyMatrix4(baseHelper.matrix);
      instanceHelper.applyMatrix4(instanceTransform);
      instanceHelper.updateMatrix();
      const id = fragment.getItemID(i, 0);
      boxes[id] = instanceHelper.matrix.elements;
      this._expressIDfragmentIDMap[id] = fragment.id;
    }
  }

  private getBoxes(isTransparent: boolean) {
    const boxes = isTransparent
      ? this._transparentBoundingBoxes
      : this._boundingBoxes;
    return boxes;
  }

  private areMatsTransparent(mats: THREE.MeshLambertMaterial[]) {
    for (const mat of mats) {
      if (mat.transparent) {
        return true;
      }
    }
    return false;
  }

  private setFragmentInstances(data: FragmentData, fragment: Fragment) {
    for (let i = 0; i < data.instances.length; i++) {
      const instance = data.instances[i];
      this._units.apply(instance.matrix);
      fragment.setInstance(i, {
        ids: [instance.id.toString()],
        transform: instance.matrix,
      });
    }
  }

  private createInstancedFragment(data: FragmentData) {
    const mats = this.getMaterials(data);
    const geoms = Object.values(data.geometriesByMaterial);
    const merged = GeometryUtils.merge(geoms);
    return new Fragment(merged, mats, data.instances.length);
  }

  private getMaterials(data: FragmentData) {
    const mats = Object.keys(data.geometriesByMaterial).map(
      (id) => this._materials[id]
    );
    return mats;
  }

  private processAllUniqueItems() {
    const categories = Object.keys(this._uniqueItems);
    for (const categoryString of categories) {
      for (const levelString in this._uniqueItems[categoryString]) {
        const category = parseInt(categoryString, 10);
        const level = parseInt(levelString, 10);
        if (level !== undefined && category !== undefined) {
          this.processUniqueItem(category, level);
        }
      }
    }
  }

  private processUniqueItem(category: number, level: number) {
    const item = this._uniqueItems[category][level];
    if (!item) return;
    const geometriesData = Object.values(item);
    const geometries = geometriesData.map((geom) => geom.geoms);
    const { buffer, ids } = this.processIDsAndBuffer(geometries);
    const mats = this.getUniqueItemMaterial(category, level);

    const items: { [id: number]: BufferGeometry[] } = {};

    let hasVoids = false;
    for (const geometryGroup of geometriesData) {
      hasVoids = hasVoids || geometryGroup.hasVoids;
      for (const geom of geometryGroup.geoms) {
        const id = geom.userData.id;
        if (!items[id]) {
          items[id] = [];
        }
        items[id].push(geom);
      }
    }

    const matsTransparent = this.areMatsTransparent(mats);
    const isTransparent = matsTransparent || hasVoids;
    const boxes = this.getBoxes(isTransparent);

    for (const id in items) {
      const geoms = items[id];
      const helper = this._transform.getHelper(geoms);
      boxes[id] = helper.matrix.elements;
    }

    const merged = GeometryUtils.merge(geometries);
    const mergedFragment = this.newMergedFragment(merged, buffer, mats, ids);
    this._model.fragments.push(mergedFragment);
    this._model.add(mergedFragment.mesh);

    for (const id in items) {
      this._expressIDfragmentIDMap[id] = mergedFragment.id;
    }
  }

  private newMergedFragment(
    merged: THREE.BufferGeometry,
    buffer: Uint32Array,
    mats: THREE.MeshLambertMaterial[],
    itemsIDs: Set<number>
  ) {
    merged.setAttribute("blockID", new THREE.BufferAttribute(buffer, 1));
    const mergedFragment = new Fragment(merged, mats, 1);
    const ids = Array.from(itemsIDs).map((id) => id.toString());
    mergedFragment.setInstance(0, { ids, transform: new THREE.Matrix4() });
    return mergedFragment;
  }

  private processBuffer(geometries: THREE.BufferGeometry[][], size: number) {
    const buffer = new Uint32Array(size);
    const data = this.getBufferTempData();
    for (const geometryGroup of geometries) {
      for (const geom of geometryGroup) {
        this.updateBufferIDs(data, geom);
        const size = geom.attributes.position.count;
        const currentBlockID = data.currentIDs.get(geom.userData.id) as number;
        buffer.fill(currentBlockID, data.offset, data.offset + size);
        data.offset += size;
      }
    }
    return buffer;
  }

  private updateBufferIDs(data: any, geom: THREE.BufferGeometry) {
    if (!data.currentIDs.has(geom.userData.id)) {
      data.currentIDs.set(geom.userData.id, data.blockID++);
    }
  }

  private getBufferTempData() {
    return { currentIDs: new Map<number, number>(), offset: 0, blockID: 0 };
  }

  private processIDsAndBuffer(geometries: THREE.BufferGeometry[][]) {
    let size = 0;
    const ids = new Set<number>();
    for (const geometryGroup of geometries) {
      for (const geom of geometryGroup) {
        size += geom.attributes.position.count;
        ids.add(geom.userData.id);
      }
    }
    const buffer = this.processBuffer(geometries, size);
    return { buffer, ids };
  }

  private getUniqueItemMaterial(category: number, level: number) {
    const mats = Object.keys(this._uniqueItems[category][level]).map(
      (id) => this._materials[id]
    );
    return mats;
  }
}
