import * as THREE from "three";
import { SurfaceCaptureTarget } from "./surface-capture-target";
import { paintFlatTints, setSeeThroughPass } from "./flat-tint";

/**
 * Surface capture into a multi-attachment G-buffer:
 *
 *   out 0 (RGBA16F) : the surface's own shaded colour (pre-tonemap)
 *   out 1 (RG16F)   : octahedral-encoded view-space normal
 *   out 2 (RGBA8)   : 24-bit RGB-packed faceId + role/sentinel byte in alpha
 *   depth           : written to the shared float32 depth attachment
 *
 * There is no override material and no separate forward colour render. The
 * surface materials carry a define-gated "capture-emission" path (enabled by the
 * host renderer before this pass runs) that writes the normal + faceId extras to
 * attachments 1 and 2 alongside their colour output.
 *
 * The scene is drawn in two phases against the same G-buffer:
 *
 *   1. Opaque emitters fill every attachment plus depth.
 *   2. Translucent emitters (glass and the like) contribute colour ONLY: before
 *      drawing them we detach attachments 1 and 2 via gl.drawBuffers, so their
 *      normal/faceId writes are dropped and the opaque values captured behind them
 *      in phase 1 survive. Depth-test still hides glass behind opaque surfaces and
 *      blending composites the tint into attachment 0, but an object seen through
 *      glass keeps its own faceId/normal, so the contour outlines it and AO reads
 *      it. Depth-write is forced off for this phase as well, so the depth buffer
 *      keeps the opaque depth behind the glass: the glass contributes no edges and
 *      no AO, and the surface seen through it is shaded as if the glass were not
 *      there.
 *
 * Objects whose material emits no extras (grid, helpers) declare no MRT outputs
 * beyond colour, so they would leave attachments 1/2 undefined where they win the
 * depth test and corrupt the contour / AO reads. Those objects are hidden for the
 * duration of the capture and restored immediately after. The faceId contour
 * redraws the structural edges anyway, so dropping them here is no visual loss.
 *
 * Per-attachment sentinel clears via clearBufferfv:
 *   - colour  -> the renderer's current clear colour (matches the old forward clear)
 *   - normal  -> (0,0) (masked downstream by depth == far anyway)
 *   - faceId  -> (1,1,1,0) = id 0xFFFFFF, role 0  ("no element")
 *   - depth   -> 1.0 (far plane)
 */
export class SurfaceCapturePass {
  readonly target: SurfaceCaptureTarget;

  private readonly _clearColor = new THREE.Color();
  // Per-frame classification buckets (currently-visible meshes only), reused
  // across frames. Filling them is the single scene-graph walk per capture; the
  // two phases below toggle visibility on these arrays instead of re-traversing.
  private readonly _nonEmitters: THREE.Object3D[] = [];
  private readonly _opaque: THREE.Object3D[] = [];
  private readonly _translucent: THREE.Object3D[] = [];
  private readonly _depthWriteSaved: { material: THREE.Material; value: boolean }[] = [];

  /**
   * Told the size in pixels of the target just before each capture, so the surface materials can keep
   * anything thinner than a pixel from vanishing (see fragments' `setCapturePixels`). The host wires it.
   */
  onPixels: ((width: number, height: number) => void) | null = null;

  /**
   * 🔴 A LINE DRAWING HAS NO GLASS TO SEE THROUGH. A hidden-line view draws a glazed wall as a white
   * surface with its glass strokes on it, never the room behind; seen through, racbasic's South elevation
   * showed its whole ground floor in grey where the print is white. When set, translucent surfaces are drawn
   * with the opaque ones, full and writing depth, and put back as they were after the capture.
   */
  translucentAsOpaque = false;
  /**
   * 🔴 AND A GLASS CAN BE CLEAR AS AIR AND STILL BE GLASS. A material at 100 % transparency arrives at no opacity, which
   * here also says «a room: never drawn», so a line view left it out and showed the rooms behind it: DACH's glazing is
   * all «Glas - klar» at 100 %, and its elevations printed their furniture and stairs where Revit prints white panes.
   * The host sets this when it hides the rooms itself (what a drawing hides never reaches the capture), and then
   * what is still here at no opacity is glass, and `translucentAsOpaque` draws it as the surface it is.
   */
  noOpacityIsGlass = false;
  /**
   * 🔴 A SEE-THROUGH SURFACE STILL HAS EDGES. Revit draws a glass wall's frame lines and a mass's volume over what is
   * seen through them; the translucent phase below writes no face id, so the contour outlined what was behind and
   * nothing of the glass itself: DACH 1-01's mass study drew its floors and none of the volumes round them, and its
   * plans lost the garage, a mass at full transparency. Writing the glass's ids into the face buffer instead would
   * lose the edges BEHIND it, so it is done apart (`translucentEdgesInto`): the translucent surfaces' ids go to a
   * target of their own over the same depth, and wherever that id changes a seed is stamped into the face buffer,
   * which the contour inks like any other edge. Off unless a drawing asks for it.
   */
  translucentEdges = false;
  /**
   * The view being captured marks some of its elements see-through (`SEE_THROUGH_AMOUNT` in its tint table): their
   * edges are drawn too, by a pass of their own (see `translucentEdgesInto`). The host says so per capture, because
   * that pass draws the whole scene again and most views mark nothing.
   */
  seeThrough = false;
  private _edgesTarget: THREE.WebGLRenderTarget | null = null;
  private _edgesScene: THREE.Scene | null = null;
  private _edgesMaterial: THREE.RawShaderMaterial | null = null;
  // 🔴 A CAMERA THAT CAN BE TOLD ITS DEPTH IS REVERSED. From r186 three asks whatever camera it is handed to
  // `updateProjectionMatrix()` when the depth buffer is reversed, and the bare `THREE.Camera` has no such method:
  // the first view that marked something see-through killed its frame inside three (the quad's shader reads no
  // matrix, so which projection this one has does not matter).
  private readonly _edgesCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  private readonly _madeOpaque: {
    material: THREE.Material;
    transparent: boolean;
    opacity: number;
    depthWrite: boolean;
    visible?: boolean;
  }[] = [];

  constructor(width: number, height: number) {
    this.target = new SurfaceCaptureTarget(width, height);
  }

  setSize(width: number, height: number) {
    this.target.setSize(width, height);
  }

  /**
   * Render the scene into the single-pass G-buffer. Assumes the host renderer has
   * already enabled capture-emission on the surface materials.
   */
  /**
   * 🔴 `clear: false` accumulates into the G-buffer instead of resetting it, which is what lets a caller
   * split ONE capture across several frames.
   *
   * Why that matters, and it is not a micro-optimisation. A sheet repaint is GPU-bound at 17-19 ms idle and
   * 44-56 ms mid-gesture on superbig, against a 16 ms frame. Any repaint that big blocks the frame it lands
   * on, and that is a STUTTER, not a lower frame rate. Making the pass cheaper only moves the ceiling to the
   * next model; the only thing that removes it is bounding the work per frame, and for that the capture has
   * to be resumable.
   *
   * Correctness of accumulating: the sentinel clears (colour, normal, faceId, depth-far) are exactly the
   * neutral state for a depth-tested accumulation, so chunk N+1 composes with chunk N through the normal
   * depth test. The result after the last chunk is identical to one capture of everything, as long as every
   * chunk sees the same camera.
   */
  /**
   * 🔴 `depthOnly` draws depth and nothing else, for a caller that reads only the depth attachment (the sun's
   * map). The G-buffer's three colour attachments are neither cleared nor written, and the translucent phase
   * is skipped: it writes no depth, so it adds nothing to such a caller. Measured on racbasic by replaying
   * Antonio's pan and zoom: the sun's map drawn as a whole G-buffer took 8 ms of GPU each, up to 4096 square,
   * for a depth that is all the shadow reads.
   */
  render(
    renderer: THREE.WebGLRenderer,
    scene: THREE.Scene,
    camera: THREE.Camera,
    clear = true,
    depthOnly = false,
  ) {
    const gl = renderer.getContext() as WebGL2RenderingContext;

    const oldAutoClear = renderer.autoClear;
    const oldTarget = renderer.getRenderTarget();

    // A non-null scene.background (a THREE.Color) makes three's WebGLBackground
    // force a renderer.clear() at the start of renderer.render — even with
    // autoClear off below. That clear defeats the deliberate per-attachment
    // sentinel clears (faceId 0xFFFFFF / depth far) this G-buffer depends on,
    // collapsing the composite to background (the whole model vanishes). Null it
    // for the capture and restore after — same guard the edge-detection and gloss
    // passes use. The displayed background comes from the renderer clear colour
    // (attachment 0 below), not scene.background, so nothing visible is lost.
    const oldBackground = scene.background;
    scene.background = null;

    renderer.getClearColor(this._clearColor);
    const clearAlpha = renderer.getClearAlpha();

    // ⏱️ TEMPORARY. `__clock` is injected by the pipeline when phase timing is on.
    // The capture is 65% of a whole deferred pass, and it is not the fullscreen work: the AO, composite and
    // FXAA steps measure 0,0-0,2 ms each. This splits the capture into its own parts so the difference
    // between "walking the scene" and "drawing it" is a number.
    const mark: (q: string) => void = (this as any).__clock ?? (() => {});
    // Single scene-graph walk: sort the visible meshes into the three buckets.
    this.classify(scene);
    mark("  classify");

    renderer.autoClear = false;
    renderer.setRenderTarget(this.target.renderTarget);
    this.onPixels?.(this.target.renderTarget.width, this.target.renderTarget.height);

    // Per-attachment sentinel clears (independent of a single colour clear). Skipped when resuming a
    // split capture: clearing mid-way would throw away the chunks already accumulated.
    if (clear && depthOnly) {
      gl.clear(gl.DEPTH_BUFFER_BIT);
    } else if (clear) {
      gl.clearBufferfv(gl.COLOR, 0, [
        this._clearColor.r,
        this._clearColor.g,
        this._clearColor.b,
        clearAlpha,
      ]);
      gl.clearBufferfv(gl.COLOR, 1, [0, 0, 0, 0]); // normal: masked by depth==far
      gl.clearBufferfv(gl.COLOR, 2, [1, 1, 1, 0]); // faceId: 0xFFFFFF / role 0
      gl.clear(gl.DEPTH_BUFFER_BIT); // depth -> 1.0 (far)
    }

    // Non-emitters declare no MRT outputs beyond colour and would corrupt
    // attachments 1/2, so they stay hidden for the whole capture.
    this.setVisible(this._nonEmitters, false);

    mark("  ocultar");
    // Phase 1: opaque emitters fill every attachment plus depth.
    this.setVisible(this._translucent, false);
    // Depth only: no attachment is drawn to. Restored to the set `setRenderTarget` issued and cached, as below.
    if (depthOnly) gl.drawBuffers([gl.NONE, gl.NONE, gl.NONE]);
    renderer.render(scene, camera);
    if (depthOnly) {
      gl.drawBuffers([
        gl.COLOR_ATTACHMENT0,
        gl.COLOR_ATTACHMENT1,
        gl.COLOR_ATTACHMENT2,
      ]);
    }
    mark("  opacos");
    this.setVisible(this._translucent, true);

    // Phase 2: translucent emitters contribute colour only. Detaching attachments
    // 1 (normal) and 2 (faceId) means their writes are dropped, and depth-write is
    // forced off, so the opaque faceId/normal/depth captured behind the glass
    // survive and keep driving the contour + AO. setRenderTarget already issued
    // drawBuffers([0,1,2]) and cached it, so restoring that exact set below leaves
    // three's draw-buffer cache consistent.
    // ⏱️ TEMPORARY probe. Phase 2 is a SECOND full `renderer.render` of the scene, and it measures almost
    // the same as phase 1 (opaque 5,3-6,1 ms vs translucent 4,1-5,4 at 2048x2048; 9,8-14,2 vs 8,5-11,7 at
    // 256x181). It exists only because the model has translucent emitters. `__sinTranslucidos` skips it so
    // the saving is a number before anything is redesigned. The image loses the glass.
    if (
      !depthOnly &&
      this._translucent.length > 0 &&
      (globalThis as any).__sinTranslucidos !== true
    ) {
      this.setVisible(this._opaque, false);
      this.suppressDepthWrite();
      // (Put back whatever the render does: a render that threw here left the saved depth writes in place, and the
      // next frame saved them again on top, each frame, until the list could not grow and every frame died.)
      try {
        gl.drawBuffers([gl.COLOR_ATTACHMENT0, gl.NONE, gl.NONE]);
        renderer.render(scene, camera);
      } finally {
        gl.drawBuffers([
          gl.COLOR_ATTACHMENT0,
          gl.COLOR_ATTACHMENT1,
          gl.COLOR_ATTACHMENT2,
        ]);
        this.restoreDepthWrite();
        this.setVisible(this._opaque, true);
      }
    }
    // The edges of what is seen through: the translucent emitters, and what the view marks see-through (`seeThrough`).
    if (!depthOnly && this.translucentEdges && (this._translucent.length > 0 || this.seeThrough)) {
      this.translucentEdgesInto(renderer, scene, camera, gl);
    }
    mark("  translucidos");

    // Restore the non-emitters and drop the per-frame buckets.
    this.restoreOpaque();
    this.setVisible(this._nonEmitters, true);
    this._nonEmitters.length = 0;
    this._opaque.length = 0;
    this._translucent.length = 0;

    renderer.setRenderTarget(oldTarget);
    renderer.autoClear = oldAutoClear;
    scene.background = oldBackground;
  }

  /**
   * Walk the scene once and bucket every currently-visible mesh: non-emitters
   * (no capture-emission marker), opaque emitters and translucent emitters. An
   * object counts as emitting when at least one of its materials carries the
   * marker (set in the material manager), and as translucent when a material is
   * flagged transparent or has opacity < 1. Objects already hidden by the host
   * are left untouched, exactly as before.
   */
  private classify(scene: THREE.Scene) {
    scene.traverse((object) => {
      const material = (object as THREE.Mesh).material;
      if (!material || !object.visible) return;
      if (!this.emits(material)) {
        this._nonEmitters.push(object);
        return;
      }
      for (const m of Array.isArray(material) ? material : [material]) if (m) paintFlatTints(m);
      if (this.isTranslucent(material) && (!this.translucentAsOpaque || (this.unseen(material) && !this.noOpacityIsGlass))) {
        this._translucent.push(object);
      } else if (this.isTranslucent(material)) {
        this.makeOpaque(material);
        this._opaque.push(object);
      } else {
        this._opaque.push(object);
      }
    });
  }

  /** Every material of it drawn at no opacity: meant not to be seen, so never made into a surface. */
  private unseen(material: THREE.Material | THREE.Material[]): boolean {
    const all = Array.isArray(material) ? material : [material];
    return all.length > 0 && all.every((m) => !m || m.opacity <= 0);
  }

  /** Full, and writing depth, for this capture only; `restoreOpaque` puts each back. */
  private makeOpaque(material: THREE.Material | THREE.Material[]) {
    for (const m of Array.isArray(material) ? material : [material]) {
      if (!m || this._madeOpaque.some((saved) => saved.material === m)) continue;
      // 🔴 WHAT IS DRAWN AT NO OPACITY AT ALL IS MEANT NOT TO BE SEEN, NOT GLASS, AND IT IS NOT DRAWN HERE EITHER.
      // Left as it was, it went through this opaque pass with the rest of its mesh, writing depth, normal and face
      // like a wall: racbasic's rooms share a tile with glass, so the mesh is not `unseen` as a whole, and the
      // living room's volume came out as a white slab over the far wall of the jogged Building Section, its windows
      // and its timber. Switched off for this capture; `restoreOpaque` gives it back.
      if (m.opacity <= 0 && !this.noOpacityIsGlass) {
        this._madeOpaque.push({ material: m, transparent: m.transparent, opacity: m.opacity, depthWrite: m.depthWrite, visible: m.visible });
        m.visible = false;
        continue;
      }
      this._madeOpaque.push({ material: m, transparent: m.transparent, opacity: m.opacity, depthWrite: m.depthWrite });
      m.transparent = false;
      m.opacity = 1;
      m.depthWrite = true;
    }
  }

  private restoreOpaque() {
    for (const saved of this._madeOpaque) {
      saved.material.transparent = saved.transparent;
      saved.material.opacity = saved.opacity;
      saved.material.depthWrite = saved.depthWrite;
      if (saved.visible !== undefined) saved.material.visible = saved.visible;
    }
    this._madeOpaque.length = 0;
  }

  private setVisible(objects: THREE.Object3D[], visible: boolean) {
    for (const object of objects) {
      object.visible = visible;
    }
  }

  private emits(material: THREE.Material | THREE.Material[]): boolean {
    return Array.isArray(material)
      ? material.some((m) => !!m?.userData?.hasCaptureEmission)
      : !!material?.userData?.hasCaptureEmission;
  }

  private isTranslucent(material: THREE.Material | THREE.Material[]): boolean {
    const test = (m: THREE.Material) =>
      !!m && (m.transparent === true || (typeof m.opacity === "number" && m.opacity < 1));
    return Array.isArray(material) ? material.some(test) : test(material);
  }

  /**
   * Force depth-write off on every translucent emitter material and remember each
   * prior value. Translucent surfaces still depth-test, so they stay hidden behind
   * opaque geometry, but they no longer lay down depth: the depth buffer keeps the
   * opaque values from phase 1, so the glass contributes nothing to Hi-Z or AO.
   * `depthWrite` is plain render state, so toggling it forces no shader recompile.
   */
  private suppressDepthWrite() {
    for (const object of this._translucent) {
      const material = (object as THREE.Mesh).material;
      const materials = Array.isArray(material) ? material : [material];
      for (const m of materials) {
        if (!m?.userData?.hasCaptureEmission) continue;
        this._depthWriteSaved.push({ material: m, value: m.depthWrite });
        m.depthWrite = false;
      }
    }
  }

  private restoreDepthWrite() {
    for (const saved of this._depthWriteSaved) {
      saved.material.depthWrite = saved.value;
    }
    this._depthWriteSaved.length = 0;
  }

  /**
   * The edges of what was drawn see-through, stamped into the face buffer (see `translucentEdges`). Called after both
   * phases, with every emitter visible; it hides and locks what each of its steps needs.
   *
   * 1. Their face ids into a target of their own that SHARES the capture's depth, so a wall in front still hides a
   *    mass behind it, and only its id attachment drawn to. A translucent face writes its role 1 as alpha, so normal
   *    blending writes its id whole: the nearest, drawn last in three's back-to-front order, wins.
   * 2. A full-screen pass over the capture's face attachment: where that id differs from its right or upper
   *    neighbour, and one of the two is a translucent surface, a seed unlike any id is written, keeping the pixel's
   *    role (alpha) by blending. The contour finds an id that differs from its neighbours there and inks a line.
   */
  private translucentEdgesInto(
    renderer: THREE.WebGLRenderer,
    scene: THREE.Scene,
    camera: THREE.Camera,
    gl: WebGL2RenderingContext,
  ) {
    const main = this.target.renderTarget;
    const { width, height } = this.target;
    // 🔴 THE DEPTH IS THE CAPTURE'S, AND A TARGET THAT IS RESIZED OR DISPOSED TAKES ITS DEPTH TEXTURE WITH IT. Resized
    // in place, this target deleted the depth the capture had just drawn and the composite was about to read: with no
    // depth every pixel is background, and the pass came out as the raw colour on grey, its masses without a line. It
    // happened whenever the capture changed size between two passes (a thumbnail between two chunks of a photograph),
    // so one chunk of a sheet was wrong on a fresh load and right the next time: the grey band across DACH's cover
    // stair and the grey rectangle over 1-01's masses. So on a new size the old target lets go of the depth first,
    // and a new one is made over the capture's own.
    if (this._edgesTarget && (this._edgesTarget.width !== width || this._edgesTarget.height !== height)) {
      this.edgesTargetDropped();
    }
    if (!this._edgesTarget) {
      this._edgesTarget = new THREE.WebGLRenderTarget(width, height, {
        count: 3,
        depthTexture: this.target.depthTexture,
        minFilter: THREE.NearestFilter,
        magFilter: THREE.NearestFilter,
        depthBuffer: true,
        stencilBuffer: false,
        generateMipmaps: false,
      });
      const [colour, normal, face] = this._edgesTarget.textures;
      colour.type = THREE.HalfFloatType;
      normal.type = THREE.HalfFloatType;
      normal.format = THREE.RGFormat;
      normal.internalFormat = "RG16F";
      face.type = THREE.UnsignedByteType;
      face.format = THREE.RGBAFormat;
    }
    if (!this._edgesMaterial) {
      this._edgesMaterial = new THREE.RawShaderMaterial({
        glslVersion: THREE.GLSL3,
        uniforms: { faces: { value: null } },
        vertexShader: /* glsl */ `
          in vec3 position;
          void main() { gl_Position = vec4(position.xy, 0.0, 1.0); }
        `,
        fragmentShader: /* glsl */ `
          precision highp float;
          precision highp sampler2D;
          uniform sampler2D faces;
          layout(location = 2) out vec4 seed;
          bool differs(vec4 a, vec4 b) {
            if (a.a < 0.5 && b.a < 0.5) return false;   // neither is a see-through surface
            return any(greaterThan(abs(a.rgb - b.rgb), vec3(0.5 / 255.0)));
          }
          void main() {
            ivec2 at = ivec2(gl_FragCoord.xy);
            ivec2 last = textureSize(faces, 0) - 1;
            vec4 here = texelFetch(faces, at, 0);
            vec4 right = texelFetch(faces, min(at + ivec2(1, 0), last), 0);
            vec4 up = texelFetch(faces, min(at + ivec2(0, 1), last), 0);
            if (!differs(here, right) && !differs(here, up)) discard;
            // Unlike its neighbours and never the empty id (1,1,1) nor near zero: a hash of the pixel.
            vec3 h = fract(sin(vec3(dot(vec2(at), vec2(12.9898, 78.233)), dot(vec2(at), vec2(39.346, 11.135)),
              dot(vec2(at), vec2(73.156, 52.235)))) * 43758.5453);
            seed = vec4(0.1 + 0.8 * h, 1.0);
          }
        `,
        depthTest: false,
        depthWrite: false,
        // RGB replaced, alpha (the pixel's role) kept.
        blending: THREE.CustomBlending,
        blendEquation: THREE.AddEquation,
        blendSrc: THREE.OneFactor,
        blendDst: THREE.ZeroFactor,
        blendSrcAlpha: THREE.ZeroFactor,
        blendDstAlpha: THREE.OneFactor,
      });
      const triangle = new THREE.BufferGeometry();
      triangle.setAttribute("position", new THREE.BufferAttribute(new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]), 3));
      const quad = new THREE.Mesh(triangle, this._edgesMaterial);
      quad.frustumCulled = false;
      this._edgesScene = new THREE.Scene();
      this._edgesScene.add(quad);
    }

    // 1. The see-through surfaces' ids, over the opaque depth, into their own face attachment.
    // Not what is drawn at no opacity at all: that is meant not to be seen (`makeOpaque` says the same), a room's
    // volume above all, which has no lines in any drawing. What is meant to be seen through keeps some opacity.
    const skipped = this._translucent.filter((object) => this.unseen((object as THREE.Mesh).material));
    const glass = skipped.length < this._translucent.length;
    if (!glass && !this.seeThrough) return;
    renderer.setRenderTarget(this._edgesTarget);
    gl.drawBuffers([gl.NONE, gl.NONE, gl.COLOR_ATTACHMENT2]);
    // Cleared to nothing, not to the empty id: what the view marks see-through ADDS its ids up (below), and white
    // holds no more.
    gl.clearBufferfv(gl.COLOR, 2, [0, 0, 0, 0]);
    // Nothing here lays down depth: the target shares the capture's, which the composite still reads. Locked, because
    // three sets the mask per material and an opaque see-through wall would write its own.
    const depth = renderer.state.buffers.depth;
    depth.setMask(false);
    depth.setLocked(true);
    if (glass) {
      this.setVisible(this._opaque, false);
      this.setVisible(skipped, false);
      renderer.render(scene, camera);
      this.setVisible(skipped, true);
      this.setVisible(this._opaque, true);
    }
    // And what the view marks see-through, which the capture left out: every emitter drawn again with only those
    // fragments kept (`setSeeThroughPass`), over the same ids, so a see-through wall in front of a glass one wins by depth.
    // 🔴 ADDED UP, NOT THE NEAREST. Nothing here writes depth, so of two see-through faces over a pixel the one drawn
    // last would win, in no order at all: a footing came out as two loose outlines. Each face adds a hash of its id
    // instead (see flat-tint.ts), so the sum changes wherever ANY of the faces over a pixel does, and the edges of the
    // ones behind show through the ones in front, as Revit prints them.
    if (this.seeThrough) {
      this.blended(THREE.AdditiveBlending, () => {
        setSeeThroughPass(true);
        try {
          renderer.render(scene, camera);
        } finally {
          setSeeThroughPass(false);
        }
      });
      // 🔴 AND THEIR VEIL, over what the capture drew: the colour of each at the opacity the view leaves it, into the
      // capture's colour alone and behind the same depth, so the steel a view draws at 80 % prints pale and the bars
      // inside a column at 85 % still show through it.
      renderer.setRenderTarget(main);
      gl.drawBuffers([gl.COLOR_ATTACHMENT0, gl.NONE, gl.NONE]);
      this.blended(THREE.NormalBlending, () => {
        setSeeThroughPass("veil");
        try {
          renderer.render(scene, camera);
        } finally {
          setSeeThroughPass(false);
          gl.drawBuffers([gl.COLOR_ATTACHMENT0, gl.COLOR_ATTACHMENT1, gl.COLOR_ATTACHMENT2]);
        }
      });
    }
    depth.setLocked(false);
    depth.setMask(true);

    // 2. A seed wherever that id changes, into the capture's face attachment.
    renderer.setRenderTarget(main);
    gl.drawBuffers([gl.NONE, gl.NONE, gl.COLOR_ATTACHMENT2]);
    this._edgesMaterial.uniforms.faces.value = this._edgesTarget.textures[2];
    renderer.render(this._edgesScene!, this._edgesCamera);
    gl.drawBuffers([gl.COLOR_ATTACHMENT0, gl.COLOR_ATTACHMENT1, gl.COLOR_ATTACHMENT2]);
  }

  /**
   * Draws with every opaque emitter's material blending the given way, and puts each back.
   *
   * 🔴 ON THE MATERIALS, BECAUSE THE RENDERER SETS IT FROM THEM. three sets the blending for each material from inside
   * its own state, by a function no caller can stand in for: held on `renderer.state` it was not held at all, the
   * see-through faces were neither added up nor laid as a veil, and the last one drawn replaced what was under it
   * (the bars inside DACH's column went the column's grey). A material drawn as transparent keeps its program.
   */
  private blended(blending: THREE.Blending, draw: () => void) {
    const was = new Map<THREE.Material, [THREE.Blending, boolean]>();
    for (const object of this._opaque) {
      const material = (object as THREE.Mesh).material;
      for (const one of Array.isArray(material) ? material : [material]) {
        if (!one || was.has(one)) continue;
        was.set(one, [one.blending, one.transparent]);
        one.blending = blending;
        one.transparent = true;
      }
    }
    try {
      draw();
    } finally {
      for (const [one, [blendingWas, transparentWas]] of was) {
        one.blending = blendingWas;
        one.transparent = transparentWas;
      }
    }
  }

  /** Disposes the edges' target without the depth it shares with the capture (see where it is made). */
  private edgesTargetDropped() {
    if (!this._edgesTarget) return;
    (this._edgesTarget as { depthTexture: THREE.DepthTexture | null }).depthTexture = null;
    this._edgesTarget.dispose();
    this._edgesTarget = null;
  }

  dispose() {
    this.edgesTargetDropped();
    this.target.dispose();
    this._edgesMaterial?.dispose();
  }
}
