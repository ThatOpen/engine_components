import * as THREE from "three";
import * as WEBIFC from "web-ifc";
import { GeometryUtils } from "bim-fragment/geometry-utils";
import { Fragment } from "bim-fragment/fragment";
import {
  FragmentData,
  FragmentGroup,
  IfcToFragmentItems,
  IfcToFragmentUniqueItems,
  MaterialList,
} from "./base-types";
import { IfcCategories, IfcItemsCategories } from "../../ifc/ifc-categories";
import { SpatialStructure } from "./spatial-structure";
import { Settings } from "./settings";
import { IfcCategoryMap } from "../../ifc/ifc-category-map";

export class DataConverter {
  private _categories: IfcItemsCategories = {};
  private _model = new FragmentGroup();
  private _ifcCategories = new IfcCategories();
  private _uniqueItems: IfcToFragmentUniqueItems = {};

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
  }

  setupCategories(webIfc: WEBIFC.IfcAPI) {
    this._categories = this._ifcCategories.getAll(webIfc, 0);
  }

  async generateFragmentData(webIfc: WEBIFC.IfcAPI) {
    await this._spatialStructure.setupFloors(webIfc);
    this.processAllFragmentsData();
    this.processAllUniqueItems();
    this.saveModelData();
    return this._model;
  }

  private saveModelData() {
    this._model.levelRelationships = this._spatialStructure.itemsByFloor;
    this._model.floorsProperties = this._spatialStructure.floorProperties;
    this._model.allTypes = IfcCategoryMap;
    this._model.itemTypes = this._categories;
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
      const id = data.instances[0].id;
      const category = this._categories[id];
      const level = this._spatialStructure.itemsByFloor[id];
      this.initializeUniqueItem(category, level, matID);
      for (const geometry of data.geometriesByMaterial[matID]) {
        geometry.userData.id = id;
        this._uniqueItems[category][level][matID].push(geometry);
        geometry.applyMatrix4(data.instances[0].matrix);
      }
    }
  }

  private initializeUniqueItem(category: number, level: number, matID: string) {
    if (!this._uniqueItems[category]) {
      this._uniqueItems[category] = {};
    }
    if (!this._uniqueItems[category][level]) {
      this._uniqueItems[category][level] = {};
    }
    if (!this._uniqueItems[category][level][matID]) {
      this._uniqueItems[category][level][matID] = [];
    }
  }

  private processInstancedItems(data: FragmentData) {
    const fragment = this.createInstancedFragment(data);
    this.setFragmentInstances(data, fragment);
    this._model.fragments.push(fragment);
    this._model.add(fragment.mesh);
  }

  private setFragmentInstances(data: FragmentData, fragment: Fragment) {
    for (let i = 0; i < data.instances.length; i++) {
      const instance = data.instances[i];
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
    if (level !== undefined && category !== undefined) {
      const geometries = Object.values(this._uniqueItems[category][level]);
      const { buffer, ids } = this.processIDsAndBuffer(geometries);
      const mats = this.getUniqueItemMaterial(category, level);
      const merged = GeometryUtils.merge(geometries);
      const mergedFragment = this.newMergedFragment(merged, buffer, mats, ids);
      this._model.fragments.push(mergedFragment);
      this._model.add(mergedFragment.mesh);
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
