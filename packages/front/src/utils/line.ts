import * as THREE from "three";
import * as OBC from "@thatopen/components";

export class Line extends THREE.Line3 {
  id = OBC.UUID.create();

  private _units: "m" | "cm" | "mm" | "km" = "m";

  set units(value: "m" | "cm" | "mm" | "km") {
    this._units = value;
  }

  get units() {
    return this._units;
  }

  private _rounding = 2;

  set rounding(value: number) {
    this._rounding = value;
  }

  get rounding() {
    return this._rounding;
  }

  get value() {
    const length = this.distance();
    const convertedValue = OBC.MeasurementUtils.convertUnits(
      length,
      "m",
      this.units,
      this.rounding,
    );
    return convertedValue;
  }
}
