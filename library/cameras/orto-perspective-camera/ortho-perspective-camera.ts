import { Camera, OrthographicCamera } from "three";
import { LiteEvent, SimpleCamera } from "../../core";
import {
  NavMode,
  NavigationModes,
  AdvancedCamera,
  CameraProjections,
} from "./base-types";
import { ProjectionManager } from "./projection-manager";
import { Components } from "../../components";
import { OrbitMode } from "./navigation-modes/orbit-mode";
import { PlanMode } from "./navigation-modes/2d-plan-mode";
import { FirstPersonMode } from "./navigation-modes/first-person-mode";

export class OrthoPerspectiveCamera
  extends SimpleCamera
  implements AdvancedCamera
{
  readonly orthoCamera: OrthographicCamera;

  readonly navMode = new Map<NavigationModes, NavMode>();
  currentNavMode: NavMode;

  readonly onChange = new LiteEvent<any>();
  readonly onChangeProjection = new LiteEvent<Camera>();

  private readonly userInputButtons: any = {};
  private readonly projectionManager: ProjectionManager;
  private readonly frustumSize = 50;

  get projection() {
    return this.projectionManager.projection;
  }

  async setProjection(projection: CameraProjections) {
    await this.projectionManager.setProjection(projection);
    this.onChangeProjection.trigger(this.activeCamera);
  }

  constructor(components: Components) {
    super(components);

    this.orthoCamera = this.newOrthoCamera();

    this.navMode.set(NavigationModes.Orbit, new OrbitMode(components, this));
    this.navMode.set(NavigationModes.FirstPerson, new FirstPersonMode(this));
    this.navMode.set(NavigationModes.Plan, new PlanMode(components, this));
    this.currentNavMode = this.navMode.get(NavigationModes.Orbit)!;
    this.currentNavMode.toggle(true, { preventTargetAdjustment: true });

    Object.values(this.navMode).forEach((mode) => {
      mode.onChange.on(this.onChange.trigger);
      mode.onChangeProjection.on(this.onChangeProjection.trigger);
    });

    this.projectionManager = new ProjectionManager(components, this);
  }

  toggleUserInput(active: boolean) {
    if (active) {
      if (Object.keys(this.userInputButtons).length === 0) return;
      this.controls.mouseButtons.left = this.userInputButtons.left;
      this.controls.mouseButtons.right = this.userInputButtons.right;
      this.controls.mouseButtons.middle = this.userInputButtons.middle;
      this.controls.mouseButtons.wheel = this.userInputButtons.wheel;
    } else {
      this.userInputButtons.left = this.controls.mouseButtons.left;
      this.userInputButtons.right = this.controls.mouseButtons.right;
      this.userInputButtons.middle = this.controls.mouseButtons.middle;
      this.userInputButtons.wheel = this.controls.mouseButtons.wheel;

      this.controls.mouseButtons.left = 0;
      this.controls.mouseButtons.right = 0;
      this.controls.mouseButtons.middle = 0;
      this.controls.mouseButtons.wheel = 0;
    }
  }

  setNavigationMode(mode: NavigationModes) {
    if (this.currentNavMode.mode === mode) return;
    this.currentNavMode.toggle(false);
    if (!this.navMode.has(mode)) {
      throw new Error("The specified mode does not exist!");
    }
    this.currentNavMode = this.navMode.get(mode)!;
    this.currentNavMode.toggle(true);
  }

  resize() {
    super.resize();
    this.setOrthoCameraAspect();
  }

  private newOrthoCamera() {
    const dims = this.components.renderer.getSize();
    const aspect = dims.x / dims.y;
    return new OrthographicCamera(
      (this.frustumSize * aspect) / -2,
      (this.frustumSize * aspect) / 2,
      this.frustumSize / 2,
      this.frustumSize / -2,
      0.1,
      1000
    );
  }

  private setOrthoCameraAspect() {
    const size = this.components.renderer.getSize();
    const aspect = size.x / size.y;
    this.orthoCamera.left = (-this.frustumSize * aspect) / 2;
    this.orthoCamera.right = (this.frustumSize * aspect) / 2;
    this.orthoCamera.top = this.frustumSize / 2;
    this.orthoCamera.bottom = -this.frustumSize / 2;
    this.orthoCamera.updateProjectionMatrix();
  }
}
