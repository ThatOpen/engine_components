import * as THREE from "three";
import { Disposable, Event, Transitionable } from "../../../../core/Types";
import { Components } from "../../../../core/Components";
import { TechnicalDrawing } from "../TechnicalDrawing";
import { AnnotationSystem } from "../DrawingSystem";
import {
  CalloutAnnotation,
  CalloutAnnotationData,
  CalloutAnnotationEvent,
  CalloutAnnotationState,
  CalloutAnnotationStyle,
} from "./src/types";
import { calloutAnnotationMachine } from "./src/machine";
import {
  buildCalloutPositions,
  buildCalloutPreviewPositions,
} from "./src/geometry";
import { CloudEnclosure } from "./src/enclosures";
import { OpenArrowTick } from "../ticks";

export * from "./src";

interface CalloutAnnotationSystem {
  item:   CalloutAnnotation;
  data:   CalloutAnnotationData;
  style:  CalloutAnnotationStyle;
  handle: string;
}

/**
 * Global drawing system that manages callout annotations across all
 * {@link TechnicalDrawing} instances.
 */
export class CalloutAnnotations
  extends AnnotationSystem<CalloutAnnotationSystem>
  implements Transitionable<CalloutAnnotationState, CalloutAnnotationEvent>, Disposable
{
  enabled = true;
  declare readonly _item: CalloutAnnotation;

  machineState: CalloutAnnotationState = { kind: "awaitingCenter" };
  readonly onMachineStateChanged = new Event<CalloutAnnotationState>();

  constructor(components: Components) {
    super(components);

    this.styles.set("default", {
      enclosure:  CloudEnclosure,
      lineTick:   OpenArrowTick,
      tickSize:   0.4,
      color:      0x0055ff,
      textOffset: 0.1,
      fontSize:   0.45,
    });
  }

  // ─── pickHandle ────────────────────────────────────────────────────────────

  pickHandle(
    _drawing: TechnicalDrawing,
    _ray: THREE.Ray,
    _threshold?: number,
  ): { uuid: string; handle: string } | null {
    return null; // TODO: implement callout annotation handle picking
  }

  // ─── sendMachineEvent ─────────────────────────────────────────────────────

  sendMachineEvent(event: CalloutAnnotationEvent): void {
    const eventDrawing = (event as { drawing?: TechnicalDrawing }).drawing ?? null;
    if (eventDrawing) this._previewDrawing = eventDrawing;

    const next = calloutAnnotationMachine(this.machineState, event);
    if (next === this.machineState) return;

    this.machineState = next;
    this._updatePreview();

    if (next.kind === "committed") {
      if (!this._previewDrawing) {
        console.warn("CalloutAnnotations: commit requires a drawing. Pass `drawing` on the first CLICK.");
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

  protected _buildGroup(ann: CalloutAnnotation, style: CalloutAnnotationStyle): THREE.Group {
    const group = new THREE.Group();

    const positions = buildCalloutPositions(ann, style);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(positions), 3));
    const ls = new THREE.LineSegments(geo, this._getMaterial(ann.style));
    ls.layers.set(1);
    ls.userData.isDimension = true;
    group.add(ls);

    if (style.meshTick) {
      const extDir = new THREE.Vector3().subVectors(ann.extensionEnd, ann.elbow);
      if (extDir.lengthSq() > 1e-10) {
        extDir.normalize();
        const triangles = style.meshTick(ann.extensionEnd, extDir, style.tickSize);
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
    if (
      s.kind !== "awaitingRadius" &&
      s.kind !== "awaitingElbow" &&
      s.kind !== "awaitingExtension"
    ) {
      this._clearPreview();
      return;
    }
    if (!this._previewDrawing) return;

    const style = this._resolveStyle(this.activeStyle);
    const positions: number[] = (() => {
      switch (s.kind) {
        case "awaitingRadius":
          return buildCalloutPreviewPositions("awaitingRadius", s.center, 0, 0, null, s.cursor, style);
        case "awaitingElbow":
          return buildCalloutPreviewPositions("awaitingElbow", s.center, s.halfW, s.halfH, null, s.cursor, style);
        case "awaitingExtension":
          return buildCalloutPreviewPositions("awaitingExtension", s.center, s.halfW, s.halfH, s.elbow, s.cursor, style);
      }
    })();

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
  }

  // ─── Private ──────────────────────────────────────────────────────────────

  private _resetMachine(): void {
    this.machineState = { kind: "awaitingCenter" };
    this._clearPreview();
    this._previewDrawing = null;
    this.onMachineStateChanged.trigger(this.machineState);
  }
}
