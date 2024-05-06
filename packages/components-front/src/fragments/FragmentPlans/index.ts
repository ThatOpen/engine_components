import * as THREE from "three";
import * as FRAGS from "@thatopen/fragments";
import * as WEBIFC from "web-ifc";
import * as OBC from "@thatopen/components";
import { PlanView } from "./src";

import { EdgesClipper, EdgesPlane } from "../../navigation/EdgesClipper";

/**
 * Helper to control the camera and easily define and navigate 2D floor plans.
 */
export class FragmentPlans extends OBC.Component implements OBC.Disposable {
  static readonly uuid = "a80874aa-1c93-43a4-80f2-df346da086b1" as const;

  /** {@link Disposable.onDisposed} */
  readonly onDisposed = new OBC.Event();

  readonly onNavigated = new OBC.Event<{ id: string }>();

  readonly onExited = new OBC.Event();

  enabled = false;

  /** The floorplan that is currently selected. */
  currentPlan: PlanView | null = null;

  /** The offset from the clipping planes to their respective floor plan elevation. */
  defaultSectionOffset = 1.5;

  /** The offset of the 2D camera to the floor plan elevation. */
  defaultCameraOffset = 30;

  /** The created floor plans. */
  storeys: { [modelID: number]: any[] } = [];

  list: PlanView[] = [];

  world?: OBC.World;

  private _floorPlanViewCached = false;
  private _previousCamera = new THREE.Vector3();
  private _previousTarget = new THREE.Vector3();
  private _previousProjection: OBC.CameraProjection = "Perspective";

  constructor(components: OBC.Components) {
    super(components);
    this.components.add(FragmentPlans.uuid, this);
  }

  /** {@link Disposable.dispose} */
  dispose() {
    this.onExited.reset();
    this.onNavigated.reset();
    this.storeys = [];
    this.list = [];
    this.onDisposed.trigger();
    this.onDisposed.reset();
  }

  // TODO: Compute georreference matrix when generating fragmentsgroup
  // so that we can correctly add floors in georreferenced models
  // where the IfcSite / IfcBuilding have location information
  async computeAllPlanViews(model: FRAGS.FragmentsGroup) {
    if (!model.hasProperties) {
      throw new Error("Properties are needed to compute plan views!");
    }

    const floorsProps = await model.getAllPropertiesOfType(
      WEBIFC.IFCBUILDINGSTOREY,
    );

    if (!floorsProps) {
      throw new Error("Floorplans not found!");
    }

    const coordHeight = model.coordinationMatrix.elements[13];
    const units = await OBC.IfcPropertiesUtils.getUnits(model);

    for (const floor of Object.values(floorsProps)) {
      const floorHeight = { value: 0 };

      this.getAbsoluteFloorHeight(floor.ObjectPlacement, floorHeight);

      const height = floorHeight.value * units + coordHeight;
      await this.create({
        name: floor.Name.value,
        id: floor.GlobalId.value,
        normal: new THREE.Vector3(0, -1, 0),
        point: new THREE.Vector3(0, height, 0),
        ortho: true,
        offset: this.defaultSectionOffset,
      });
    }
  }

  /**
   * Creates a new floor plan in the navigator.
   *
   * @param config - Necessary data to initialize the floor plan.
   */
  async create(config: PlanView) {
    const previousPlan = this.list.find((plan) => plan.id === config.id);
    if (previousPlan) {
      console.warn(`There's already a plan with the id: ${config.id}`);
      return;
    }
    const plane = await this.createClippingPlane(config);
    plane.visible = false;
    const plan = { ...config, plane };
    this.list.push(plan);
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
    this.onNavigated.trigger({ id });

    this.storeCameraPosition();
    await this.hidePreviousClippingPlane();
    this.updateCurrentPlan(id);
    await this.activateCurrentPlan();
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
    if (!this.world) return;
    this.enabled = false;
    this.onExited.trigger();

    this.cacheFloorplanView();

    const camera = this.world.camera as OBC.OrthoPerspectiveCamera;
    camera.set("Orbit");

    await camera.projection.set(this._previousProjection);
    if (this.currentPlan && this.currentPlan.plane) {
      await this.currentPlan.plane.setEnabled(false);
      await this.currentPlan.plane.edges.setVisible(false);
    }

    this.currentPlan = null;
    await camera.controls.setLookAt(
      this._previousCamera.x,
      this._previousCamera.y,
      this._previousCamera.z,
      this._previousTarget.x,
      this._previousTarget.y,
      this._previousTarget.z,
      animate,
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
    if (!this.world) {
      throw new Error("World is needed to create clipping planes!");
    }

    const { normal, point } = config;
    const clippingPoint = point.clone();
    if (config.offset) {
      clippingPoint.y += config.offset;
    }

    const clipper = this.components.get(EdgesClipper);

    const plane = clipper.createFromNormalAndCoplanarPoint(
      this.world,
      normal,
      clippingPoint,
    );

    await plane.setEnabled(false);
    await plane.edges.update();
    await plane.edges.setVisible(false);
    return plane;
  }

  private cacheFloorplanView() {
    if (!this.world) {
      throw new Error("World is needed to create clipping planes!");
    }
    this._floorPlanViewCached = true;
    const camera = this.world.camera as OBC.OrthoPerspectiveCamera;
    camera.controls.saveState();
  }

  private async moveCameraTo2DPlanPosition(animate: boolean) {
    if (!this.world) {
      throw new Error("World is needed to create clipping planes!");
    }
    const camera = this.world.camera as OBC.OrthoPerspectiveCamera;
    if (this._floorPlanViewCached) {
      await camera.controls.reset(animate);
    } else {
      await camera.controls.setLookAt(0, 100, 0, 0, 0, 0, animate);
    }
  }

  private async activateCurrentPlan() {
    if (!this.world) {
      throw new Error("World is needed to create clipping planes!");
    }
    if (!this.currentPlan) throw new Error("Current plan is not defined.");
    const camera = this.world.camera as OBC.OrthoPerspectiveCamera;
    if (this.currentPlan.plane) {
      await this.currentPlan.plane.setEnabled(true);
      this.currentPlan.plane.edges.fillNeedsUpdate = true;
      await this.currentPlan.plane.edges.setVisible(true);
    }
    camera.set("Plan");
    const projection = this.currentPlan.ortho ? "Orthographic" : "Perspective";
    await camera.projection.set(projection);
  }

  private store3dCameraPosition() {
    if (!this.world) {
      throw new Error("World is needed to create clipping planes!");
    }
    const camera = this.world.camera as OBC.OrthoPerspectiveCamera;
    const activeCamera = camera.current;
    activeCamera.getWorldPosition(this._previousCamera);
    camera.controls.getTarget(this._previousTarget);
    this._previousProjection = camera.projection.current;
  }

  private updateCurrentPlan(id: string) {
    const foundPlan = this.list.find((plan) => plan.id === id);
    if (!foundPlan) {
      throw new Error("The specified plan is undefined!");
    }
    this.currentPlan = foundPlan;
  }

  private async hidePreviousClippingPlane() {
    if (this.currentPlan) {
      const plane = this.currentPlan.plane;
      if (plane) {
        await plane.setEnabled(false);
      }
      if (this.currentPlan.plane instanceof EdgesPlane) {
        await this.currentPlan.plane.edges.setVisible(false);
      }
    }
  }

  private getAbsoluteFloorHeight(placement: any, height: { value: number }) {
    const coords = placement.RelativePlacement.Location.Coordinates;
    height.value += coords[2].value;
    if (placement.PlacementRelTo) {
      this.getAbsoluteFloorHeight(placement.PlacementRelTo, height);
    }
  }
}
