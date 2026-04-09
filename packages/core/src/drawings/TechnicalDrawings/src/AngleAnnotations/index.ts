import * as THREE from "three";
import { Disposable, Event, Transitionable } from "../../../../core/Types";
import { Components } from "../../../../core/Components";
import { TechnicalDrawing } from "../TechnicalDrawing";
import { AnnotationSystem } from "../DrawingSystem";
import {
  AngleAnnotation,
  AngleAnnotationData,
  AngleAnnotationEvent,
  AngleAnnotationState,
  AngleAnnotationStyle,
} from "./src/types";
import { angleDimensionMachine } from "./src/machine";
import {
  buildAnglePositions,
  buildAnglePreviewPositions,
  getAngleTickEndpoints,
} from "./src/geometry";
import { DiagonalTick } from "../ticks";

export * from "./src";

interface AngleAnnotationSystem {
  item:   AngleAnnotation;
  data:   AngleAnnotationData;
  style:  AngleAnnotationStyle;
  handle: "pointA" | "vertex" | "pointB";
}

/** Global drawing system that manages angle dimension annotations across all {@link TechnicalDrawing} instances. */
export class AngleAnnotations
  extends AnnotationSystem<AngleAnnotationSystem>
  implements Transitionable<AngleAnnotationState, AngleAnnotationEvent>, Disposable
{
  enabled = true;
  declare readonly _item: AngleAnnotation;

  machineState: AngleAnnotationState = { kind: "awaitingFirstLine" };
  readonly onMachineStateChanged = new Event<AngleAnnotationState>();

  // Secondary preview for the "awaiting second line" state.
  private _secondLinePreviewObject: THREE.LineSegments | null = null;

  constructor(components: Components) {
    super(components);

    this.styles.set("default", {
      lineTick: DiagonalTick,
      tickSize: 0.4,
      extensionGap: 0.05,
      color: 0x000000,
      textOffset: 0.25,
      fontSize: 0.45,
    });
  }

  // ─── pickHandle ────────────────────────────────────────────────────────────

  pickHandle(
    _drawing: TechnicalDrawing,
    _ray: THREE.Ray,
    _threshold?: number,
  ): { uuid: string; handle: "pointA" | "vertex" | "pointB" } | null {
    return null; // TODO: implement angle dimension handle picking
  }

  // ─── sendMachineEvent ─────────────────────────────────────────────────────

  sendMachineEvent(event: AngleAnnotationEvent): void {
    const eventDrawing = (event as { drawing?: TechnicalDrawing }).drawing ?? null;

    if (this.machineState.kind === "awaitingSecondLine" && event.type === "MOUSE_MOVE") {
      if (eventDrawing) this._previewDrawing = eventDrawing;
      this._updateSecondLinePreview(event.point, event.line ?? null);
      return;
    }

    const next = angleDimensionMachine(this.machineState, event);
    if (next === this.machineState) return;

    if (this.machineState.kind === "awaitingSecondLine") this._clearSecondLinePreview();

    this.machineState = next;
    if (eventDrawing) this._previewDrawing = eventDrawing;
    this._updatePreview();

    if (next.kind === "committed") {
      if (!this._previewDrawing) {
        console.warn("AngleAnnotations: CLICK that commits must include `drawing`. Skipping.");
        this._resetMachine();
        return;
      }
      next.dimension.style = this.activeStyle;
      const committed = this._persist(this._previewDrawing, next.dimension);
      this.onCommit.trigger([committed]);
    }

    this.onMachineStateChanged.trigger(this.machineState);
    if (next.kind === "committed") this._resetMachine();
  }

  // ─── _buildGroup ──────────────────────────────────────────────────────────

  protected _buildGroup(dim: AngleAnnotation, style: AngleAnnotationStyle): THREE.Group {
    const group = new THREE.Group();

    const positions = buildAnglePositions(dim, style);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(positions), 3));
    const ls = new THREE.LineSegments(geo, this._getMaterial(dim.style));
    ls.layers.set(1);
    ls.userData.isDimension = true;
    group.add(ls);

    if (style.meshTick) {
      for (const { tip, dir } of getAngleTickEndpoints(dim)) {
        const triangles = style.meshTick(tip, dir, style.tickSize);
        const meshGeo = new THREE.BufferGeometry();
        meshGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(triangles), 3));
        const mesh = new THREE.Mesh(meshGeo, this._getMeshMaterial(dim.style));
        mesh.layers.set(1);
        mesh.userData.isMeshTick = true;
        group.add(mesh);
      }
    }

    return group;
  }

  // ─── _updatePreview ───────────────────────────────────────────────────────

  protected override _updatePreview(): void {
    const s = this.machineState;
    if (s.kind !== "positioningArc") { this._clearPreview(); return; }
    if (!this._previewDrawing) { this._clearPreview(); return; }

    const style = this._resolveStyle(this.activeStyle);
    const positions = buildAnglePreviewPositions(
      s.pointA, s.vertex, s.pointB, s.cursor, style, s.flipped,
    );
    if (positions.length === 0) { this._clearPreview(); return; }

    const vertexCount = positions.length / 3;
    const needsNew = !this._previewObject ||
      this._previewObject.geometry.attributes.position.count !== vertexCount;

    if (needsNew) {
      this._clearPreview();
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(positions), 3));
      this._previewObject = new THREE.LineSegments(geo, this._previewMaterial);
      this._previewObject.layers.set(1);
      this._previewObject.renderOrder = 1;
      this._previewObject.userData.isDimension = true;
      this._previewDrawing.three.add(this._previewObject);
    } else {
      const attr = this._previewObject!.geometry.attributes.position as THREE.BufferAttribute;
      attr.set(positions);
      attr.needsUpdate = true;
    }
  }

  // ─── _onDispose ───────────────────────────────────────────────────────────

  protected override _onDispose(): void {
    this._clearSecondLinePreview();
  }

  // ─── Private ──────────────────────────────────────────────────────────────

  private _resetMachine(): void {
    this.machineState = { kind: "awaitingFirstLine" };
    this._previewDrawing = null;
    this._updatePreview();
    this.onMachineStateChanged.trigger(this.machineState);
  }

  private _clearSecondLinePreview(): void {
    if (!this._secondLinePreviewObject) return;
    this._secondLinePreviewObject.removeFromParent();
    this._secondLinePreviewObject.geometry.dispose();
    this._secondLinePreviewObject = null;
  }

  private _updateSecondLinePreview(point: THREE.Vector3, line: THREE.Line3 | null): void {
    if (this.machineState.kind !== "awaitingSecondLine") {
      this._clearSecondLinePreview();
      return;
    }
    if (!this._previewDrawing) { this._clearSecondLinePreview(); return; }

    const s = this.machineState;
    const line1Dir = new THREE.Vector3().subVectors(s.line1.end, s.line1.start).normalize();
    if (!line) { this._clearSecondLinePreview(); return; }

    const line2Dir = new THREE.Vector3().subVectors(line.end, line.start).normalize();
    const vertex = _intersectLines2D(s.line1.start, line1Dir, line.start, line2Dir);
    if (!vertex) { this._clearSecondLinePreview(); return; }

    const pointB = point.clone();
    const toPoint = new THREE.Vector3().subVectors(pointB, vertex).setY(0);
    if (toPoint.length() < 0.01) { this._clearSecondLinePreview(); return; }

    const rayA = new THREE.Vector3().subVectors(s.pointA, vertex).normalize();
    const rayB = toPoint.normalize();
    const angleA = Math.atan2(rayA.z, rayA.x);
    let delta = Math.atan2(rayB.z, rayB.x) - angleA;
    while (delta > Math.PI) delta -= 2 * Math.PI;
    while (delta < -Math.PI) delta += 2 * Math.PI;
    const bisectorAngle = angleA + delta / 2;
    const arcRadius = Math.max(
      0.1,
      Math.min(s.pointA.distanceTo(vertex), pointB.distanceTo(vertex)) * 0.4,
    );
    const cursor = new THREE.Vector3(
      vertex.x + Math.cos(bisectorAngle) * arcRadius,
      0,
      vertex.z + Math.sin(bisectorAngle) * arcRadius,
    );

    const style = this._resolveStyle(this.activeStyle);
    const positions = buildAnglePreviewPositions(s.pointA, vertex, pointB, cursor, style);
    if (positions.length === 0) { this._clearSecondLinePreview(); return; }

    const vertexCount = positions.length / 3;
    const needsNew = !this._secondLinePreviewObject ||
      this._secondLinePreviewObject.geometry.attributes.position.count !== vertexCount;

    if (needsNew) {
      this._clearSecondLinePreview();
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(positions), 3));
      this._secondLinePreviewObject = new THREE.LineSegments(geo, this._previewMaterial);
      this._secondLinePreviewObject.layers.set(1);
      this._secondLinePreviewObject.renderOrder = 1;
      this._secondLinePreviewObject.userData.isDimension = true;
      this._previewDrawing.three.add(this._secondLinePreviewObject);
    } else {
      const attr = this._secondLinePreviewObject!.geometry.attributes.position as THREE.BufferAttribute;
      attr.set(positions);
      attr.needsUpdate = true;
    }
  }
}

function _intersectLines2D(
  p1: THREE.Vector3, d1: THREE.Vector3,
  p2: THREE.Vector3, d2: THREE.Vector3,
): THREE.Vector3 | null {
  const cross = d1.x * d2.z - d1.z * d2.x;
  if (Math.abs(cross) < 1e-6) return null;
  const dx = p2.x - p1.x;
  const dz = p2.z - p1.z;
  const t = (dx * d2.z - dz * d2.x) / cross;
  return new THREE.Vector3(p1.x + t * d1.x, 0, p1.z + t * d1.z);
}
