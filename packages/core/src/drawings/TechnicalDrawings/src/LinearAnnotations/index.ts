import * as THREE from "three";
import { Disposable, Event, Transitionable } from "../../../../core/Types";
import { Components } from "../../../../core/Components";
import { TechnicalDrawing } from "../TechnicalDrawing";
import { AnnotationSystem } from "../DrawingSystem";
import {
  LinearAnnotationStyle,
  LinearAnnotation,
  LinearAnnotationData,
  LinearAnnotationEvent,
  LinearAnnotationState,
} from "./src/types";
import { linearDimensionMachine } from "./src/machine";
import {
  buildDimensionPositions,
  buildPreviewPositions,
  getDimensionTickEndpoints,
} from "./src/geometry";
import { DiagonalTick } from "../ticks";

export * from "./src";

interface LinearAnnotationSystem {
  item:   LinearAnnotation;
  data:   LinearAnnotationData;
  style:  LinearAnnotationStyle;
  handle: "pointA" | "pointB" | "offset";
}

/**
 * Global drawing system that manages linear dimension annotations across all
 * {@link TechnicalDrawing} instances.
 */
export class LinearAnnotations
  extends AnnotationSystem<LinearAnnotationSystem>
  implements Transitionable<LinearAnnotationState, LinearAnnotationEvent>, Disposable
{
  enabled = true;
  declare readonly _item: LinearAnnotation;

  machineState: LinearAnnotationState = { kind: "awaitingFirstPoint" };
  readonly onMachineStateChanged = new Event<LinearAnnotationState>();

  constructor(components: Components) {
    super(components);

    this.styles.set("default", {
      lineTick: DiagonalTick,
      tickSize: 0.4,
      extensionGap: 0.05,
      extensionOvershoot: 0.2,
      color: 0x000000,
      textOffset: 0.4,
      fontSize: 0.45,
    });
  }

  // ─── pickHandle ────────────────────────────────────────────────────────────

  pickHandle(
    drawing: TechnicalDrawing,
    ray: THREE.Ray,
    threshold = 0.1,
  ): { uuid: string; handle: "pointA" | "pointB" | "offset" } | null {
    const invMatrix = new THREE.Matrix4().copy(drawing.three.matrixWorld).invert();
    const localOrigin = ray.origin.clone().applyMatrix4(invMatrix);
    const localDir = ray.direction.clone().transformDirection(invMatrix).normalize();
    const localRay = new THREE.Ray(localOrigin, localDir);

    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const cursor = localRay.intersectPlane(plane, new THREE.Vector3());
    if (!cursor) return null;

    let closest: { uuid: string; handle: "pointA" | "pointB" | "offset" } | null = null;
    let closestDist = threshold;

    for (const [uuid, dim] of drawing.annotations.getBySystem(this)) {
      const ab = new THREE.Vector3().subVectors(dim.pointB, dim.pointA);
      const perp = new THREE.Vector3(-ab.z, 0, ab.x).normalize();
      const offsetMid = new THREE.Vector3()
        .addVectors(dim.pointA, dim.pointB)
        .multiplyScalar(0.5)
        .addScaledVector(perp, dim.offset);

      for (const [handle, pos] of [
        ["pointA", dim.pointA],
        ["pointB", dim.pointB],
        ["offset", offsetMid],
      ] as Array<["pointA" | "pointB" | "offset", THREE.Vector3]>) {
        const dist = Math.hypot(cursor.x - pos.x, cursor.z - pos.z);
        if (dist < closestDist) {
          closestDist = dist;
          closest = { uuid, handle };
        }
      }
    }

    return closest;
  }

  // ─── sendMachineEvent ─────────────────────────────────────────────────────

  sendMachineEvent(event: LinearAnnotationEvent): void {
    const eventDrawing = (event as { drawing?: TechnicalDrawing }).drawing ?? null;
    if (eventDrawing) this._previewDrawing = eventDrawing;

    const next = linearDimensionMachine(this.machineState, event);
    if (next === this.machineState) return;

    this.machineState = next;
    this._updatePreview();

    if (next.kind === "committed") {
      if (!this._previewDrawing) {
        console.warn("LinearAnnotations: no drawing context — send a CLICK or SELECT_LINE with `drawing` first. Skipping.");
        this._resetMachine();
        return;
      }
      for (const ann of next.dimensions) ann.style = this.activeStyle;
      const committed = next.dimensions.map((dim) => this._persist(this._previewDrawing!, dim));
      this.onCommit.trigger(committed);
    }

    this.onMachineStateChanged.trigger(this.machineState);
    if (next.kind === "committed") this._resetMachine();
  }

  // ─── _buildGroup ──────────────────────────────────────────────────────────

  protected _buildGroup(dim: LinearAnnotation, style: LinearAnnotationStyle): THREE.Group {
    const group = new THREE.Group();

    const positions = buildDimensionPositions(dim, style);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(positions), 3));
    const ls = new THREE.LineSegments(geo, this._getMaterial(dim.style));
    ls.layers.set(1);
    ls.userData.isDimension = true;
    group.add(ls);

    if (style.meshTick) {
      for (const { tip, dir } of getDimensionTickEndpoints(dim)) {
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
    if (s.kind !== "placingPoints" && s.kind !== "positioningOffset") {
      this._clearPreview();
      return;
    }
    if (!this._previewDrawing) { this._clearPreview(); return; }

    const style = this._resolveStyle(this.activeStyle);
    this._previewMaterial.color.setHex(style.color);
    const positions = buildPreviewPositions(s.kind, s.points, s.cursor, style);
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

  // ─── Private ──────────────────────────────────────────────────────────────

  private _resetMachine(): void {
    this.machineState = { kind: "awaitingFirstPoint" };
    this._previewDrawing = null;
    this._updatePreview();
    this.onMachineStateChanged.trigger(this.machineState);
  }
}
