import * as THREE from "three";
import * as OBC from "@thatopen/components";
import { DrawingTool, dist2D, type DrawingPointerEvent } from "../types";
import type { FontManager } from "../FontManager";

type EditState =
  | { kind: "idle" }
  | { kind: "selected"; uuid: string }
  | { kind: "draggingArc"; uuid: string; originalArcRadius: number; originalFlipped: boolean; interiorBisectorAngle: number }
  | {
      kind: "draggingPoint";
      uuid: string;
      which: "pointA" | "pointB";
      original: THREE.Vector3;
      lineDir: THREE.Vector3;    // direction from vertex along the dragged point's line
      otherLineDir: THREE.Vector3; // direction from vertex along the other line
      vertex: THREE.Vector3;
    };

export class AngleAnnotationsTool extends DrawingTool {
  private _editState: EditState = { kind: "idle" };
  private _lastCursor: DrawingPointerEvent | null = null;

  private _previewLabelGroup: THREE.Group | null = null;
  private _awaitingPreviewLabel: THREE.Group | null = null;

  private readonly _hitPlaneMat = new THREE.MeshBasicMaterial({
    transparent: true,
    opacity: 0,
    side: THREE.DoubleSide,
    depthTest: false,
  });

  /** The underlying AngleDimensions system — always available. */
  readonly system: OBC.AngleAnnotations;

  constructor(components: OBC.Components) {
    super(components);
    this.system = this._components.get(OBC.TechnicalDrawings).use(OBC.AngleAnnotations);
    this.system.onCommit.add(this._onCommit);
    this.system.onUpdate.add(this._onUpdate);
    this.system.onMachineStateChanged.add(this._onMachineStateChanged);
    this.system.onDelete.add(this._onDelete);
  }

  // ─── Bound handlers ──────────────────────────────────────────────────────────

  private readonly _onDelete = (uuids: string[]) => this._handleDelete(uuids);

  private readonly _onCommit = (entries: { drawing: OBC.TechnicalDrawing; item: OBC.AngleAnnotation; group: THREE.Group }[]) => {
    this._clearPreviewLabel();
    for (const { item, group } of entries) this._createLabel(item, group);
  };

  private readonly _onUpdate = ({ item, group }: { item: OBC.AngleAnnotation; group: THREE.Group }) => {
    this._updateLabel(item, group);
    const s = this._editState;
    if ((s.kind === "selected" || s.kind === "draggingArc" || s.kind === "draggingPoint") && s.uuid === item.uuid) {
      this._clearSelectionState();
      this._applySelectionMaterial(item.uuid);
      this._refreshHandles(item.uuid);
    }
  };

  private readonly _onMachineStateChanged = (state: OBC.AngleAnnotationState) => {
    if (state.kind !== "positioningArc") this._clearPreviewLabel();
    if (state.kind !== "awaitingSecondLine") this._clearAwaitingPreviewLabel();
  };

  // ─── Public API ───────────────────────────────────────────────────────────────

  get state() {
    return this.system.machineState;
  }

  override get isIdle(): boolean {
    return this._editState.kind === "idle" && this.state.kind === "awaitingFirstLine";
  }

  send(msg: Parameters<OBC.AngleAnnotations["sendMachineEvent"]>[0]): void {
    const ray = this._lastCursor?.ray;

    if (msg.type === "CLICK") {
      if (!ray) { this.system.sendMachineEvent({ ...msg, drawing: this._drawing! }); return; }

      // Commit active arc drag
      if (this._editState.kind === "draggingArc") {
        this._editState = { kind: "selected", uuid: this._editState.uuid };
        return;
      }

      // Commit active point drag — validate snap line, else restore
      if (this._editState.kind === "draggingPoint") {
        const { uuid, which, original, otherLineDir, vertex } = this._editState;
        const snapLine = this._lastCursor?.snap?.line;
        if (snapLine) {
          const snapDir = new THREE.Vector3().subVectors(snapLine.end, snapLine.start).normalize();
          let newVertex = _intersectLines2D(snapLine.start, snapDir, vertex, otherLineDir);
          if (!newVertex) {
            const toVertex = vertex.clone().sub(snapLine.start);
            const cross = snapDir.x * toVertex.z - snapDir.z * toVertex.x;
            if (Math.abs(cross) < 0.01) newVertex = vertex.clone();
          }
          if (newVertex) {
            const snappedPoint = this._lastCursor!.snap!.point.clone();
            this.system.update(this._drawing!, [uuid], which === "pointA"
              ? { pointA: snappedPoint, vertex: newVertex }
              : { pointB: snappedPoint, vertex: newVertex });
          } else {
            this.system.update(this._drawing!, [uuid], { [which]: original.clone(), vertex: vertex.clone() });
          }
        } else {
          this.system.update(this._drawing!, [uuid], { [which]: original.clone(), vertex: vertex.clone() });
        }
        this._editState = { kind: "selected", uuid };
        return;
      }

      // When selected: handle → start drag; dim pick → select/deselect
      if (this._editState.kind === "selected") {
        if (this._hoveredHandleIdx === 2) {
          const dim = this._drawing!.annotations.getBySystem(this.system).get(this._editState.uuid)!;
          const interiorBisectorAngle = OBC.computeBisectorAngle({ ...dim, flipped: false });
          this._editState = {
            kind: "draggingArc",
            uuid: this._editState.uuid,
            originalArcRadius: dim.arcRadius,
            originalFlipped: dim.flipped ?? false,
            interiorBisectorAngle,
          };
          return;
        }
        if (this._hoveredHandleIdx === 0 || this._hoveredHandleIdx === 1) {
          const dim = this._drawing!.annotations.getBySystem(this.system).get(this._editState.uuid)!;
          const which = this._hoveredHandleIdx === 0 ? "pointA" : "pointB";
          const lineDir = new THREE.Vector3().subVectors(dim[which], dim.vertex).normalize();
          const otherDir = new THREE.Vector3().subVectors(
            which === "pointA" ? dim.pointB : dim.pointA, dim.vertex
          ).normalize();
          this._editState = {
            kind: "draggingPoint",
            uuid: this._editState.uuid,
            which,
            original: dim[which].clone(),
            lineDir,
            otherLineDir: otherDir,
            vertex: dim.vertex.clone(),
          };
          return;
        }
        const picked = this.system.pick(ray) ?? this._pickLabelUuid(ray);
        if (picked && picked !== this._editState.uuid) { this._select(picked); return; }
        if (!picked) { this._deselect(); return; }
        return;
      }

      // When idle: pick before placement starts
      if (this.system.machineState.kind === "awaitingFirstLine") {
        const picked = this.system.pick(ray) ?? this._pickLabelUuid(ray);
        if (picked) { this._select(picked); return; }
      }
    }

    if (msg.type === "CLICK") {
      this.system.sendMachineEvent({ ...msg, drawing: this._drawing! });
    } else {
      this.system.sendMachineEvent(msg);
    }
  }

  protected override _onCancel(): void {
    if (this._editState.kind === "draggingPoint") {
      const { uuid, which, original, vertex } = this._editState;
      this.system.update(this._drawing!, [uuid], { [which]: original.clone(), vertex: vertex.clone() });
    } else if (this._editState.kind === "draggingArc") {
      this.system.update(this._drawing!, [this._editState.uuid], {
        arcRadius: this._editState.originalArcRadius,
        flipped: this._editState.originalFlipped,
      });
    }
    this.system.sendMachineEvent({ type: "ESCAPE" });
  }

  // ─── DrawingTool ─────────────────────────────────────────────────────────────

  onDrawingChange(drawing: OBC.TechnicalDrawing | null, fonts: FontManager | null): void {
    this.system.sendMachineEvent({ type: "ESCAPE" });
    this._clearPreviewLabel();
    this._clearAwaitingPreviewLabel();
    this._labelGroups.clear();
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
    this.send({ type: "CLICK", point: cursor.snap?.point ?? cursor.point, line: cursor.snap?.line });
  }

  onPointerMove(e: DrawingPointerEvent): void {
    this._lastCursor = e;

    if (this._editState.kind === "draggingPoint") {
      const { uuid, which } = this._editState;
      this.system.update(this._drawing!, [uuid], { [which]: (e.snap?.point ?? e.point).clone() });
      return;
    }

    if (this._editState.kind === "draggingArc") {
      const dim = this._drawing!.annotations.getBySystem(this.system).get(this._editState.uuid);
      if (dim) {
        const { interiorBisectorAngle } = this._editState;
        const bisectorDir = new THREE.Vector3(Math.cos(interiorBisectorAngle), 0, Math.sin(interiorBisectorAngle));
        const t = e.point.clone().sub(dim.vertex).dot(bisectorDir);
        const flipped = t < 0;
        const arcRadius = Math.max(0.05, Math.abs(t));
        this.system.update(this._drawing!, [this._editState.uuid], { arcRadius, flipped });
      }
      return;
    }

    if (this._editState.kind === "selected") {
      const positions = this._getHandlePositions(this._editState.uuid);
      let idx: number | null = null;
      for (let i = 0; i < positions.length; i++) {
        if (dist2D(e.point, positions[i]) < 0.12) { idx = i; break; }
      }
      this._setHoveredHandle(idx);
    }

    if (this.system.machineState.kind === "positioningArc") {
      this.system.sendMachineEvent({ type: "MOUSE_MOVE", point: e.point });
      this._updatePreviewLabel();
    }

    if (this.system.machineState.kind === "awaitingSecondLine") {
      const snapPoint = e.snap?.point ?? e.point;
      this.system.sendMachineEvent({ type: "MOUSE_MOVE", point: snapPoint, line: e.snap?.line });
      this._updateAwaitingPreviewLabel(snapPoint, e.snap?.line ?? null);
    }
  }

  dispose(): void {
    this.onDrawingChange(null, null);
    this.system.onCommit.remove(this._onCommit);
    this.system.onUpdate.remove(this._onUpdate);
    this.system.onMachineStateChanged.remove(this._onMachineStateChanged);
    this.system.onDelete.remove(this._onDelete);
    this._hitPlaneMat.dispose();
    this._disposeHandles();
    this._disposeSelection();
  }

  // ─── Multi-selection support ──────────────────────────────────────────────────

  protected _systemPick(ray: THREE.Ray): string | null { return this.system.pick(ray); }
  protected _systemDelete(drawing: OBC.TechnicalDrawing, uuids: string[]): void { this.system.delete(drawing, uuids); }
  protected override _onDeselect(): void { this._editState = { kind: "idle" }; }

  // ─── Labels ──────────────────────────────────────────────────────────────────

  private _createLabel(dim: OBC.AngleAnnotation, dimGroup: THREE.Group): void {
    if (!this._fonts) return;

    const old = this._labelGroups.get(dim.uuid);
    if (old) {
      old.removeFromParent();
      (old.children[0] as THREE.Mesh | undefined)?.geometry.dispose();
      this._labelGroups.delete(dim.uuid);
    }
    this._removeExistingLabel(dimGroup);

    const style = this.system.styles.get(dim.style) ?? this.system.styles.get("default")!;
    const angleRad = OBC.computeAngle(dim);
    const text = `${THREE.MathUtils.radToDeg(angleRad).toFixed(1)}°`;

    const mesh = this._fonts.createTextMesh(text, style.fontSize, style.color);
    if (!mesh) return;

    const bbox = new THREE.Box3().setFromObject(mesh);
    const bc = bbox.getCenter(new THREE.Vector3());
    mesh.position.set(-bc.x, 0, -bc.z);

    // Invisible hit plane covering the text bounding box for reliable picking
    const bw = bbox.max.x - bbox.min.x + 0.1;
    const bh = bbox.max.z - bbox.min.z + 0.1;
    const hitGeo = new THREE.PlaneGeometry(bw, bh);
    const hitPlane = new THREE.Mesh(hitGeo, this._hitPlaneMat);
    hitPlane.rotation.x = -Math.PI / 2;
    hitPlane.layers.set(1);
    hitPlane.userData.isHitPlane = true;

    const group = new THREE.Group();
    group.layers.set(1);
    group.userData.isDimension = true;
    group.userData.textString = text;
    group.add(mesh);
    group.add(hitPlane);

    this._positionLabel(dim, group, style);
    this._labelGroups.set(dim.uuid, group);
    dimGroup.add(group);
  }

  private _updateLabel(dim: OBC.AngleAnnotation, dimGroup: THREE.Group): void {
    const style = this.system.styles.get(dim.style) ?? this.system.styles.get("default")!;
    const newText = `${THREE.MathUtils.radToDeg(OBC.computeAngle(dim)).toFixed(1)}°`;

    if (this._labelNeedsRecreation(dim.uuid, newText, style)) {
      this._createLabel(dim, dimGroup);
      return;
    }

    const group = this._labelGroups.get(dim.uuid)!;
    if (group.parent !== dimGroup) dimGroup.add(group);
    this._positionLabel(dim, group, style);
  }

  private _positionLabel(dim: OBC.AngleAnnotation, labelGroup: THREE.Group, style: OBC.AngleAnnotationStyle): void {
    const bisectorAngle = OBC.computeBisectorAngle(dim);
    const labelRadius = dim.arcRadius + style.textOffset;

    labelGroup.position.set(
      dim.vertex.x + Math.cos(bisectorAngle) * labelRadius,
      0.005,
      dim.vertex.z + Math.sin(bisectorAngle) * labelRadius,
    );

    const tangent = new THREE.Vector3(-Math.sin(bisectorAngle), 0, Math.cos(bisectorAngle));
    let textAngle = Math.atan2(-tangent.z, tangent.x);
    while (textAngle > Math.PI / 2) textAngle -= Math.PI;
    while (textAngle < -Math.PI / 2) textAngle += Math.PI;
    labelGroup.rotation.y = textAngle;
  }

  private _updatePreviewLabel(): void {
    if (!this._fonts || !this._drawing) return;
    const s = this.system.machineState;
    if (s.kind !== "positioningArc" || !s.cursor) { this._clearPreviewLabel(); return; }

    const style = this.system.styles.get(this.system.activeStyle) ?? this.system.styles.get("default")!;

    const dA = new THREE.Vector3().subVectors(s.pointA, s.vertex).normalize();
    const dB = new THREE.Vector3().subVectors(s.pointB, s.vertex).normalize();
    const interiorBisectorAngle = Math.atan2(dA.z + dB.z, dA.x + dB.x);
    const bisectorAngle = s.flipped ? interiorBisectorAngle + Math.PI : interiorBisectorAngle;

    const arcRadius = Math.max(0.05, s.cursor.clone().sub(s.vertex).setY(0).length());
    const labelRadius = arcRadius + style.textOffset;

    const interior = Math.acos(THREE.MathUtils.clamp(dA.dot(dB), -1, 1));
    const angleRad = s.flipped ? 2 * Math.PI - interior : interior;
    const text = `${THREE.MathUtils.radToDeg(angleRad).toFixed(1)}°`;

    if (!this._previewLabelGroup || this._previewLabelGroup.userData.textString !== text) {
      this._clearPreviewLabel();
      const mesh = this._fonts.createTextMesh(text, style.fontSize, style.color, 0.5);
      if (!mesh) return;
      const bbox = new THREE.Box3().setFromObject(mesh);
      const bc = bbox.getCenter(new THREE.Vector3());
      mesh.position.set(-bc.x, 0, -bc.z);

      this._previewLabelGroup = new THREE.Group();
      this._previewLabelGroup.layers.set(1);
      this._previewLabelGroup.userData.isDimension = true;
      this._previewLabelGroup.userData.textString = text;
      this._previewLabelGroup.add(mesh);
      this._drawing.three.add(this._previewLabelGroup);
    }

    this._previewLabelGroup.position.set(
      s.vertex.x + Math.cos(bisectorAngle) * labelRadius,
      0.005,
      s.vertex.z + Math.sin(bisectorAngle) * labelRadius,
    );

    const tangent = new THREE.Vector3(-Math.sin(bisectorAngle), 0, Math.cos(bisectorAngle));
    let textAngle = Math.atan2(-tangent.z, tangent.x);
    while (textAngle > Math.PI / 2) textAngle -= Math.PI;
    while (textAngle < -Math.PI / 2) textAngle += Math.PI;
    this._previewLabelGroup.rotation.y = textAngle;
  }

  private _clearPreviewLabel(): void {
    if (!this._previewLabelGroup) return;
    this._previewLabelGroup.removeFromParent();
    (this._previewLabelGroup.children[0] as THREE.Mesh | undefined)?.geometry.dispose();
    this._previewLabelGroup = null;
  }

  private _updateAwaitingPreviewLabel(point: THREE.Vector3, line: THREE.Line3 | null): void {
    if (!this._drawing) { this._clearAwaitingPreviewLabel(); return; }
    if (this.system.machineState.kind !== "awaitingSecondLine") { this._clearAwaitingPreviewLabel(); return; }

    const s = this.system.machineState;
    const line1Dir = new THREE.Vector3().subVectors(s.line1.end, s.line1.start).normalize();

    if (!line) { this._clearAwaitingPreviewLabel(); return; }

    const line2Dir = new THREE.Vector3().subVectors(line.end, line.start).normalize();
    const vertex = _intersectLines2D(s.line1.start, line1Dir, line.start, line2Dir);
    if (!vertex) { this._clearAwaitingPreviewLabel(); return; }

    const toPoint = new THREE.Vector3().subVectors(point, vertex).setY(0);
    if (toPoint.length() < 0.01) { this._clearAwaitingPreviewLabel(); return; }

    const rayA = new THREE.Vector3().subVectors(s.pointA, vertex).normalize();
    const rayB = toPoint.normalize();
    const angleRad = Math.acos(THREE.MathUtils.clamp(rayA.dot(rayB), -1, 1));
    const text = `${THREE.MathUtils.radToDeg(angleRad).toFixed(1)}°`;

    const style = this.system.styles.get(this.system.activeStyle) ?? this.system.styles.get("default")!;
    const arcRadius = Math.max(0.1, Math.min(s.pointA.distanceTo(vertex), point.distanceTo(vertex)) * 0.4);

    const angleA = Math.atan2(rayA.z, rayA.x);
    let delta = Math.atan2(rayB.z, rayB.x) - angleA;
    while (delta > Math.PI) delta -= 2 * Math.PI;
    while (delta < -Math.PI) delta += 2 * Math.PI;
    const bisectorAngle = angleA + delta / 2;
    const labelRadius = arcRadius + style.textOffset;

    if (!this._awaitingPreviewLabel || this._awaitingPreviewLabel.userData.textString !== text) {
      this._clearAwaitingPreviewLabel();
      const mesh = this._fonts!.createTextMesh(text, style.fontSize, style.color, 0.5);
      if (!mesh) return;
      const bbox = new THREE.Box3().setFromObject(mesh);
      const bc = bbox.getCenter(new THREE.Vector3());
      mesh.position.set(-bc.x, 0, -bc.z);

      this._awaitingPreviewLabel = new THREE.Group();
      this._awaitingPreviewLabel.layers.set(1);
      this._awaitingPreviewLabel.userData.isDimension = true;
      this._awaitingPreviewLabel.userData.textString = text;
      this._awaitingPreviewLabel.add(mesh);
      this._drawing.three.add(this._awaitingPreviewLabel);
    }

    this._awaitingPreviewLabel.position.set(
      vertex.x + Math.cos(bisectorAngle) * labelRadius,
      0.005,
      vertex.z + Math.sin(bisectorAngle) * labelRadius,
    );
    const tangent = new THREE.Vector3(-Math.sin(bisectorAngle), 0, Math.cos(bisectorAngle));
    let textAngle = Math.atan2(-tangent.z, tangent.x);
    while (textAngle > Math.PI / 2) textAngle -= Math.PI;
    while (textAngle < -Math.PI / 2) textAngle += Math.PI;
    this._awaitingPreviewLabel.rotation.y = textAngle;
  }

  private _clearAwaitingPreviewLabel(): void {
    if (!this._awaitingPreviewLabel) return;
    this._awaitingPreviewLabel.removeFromParent();
    (this._awaitingPreviewLabel.children[0] as THREE.Mesh | undefined)?.geometry.dispose();
    this._awaitingPreviewLabel = null;
  }

  // ─── Selection & handles ─────────────────────────────────────────────────────

  protected override _onSelect(uuid: string): void {
    this._editState = { kind: "selected", uuid };
  }

  protected _getHandlePositions(uuid: string): THREE.Vector3[] {
    if (!this._drawing) return [];
    const dim = this._drawing.annotations.getBySystem(this.system).get(uuid);
    if (!dim) return [];
    const bisectorAngle = OBC.computeBisectorAngle(dim);
    const arcMid = new THREE.Vector3(
      dim.vertex.x + Math.cos(bisectorAngle) * dim.arcRadius,
      0,
      dim.vertex.z + Math.sin(bisectorAngle) * dim.arcRadius,
    );
    return [dim.pointA.clone(), dim.pointB.clone(), arcMid];
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
