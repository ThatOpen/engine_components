import * as THREE from "three";
import * as FRAGS from "@thatopen/fragments";
import * as WEBIFC from "web-ifc";
import * as OBC from "@thatopen/components";
import { PlanView } from "./src";

import { EdgesPlane } from "../../core/EdgesClipper";

/**
 * Helper to control the camera and easily define and navigate 2D floor plans.
 */
export class Plans extends OBC.Component implements OBC.Disposable {
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

  list: PlanView[] = [];

  world?: OBC.World;

  private _floorPlanViewCached = false;
  private _previousCamera = new THREE.Vector3();
  private _previousTarget = new THREE.Vector3();
  private _previousProjection: OBC.CameraProjection = "Perspective";

  constructor(components: OBC.Components) {
    super(components);
    this.components.add(Plans.uuid, this);
  }

  /** {@link Disposable.dispose} */
  dispose() {
    this.onExited.reset();
    this.onNavigated.reset();
    this.list = [];
    this.onDisposed.trigger();
    this.onDisposed.reset();
  }

  // TODO: Compute georreference matrix when generating fragmentsgroup
  // so that we can correctly add floors in georreferenced models
  // where the IfcSite / IfcBuilding have location information
  async generate(model: FRAGS.FragmentsGroup) {
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
      this.create({
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
  create(config: PlanView) {
    if (!this.world) {
      throw new Error(
        "You must set a world before creating the clipping planes!",
      );
    }
    const previousPlan = this.list.find((plan) => plan.id === config.id);
    if (previousPlan) {
      console.warn(`There's already a plan with the id: ${config.id}`);
      return;
    }
    const plane = this.createClippingPlane(config);
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
      this.currentPlan.plane.enabled = false;
      this.currentPlan.plane.edges.enabled = false;
      this.currentPlan.plane.edges.visible = false;
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

  private createClippingPlane(config: PlanView) {
    if (!this.world) {
      throw new Error("World is needed to create clipping planes!");
    }

    const { normal, point } = config;
    const clippingPoint = point.clone();
    if (config.offset) {
      clippingPoint.y += config.offset;
    }

    const clipper = this.components.get(OBC.Clipper);
    const previousType = clipper.Type;
    clipper.Type = EdgesPlane;

    const plane = clipper.createFromNormalAndCoplanarPoint(
      this.world,
      normal,
      clippingPoint,
    ) as EdgesPlane;

    plane.edges.update();

    plane.visible = false;
    plane.enabled = false;
    plane.edges.enabled = false;
    plane.edges.visible = false;

    clipper.Type = previousType;

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
      this.currentPlan.plane.enabled = true;
      this.currentPlan.plane.edges.fillNeedsUpdate = true;
      this.currentPlan.plane.edges.visible = true;
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
    camera.three.getWorldPosition(this._previousCamera);
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
        plane.enabled = false;
      }
      if (this.currentPlan.plane instanceof EdgesPlane) {
        this.currentPlan.plane.edges.visible = false;
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
