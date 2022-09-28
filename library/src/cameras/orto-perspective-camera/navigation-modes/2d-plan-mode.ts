import { Box3, Camera } from "three";
import CameraControls from "camera-controls";
import { AdvancedCamera, NavigationModes, NavMode } from "../base-types";
import { Event } from "../../../core";
import { Components } from "../../../components";

export class PlanMode implements NavMode {
  readonly mode = NavigationModes.Plan;
  enabled = false;
  onChange = new Event<any>();
  onChangeProjection = new Event<Camera>();

  private readonly defaultAzimuthSpeed: number;
  private readonly defaultPolarSpeed: number;

  private mouseAction1?: any;
  private mouseAction2?: any;
  private mouseInitialized = false;

  constructor(private components: Components, private camera: AdvancedCamera) {
    this.defaultAzimuthSpeed = camera.controls.azimuthRotateSpeed;
    this.defaultPolarSpeed = camera.controls.polarRotateSpeed;
  }

  toggle(active: boolean) {
    this.enabled = active;
    const controls = this.camera.controls;
    controls.azimuthRotateSpeed = active ? 0 : this.defaultAzimuthSpeed;
    controls.polarRotateSpeed = active ? 0 : this.defaultPolarSpeed;

    if (!this.mouseInitialized) {
      this.mouseAction1 = controls.touches.one;
      this.mouseAction2 = controls.touches.two;
      this.mouseInitialized = true;
    }

    if (active) {
      controls.mouseButtons.left = CameraControls.ACTION.TRUCK;
      controls.touches.one = CameraControls.ACTION.TOUCH_TRUCK;
      controls.touches.two = CameraControls.ACTION.TOUCH_ZOOM;
    } else {
      controls.mouseButtons.left = CameraControls.ACTION.ROTATE;
      controls.touches.one = this.mouseAction1!;
      controls.touches.two = this.mouseAction2!;
    }
  }

  async fitModelToFrame() {
    if (!this.enabled) return;
    const scene = this.components.scene.get();
    console.log(scene);
    const box = new Box3().setFromObject(scene.children[0]);
    await this.camera.controls.fitToBox(box, false);
  }
}
