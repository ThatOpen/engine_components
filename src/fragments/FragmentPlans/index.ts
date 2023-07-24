import * as THREE from "three";
import { FragmentsGroup } from "bim-fragment";
import * as WEBIFC from "web-ifc";
import { Component, Disposable } from "../../base-types";
import {
  EdgesClipper,
  EdgesPlane,
  CameraProjection,
  OrthoPerspectiveCamera,
} from "../../navigation";
import { PlanView } from "./src/types";
import { IfcPropertiesUtils } from "../../ifc/IfcPropertiesUtils";

/**
 * Helper to control the camera and easily define and navigate 2D floor plans.
 */
export class PlanNavigator extends Component<PlanView[]> implements Disposable {
  name = "PlanNavigator";

  /** {@link Component.enabled} */
  enabled = false;

  /** The floorplan that is currently selected. */
  currentPlan: PlanView | null = null;

  /** The offset from the clipping planes to their respective floor plan elevation. */
  defaultSectionOffset = 1.5;

  /** The offset of the 2D camera to the floor plan elevation. */
  defaultCameraOffset = 30;

  /** The created floor plans. */
  storeys: { [modelID: number]: any[] } = [];

  private plans: PlanView[] = [];
  private floorPlanViewCached = false;
  private previousCamera = new THREE.Vector3();
  private previousTarget = new THREE.Vector3();
  private previousProjection: CameraProjection = "Perspective";

  /** {@link Component.get} */
  get() {
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
    this.plans = [];
    this.clipper.dispose();
  }

  // TODO: Compute georreference matrix when generating fragmentsgroup
  // so that we can correctly add floors in georreferenced models
  // where the IfcSite / IfcBuilding have location information
  async computeAllPlanViews(model: FragmentsGroup) {
    if (!model.properties) {
      throw new Error("Properties are needed to compute plan views!");
    }
    const { properties } = model;

    const floorsProps = IfcPropertiesUtils.getAllItemsOfType(
      properties,
      WEBIFC.IFCBUILDINGSTOREY
    );

    const units = IfcPropertiesUtils.getUnits(properties);

    for (const floor of floorsProps) {
      const height = floor.Elevation.value * units + this.defaultSectionOffset;
      await this.create({
        normal: new THREE.Vector3(0, -1, 0),
        point: new THREE.Vector3(0, height, 0),
        id: floor.Name.value,
        ortho: true,
      });
    }
  }

  /**
   * Creates a new floor plan in the navigator.
   *
   * @param config - Necessary data to initialize the floor plan.
   */
  async create(config: PlanView) {
    const previousPlan = this.plans.find((plan) => plan.id === config.id);
    if (previousPlan) {
      throw new Error(`There's already a plan with the id: ${config.id}`);
    }
    const plane = await this.createClippingPlane(config);
    plane.visible = false;
    const plan = { ...config, plane };
    this.plans.push(plan);
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
      if (this.currentPlan.plane instanceof EdgesPlane) {
        this.currentPlan.plane.edges.visible = false;
      }
    }
    this.currentPlan = null;
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
    const plane = this.clipper.createFromNormalAndCoplanarPoint(normal, point);
    plane.enabled = false;
    await plane.edges.update();
    plane.edges.visible = false;
    return plane;
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
    if (this.currentPlan.plane) {
      this.currentPlan.plane.enabled = true;
      if (this.currentPlan.plane instanceof EdgesPlane) {
        this.currentPlan.plane.edges.fillNeedsUpdate = true;
        this.currentPlan.plane.edges.visible = true;
      }
    }
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
    const foundPlan = this.plans.find((plan) => plan.id === id);
    if (!foundPlan) {
      throw new Error("The specified plan is undefined!");
    }
    this.currentPlan = foundPlan;
  }

  private hidePreviousClippingPlane() {
    if (this.currentPlan) {
      const plane = this.currentPlan.plane;
      if (plane) plane.enabled = false;
      if (this.currentPlan.plane instanceof EdgesPlane) {
        this.currentPlan.plane.edges.visible = false;
      }
    }
  }
}
