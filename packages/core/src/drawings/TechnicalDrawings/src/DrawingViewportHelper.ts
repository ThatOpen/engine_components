import * as THREE from "three";

/**
 * Minimal interface consumed by {@link DrawingViewportHelper}.
 * Satisfied by {@link DrawingViewport} without a direct import, which keeps
 * the two classes free of circular dependencies.
 */
interface ViewportBoundsController {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

type BoundConstraint = "left" | "right" | "top" | "bottom";

/** Snapshot of all four bounds captured at the start of a move drag. */
interface MoveDragState {
  origin: THREE.Vector3;
  left0: number;
  right0: number;
  top0: number;
  bottom0: number;
}

/**
 * Visualises the bounds of a `DrawingViewport` as a rectangle in the 3D scene.
 *
 * Works exactly like the built-in Three.js helpers (e.g. `THREE.CameraHelper`):
 * the result is a plain `THREE.Group` you can add wherever you like in the scene
 * graph.  It renders on **layer 0**, so it is visible to the perspective camera
 * but invisible to the viewport's own orthographic camera (which only renders
 * layer 1).
 *
 * Typically you do not construct this directly — use
 * `DrawingViewport.helperVisible = true` instead, which attaches the helper to
 * the drawing container automatically.
 *
 * When {@link editable} is `true`, two kinds of interaction are enabled:
 *
 * - **Resize** — hover one of the eight handle spheres (corners + edge midpoints)
 *   and drag to resize the viewport in that direction.
 * - **Move** — hover the border rectangle itself and drag to translate the
 *   entire viewport while keeping its width and height constant.
 *
 * In both cases the border and the hovered element turn orange as visual
 * feedback, and {@link isDragging} becomes `true` for the duration of the drag.
 *
 * The class contains no browser API references and is safe in Node.js
 * environments; the consumer forwards events:
 *
 * ```ts
 * container.addEventListener("mousemove", (e) => {
 *   raycaster.setFromCamera(getNDC(e), camera);
 *   viewport.helper.onPointerMove(raycaster.ray);
 * });
 * container.addEventListener("mousedown", (e) => {
 *   raycaster.setFromCamera(getNDC(e), camera);
 *   viewport.helper.onPointerDown(raycaster.ray);
 * });
 * container.addEventListener("mouseup", () => viewport.helper.onPointerUp());
 * ```
 */
export class DrawingViewportHelper extends THREE.Group {
  private readonly _viewport: ViewportBoundsController;
  private readonly _border: THREE.LineSegments;
  private readonly _handles: THREE.Mesh[] = [];
  private readonly _raycaster = new THREE.Raycaster();

  private _resizable = false;
  private _movable = false;

  // Resize drag state
  private _dragHandle: THREE.Mesh | null = null;
  private _dragConstraints: BoundConstraint[] = [];
  private _hoveredHandle: THREE.Mesh | null = null;

  // Move drag state
  private _moveDrag: MoveDragState | null = null;
  private _hoveringBorder = false;

  private readonly _normalMat: THREE.MeshBasicMaterial;
  private readonly _hoverMat: THREE.MeshBasicMaterial;
  private readonly _borderMat: THREE.LineBasicMaterial;

  private static readonly _BORDER_COLOR       = 0x0055ff;
  private static readonly _BORDER_HOVER_COLOR = 0xff8800;

  // Raycaster threshold for border line picking (in world units).
  private static readonly _LINE_THRESHOLD = 0.06;


  // Each handle controls a specific subset of the four bounds.
  private static readonly _HANDLE_DEFS: {
    constraints: BoundConstraint[];
  }[] = [
    { constraints: ["left", "top"] },     // 0  TL corner
    { constraints: ["right", "top"] },    // 1  TR corner
    { constraints: ["right", "bottom"] }, // 2  BR corner
    { constraints: ["left", "bottom"] },  // 3  BL corner
    { constraints: ["top"] },             // 4  top edge midpoint
    { constraints: ["right"] },           // 5  right edge midpoint
    { constraints: ["bottom"] },          // 6  bottom edge midpoint
    { constraints: ["left"] },            // 7  left edge midpoint
  ];

  /**
   * When `true`, the eight handle spheres are shown and resize drag is enabled.
   */
  get resizable() {
    return this._resizable;
  }
  set resizable(value: boolean) {
    this._resizable = value;
    for (const h of this._handles) h.visible = value;
    if (!value) {
      if (this._hoveredHandle) {
        this._hoveredHandle.material = this._normalMat;
        this._hoveredHandle = null;
      }
      this._dragHandle      = null;
      this._dragConstraints = [];
    }
  }

  /**
   * When `true`, hovering and dragging the border rectangle translates the
   * entire viewport while keeping its width and height constant.
   */
  get movable() {
    return this._movable;
  }
  set movable(value: boolean) {
    this._movable = value;
    if (!value) {
      this._moveDrag = null;
      this._setBorderHover(false);
    }
  }

  /** `true` while either a resize or a move drag is in progress. */
  get isDragging(): boolean {
    return this._dragHandle !== null || this._moveDrag !== null;
  }

  constructor(viewport: ViewportBoundsController) {
    super();
    this._viewport = viewport;

    // ── Border ────────────────────────────────────────────────────────────
    this._borderMat = new THREE.LineBasicMaterial({
      color: DrawingViewportHelper._BORDER_COLOR,
      depthTest: false,
    });
    const borderGeo = new THREE.BufferGeometry();
    // 4 line segments (TL→TR, TR→BR, BR→BL, BL→TL) = 8 vertices.
    borderGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(8 * 3), 3),
    );
    this._border = new THREE.LineSegments(borderGeo, this._borderMat);
    this._border.renderOrder = 999;
    this._border.frustumCulled = false;
    // Exclude from raw-line DXF export (_writeRawLines skips userData.isDimension).
    this._border.userData.isDimension = true;
    this.add(this._border);

    // ── Handles ───────────────────────────────────────────────────────────
    this._normalMat = new THREE.MeshBasicMaterial({
      color: DrawingViewportHelper._BORDER_COLOR,
    });
    this._hoverMat = new THREE.MeshBasicMaterial({
      color: DrawingViewportHelper._BORDER_HOVER_COLOR,
    });

    const handleGeo = new THREE.SphereGeometry(0.05, 8, 6);
    for (const def of DrawingViewportHelper._HANDLE_DEFS) {
      const mesh = new THREE.Mesh(handleGeo, this._normalMat);
      mesh.renderOrder = 1000;
      mesh.visible = false;
      mesh.userData.constraints = def.constraints;
      mesh.userData.isDimension = true; // exclude from DXF export
      this.add(mesh);
      this._handles.push(mesh);
    }

    this.update();
  }

  /**
   * Rebuilds the border geometry and repositions all handles to match the
   * current viewport bounds.  Called automatically by the viewport whenever
   * any bound changes; you rarely need to call this yourself.
   */
  update(): void {
    const vp = this._viewport;
    const x0 = vp.left;
    const x1 = vp.right;
    // Screen-up = world −Z, so: top ↔ −top in local Z, bottom ↔ −bottom.
    const z0 = -vp.top;
    const z1 = -vp.bottom;
    const y = 0.005; // slightly above the drawing plane to avoid z-fighting

    // ── Border ────────────────────────────────────────────────────────────
    const pos = this._border.geometry.attributes
      .position as THREE.BufferAttribute;
    pos.setXYZ(0, x0, y, z0); pos.setXYZ(1, x1, y, z0); // top
    pos.setXYZ(2, x1, y, z0); pos.setXYZ(3, x1, y, z1); // right
    pos.setXYZ(4, x1, y, z1); pos.setXYZ(5, x0, y, z1); // bottom
    pos.setXYZ(6, x0, y, z1); pos.setXYZ(7, x0, y, z0); // left
    pos.needsUpdate = true;
    this._border.geometry.computeBoundingSphere();

    // ── Handles ───────────────────────────────────────────────────────────
    const mx = (x0 + x1) / 2;
    const mz = (z0 + z1) / 2;
    const hy = y + 0.005;
    const hPos: [number, number, number][] = [
      [x0, hy, z0], // 0 TL
      [x1, hy, z0], // 1 TR
      [x1, hy, z1], // 2 BR
      [x0, hy, z1], // 3 BL
      [mx, hy, z0], // 4 top mid
      [x1, hy, mz], // 5 right mid
      [mx, hy, z1], // 6 bottom mid
      [x0, hy, mz], // 7 left mid
    ];
    for (let i = 0; i < this._handles.length; i++) {
      this._handles[i].position.set(...hPos[i]);
    }
  }

  /**
   * Forward `mousemove` events here.
   *
   * - **Resize drag active**: updates the bound(s) controlled by the active handle.
   * - **Move drag active**: translates all four bounds by the cursor delta,
   *   preserving the viewport's width and height.
   * - **No drag**: highlights handles on hover; highlights the border when the
   *   cursor is over it and no handle is hovered.
   *
   * @param ray - World-space ray, e.g. from `THREE.Raycaster.setFromCamera`.
   */
  onPointerMove(ray: THREE.Ray): void {
    // ── Active resize drag ────────────────────────────────────────────────
    if (this._dragHandle) {
      const localPt = this._projectToLocal(ray);
      if (!localPt) return;

      for (const c of this._dragConstraints) {
        switch (c) {
          case "left":   this._viewport.left   =  localPt.x; break;
          case "right":  this._viewport.right  =  localPt.x; break;
          // localZ = −viewportTop  →  viewportTop = −localZ
          case "top":    this._viewport.top    = -localPt.z; break;
          case "bottom": this._viewport.bottom = -localPt.z; break;
        }
      }

      // Flip X if bounds crossed.
      if (this._viewport.right < this._viewport.left) {
        [this._viewport.left, this._viewport.right] =
          [this._viewport.right, this._viewport.left];
        this._dragConstraints = this._dragConstraints.map((c) =>
          c === "right" ? "left" : c === "left" ? "right" : c,
        );
      }
      // Flip Y if bounds crossed.
      if (this._viewport.top < this._viewport.bottom) {
        [this._viewport.top, this._viewport.bottom] =
          [this._viewport.bottom, this._viewport.top];
        this._dragConstraints = this._dragConstraints.map((c) =>
          c === "top" ? "bottom" : c === "bottom" ? "top" : c,
        );
      }

      this.update();
      return;
    }

    // ── Active move drag ──────────────────────────────────────────────────
    if (this._moveDrag) {
      const localPt = this._projectToLocal(ray);
      if (!localPt) return;
      const dx = localPt.x - this._moveDrag.origin.x;
      const dz = localPt.z - this._moveDrag.origin.z;
      this._viewport.left   = this._moveDrag.left0   + dx;
      this._viewport.right  = this._moveDrag.right0  + dx;
      // screen-up = −Z, so moving +Z shifts top/bottom negatively
      this._viewport.top    = this._moveDrag.top0    - dz;
      this._viewport.bottom = this._moveDrag.bottom0 - dz;
      this.update();
      return;
    }

    if (!this._resizable && !this._movable) return;

    // ── Hover detection ───────────────────────────────────────────────────
    this._raycaster.set(ray.origin, ray.direction);

    // 1. Check handles first (only if resizable).
    let newHover: THREE.Mesh | null = null;
    if (this._resizable) {
      const visible = this._handles.filter((h) => h.visible);
      const handleHits = this._raycaster.intersectObjects(visible, false);
      newHover = handleHits.length > 0 ? (handleHits[0].object as THREE.Mesh) : null;
    }

    if (newHover !== this._hoveredHandle) {
      if (this._hoveredHandle) this._hoveredHandle.material = this._normalMat;
      if (newHover) newHover.material = this._hoverMat;
      this._hoveredHandle = newHover;
    }

    // 2. If no handle is hovered, check whether the cursor is over the border
    //    (only if movable).
    if (this._movable && !this._hoveredHandle) {
      this._raycaster.params.Line = {
        threshold: DrawingViewportHelper._LINE_THRESHOLD,
      };
      const borderHit =
        this._raycaster.intersectObject(this._border, false).length > 0;
      this._setBorderHover(borderHit);
    } else {
      // A handle takes priority, or move is disabled — clear any border hover.
      this._setBorderHover(false);
    }
  }

  /**
   * Forward `mousedown` events here.
   *
   * - If a handle is hovered, begins a **resize drag**.
   * - If the border is hovered (and no handle), begins a **move drag**.
   *
   * @param ray - World-space ray at the moment of the press.
   */
  onPointerDown(ray: THREE.Ray): void {
    if (!this._resizable && !this._movable) return;

    // Re-run hover detection to ensure state is fresh.
    this._raycaster.set(ray.origin, ray.direction);

    if (this._resizable) {
      const visible = this._handles.filter((h) => h.visible);
      const handleHits = this._raycaster.intersectObjects(visible, false);
      if (handleHits.length > 0) {
        // Start a resize drag on the hit handle.
        this._dragHandle = handleHits[0].object as THREE.Mesh;
        this._dragConstraints = [...this._dragHandle.userData.constraints];
        return;
      }
    }

    if (this._movable) {
      // Check border for move drag.
      this._raycaster.params.Line = {
        threshold: DrawingViewportHelper._LINE_THRESHOLD,
      };
      const onBorder =
        this._raycaster.intersectObject(this._border, false).length > 0;

      if (onBorder) {
        const localPt = this._projectToLocal(ray);
        if (!localPt) return;
        this._moveDrag = {
          origin: localPt,
          left0:   this._viewport.left,
          right0:  this._viewport.right,
          top0:    this._viewport.top,
          bottom0: this._viewport.bottom,
        };
      }
    }
  }

  /** Forward `mouseup` events here to end any active drag. */
  onPointerUp(): void {
    this._dragHandle      = null;
    this._dragConstraints = [];
    this._moveDrag        = null;
  }

  /** Releases all Three.js geometry and material resources. */
  dispose(): void {
    this._border.geometry.dispose();
    this._borderMat.dispose();
    this._normalMat.dispose();
    this._hoverMat.dispose();
    // handleGeo is shared across all handle meshes — dispose once.
    if (this._handles.length > 0) {
      this._handles[0].geometry.dispose();
    }
    this.removeFromParent();
  }

  /**
   * Projects a world-space ray onto this group's local Y = 0 plane and
   * returns the intersection in local coordinates.
   */
  private _projectToLocal(ray: THREE.Ray): THREE.Vector3 | null {
    this.updateWorldMatrix(true, false);
    const normal = new THREE.Vector3(0, 1, 0).transformDirection(
      this.matrixWorld,
    );
    const origin = new THREE.Vector3().setFromMatrixPosition(
      this.matrixWorld,
    );
    const plane = new THREE.Plane().setFromNormalAndCoplanarPoint(
      normal,
      origin,
    );
    const worldPt = new THREE.Vector3();
    if (!ray.intersectPlane(plane, worldPt)) return null;
    return this.worldToLocal(worldPt);
  }

  /** Toggles the border hover colour and keeps `_hoveringBorder` in sync. */
  private _setBorderHover(value: boolean): void {
    if (value === this._hoveringBorder) return;
    this._hoveringBorder = value;
    this._borderMat.color.setHex(
      value
        ? DrawingViewportHelper._BORDER_HOVER_COLOR
        : DrawingViewportHelper._BORDER_COLOR,
    );
  }
}
