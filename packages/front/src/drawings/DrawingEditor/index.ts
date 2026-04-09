import * as THREE from "three";
import * as OBC from "@thatopen/components";
import { DrawingTool, DrawingPointerEvent, DrawingCursor, SnapResult } from "./src/types";
import { FontManager } from "./src/FontManager";

export * from "./src";

type ToolConstructor = new (components: OBC.Components) => DrawingTool;

interface SourceEntry {
  canvas: HTMLElement;
  camera: THREE.Camera;
  viewport: OBC.DrawingViewport | null;
}

const SNAP_THRESHOLD_PX = 15;

/** Front component that centralises all interaction for {@link OBC.TechnicalDrawing}. */
export class DrawingEditor extends OBC.Component {
  static readonly uuid = "b3e5c7a9-1f2d-4e8b-9c0a-5d7f3b1e2c4a" as const;

  enabled = true;

  /** Manages font loading and text mesh creation for all built-in tools. */
  readonly fonts = new FontManager();

  /** Last known drawing-local cursor state, updated on every mousemove on the active source. */
  cursor: DrawingCursor = {
    point: new THREE.Vector3(),
    snap: null,
    ray: new THREE.Ray(),
  };

  readonly onDrawingMouseMove = new OBC.Event<DrawingPointerEvent>();

  /** Fires when {@link activeDrawing} is set to a new drawing. */
  readonly onActiveDrawingChange = new OBC.Event<OBC.TechnicalDrawing | null>();

  /** Fires whenever the multi-selection set changes (item added, removed, or cleared). */
  readonly onMultiSelectionChange = new OBC.Event<void>();

  /** Fires with the name of the property that changed (`"activeDrawing"` or `"activeTool"`). */
  readonly onStateChanged = new OBC.Event<("activeDrawing" | "activeTool")[]>();

  // ─── Private state ───────────────────────────────────────────────────────────

  private _drawing: OBC.TechnicalDrawing | null = null;
  private _activeTool: DrawingTool | null = null;
  private _activeToolClass: ToolConstructor | null = null;

  /** Tool singleton instances keyed by tool class constructor. */
  private readonly _toolInstances = new Map<ToolConstructor, DrawingTool>();

  /** The currently active interaction source, if any. */
  private _activeSource: SourceEntry | null = null;

  // Null-mode selection — the tool that owns the currently selected annotation.
  private _nullModeTool: DrawingTool | null = null;

  // Multi-selection state
  private readonly _multiSel = new Map<DrawingTool, Set<string>>();
  private _multiDragOrigin: THREE.Vector3 | null = null;

  private readonly _raycaster = new THREE.Raycaster();
  private readonly _drawingPlane = new THREE.Plane();

  // Snap visual
  private _snapMarker: THREE.LineLoop | null = null;
  private _snapMarkerMat: THREE.LineBasicMaterial | null = null;

  // Hover highlight visual
  private _hoverHighlight: THREE.Line | null = null;
  private _hoverHighlightMat: THREE.LineBasicMaterial | null = null;

  // Bound event handlers
  private readonly _onMouseMove = (e: MouseEvent) => {
    if (!this._drawing || !this._activeSource) return;
    const pointerEvent = this._computePointerEvent(e, this._activeSource, this._activeSource.canvas);
    if (!pointerEvent) return;
    this.cursor = pointerEvent;
    if (this._activeTool) {
      this._updateSnapMarker(pointerEvent.snap);
      this._activeTool.onPointerMove(pointerEvent);
    } else {
      if (this._snapMarker) this._snapMarker.visible = false;
      if (this._hoverHighlight) this._hoverHighlight.visible = false;
      this._nullModeTool?.onPointerMove(pointerEvent);
    }
    this.onDrawingMouseMove.trigger(pointerEvent);
  };

  private readonly _onMouseLeave = () => { this.clearHover(); };

  /**
   * Responsibilities:
   * - **Coordinate pipeline** — converts mousemove to drawing-local space + snap internally.
   * - **Tool routing** — forwards pointer move and click events to the active {@link DrawingTool}.
   * - **Labels** — creates and positions text meshes for all built-in systems.
   * - **Snap / hover visuals** — snap marker and hover highlight managed internally.
   *
   * ```ts
   * const editor = components.get(DrawingEditor);
   * await editor.fonts.load("https://thatopen.github.io/engine_components/resources/fonts/PlusJakartaSans-Medium.ttf");
   *
   * editor.activeDrawing = drawing;
   * editor.setSource(world);
   *
   * editor.activeTool = LinearAnnotationsTool;
   * const dimTool = editor.use(LinearAnnotationsTool);
   *
   * canvas.addEventListener("click", () => editor.step());
   * document.addEventListener("keydown", (e) => { if (e.key === "Escape") editor.cancel(); });
   * ```
   */
  constructor(components: OBC.Components) {
    super(components);
    components.add(DrawingEditor.uuid, this);
  }

  // ─── Public API ──────────────────────────────────────────────────────────────

  /** The currently active drawing, or null if none has been set. */
  get activeDrawing(): OBC.TechnicalDrawing | null { return this._drawing; }

  /**
   * Sets the active drawing and notifies all known tools via {@link DrawingTool.onDrawingChange}.
   * The active tool is deactivated first (cancelling any in-progress placement), then
   * all tools receive the new drawing, and the active tool is reactivated.
   *
   * ```ts
   * editor.activeDrawing = drawing;
   * ```
   */
  set activeDrawing(drawing: OBC.TechnicalDrawing | null) {
    this._multiSel.clear();
    this._multiDragOrigin = null;

    // Deactivate active tool before switching drawing (cancels in-progress placement).
    this._activeTool?.onDeactivate();
    this._activeTool = null;
    this._removeVisuals();

    this._nullModeTool = null;
    this._drawing = drawing;

    if (drawing) {
      this._createVisuals();
    }

    // Notify all tool singletons of the new drawing.
    for (const tool of this._toolInstances.values()) {
      tool.onDrawingChange(drawing, drawing ? this.fonts : null);
    }

    if (drawing && this._activeToolClass) {
      const tool = this._createOrGetTool(this._activeToolClass);
      tool.onActivate();
      this._activeTool = tool;
    }

    this.onActiveDrawingChange.trigger(drawing);
    this.onStateChanged.trigger(["activeDrawing"]);
  }

  /**
   * Registers an interaction source for the editor.
   *
   * - Pass an {@link OBC.World} to use the world renderer's canvas (3D source).
   *   The previous world source, if any, is automatically removed first.
   * - Pass an `HTMLElement` + a {@link OBC.DrawingViewport} to register a
   *   paper-space viewport element as a source.
   *
   * ```ts
   * editor.setSource(world);                    // 3D canvas
   * editor.setSource(vpEl, drawing.viewports.get(id)); // paper-space
   * ```
   */
  setSource(source: OBC.World | HTMLElement, viewport?: OBC.DrawingViewport): void {
    if (this._activeSource) this.clearSource(this._activeSource.canvas);

    let canvas: HTMLElement;

    if (source instanceof HTMLElement) {
      canvas = source;
      this._activeSource = { canvas, camera: viewport!.camera, viewport: viewport ?? null };
    } else {
      canvas = (source.renderer as any).three.domElement as HTMLElement;
      this._activeSource = { canvas, camera: (source.camera as any).three as THREE.Camera, viewport: null };
    }
    canvas.addEventListener("mousemove", this._onMouseMove);
    canvas.addEventListener("mouseleave", this._onMouseLeave);
  }

  /**
   * Removes a previously registered source element, stopping all mouse
   * tracking on it. Call this when leaving paper-space edit mode.
   */
  clearSource(canvas: HTMLElement): void {
    if (this._activeSource?.canvas !== canvas) return;
    canvas.removeEventListener("mousemove", this._onMouseMove);
    canvas.removeEventListener("mouseleave", this._onMouseLeave);
    this._activeSource = null;
  }

  /**
   * Sets the active pointer tool by tool class.
   * Pass `null` to deactivate all tools.
   *
   * ```ts
   * editor.activeTool = LinearAnnotationsTool;
   * ```
   */
  set activeTool(ToolClass: ToolConstructor | null) {
    this._activeTool?.onDeactivate();
    this._activeTool = null;
    this._activeToolClass = ToolClass;

    this.onStateChanged.trigger(["activeTool"]);

    if (!ToolClass || !this._drawing) return;

    const tool = this._createOrGetTool(ToolClass);
    tool.onActivate();
    this._activeTool = tool;
  }

  /**
   * Returns the singleton tool instance for the given class, creating it if needed.
   * Mirrors the `TechnicalDrawings.use()` pattern.
   *
   * ```ts
   * const dimTool = editor.use(LinearAnnotationsTool);
   * dimTool.system.styles.set("thick", { ... });
   * ```
   */
  use<T extends DrawingTool>(ToolClass: new (...args: any[]) => T): T {
    return this._createOrGetTool(ToolClass) as T;
  }

  /**
   * Returns the system instance for the active drawing.
   * Use this for system-level operations (styles, list, clear, update, events).
   *
   * ```ts
   * const dims = editor.system(OBC.LinearAnnotations);
   * dims.styles.set("bold", { ... });
   * ```
   */
  system<T extends OBC.AnnotationSystem<any>>(
    SystemClass: new (components: OBC.Components) => T,
  ): T {
    return this.components.get(OBC.TechnicalDrawings).use(SystemClass);
  }

  /**
   * Triggers the primary click action on the active tool at the current cursor position.
   * Replaces per-tool click wiring in the consumer:
   *
   * ```ts
   * canvas.addEventListener("click", () => editor.step());
   * ```
   */
  step(): void {
    if (this._activeTool) {
      this._activeTool.onPointerClick(this.cursor);
    } else {
      this._nullModeClick();
    }
  }

  /**
   * Cancels any in-progress operation on the active tool and restores original state.
   */
  cancel(): void {
    if (this._activeTool) {
      this._activeTool.cancel?.();
    } else if (this._nullModeTool) {
      this._nullModeTool.cancel();
      if (this._nullModeTool.selectedUuid === null) this._nullModeTool = null;
    }
  }

  /**
   * Deletes the currently selected annotation on the active tool, if any.
   */
  delete(): void {
    if (this._activeTool) {
      this._activeTool.delete();
    } else if (this._nullModeTool) {
      this._nullModeTool.delete();
      this._nullModeTool = null;
    }
  }

  /** Hides snap marker and hover highlight. */
  clearHover(): void {
    if (this._snapMarker) this._snapMarker.visible = false;
    if (this._hoverHighlight) this._hoverHighlight.visible = false;
  }

  // ─── Multi-selection API ──────────────────────────────────────────────────────

  /** Total number of items currently multi-selected across all tools. */
  get multiSelCount(): number {
    let n = 0;
    for (const s of this._multiSel.values()) n += s.size;
    return n;
  }

  /** True when all selected tools support free translation (and at least one item is selected). */
  get isMultiTranslatable(): boolean {
    if (this._multiSel.size === 0) return false;
    for (const tool of this._multiSel.keys()) {
      if (!tool.translatable) return false;
    }
    return true;
  }

  /** True when a multi-drag is currently in progress. */
  get isMultiDragging(): boolean { return this._multiDragOrigin !== null; }

  /**
   * Attempts to pick any annotation from registered tools at the given ray.
   * Returns the first match `{ tool, uuid }`, or null if nothing is hit.
   */
  pickAny(ray: THREE.Ray): { tool: DrawingTool; uuid: string } | null {
    for (const tool of this._toolInstances.values()) {
      const uuid = tool.pick(ray);
      if (uuid) return { tool, uuid };
    }
    return null;
  }

  /**
   * Adds or removes an item from the multi-selection.
   * Only translatable tools can be added — non-translatable hits are silently ignored.
   */
  toggleMultiSelect(tool: DrawingTool, uuid: string): void {
    const set = this._multiSel.get(tool);
    if (set?.has(uuid)) {
      set.delete(uuid);
      tool.unhighlightItems([uuid]);
      if (set.size === 0) this._multiSel.delete(tool);
      this.onMultiSelectionChange.trigger();
    } else if (tool.translatable) {
      const s = set ?? new Set<string>();
      if (!set) this._multiSel.set(tool, s);
      s.add(uuid);
      tool.highlightItems([uuid]);
      this.onMultiSelectionChange.trigger();
    }
  }

  /** Removes all items from the multi-selection and restores their original materials. */
  clearMultiSelect(): void {
    for (const [tool, uuids] of this._multiSel) tool.unhighlightItems([...uuids]);
    this._multiSel.clear();
    this._multiDragOrigin = null;
    this.onMultiSelectionChange.trigger();
  }

  /** Deletes all multi-selected items from their respective systems. */
  deleteMultiSelected(): void {
    for (const [tool, uuids] of this._multiSel) tool.deleteItems([...uuids]);
    this._multiSel.clear();
    this._multiDragOrigin = null;
    this.onMultiSelectionChange.trigger();
  }

  /** Starts a group translation drag. `origin` — drawing-local point where the drag started. */
  beginMultiDrag(origin: THREE.Vector3): void {
    if (!this.isMultiTranslatable) return;
    this._multiDragOrigin = origin.clone();
    for (const [tool, uuids] of this._multiSel) tool.translateStart([...uuids], origin);
  }

  /** Updates the group translation drag. `point` is the current drawing-local cursor position. */
  updateMultiDrag(point: THREE.Vector3): void {
    if (!this._multiDragOrigin) return;
    for (const tool of this._multiSel.keys()) tool.translateUpdate(point);
  }

  /** Commits the current group translation. */
  endMultiDrag(): void {
    if (!this._multiDragOrigin) return;
    this._multiDragOrigin = null;
    for (const tool of this._multiSel.keys()) tool.translateEnd();
  }

  /** Cancels the current group translation and restores original positions. */
  cancelMultiDrag(): void {
    if (!this._multiDragOrigin) return;
    this._multiDragOrigin = null;
    for (const tool of this._multiSel.keys()) tool.translateCancel();
  }

  // ─── Private helpers ──────────────────────────────────────────────────────────

  private _nullModeClick(): void {
    const hit = this.pickAny(this.cursor.ray);

    if (this._nullModeTool) {
      if (hit && hit.tool !== this._nullModeTool) {
        // Different tool — deselect current, select new
        this._nullModeTool.deselect();
        this._nullModeTool = hit.tool;
        hit.tool.select(hit.uuid);
        return;
      }
      // Same tool or empty space — let the tool handle it (drag commit, re-pick, deselect)
      this._nullModeTool.onPointerClick(this.cursor);
      if (this._nullModeTool.selectedUuid === null) this._nullModeTool = null;
      return;
    }

    if (hit) {
      this._nullModeTool = hit.tool;
      hit.tool.select(hit.uuid);
    }
  }

  private _createOrGetTool<T extends DrawingTool>(ToolClass: new (...args: any[]) => T): T {
    const existing = this._toolInstances.get(ToolClass as ToolConstructor);
    if (existing) return existing as T;
    const tool = new ToolClass(this.components);
    // Inject the current drawing if one is already active.
    if (this._drawing) tool.onDrawingChange(this._drawing, this.fonts);
    this._toolInstances.set(ToolClass as ToolConstructor, tool);
    return tool;
  }

  private _computePointerEvent(
    e: MouseEvent,
    entry: SourceEntry,
    canvas: HTMLElement,
  ): DrawingPointerEvent | null {
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return null;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const ndc = new THREE.Vector2(
      (x / rect.width) * 2 - 1,
      -(y / rect.height) * 2 + 1,
    );

    this._raycaster.setFromCamera(ndc, entry.camera);
    const ray = this._raycaster.ray.clone();

    const hit = this._drawing!.raycast(ray, entry.viewport ?? undefined);

    if (this._hoverHighlight) {
      if (hit?.line) {
        const pos = this._hoverHighlight.geometry.attributes.position as THREE.BufferAttribute;
        pos.setXYZ(0, hit.line.start.x, hit.line.start.y + 0.01, hit.line.start.z);
        pos.setXYZ(1, hit.line.end.x, hit.line.end.y + 0.01, hit.line.end.z);
        pos.needsUpdate = true;
        this._hoverHighlight.visible = true;
      } else {
        this._hoverHighlight.visible = false;
      }
    }

    let snap: SnapResult | null = null;
    if (hit?.line) {
      snap = this._resolveSnap(hit.point, hit.line, entry.camera, rect.width, rect.height, x, y);
    }

    const point = snap && snap.kind !== "none" ? snap.point : this._getDrawingLocalPoint(ray);

    return { point, snap, ray };
  }

  private _getDrawingLocalPoint(ray: THREE.Ray): THREE.Vector3 {
    const normal = new THREE.Vector3(0, 1, 0).transformDirection(
      this._drawing!.three.matrixWorld,
    );
    const origin = new THREE.Vector3().setFromMatrixPosition(
      this._drawing!.three.matrixWorld,
    );
    this._drawingPlane.setFromNormalAndCoplanarPoint(normal, origin);
    const worldPoint = new THREE.Vector3();
    ray.intersectPlane(this._drawingPlane, worldPoint);
    return this._drawing!.three.worldToLocal(worldPoint);
  }

  private _resolveSnap(
    hitPoint: THREE.Vector3,
    hitLine: THREE.Line3,
    camera: THREE.Camera,
    vpW: number,
    vpH: number,
    cursorX: number,
    cursorY: number,
  ): SnapResult {
    const candidates = [
      { point: hitLine.start.clone(), kind: "start" as const },
      { point: hitLine.end.clone(), kind: "end" as const },
      { point: hitLine.getCenter(new THREE.Vector3()), kind: "center" as const },
    ];

    let best: SnapResult = { point: hitPoint.clone(), kind: "none", line: hitLine };
    let bestDist = SNAP_THRESHOLD_PX;

    for (const c of candidates) {
      const worldPt = this._drawing!.three.localToWorld(c.point.clone());
      const ndc = worldPt.project(camera);
      const sx = ((ndc.x + 1) / 2) * vpW;
      const sy = ((1 - ndc.y) / 2) * vpH;
      const dist = Math.hypot(sx - cursorX, sy - cursorY);
      if (dist < bestDist) {
        bestDist = dist;
        best = { point: c.point, kind: c.kind, line: hitLine };
      }
    }

    return best;
  }

  private _createVisuals(): void {
    if (!this._drawing) return;

    const s = 0.04;
    this._snapMarkerMat = new THREE.LineBasicMaterial({ color: 0xffff00, depthTest: false });
    const snapGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-s, 0.01, -s),
      new THREE.Vector3(s, 0.01, -s),
      new THREE.Vector3(s, 0.01, s),
      new THREE.Vector3(-s, 0.01, s),
    ]);
    this._snapMarker = new THREE.LineLoop(snapGeo, this._snapMarkerMat);
    this._snapMarker.layers.set(1);
    this._snapMarker.renderOrder = 1000;
    this._snapMarker.frustumCulled = false;
    this._snapMarker.visible = false;
    this._drawing.three.add(this._snapMarker);

    this._hoverHighlightMat = new THREE.LineBasicMaterial({ color: 0x0077ff, depthTest: false });
    const hoverGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(),
      new THREE.Vector3(),
    ]);
    this._hoverHighlight = new THREE.Line(hoverGeo, this._hoverHighlightMat);
    this._hoverHighlight.layers.set(1);
    this._hoverHighlight.renderOrder = 999;
    this._hoverHighlight.frustumCulled = false;
    this._hoverHighlight.visible = false;
    this._drawing.three.add(this._hoverHighlight);
  }

  private _removeVisuals(): void {
    if (this._snapMarker) {
      this._snapMarker.removeFromParent();
      this._snapMarker.geometry.dispose();
      this._snapMarkerMat?.dispose();
      this._snapMarker = null;
      this._snapMarkerMat = null;
    }
    if (this._hoverHighlight) {
      this._hoverHighlight.removeFromParent();
      this._hoverHighlight.geometry.dispose();
      this._hoverHighlightMat?.dispose();
      this._hoverHighlight = null;
      this._hoverHighlightMat = null;
    }
  }

  private _updateSnapMarker(snap: SnapResult | null): void {
    if (!this._snapMarker || !this._snapMarkerMat) return;
    if (!snap || snap.kind === "none") {
      this._snapMarker.visible = false;
      return;
    }
    this._snapMarkerMat.color.setHex(snap.kind === "center" ? 0x00ffff : 0xffff00);
    this._snapMarker.position.copy(snap.point);
    this._snapMarker.visible = true;
  }
}

/** Fallback tool for custom systems — no-op on all lifecycle hooks. */
class _GenericTool extends DrawingTool {
  onActivate(): void {}
  onDeactivate(): void {}
  onPointerMove(_e: DrawingPointerEvent): void {}
  dispose(): void { this._disposeSelection(); }
  protected _systemPick(_ray: THREE.Ray): string | null { return null; }
  protected _systemDelete(_drawing: OBC.TechnicalDrawing, _uuids: string[]): void {}
  protected _select(_uuid: string): void {}
}

// Prevent unused-class lint warning
void _GenericTool;
