import * as THREE from "three";
import { EdgesPlane } from "../visibility";

export interface PlanViewConfig {
  id: string;
  ortho: boolean;
  normal: THREE.Vector3;
  point: THREE.Vector3;
  rotation?: number;
  data: any;
}

export interface PlanView extends PlanViewConfig {
  plane?: EdgesPlane;
}
