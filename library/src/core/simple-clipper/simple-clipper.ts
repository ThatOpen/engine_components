import { Vector3, Matrix3, Intersection } from "three";
import { Components } from "../../components";
import { Createable, Disposeable, Hideable } from "../base-types";
import { SimplePlane } from "./simple-plane";
import { Component } from "../base-components";

export class SimpleClipper<Plane extends SimplePlane>
  extends Component<Plane[]>
  implements Hideable, Createable, Disposeable
{
  public readonly name = "clipper";
  dragging = false;
  intersection: Intersection | undefined;
  orthogonalY = true;
  toleranceOrthogonalY = 0.7;
  planeSize = 5;

  protected _planes: Plane[] = [];
  protected _enabled = false;
  protected _visible = false;

  get visible() {
    return this._visible;
  }

  set visible(visible: boolean) {
    this._visible = visible;
    if (!visible) {
      this.enabled = false;
    }
    this._planes.forEach((plane) => {
      if (!plane.isPlan) {
        plane.visible = visible;
      }
    });
    this.updateMaterials();
  }

  get enabled() {
    return this._enabled;
  }

  set enabled(state) {
    this._enabled = state;

    if (state && !this._visible) {
      this.visible = true;
    }

    this._planes.forEach((plane) => {
      if (!plane.isPlan) {
        plane.enabled = state;
      }
    });
    this.updateMaterials();
  }

  constructor(
    public components: Components,
    public PlaneType: new (...args: any) => Plane
  ) {
    super();
  }

  get(): Plane[] {
    return this._planes;
  }

  dispose() {
    this._planes.forEach((plane) => plane.dispose());
    this._planes.length = 0;
    (this.components as any) = null;
  }

  create = () => {
    if (!this.enabled) return;
    const intersects = this.components.raycaster.castRay();
    if (!intersects) return;
    this.createPlaneFromIntersection(intersects);
    this.intersection = undefined;
  };

  createFromNormalAndCoplanarPoint = (
    normal: Vector3,
    point: Vector3,
    isPlan = false
  ) => {
    const plane = new this.PlaneType(
      this.components,
      point,
      normal,
      this.activateDragging,
      this.deactivateDragging,
      this.planeSize,
      !isPlan
    );
    plane.isPlan = isPlan;
    this._planes.push(plane);
    this.components.renderer.togglePlane(true, plane.plane);
    this.updateMaterials();
    return plane;
  };

  delete = () => {
    this.deletePlane();
  };

  deletePlane = (plane?: Plane) => {
    let existingPlane: Plane | undefined | null = plane;
    if (!existingPlane) {
      if (!this.enabled) return;
      existingPlane = this.pickPlane();
    }
    if (!existingPlane) return;
    const index = this._planes.indexOf(existingPlane);
    if (index === -1) return;
    existingPlane.removeFromScene();
    this._planes.splice(index, 1);
    this.components.renderer.togglePlane(false, existingPlane.plane);
    this.updateMaterials();
  };

  deleteAllPlanes = () => {
    while (this._planes.length > 0) {
      this.deletePlane(this._planes[0]);
    }
  };

  private pickPlane = () => {
    const planeMeshes = this._planes.map((p) => p.planeMesh);
    const arrowMeshes = this._planes.map((p) => p.arrowBoundingBox);

    const intersects = this.components.raycaster.castRay([
      ...planeMeshes,
      ...arrowMeshes,
    ]);

    if (intersects) {
      return this._planes.find((p) => {
        if (
          p.planeMesh === intersects.object ||
          p.arrowBoundingBox === intersects.object
        ) {
          return p;
        }
        return null;
      });
    }
    return null;
  };

  private createPlaneFromIntersection = (intersection: Intersection) => {
    const constant = intersection.point.distanceTo(new Vector3(0, 0, 0));
    const normal = intersection.face?.normal;
    if (!constant || !normal) return;
    const normalMatrix = new Matrix3().getNormalMatrix(
      intersection.object.matrixWorld
    );
    const worldNormal = normal.clone().applyMatrix3(normalMatrix).normalize();
    this.normalizePlaneDirectionY(worldNormal);
    const plane = this.newPlane(intersection, worldNormal.negate());
    this._planes.push(plane);
    this.components.renderer.togglePlane(true, plane.plane);
    this.updateMaterials();
  };

  private normalizePlaneDirectionY(normal: Vector3) {
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

  private newPlane(intersection: Intersection, worldNormal: Vector3) {
    return new this.PlaneType(
      this.components,
      intersection.point,
      worldNormal,
      this.activateDragging,
      this.deactivateDragging,
      this.planeSize
    );
  }

  private activateDragging = () => {
    this.dragging = true;
  };

  private deactivateDragging = () => {
    this.dragging = false;
  };

  private updateMaterials = () => {
    // Apply clipping to all models
    const planes = this.components.renderer?.get().clippingPlanes;
    this.components.meshes.forEach((model) => {
      if (Array.isArray(model.material)) {
        model.material.forEach((mat) => (mat.clippingPlanes = planes));
      } else {
        model.material.clippingPlanes = planes;
      }
    });
  };

  update(_delta: number): void {}
}
