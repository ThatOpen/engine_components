import * as THREE from "three";
import { BaseWorldItem } from "./base-world-item";

export abstract class BaseCamera extends BaseWorldItem {
  abstract three: THREE.Camera;
}
