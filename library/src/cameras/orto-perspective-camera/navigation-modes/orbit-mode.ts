// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Box3, Camera, Sphere, Vector3 } from "three";
import { AdvancedCamera, NavigationModes, NavMode } from "../base-types";
import { Event } from "../../../core";
import { Components } from "../../../components";

export class OrbitMode implements NavMode {
  enabled = true;

  readonly mode = NavigationModes.Orbit;
  readonly onChange = new Event();
  readonly onUnlock = new Event();
  readonly onChangeProjection = new Event<Camera>();

  constructor(private components: Components, private camera: AdvancedCamera) {
    this.activateOrbitControls();
  }

  /**
   * @deprecated Use cameraControls.getTarget.
   */
  get target() {
    const target = new Vector3();
    this.camera.controls.getTarget(target);
    return target;
  }

  toggle(active: boolean) {
    this.enabled = active;
    if (active) {
      this.activateOrbitControls();
    }
  }

  async fitModelToFrame() {
    if (!this.enabled) return;
    const scene = this.components.scene.get();
    const box = new Box3().setFromObject(
      scene.children[scene.children.length - 1]
    );
    const sceneSize = new Vector3();
    box.getSize(sceneSize);
    const sceneCenter = new Vector3();
    box.getCenter(sceneCenter);
    const nearFactor = 0.5;
    const radius = Math.max(sceneSize.x, sceneSize.y, sceneSize.z) * nearFactor;
    const sphere = new Sphere(sceneCenter, radius);
    await this.camera.controls.fitToSphere(sphere, true);
  }

  private activateOrbitControls() {
    const controls = this.camera.controls;
    controls.minDistance = 1;
    controls.maxDistance = 300;
    controls.truckSpeed = 2;
  }
}
