import * as THREE from "three";

export interface DimensionData {
  start: THREE.Vector3;
  end: THREE.Vector3;
  lineMaterial: THREE.Material;
  endpoint: THREE.Mesh;
}
