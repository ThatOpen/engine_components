import * as THREE from "three";
import * as WEBIFC from "web-ifc";

export interface IfcGeometries {
  [id: string]: {
    buffer: THREE.BufferGeometry;
    instances: { color: WEBIFC.Color; matrix: number[]; expressID: number }[];
  };
}

export interface IfcCivil {
  IfcAlignment: WEBIFC.IfcAlignment[];
  IfcCrossSection2D: WEBIFC.IfcCrossSection[];
  IfcCrossSection3D: WEBIFC.IfcCrossSection[];
}
