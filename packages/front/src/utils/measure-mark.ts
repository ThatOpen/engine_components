import * as THREE from "three";
import * as OBC from "@thatopen/components";
import { Mark } from "../core";
import { Measurement } from "../measurement";

export class MeasureMark extends Mark {
  private _value = 0;

  set value(value: number) {
    this._value = value;
    this.three.element.textContent = this.formattedValue;
  }

  get value() {
    return this._value;
  }

  private _units: string = "m2";

  set units(value: string) {
    this._units = value;
    this.three.element.textContent = this.formattedValue;
  }

  get units() {
    return this._units;
  }

  private _worldUnits: string = "m2";

  set worldUnits(value: string) {
    this._worldUnits = value;
    this.three.element.textContent = this.formattedValue;
  }

  get worldUnits() {
    return this._worldUnits;
  }

  private _color = new THREE.Color();

  set color(color: THREE.Color) {
    this._color = color;
    const hexColor = `#${color.getHexString()}`;
    this.three.element.style.backgroundColor = hexColor;
  }

  get color() {
    return this._color;
  }

  private _textColor = new THREE.Color();

  set textColor(color: THREE.Color) {
    this._textColor = color;
    const hexColor = `#${color.getHexString()}`;
    this.three.element.style.color = hexColor;
  }

  get textColor() {
    return this._textColor;
  }

  private _rounding = 2;

  set rounding(value: number) {
    this._rounding = value;
    this.three.element.textContent = this.formattedValue;
  }

  get rounding() {
    return this._rounding;
  }

  get formattedValue() {
    const convertedValue = OBC.MeasurementUtils.convertUnits(
      this.value,
      this.worldUnits, // Input unit
      this.units, // Output unit
      this.rounding,
    );

    const formattedValue = Measurement.valueFormatter
      ? Measurement.valueFormatter(convertedValue)
      : convertedValue.toFixed(this.rounding);

    return `${formattedValue} ${this.units}`;
  }

  constructor(world: OBC.World) {
    const element = document.createElement("div");
    element.style.backgroundColor = "blue";
    element.style.color = "white";
    element.style.padding = "6px";
    element.style.borderRadius = "6px";
    element.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.6)";
    element.style.zIndex = "-10";
    super(world, element);
    this.three.renderOrder = 1;
    element.textContent = this.formattedValue;
  }
}
