import * as THREE from "three";
import { BaseScene } from "./base-scene";
import { BaseCamera } from "./base-camera";
import { BaseRenderer } from "./base-renderer";
import { Updateable, Disposable } from "./interfaces";

export interface World extends Disposable, Updateable {
  meshes: Set<THREE.Mesh>;
  scene: BaseScene;
  camera: BaseCamera;
  renderer: BaseRenderer | null;
  uuid: string;
}
