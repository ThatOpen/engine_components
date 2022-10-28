import * as THREE from "three";
import { Fragment } from "bim-fragment/fragment";

export class FragmentGroup {
  fragments: Fragment[] = [];
  levelRelationships: any;
  allTypes: any;
  itemTypes: any;
  floorsProperties: any;
}

export interface GeometriesByMaterial {
  [materialID: string]: {
    material: THREE.MeshLambertMaterial;
    geometries: THREE.BufferGeometry[];
  };
}
