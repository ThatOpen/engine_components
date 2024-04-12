import * as THREE from "three";
import { NavigationMode } from "./types";
import { Event } from "../../../base-types";

/**
 * A {@link NavigationMode} that allows 3D navigation and panning
 * like in many 3D and CAD softwares.
 */
export class OrbitMode implements NavigationMode {
  /** {@link NavigationMode.enabled} */
  enabled = true;

  /** {@link NavigationMode.id} */
  readonly id = "Orbit";

  /** {@link NavigationMode.projectionChanged} */
  readonly projectionChanged = new Event<THREE.Camera>();

  constructor(public camera: any) {
    this.activateOrbitControls();
  }

  /** {@link NavigationMode.toggle} */
  toggle(active: boolean) {
    this.enabled = active;
    if (active) {
      this.activateOrbitControls();
    }
  }

  private activateOrbitControls() {
    const controls = this.camera.controls;
    controls.minDistance = 1;
    controls.maxDistance = 300;
    const position = new THREE.Vector3();
    controls.getPosition(position);
    const distance = position.length();
    controls.distance = distance;
    controls.truckSpeed = 2;
    const { rotation } = this.camera.get();
    const direction = new THREE.Vector3(0, 0, -1).applyEuler(rotation);
    const target = position.addScaledVector(direction, distance);
    controls.moveTo(target.x, target.y, target.z);
  }
}
