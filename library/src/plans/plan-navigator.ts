import * as THREE from "three";
import { EdgesClipper } from "../visibility";
import { CameraProjection, OrthoPerspectiveCamera } from "../cameras";
import { PlanView, PlanViewConfig } from "./base-types";

// TODO: Clean up and document this
export class PlanNavigator {
  plans: { [id: string]: PlanView } = {};

  active = false;
  currentPlan?: PlanView;

  defaultSectionOffset = 1.5;
  defaultCameraOffset = 30;
  storeys: { [modelID: number]: any[] } = [];

  private floorPlanViewCached = false;
  private previousCamera = new THREE.Vector3();
  private previousTarget = new THREE.Vector3();
  private previousProjection: CameraProjection = "Perspective";

  constructor(
    private clipper: EdgesClipper,
    private camera: OrthoPerspectiveCamera
  ) {}

  dispose() {
    (this.storeys as any) = null;
    (this.plans as any) = null;
  }

  async create(config: PlanViewConfig) {
    if (this.plans[config.id]) {
      throw new Error(`There's already a plan with the id: ${config.id}`);
    }
    this.plans[config.id] = config;
    await this.createClippingPlane(config);
  }

  async goTo(id: string, animate = false) {
    if (this.currentPlan?.id === id) {
      return;
    }
    this.storeCameraPosition();
    this.hidePreviousClippingPlane();
    this.updateCurrentPlan(id);
    this.activateCurrentPlan();
    if (!this.active) {
      await this.moveCameraTo2DPlanPosition(animate);
      this.active = true;
    }
  }

  async exitPlanView(animate = false) {
    if (!this.active) return;
    this.active = false;

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
    if (this.active) {
      this.cacheFloorplanView();
    } else {
      this.store3dCameraPosition();
    }
  }

  private async createClippingPlane(config: PlanViewConfig) {
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
