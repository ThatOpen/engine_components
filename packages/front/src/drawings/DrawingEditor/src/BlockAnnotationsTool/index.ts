import * as THREE from "three";
import * as OBC from "@thatopen/components";
import { DrawingTool, dist2D, type DrawingPointerEvent } from "../types";
import type { FontManager } from "../FontManager";

type EditState =
  | { kind: "idle" }
  | { kind: "selected"; uuid: string }
  | { kind: "draggingPosition"; uuid: string; original: THREE.Vector3 }
  | { kind: "draggingRotation"; uuid: string; center: THREE.Vector3; originalRotation: number }
  | { kind: "draggingScale"; uuid: string; center: THREE.Vector3; originalScale: number };

const HANDLE_OFFSET = 0.7;

export class BlockAnnotationsTool extends DrawingTool {
  private _editState: EditState = { kind: "idle" };
  private _lastCursor: DrawingPointerEvent | null = null;

  /** Name of the block definition to place on next click. */
  activeBlock: string | null = null;

  /** Rotation in radians applied to each new placement. */
  activeRotation = 0;

  /** Uniform scale applied to each new placement. */
  activeScale = 1;

  // ─── Per-handle materials ─────────────────────────────────────────────────────

  private readonly _rotateMat = new THREE.MeshBasicMaterial({ color: 0x00cc44, depthTest: false, side: THREE.DoubleSide });
  private readonly _scaleMat  = new THREE.MeshBasicMaterial({ color: 0xff8800, depthTest: false, side: THREE.DoubleSide });
  private readonly _handleNormalMats: THREE.MeshBasicMaterial[] = [];

  // ─── Connector line ───────────────────────────────────────────────────────────

  private _connectorLine: THREE.LineSegments | null = null;
  private readonly _connectorMat = new THREE.LineBasicMaterial({
    color: 0x00cc44,
    depthTest: false,
    transparent: true,
    opacity: 0.5,
  });

  // ─── Feedback label ───────────────────────────────────────────────────────────

  private _feedbackGroup: THREE.Group | null = null;
  private _feedbackText: string | null = null;

  // ─── Preview ──────────────────────────────────────────────────────────────────

  private _previewGroup: THREE.Group | null = null;
  private _previewActiveBlock: string | null = null;

  private readonly _previewLineMat = new THREE.LineBasicMaterial({
    color: 0x0066ff,
    depthTest: false,
    transparent: true,
    opacity: 0.5,
  });

  private readonly _previewMeshMat = new THREE.MeshBasicMaterial({
    color: 0x0066ff,
    transparent: true,
    opacity: 0.25,
    side: THREE.DoubleSide,
  });

  /** The underlying DrawingBlocks system — always available. */
  readonly system: OBC.BlockAnnotations;

  constructor(components: OBC.Components) {
    super(components);
    this.system = this._components.get(OBC.TechnicalDrawings).use(OBC.BlockAnnotations);
    this.system.onUpdate.add(this._onUpdate);
    this.system.onDelete.add(this._onDelete);
  }

  // ─── Bound handlers ──────────────────────────────────────────────────────────

  private readonly _onDelete = (uuids: string[]) => this._handleDelete(uuids);

  private readonly _onUpdate = ({ item }: { item: OBC.BlockInsertion }) => {
    const s = this._editState;
    if (
      (s.kind === "selected" ||
        s.kind === "draggingPosition" ||
        s.kind === "draggingRotation" ||
        s.kind === "draggingScale") &&
      s.uuid === item.uuid
    ) {
      this._clearSelectionState();
      this._applySelectionMaterial(item.uuid);
      this._refreshHandles(item.uuid);
    }
  };

  // ─── Public API ───────────────────────────────────────────────────────────────

  get state(): EditState {
    return this._editState;
  }

  send(_msg: { type: "CLICK"; point: THREE.Vector3 }): void {
    const ray = this._lastCursor?.ray;

    if (
      this._editState.kind === "draggingPosition" ||
      this._editState.kind === "draggingRotation" ||
      this._editState.kind === "draggingScale"
    ) {
      const uuid = this._editState.uuid;
      this._clearFeedback();
      this._editState = { kind: "selected", uuid };
      return;
    }

    if (this._editState.kind === "selected") {
      if (this._hoveredHandleIdx === 0) {
        const ins = this._drawing!.annotations.getBySystem(this.system).get(this._editState.uuid)!;
        this._editState = {
          kind: "draggingPosition",
          uuid: this._editState.uuid,
          original: ins.position.clone(),
        };
        return;
      }
      if (this._hoveredHandleIdx === 1) {
        const ins = this._drawing!.annotations.getBySystem(this.system).get(this._editState.uuid)!;
        this._editState = {
          kind: "draggingRotation",
          uuid: this._editState.uuid,
          center: ins.position.clone(),
          originalRotation: ins.rotation,
        };
        return;
      }
      if (this._hoveredHandleIdx === 2) {
        const ins = this._drawing!.annotations.getBySystem(this.system).get(this._editState.uuid)!;
        this._editState = {
          kind: "draggingScale",
          uuid: this._editState.uuid,
          center: ins.position.clone(),
          originalScale: ins.scale,
        };
        return;
      }
      if (ray) {
        const picked = this.system.pick(ray);
        if (picked && picked !== this._editState.uuid) { this._select(picked); return; }
        if (!picked) { this._deselect(); return; }
      }
      return;
    }

    if (this._editState.kind === "idle") {
      if (ray) {
        const picked = this.system.pick(ray);
        if (picked) { this._select(picked); return; }
      }
      if (this.activeBlock && this._lastCursor && this._drawing) {
        this.system.add(this._drawing, {
          blockName: this.activeBlock,
          position: this._lastCursor.point.clone(),
          rotation: this.activeRotation,
          scale: this.activeScale,
          style: this.system.activeStyle,
        });
      }
    }
  }

  protected override _onCancel(): void {
    if (this._editState.kind === "draggingPosition") {
      this.system.update(this._drawing!, [this._editState.uuid], { position: this._editState.original.clone() });
    } else if (this._editState.kind === "draggingRotation") {
      this.system.update(this._drawing!, [this._editState.uuid], { rotation: this._editState.originalRotation });
    } else if (this._editState.kind === "draggingScale") {
      this.system.update(this._drawing!, [this._editState.uuid], { scale: this._editState.originalScale });
    }
    this._clearFeedback();
    this._clearPreview();
  }

  // ─── DrawingTool ─────────────────────────────────────────────────────────────

  onDrawingChange(drawing: OBC.TechnicalDrawing | null, fonts: FontManager | null): void {
    this._clearPreview();
    this._clearFeedback();
    this._deselect();
    this._clearHandles();
    this._drawing = drawing;
    this._fonts = fonts;
  }

  onActivate(): void {}

  onDeactivate(): void {
    this._clearPreview();
    this.cancel();
  }

  onPointerClick(cursor: DrawingPointerEvent): void {
    this.send({ type: "CLICK", point: cursor.point });
  }

  onPointerMove(e: DrawingPointerEvent): void {
    this._lastCursor = e;

    if (this._editState.kind === "draggingPosition") {
      this.system.update(this._drawing!, [this._editState.uuid], { position: e.point.clone() });
      return;
    }

    if (this._editState.kind === "draggingRotation") {
      const { uuid, center } = this._editState;
      const dx = e.point.x - center.x;
      const dz = e.point.z - center.z;
      if (Math.hypot(dx, dz) > 0.01) {
        const rotation = Math.atan2(-dz, dx);
        this.system.update(this._drawing!, [uuid], { rotation });
        const deg = Math.round(((rotation * 180) / Math.PI + 360) % 360);
        this._updateFeedback(`${deg}°`, e.point);
      }
      return;
    }

    if (this._editState.kind === "draggingScale") {
      const { uuid, center, originalScale } = this._editState;
      const dist = dist2D(e.point, center);
      if (dist > 0.01) {
        const scale = Math.max(0.05, originalScale * (dist / HANDLE_OFFSET));
        this.system.update(this._drawing!, [uuid], { scale });
        this._updateFeedback(`${scale.toFixed(2)}×`, e.point);
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
      return;
    }

    if (this._editState.kind === "idle") {
      this._updatePreview(e.point);
    }
  }

  dispose(): void {
    this.onDrawingChange(null, null);
    this.system.onUpdate.remove(this._onUpdate);
    this.system.onDelete.remove(this._onDelete);
    this._rotateMat.dispose();
    this._scaleMat.dispose();
    this._connectorMat.dispose();
    this._previewLineMat.dispose();
    this._previewMeshMat.dispose();
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
      const ins = this._drawing.annotations.getBySystem(this.system).get(uuid);
      if (ins) this._translateOrigins.set(uuid, ins.position.clone());
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

  // ─── Handle overrides ─────────────────────────────────────────────────────────

  protected _buildHandle(idx: number): THREE.Mesh {
    let mat: THREE.MeshBasicMaterial;
    let geo: THREE.BufferGeometry;

    if (idx === 1) {
      mat = this._rotateMat;
      geo = new THREE.CircleGeometry(0.04, 16);
    } else if (idx === 2) {
      mat = this._scaleMat;
      geo = new THREE.PlaneGeometry(0.08, 0.08);
    } else {
      mat = this._handleMat;
      geo = new THREE.CircleGeometry(DrawingTool.HANDLE_RADIUS, DrawingTool.HANDLE_SEGMENTS);
    }

    this._handleNormalMats.push(mat);
    const handle = new THREE.Mesh(geo, mat);
    handle.rotation.x = -Math.PI / 2;
    handle.layers.set(1);
    handle.renderOrder = 1001;
    handle.frustumCulled = false;
    return handle;
  }

  protected _setHoveredHandle(idx: number | null): void {
    if (this._hoveredHandleIdx === idx) return;
    if (this._hoveredHandleIdx !== null) {
      const prev = this._handleObjects[this._hoveredHandleIdx];
      const mat = this._handleNormalMats[this._hoveredHandleIdx];
      if (prev && mat) prev.material = mat;
    }
    this._hoveredHandleIdx = idx;
    if (idx !== null) {
      const next = this._handleObjects[idx];
      if (next) next.material = this._handleHoverMat;
    }
  }

  protected _createHandles(uuid: string, container: THREE.Object3D): void {
    super._createHandles(uuid, container);
    this._createConnector(uuid, container);
  }

  protected _refreshHandles(uuid: string): void {
    super._refreshHandles(uuid);
    this._updateConnector(uuid);
  }

  protected _clearHandles(): void {
    super._clearHandles();
    this._handleNormalMats.length = 0;
    this._clearConnector();
  }

  protected _getHandlePositions(uuid: string): THREE.Vector3[] {
    if (!this._drawing) return [];
    const ins = this._drawing.annotations.getBySystem(this.system).get(uuid);
    if (!ins) return [];
    const cosR = Math.cos(ins.rotation);
    const sinR = Math.sin(ins.rotation);
    return [
      ins.position.clone(),
      new THREE.Vector3(ins.position.x + cosR * HANDLE_OFFSET, 0, ins.position.z - sinR * HANDLE_OFFSET),
      new THREE.Vector3(ins.position.x + sinR * HANDLE_OFFSET, 0, ins.position.z + cosR * HANDLE_OFFSET),
    ];
  }

  // ─── Connector line ───────────────────────────────────────────────────────────

  private _createConnector(uuid: string, container: THREE.Object3D): void {
    this._clearConnector();
    const positions = this._getHandlePositions(uuid);
    if (positions.length < 2) return;

    const pts = new Float32Array([
      positions[0].x, 0.005, positions[0].z,
      positions[1].x, 0.005, positions[1].z,
    ]);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pts, 3));
    this._connectorLine = new THREE.LineSegments(geo, this._connectorMat);
    this._connectorLine.layers.set(1);
    this._connectorLine.renderOrder = 1000;
    container.add(this._connectorLine);
  }

  private _updateConnector(uuid: string): void {
    if (!this._connectorLine) return;
    const positions = this._getHandlePositions(uuid);
    if (positions.length < 2) return;
    const attr = this._connectorLine.geometry.attributes.position as THREE.BufferAttribute;
    attr.setXYZ(0, positions[0].x, 0.005, positions[0].z);
    attr.setXYZ(1, positions[1].x, 0.005, positions[1].z);
    attr.needsUpdate = true;
  }

  private _clearConnector(): void {
    if (!this._connectorLine) return;
    this._connectorLine.removeFromParent();
    this._connectorLine.geometry.dispose();
    this._connectorLine = null;
  }

  // ─── Feedback label ───────────────────────────────────────────────────────────

  private _updateFeedback(text: string, position: THREE.Vector3): void {
    if (!this._fonts || !this._drawing) return;

    if (text !== this._feedbackText) {
      this._clearFeedback();
      this._feedbackText = text;
      const mesh = this._fonts.createTextMesh(text, 0.22, 0x222222);
      if (!mesh) return;
      const bbox = new THREE.Box3().setFromObject(mesh);
      const bc = bbox.getCenter(new THREE.Vector3());
      mesh.position.set(-bc.x, 0, -bc.z);
      this._feedbackGroup = new THREE.Group();
      this._feedbackGroup.layers.set(1);
      this._feedbackGroup.renderOrder = 1002;
      this._feedbackGroup.add(mesh);
      this._drawing.three.add(this._feedbackGroup);
    }

    if (this._feedbackGroup) {
      this._feedbackGroup.position.set(position.x + 0.18, 0.01, position.z - 0.18);
    }
  }

  private _clearFeedback(): void {
    if (!this._feedbackGroup) return;
    this._feedbackGroup.removeFromParent();
    (this._feedbackGroup.children[0] as THREE.Mesh | undefined)?.geometry.dispose();
    this._feedbackGroup = null;
    this._feedbackText = null;
  }

  // ─── Preview ─────────────────────────────────────────────────────────────────

  private _updatePreview(point: THREE.Vector3): void {
    if (!this._drawing || !this.activeBlock) { this._clearPreview(); return; }

    const def = this.system.definitions.get(this.activeBlock);
    if (!def) { this._clearPreview(); return; }

    if (this.activeBlock !== this._previewActiveBlock) {
      this._clearPreview();
      this._previewActiveBlock = this.activeBlock;
    }

    if (!this._previewGroup) {
      this._previewGroup = new THREE.Group();
      this._previewGroup.layers.set(1);
      if (def.lines) {
        const ls = new THREE.LineSegments(def.lines, this._previewLineMat);
        ls.layers.set(1);
        this._previewGroup.add(ls);
      }
      if (def.mesh) {
        const mesh = new THREE.Mesh(def.mesh, this._previewMeshMat);
        mesh.layers.set(1);
        this._previewGroup.add(mesh);
      }
      this._drawing.three.add(this._previewGroup);
    }

    this._previewGroup.position.set(point.x, 0.002, point.z);
    this._previewGroup.rotation.set(0, this.activeRotation, 0);
    this._previewGroup.scale.setScalar(this.activeScale);
  }

  private _clearPreview(): void {
    if (!this._previewGroup) return;
    // Don't dispose geometry — it's shared with the block definition.
    this._previewGroup.removeFromParent();
    this._previewGroup = null;
    this._previewActiveBlock = null;
  }

  // ─── Selection & handles ─────────────────────────────────────────────────────

  protected override _onSelect(uuid: string): void {
    this._editState = { kind: "selected", uuid };
  }
}

