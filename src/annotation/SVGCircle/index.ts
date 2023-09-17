import { Vector2 } from "three";
import { Component, Disposable, SVGAnnotationStyle } from "../../base-types";
import { Components } from "../../core";
import { tooeenRandomId } from "../../utils";

export class SVGCircle
  extends Component<SVGCircleElement>
  implements Disposable
{
  id = tooeenRandomId();
  name: string = "SVGRectangle";
  enabled: boolean = true;

  private _circle = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle"
  );

  private _centerPoint: Vector2 = new Vector2();
  private _radius: number = 20;

  constructor(components: Components, centerPoint?: Vector2, radius?: number) {
    super(components);
    this.centerPoint = centerPoint ?? this.centerPoint;
    this.radius = radius ?? this.radius;
    this._circle.id = this.id;
    this.setStyle();
  }

  async dispose() {
    this._circle.remove();
    (this.components as any) = null;
  }

  setStyle(style?: Partial<SVGAnnotationStyle>) {
    this._circle.setAttribute("stroke", style?.strokeColor ?? "red");
    this._circle.setAttribute(
      "stroke-width",
      style?.strokeWidth?.toString() ?? "4"
    );
    this._circle.setAttribute("fill", style?.fillColor ?? "transparent");
  }

  reset() {
    this.cx = 0;
    this.cy = 0;
    this.radius = 0;
  }

  clone() {
    return new SVGCircle(this.components, this.centerPoint, this.radius);
  }

  set radius(value: number) {
    this._radius = value;
    this._circle.setAttribute("r", value.toString());
  }

  get radius() {
    return this._radius;
  }

  set cx(value: number) {
    this._centerPoint.x = value;
    this._circle.setAttribute("cx", value.toString());
  }

  set cy(value: number) {
    this._centerPoint.y = value;
    this._circle.setAttribute("cy", value.toString());
  }

  set centerPoint(point: Vector2) {
    this.cx = point.x;
    this.cy = point.y;
  }

  get centerPoint() {
    return this._centerPoint;
  }

  get(): SVGCircleElement {
    return this._circle;
  }
}
