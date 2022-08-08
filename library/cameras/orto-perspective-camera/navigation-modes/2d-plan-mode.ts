import { Box3, Camera } from "three";
import CameraControls from "camera-controls";
import { AdvancedCamera, NavigationModes, NavMode } from "../base-types";
import { LiteEvent } from "../../../core";
import { Components } from "../../../components";

export class PlanMode implements NavMode {
  readonly mode = NavigationModes.Plan;
  enabled = false;
  onChange = new LiteEvent<any>();
  onChangeProjection = new LiteEvent<Camera>();

  private readonly defaultAzimuthSpeed: number;
  private readonly defaultPolarSpeed: number;

  constructor(private components: Components, private camera: AdvancedCamera) {
    this.defaultAzimuthSpeed = camera.controls.azimuthRotateSpeed;
    this.defaultPolarSpeed = camera.controls.polarRotateSpeed;
  }

  toggle(active: boolean) {
    this.enabled = active;
    const controls = this.camera.controls;
    controls.azimuthRotateSpeed = active ? 0 : this.defaultAzimuthSpeed;
    controls.polarRotateSpeed = active ? 0 : this.defaultPolarSpeed;
    controls.mouseButtons.left = CameraControls.ACTION.ROTATE;
  }

  async fitModelToFrame() {
    if (!this.enabled) return;
    const scene = this.components.scene.getScene();
    console.log(scene);
    const box = new Box3().setFromObject(scene.children[0]);
    await this.camera.controls.fitToBox(box, false);
  }
}
