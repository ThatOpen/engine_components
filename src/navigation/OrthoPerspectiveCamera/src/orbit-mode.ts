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
    controls.truckSpeed = 2;
  }
}
