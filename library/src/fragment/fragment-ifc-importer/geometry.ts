import * as WEBIFC from "web-ifc";
import * as THREE from "three";
import { IfcToFragmentItems, MaterialList } from "./base-types";

export class Geometry {
  private webIfc: WEBIFC.IfcAPI;
  private referenceMatrix = new THREE.Matrix4();
  private isFirstMatrix = true;
  private _materials: MaterialList;
  private _geometriesByMaterial: {
    [color: string]: THREE.BufferGeometry[];
  } = {};

  private readonly _items: IfcToFragmentItems = {};

  constructor(
    webIfc: WEBIFC.IfcAPI,
    items: IfcToFragmentItems,
    materials: MaterialList
  ) {
    this.webIfc = webIfc;
    this._items = items;
    this._materials = materials;
  }

  streamMesh(webifc: WEBIFC.IfcAPI, mesh: WEBIFC.FlatMesh) {
    this.reset(webifc);
    const geometryID = Geometry.getGeometryID(mesh);
    const isFirstInstanceOfThisGeometry = !this._items[geometryID];
    if (isFirstInstanceOfThisGeometry) {
      this.generateBufferGeometries(mesh, geometryID);
    } else {
      this.getGeometryTransformation(mesh, geometryID);
    }
  }

  cleanUp() {
    this._geometriesByMaterial = {};
  }

  private reset(webifc: WEBIFC.IfcAPI) {
    this._geometriesByMaterial = {};
    this.referenceMatrix = new THREE.Matrix4();
    this.isFirstMatrix = true;
    this.webIfc = webifc;
  }

  private getGeometryTransformation(mesh: WEBIFC.FlatMesh, geometryID: string) {
    const referenceMatrix = this._items[geometryID].referenceMatrix;
    const geometryData = mesh.geometries.get(0);
    const transform = Geometry.getMeshMatrix(geometryData);
    transform.multiply(referenceMatrix);
    this._items[geometryID].instances.push({
      id: mesh.expressID,
      matrix: transform,
    });
  }

  private generateBufferGeometries(mesh: WEBIFC.FlatMesh, geometryID: string) {
    const size = mesh.geometries.size();
    for (let i = 0; i < size; i++) {
      const geometryData = mesh.geometries.get(i);
      const geometry = this.getBufferGeometry(geometryData.geometryExpressID);
      if (!geometry) return;
      this.applyTransform(geometryData, geometry);
      this.sortGeometriesByMaterials(geometryData, geometry);
    }
    this.saveGeometryInstances(geometryID, mesh);
  }

  private saveGeometryInstances(geometryID: string, mesh: WEBIFC.FlatMesh) {
    this._items[geometryID] = {
      instances: [
        {
          id: mesh.expressID,
          matrix: new THREE.Matrix4(),
        },
      ],
      geometriesByMaterial: this._geometriesByMaterial,
      referenceMatrix: this.referenceMatrix,
    };
  }

  private sortGeometriesByMaterials(
    geometryData: WEBIFC.PlacedGeometry,
    geometry: THREE.BufferGeometry
  ) {
    const materialID = this.saveMaterials(geometryData);
    if (!this._geometriesByMaterial[materialID]) {
      this._geometriesByMaterial[materialID] = [geometry];
    } else {
      this._geometriesByMaterial[materialID].push(geometry);
    }
  }

  private saveMaterials(geometryData: WEBIFC.PlacedGeometry) {
    const color = geometryData.color;
    const colorID = `${color.x}${color.y}${color.z}${color.w}`;
    const materialAlreadySaved = this._materials[colorID] !== undefined;
    if (!materialAlreadySaved) {
      this.saveNewMaterial(colorID, color);
    }
    return colorID;
  }

  private saveNewMaterial(colorID: string, color: WEBIFC.Color) {
    this._materials[colorID] = new THREE.MeshLambertMaterial({
      color: new THREE.Color(color.x, color.y, color.z),
      transparent: color.w !== 1,
      opacity: color.w,
    });
  }

  private applyTransform(
    geometryData: WEBIFC.PlacedGeometry,
    geometry: THREE.BufferGeometry
  ) {
    const matrix = Geometry.getMeshMatrix(geometryData);

    // We apply the tranformation only to the first geometry, and then
    // apply the inverse to the rest of the instances
    geometry.applyMatrix4(matrix);

    // We store this matrix to use it as a reference point. We'll apply this
    // later to the rest of the instances
    if (this.isFirstMatrix) {
      this.referenceMatrix = new THREE.Matrix4().copy(matrix).invert();
      this.isFirstMatrix = false;
    }
  }

  private getBufferGeometry(expressID: number) {
    const geometry = this.webIfc.GetGeometry(0, expressID);
    const verts = this.getVertices(geometry);
    if (!verts.length) return null;
    const indices = this.getIndices(geometry);
    if (!indices.length) return null;
    const buffer = this.constructGeometry(verts, indices);
    // @ts-ignore
    geometry.delete();
    return buffer;
  }

  private getIndices(geometryData: WEBIFC.IfcGeometry) {
    const indices = this.webIfc.GetIndexArray(
      geometryData.GetIndexData(),
      geometryData.GetIndexDataSize()
    ) as Uint32Array;
    return indices;
  }

  private getVertices(geometryData: WEBIFC.IfcGeometry) {
    const verts = this.webIfc.GetVertexArray(
      geometryData.GetVertexData(),
      geometryData.GetVertexDataSize()
    ) as Float32Array;
    return verts;
  }

  private constructGeometry(vertexData: Float32Array, indexData: Uint32Array) {
    const geometry = new THREE.BufferGeometry();

    const posFloats = new Float32Array(vertexData.length / 2);
    const normFloats = new Float32Array(vertexData.length / 2);

    for (let i = 0; i < vertexData.length; i += 6) {
      posFloats[i / 2] = vertexData[i];
      posFloats[i / 2 + 1] = vertexData[i + 1];
      posFloats[i / 2 + 2] = vertexData[i + 2];

      normFloats[i / 2] = vertexData[i + 3];
      normFloats[i / 2 + 1] = vertexData[i + 4];
      normFloats[i / 2 + 2] = vertexData[i + 5];
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(posFloats, 3));
    geometry.setAttribute("normal", new THREE.BufferAttribute(normFloats, 3));
    geometry.setIndex(new THREE.BufferAttribute(indexData, 1));

    return geometry;
  }

  private static getMeshMatrix(geometry: WEBIFC.PlacedGeometry) {
    const matrix = geometry.flatTransformation;
    const mat = new THREE.Matrix4();
    mat.fromArray(matrix);
    return mat;
  }

  private static getGeometryID(mesh: WEBIFC.FlatMesh) {
    let result = "";
    const size = mesh.geometries.size();
    for (let i = 0; i < size; i++) {
      const placedGeometry = mesh.geometries.get(i);
      result += placedGeometry.geometryExpressID;
    }
    return result;
  }
}
