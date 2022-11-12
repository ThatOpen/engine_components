import * as THREE from "three";
import { Fragment } from "bim-fragment/fragment";

export class FragmentGroup extends THREE.Group {
  fragments: Fragment[] = [];
  levelRelationships: any;
  allTypes: any;
  itemTypes: any;
  floorsProperties: any;
  coordinationMatrix: any;
}

export interface GeometriesByMaterial {
  [materialID: string]: {
    material: THREE.MeshLambertMaterial;
    geometries: THREE.BufferGeometry[];
  };
}

export interface FragmentData {
  instances: { id: number; matrix: THREE.Matrix4 }[];
  geometriesByMaterial: { [materialID: string]: THREE.BufferGeometry[] };
  referenceMatrix: THREE.Matrix4;
}

export interface IfcToFragmentItems {
  [geometryID: string]: FragmentData;
}

export interface IfcToFragmentUniqueItems {
  [category: string]: {
    [floor: string]: {
      [materialID: string]: THREE.BufferGeometry[];
    };
  };
}

export interface MaterialList {
  [materialID: string]: THREE.MeshLambertMaterial;
}
