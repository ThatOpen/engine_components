import * as THREE from "three";
import * as OBC from "@thatopen/components";

/**
 * Represents an angle defined by three points in 3D space: a start point, a vertex (center), and an end point.
 * The angle is computed as the angle between the vectors (vertex -> start) and (vertex -> end).
 */
export class Angle {
  /** Unique identifier for this angle instance. */
  id = OBC.UUID.create();

  /** The first point of the angle. */
  start = new THREE.Vector3();

  /** The vertex (center) of the angle where the two rays meet. */
  vertex = new THREE.Vector3();

  /** The second point of the angle. */
  end = new THREE.Vector3();

  private _units: "deg" | "rad" = "deg";

  /** The unit system used for displaying the angle value. */
  set units(value: "deg" | "rad") {
    this._units = value;
  }

  get units() {
    return this._units;
  }

  private _rounding = 2;

  /** The number of decimal places used when computing {@link value}. */
  set rounding(value: number) {
    this._rounding = value;
  }

  get rounding() {
    return this._rounding;
  }

  constructor(
    start?: THREE.Vector3,
    vertex?: THREE.Vector3,
    end?: THREE.Vector3,
  ) {
    if (start) this.start.copy(start);
    if (vertex) this.vertex.copy(vertex);
    if (end) this.end.copy(end);
  }

  /** The angle in radians, without unit conversion or rounding. Returns 0 when either ray has zero length. */
  get rawValue(): number {
    const vA = new THREE.Vector3().subVectors(this.start, this.vertex);
    const vB = new THREE.Vector3().subVectors(this.end, this.vertex);
    if (vA.lengthSq() === 0 || vB.lengthSq() === 0) return 0;
    return vA.angleTo(vB);
  }

  /** The angle converted to the current {@link units} and rounded to {@link rounding} decimal places. */
  get value(): number {
    const radians = this.rawValue;
    if (this._units === "deg") {
      return Number(THREE.MathUtils.radToDeg(radians).toFixed(this._rounding));
    }
    return Number(radians.toFixed(this._rounding));
  }

  /** Creates a deep copy of this angle, preserving all points, units, and rounding. */
  clone(): Angle {
    const cloned = new Angle(
      this.start.clone(),
      this.vertex.clone(),
      this.end.clone(),
    );
    cloned.units = this.units;
    cloned.rounding = this.rounding;
    return cloned;
  }
}
