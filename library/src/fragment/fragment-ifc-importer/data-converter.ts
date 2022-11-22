import * as THREE from "three";
import * as WEBIFC from "web-ifc";
import { GeometryUtils } from "bim-fragment/geometry-utils";
import { Fragment } from "bim-fragment/fragment";
import { BufferGeometry } from "three";
import { IfcCategories, IfcItemsCategories, IfcCategoryMap } from "../../ifc";
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

export class DataConverter {
  private _categories: IfcItemsCategories = {};
  private _model = new FragmentGroup();
  private _ifcCategories = new IfcCategories();
  private _uniqueItems: IfcToFragmentUniqueItems = {};
  private _units = new Units();
  private _boundingBoxes: { [id: string]: number[] } = {};
  private _bounds: { [id: string]: THREE.Box3[] } = {};
  // private _voxels: [number, number, number, string[]][] = [];

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
  }

  cleanUp() {
    this._spatialStructure.cleanUp();
    this._categories = {};
    this._model = new FragmentGroup();
    this._ifcCategories = new IfcCategories();
    this._uniqueItems = {};
    this._units = new Units();
  }

  setupCategories(webIfc: WEBIFC.IfcAPI) {
    this._categories = this._ifcCategories.getAll(webIfc, 0);
  }

  async generateFragmentData(webIfc: WEBIFC.IfcAPI) {
    await this._units.setUp(webIfc);
    await this._spatialStructure.setupFloors(webIfc);
    this.processAllFragmentsData();
    this.processAllUniqueItems();
    this.saveModelData(webIfc);

    console.log(this._bounds);
    const points: THREE.Vector3[] = [];
    for (const guid in this._bounds) {
      const boundGroup = this._bounds[guid];
      for (const bound of boundGroup) {
        points.push(bound.min);
        points.push(bound.max);
      }
    }

    const globalBBox = new THREE.Box3();
    globalBBox.setFromPoints(points);
    const size = this._settings.voxelSize;

    const xCount = (globalBBox.max.x - globalBBox.min.x) / size;
    const yCount = (globalBBox.max.y - globalBBox.min.y) / size;
    const zCount = (globalBBox.max.z - globalBBox.min.z) / size;

    console.log(xCount, yCount, zCount);

    return this._model;
  }

  private saveModelData(webIfc: WEBIFC.IfcAPI) {
    this._model.boundingBoxes = this._boundingBoxes;
    this._model.levelRelationships = this._spatialStructure.itemsByFloor;
    this._model.floorsProperties = this._spatialStructure.floorProperties;
    this._model.allTypes = IfcCategoryMap;
    this._model.itemTypes = this._categories;
    const coordArray = webIfc.GetCoordinationMatrix(0);
    this._model.coordinationMatrix = new THREE.Matrix4().fromArray(coordArray);
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
      const instance = data.instances[0];
      const category = this._categories[instance.id];
      const level = this._spatialStructure.itemsByFloor[instance.id];
      this.initializeItem(category, level, matID);
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
      this._uniqueItems[category][level][matID].push(geometry);
      geometry.applyMatrix4(instance.matrix);
    }
  }

  private initializeItem(category: number, level: number, matID: string) {
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
    fragment.mesh.updateMatrix();
    this._model.fragments.push(fragment);
    this._model.add(fragment.mesh);

    let isTransparent = false;
    const materialIDs = Object.keys(data.geometriesByMaterial);
    const mats = materialIDs.map((id) => this._materials[id]);
    for (const mat of mats) {
      if (mat.transparent) {
        isTransparent = true;
      }
    }

    if (isTransparent) {
      return;
    }

    const baseHelper = this.getTransformHelper([fragment.mesh.geometry]);

    for (let i = 0; i < fragment.mesh.count; i++) {
      const instanceTransform = new THREE.Matrix4();
      const instanceHelper = new THREE.Object3D();
      fragment.getInstance(i, instanceTransform);
      instanceHelper.applyMatrix4(baseHelper.matrix);
      instanceHelper.applyMatrix4(instanceTransform);
      instanceHelper.updateMatrix();
      const id = fragment.getItemID(i, 0);
      this._boundingBoxes[id] = instanceHelper.matrix.elements;

      const guid = fragment.mesh.uuid;
      const max = new THREE.Vector3(0.5, 0.5, 0.5);
      const min = new THREE.Vector3(-0.5, -0.5, -0.5);
      max.applyMatrix4(instanceHelper.matrix);
      min.applyMatrix4(instanceHelper.matrix);
      if (!this._bounds[guid]) {
        this._bounds[guid] = [];
      }
      this._bounds[guid].push(new THREE.Box3(min, max));
    }
  }

  private getTransformHelper(geometries: BufferGeometry[]) {
    const baseHelper = new THREE.Object3D();

    const points: THREE.Vector3[] = [];
    for (const geom of geometries) {
      geom.computeBoundingBox();
      if (geom.boundingBox) {
        points.push(geom.boundingBox.min);
        points.push(geom.boundingBox.max);
      }
    }

    const bbox = new THREE.Box3();
    bbox.setFromPoints(points);

    const width = bbox.max.x - bbox.min.x;
    const height = bbox.max.y - bbox.min.y;
    const depth = bbox.max.z - bbox.min.z;

    const positionX = bbox.min.x + width / 2;
    const positionY = bbox.min.y + height / 2;
    const positionZ = bbox.min.z + depth / 2;

    baseHelper.scale.set(width, height, depth);
    baseHelper.position.set(positionX, positionY, positionZ);
    baseHelper.updateMatrix();
    return baseHelper;
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
    const geometries = Object.values(this._uniqueItems[category][level]);
    const { buffer, ids } = this.processIDsAndBuffer(geometries);
    const mats = this.getUniqueItemMaterial(category, level);

    console.log(geometries, ids.size);

    const items: { [id: number]: BufferGeometry[] } = {};

    for (const geometryGroup of geometries) {
      for (const geom of geometryGroup) {
        const id = geom.userData.id;
        if (!items[id]) {
          items[id] = [];
        }
        items[id].push(geom);
      }
    }

    for (const id in items) {
      const geoms = items[id];
      const helper = this.getTransformHelper(geoms);
      this._boundingBoxes[id] = helper.matrix.elements;
    }

    const merged = GeometryUtils.merge(geometries);
    const mergedFragment = this.newMergedFragment(merged, buffer, mats, ids);
    this._model.fragments.push(mergedFragment);
    this._model.add(mergedFragment.mesh);
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
