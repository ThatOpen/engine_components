import * as THREE from "three";

export interface MapboxBuilding {
  id: string;
  lat: number;
  lng: number;
  htmlElement: HTMLElement;
  transformation: THREE.Matrix4;
}

export interface MapboxParameters {
  container: HTMLDivElement;
  accessToken: string;
  buildings: MapboxBuilding[];
}
