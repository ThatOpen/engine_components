import * as THREE from "three";
import { EdgesClipper } from "../visibility";
import { CameraProjection, OrthoPerspectiveCamera } from "../cameras";
import { PlanView } from "./base-types";
import { Component, Disposable } from "../core";

export interface Plans {
  [id: string]: PlanView;
}

/**
 * Helper to control the camera and easily define and navigate 2D floor plans.
 */
export class PlanNavigator extends Component<Plans> implements Disposable {
  name = "PlanNavigator";

  /** {@link Component.enabled} */
  enabled = false;

  /** The floorplan that is currently selected. */
  currentPlan?: PlanView;

  /** The offset from the clipping planes to their respective floor plan elevation. */
  defaultSectionOffset = 1.5;

  /** The offset of the 2D camera to the floor plan elevation. */
  defaultCameraOffset = 30;

  /** The created floor plans. */
  storeys: { [modelID: number]: any[] } = [];

  private plans: Plans = {};
  private floorPlanViewCached = false;
  private previousCamera = new THREE.Vector3();
  private previousTarget = new THREE.Vector3();
  private previousProjection: CameraProjection = "Perspective";

  /** {@link Component.get} */
  get(): Plans {
    return this.plans;
  }

  constructor(
    private clipper: EdgesClipper,
    private camera: OrthoPerspectiveCamera
  ) {
    super();
  }

  /** {@link Disposable.dispose} */
  dispose() {
    this.storeys = [];
    this.plans = {};
    this.clipper.dispose();
  }

  /**
   * Creates a new floor plan in the navigator.
   *
   * @param config - Necessary data to initialize the floor plan.
   */
  async create(config: PlanView) {
    if (this.plans[config.id]) {
      throw new Error(`There's already a plan with the id: ${config.id}`);
    }
    this.plans[config.id] = config;
    await this.createClippingPlane(config);
  }

  /**
   * Make the navigator go to the specified floor plan.
   *
   * @param id - Floor plan to go to.
   * @param animate - Whether to animate the camera transition.
   */
  async goTo(id: string, animate = false) {
    if (this.currentPlan?.id === id) {
      return;
    }
    this.storeCameraPosition();
    this.hidePreviousClippingPlane();
    this.updateCurrentPlan(id);
    this.activateCurrentPlan();
    if (!this.enabled) {
      await this.moveCameraTo2DPlanPosition(animate);
      this.enabled = true;
    }
  }

  /**
   * Deactivate navigator and go back to the previous view.
   *
   * @param animate - Whether to animate the camera transition.
   */

  async exitPlanView(animate = false) {
    if (!this.enabled) return;
    this.enabled = false;

    this.cacheFloorplanView();

    this.camera.setNavigationMode("Orbit");
    await this.camera.setProjection(this.previousProjection);
    if (this.currentPlan && this.currentPlan.plane) {
      this.currentPlan.plane.enabled = false;
    }
    this.currentPlan = undefined;
    await this.camera.controls.setLookAt(
      this.previousCamera.x,
      this.previousCamera.y,
      this.previousCamera.z,
      this.previousTarget.x,
      this.previousTarget.y,
      this.previousTarget.z,
      animate
    );
  }

  private storeCameraPosition() {
    if (this.enabled) {
      this.cacheFloorplanView();
    } else {
      this.store3dCameraPosition();
    }
  }

  private async createClippingPlane(config: PlanView) {
    const { normal, point } = config;
    const plane = this.clipper.createFromNormalAndCoplanarPoint(
      normal,
      point,
      true
    );
    plane.enabled = false;
    this.plans[config.id].plane = plane;
    await plane.edges.update();
    plane.edges.visible = false;
  }

  private cacheFloorplanView() {
    this.floorPlanViewCached = true;
    this.camera.controls.saveState();
  }

  private async moveCameraTo2DPlanPosition(animate: boolean) {
    if (this.floorPlanViewCached) await this.camera.controls.reset(animate);
    else await this.camera.controls.setLookAt(0, 100, 0, 0, 0, 0, animate);
  }

  private activateCurrentPlan() {
    if (!this.currentPlan) throw new Error("Current plan is not defined.");
    if (this.currentPlan.plane) this.currentPlan.plane.enabled = true;
    this.camera.setNavigationMode("Plan");
    const projection = this.currentPlan.ortho ? "Orthographic" : "Perspective";
    this.camera.setProjection(projection);
  }

  private store3dCameraPosition() {
    const camera = this.camera.get();
    camera.getWorldPosition(this.previousCamera);
    this.camera.controls.getTarget(this.previousTarget);
    this.previousProjection = this.camera.getProjection();
  }

  private updateCurrentPlan(id: string) {
    if (!this.plans[id]) {
      throw new Error("The specified plan is undefined!");
    }
    this.currentPlan = this.plans[id];
  }

  private hidePreviousClippingPlane() {
    const plane = this.currentPlan?.plane;
    if (plane) plane.enabled = false;
  }
}
