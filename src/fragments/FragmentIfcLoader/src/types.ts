import * as THREE from "three";
import * as WEBIFC from "web-ifc";

export interface IfcGeometries {
  [id: string]: {
    buffer: THREE.BufferGeometry;
    instances: { color: WEBIFC.Color; matrix: number[]; expressID: number }[];
  };
}
