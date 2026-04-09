import * as THREE from "three";
import { Disposable, Event, Transitionable } from "../../../../core/Types";
import { Components } from "../../../../core/Components";
import { TechnicalDrawing } from "../TechnicalDrawing";
import { AnnotationSystem } from "../DrawingSystem";
import {
  LeaderAnnotation,
  LeaderAnnotationData,
  LeaderAnnotationEvent,
  LeaderAnnotationState,
  LeaderAnnotationStyle,
} from "./src/types";
import { leaderAnnotationMachine } from "./src/machine";
import { buildLeaderPositions, buildLeaderPreviewPositions } from "./src/geometry";
import { OpenArrowTick } from "../ticks";

export * from "./src";

interface LeaderAnnotationSystem {
  item:   LeaderAnnotation;
  data:   LeaderAnnotationData;
  style:  LeaderAnnotationStyle;
  handle: "elbow" | "extensionEnd";
}

/**
 * Global drawing system that manages leader (arrow + text) annotations across
 * all {@link TechnicalDrawing} instances.
 */
export class LeaderAnnotations
  extends AnnotationSystem<LeaderAnnotationSystem>
  implements Transitionable<LeaderAnnotationState, LeaderAnnotationEvent>, Disposable
{
  enabled = true;
  declare readonly _item: LeaderAnnotation;

  machineState: LeaderAnnotationState = { kind: "awaitingArrowTip" };
  readonly onMachineStateChanged = new Event<LeaderAnnotationState>();

  // Mesh arrow preview material (additional to the base line preview).
  private readonly _previewMeshMaterial = new THREE.MeshBasicMaterial({
    color: 0xff6666,
    side: THREE.DoubleSide,
    depthTest: false,
  });
  private _previewMeshObject: THREE.Mesh | null = null;

  constructor(components: Components) {
    super(components);

    this.styles.set("default", {
      tickSize: 0.4,
      color: 0x000000,
      textOffset: 0.1,
      fontSize: 0.45,
      lineTick: OpenArrowTick,
    });
  }

  // ─── pickHandle ────────────────────────────────────────────────────────────

  pickHandle(
    drawing: TechnicalDrawing,
    ray: THREE.Ray,
    threshold = 0.1,
  ): { uuid: string; handle: "elbow" | "extensionEnd" } | null {
    const invMatrix = new THREE.Matrix4().copy(drawing.three.matrixWorld).invert();
    const localOrigin = ray.origin.clone().applyMatrix4(invMatrix);
    const localDir = ray.direction.clone().transformDirection(invMatrix).normalize();
    const localRay = new THREE.Ray(localOrigin, localDir);

    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const cursor = localRay.intersectPlane(plane, new THREE.Vector3());
    if (!cursor) return null;

    let closest: { uuid: string; handle: "elbow" | "extensionEnd" } | null = null;
    let closestDist = threshold;

    for (const [uuid, ann] of drawing.annotations.getBySystem(this)) {
      for (const [handle, pos] of [
        ["elbow", ann.elbow],
        ["extensionEnd", ann.extensionEnd],
      ] as Array<["elbow" | "extensionEnd", THREE.Vector3]>) {
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

  sendMachineEvent(event: LeaderAnnotationEvent): void {
    const eventDrawing = (event as { drawing?: TechnicalDrawing }).drawing ?? null;
    if (eventDrawing) this._previewDrawing = eventDrawing;

    const next = leaderAnnotationMachine(this.machineState, event);
    if (next === this.machineState) return;

    this.machineState = next;
    this._updatePreview();

    if (next.kind === "committed") {
      if (!this._previewDrawing) {
        console.warn("LeaderAnnotations: commit requires a drawing. Skipping.");
        this._resetMachine();
        return;
      }
      next.annotation.style = this.activeStyle;
      const committed = this._persist(this._previewDrawing, next.annotation);
      this.onCommit.trigger([committed]);
    }

    this.onMachineStateChanged.trigger(this.machineState);
    if (next.kind === "committed") this._resetMachine();
  }

  // ─── _buildGroup ──────────────────────────────────────────────────────────

  protected _buildGroup(ann: LeaderAnnotation, style: LeaderAnnotationStyle): THREE.Group {
    const group = new THREE.Group();

    const positions = buildLeaderPositions(ann, style);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(positions), 3));
    const ls = new THREE.LineSegments(geo, this._getMaterial(ann.style));
    ls.layers.set(1);
    ls.userData.isDimension = true;
    group.add(ls);

    if (style.meshTick) {
      const dir = new THREE.Vector3().subVectors(ann.arrowTip, ann.elbow);
      if (dir.lengthSq() > 1e-10) {
        dir.normalize();
        const triangles = style.meshTick(ann.arrowTip, dir, style.tickSize);
        const meshGeo = new THREE.BufferGeometry();
        meshGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(triangles), 3));
        const mesh = new THREE.Mesh(meshGeo, this._getMeshMaterial(ann.style));
        mesh.layers.set(1);
        mesh.userData.isMeshArrow = true;
        group.add(mesh);
      }
    }

    return group;
  }

  // ─── _updatePreview ───────────────────────────────────────────────────────

  protected override _updatePreview(): void {
    const s = this.machineState;
    if (s.kind !== "placingElbow" && s.kind !== "placingExtension") {
      this._clearPreview();
      return;
    }
    if (!this._previewDrawing) { this._clearPreview(); return; }

    const style = this._resolveStyle(this.activeStyle);
    const positions =
      s.kind === "placingElbow"
        ? buildLeaderPreviewPositions("placingElbow", s.arrowTip, null, s.cursor, style)
        : buildLeaderPreviewPositions("placingExtension", s.arrowTip, s.elbow, s.cursor, style);

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
      this._previewObject.frustumCulled = false;
      this._previewObject.userData.isDimension = true;
      this._previewDrawing.three.add(this._previewObject);
    } else {
      const attr = this._previewObject!.geometry.attributes.position as THREE.BufferAttribute;
      attr.set(positions);
      attr.needsUpdate = true;
    }

    // Mesh-tick preview for the arrow head
    if (style.meshTick) {
      const elbowRef = s.kind === "placingElbow" ? s.cursor : s.elbow;
      const dir = elbowRef
        ? new THREE.Vector3().subVectors(s.arrowTip, elbowRef)
        : null;

      if (dir && dir.lengthSq() > 1e-10) {
        dir.normalize();
        const triangles = style.meshTick(s.arrowTip, dir, style.tickSize);
        if (this._previewMeshObject) {
          const attr = this._previewMeshObject.geometry.attributes.position as THREE.BufferAttribute;
          attr.set(triangles);
          attr.needsUpdate = true;
        } else {
          const meshGeo = new THREE.BufferGeometry();
          meshGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(triangles), 3));
          this._previewMeshObject = new THREE.Mesh(meshGeo, this._previewMeshMaterial);
          this._previewMeshObject.layers.set(1);
          this._previewMeshObject.renderOrder = 1;
          this._previewMeshObject.frustumCulled = false;
          this._previewDrawing.three.add(this._previewMeshObject);
        }
      } else {
        this._clearPreviewMesh();
      }
    } else {
      this._clearPreviewMesh();
    }
  }

  protected override _clearPreview(): void {
    super._clearPreview();
    this._clearPreviewMesh();
  }

  // ─── _onDispose ───────────────────────────────────────────────────────────

  protected override _onDispose(): void {
    this._clearPreviewMesh();
    this._previewMeshMaterial.dispose();
  }

  // ─── Private ──────────────────────────────────────────────────────────────

  private _resetMachine(): void {
    this.machineState = { kind: "awaitingArrowTip" };
    this._previewDrawing = null;
    this._updatePreview();
    this.onMachineStateChanged.trigger(this.machineState);
  }

  private _clearPreviewMesh(): void {
    if (!this._previewMeshObject) return;
    this._previewMeshObject.removeFromParent();
    this._previewMeshObject.geometry.dispose();
    this._previewMeshObject = null;
  }
}
