import * as THREE from "three";
import {
  Component,
  Createable,
  Disposable,
  Event,
  Hideable,
  UI,
  UIElement,
} from "../../base-types";
import { SimplePlane } from "./simple-plane";
import { Components } from "../Components";
import { Button } from "../../ui";
import { ToolComponent } from "../ToolsComponent";

export * from "./simple-plane";

// TODO: Clean up UI element

/**
 * A lightweight component to easily create and handle
 * [clipping planes](https://threejs.org/docs/#api/en/materials/Material.clippingPlanes).
 *
 * @param components - the instance of {@link Components} used.
 * @param planeType - the type of plane to be used by the clipper.
 * E.g. {@link SimplePlane}.
 */
export class SimpleClipper<T extends SimplePlane>
  extends Component<T[]>
  implements Createable, Disposable, Hideable, UI
{
  static readonly uuid = "66290bc5-18c4-4cd1-9379-2e17a0617611" as const;

  /** {@link Createable.onAfterCreate} */
  readonly onAfterCreate = new Event<T>();

  /** {@link Createable.onAfterDelete} */
  readonly onAfterDelete = new Event<T>();

  /** Event that fires when the user starts dragging a clipping plane. */
  readonly onBeforeDrag = new Event<void>();

  /** Event that fires when the user stops dragging a clipping plane. */
  readonly onAfterDrag = new Event<void>();

  onBeforeCreate = new Event();
  onBeforeCancel = new Event();
  onAfterCancel = new Event();
  onBeforeDelete = new Event();

  /** {@link UI.uiElement} */
  uiElement = new UIElement<{ main: Button }>();

  /**
   * Whether to force the clipping plane to be orthogonal in the Y direction
   * (up). This is desirable when clipping a building horizontally and a
   * clipping plane is created in it's roof, which might have a slight
   * slope for draining purposes.
   */
  orthogonalY = false;

  /**
   * The tolerance that determines whether a horizontallish clipping plane
   * will be forced to be orthogonal to the Y direction. {@link orthogonalY}
   * has to be `true` for this to apply.
   */
  toleranceOrthogonalY = 0.7;

  protected _planes: T[] = [];
  protected PlaneType: new (...args: any) => SimplePlane | T;

  /** The material used in all the clipping planes. */
  protected _material: THREE.Material = new THREE.MeshBasicMaterial({
    color: 0xffff00,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.2,
  });

  private _size = 5;
  private _enabled = false;
  private _visible = true;

  /** {@link Component.enabled} */
  get enabled() {
    return this._enabled;
  }

  /** {@link Component.enabled} */
  set enabled(state: boolean) {
    this._enabled = state;
    for (const plane of this._planes) {
      plane.enabled = state;
    }
    this.updateMaterialsAndPlanes();
    if (this.components.uiEnabled) {
      this.uiElement.get("main").active = state;
    }
  }

  /** {@link Hideable.visible } */
  get visible() {
    return this._visible;
  }

  /** {@link Hideable.visible } */
  set visible(state: boolean) {
    this._visible = state;
    for (const plane of this._planes) {
      plane.visible = state;
    }
  }

  /** The material of the clipping plane representation. */
  get material() {
    return this._material;
  }

  /** The material of the clipping plane representation. */
  set material(material: THREE.Material) {
    this._material = material;
    for (const plane of this._planes) {
      plane.planeMaterial = material;
    }
  }

  /** The size of the geometric representation of the clippings planes. */
  get size() {
    return this._size;
  }

  /** The size of the geometric representation of the clippings planes. */
  set size(size: number) {
    this._size = size;
    for (const plane of this._planes) {
      plane.size = size;
    }
  }

  constructor(components: Components) {
    super(components);

    this.components.tools.add(SimpleClipper.uuid, this);

    this.PlaneType = SimplePlane;
    if (components.uiEnabled) {
      this.setUI(components);
    }
  }

  endCreation() {}
  cancelCreation() {}

  /** {@link Component.get} */
  get(): T[] {
    return this._planes;
  }

  /** {@link Disposable.dispose} */
  async dispose() {
    this._enabled = false;
    for (const plane of this._planes) {
      await plane.dispose();
    }
    this._planes.length = 0;
    this.uiElement.dispose();
    this._material.dispose();
    this.onBeforeCreate.reset();
    this.onBeforeCancel.reset();
    this.onBeforeDelete.reset();
    this.onBeforeDrag.reset();
    this.onAfterCreate.reset();
    this.onAfterCancel.reset();
    this.onAfterDelete.reset();
    this.onAfterDrag.reset();
  }

  /** {@link Createable.create} */
  create() {
    if (!this.enabled) return;
    const intersects = this.components.raycaster.castRay();
    if (!intersects) return;
    this.createPlaneFromIntersection(intersects);
  }

  /**
   * Creates a plane in a certain place and with a certain orientation,
   * without the need of the mouse.
   *
   * @param normal - the orientation of the clipping plane.
   * @param point - the position of the clipping plane.
   * @param isPlan - whether this is a clipping plane used for floor plan
   * navigation.
   */
  createFromNormalAndCoplanarPoint(
    normal: THREE.Vector3,
    point: THREE.Vector3
  ) {
    const plane = this.newPlane(point, normal);
    this.updateMaterialsAndPlanes();
    return plane;
  }

  /**
   * {@link Createable.delete}
   *
   * @param plane - the plane to delete. If undefined, the the first plane
   * found under the cursor will be deleted.
   */
  delete(plane?: T) {
    if (!this.enabled) return;
    if (!plane) {
      plane = this.pickPlane();
    }
    if (!plane) {
      return;
    }
    this.deletePlane(plane);
  }

  /** Deletes all the existing clipping planes. */
  deleteAll() {
    while (this._planes.length > 0) {
      this.delete(this._planes[0]);
    }
  }

  private deletePlane(plane: T) {
    const index = this._planes.indexOf(plane);
    if (index !== -1) {
      this._planes.splice(index, 1);
      this.components.renderer.togglePlane(false, plane.get());
      plane.dispose();
      this.updateMaterialsAndPlanes();
      this.onAfterDelete.trigger(plane);
    }
  }

  private setUI(components: Components) {
    const main = new Button(components);
    main.materialIcon = "content_cut";
    main.onClick.add(() => {
      this.enabled = !this.enabled;
      this.visible = !this.visible;
    });
    main.active = this.enabled;
    this.uiElement.set({ main });
  }

  private pickPlane(): T | undefined {
    const meshes = this.getAllPlaneMeshes();
    const intersects = this.components.raycaster.castRay(meshes);
    if (intersects) {
      const found = intersects.object as THREE.Mesh;
      return this._planes.find((p) => p.meshes.includes(found));
    }
    return undefined;
  }

  private getAllPlaneMeshes() {
    const meshes: THREE.Mesh[] = [];
    for (const plane of this._planes) {
      meshes.push(...plane.meshes);
    }
    return meshes;
  }

  private createPlaneFromIntersection(intersect: THREE.Intersection) {
    const constant = intersect.point.distanceTo(new THREE.Vector3(0, 0, 0));
    const normal = intersect.face?.normal;
    if (!constant || !normal) return;

    const worldNormal = this.getWorldNormal(intersect, normal);
    const plane = this.newPlane(intersect.point, worldNormal.negate());
    this.components.renderer.togglePlane(true, plane.get());
    this.updateMaterialsAndPlanes();
  }

  private getWorldNormal(intersect: THREE.Intersection, normal: THREE.Vector3) {
    const object = intersect.object;
    let transform = intersect.object.matrixWorld.clone();
    const isInstance = object instanceof THREE.InstancedMesh;
    if (isInstance && intersect.instanceId !== undefined) {
      const temp = new THREE.Matrix4();
      object.getMatrixAt(intersect.instanceId, temp);
      transform = temp.multiply(transform);
    }
    const normalMatrix = new THREE.Matrix3().getNormalMatrix(transform);
    const worldNormal = normal.clone().applyMatrix3(normalMatrix).normalize();
    this.normalizePlaneDirectionY(worldNormal);
    return worldNormal;
  }

  private normalizePlaneDirectionY(normal: THREE.Vector3) {
    if (this.orthogonalY) {
      if (normal.y > this.toleranceOrthogonalY) {
        normal.x = 0;
        normal.y = 1;
        normal.z = 0;
      }
      if (normal.y < -this.toleranceOrthogonalY) {
        normal.x = 0;
        normal.y = -1;
        normal.z = 0;
      }
    }
  }

  private newPlane(point: THREE.Vector3, normal: THREE.Vector3) {
    const plane = this.newPlaneInstance(point, normal);
    plane.onDraggingStarted.add(this._onStartDragging);
    plane.onDraggingEnded.add(this._onEndDragging);
    this._planes.push(plane);
    this.onAfterCreate.trigger(plane);
    return plane;
  }

  protected newPlaneInstance(point: THREE.Vector3, normal: THREE.Vector3) {
    return new this.PlaneType(
      this.components,
      point,
      normal,
      this._material
    ) as T;
  }

  private updateMaterialsAndPlanes() {
    this.components.renderer.updateClippingPlanes();
    const planes = this.components.renderer.clippingPlanes;
    for (const model of this.components.meshes) {
      if (Array.isArray(model.material)) {
        for (const mat of model.material) {
          mat.clippingPlanes = planes;
        }
      } else {
        model.material.clippingPlanes = planes;
      }
    }
  }

  private _onStartDragging = () => {
    this.onBeforeDrag.trigger();
  };

  private _onEndDragging = () => {
    this.onAfterDrag.trigger();
  };
}

ToolComponent.libraryUUIDs.add(SimpleClipper.uuid);
