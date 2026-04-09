import * as THREE from "three";
import { Event } from "../../../core/Types";
import { DrawingViewportHelper } from "./DrawingViewportHelper";

/**
 * Configuration to create a {@link DrawingViewport}.
 */
export interface DrawingViewportConfig {
  /** Left bound of the viewport in local drawing units. */
  left: number;
  /** Right bound of the viewport in local drawing units. */
  right: number;
  /**
   * Top bound of the viewport in local drawing units.
   * Maps to world -Z (screen Y up = local -Z).
   */
  top: number;
  /**
   * Bottom bound of the viewport in local drawing units.
   * Maps to world +Z (screen Y down = local +Z).
   */
  bottom: number;
  /**
   * Drawing scale denominator (e.g. 100 means 1:100).
   * Defaults to 100.
   */
  scale?: number;
  /** Human-readable label for this viewport. Defaults to an empty string. */
  name?: string;
}

/**
 * Represents a framed orthographic window into a {@link TechnicalDrawing}.
 *
 * The viewport lives in the drawing's local coordinate system (XZ plane, Y = 0).
 * Its {@link camera} must be added as a child of the drawing's container so that
 * any world-space transform applied to the container automatically moves the camera.
 *
 * The camera uses **layer 1** exclusively, so only geometry explicitly assigned
 * to layer 1 (projection lines, dimensions) is visible in paper-space renders.
 *
 * Local coordinate convention:
 * - X right → world +X
 * - Y up (screen) → world -Z
 * - Normal (out of plane) → world +Y
 */
export class DrawingViewport {
  /** Unique identifier for this viewport instance. */
  readonly uuid = THREE.MathUtils.generateUUID();

  /** Human-readable label for this viewport. */
  name: string;

  /**
   * The Three.js orthographic camera for this viewport.
   * Add it to the drawing container via {@link DrawingViewports.add}.
   */
  readonly camera: THREE.OrthographicCamera;

  /** {@link Disposable.onDisposed} */
  readonly onDisposed = new Event<void>();

  private _left: number;
  private _right: number;
  private _top: number;
  private _bottom: number;
  private _drawingScale: number;

  private _container: THREE.Group | null = null;
  private _helper: DrawingViewportHelper | null = null;
  private _helperVisible = false;

  get left() {
    return this._left;
  }
  set left(value: number) {
    this._left = value;
    this.camera.left = value;
    this.camera.updateProjectionMatrix();
    this._helper?.update();
  }

  get right() {
    return this._right;
  }
  set right(value: number) {
    this._right = value;
    this.camera.right = value;
    this.camera.updateProjectionMatrix();
    this._helper?.update();
  }

  get top() {
    return this._top;
  }
  set top(value: number) {
    this._top = value;
    this.camera.top = value;
    this.camera.updateProjectionMatrix();
    this._helper?.update();
  }

  get bottom() {
    return this._bottom;
  }
  set bottom(value: number) {
    this._bottom = value;
    this.camera.bottom = value;
    this.camera.updateProjectionMatrix();
    this._helper?.update();
  }

  /** Drawing scale denominator (e.g. 100 = 1:100). */
  get drawingScale() {
    return this._drawingScale;
  }
  set drawingScale(value: number) {
    this._drawingScale = value;
  }

  /**
   * The {@link DrawingViewportHelper} for this viewport.
   *
   * The helper is created lazily on first access and cached. It is a
   * `THREE.Group` on layer 0, so it is visible to the perspective camera but
   * invisible to the viewport's own orthographic camera (layer 1 only).
   *
   * Use {@link helperVisible} to attach/detach it to the drawing container
   * automatically, or manage it manually with `drawing.three.add/remove`.
   */
  get helper(): DrawingViewportHelper {
    if (!this._helper) {
      this._helper = new DrawingViewportHelper(this);
    }
    return this._helper;
  }

  /**
   * Shows or hides the {@link DrawingViewportHelper} by attaching it to or
   * removing it from the drawing's container group.
   *
   * Setting this to `true` before the viewport has been registered via
   * `DrawingViewports.add()` has no effect until registration occurs.
   */
  get helperVisible(): boolean {
    return this._helperVisible;
  }
  set helperVisible(value: boolean) {
    this._helperVisible = value;
    if (value) {
      this._container?.add(this.helper);
    } else {
      this._helper?.removeFromParent();
    }
  }

  /**
   * Axis-aligned bounding box of this viewport in world drawing space (Y = 0).
   * Used by {@link clipLine} and PDF/DXF exporters.
   *
   * Because screen-up = world −Z, the world Z range visible to the camera is
   * [−top, −bottom], not [bottom, top].
   */
  get bbox() {
    const origin = new THREE.Vector3(this._left, 0, -this._top);
    const end = new THREE.Vector3(this._right, 0, -this._bottom);
    return new THREE.Box3(origin, end);
  }

  /** Viewport size in millimetres (based on local units × 1000). */
  get size() {
    const size = new THREE.Vector3();
    this.bbox.getSize(size);
    return new THREE.Vector2(size.x * 1000, size.z * 1000);
  }

  /** Local X axis direction (world +X). */
  get localXAxis() {
    return new THREE.Vector3(1, 0, 0);
  }

  /** Local Y axis direction (world -Z). */
  get localYAxis() {
    return new THREE.Vector3(0, 0, -1);
  }

  /** Drawing plane normal (world +Y). */
  get normal() {
    return new THREE.Vector3(0, 1, 0);
  }

  constructor(config: DrawingViewportConfig) {
    this._left = config.left;
    this._right = config.right;
    this._top = config.top;
    this._bottom = config.bottom;
    this._drawingScale = config.scale ?? 100;
    this.name = config.name ?? "Drawing Viewport";

    // Camera above the drawing plane looking down.
    // up=(0,0,-1): screen-right = world +X, screen-up = world -Z. No frustum negation needed.
    this.camera = new THREE.OrthographicCamera(
      this._left,
      this._right,
      this._top,
      this._bottom,
      0.1,
      30,
    );

    this.camera.up.set(0, 0, -1);
    this.camera.position.set(0, 10, 0);
    this.camera.lookAt(0, 0, 0);
    this.camera.layers.set(1);
  }

  /**
   * Called by `DrawingViewports.add` after the viewport is registered.
   * Stores a reference to the drawing container so that {@link helperVisible}
   * can attach the helper automatically.
   *
   * @internal
   */
  setContainer(container: THREE.Group): void {
    this._container = container;
    // If helperVisible was set before addViewport, apply it now.
    if (this._helperVisible && this._helper) {
      container.add(this._helper);
    }
  }

  /**
   * Clips a line segment to this viewport's bounding box.
   * Returns `null` when the line is entirely outside the viewport.
   */
  clipLine(line: THREE.Line3): THREE.Line3 | null {
    const box = this.bbox;
    const { start, end } = line;
    const startInside = box.containsPoint(start);
    const endInside = box.containsPoint(end);

    if (startInside && endInside) return line;

    if (!startInside && !endInside) {
      const intersections = this.getPlaneIntersections(line);
      if (intersections.length < 2) return null;
      return new THREE.Line3(intersections[0], intersections[1]);
    }

    const intersections = this.getPlaneIntersections(line);
    if (intersections.length === 0) return null;

    return startInside
      ? new THREE.Line3(start, intersections[0])
      : new THREE.Line3(intersections[0], end);
  }

  /** Destroys this viewport. The camera must be removed from its parent separately. */
  dispose() {
    this._helper?.dispose();
    this._helper = null;
    this.onDisposed.trigger();
    this.onDisposed.reset();
  }

  private get bboxPlanes() {
    const bbox = this.bbox;
    return [
      new THREE.Plane(new THREE.Vector3(1, 0, 0), -bbox.min.x),
      new THREE.Plane(new THREE.Vector3(-1, 0, 0), bbox.max.x),
      new THREE.Plane(new THREE.Vector3(0, 0, 1), -bbox.min.z),
      new THREE.Plane(new THREE.Vector3(0, 0, -1), bbox.max.z),
    ];
  }

  private getPlaneIntersections(line: THREE.Line3) {
    const intersections: THREE.Vector3[] = [];
    for (const plane of this.bboxPlanes) {
      const intersection = new THREE.Vector3();
      if (
        plane.intersectLine(line, intersection) &&
        this.bbox.containsPoint(intersection)
      ) {
        intersections.push(intersection);
      }
    }
    return intersections;
  }
}
