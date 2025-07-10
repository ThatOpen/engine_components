import * as OBC from "@thatopen/components";
import * as THREE from "three";
import { DataSet } from "@thatopen/fragments";

export class Area {
  id = OBC.UUID.create();

  // The list of points that defines this area
  readonly points = new DataSet<THREE.Vector3>();

  // The tolerance by which a point may be accepted in the list,
  // based on the distance from the plane of this area
  // 5mm by default
  tolerance = 5e-3;

  private _plane: THREE.Plane | null = null;

  // set plane(value: THREE.Plane) {
  //   const points = this._2dPoints;
  //   if (!points) return;
  //   this._plane = value;
  //   this.points.eventsEnabled = false;
  //   this.points.clear();
  //   const newPoints = points.map((point) => this.convertPointTo3D(point)!);
  //   this.points.add(...newPoints);
  //   this.points.eventsEnabled = true;
  // }

  get plane() {
    return this._plane;
  }

  private get _coordinateSystem() {
    if (!this.plane) return null;

    const planeNormal = this.plane.normal;
    const planeXAxis = new THREE.Vector3();
    const planeYAxis = new THREE.Vector3();

    if (Math.abs(planeNormal.x) > Math.abs(planeNormal.z)) {
      planeXAxis.set(-planeNormal.y, planeNormal.x, 0).normalize();
    } else {
      planeXAxis.set(0, -planeNormal.z, planeNormal.y).normalize();
    }
    planeYAxis.crossVectors(planeNormal, planeXAxis).normalize();

    return {
      normal: planeNormal.clone(),
      x: planeXAxis.clone(),
      y: planeYAxis.clone(),
    };
  }

  // The list of points projected into the plane's coordinate system
  get points2D() {
    if (!this.plane) {
      if (this.points.size >= 3) {
        this.computePlane();
      } else {
        return null;
      }
    }

    const points2D = [...this.points]
      .map((point) => this.convertPointTo2D(point))
      .filter((point) => point !== null) as THREE.Vector2[];

    return points2D;
  }

  get center() {
    if (!this.plane || this.points.size < 3) return null;

    const points2D = this.points2D;
    if (!points2D || points2D.length === 0) return null;

    const center2D = points2D
      .reduce((acc, point) => acc.add(point), new THREE.Vector2())
      .divideScalar(points2D.length);

    return this.convertPointTo3D(center2D);
  }

  get value() {
    const points = this.points2D;
    if (!points) return 0;
    const area = Math.abs(THREE.ShapeUtils.area(points));
    const convertedValue = OBC.MeasurementUtils.convertUnits(
      area,
      "m2",
      this.units,
      this.rounding,
    );
    // const factor = 10 ** this.rounding;
    // return Math.round(convertedValue * factor) / factor;
    return convertedValue;
    // return area;
  }

  get boundingBox() {
    if (this.points.size === 0) return null;

    const box = new THREE.Box3();
    for (const point of this.points) {
      box.expandByPoint(point);
    }

    return box;
  }

  get perimeter() {
    const points = this.points2D;
    if (!points || points.length < 2) return 0;

    let perimeter = 0;
    for (let i = 0; i < points.length; i++) {
      const current = points[i];
      const next = points[(i + 1) % points.length];
      perimeter += current.distanceTo(next);
    }

    return perimeter;
  }

  private _rounding = 2;

  set rounding(value: number) {
    this._rounding = value;
  }

  get rounding() {
    return this._rounding;
  }

  private _units: "m2" | "cm2" | "mm2" | "km2" = "m2";

  set units(value: "m2" | "cm2" | "mm2" | "km2") {
    this._units = value;
  }

  get units() {
    return this._units;
  }

  constructor(points?: THREE.Vector3[]) {
    this.points.guard = (point) => {
      const exist = [...this.points].some((p) => p.equals(point));
      const isOnPlane = this.isPointInPlane(point);
      return !exist && isOnPlane;
    };

    this.points.onItemAdded.add((point) => {
      // If the point is to be added, is because falls between the tolerance.
      // If that's the case, then replace the point by its projection into the plane
      if (this.plane) {
        const projection = new THREE.Vector3();
        this.plane.projectPoint(point, projection);
        point.copy(projection);
      }
      if (this.points.size < 3) return;
      if (this.points.size === 3) this.computePlane();
    });

    this.points.onItemDeleted.add(() => {
      if (this.points.size >= 3) return;
      this._plane = null;
    });

    this.points.onCleared.add(() => {
      this._plane = null;
    });

    if (points) this.points.add(...points);
  }

  // Returns if the given point falls in the plane of this area, based on the tolerance
  isPointInPlane(point: THREE.Vector3) {
    if (!this.plane) return true;
    const distance = this.plane.distanceToPoint(point);
    return Math.abs(distance) < this.tolerance;
  }

  // Create an exact copy of this area
  clone() {
    const newArea = new Area([...this.points]);
    return newArea;
  }

  // Computes the plane that defines this area based on the first three points
  computePlane() {
    const [p1, p2, p3] = this.points;
    if (!(p1 && p2 && p3)) return null;

    const v1 = new THREE.Vector3().subVectors(p2, p1);
    const v2 = new THREE.Vector3().subVectors(p3, p1);
    const normal = new THREE.Vector3().crossVectors(v1, v2).normalize();
    this._plane = new THREE.Plane().setFromNormalAndCoplanarPoint(normal, p1);

    return this.plane;
  }

  // Converts a point to the 2D space of this area
  convertPointTo2D(point: THREE.Vector3) {
    if (!this.isPointInPlane(point)) return null;
    if (!this.plane) return null;

    const coordinateSystem = this._coordinateSystem;
    if (!coordinateSystem) return null;

    const projectedPoint = new THREE.Vector3();
    this.plane.projectPoint(point, projectedPoint);

    // Convert the 3D projected point to 2D coordinates in the plane's local space
    const localX = projectedPoint.dot(coordinateSystem.x);
    const localY = projectedPoint.dot(coordinateSystem.y);

    return new THREE.Vector2(localX, localY);
  }

  // Converts a point in the 2D space of this area to 3D
  convertPointTo3D(point2D: THREE.Vector2) {
    if (!this.plane) return null;

    const coordinateSystem = this._coordinateSystem;
    if (!coordinateSystem) return null;

    const {
      x: planeXAxis,
      y: planeYAxis,
      normal: planeNormal,
    } = coordinateSystem;

    // Convert the 2D point back to 3D space
    const point3D = new THREE.Vector3()
      .addScaledVector(planeXAxis, point2D.x)
      .addScaledVector(planeYAxis, point2D.y)
      .addScaledVector(planeNormal, -this.plane.constant);

    return point3D;
  }
}
