import * as THREE from "three";
import * as OBC from "@thatopen/components";
import { DrawingTool, dist2D, type DrawingPointerEvent } from "../types";
import type { FontManager } from "../FontManager";

type EditState =
  | { kind: "idle" }
  | { kind: "selected"; uuid: string }
  | { kind: "draggingCenter"; uuid: string; dragStart: THREE.Vector3; originalCenter: THREE.Vector3; originalElbow: THREE.Vector3; originalExtensionEnd: THREE.Vector3 }
  | { kind: "draggingCorner"; uuid: string; originalCenter: THREE.Vector3; originalHalfW: number; originalHalfH: number }
  | { kind: "draggingElbow"; uuid: string; original: THREE.Vector3; originalExtensionEnd: THREE.Vector3 }
  | { kind: "draggingExtensionEnd"; uuid: string; lineOrigin: THREE.Vector3; originalExtensionEnd: THREE.Vector3 };

export class CalloutAnnotationsTool extends DrawingTool {
  private _editState: EditState = { kind: "idle" };
  private _lastCursor: DrawingPointerEvent | null = null;
  // Set when the user clicks the text handle to distinguish edit from new-annotation flow.
  private _textEditUuid: string | null = null;

  /** The underlying CalloutAnnotations system — always available. */
  readonly system: OBC.CalloutAnnotations;

  /**
   * Fired when the state machine pauses for text entry — either for a new
   * annotation (`isEdit: false`) or when the text handle of a selected
   * annotation is clicked (`isEdit: true`). The consumer should display an
   * input and call {@link submitText} with the result.
   */
  readonly onEnterText = new OBC.Event<{ isEdit: boolean; currentText: string }>();

  constructor(components: OBC.Components) {
    super(components);
    this.system = this._components.get(OBC.TechnicalDrawings).use(OBC.CalloutAnnotations);
    this.system.onCommit.add(this._onCommit);
    this.system.onUpdate.add(this._onUpdate);
    this.system.onMachineStateChanged.add(this._onMachineStateChanged);
    this.system.onDelete.add(this._onDelete);
  }

  // ─── Bound handlers ──────────────────────────────────────────────────────────

  private readonly _onDelete = (uuids: string[]) => this._handleDelete(uuids);

  private readonly _onCommit = ([{ item, group }]: { drawing: OBC.TechnicalDrawing; item: OBC.CalloutAnnotation; group: THREE.Group }[]) => {
    this._createLabel(item, group);
  };

  private readonly _onUpdate = ({ item, group }: { item: OBC.CalloutAnnotation; group: THREE.Group }) => {
    this._updateLabel(item, group);
    const s = this._editState;
    if (
      (s.kind === "selected" || s.kind === "draggingCenter" || s.kind === "draggingCorner" ||
        s.kind === "draggingElbow" || s.kind === "draggingExtensionEnd") &&
      s.uuid === item.uuid
    ) {
      this._clearSelectionState();
      this._applySelectionMaterial(item.uuid);
      this._refreshHandles(item.uuid);
    }
    this._reapplyMultiHighlight(item.uuid, group);
  };

  private readonly _onMachineStateChanged = (state: OBC.CalloutAnnotationState) => {
    if (state.kind === "enteringText") {
      // New annotation flow: consumer supplies text and calls submitText().
      this._textEditUuid = null;
      this.onEnterText.trigger({ isEdit: false, currentText: "" });
    }
  };

  // ─── Public API ───────────────────────────────────────────────────────────────

  get state() {
    return this.system.machineState;
  }

  override get isIdle(): boolean {
    return this._editState.kind === "idle" && this.state.kind === "awaitingCenter";
  }

  /**
   * Submit text for the current text-entry operation.
   * Call this after receiving an {@link onEnterText} event.
   * - If `isEdit` was true: updates the existing annotation's text.
   * - If `isEdit` was false: advances the state machine to commit the new annotation.
   */
  submitText(text: string): void {
    const trimmed = text.trim() || "Label";
    if (this._textEditUuid !== null) {
      this.system.update(this._drawing!, [this._textEditUuid], { text: trimmed });
      this._textEditUuid = null;
    } else {
      this.system.sendMachineEvent({ type: "SUBMIT_TEXT", text: trimmed });
    }
  }

  send(msg: Parameters<OBC.CalloutAnnotations["sendMachineEvent"]>[0]): void {
    const ray = this._lastCursor?.ray;

    if (msg.type === "CLICK") {
      if (!ray) { this.system.sendMachineEvent({ ...msg, drawing: this._drawing! }); return; }

      // Commit any active drag on click — do not propagate the click further.
      if (
        this._editState.kind === "draggingCenter" ||
        this._editState.kind === "draggingCorner" ||
        this._editState.kind === "draggingElbow" ||
        this._editState.kind === "draggingExtensionEnd"
      ) {
        this._editState = { kind: "selected", uuid: this._editState.uuid };
        return;
      }

      // Selection / handle interaction only when the system is idle (awaitingCenter).
      if (this.system.machineState.kind === "awaitingCenter") {
        if (this._editState.kind === "selected") {
          const point = (msg as { point: THREE.Vector3 }).point;

          if (this._hoveredHandleIdx === 0) {
            // Center handle → translate whole annotation.
            const ann = this._drawing!.annotations.getBySystem(this.system).get(this._editState.uuid)!;
            this._editState = {
              kind: "draggingCenter",
              uuid: this._editState.uuid,
              dragStart: point.clone(),
              originalCenter: ann.center.clone(),
              originalElbow: ann.elbow.clone(),
              originalExtensionEnd: ann.extensionEnd.clone(),
            };
            return;
          }

          if (this._hoveredHandleIdx === 1) {
            // Corner handle (SE) → resize enclosure by dragging to new half-extents.
            const ann = this._drawing!.annotations.getBySystem(this.system).get(this._editState.uuid)!;
            this._editState = {
              kind: "draggingCorner",
              uuid: this._editState.uuid,
              originalCenter: ann.center.clone(),
              originalHalfW: ann.halfW,
              originalHalfH: ann.halfH,
            };
            return;
          }

          if (this._hoveredHandleIdx === 2) {
            // Elbow handle → move elbow + preserve extensionEnd offset.
            const ann = this._drawing!.annotations.getBySystem(this.system).get(this._editState.uuid)!;
            this._editState = {
              kind: "draggingElbow",
              uuid: this._editState.uuid,
              original: ann.elbow.clone(),
              originalExtensionEnd: ann.extensionEnd.clone(),
            };
            return;
          }

          if (this._hoveredHandleIdx === 3) {
            // Extension-end handle → move extensionEnd, snapped to cardinal directions.
            const ann = this._drawing!.annotations.getBySystem(this.system).get(this._editState.uuid)!;
            this._editState = {
              kind: "draggingExtensionEnd",
              uuid: this._editState.uuid,
              lineOrigin: ann.elbow.clone(),
              originalExtensionEnd: ann.extensionEnd.clone(),
            };
            return;
          }

          if (this._hoveredHandleIdx === 4) {
            // Text label handle → edit existing text.
            const uuid = this._editState.uuid;
            const ann = this._drawing!.annotations.getBySystem(this.system).get(uuid);
            if (ann) {
              this._textEditUuid = uuid;
              this.onEnterText.trigger({ isEdit: true, currentText: ann.text });
            }
            return;
          }

          // Click on empty space while selected: pick another annotation or deselect.
          // Use base-class pick() so labels (hit planes) are included alongside geometry.
          const picked = this.pick(ray);
          if (picked && picked !== this._editState.uuid) { this._select(picked); return; }
          if (!picked) { this._deselect(); return; }
          return;
        }

        // Nothing selected — pick existing annotation or fall through to start placement.
        const picked = this.pick(ray);
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
    if (this._editState.kind === "draggingCenter") {
      const { uuid, originalCenter, originalElbow, originalExtensionEnd } = this._editState;
      this.system.update(this._drawing!, [uuid], {
        center: originalCenter.clone(),
        elbow: originalElbow.clone(),
        extensionEnd: originalExtensionEnd.clone(),
      });
    } else if (this._editState.kind === "draggingCorner") {
      const { uuid, originalHalfW, originalHalfH } = this._editState;
      this.system.update(this._drawing!, [uuid], { halfW: originalHalfW, halfH: originalHalfH });
    } else if (this._editState.kind === "draggingElbow") {
      const { uuid, original, originalExtensionEnd } = this._editState;
      this.system.update(this._drawing!, [uuid], {
        elbow: original.clone(),
        extensionEnd: originalExtensionEnd.clone(),
      });
    } else if (this._editState.kind === "draggingExtensionEnd") {
      const { uuid, originalExtensionEnd } = this._editState;
      this.system.update(this._drawing!, [uuid], { extensionEnd: originalExtensionEnd.clone() });
    }
    this._textEditUuid = null;
    this.system.sendMachineEvent({ type: "ESCAPE" });
  }

  // ─── DrawingTool ─────────────────────────────────────────────────────────────

  onDrawingChange(drawing: OBC.TechnicalDrawing | null, fonts: FontManager | null): void {
    this.system.sendMachineEvent({ type: "ESCAPE" });
    this._labelGroups.clear();
    this._deselect();
    this._clearHandles();
    this._drawing = drawing;
    this._fonts = fonts;
    if (drawing) {
      for (const [uuid, ann] of drawing.annotations.getBySystem(this.system)) {
        const group = drawing.annotations.get(uuid)?.three as THREE.Group | undefined;
        if (group) this._createLabel(ann, group);
      }
    }
  }

  onActivate(): void {}

  onDeactivate(): void {
    this.cancel();
  }

  onPointerClick(cursor: DrawingPointerEvent): void {
    this.send({ type: "CLICK", point: cursor.snap?.point ?? cursor.point });
  }

  onPointerMove(e: DrawingPointerEvent): void {
    this._lastCursor = e;

    if (this._editState.kind === "draggingCenter") {
      const { uuid, dragStart, originalCenter, originalElbow, originalExtensionEnd } = this._editState;
      const delta = new THREE.Vector3().subVectors(e.point, dragStart);
      this.system.update(this._drawing!, [uuid], {
        center: originalCenter.clone().add(delta),
        elbow: originalElbow.clone().add(delta),
        extensionEnd: originalExtensionEnd.clone().add(delta),
      });
      return;
    }

    if (this._editState.kind === "draggingCorner") {
      const { uuid, originalCenter } = this._editState;
      const newHalfW = Math.max(0.1, Math.abs(e.point.x - originalCenter.x));
      const newHalfH = Math.max(0.1, Math.abs(e.point.z - originalCenter.z));
      this.system.update(this._drawing!, [uuid], { halfW: newHalfW, halfH: newHalfH });
      return;
    }

    if (this._editState.kind === "draggingElbow") {
      const delta = e.point.clone().sub(this._editState.original);
      this.system.update(this._drawing!, [this._editState.uuid], {
        elbow: e.point.clone(),
        extensionEnd: this._editState.originalExtensionEnd.clone().add(delta),
      });
      return;
    }

    if (this._editState.kind === "draggingExtensionEnd") {
      const { lineOrigin } = this._editState;
      this.system.update(this._drawing!, [this._editState.uuid], {
        extensionEnd: _snapToCardinal(lineOrigin, e.point),
      });
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

    this.system.sendMachineEvent({ type: "MOUSE_MOVE", point: e.point });
  }

  dispose(): void {
    this.onDrawingChange(null, null);
    this.system.onCommit.remove(this._onCommit);
    this.system.onUpdate.remove(this._onUpdate);
    this.system.onMachineStateChanged.remove(this._onMachineStateChanged);
    this.system.onDelete.remove(this._onDelete);
    this._disposeHandles();
    this._disposeSelection();
    this.onEnterText.reset();
  }

  // ─── Multi-selection ──────────────────────────────────────────────────────────

  override readonly translatable = true;

  protected _systemPick(ray: THREE.Ray): string | null { return this.system.pick(ray); }
  protected _systemDelete(drawing: OBC.TechnicalDrawing, uuids: string[]): void { this.system.delete(drawing, uuids); }

  protected override _onDeselect(): void {
    this._editState = { kind: "idle" };
    this._textEditUuid = null;
  }

  private _translateUuids: string[] = [];
  private readonly _translateOrigins = new Map<string, {
    center: THREE.Vector3; elbow: THREE.Vector3; extensionEnd: THREE.Vector3;
  }>();
  private _translateDragStart: THREE.Vector3 | null = null;

  translateStart(uuids: string[], origin: THREE.Vector3): void {
    if (!this._drawing) return;
    this._translateUuids = uuids;
    this._translateDragStart = origin.clone();
    this._translateOrigins.clear();
    for (const uuid of uuids) {
      const ann = this._drawing.annotations.getBySystem(this.system).get(uuid);
      if (ann) {
        this._translateOrigins.set(uuid, {
          center: ann.center.clone(),
          elbow: ann.elbow.clone(),
          extensionEnd: ann.extensionEnd.clone(),
        });
      }
    }
  }

  translateUpdate(point: THREE.Vector3): void {
    if (!this._translateDragStart || !this._drawing) return;
    const delta = new THREE.Vector3().subVectors(point, this._translateDragStart);
    for (const uuid of this._translateUuids) {
      const orig = this._translateOrigins.get(uuid);
      if (!orig) continue;
      this.system.update(this._drawing, [uuid], {
        center: orig.center.clone().add(delta),
        elbow: orig.elbow.clone().add(delta),
        extensionEnd: orig.extensionEnd.clone().add(delta),
      });
    }
  }

  translateEnd(): void {
    this._translateUuids = [];
    this._translateOrigins.clear();
    this._translateDragStart = null;
  }

  translateCancel(): void {
    if (this._translateDragStart && this._drawing) {
      for (const uuid of this._translateUuids) {
        const orig = this._translateOrigins.get(uuid);
        if (orig) {
          this.system.update(this._drawing, [uuid], {
            center: orig.center.clone(),
            elbow: orig.elbow.clone(),
            extensionEnd: orig.extensionEnd.clone(),
          });
        }
      }
    }
    this.translateEnd();
  }

  // ─── Labels ──────────────────────────────────────────────────────────────────

  private _createLabel(ann: OBC.CalloutAnnotation, annGroup: THREE.Group): void {
    if (!this._fonts) return;

    const old = this._labelGroups.get(ann.uuid);
    if (old) {
      old.removeFromParent();
      old.traverse((c) => { if ((c as THREE.Mesh).geometry) (c as THREE.Mesh).geometry.dispose(); });
      this._labelGroups.delete(ann.uuid);
    }
    this._removeExistingLabel(annGroup);

    const style = this.system.styles.get(ann.style) ?? this.system.styles.get("default")!;
    const mesh = this._fonts.createTextMesh(ann.text, style.fontSize, style.color);
    if (!mesh) return;

    const extDir = new THREE.Vector3().subVectors(ann.extensionEnd, ann.elbow).setY(0).normalize();
    const bbox = new THREE.Box3().setFromObject(mesh);
    const bc = bbox.getCenter(new THREE.Vector3());

    const anchorPos = _textAnchor(extDir, bbox, bc);
    mesh.position.set(anchorPos.x, 0, anchorPos.z);

    // Invisible hit plane sized to the text bbox so _pickLabelUuid() can detect clicks
    // on the text area — without it, clicks over the label offset region miss all geometry.
    const hitW = (bbox.max.x - bbox.min.x) + 0.1;
    const hitH = (bbox.max.z - bbox.min.z) + 0.1;
    const hitGeo = new THREE.PlaneGeometry(hitW, hitH);
    const hitPlane = new THREE.Mesh(hitGeo, new THREE.MeshBasicMaterial({ visible: false, side: THREE.DoubleSide }));
    hitPlane.rotation.x = -Math.PI / 2;
    hitPlane.position.set(anchorPos.x + bc.x, 0, anchorPos.z + bc.z);
    hitPlane.userData.isHitPlane = true;
    hitPlane.layers.set(1);

    const group = new THREE.Group();
    group.layers.set(1);
    group.userData.isDimension = true;
    group.userData.textString = ann.text;
    group.userData.bboxMinX = bbox.min.x;
    group.userData.bboxMaxX = bbox.max.x;
    group.userData.bboxMinZ = bbox.min.z;
    group.userData.bboxMaxZ = bbox.max.z;
    group.userData.bboxCenterX = bc.x;
    group.userData.bboxCenterZ = bc.z;
    group.add(mesh);
    group.add(hitPlane);

    group.position.copy(ann.extensionEnd).addScaledVector(extDir, style.textOffset);
    group.position.y += 0.005;

    this._labelGroups.set(ann.uuid, group);
    annGroup.add(group);
  }

  private _updateLabel(ann: OBC.CalloutAnnotation, annGroup: THREE.Group): void {
    const style = this.system.styles.get(ann.style) ?? this.system.styles.get("default")!;

    if (this._labelNeedsRecreation(ann.uuid, ann.text, style)) {
      this._createLabel(ann, annGroup);
      return;
    }

    const group = this._labelGroups.get(ann.uuid)!;
    const extDir = new THREE.Vector3().subVectors(ann.extensionEnd, ann.elbow).setY(0).normalize();
    const mesh = group.children[0] as THREE.Mesh;
    const { bboxMinX, bboxMaxX, bboxMinZ, bboxMaxZ, bboxCenterX, bboxCenterZ } = group.userData;
    const fakeBbox = { min: { x: bboxMinX, z: bboxMinZ }, max: { x: bboxMaxX, z: bboxMaxZ } };
    const fakeCenter = { x: bboxCenterX, z: bboxCenterZ };
    const anchorPos = _textAnchor(extDir, fakeBbox as any, fakeCenter as any);
    mesh.position.set(anchorPos.x, 0, anchorPos.z);

    if (group.parent !== annGroup) annGroup.add(group);
    group.position.copy(ann.extensionEnd).addScaledVector(extDir, style.textOffset);
    group.position.y += 0.005;
  }

  // ─── Selection & handles ─────────────────────────────────────────────────────

  protected override _onSelect(uuid: string): void {
    this._editState = { kind: "selected", uuid };
  }

  protected _getHandlePositions(uuid: string): THREE.Vector3[] {
    if (!this._drawing) return [];
    const ann = this._drawing.annotations.getBySystem(this.system).get(uuid);
    if (!ann) return [];
    const positions: THREE.Vector3[] = [
      ann.center.clone(),
      // SE corner of the enclosure bounding box — dragging it reshapes halfW and halfH.
      new THREE.Vector3(ann.center.x + ann.halfW, 0, ann.center.z + ann.halfH),
      ann.elbow.clone(),
      ann.extensionEnd.clone(),
    ];
    const labelGroup = this._labelGroups.get(uuid);
    if (labelGroup) {
      const extDir = new THREE.Vector3().subVectors(ann.extensionEnd, ann.elbow).setY(0).normalize();
      const perp = new THREE.Vector3(-extDir.z, 0, extDir.x);
      positions.push(labelGroup.position.clone().setY(0).addScaledVector(perp, 0.35));
    }
    return positions;
  }
}

// ─── Module helpers ───────────────────────────────────────────────────────────

function _snapToCardinal(origin: THREE.Vector3, cursor: THREE.Vector3): THREE.Vector3 {
  const dx = cursor.x - origin.x;
  const dz = cursor.z - origin.z;
  const len = Math.sqrt(dx * dx + dz * dz);
  if (len === 0) return origin.clone();
  const angle = Math.atan2(dz, dx);
  const snapped = Math.round(angle / (Math.PI / 4)) * (Math.PI / 4);
  return new THREE.Vector3(
    origin.x + Math.cos(snapped) * len,
    0,
    origin.z + Math.sin(snapped) * len,
  );
}

function _textAnchor(
  extDir: THREE.Vector3,
  bbox: { min: { x: number; z: number }; max: { x: number; z: number } },
  bc: { x: number; z: number },
): { x: number; z: number } {
  if (Math.abs(extDir.x) >= Math.abs(extDir.z)) {
    return extDir.x >= 0
      ? { x: -bbox.min.x, z: -bc.z }
      : { x: -bbox.max.x, z: -bc.z };
  }
  return extDir.z >= 0
    ? { x: -bc.x, z: -bbox.min.z }
    : { x: -bc.x, z: -bbox.max.z };
}
