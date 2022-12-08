import * as THREE from "three";
import { Components } from "../../components";
import { Createable, Disposable } from "../base-types";
import { SimplePlane } from "./simple-plane";
import { Component } from "../base-components";
import { Event } from "../event";

/**
 * An lightweight component to easily create and handle
 * [clipping planes](https://threejs.org/docs/#api/en/materials/Material.clippingPlanes).
 *
 * @param components - the instance of {@link Components} used.
 * @param planeType - the type of plane to be used by the clipper.
 * E.g. {@link SimplePlane}.
 */
export class SimpleClipper<Plane extends SimplePlane>
  extends Component<Plane[]>
  implements Createable, Disposable
{
  /** {@link Component.name} */
  name = "SimpleClipper";

  /** The material used in all the clipping planes. */
  protected _material: THREE.Material = new THREE.MeshBasicMaterial({
    color: 0xffff00,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.2,
  });

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

  /** Event that fires when the user starts dragging a clipping plane. */
  onStartDragging = new Event<void>();

  /** Event that fires when the user stops dragging a clipping plane. */
  onEndDragging = new Event<void>();

  protected _planes: Plane[] = [];

  private _size = 5;
  private _enabled = false;

  /** {@link Component.enabled} */
  get enabled() {
    return this._enabled;
  }

  /** {@link Component.enabled} */
  set enabled(state: boolean) {
    this._enabled = state;
    for (const plane of this.planes3D) {
      plane.enabled = state;
    }
    this.updateMaterials();
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

  /** The clipping planes that are not associated to floor plan navigation. */
  get planes3D() {
    return this._planes.filter((plane) => !plane.isPlan);
  }

  constructor(
    public components: Components,
    public PlaneType: new (...args: any) => Plane
  ) {
    super();
  }

  /** {@link Component.get} */
  get(): Plane[] {
    return this._planes;
  }

  /** {@link Component.get} */
  dispose() {
    for (const plane of this._planes) {
      plane.dispose();
    }
    this._planes.length = 0;
    (this.components as any) = null;
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
    point: THREE.Vector3,
    isPlan = false
  ) {
    const plane = this.newPlane(point, normal, isPlan);
    this.updateMaterials();
    return plane;
  }

  /**
   * {@link Createable.delete}
   *
   * @param plane - the plane to delete. If undefined, the the first plane
   * found under the cursor will be deleted.
   */
  delete(plane?: Plane) {
    if (!this.enabled) return;
    if (!plane) plane = this.pickPlane();
    if (!plane) return;
    this.deletePlane(plane);
  }

  /** Deletes all the existing clipping planes. */
  deleteAll() {
    while (this._planes.length > 0) {
      this.delete(this._planes[0]);
    }
  }

  private deletePlane(plane: Plane) {
    const index = this._planes.indexOf(plane);
    if (index !== -1) {
      this._planes.splice(index, 1);
      this.components.renderer.togglePlane(false, plane.get());
      plane.dispose();
      this.updateMaterials();
    }
  }

  private pickPlane(): Plane | undefined {
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
    for (const plane of this.planes3D) {
      meshes.push(...plane.meshes);
    }
    return meshes;
  }

  private createPlaneFromIntersection(intersect: THREE.Intersection) {
    const constant = intersect.point.distanceTo(new THREE.Vector3(0, 0, 0));
    const normal = intersect.face?.normal;
    if (!constant || !normal) return;

    const worldNormal = this.getWorldNormal(intersect, normal);
    const plane = this.newPlane(intersect.point, worldNormal.negate(), false);
    this.components.renderer.togglePlane(true, plane.get());
    this.updateMaterials();
  }

  private getWorldNormal(intersect: THREE.Intersection, normal: THREE.Vector3) {
    const normalMatrix = new THREE.Matrix3().getNormalMatrix(
      intersect.object.matrixWorld
    );
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

  private newPlane(
    point: THREE.Vector3,
    normal: THREE.Vector3,
    isPlan: boolean
  ) {
    const plane = this.newPlaneInstance(point, normal, isPlan);
    plane.onStartDragging.on(this._onStartDragging);
    plane.onEndDragging.on(this._onEndDragging);
    this._planes.push(plane);
    return plane;
  }

  protected newPlaneInstance(
    point: THREE.Vector3,
    normal: THREE.Vector3,
    isPlan: boolean
  ) {
    return new this.PlaneType(
      this.components,
      point,
      normal,
      this.size,
      this._material,
      isPlan
    );
  }

  private updateMaterials() {
    const planes = this.components.renderer?.get().clippingPlanes;
    this.components.meshes.forEach((model) => {
      if (Array.isArray(model.material)) {
        model.material.forEach((mat) => (mat.clippingPlanes = planes));
      } else {
        model.material.clippingPlanes = planes;
      }
    });
  }

  private _onStartDragging = () => {
    this.onStartDragging.trigger();
  };

  private _onEndDragging = () => {
    this.onEndDragging.trigger();
  };
}
