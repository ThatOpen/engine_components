import * as THREE from "three";

export enum CivilMarkerType {
  SELECT = "select",
  HOVER = "hover",
}

export interface CivilPoint {
  point: THREE.Vector3;
  normal: THREE.Vector3;
  curve: THREE.Line;
  alignment: THREE.Group;
}
