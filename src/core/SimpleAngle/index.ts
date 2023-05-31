import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";
import {
  BufferGeometry,
  CatmullRomCurve3,
  Color,
  Group,
  Line,
  LineBasicMaterial,
  LineDashedMaterial,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  SphereGeometry,
  Vector3,
} from "three";
import {
  Disposable,
  Event,
  Hideable,
  UI,
  Updateable,
} from "../../base-types/base-types";
import { Component } from "../../base-types/component";
import { SimpleTag } from "../SimpleTag";
import { SimpleDimensionLine } from "../SimpleDimensions/simple-dimension-line";
import { SimpleRaycaster } from "../SimpleRaycaster";
import { DimensionPreviewClassName } from "../SimpleDimensions/types";
import { Components } from "../Components";
import { SimpleDimensions } from "../SimpleDimensions";
import { PostproductionRenderer } from "../../navigation/PostproductionRenderer";
import { Button } from "../../ui/ButtonComponent";
import { SimpleAreaSettings } from "../SimpleArea";

interface Angle {
  angleDegrees: number;
  points: Vector3[];
  tagDegrees: SimpleTag | null;
  insideArc: Line | null;
  color: Color | string;
}

export class SimpleAngle
  extends Component<string>
  implements Hideable, Disposable, Updateable, UI
{
  name: string = "SimpleAngle";
  uiElement!: Button;
  private _components!: Components;
  private _raycaster!: SimpleRaycaster;
  private _lineMaterial!: LineDashedMaterial;
  private _startPoint: Vector3 | null = null;
  private _endPoint: Vector3 | null = null;
  private _center: Vector3 | null = null;
  private _htmlPreview!: HTMLElement;
  private _previewElement!: CSS2DObject;
  private _angleDegrees!: number;
  // private _angleTag!: SimpleTag
  private _lines!: SimpleDimensionLine[];
  private _endPointSize!: number;
  private _enabled: boolean;
  private _root = new Group();
  private _tempLine: SimpleDimensionLine | null = null;
  private _isHovering = false;
  private _points: Vector3[] = [];
  private _angles: Angle[] = [];
  private _visible = true;

  /** {@link Updateable.beforeUpdate} */
  readonly beforeUpdate: Event<SimpleDimensions> = new Event();

  /** {@link Updateable.afterUpdate} */
  readonly afterUpdate: Event<SimpleDimensions> = new Event();

  constructor(components: Components, settings: SimpleAreaSettings) {
    super();

    const { color, dashSize, endPointSize, gapSize, lineOpacity } = settings;

    this._components = components;
    this._raycaster = new SimpleRaycaster(components);
    this._enabled = false;

    this._angleDegrees = 0;
    this._lines = [];
    this._endPointSize = endPointSize;

    this._lineMaterial = new LineDashedMaterial({
      dashSize: dashSize || 1,
      depthTest: false,
      gapSize: gapSize || 0,
      opacity: lineOpacity || 1,
    });

    this.color = new Color(color ?? "#222");
    this._htmlPreview = document.createElement("div");
    this._htmlPreview.className = DimensionPreviewClassName;
    this._htmlPreview.style.backgroundColor = color
      ? color instanceof Color
        ? color.getHexString()
        : color
      : "#0f0";
    this._previewElement = new CSS2DObject(this._htmlPreview);
    this._previewElement.visible = false;
    this.addToScene(this._root);
    this.setUI();
  }

  /** {@link Component.get} */
  get(): string {
    return "";
  }

  private setUI() {
    const button = new Button(this._components, {
      materialIconName: "square_foot",
    });
    const viewerContainer = this._components.renderer.get().domElement
      .parentElement as HTMLElement;
    const createDimension = () => this.create();
    button.onclick = () => {
      if (!this.enabled) {
        viewerContainer.addEventListener("click", createDimension);
        button.active = true;
        this.enabled = true;
      } else {
        this.enabled = false;
        button.active = false;
        viewerContainer.removeEventListener("click", createDimension);
      }
    };
    button.active = this.enabled;
    this.uiElement = button;
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.enabled) {
        this.cancelDrawing();
        // if (this._temp.isDragging) { this.cancelDrawing() } else { this.enabled = false }
      }
    });
  }

  create() {
    if (!this._startPoint) {
      this._startPoint = this.addPoint();

      if (this._startPoint) {
        this._points.push(this._startPoint);

        this._angles.push({
          angleDegrees: 0,
          points: this._points,
          tagDegrees: null,
          insideArc: null,
          color: this.color,
        });

        this._isHovering = true;
      }

      return null;
    }
    if (!this._center) {
      this._center = this.addPoint();

      if (this._center) {
        this._points.push(this._center);
        this.addLine(this._startPoint, this._center);
        this._tempLine?.dispose();
        this._tempLine = null;
      }

      return null;
    }
    if (!this._endPoint && this._isHovering) {
      return this.closeAngle();
    }
  }

  private addPoint() {
    if (!this.cast) {
      return null;
    }
    return this.cast.point;
  }

  drawing() {
    if (!this.cast) return;

    if (this._tempLine) {
      this._tempLine.endPoint = this.cast.point;
    } else {
      this._tempLine = this.createLine(
        this._points[this._points.length - 1],
        this.cast.point
      );
    }
  }

  closeAngle() {
    if (!this.cast || !this._center) return;

    this.addLine(this._center, this.cast.point);

    this._isHovering = false;

    this.currentAngle.points.push(this.cast.point);
    this.currentAngle.angleDegrees = this._angleDegrees;

    this.cancelDrawing();

    return this.currentAngle;
  }

  private addLine(start: Vector3, end: Vector3) {
    const line = this.createLine(start, end);
    this._lines.push(line);
  }

  createLine(start: Vector3, end: Vector3) {
    return new SimpleDimensionLine(this._components, {
      start,
      end,
      lineMaterial: this._lineMaterial,
      endpoint: this.newEndpointMesh,
    });
  }

  cancelDrawing() {
    if (!this._tempLine) {
      return;
    }
    this._tempLine.dispose();
    this._tempLine = null;
    this._isHovering = false;
    this._angleDegrees = 0;
    this._points = [];
    this._startPoint = null;
    this._center = null;
    this._endPoint = null;
  }

  get newEndpointMesh() {
    const geometry = new SphereGeometry(this._endPointSize);

    const material = new MeshBasicMaterial({
      color: this.color,
      depthTest: false,
      transparent: true,
      opacity: 0.5,
    });

    return new Mesh(geometry, material);
  }

  /** {@link Component.enabled} */
  get enabled() {
    return this._enabled;
  }

  /** {@link Component.enabled} */
  set enabled(enabled) {
    this._enabled = enabled;
    this.previewVisible = enabled;
  }

  /**
   * The [Color](https://threejs.org/docs/#api/en/math/Color)
   * of the geometry of the dimensions.
   */
  set color(color) {
    this.newEndpointMesh.material.color = color;
    this._lineMaterial.color = color;
  }

  get color() {
    return this._lineMaterial.color;
  }

  set previewVisible(visible: boolean) {
    const scene = this._components.scene.get();
    if (visible) {
      scene.add(this._previewElement);
    } else {
      this._previewElement.removeFromParent();
    }
  }

  get cast() {
    return this._raycaster.castRay();
  }

  /** {@link Updateable.update} */
  update() {
    if (this._enabled) {
      // @ts-ignore
      this.beforeUpdate.trigger(this);

      if (!this.cast) return;

      this._previewElement.visible = !!this.cast;

      this._previewElement.position.set(
        this.cast.point.x,
        this.cast.point.y,
        this.cast.point.z
      );

      const size = `${10 / this.cast.distance}rem`;

      this._htmlPreview.style.width = size;
      this._htmlPreview.style.height = size;

      if (this._points.length >= 2) {
        this.setAngleDegrees(this.cast.point);
      }

      if (this._isHovering) this.drawing();
    }
  }

  setAngleDegrees(pointB: Vector3) {
    const pointA = this._points[0];
    const center = this._points[1];

    const aToCenter = pointA.clone().sub(center);
    const bToCenter = pointB.clone().sub(center);

    const radians = aToCenter.angleTo(bToCenter);

    const degrees = parseFloat((radians * (180 / Math.PI)).toFixed(2));

    this._angleDegrees = degrees;

    if (this.currentAngle.tagDegrees) {
      this.currentAngle.tagDegrees.tagContent = this._angleDegrees.toString();
      if (this.currentAngle.insideArc) {
        this.removeFromScene(this.currentAngle.insideArc);
      }
      this.setInsideArc(pointB);
    } else {
      const pointTag = new Vector3(center.x, center.y - 0.3, center.z);
      this.currentAngle.tagDegrees = new SimpleTag(
        pointTag,
        this._angleDegrees,
        "º"
      );

      this.addToScene(this.currentAngle.tagDegrees.get());

      // this.setInsideArc(pointA, center, pointB)
      this.setInsideArc(pointA);
    }
  }

  get currentAngle() {
    return this._angles[this._angles.length - 1];
  }

  setInsideArc(pointB: Vector3) {
    const pointA = this._points[0];
    const center = this._points[1];

    // calculate min-distances between lines
    const rate =
      Math.min(pointA.distanceTo(center), pointB.distanceTo(center)) * 0.2;

    const curveOriginA = center
      .clone()
      .add(pointA.clone().sub(center).normalize().multiplyScalar(rate));

    const curveOriginB = center
      .clone()
      .add(pointB.clone().sub(center).normalize().multiplyScalar(rate));

    const curve = new CatmullRomCurve3(
      [curveOriginA, curveOriginB],
      true,
      "centripetal"
    );

    const geometry = new BufferGeometry().setFromPoints(curve.getPoints(12));

    const material = new LineBasicMaterial({ color: this.color });

    this.currentAngle.insideArc = new Line(geometry, material);

    this.addToScene(this.currentAngle.insideArc);

    const renderer = this._components.renderer as PostproductionRenderer;
    if (renderer instanceof PostproductionRenderer) {
      renderer.postproduction.excludedItems.add(this.currentAngle.insideArc);
    }
  }

  addToScene(item: Object3D) {
    this._components.scene.get().add(item);
  }

  removeFromScene(item: Object3D) {
    this._components.scene.get().remove(item);
  }

  /** {@link Hideable.visible} */
  get visible() {
    return this._visible;
  }

  /** {@link Hideable.visible} */
  set visible(state) {
    this._visible = state;

    if (!this._visible) {
      this.enabled = false;
    }

    for (const line of this._lines) {
      line.visible = this._visible;
    }

    for (const angle of this._angles) {
      if (angle.insideArc) {
        angle.insideArc.visible = this._visible;
      }
      if (angle.tagDegrees) {
        angle.tagDegrees.get().visible = this._visible;
      }
    }

    this._root.visible = this._visible;
  }

  /** {@link Disposable.dispose} */
  dispose() {
    for (const line of this._lines) {
      line.dispose();
    }

    for (const angle of this._angles) {
      if (angle.insideArc) {
        this.removeFromScene(angle.insideArc);
      }
      if (angle.tagDegrees) {
        this.removeFromScene(angle.tagDegrees.get());
      }
    }

    this.removeFromScene(this._root);

    this.enabled = false;
  }
}
