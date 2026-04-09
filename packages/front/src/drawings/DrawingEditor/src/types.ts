import * as THREE from "three";
import { DataMap } from "@thatopen/components";
import type { Components, TechnicalDrawing } from "@thatopen/components";
import type { FontManager } from "./FontManager";

/**
 * A single placement strategy for a {@link DrawingTool}.
 * Receives a typed context on every click and decides which message(s) to send
 * to the underlying annotation state machine.
 */
export interface PlacementMode<TCtx> {
  onClick(ctx: TCtx): void;
}

export interface SnapResult {
  /** Snapped drawing-local point. */
  point: THREE.Vector3;
  /** Snap kind — "none" means the raw hit point with no vertex/midpoint snap. */
  kind: "start" | "end" | "center" | "none";
  /** The geometry line that was hit. Required by LinearAnnotations / AngleAnnotations machines. */
  line: THREE.Line3;
}

/**
 * A processed pointer event in drawing local space.
 * Produced internally by {@link DrawingEditor} on mousemove and forwarded to the active tool.
 */
export interface DrawingPointerEvent {
  /** Drawing-local position — snapped if a snap candidate was found. */
  point: THREE.Vector3;
  /** Snap result, or null if no geometry was under the cursor. */
  snap: SnapResult | null;
  /** World-space ray — needed for pick() / pickHandle() calls. */
  ray: THREE.Ray;
}

/**
 * Alias exposed on {@link DrawingEditor.cursor} — same shape as {@link DrawingPointerEvent}.
 */
export type DrawingCursor = DrawingPointerEvent;

/**
 * Base class for all drawing tools.
 *
 * Provides built-in selection tracking: stores original materials, applies a
 * highlight on selection, and restores them on deselect or geometry rebuild.
 * Subclasses call `_applySelection(group)`, `_restoreSelection()`, and
 * `_disposeSelection()` — they do not manage the underlying material state directly.
 *
 * Lifecycle:
 * - **Label subscription** (`attachToDrawing` / `detachFromDrawing`): always active.
 * - **Pointer routing** (`onActivate` / `onDeactivate` / `onPointerMove`): only the active tool.
 */
export abstract class DrawingTool<TCtx = unknown> {
  protected readonly _components: Components;

  constructor(components: Components) {
    this._components = components;
  }

  /** Named placement strategies for this tool. Keyed by mode name. */
  readonly modes = new DataMap<string, PlacementMode<TCtx>>();

  /** Key of the currently active placement mode. Defaults to `"default"`. */
  activeMode = "default";

  /** Register a named placement mode. */
  registerMode(key: string, mode: PlacementMode<TCtx>): void {
    this.modes.set(key, mode);
  }

  /** Switch the active placement mode. No-op if the key is not registered. */
  setMode(key: string): void {
    if (!this.modes.has(key)) return;
    this.activeMode = key;
  }

  protected readonly _selectionLineMat = new THREE.LineBasicMaterial({ color: 0xffaa00, depthTest: false });
  protected readonly _selectionMeshMat = new THREE.MeshBasicMaterial({ color: 0xffaa00, depthTest: false, side: THREE.DoubleSide });

  private _selectedGroup: THREE.Group | null = null;

  // ─── Selection state ──────────────────────────────────────────────────────

  protected _selectedUuid: string | null = null;

  /** UUID of the currently selected annotation, or null if none is selected. */
  get selectedUuid(): string | null { return this._selectedUuid; }

  /** True when the cursor is hovering over a handle of the selected annotation. */
  get isHandleHovered(): boolean { return this._hoveredHandleIdx !== null; }

  // ─── Lifecycle ────────────────────────────────────────────────────────────

  /**
   * Called by {@link DrawingEditor} whenever the active drawing changes.
   * Tools should re-subscribe to drawing-specific state (labels, existing
   * annotations) and store `drawing` / `fonts` for later use.
   * Passing `null` for both signals that no drawing is currently active.
   */
  onDrawingChange(_drawing: TechnicalDrawing | null, _fonts: FontManager | null): void {}

  /** Called when this tool becomes the active pointer tool. */
  abstract onActivate(): void;
  /**
   * Called when this tool is no longer the active pointer tool.
   * Must restore any in-progress drag/placement to a clean state.
   */
  abstract onDeactivate(): void;

  /** Called every mousemove on the active source — used for live drag feedback. */
  abstract onPointerMove(e: DrawingPointerEvent): void;

  abstract dispose(): void;

  /**
   * Returns true when no placement or edit drag is in progress.
   * Override in subclasses to also check tool-specific edit state.
   */
  get isIdle(): boolean { return true; }

  /**
   * Cancels any in-progress placement or drag, then deselects.
   * Override `_onCancel` in subclasses for tool-specific revert logic.
   */
  cancel(): void {
    this._onCancel();
    this._deselect();
  }

  /** Called by `cancel()` before deselecting. Override to revert in-progress drags and clear previews. */
  protected _onCancel(): void {}

  /**
   * Selects the annotation with the given uuid without going through placement.
   * Used by {@link DrawingEditor} in null-mode pick. No-op by default; override in
   * tools that support single selection.
   */
  select(uuid: string): void { this._select(uuid); }

  deselect(): void { this._deselect(); }

  /**
   * Called by {@link DrawingEditor.step} — the primary click action at the
   * current cursor position. No-op by default; override to handle placement.
   */
  onPointerClick(_e: DrawingPointerEvent): void {}

  /**
   * Delete the currently selected annotation (if any).
   * No-op by default; override in tools that support selection.
   */
  delete(): void {
    if (!this._drawing || !this._selectedUuid) return;
    this._systemDelete(this._drawing, [this._selectedUuid]);
  }

  // ─── Selection helpers (protected) ───────────────────────────────────────

  /**
   * Traverses `group`, saves each object's original material in `userData._selOrigMat`,
   * and applies the selection highlight. Hit planes are skipped.
   * Call from the tool's select/reselect logic.
   */
  protected _applySelection(group: THREE.Group): void {
    this._selectedGroup = group;
    group.traverse((child) => {
      if (child.userData.isHitPlane) return;
      if (child instanceof THREE.LineSegments || child instanceof THREE.Mesh) {
        child.userData._selOrigMat = child.material;
        child.userData._selOrigRenderOrder = child.renderOrder;
        child.material = child instanceof THREE.LineSegments
          ? this._selectionLineMat
          : this._selectionMeshMat;
        child.renderOrder = 500;
      }
    });
  }

  /**
   * Restores all original materials saved by `_applySelection` and clears tracking.
   * Call from deselect logic.
   */
  protected _restoreSelection(): void {
    if (!this._selectedGroup) return;
    this._selectedGroup.traverse((child) => {
      if (child.userData._selOrigMat) {
        (child as any).material = child.userData._selOrigMat;
        child.renderOrder = child.userData._selOrigRenderOrder ?? 0;
        delete child.userData._selOrigMat;
        delete child.userData._selOrigRenderOrder;
      }
    });
    this._selectedGroup = null;
  }

  /**
   * Clears selection tracking state without restoring materials.
   * Use in `_onUpdate` before reapplying selection so that materials already
   * updated by a system redraw are preserved as the new "original" state.
   */
  protected _clearSelectionState(): void {
    if (!this._selectedGroup) return;
    this._selectedGroup.traverse((child) => {
      delete child.userData._selOrigMat;
      delete child.userData._selOrigRenderOrder;
    });
    this._selectedGroup = null;
  }

  /** Disposes selection and multi-highlight materials. Call from the tool's `dispose()`. */
  protected _disposeSelection(): void {
    this._selectionLineMat.dispose();
    this._selectionMeshMat.dispose();
    for (const uuid of [...this._multiHighlighted.keys()]) this._restoreMultiHighlight(uuid);
    this._multiHighlightLineMat.dispose();
    this._multiHighlightMeshMat.dispose();
  }

  // ─── Label helpers (protected) ────────────────────────────────────────────

  /**
   * Returns `true` when the label for `uuid` must be recreated — i.e. when the
   * text content, color, or font size has changed since the last render.
   * Call at the top of each tool's `_updateLabel` before deciding to recreate
   * or just reposition.
   */
  protected _labelNeedsRecreation(
    uuid: string,
    newText: string,
    style: { color: number; fontSize: number },
  ): boolean {
    const group = this._labelGroups.get(uuid);
    if (!group) return true;
    return (
      group.userData.textString !== newText ||
      group.userData.color      !== style.color ||
      group.userData.fontSize   !== style.fontSize
    );
  }

  /**
   * Raycasts against label hit planes in `_labelGroups`.
   * Returns the uuid of the closest hit, or null if none.
   */
  protected _pickLabelUuid(ray: THREE.Ray): string | null {
    const raycaster = new THREE.Raycaster();
    raycaster.ray.copy(ray);
    let closest: string | null = null;
    let closestDist = Infinity;
    for (const [uuid, group] of this._labelGroups) {
      group.updateWorldMatrix(true, true);
      group.traverse((child) => {
        if (!(child instanceof THREE.Mesh) || !child.userData.isHitPlane) return;
        const hits: THREE.Intersection[] = [];
        child.raycast(raycaster, hits);
        if (hits.length > 0 && hits[0].distance < closestDist) {
          closestDist = hits[0].distance;
          closest = uuid;
        }
      });
    }
    return closest;
  }

  /**
   * Removes any tool-created label group (THREE.Group with userData.isDimension)
   * from `container` and disposes its text geometry.
   * Call from `_createLabel` before adding a new label to avoid duplicates.
   */
  protected _removeExistingLabel(container: THREE.Object3D): void {
    for (let i = container.children.length - 1; i >= 0; i--) {
      const c = container.children[i];
      if (c instanceof THREE.Group && c.userData.isDimension) {
        container.remove(c);
        (c.children[0] as THREE.Mesh | undefined)?.geometry.dispose();
      }
    }
  }

  // ─── Handle helpers (protected) ───────────────────────────────────────────

  protected static readonly HANDLE_RADIUS = 0.055;
  protected static readonly HANDLE_SEGMENTS = 16;

  protected readonly _handleMat = new THREE.MeshBasicMaterial({ color: 0x0099ff, depthTest: false, side: THREE.DoubleSide });
  protected readonly _handleHoverMat = new THREE.MeshBasicMaterial({ color: 0xff6600, depthTest: false, side: THREE.DoubleSide });
  protected readonly _handleObjects: THREE.Mesh[] = [];
  protected _hoveredHandleIdx: number | null = null;

  /**
   * Returns the drawing-local positions for this tool's handles for the given uuid.
   * Override in subclasses that support selection handles.
   */
  protected _getHandlePositions(_uuid: string): THREE.Vector3[] { return []; }

  /**
   * Creates a single handle mesh for the given index.
   * Override in subclasses to return custom geometry or material per handle.
   * The default implementation creates a blue filled circle.
   */
  protected _buildHandle(_idx: number): THREE.Mesh {
    const geo = new THREE.CircleGeometry(DrawingTool.HANDLE_RADIUS, DrawingTool.HANDLE_SEGMENTS);
    const handle = new THREE.Mesh(geo, this._handleMat);
    handle.rotation.x = -Math.PI / 2;
    handle.layers.set(1);
    handle.renderOrder = 1001;
    handle.frustumCulled = false;
    return handle;
  }

  /**
   * Creates one handle per position returned by `_getHandlePositions`
   * and adds them to `container`. Shape and material come from `_buildHandle`.
   */
  protected _createHandles(uuid: string, container: THREE.Object3D): void {
    this._clearHandles();
    const positions = this._getHandlePositions(uuid);
    for (let i = 0; i < positions.length; i++) {
      const handle = this._buildHandle(i);
      handle.position.copy(positions[i]);
      handle.position.y = 0.01;
      this._handleObjects.push(handle);
      container.add(handle);
    }
  }

  /** Updates handle positions in-place after the underlying annotation changes. */
  protected _refreshHandles(uuid: string): void {
    const positions = this._getHandlePositions(uuid);
    for (let i = 0; i < Math.min(this._handleObjects.length, positions.length); i++) {
      this._handleObjects[i].position.copy(positions[i]);
      this._handleObjects[i].position.y = 0.01;
    }
  }

  /** Removes all handle meshes from the scene and clears tracking. */
  protected _clearHandles(): void {
    this._hoveredHandleIdx = null;
    for (const h of this._handleObjects) {
      h.removeFromParent();
      h.geometry.dispose();
    }
    this._handleObjects.length = 0;
  }

  /** Swaps handle material to highlight the hovered one. */
  protected _setHoveredHandle(idx: number | null): void {
    if (this._hoveredHandleIdx === idx) return;
    if (this._hoveredHandleIdx !== null) {
      const prev = this._handleObjects[this._hoveredHandleIdx];
      if (prev) prev.material = this._handleMat;
    }
    this._hoveredHandleIdx = idx;
    if (idx !== null) {
      const next = this._handleObjects[idx];
      if (next) next.material = this._handleHoverMat;
    }
  }

  /** Clears handles and disposes handle materials. Call from the tool's `dispose()`. */
  protected _disposeHandles(): void {
    this._clearHandles();
    this._handleMat.dispose();
    this._handleHoverMat.dispose();
  }

  // ─── Shared fields ────────────────────────────────────────────────────────────

  /** Active drawing this tool is attached to, or null if none. */
  protected _drawing: TechnicalDrawing | null = null;

  /** Font manager for text label rendering, or null if none. */
  protected _fonts: FontManager | null = null;

  /** Tracks label groups by annotation uuid for cleanup and picking. */
  protected readonly _labelGroups = new Map<string, THREE.Group>();

  // ─── Abstract hooks (implemented per-tool) ────────────────────────────────────

  /** Returns the uuid of the annotation under `ray` using the tool's system. Implement as `return this.system.pick(ray)`. */
  protected abstract _systemPick(ray: THREE.Ray): string | null;

  /** Deletes the given uuids from the tool's system. Implement as `this.system.delete(drawing, uuids)`. */
  protected abstract _systemDelete(drawing: TechnicalDrawing, uuids: string[]): void;

  // ─── Concrete shared methods ──────────────────────────────────────────────────

  /**
   * Selects the annotation with the given uuid.
   * Cancels any in-progress placement, applies the selection highlight,
   * creates handles, then calls `_onSelect` so the tool can set its edit state.
   */
  protected _select(uuid: string): void {
    this.cancel();
    this._selectedUuid = uuid;
    this._applySelectionMaterial(uuid);
    if (this._drawing) this._createHandles(uuid, this._drawing.three);
    this._onSelect(uuid);
  }

  /** Called by `_select()`. Override to set tool-specific edit state. */
  protected _onSelect(_uuid: string): void {}

  /** Applies the selection highlight to the annotation group for the given uuid. */
  protected _applySelectionMaterial(uuid: string): void {
    if (!this._drawing) return;
    const group = this._drawing.annotations.get(uuid)?.three as THREE.Group | undefined;
    if (!group) return;
    this._applySelection(group);
  }

  /** Resets pick-state to idle. Override `_onDeselect` to also reset edit state. */
  protected _deselect(): void {
    this._selectedUuid = null;
    this._restoreSelection();
    this._hoveredHandleIdx = null;
    this._clearHandles();
    this._onDeselect();
  }

  /** Called by `_deselect()`. Override to reset tool-specific edit state. */
  protected _onDeselect(): void {}

  /**
   * Handles annotation deletion: disposes label geometry, removes from
   * `_labelGroups`, and deselects if the deleted uuid was selected.
   * Pass as the callback to `system.onDelete`.
   */
  protected _handleDelete(uuids: string[]): void {
    for (const uuid of uuids) {
      const label = this._labelGroups.get(uuid);
      if (label) {
        label.removeFromParent();
        (label.children[0] as THREE.Mesh | undefined)?.geometry.dispose();
        this._labelGroups.delete(uuid);
      }
      if (this._selectedUuid === uuid) this._deselect();
    }
  }

  // ─── Multi-selection (virtual, no-op by default) ──────────────────────────────

  /**
   * When true, this tool supports free-form translation via
   * `translateStart` / `translateUpdate` / `translateEnd` / `translateCancel`.
   * LinearAnnotations and AngleAnnotations leave this false because they
   * reference specific geometry lines and cannot be freely repositioned.
   */
  readonly translatable: boolean = false;

  /** Returns the uuid of the annotation under the given ray, or null if none. */
  pick(ray: THREE.Ray): string | null {
    return this._systemPick(ray) ?? this._pickLabelUuid(ray);
  }

  /** Applies multi-selection highlight colour (0x44aaff) to the given uuids. */
  highlightItems(uuids: string[]): void {
    if (!this._drawing) return;
    for (const uuid of uuids) {
      const group = this._drawing.annotations.get(uuid)?.three as THREE.Group | undefined;
      if (group) this._applyMultiHighlight(uuid, group);
    }
  }

  unhighlightItems(uuids: string[]): void {
    for (const uuid of uuids) this._restoreMultiHighlight(uuid);
  }

  deleteItems(uuids: string[]): void {
    if (this._drawing) this._systemDelete(this._drawing, uuids);
  }

  /**
   * Begins a group translation drag.
   * `uuids` — the items to move. `origin` — drawing-local grab point.
   */
  translateStart(_uuids: string[], _origin: THREE.Vector3): void {}

  /** Updates the group translation drag. `point` is the current drawing-local cursor. */
  translateUpdate(_point: THREE.Vector3): void {}

  /** Commits the current group translation. */
  translateEnd(): void {}

  /** Cancels the current group translation and restores original positions. */
  translateCancel(): void {}

  // ─── Multi-highlight helpers (protected) ─────────────────────────────────────

  protected readonly _multiHighlightLineMat = new THREE.LineBasicMaterial({ color: 0x44aaff, depthTest: false });
  protected readonly _multiHighlightMeshMat = new THREE.MeshBasicMaterial({ color: 0x44aaff, depthTest: false, side: THREE.DoubleSide });

  private readonly _multiHighlighted = new Map<string, THREE.Group>();

  /** Applies multi-highlight to the given group, saving original materials in userData. */
  protected _applyMultiHighlight(uuid: string, group: THREE.Group): void {
    if (this._multiHighlighted.has(uuid)) this._restoreMultiHighlight(uuid);
    group.traverse((child) => {
      if (child.userData.isHitPlane) return;
      if (child instanceof THREE.LineSegments || child instanceof THREE.Mesh) {
        child.userData._mhOrigMat = child.material;
        child.userData._mhOrigRenderOrder = child.renderOrder;
        child.material = child instanceof THREE.LineSegments
          ? this._multiHighlightLineMat
          : this._multiHighlightMeshMat;
        child.renderOrder = 500;
      }
    });
    this._multiHighlighted.set(uuid, group);
  }

  /** Restores original materials for a specific multi-highlighted uuid. */
  protected _restoreMultiHighlight(uuid: string): void {
    const group = this._multiHighlighted.get(uuid);
    if (!group) return;
    group.traverse((child) => {
      if (child.userData._mhOrigMat) {
        (child as any).material = child.userData._mhOrigMat;
        child.renderOrder = child.userData._mhOrigRenderOrder ?? 0;
        delete child.userData._mhOrigMat;
        delete child.userData._mhOrigRenderOrder;
      }
    });
    this._multiHighlighted.delete(uuid);
  }

  /**
   * Re-applies multi-highlight to `group` if `uuid` is currently multi-highlighted.
   * Call from `_onUpdate` handlers in tools whose systems reset materials on redraw.
   */
  protected _reapplyMultiHighlight(uuid: string, group: THREE.Group): void {
    if (!this._multiHighlighted.has(uuid)) return;
    this._restoreMultiHighlight(uuid);
    this._applyMultiHighlight(uuid, group);
  }
}

/** 2-D distance between two Vector3s on the XZ plane (ignores Y). */
export function dist2D(a: THREE.Vector3, b: THREE.Vector3): number {
  return Math.hypot(a.x - b.x, a.z - b.z);
}
