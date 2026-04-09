import * as THREE from "three";

/**
 * Minimal interface consumed by {@link TechnicalDrawingHelper}.
 * Satisfied by {@link TechnicalDrawing} without a direct import.
 */
interface DrawingProjectionSource {
  far: number;
}

/** Minimal interface for a translate-only gizmo that can be configured and attached to one of the helper's control handles. */
export interface AxisGizmoLike {
  attach(object: THREE.Object3D): void;
  setSpace(space: "world" | "local"): void;
  getHelper(): THREE.Object3D;
  showX: boolean;
  showY: boolean;
  showZ: boolean;
  addEventListener(type: string, listener: () => void): void;
}

/** Visualises a {@link TechnicalDrawing}'s projection volume in the 3D scene and exposes three gizmo anchors for interactive control. */
export class TechnicalDrawingHelper extends THREE.Group {
  private readonly _drawing: DrawingProjectionSource;

  private readonly _topFrame: THREE.LineSegments;
  private readonly _pillars: THREE.LineSegments;
  private readonly _bottomFrame: THREE.LineSegments;

  private readonly _topPlane: THREE.Mesh;
  private readonly _bottomPlane: THREE.Mesh;

  private readonly _frameMat: THREE.LineBasicMaterial;
  private readonly _depthMat: THREE.LineBasicMaterial;
  private readonly _planeMat: THREE.MeshBasicMaterial;

  private static readonly _FRAME_COLOR = 0x0055ff;
  private static readonly _DEPTH_COLOR = 0x0055ff;

  /**
   * Width of the drawing frame indicator along the local X axis, in world
   * units. Call {@link update} after changing this value programmatically.
   */
  width = 10;

  /**
   * Height of the drawing frame indicator along the local Z axis, in world
   * units. Call {@link update} after changing this value programmatically.
   */
  height = 10;

  /**
   * Gizmo anchor positioned at the centre of the bottom frame.
   * Pass a `TransformControls` instance to {@link attachFarGizmo} — do not
   * manipulate this object's position directly.
   */
  readonly farHandle = new THREE.Object3D();

  /**
   * Gizmo anchor positioned at the right-edge midpoint of the top frame.
   * Pass a `TransformControls` instance to {@link attachWidthGizmo} — do not
   * manipulate this object's position directly.
   */
  readonly widthHandle = new THREE.Object3D();

  /**
   * Gizmo anchor positioned at the bottom-edge midpoint of the top frame.
   * Pass a `TransformControls` instance to {@link attachHeightGizmo} — do not
   * manipulate this object's position directly.
   */
  readonly heightHandle = new THREE.Object3D();

  /**
   * Works exactly like the built-in Three.js helpers (e.g. `THREE.CameraHelper`):
   * add it as a child of `drawing.three` so it inherits the drawing's world
   * transform automatically.
   *
   * It renders on **layer 0** — visible to the perspective camera, invisible to
   * the drawing's orthographic cameras (which only render layer 1).
   *
   * The helper draws three things:
   * - A rectangular frame on the drawing plane (Y = 0 in drawing local space).
   * - Four pillar lines dropping from each corner along the projection direction
   *   (local −Y) to the far boundary.
   * - A matching rectangle at the far boundary.
   *
   * ### Interactive control via gizmos
   *
   * Three `THREE.Object3D` anchors are exposed for `TransformControls`:
   *
   * | Anchor | Controls | Constrained axis |
   * |---|---|---|
   * | {@link farHandle} | `drawing.far` | local Y |
   * | {@link widthHandle} | {@link width} (symmetric) | local X |
   * | {@link heightHandle} | {@link height} (symmetric) | local Z |
   *
   * Use the corresponding `attach*Gizmo` methods instead of configuring the
   * gizmos manually — they enforce the correct axis constraints, local space,
   * and change listeners automatically:
   *
   * ```ts
   * const helper = new TechnicalDrawingHelper(drawing);
   * helper.width = 20;
   * helper.height = 15;
   * drawing.three.add(helper);
   *
   * // Main gizmo — full translate + rotate on drawing.three
   * const mainGizmo = new TransformControls(camera, domElement);
   * mainGizmo.attach(drawing.three);
   * scene.add(mainGizmo);
   *
   * // Depth gizmo — controls drawing.far
   * const farGizmo = new TransformControls(camera, domElement);
   * scene.add(farGizmo);
   * helper.attachFarGizmo(farGizmo);
   *
   * // Width gizmo
   * const widthGizmo = new TransformControls(camera, domElement);
   * scene.add(widthGizmo);
   * helper.attachWidthGizmo(widthGizmo);
   *
   * // Height gizmo
   * const heightGizmo = new TransformControls(camera, domElement);
   * scene.add(heightGizmo);
   * helper.attachHeightGizmo(heightGizmo);
   * ```
   *
   * Call {@link update} after changing {@link width}, {@link height}, or
   * `drawing.far` programmatically to rebuild the geometry.
   */
  constructor(drawing: DrawingProjectionSource) {
    super();
    this._drawing = drawing;

    this._frameMat = new THREE.LineBasicMaterial({
      color: TechnicalDrawingHelper._FRAME_COLOR,
      depthTest: false,
    });

    this._depthMat = new THREE.LineBasicMaterial({
      color: TechnicalDrawingHelper._DEPTH_COLOR,
      depthTest: false,
      transparent: true,
      opacity: 0.4,
    });

    this._planeMat = new THREE.MeshBasicMaterial({
      color: TechnicalDrawingHelper._FRAME_COLOR,
      transparent: true,
      opacity: 0.07,
      side: THREE.DoubleSide,
      depthTest: false,
    });

    // Plane fills — semi-transparent quads on the drawing and far planes.
    const makePlaneGeo = () => {
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(4 * 3), 3));
      geo.setIndex([0, 1, 2, 0, 2, 3]);
      return geo;
    };
    this._topPlane = new THREE.Mesh(makePlaneGeo(), this._planeMat);
    this._topPlane.renderOrder = 998;
    this._topPlane.frustumCulled = false;
    this._topPlane.userData.isDimension = true;

    this._bottomPlane = new THREE.Mesh(makePlaneGeo(), this._planeMat);
    this._bottomPlane.renderOrder = 998;
    this._bottomPlane.frustumCulled = false;
    this._bottomPlane.userData.isDimension = true;

    // Top frame — 4 segments forming a rectangle on the drawing plane (Y ≈ 0).
    const topGeo = new THREE.BufferGeometry();
    topGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(8 * 3), 3),
    );
    this._topFrame = new THREE.LineSegments(topGeo, this._frameMat);
    this._topFrame.renderOrder = 999;
    this._topFrame.frustumCulled = false;
    this._topFrame.userData.isDimension = true;

    // Pillars — 4 lines from each corner of the top frame to the far plane.
    const pillarGeo = new THREE.BufferGeometry();
    pillarGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(8 * 3), 3),
    );
    this._pillars = new THREE.LineSegments(pillarGeo, this._depthMat);
    this._pillars.renderOrder = 999;
    this._pillars.frustumCulled = false;
    this._pillars.userData.isDimension = true;

    // Bottom frame — same rectangle at Y = −far.
    const bottomGeo = new THREE.BufferGeometry();
    bottomGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(8 * 3), 3),
    );
    this._bottomFrame = new THREE.LineSegments(bottomGeo, this._depthMat);
    this._bottomFrame.renderOrder = 999;
    this._bottomFrame.frustumCulled = false;
    this._bottomFrame.userData.isDimension = true;

    this.add(this._topPlane, this._bottomPlane);
    this.add(this._topFrame, this._pillars, this._bottomFrame);
    this.add(this.farHandle, this.widthHandle, this.heightHandle);
    // Flip farHandle so its local +Y points away from the drawing plane,
    // making the gizmo arrow face outward into the projection volume.
    this.farHandle.rotation.x = Math.PI;
    this.update();
  }

  /**
   * Rebuilds the helper geometry and repositions all gizmo anchors to match
   * the current {@link width}, {@link height}, and `drawing.far`. Call this
   * whenever any of those values change programmatically.
   */
  update(): void {
    const w2 = this.width / 2;
    const h2 = this.height / 2;
    const yFar = -this._drawing.far;
    // Slight Y offset so the top frame does not z-fight with the drawing plane.
    const y0 = 0.005;

    const x0 = -w2;
    const x1 = w2;
    const z0 = -h2;
    const z1 = h2;

    // ── Top frame ─────────────────────────────────────────────────────────
    const topPos = this._topFrame.geometry.attributes
      .position as THREE.BufferAttribute;
    topPos.setXYZ(0, x0, y0, z0); topPos.setXYZ(1, x1, y0, z0); // top edge
    topPos.setXYZ(2, x1, y0, z0); topPos.setXYZ(3, x1, y0, z1); // right edge
    topPos.setXYZ(4, x1, y0, z1); topPos.setXYZ(5, x0, y0, z1); // bottom edge
    topPos.setXYZ(6, x0, y0, z1); topPos.setXYZ(7, x0, y0, z0); // left edge
    topPos.needsUpdate = true;
    this._topFrame.geometry.computeBoundingSphere();

    // ── Pillars ───────────────────────────────────────────────────────────
    const pillarPos = this._pillars.geometry.attributes
      .position as THREE.BufferAttribute;
    pillarPos.setXYZ(0, x0, y0, z0); pillarPos.setXYZ(1, x0, yFar, z0); // TL
    pillarPos.setXYZ(2, x1, y0, z0); pillarPos.setXYZ(3, x1, yFar, z0); // TR
    pillarPos.setXYZ(4, x1, y0, z1); pillarPos.setXYZ(5, x1, yFar, z1); // BR
    pillarPos.setXYZ(6, x0, y0, z1); pillarPos.setXYZ(7, x0, yFar, z1); // BL
    pillarPos.needsUpdate = true;
    this._pillars.geometry.computeBoundingSphere();

    // ── Bottom frame ──────────────────────────────────────────────────────
    const botPos = this._bottomFrame.geometry.attributes
      .position as THREE.BufferAttribute;
    botPos.setXYZ(0, x0, yFar, z0); botPos.setXYZ(1, x1, yFar, z0);
    botPos.setXYZ(2, x1, yFar, z0); botPos.setXYZ(3, x1, yFar, z1);
    botPos.setXYZ(4, x1, yFar, z1); botPos.setXYZ(5, x0, yFar, z1);
    botPos.setXYZ(6, x0, yFar, z1); botPos.setXYZ(7, x0, yFar, z0);
    botPos.needsUpdate = true;
    this._bottomFrame.geometry.computeBoundingSphere();

    // ── Plane fills ───────────────────────────────────────────────────────
    const setQuad = (mesh: THREE.Mesh, y: number) => {
      const pos = mesh.geometry.attributes.position as THREE.BufferAttribute;
      pos.setXYZ(0, x0, y, z0);
      pos.setXYZ(1, x1, y, z0);
      pos.setXYZ(2, x1, y, z1);
      pos.setXYZ(3, x0, y, z1);
      pos.needsUpdate = true;
      mesh.geometry.computeBoundingSphere();
    };
    setQuad(this._topPlane,    y0);
    setQuad(this._bottomPlane, yFar);

    // ── Gizmo anchors ─────────────────────────────────────────────────────
    this.farHandle.position.set(0, yFar, 0);
    this.widthHandle.position.set(x1, y0, 0);
    this.heightHandle.position.set(0, y0, z1);
  }

  /**
   * Configures a `TransformControls` instance to control `drawing.far` and
   * attaches it to the {@link farHandle}.
   *
   * The gizmo is constrained to the drawing's local Y axis (the projection
   * direction) and wired to update `drawing.far` on every change. Call this
   * once — calling it again on the same gizmo accumulates listeners.
   *
   * @param gizmo - A `TransformControls` instance (or any {@link AxisGizmoLike}).
   */
  attachFarGizmo(gizmo: AxisGizmoLike): void {
    gizmo.attach(this.farHandle);
    gizmo.setSpace("local");
    gizmo.showX = false;
    gizmo.showZ = false;
    gizmo.addEventListener("objectChange", () => {
      // Constrain to Y axis and clamp to a sensible minimum depth.
      this.farHandle.position.x = 0;
      this.farHandle.position.z = 0;
      const newFar = Math.max(0.1, -this.farHandle.position.y);
      this._drawing.far = newFar;
      this.farHandle.position.y = -newFar;
      this.update();
    });
  }

  /**
   * Configures a `TransformControls` instance to control {@link width} and
   * attaches it to the {@link widthHandle}.
   *
   * The gizmo is constrained to the drawing's local X axis. Width grows
   * symmetrically — dragging the right-edge handle outward expands both sides.
   *
   * @param gizmo - A `TransformControls` instance (or any {@link AxisGizmoLike}).
   */
  attachWidthGizmo(gizmo: AxisGizmoLike): void {
    gizmo.attach(this.widthHandle);
    gizmo.setSpace("local");
    gizmo.showY = false;
    gizmo.showZ = false;
    gizmo.addEventListener("objectChange", () => {
      this.widthHandle.position.y = 0.005;
      this.widthHandle.position.z = 0;
      this.width = Math.max(0.1, this.widthHandle.position.x * 2);
      // Reclamp handle if it hit the minimum.
      this.widthHandle.position.x = this.width / 2;
      this.update();
    });
  }

  /**
   * Configures a `TransformControls` instance to control {@link height} and
   * attaches it to the {@link heightHandle}.
   *
   * The gizmo is constrained to the drawing's local Z axis. Height grows
   * symmetrically — dragging the bottom-edge handle outward expands both sides.
   *
   * @param gizmo - A `TransformControls` instance (or any {@link AxisGizmoLike}).
   */
  attachHeightGizmo(gizmo: AxisGizmoLike): void {
    gizmo.attach(this.heightHandle);
    gizmo.setSpace("local");
    gizmo.showX = false;
    gizmo.showY = false;
    gizmo.addEventListener("objectChange", () => {
      this.heightHandle.position.x = 0;
      this.heightHandle.position.y = 0.005;
      this.height = Math.max(0.1, this.heightHandle.position.z * 2);
      // Reclamp handle if it hit the minimum.
      this.heightHandle.position.z = this.height / 2;
      this.update();
    });
  }

  /** Releases all Three.js geometry and material resources. */
  dispose(): void {
    this._topPlane.geometry.dispose();
    this._bottomPlane.geometry.dispose();
    this._topFrame.geometry.dispose();
    this._pillars.geometry.dispose();
    this._bottomFrame.geometry.dispose();
    this._planeMat.dispose();
    this._frameMat.dispose();
    this._depthMat.dispose();
    this.removeFromParent();
  }
}
