import * as THREE from "three";
import * as OBC from "@thatopen/components";
import { DrawingTool, dist2D, type DrawingPointerEvent } from "../types";
import type { FontManager } from "../FontManager";

type EditState =
  | { kind: "idle" }
  | { kind: "selected"; uuid: string }
  | { kind: "dragging"; uuid: string; originalPosition: THREE.Vector3; dragStart: THREE.Vector3 };

interface SlopePreview {
  position: THREE.Vector3;
  direction: THREE.Vector3;
  slope: number;
}

/** Subset of OBC.SimpleRaycaster that we need. */
type OBCRaycaster = { castRay(): Promise<THREE.Intersection | null> };

export class SlopeAnnotationsTool extends DrawingTool {
  private _editState: EditState = { kind: "idle" };
  private _lastCursor: DrawingPointerEvent | null = null;

  // ─── OBC raycaster (fragment-aware, async) ────────────────────────────────────

  private _obcRaycaster: OBCRaycaster | null = null;
  private _onNeedsRender: (() => void) | null = null;
  private _castPending = false;
  private _castQueued = false;
  private _deactivated = false;

  // ─── Labels ───────────────────────────────────────────────────────────────────

  private readonly _hitPlaneMat = new THREE.MeshBasicMaterial({
    transparent: true,
    opacity: 0,
    side: THREE.DoubleSide,
    depthTest: false,
  });

  // ─── Preview ──────────────────────────────────────────────────────────────────

  private _lastPreview: SlopePreview | null = null;
  private _previewGroup: THREE.Group | null = null;
  private _previewLabelGroup: THREE.Group | null = null;

  private readonly _previewLineMat = new THREE.LineBasicMaterial({
    color: 0xff6666,
    depthTest: false,
    transparent: true,
    opacity: 0.6,
  });

  /** The underlying SlopeAnnotations system — always available. */
  readonly system: OBC.SlopeAnnotations;

  constructor(components: OBC.Components) {
    super(components);
    this.system = this._components.get(OBC.TechnicalDrawings).use(OBC.SlopeAnnotations);
    this.system.onCommit.add(this._onCommit);
    this.system.onUpdate.add(this._onUpdate);
    this.system.onDelete.add(this._onDelete);
  }

  // ─── Bound handlers ──────────────────────────────────────────────────────────

  private readonly _onDelete = (uuids: string[]) => this._handleDelete(uuids);

  private readonly _onCommit = (entries: { drawing: OBC.TechnicalDrawing; item: OBC.SlopeAnnotation; group: THREE.Group }[]) => {
    for (const { item, group } of entries) this._createLabel(item, group);
  };

  private readonly _onUpdate = ({
    item,
    group,
  }: {
    item: OBC.SlopeAnnotation;
    group: THREE.Group;
  }) => {
    this._updateLabel(item, group);
    const s = this._editState;
    if ((s.kind === "selected" || s.kind === "dragging") && s.uuid === item.uuid) {
      this._clearSelectionState();
      this._applySelectionMaterial(item.uuid);
      this._refreshHandles(item.uuid);
    }
    this._reapplyMultiHighlight(item.uuid, group);
  };

  // ─── Public API ───────────────────────────────────────────────────────────────

  get state(): EditState {
    return this._editState;
  }

  /**
   * Registers the world for slope placement raycasting.
   *
   * ```ts
   * slopeTool.addWorld(world, components, () => renderViewports());
   * ```
   */
  addWorld(
    world: OBC.World,
    components: OBC.Components,
    onNeedsRender: () => void,
  ): void {
    this._obcRaycaster = components.get(OBC.Raycasters).get(world);
    this._onNeedsRender = onNeedsRender;
  }

  send(_msg: { type: "CLICK"; point: THREE.Vector3 }): void {
    const ray = this._lastCursor?.ray;

    if (this._editState.kind === "dragging") {
      this._editState = { kind: "selected", uuid: this._editState.uuid };
      return;
    }

    if (this._editState.kind === "selected") {
      if (this._hoveredHandleIdx === 0) {
        const ann = this._drawing!.annotations.getBySystem(this.system).get(this._editState.uuid)!;
        this._editState = {
          kind: "dragging",
          uuid: this._editState.uuid,
          originalPosition: ann.position.clone(),
          dragStart: (this._lastCursor?.point ?? ann.position).clone(),
        };
        return;
      }
      if (ray) {
        const picked = this.system.pick(ray) ?? this._pickLabelUuid(ray);
        if (picked && picked !== this._editState.uuid) {
          this._select(picked);
          return;
        }
        if (!picked) {
          this._deselect();
          return;
        }
      }
      return;
    }

    if (this._editState.kind === "idle") {
      if (ray) {
        const picked = this.system.pick(ray) ?? this._pickLabelUuid(ray);
        if (picked) {
          this._select(picked);
          return;
        }
      }
      if (this._lastPreview && this._drawing) {
        const { position, direction, slope } = this._lastPreview;
        this.system.add(this._drawing, {
          position: position.clone(),
          direction: direction.clone(),
          slope,
          style: this.system.activeStyle,
        });
        this._clearSlopePreview();
      }
    }
  }

  protected override _onCancel(): void {
    if (this._editState.kind === "dragging") {
      const { uuid, originalPosition } = this._editState;
      this.system.update(this._drawing!, [uuid], { position: originalPosition.clone() });
    }
    this._clearSlopePreview();
  }

  // ─── DrawingTool ─────────────────────────────────────────────────────────────

  onDrawingChange(drawing: OBC.TechnicalDrawing | null, fonts: FontManager | null): void {
    this._clearSlopePreview();
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

  onActivate(): void {
    this._deactivated = false;
  }

  onDeactivate(): void {
    this._deactivated = true;
    this._clearSlopePreview();
    this.cancel();
  }

  onPointerClick(cursor: DrawingPointerEvent): void {
    this.send({ type: "CLICK", point: cursor.point });
  }

  onPointerMove(e: DrawingPointerEvent): void {
    this._lastCursor = e;

    if (this._editState.kind === "dragging") {
      const { uuid, originalPosition, dragStart } = this._editState;
      const delta = new THREE.Vector3().subVectors(e.point, dragStart);
      this.system.update(this._drawing!, [uuid], { position: originalPosition.clone().add(delta) });
      return;
    }

    if (this._editState.kind === "selected") {
      const positions = this._getHandlePositions(this._editState.uuid);
      let idx: number | null = null;
      for (let i = 0; i < positions.length; i++) {
        if (dist2D(e.point, positions[i]) < 0.12) {
          idx = i;
          break;
        }
      }
      this._setHoveredHandle(idx);
      return;
    }

    if (this._editState.kind === "idle" && this._obcRaycaster) {
      if (!this._castPending) {
        this._triggerCast();
      } else {
        this._castQueued = true;
      }
    }
  }

  dispose(): void {
    this._deactivated = true;
    this.onDrawingChange(null, null);
    this.system.onCommit.remove(this._onCommit);
    this.system.onUpdate.remove(this._onUpdate);
    this.system.onDelete.remove(this._onDelete);
    this._hitPlaneMat.dispose();
    this._previewLineMat.dispose();
    this._disposeHandles();
    this._disposeSelection();
  }

  // ─── Multi-selection support ──────────────────────────────────────────────────

  override readonly translatable = true;

  protected _systemPick(ray: THREE.Ray): string | null { return this.system.pick(ray); }
  protected _systemDelete(drawing: OBC.TechnicalDrawing, uuids: string[]): void { this.system.delete(drawing, uuids); }
  protected override _onDeselect(): void { this._editState = { kind: "idle" }; }

  private _translateUuids: string[] = [];
  private readonly _translateOrigins = new Map<string, THREE.Vector3>();
  private _translateDragStart: THREE.Vector3 | null = null;

  translateStart(uuids: string[], origin: THREE.Vector3): void {
    if (!this._drawing) return;
    this._translateUuids = uuids;
    this._translateDragStart = origin.clone();
    this._translateOrigins.clear();
    for (const uuid of uuids) {
      const ann = this._drawing.annotations.getBySystem(this.system).get(uuid);
      if (ann) this._translateOrigins.set(uuid, ann.position.clone());
    }
  }

  translateUpdate(point: THREE.Vector3): void {
    if (!this._translateDragStart || !this._drawing) return;
    const delta = new THREE.Vector3().subVectors(point, this._translateDragStart);
    for (const uuid of this._translateUuids) {
      const orig = this._translateOrigins.get(uuid);
      if (orig) this.system.update(this._drawing, [uuid], { position: orig.clone().add(delta) });
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
        if (orig) this.system.update(this._drawing, [uuid], { position: orig.clone() });
      }
    }
    this.translateEnd();
  }

  // ─── Async slope preview ──────────────────────────────────────────────────────

  private _triggerCast(): void {
    if (!this._obcRaycaster) return;
    this._castPending = true;
    this._castQueued = false;

    this._obcRaycaster
      .castRay()
      .then((hit) => {
        if (this._deactivated || this._editState.kind !== "idle") return;
        this._updateSlopePreview(hit);
        this._onNeedsRender?.();
      })
      .catch(() => {
        /* ignore raycast errors */
      })
      .finally(() => {
        this._castPending = false;
        if (this._castQueued && !this._deactivated && this._editState.kind === "idle") {
          this._triggerCast();
        }
      });
  }

  private _updateSlopePreview(hit: THREE.Intersection | null): void {
    if (!hit || !this._drawing || !this._fonts) {
      this._clearSlopePreview();
      return;
    }

    const raw = (hit as any).normal ?? hit.face?.normal;
    if (!raw) { this._clearSlopePreview(); return; }

    const obj = hit.object;
    let transform = obj.matrixWorld.clone();
    if (obj instanceof THREE.InstancedMesh && hit.instanceId !== undefined) {
      const m = new THREE.Matrix4();
      obj.getMatrixAt(hit.instanceId, m);
      transform = m.multiply(transform);
    }
    const worldNormal = (raw as THREE.Vector3)
      .clone()
      .applyMatrix3(new THREE.Matrix3().getNormalMatrix(transform))
      .normalize();

    const run = Math.sqrt(worldNormal.x ** 2 + worldNormal.z ** 2);
    if (run < 1e-6) { this._clearSlopePreview(); return; }

    const slope = run / Math.max(Math.abs(worldNormal.y), 1e-6);
    const direction = new THREE.Vector3(worldNormal.x, 0, worldNormal.z).normalize();
    const position = this._drawing.three.worldToLocal(hit.point.clone());
    position.y = 0;

    this._lastPreview = { position, direction, slope };

    const style = this.system.styles.get(this.system.activeStyle) ?? this.system.styles.get("default")!;

    const dummyAnn: OBC.SlopeAnnotation = {
      uuid: "",
      position,
      direction,
      slope,
      style: this.system.activeStyle,
    };
    const positions = OBC.buildSlopePositions(dummyAnn, style);

    if (!this._previewGroup) {
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      const ls = new THREE.LineSegments(geo, this._previewLineMat);
      ls.layers.set(1);
      ls.renderOrder = 1;
      this._previewGroup = new THREE.Group();
      this._previewGroup.layers.set(1);
      this._previewGroup.add(ls);
      this._drawing.three.add(this._previewGroup);
    } else {
      const ls = this._previewGroup.children[0] as THREE.LineSegments;
      ls.geometry.dispose();
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      ls.geometry = geo;
    }

    const text = OBC.formatSlope(slope, style.format);
    if (!this._previewLabelGroup || this._previewLabelGroup.userData.textString !== text) {
      this._clearPreviewLabel();
      const mesh = this._fonts.createTextMesh(text, style.fontSize, style.color, 0.5);
      if (mesh) {
        const bbox = new THREE.Box3().setFromObject(mesh);
        const bc = bbox.getCenter(new THREE.Vector3());
        mesh.position.set(-bc.x, 0, -bc.z);
        this._previewLabelGroup = new THREE.Group();
        this._previewLabelGroup.layers.set(1);
        this._previewLabelGroup.userData.textString = text;
        this._previewLabelGroup.add(mesh);
        this._drawing.three.add(this._previewLabelGroup);
      }
    }

    if (this._previewLabelGroup) {
      this._positionLabel(dummyAnn, this._previewLabelGroup, style);
    }
  }

  private _clearSlopePreview(): void {
    this._lastPreview = null;
    if (this._previewGroup) {
      this._previewGroup.removeFromParent();
      (this._previewGroup.children[0] as THREE.LineSegments | undefined)?.geometry.dispose();
      this._previewGroup = null;
    }
    this._clearPreviewLabel();
  }

  private _clearPreviewLabel(): void {
    if (!this._previewLabelGroup) return;
    this._previewLabelGroup.removeFromParent();
    (this._previewLabelGroup.children[0] as THREE.Mesh | undefined)?.geometry.dispose();
    this._previewLabelGroup = null;
  }

  // ─── Labels ──────────────────────────────────────────────────────────────────

  private _createLabel(ann: OBC.SlopeAnnotation, annGroup: THREE.Group): void {
    if (!this._fonts) return;

    const old = this._labelGroups.get(ann.uuid);
    if (old) {
      old.removeFromParent();
      (old.children[0] as THREE.Mesh | undefined)?.geometry.dispose();
      this._labelGroups.delete(ann.uuid);
    }
    this._removeExistingLabel(annGroup);

    const style = this.system.styles.get(ann.style) ?? this.system.styles.get("default")!;
    const text = OBC.formatSlope(ann.slope, style.format);

    const mesh = this._fonts.createTextMesh(text, style.fontSize, style.color);
    if (!mesh) return;

    const bbox = new THREE.Box3().setFromObject(mesh);
    const bc = bbox.getCenter(new THREE.Vector3());
    mesh.position.set(-bc.x, 0, -bc.z);

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

    this._positionLabel(ann, group, style);
    this._labelGroups.set(ann.uuid, group);
    annGroup.add(group);
  }

  private _updateLabel(ann: OBC.SlopeAnnotation, annGroup: THREE.Group): void {
    const style = this.system.styles.get(ann.style) ?? this.system.styles.get("default")!;
    const newText = OBC.formatSlope(ann.slope, style.format);

    if (this._labelNeedsRecreation(ann.uuid, newText, style)) {
      this._createLabel(ann, annGroup);
      return;
    }

    const group = this._labelGroups.get(ann.uuid)!;
    if (group.parent !== annGroup) annGroup.add(group);
    this._positionLabel(ann, group, style);
  }

  private _positionLabel(
    ann: OBC.SlopeAnnotation,
    labelGroup: THREE.Group,
    style: OBC.SlopeAnnotationStyle,
  ): void {
    const textMesh = labelGroup.children[0] as THREE.Object3D | undefined;
    if (!textMesh) return;
    const bbox = new THREE.Box3().setFromObject(textMesh);
    const halfTextHeight = (bbox.max.z - bbox.min.z) / 2;

    const mid = new THREE.Vector3(
      ann.position.x + ann.direction.x * style.length * 0.5,
      0,
      ann.position.z + ann.direction.z * style.length * 0.5,
    );
    const perp = new THREE.Vector3(-ann.direction.z, 0, ann.direction.x);

    labelGroup.position
      .copy(mid)
      .addScaledVector(perp, style.textOffset + halfTextHeight);
    labelGroup.position.y = 0.005;
    labelGroup.rotation.y = Math.atan2(-ann.direction.z, ann.direction.x);
  }

  // ─── Selection & handles ─────────────────────────────────────────────────────

  protected override _onSelect(uuid: string): void {
    this._editState = { kind: "selected", uuid };
  }

  protected _getHandlePositions(uuid: string): THREE.Vector3[] {
    if (!this._drawing) return [];
    const ann = this._drawing.annotations.getBySystem(this.system).get(uuid);
    if (!ann) return [];
    const style = this.system.styles.get(ann.style) ?? this.system.styles.get("default")!;
    const center = new THREE.Vector3(
      ann.position.x + ann.direction.x * style.length * 0.5,
      0,
      ann.position.z + ann.direction.z * style.length * 0.5,
    );
    return [center];
  }
}

