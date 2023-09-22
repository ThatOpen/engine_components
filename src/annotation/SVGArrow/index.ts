import { Vector2 } from "three";
import { Component, Disposable, SVGAnnotationStyle } from "../../base-types";
import { Components } from "../../core";
import { tooeenRandomId } from "../../utils";

export class SVGArrow extends Component<SVGGElement> implements Disposable {
  name: string = "SVGRectangle";
  enabled: boolean = true;
  id: string = tooeenRandomId();

  private _line = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "line"
  );

  private _polygon = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "polygon"
  );

  private _marker = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "marker"
  );

  private _arrow: SVGGElement = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "g"
  );

  private _startPoint: Vector2 = new Vector2();
  private _endPoint: Vector2 = new Vector2();

  constructor(
    components: Components,
    startPoint?: Vector2,
    endPoint?: Vector2
  ) {
    super(components);

    // Create marker for the arrow head
    this._marker.setAttribute("id", `${this.id}-arrowhead`);
    this._marker.setAttribute("markerWidth", "5");
    this._marker.setAttribute("markerHeight", "6");
    this._marker.setAttribute("refX", "4");
    this._marker.setAttribute("refY", "3");
    this._marker.setAttribute("orient", "auto");

    // Create polygon for the arrowhead shape
    this._polygon.setAttribute("points", "0 0, 5 3, 0 6");
    this._marker.appendChild(this._polygon);

    this._line.setAttribute("marker-end", `url(#${this.id}-arrowhead)`);
    this._arrow.append(this._marker, this._line);

    this.startPoint = startPoint ?? this.startPoint;
    this.endPoint = endPoint ?? this.endPoint;
    this._arrow.id = this.id;
    this.setStyle();
  }

  async dispose() {
    this._arrow.remove();
    this._marker.remove();
    this._polygon.remove();
    this._line.remove();
    (this.components as any) = null;
  }

  setStyle(style?: Partial<SVGAnnotationStyle>) {
    this._line.setAttribute("stroke", style?.strokeColor ?? "red");
    this._line.setAttribute(
      "stroke-width",
      style?.strokeWidth?.toString() ?? "4"
    );
    this._polygon.setAttribute("fill", style?.strokeColor ?? "red");
  }

  reset() {
    this.x1 = 0;
    this.y1 = 0;
    this.x2 = 0;
    this.y2 = 0;
  }

  clone() {
    return new SVGArrow(this.components, this.startPoint, this.endPoint);
  }

  set x1(value: number) {
    this._startPoint.x = value;
    this._line.setAttribute("x1", value.toString());
  }

  set y1(value: number) {
    this._startPoint.y = value;
    this._line.setAttribute("y1", value.toString());
  }

  set startPoint(point: Vector2) {
    this.x1 = point.x;
    this.y1 = point.y;
  }

  get startPoint() {
    return this._startPoint;
  }

  set x2(value: number) {
    this._endPoint.x = value;
    this._line.setAttribute("x2", value.toString());
  }

  set y2(value: number) {
    this._endPoint.y = value;
    this._line.setAttribute("y2", value.toString());
  }

  set endPoint(point: Vector2) {
    this.x2 = point.x;
    this.y2 = point.y;
  }

  get endPoint() {
    return this._endPoint;
  }

  get(): SVGGElement {
    return this._arrow;
  }
}
