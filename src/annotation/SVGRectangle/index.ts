import { Vector2 } from "three";
import { Component, Disposable, SVGAnnotationStyle } from "../../base-types";
import { Components } from "../../core";
import { tooeenRandomId } from "../../utils";

export class SVGRectangle
  extends Component<SVGRectElement>
  implements Disposable
{
  id = tooeenRandomId();
  name: string = "SVGRectangle";
  enabled: boolean = true;

  private _startPoint: Vector2 = new Vector2();
  private _endPoint: Vector2 = new Vector2();
  private _dimensions: Vector2 = new Vector2();

  private _rect = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "rect"
  );

  constructor(
    components: Components,
    startPoint?: Vector2,
    endPoint?: Vector2
  ) {
    super(components);
    this.startPoint = startPoint ?? this.startPoint;
    this.endPoint = endPoint ?? this.endPoint;
    this._rect.setAttribute("rx", "5");
    this._rect.id = this.id;
    this.setStyle();
  }

  async dispose() {
    this._rect.remove();
    (this.components as any) = null;
  }

  setStyle(style?: Partial<SVGAnnotationStyle>) {
    this._rect.setAttribute("stroke", style?.strokeColor ?? "red");
    this._rect.setAttribute(
      "stroke-width",
      style?.strokeWidth?.toString() ?? "4"
    );
    this._rect.setAttribute("fill", style?.fillColor ?? "transparent");
  }

  reset() {
    this.x1 = 0;
    this.y1 = 0;
    this.x2 = 0;
    this.y2 = 0;
  }

  clone() {
    return new SVGRectangle(this.components, this.startPoint, this.endPoint);
  }

  set x1(value: number) {
    this._startPoint.x = value;
    this._rect.setAttribute("x", value.toString());
  }

  set y1(value: number) {
    this._startPoint.y = value;
    this._rect.setAttribute("y", value.toString());
  }

  set startPoint(point: Vector2) {
    this.x1 = point.x;
    this.y1 = point.y;
  }

  get startPoint() {
    return this._startPoint;
  }

  set x2(value: number) {
    const lessThanStart = value < this.startPoint.x;
    this._endPoint.x = lessThanStart ? this.startPoint.x : value;
    this.x1 = lessThanStart ? value : this.startPoint.x;
    this._dimensions.x = this.endPoint.x - this.startPoint.x;
    this._rect.setAttribute("width", this._dimensions.x.toString());
  }

  set y2(value: number) {
    const lessThanStart = value < this.startPoint.y;
    this._endPoint.y = lessThanStart ? this.startPoint.y : value;
    this.y1 = lessThanStart ? value : this.startPoint.y;
    this._dimensions.y = this.endPoint.y - this.startPoint.y;
    this._rect.setAttribute("height", this._dimensions.y.toString());
  }

  set endPoint(point: Vector2) {
    this.x2 = point.x;
    this.y2 = point.y;
  }

  get endPoint() {
    return this._endPoint;
  }

  set width(value: number) {
    this.x2 = this.startPoint.x + value;
  }

  get width() {
    return this._dimensions.x;
  }

  set height(value: number) {
    this.y2 = this.startPoint.y + value;
  }

  get height() {
    return this._dimensions.y;
  }

  set dimensions(value: Vector2) {
    this.width = value.x;
    this.height = value.y;
  }

  get dimensions() {
    return this._dimensions;
  }

  get(): SVGRectElement {
    return this._rect;
  }
}
