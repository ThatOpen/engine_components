import * as THREE from "three";
import { BufferGeometry } from "three";
import * as WEBIFC from "web-ifc";
import * as FRAGS from "bim-fragment";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils";
import {
  IfcCategories,
  IfcItemsCategories,
  IfcJsonExporter,
} from "../../../ifc";
import { SpatialStructure } from "./spatial-structure";
import { IfcFragmentSettings } from "./ifc-fragment-settings";
import { IfcGeometries } from "./types";
import { toCompositeID } from "../../../utils";
import { FragmentBoundingBox } from "../../FragmentBoundingBox";
import { Components } from "../../../core";

export class DataConverter {
  settings = new IfcFragmentSettings();
  categories: IfcItemsCategories = {};
  components: Components;

  private _model = new FRAGS.FragmentsGroup();
  private _ifcCategories = new IfcCategories();

  private _fragmentKey = 0;

  private _keyFragmentMap: { [key: number]: string } = {};
  private _itemKeyMap: { [expressID: string]: number[] } = {};

  private _propertyExporter = new IfcJsonExporter();

  private readonly _spatialTree = new SpatialStructure();

  constructor(components: Components) {
    this.components = components;
  }

  cleanUp() {
    this._fragmentKey = 0;
    this._spatialTree.cleanUp();
    this.categories = {};
    this._model = new FRAGS.FragmentsGroup();
    this._ifcCategories = new IfcCategories();
    this._propertyExporter = new IfcJsonExporter();
    this._keyFragmentMap = {};
    this._itemKeyMap = {};
  }

  saveIfcCategories(webIfc: WEBIFC.IfcAPI) {
    this.categories = this._ifcCategories.getAll(webIfc, 0);
  }

  async generate(webIfc: WEBIFC.IfcAPI, geometries: IfcGeometries) {
    await this._spatialTree.setUp(webIfc);
    this.createAllFragments(geometries);
    await this.saveModelData(webIfc);
    return this._model;
  }

  private async saveModelData(webIfc: WEBIFC.IfcAPI) {
    const itemsData = this.getFragmentsGroupData();
    this._model.keyFragments = this._keyFragmentMap;
    this._model.data = itemsData;
    this._model.coordinationMatrix = this.getCoordinationMatrix(webIfc);
    this._model.properties = await this.getModelProperties(webIfc);
    this._model.uuid = this.getProjectID(webIfc) || this._model.uuid;
    this._model.ifcMetadata = this.getIfcMetadata(webIfc);
    this._model.boundingBox = await this.getBoundingBox();
  }

  private async getBoundingBox() {
    const bbox = await this.components.tools.get(FragmentBoundingBox);
    bbox.reset();
    bbox.add(this._model);
    return bbox.get();
  }

  private getIfcMetadata(webIfc: WEBIFC.IfcAPI) {
    const { FILE_NAME, FILE_DESCRIPTION } = WEBIFC;
    const name = this.getMetadataEntry(webIfc, FILE_NAME);
    const description = this.getMetadataEntry(webIfc, FILE_DESCRIPTION);
    const schema = (webIfc.GetModelSchema(0) as FRAGS.IfcSchema) || "IFC2X3";
    const maxExpressID: number = webIfc.GetMaxExpressID(0);
    return { name, description, schema, maxExpressID };
  }

  private getMetadataEntry(webIfc: WEBIFC.IfcAPI, type: number) {
    let description = "";
    const descriptionData = webIfc.GetHeaderLine(0, type) || "";
    if (!descriptionData) return description;
    for (const arg of descriptionData.arguments) {
      if (arg === null || arg === undefined) {
        continue;
      }
      if (Array.isArray(arg)) {
        for (const subArg of arg) {
          description += `${subArg.value}|`;
        }
      } else {
        description += `${arg.value}|`;
      }
    }
    return description;
  }

  private getProjectID(webIfc: WEBIFC.IfcAPI) {
    const projectsIDs = webIfc.GetLineIDsWithType(0, WEBIFC.IFCPROJECT);
    const projectID = projectsIDs.get(0);
    const project = webIfc.GetLine(0, projectID);
    return project.GlobalId.value;
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
      this._propertyExporter.onPropertiesSerialized.add((properties: any) => {
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
      const opacity = transparent ? 0.4 : 1;
      const material = new THREE.MeshLambertMaterial({ transparent, opacity });

      // This prevents z-fighting for ifc spaces
      if (opacity !== 1) {
        material.depthWrite = false;
        material.polygonOffset = true;
        material.polygonOffsetFactor = 5;
        material.polygonOffsetUnits = 1;
      }

      if (instances.length === 1) {
        const instance = instances[0];
        const { x, y, z, w } = instance.color;
        const matID = `${x}-${y}-${z}-${w}`;
        if (!uniqueItems[matID]) {
          material.color = new THREE.Color().setRGB(x, y, z, "srgb");
          uniqueItems[matID] = { material, geometries: [], expressIDs: [] };
        }
        matrix.fromArray(instance.matrix);
        buffer.applyMatrix4(matrix);
        uniqueItems[matID].geometries.push(buffer);
        uniqueItems[matID].expressIDs.push(instance.expressID.toString());
        continue;
      }

      const fragment = new FRAGS.Fragment(buffer, material, instances.length);
      this._keyFragmentMap[this._fragmentKey] = fragment.id;

      const previousIDs = new Set<number>();

      for (let i = 0; i < instances.length; i++) {
        const instance = instances[i];
        matrix.fromArray(instance.matrix);
        const { expressID } = instance;

        let instanceID = expressID.toString();
        let isComposite = false;
        if (!previousIDs.has(expressID)) {
          previousIDs.add(expressID);
        } else {
          if (!fragment.composites[expressID]) {
            fragment.composites[expressID] = 1;
          }
          const count = fragment.composites[expressID];
          instanceID = toCompositeID(expressID, count);
          isComposite = true;
          fragment.composites[expressID]++;
        }

        fragment.setInstance(i, {
          ids: [instanceID],
          transform: matrix,
        });

        const { x, y, z } = instance.color;
        color.setRGB(x, y, z, "srgb");
        fragment.mesh.setColorAt(i, color);

        if (!isComposite) {
          this.saveExpressID(expressID.toString());
        }
      }

      fragment.mesh.updateMatrix();
      this._model.items.push(fragment);
      this._model.add(fragment.mesh);
      this._fragmentKey++;
    }

    const transform = new THREE.Matrix4();
    for (const matID in uniqueItems) {
      const { material, geometries, expressIDs } = uniqueItems[matID];

      const geometriesByItem: { [expressID: string]: BufferGeometry[] } = {};
      for (let i = 0; i < expressIDs.length; i++) {
        const id = expressIDs[i];
        if (!geometriesByItem[id]) {
          geometriesByItem[id] = [];
        }
        geometriesByItem[id].push(geometries[i]);
      }

      const sortedGeometries: BufferGeometry[] = [];
      const sortedIDs: string[] = [];
      for (const id in geometriesByItem) {
        sortedIDs.push(id);
        const geometries = geometriesByItem[id];
        if (geometries.length) {
          const merged = mergeGeometries(geometries);
          sortedGeometries.push(merged);
        } else {
          sortedGeometries.push(geometries[0]);
        }
        for (const geometry of geometries) {
          geometry.dispose();
        }
      }

      const geometry = FRAGS.GeometryUtils.merge([sortedGeometries], true);
      const fragment = new FRAGS.Fragment(geometry, material, 1);
      this._keyFragmentMap[this._fragmentKey] = fragment.id;

      for (const id of sortedIDs) {
        this.saveExpressID(id);
      }
      this._fragmentKey++;

      fragment.setInstance(0, { ids: sortedIDs, transform });
      this._model.items.push(fragment);
      this._model.add(fragment.mesh);
    }
  }

  private saveExpressID(expressID: string) {
    if (!this._itemKeyMap[expressID]) {
      this._itemKeyMap[expressID] = [];
    }
    this._itemKeyMap[expressID].push(this._fragmentKey);
  }

  private getFragmentsGroupData() {
    const itemsData: { [expressID: number]: [number[], number[]] } = {};
    for (const id in this._itemKeyMap) {
      const keys: number[] = [];
      const rels: number[] = [];
      const idNum = parseInt(id, 10);
      const level = this._spatialTree.itemsByFloor[idNum] || 0;
      const category = this.categories[idNum] || 0;
      rels.push(level, category);
      for (const key of this._itemKeyMap[id]) {
        keys.push(key);
      }
      itemsData[idNum] = [keys, rels];
    }
    return itemsData;
  }
}
