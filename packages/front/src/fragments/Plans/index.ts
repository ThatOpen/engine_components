import * as THREE from "three";
import * as FRAGS from "@thatopen/fragments";
import * as WEBIFC from "web-ifc";
import * as OBC from "@thatopen/components";
import { Section, Sections } from "../Sections";

/** The data that describes a plan view. */
export interface PlanView extends Section {
  /** The offset of the clipping plane to the plan height. */
  planOffset: number;
}

/**
 * Component to easily define and navigate 2D floor plans. 📕 [Tutorial](https://docs.thatopen.com/Tutorials/Components/Front/Plans). 📘 [API](https://docs.thatopen.com/api/@thatopen/components-front/classes/Plans).
 */
export class Plans extends OBC.Component implements OBC.Disposable {
  /**
   * A unique identifier for the component.
   * This UUID is used to register the component within the Components system.
   */
  static readonly uuid = "a80874aa-1c93-43a4-80f2-df346da086b1" as const;

  /** {@link OBC.Disposable.onDisposed} */
  readonly onDisposed = new OBC.Event();

  /** The plane type for the clipping planes created by this component. */
  readonly planeType = "floorplan";

  /**
   * Event triggered when the user navigates to a different floor plan.
   * The event provides the id of the floor plan the user navigated to.
   */
  readonly onNavigated = new OBC.Event<{ id: string }>();

  /**
   * Event triggered when the user exits the floor plan view.
   */
  readonly onExited = new OBC.Event();

  /** {@link OBC.Component.enabled} */
  enabled = false;

  /** The floorplan that is currently selected. */
  currentPlan: PlanView | null = null;

  /** The offset from the clipping planes to their respective floor plan elevation. */
  offset = 1.5;

  /**
   * A list of all the floor plans created.
   * Each floor plan is represented by a {@link PlanView} object.
   */
  list: PlanView[] = [];

  private _cachedPlanCamera: {
    position: THREE.Vector3;
    target: THREE.Vector3;
    zoom: number;
    top: number;
    bottom: number;
    right: number;
    left: number;
  } | null = null;

  /**
   * A reference to the world in which the floor plans are displayed.
   * This is used to access the camera and other relevant components.
   */
  get world() {
    const sections = this.components.get(Sections);
    return sections.world;
  }

  /**
   * A reference to the world in which the floor plans are displayed.
   * This is used to access the camera and other relevant components.
   */
  set world(world: OBC.World | undefined) {
    const sections = this.components.get(Sections);
    sections.world = world;
  }

  /** The offset of the 2D camera to the floor plan elevation. */
  get defaultCameraOffset() {
    const sections = this.components.get(Sections);
    return sections.offset;
  }

  /** The offset of the 2D camera to the floor plan elevation. */
  set defaultCameraOffset(value: number) {
    const sections = this.components.get(Sections);
    sections.offset = value;
  }

  constructor(components: OBC.Components) {
    super(components);
    this.components.add(Plans.uuid, this);
  }

  /** {@link OBC.Disposable.dispose} */
  dispose() {
    this.onExited.reset();
    this.onNavigated.reset();
    const sections = this.components.get(Sections);
    for (const plan of this.list) {
      sections.delete(plan.id);
    }
    this.list = [];
    this.onDisposed.trigger();
    this.onDisposed.reset();
  }

  /**
   * Generates floor plans from the provided IFC model.
   * @param model - The IFC model from which to generate floor plans.
   * @throws Will throw an error if the model does not have properties or if floor plans are not found.
   */
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

      const height = floorHeight.value * units + coordHeight + this.offset;

      this.create({
        name: floor.Name.value,
        id: floor.GlobalId.value,
        normal: new THREE.Vector3(0, -1, 0),
        point: new THREE.Vector3(0, height, 0),
      });
    }
  }

  /**
   * Creates a new floor plan based on the provided configuration.
   *
   * @param config - The configuration object for the new floor plan.
   */
  create(config: {
    id: string;
    name?: string;
    point: THREE.Vector3;
    normal: THREE.Vector3;
    type?: string;
  }) {
    const sections = this.components.get(Sections);
    config.type = config.type || this.planeType;
    const section = sections.create(config);
    const planView = { ...section, planOffset: this.offset };
    this.list.push(planView);
  }

  /**
   * Navigates to the floor plan with the specified id.
   *
   * @param id - The id of the floor plan to navigate to.
   * @param animate - Whether to animate the camera movement. Default is false.
   */
  async goTo(id: string, animate = false) {
    if (this.enabled) {
      this.cachePlanCamera();
    }
    const sections = this.components.get(Sections);
    await sections.goTo(id, animate);
    await this.applyCachedPlanCamera();
    const foundPlan = this.list.find((plan) => plan.id === id);
    if (foundPlan) {
      this.currentPlan = foundPlan;
    }
    this.enabled = true;
  }

  /**
   * Exits the floor plan view and returns to the 3D view.
   *
   * @param animate - Whether to animate the camera movement. Default is false.
   */
  async exitPlanView(animate = false) {
    if (!this.enabled) {
      return;
    }

    this.cachePlanCamera();
    const sections = this.components.get(Sections);
    await sections.exit(animate);
    this.currentPlan = null;
    this.enabled = false;
    this.onExited.trigger();
  }

  private cachePlanCamera() {
    // We cache the plan position separately because we want that when switching floorplans
    // we maintain the camera position
    const camera = this.world?.camera as OBC.OrthoPerspectiveCamera;
    const target = new THREE.Vector3();
    const position = new THREE.Vector3();
    camera.controls.getTarget(target);
    camera.controls.getPosition(position);
    this._cachedPlanCamera = {
      target,
      position,
      zoom: camera.threeOrtho.zoom,
      top: camera.threeOrtho.top,
      right: camera.threeOrtho.right,
      bottom: camera.threeOrtho.bottom,
      left: camera.threeOrtho.left,
    };
  }

  private async applyCachedPlanCamera() {
    if (!this._cachedPlanCamera) {
      return;
    }
    const camera = this.world?.camera as OBC.OrthoPerspectiveCamera;
    const { position: p, target: t } = this._cachedPlanCamera;

    const currentPosition = new THREE.Vector3();
    const currentTarget = new THREE.Vector3();
    camera.controls.getPosition(currentPosition);
    camera.controls.getTarget(currentTarget);
    const cpy = currentPosition.y;
    const cty = currentTarget.y;

    await camera.controls.setLookAt(p.x, cpy, p.z, t.x, cty, t.z);
    await camera.controls.zoomTo(this._cachedPlanCamera.zoom);

    camera.threeOrtho.top = this._cachedPlanCamera.top;
    camera.threeOrtho.bottom = this._cachedPlanCamera.bottom;
    camera.threeOrtho.left = this._cachedPlanCamera.left;
    camera.threeOrtho.right = this._cachedPlanCamera.right;
    camera.threeOrtho.updateProjectionMatrix();
  }

  private getAbsoluteFloorHeight(placement: any, height: { value: number }) {
    const coords = placement.RelativePlacement.Location.Coordinates;
    height.value += coords[2].value;
    if (placement.PlacementRelTo) {
      this.getAbsoluteFloorHeight(placement.PlacementRelTo, height);
    }
  }
}
