import * as THREE from "three";
import * as WEBIFC from "web-ifc";
import * as FRAGS from "bim-fragment";
import {
  IfcCategories,
  IfcItemsCategories,
  IfcCategoryMap,
  IfcJsonExporter,
} from "../../../ifc";
import { SpatialStructure } from "./spatial-structure";
import { IfcFragmentSettings } from "./ifc-fragment-settings";
import { Units } from "./units";
import { FragmentGroup, IfcGeometries } from "./types";

export class DataConverter {
  settings = new IfcFragmentSettings();

  private _categories: IfcItemsCategories = {};
  private _model = new FragmentGroup();
  private _ifcCategories = new IfcCategories();
  private _units = new Units();
  private _boundingBoxes: { [id: string]: number[] } = {};
  private _transparentBoundingBoxes: { [id: string]: number[] } = {};
  private _expressIDfragmentIDMap: { [expressID: string]: string } = {};
  private _propertyExporter = new IfcJsonExporter();

  private readonly _spatialTree = new SpatialStructure();

  constructor() {}

  reset() {
    this._model = new FragmentGroup();
    // this._uniqueItems = {};
    this._boundingBoxes = {};
    this._transparentBoundingBoxes = {};
  }

  cleanUp() {
    this._spatialTree.cleanUp();
    this._categories = {};
    this._model = new FragmentGroup();
    this._ifcCategories = new IfcCategories();
    // this._uniqueItems = {};
    this._units = new Units();
    this._propertyExporter = new IfcJsonExporter();
  }

  saveIfcCategories(webIfc: WEBIFC.IfcAPI) {
    this._categories = this._ifcCategories.getAll(webIfc, 0);
  }

  async generate(webIfc: WEBIFC.IfcAPI, geometries: IfcGeometries) {
    await this._units.setUp(webIfc);
    await this._spatialTree.setUp(webIfc, this._units);
    this.createAllFragments(geometries);
    await this.saveModelData(webIfc);
    console.log(this._model);
    return this._model;
  }

  private async saveModelData(webIfc: WEBIFC.IfcAPI) {
    this._model.boundingBoxes = this._boundingBoxes;
    this._model.transparentBoundingBoxes = this._transparentBoundingBoxes;
    this._model.expressIDFragmentIDMap = this._expressIDfragmentIDMap;
    this._model.levelRelationships = this._spatialTree.itemsByFloor;
    this._model.floorsProperties = this._spatialTree.floorProperties;
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
    if (!this.settings.includeProperties) {
      return {};
    }
    return new Promise<any>((resolve) => {
      this._propertyExporter.propertiesSerialized.on((properties: any) => {
        resolve(properties);
      });
      this._propertyExporter.export(webIfc, 0);
    });
  }

  private createAllFragments(geometries: IfcGeometries) {
    const uniqueItems: {
      [matID: string]: {
        material: THREE.MeshLambertMaterial;
        geometries: THREE.BufferGeometry[];
        expressIDs: string[];
      };
    } = {};

    const matrix = new THREE.Matrix4();
    const color = new THREE.Color();

    for (const id in geometries) {
      const { buffer, instances } = geometries[id];

      const transparent = instances[0].color.w !== 1;
      const opacity = transparent ? 0.5 : 1;
      const material = new THREE.MeshLambertMaterial({ transparent, opacity });

      if (instances.length === 1) {
        const instance = instances[0];
        const { x, y, z, w } = instance.color;
        const matID = `${x}-${y}-${z}-${w}`;
        if (!uniqueItems[matID]) {
          material.color = new THREE.Color().setRGB(x, y, z, "srgb");
          uniqueItems[matID] = { material, geometries: [], expressIDs: [] };
        }
        matrix.fromArray(instance.matrix);
        this._units.apply(matrix);
        buffer.applyMatrix4(matrix);
        uniqueItems[matID].geometries.push(buffer);
        uniqueItems[matID].expressIDs.push(instance.expressID.toString());
        continue;
      }

      const fragment = new FRAGS.Fragment(buffer, material, instances.length);

      for (let i = 0; i < instances.length; i++) {
        const instance = instances[i];
        matrix.fromArray(instance.matrix);
        this._units.apply(matrix);
        fragment.setInstance(i, {
          ids: [instance.expressID.toString()],
          transform: matrix,
        });

        const { x, y, z } = instance.color;
        color.setRGB(x, y, z, "srgb");
        fragment.mesh.setColorAt(i, color);
      }

      fragment.mesh.updateMatrix();
      this._model.fragments.push(fragment);
      this._model.add(fragment.mesh);
    }

    const transform = new THREE.Matrix4();
    for (const matID in uniqueItems) {
      const { material, geometries, expressIDs } = uniqueItems[matID];
      const geometry = FRAGS.GeometryUtils.merge([geometries], true);
      const fragment = new FRAGS.Fragment(geometry, material, 1);
      fragment.setInstance(0, { ids: expressIDs, transform });
      this._model.fragments.push(fragment);
      this._model.add(fragment.mesh);
    }
  }
}
