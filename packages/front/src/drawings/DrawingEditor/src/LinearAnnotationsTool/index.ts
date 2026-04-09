import * as THREE from "three";
import * as OBC from "@thatopen/components";
import { DrawingTool, type DrawingPointerEvent } from "../types";
import type { FontManager } from "../FontManager";
import { IndividualMode, SequentialMode, LineMode } from "./src";
import type { LinearPlacementContext } from "./src";

export * from "./src";

type EditState =
  | { kind: "idle" }
  | { kind: "selected"; uuid: string }
  | { kind: "draggingOffset"; uuid: string; pointA: THREE.Vector3; pointB: THREE.Vector3; originalOffset: number }
  | { kind: "draggingPoint"; uuid: string; which: "pointA" | "pointB"; original: THREE.Vector3; lineDir: THREE.Vector3 };

const HANDLE_KIND_TO_IDX: Record<string, number> = { pointA: 0, pointB: 1, offset: 2 };

export class LinearAnnotationsTool extends DrawingTool<LinearPlacementContext> {
  private _editState: EditState = { kind: "idle" };
  private _lastCursor: DrawingPointerEvent | null = null;

  private _previewLabelGroup: THREE.Group | null = null;
  private _previewLabelText = "";

  /** The underlying LinearDimensions system — always available. */
  readonly system: OBC.LinearAnnotations;

  constructor(components: OBC.Components) {
    super(components);
    this.registerMode("individual", IndividualMode);
    this.registerMode("sequential", SequentialMode);
    this.registerMode("line", LineMode);
    this.activeMode = "individual";

    // System is a global singleton — initialize once and subscribe to events.
    this.system = this._components.get(OBC.TechnicalDrawings).use(OBC.LinearAnnotations);
    this.system.onCommit.add(this._onCommit);
    this.system.onUpdate.add(this._onUpdate);
    this.system.onMachineStateChanged.add(this._onMachineStateChanged);
    this.system.onDelete.add(this._onDelete);
  }

  // ─── Bound handlers ──────────────────────────────────────────────────────────

  private readonly _onDelete = (uuids: string[]) => this._handleDelete(uuids);

  private readonly _onCommit = (entries: { item: OBC.LinearAnnotation; group: THREE.Group }[]) => {
    this._clearPreviewLabel();
    for (const { item, group } of entries) this._createLabel(item, group);
  };

  private readonly _onMachineStateChanged = () => {
    if (this.system.machineState.kind !== "positioningOffset") {
      this._clearPreviewLabel();
    }
  };

  private readonly _onUpdate = ({ item, group }: { item: OBC.LinearAnnotation; group: THREE.Group }) => {
    this._updateLabel(item, group);
    const s = this._editState;
    if ((s.kind === "selected" || s.kind === "draggingOffset" || s.kind === "draggingPoint") && s.uuid === item.uuid) {
      this._clearSelectionState();
      this._applySelectionMaterial(item.uuid);
      this._refreshHandles(item.uuid);
    }
    void group;
  };

  // ─── Public API (consumer-facing) ────────────────────────────────────────────

  /**
   * Number of points placed in the current placement session.
   * Useful for implementing placement strategies (e.g. auto-confirm after 2 points).
   */
  get pointsPlaced(): number {
    const s = this.system.machineState;
    return s.kind === "placingPoints" ? s.points.length : 0;
  }

  /** Current state of the underlying LinearDimensions state machine. */
  get state() {
    return this.system.machineState;
  }

  override get isIdle(): boolean {
    return this._editState.kind === "idle" && this.state.kind === "awaitingFirstPoint";
  }

  /**
   * Primary interaction entry point. Intercepts CLICK to handle selection/drag
   * before forwarding placement messages to the state machine.
   */
  send(msg: Parameters<OBC.LinearAnnotations["sendMachineEvent"]>[0]): void {
    const ray = this._lastCursor?.ray;

    if (msg.type === "CLICK") {
      if (!ray) { this.system.sendMachineEvent({ ...msg, drawing: this._drawing! }); return; }

      // Commit active drag — offset: always valid; point: validate parallel snap
      if (this._editState.kind === "draggingOffset") {
        this._editState = { kind: "selected", uuid: this._editState.uuid };
        return;
      }
      if (this._editState.kind === "draggingPoint") {
        const { uuid, which, original, lineDir } = this._editState;
        const snapLine = this._lastCursor?.snap?.line;
        const isParallel = snapLine
          ? Math.abs(lineDir.dot(new THREE.Vector3().subVectors(snapLine.end, snapLine.start).normalize())) > 0.99
          : false;
        if (!isParallel) {
          this.system.update(this._drawing!, [uuid], { [which]: original.clone() });
        }
        this._editState = { kind: "selected", uuid };
        return;
      }

      // When selected: handle hover → start drag; dim pick → select/deselect/stay
      if (this._editState.kind === "selected") {
        if (this._hoveredHandleIdx !== null) {
          const dim = this._drawing!.annotations.getBySystem(this.system).get(this._editState.uuid)!;
          const kinds = ["pointA", "pointB", "offset"] as const;
          const kind = kinds[this._hoveredHandleIdx];
          if (kind === "offset") {
            this._editState = {
              kind: "draggingOffset",
              uuid: this._editState.uuid,
              pointA: dim.pointA.clone(),
              pointB: dim.pointB.clone(),
              originalOffset: dim.offset,
            };
          } else {
            const ab = new THREE.Vector3().subVectors(dim.pointB, dim.pointA);
            const lineDir = new THREE.Vector3(-ab.z, 0, ab.x).normalize();
            this._editState = {
              kind: "draggingPoint",
              uuid: this._editState.uuid,
              which: kind,
              original: dim[kind].clone(),
              lineDir,
            };
          }
          return;
        }

        const picked = this.system.pick(ray);
        if (picked && picked !== this._editState.uuid) { this._select(picked); return; }
        if (!picked) { this._deselect(); return; }
        return; // same dim, not on handle → stay selected
      }

      // When idle: pick before placement
      const picked = this.system.pick(ray);
      if (picked) { this._select(picked); return; }
    }

    // Inject drawing only on the first events that start the machine.
    if (msg.type === "CLICK" || msg.type === "SELECT_LINE") {
      this.system.sendMachineEvent({ ...msg, drawing: this._drawing! });
    } else {
      this.system.sendMachineEvent(msg);
    }
  }

  /** Confirm the current placement session. */
  confirm(): void {
    this.system.sendMachineEvent({ type: "CONFIRM" });
  }

  /**
   * Cancel any in-progress drag or placement, restoring original values.
   * Called automatically by `onDeactivate`.
   */
  protected override _onCancel(): void {
    if (this._editState.kind === "draggingOffset") {
      this.system.update(this._drawing!, [this._editState.uuid], { offset: this._editState.originalOffset });
    } else if (this._editState.kind === "draggingPoint") {
      this.system.update(this._drawing!, [this._editState.uuid], { [this._editState.which]: this._editState.original.clone() });
    }
    this.system.sendMachineEvent({ type: "ESCAPE" });
  }

  // ─── DrawingTool ─────────────────────────────────────────────────────────────

  onDrawingChange(drawing: OBC.TechnicalDrawing | null, fonts: FontManager | null): void {
    this.system.sendMachineEvent({ type: "ESCAPE" });
    this._labelGroups.clear();
    this._clearPreviewLabel();
    this._deselect();
    this._clearHandles();
    this._drawing = drawing;
    this._fonts = fonts;
    if (drawing) {
      for (const [uuid, dim] of drawing.annotations.getBySystem(this.system)) {
        const group = drawing.annotations.get(uuid)?.three as THREE.Group | undefined;
        if (group) this._createLabel(dim, group);
      }
    }
  }

  onActivate(): void {}

  onDeactivate(): void {
    this.cancel();
  }

  onPointerClick(cursor: DrawingPointerEvent): void {
    const snap = cursor.snap;
    const point = snap?.point ?? cursor.point;
    const line = snap?.line;

    // Edit phase (drag/selection active): let send() handle the full logic.
    if (this._editState.kind !== "idle") {
      this.send({ type: "CLICK", point, line });
      return;
    }

    const mode = this.modes.get(this.activeMode);
    if (!mode) return;

    mode.onClick({
      state: this.state,
      snap,
      point,
      line,
      pointsPlaced: this.pointsPlaced,
      isHandleHovered: this.isHandleHovered,
      send: (msg) => this.send(msg),
    });
  }

  onPointerMove(e: DrawingPointerEvent): void {
    this._lastCursor = e;

    if (this._editState.kind === "draggingOffset") {
      const { uuid, pointA, pointB } = this._editState;
      const offset = OBC.computeOffset([pointA, pointB], e.point);
      this.system.update(this._drawing!, [uuid], { offset });
      return;
    }

    if (this._editState.kind === "draggingPoint") {
      const { uuid, which, lineDir } = this._editState;
      const dim = this._drawing!.annotations.getBySystem(this.system).get(uuid)!;
      const fixedPt = which === "pointA" ? dim.pointB : dim.pointA;
      const rawPt = e.snap?.point ?? e.point;
      const corrected = this._projectToParallel(rawPt, fixedPt, lineDir);
      this.system.update(this._drawing!, [uuid], { [which]: corrected });
      return;
    }

    if (this._editState.kind === "selected") {
      const hit = this._findHandleAtPoint(e.point);
      const idx = hit && hit.uuid === this._editState.uuid
        ? (HANDLE_KIND_TO_IDX[hit.kind] ?? null)
        : null;
      this._setHoveredHandle(idx);
      if (idx === null) this.system.sendMachineEvent({ type: "MOUSE_MOVE", point: e.point });
    } else {
      this.system.sendMachineEvent({ type: "MOUSE_MOVE", point: e.point });
    }
    this._updatePreviewLabel();
  }

  dispose(): void {
    this.onDrawingChange(null, null);
    this.system.onCommit.remove(this._onCommit);
    this.system.onUpdate.remove(this._onUpdate);
    this.system.onMachineStateChanged.remove(this._onMachineStateChanged);
    this.system.onDelete.remove(this._onDelete);
    this._disposeHandles();
    this._disposeSelection();
  }

  // ─── Multi-selection support ──────────────────────────────────────────────────

  protected _systemPick(ray: THREE.Ray): string | null { return this.system.pick(ray); }
  protected _systemDelete(drawing: OBC.TechnicalDrawing, uuids: string[]): void { this.system.delete(drawing, uuids); }
  protected override _onDeselect(): void { this._editState = { kind: "idle" }; }

  // ─── Labels ──────────────────────────────────────────────────────────────────

  private _createLabel(dim: OBC.LinearAnnotation, dimGroup: THREE.Group): void {
    if (!this._fonts) return;

    const old = this._labelGroups.get(dim.uuid);
    if (old) {
      old.removeFromParent();
      (old.children[0] as THREE.Mesh | undefined)?.geometry.dispose();
      this._labelGroups.delete(dim.uuid);
    }
    this._removeExistingLabel(dimGroup);

    const style = this.system.styles.get(dim.style) ?? this.system.styles.get("default")!;
    const distance = dim.pointA.distanceTo(dim.pointB);
    const unit = style.unit ?? OBC.Units.m;
    const text = `${(distance * unit.factor).toFixed(2)} ${unit.suffix}`;

    const mesh = this._fonts.createTextMesh(text, style.fontSize, style.color);
    if (!mesh) return;

    const bbox = new THREE.Box3().setFromObject(mesh);

    const group = new THREE.Group();
    group.layers.set(1);
    group.userData.isDimension = true;
    group.userData.fontSize = style.fontSize;
    group.userData.color = style.color;
    group.userData.textString = text;
    group.userData.textCenterX = (bbox.min.x + bbox.max.x) / 2;
    group.userData.textMinZ = bbox.min.z;
    group.userData.textMaxZ = bbox.max.z;
    group.userData.styleMat = mesh.material;
    group.add(mesh);

    this._labelGroups.set(dim.uuid, group);
    dimGroup.add(group);
    this._positionLabel(dim, group, style);
  }

  private _updateLabel(dim: OBC.LinearAnnotation, dimGroup: THREE.Group): void {
    const group = this._labelGroups.get(dim.uuid);
    if (!group) { this._createLabel(dim, dimGroup); return; }

    const style = this.system.styles.get(dim.style) ?? this.system.styles.get("default")!;
    const distance = dim.pointA.distanceTo(dim.pointB);
    const unit = style.unit ?? OBC.Units.m;
    const newText = `${(distance * unit.factor).toFixed(2)} ${unit.suffix}`;
    const fontSizeChanged = group.userData.fontSize !== style.fontSize;
    const colorChanged = group.userData.color !== style.color;
    const textChanged = group.userData.textString !== newText;

    if (fontSizeChanged || colorChanged || textChanged) {
      this._createLabel(dim, dimGroup);
      return;
    }

    if (group.parent !== dimGroup) dimGroup.add(group);
    // Restore style material before _applySelectionMaterial runs in _onUpdate.
    // Without this, offset drags (which don't change text) accumulate the orange
    // selection material as "_selOrigMat", so ESC restores orange instead of the style colour.
    const textMesh = group.children[0] as THREE.Mesh | undefined;
    if (textMesh && group.userData.styleMat) textMesh.material = group.userData.styleMat;
    this._positionLabel(dim, group, style);
  }

  private _clearPreviewLabel(): void {
    if (!this._previewLabelGroup) return;
    this._previewLabelGroup.removeFromParent();
    (this._previewLabelGroup.children[0] as THREE.Mesh | undefined)?.geometry.dispose();
    this._previewLabelGroup = null;
    this._previewLabelText = "";
  }

  private _updatePreviewLabel(): void {
    if (!this._fonts || !this._drawing) return;
    const s = this.system.machineState;
    if (s.kind !== "positioningOffset" || !s.cursor || s.points.length < 2) {
      this._clearPreviewLabel();
      return;
    }

    const style = this.system.styles.get(this.system.activeStyle) ?? this.system.styles.get("default")!;
    const distance = s.points[0].distanceTo(s.points[s.points.length - 1]);
    const unit = style.unit ?? OBC.Units.m;
    const text = `${(distance * unit.factor).toFixed(2)} ${unit.suffix}`;

    const offset = OBC.computeOffset(s.points, s.cursor);
    const ab = new THREE.Vector3().subVectors(s.points[s.points.length - 1], s.points[0]);
    const perp = new THREE.Vector3(-ab.z, 0, ab.x).normalize();
    const sign = offset >= 0 ? 1 : -1;
    const dimA = s.points[0].clone().addScaledVector(perp, offset);
    const dimB = s.points[s.points.length - 1].clone().addScaledVector(perp, offset);
    const center = new THREE.Vector3().addVectors(dimA, dimB).multiplyScalar(0.5);
    center.addScaledVector(perp, sign * style.textOffset);
    center.y += 0.005;

    if (text !== this._previewLabelText || !this._previewLabelGroup) {
      this._clearPreviewLabel();
      const mesh = this._fonts.createTextMesh(text, style.fontSize, style.color, 0.5);
      if (!mesh) return;

      const bbox = new THREE.Box3().setFromObject(mesh);
      const bc = bbox.getCenter(new THREE.Vector3());
      mesh.position.set(-bc.x, 0, -bc.z);

      const dimDir = new THREE.Vector3().subVectors(dimB, dimA).normalize();
      let angle = Math.atan2(dimDir.z, dimDir.x);
      if (angle > Math.PI / 2 || angle <= -Math.PI / 2) angle += Math.PI;

      this._previewLabelGroup = new THREE.Group();
      this._previewLabelGroup.layers.set(1);
      this._previewLabelGroup.userData.isDimension = true;
      this._previewLabelGroup.rotation.y = angle;
      this._previewLabelGroup.add(mesh);
      this._drawing.three.add(this._previewLabelGroup);
      this._previewLabelText = text;
    }

    this._previewLabelGroup.position.copy(center);
  }

  private _positionLabel(dim: OBC.LinearAnnotation, labelGroup: THREE.Group, style: OBC.LinearAnnotationStyle): void {
    const ab = new THREE.Vector3().subVectors(dim.pointB, dim.pointA);
    const perp = new THREE.Vector3(-ab.z, 0, ab.x).normalize();
    const dimLineA = dim.pointA.clone().addScaledVector(perp, dim.offset);
    const dimLineB = dim.pointB.clone().addScaledVector(perp, dim.offset);
    const center = new THREE.Vector3().addVectors(dimLineA, dimLineB).multiplyScalar(0.5);
    const dir = new THREE.Vector3().subVectors(dimLineB, dimLineA).normalize();

    let angle = Math.atan2(dir.z, dir.x);
    if (angle > Math.PI / 2 || angle <= -Math.PI / 2) angle += Math.PI;

    const sign = dim.offset >= 0 ? 1 : -1;
    const mesh = labelGroup.children[0] as THREE.Mesh;
    const textCenterZ = (labelGroup.userData.textMinZ + labelGroup.userData.textMaxZ) / 2;
    const halfTextHeight = (labelGroup.userData.textMaxZ - labelGroup.userData.textMinZ) / 2;

    mesh.position.set(-labelGroup.userData.textCenterX, 0, -textCenterZ);

    labelGroup.position.copy(center);
    labelGroup.position.addScaledVector(perp, sign * (style.textOffset + halfTextHeight));
    labelGroup.position.y = 0.005;
    labelGroup.rotation.y = angle;
  }

  // ─── Selection & handles ─────────────────────────────────────────────────────

  protected override _onSelect(uuid: string): void {
    this._editState = { kind: "selected", uuid };
  }

  protected _getHandlePositions(uuid: string): THREE.Vector3[] {
    if (!this._drawing) return [];
    const dim = this._drawing.annotations.getBySystem(this.system).get(uuid);
    if (!dim) return [];
    const style = this.system.styles.get(dim.style) ?? this.system.styles.get("default")!;
    const ab = new THREE.Vector3().subVectors(dim.pointB, dim.pointA);
    const perp = new THREE.Vector3(-ab.z, 0, ab.x).normalize();
    const sign = dim.offset >= 0 ? 1 : -1;
    const absOffset = Math.abs(dim.offset);

    const extA0 = dim.pointA.clone().addScaledVector(perp, style.extensionGap * sign);
    const extA1 = dim.pointA.clone().addScaledVector(perp, (absOffset + style.extensionOvershoot) * sign);
    const midExtA = new THREE.Vector3().addVectors(extA0, extA1).multiplyScalar(0.5);

    const extB0 = dim.pointB.clone().addScaledVector(perp, style.extensionGap * sign);
    const extB1 = dim.pointB.clone().addScaledVector(perp, (absOffset + style.extensionOvershoot) * sign);
    const midExtB = new THREE.Vector3().addVectors(extB0, extB1).multiplyScalar(0.5);

    const offsetMid = new THREE.Vector3()
      .addVectors(dim.pointA, dim.pointB)
      .multiplyScalar(0.5)
      .addScaledVector(perp, dim.offset);

    return [midExtA, midExtB, offsetMid];
  }

  private _findHandleAtPoint(
    pt: THREE.Vector3,
    threshold = 0.12,
  ): { uuid: string; kind: "pointA" | "pointB" | "offset" } | null {
    if (!this._drawing) return null;
    let best: { uuid: string; kind: "pointA" | "pointB" | "offset" } | null = null;
    let bestDist = threshold;
    for (const [uuid] of this._drawing.annotations.getBySystem(this.system)) {
      const positions = this._getHandlePositions(uuid);
      const kinds = ["pointA", "pointB", "offset"] as const;
      for (let i = 0; i < kinds.length; i++) {
        const pos = positions[i];
        const dist = Math.hypot(pt.x - pos.x, pt.z - pos.z);
        if (dist < bestDist) {
          bestDist = dist;
          best = { uuid, kind: kinds[i] };
        }
      }
    }
    return best;
  }

  // ─── Geometry helpers ─────────────────────────────────────────────────────────

  private _projectToParallel(snapPt: THREE.Vector3, fixedPt: THREE.Vector3, lineDir: THREE.Vector3): THREE.Vector3 {
    const delta = snapPt.dot(lineDir) - fixedPt.dot(lineDir);
    return snapPt.clone().addScaledVector(lineDir, -delta);
  }
}
