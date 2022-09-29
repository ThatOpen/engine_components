import * as THREE from "three";
import { NavigationMode } from "../base-types";
import { Components } from "../../../components";
import { OrthoPerspectiveCamera } from "../ortho-perspective-camera";
import { Event } from "../../../core";

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

  constructor(
    public components: Components,
    public camera: OrthoPerspectiveCamera
  ) {
    this.activateOrbitControls();
  }

  /** {@link NavigationMode.toggle} */
  toggle(active: boolean) {
    this.enabled = active;
    if (active) {
      this.activateOrbitControls();
    }
  }

  async fitModelToFrame() {
    if (!this.enabled) return;
    const scene = this.components.scene.get();
    const box = new THREE.Box3().setFromObject(
      scene.children[scene.children.length - 1]
    );
    const sceneSize = new THREE.Vector3();
    box.getSize(sceneSize);
    const sceneCenter = new THREE.Vector3();
    box.getCenter(sceneCenter);
    const nearFactor = 0.5;
    const radius = Math.max(sceneSize.x, sceneSize.y, sceneSize.z) * nearFactor;
    const sphere = new THREE.Sphere(sceneCenter, radius);
    await this.camera.controls.fitToSphere(sphere, true);
  }

  private activateOrbitControls() {
    const controls = this.camera.controls;
    controls.minDistance = 1;
    controls.maxDistance = 300;
    controls.truckSpeed = 2;
  }
}
