// THE POSTPRODUCTION A COMPONENTS WORLD GETS UNDER WEBGPU, MOUNTED OVER ANY SCENE.
//
// Same surface as always, so the components caller (`PostproductionRenderer._mountPipeline`) does not change:
//
//   mountComposition(renderer, scene, camera, options) -> pipeline { render, __refresh, dispose }
//   faceMRT() -> the scene pass's MRT with the face channel's "no element" sentinel
//
// 🔴 THE LOOK IS THE WEBGL DEFERRED ONE. Antonio, 2026-09-13: under WebGPU a world always looks like the
// WebGL DEFERRED pipeline, in every style and with both camera types. The composite that does it is
// `polish/deferred-look.mjs`, the same composite as the WebGL one; the older cues
// (`hints.mjs`, `quill.mjs`) remain in their own pipeline and are no longer mounted here, because they draw a
// different contour and a different sheen.
//
// Knobs:
//   composite  the WebGL `deferred.composite.settings` object (WebGL names, read live every frame). When a
//              host passes it, `colorEnabled` / `contourEnabled` in it decide colour and ink, as they do in
//              WebGL after `_applyDeferredStyle`.
//   style      used instead when there is no `composite`: a `PostproductionAspect` value (default all cues)
//   ao         the ambient occlusion (withGentleTone, the same estimator as the WebGL deferred branch). With a
//              `composite` it is the host's `aoEnabled`; without one the style must also ask for shadows.
//   overlays   the host's live overlay material list (WebGL's `basePass.isolatedMaterials`)
//   view       what the view being drawn says beyond its look, read live (WebGL's `deferred.settings`): its
//              `crop`, along which the contour draws no line, and its `background`, the sky behind the model
//   seams      the occlusion passes of loaders that keep their own scene (point clouds, splats), as
//              `[{ pass, direct }]`: WebGL's `addOcclusionPass`. Compiled in, so registering one remounts.
//   page       a THREE.Color (display values) to paint behind a transparent background, for an opaque
//              canvas; null keeps the alpha, for a transparent one
//   edges      false drops the contour whatever the settings say
//   fxaa       the anti-aliasing tail WebGL DEFERRED runs by default
//   scene8     the scene colour in 8-bit sRGB. OFF by default: WebGL captures colour in half float and
//              tonemaps it, and an 8-bit target clips every lit value above 1 before the tonemap sees it.
//   tonal / sheen / dither   false switches the cue off in the style-built settings
//   faceR8     a one-byte face attachment with no role byte: streamed-only scenes only
//   face / cues / volumenAo / piramideAo   accepted and ignored: the face channel is always built
//              when a cue needs it, and the rest belonged to earlier pipelines.

import * as THREE from "three";
import {
  output, vec4, vec2, float, normalView, nodeObject, Fn, mix, uv, floor, texture, If,
  screenSize, max, normalize, cross, getViewPosition, uniform,
} from "three/tsl";

/**
 * A layer laid over the frame as straight-alpha "over": `a + A·(1 − a)` for the alpha, and the colour weighted by what
 * each side keeps, divided back by that alpha.
 *
 * 🔴 NOT `mix(frame, layer, a)` WITH THE ALPHA ADDED ON. An empty pixel of the frame carries the clear colour (paper
 * white, `clearRgb`) at alpha 0, so mixing a layer into that white and then handing the sheet the layer's alpha laid
 * the layer over the paper TWICE. Measured on A101's sun band over empty sky: (240, 198, 161) where WebGL draws
 * (239, 193, 133), and the same (174, 110, 39) over the terrain, where the frame is opaque and both formulas agree.
 */
function layOver(colour, rgb, coverage) {
  const alpha = colour.a.add(coverage.mul(float(1).sub(colour.a)));
  const kept = colour.a.mul(float(1).sub(coverage));
  const over = rgb.mul(coverage).add(colour.rgb.mul(kept)).div(max(alpha, float(1e-6)));
  return vec4(alpha.greaterThan(1e-6).select(over, colour.rgb), alpha);
}
import { withDeferredFxaa } from "./core/polish/deferred-fxaa.mjs";
import { withGentleTone } from "./core/polish/gentle-tone.mjs";
import { withDeferredLook, deferredLookDefaults, lineRadius, MAX_LINE_RADIUS, LOOK_KNOBS } from "./core/polish/deferred-look.mjs";
import { contourTilesNode } from "./core/polish/contour-tiles.mjs";
import { sunStateNew } from "./core/polish/sun-shadow.mjs";
import { PostproductionAspect, flipsFor } from "./core/polish/manners.mjs";
import { targetAwareMRT } from "./target-aware-mrt.mjs";

/**
 * 🔴 THE PASS-LEVEL FACE CHANNEL IS A SENTINEL, NOT AN ATTRIBUTE READ.
 *
 * three builds each material's output from the pass MRT and merges the material's own `mrtNode` over it,
 * channel by channel. A pass MRT that read `attribute("face")` therefore asked EVERY material in the scene
 * for an attribute only streamed geometry has. With a constant here every material draws, the ones without
 * an id write "no element" (id 0xFFFFFF, role 0, the WebGL capture's clear), and the materials that do
 * carry one (streamed pieces, local fragments shells) override `face` with it.
 */
export function faceMRT() {
  return targetAwareMRT({ output, face: vec4(1, 1, 1, 0) });
}

/**
 * 🔴 OVERLAYS, DRAWN AS WEBGL DEFERRED DRAWS THEM: OUTSIDE THE SCENE, OVER THE FINISHED FRAME.
 *
 * `basePass.isolatedMaterials` (the floor grid, hover and selection highlights, section lines) never enter
 * the WebGL capture. After the composite and FXAA, the ones with `depthTest` are redrawn against the
 * captured depth and the rest flat, each into its own transparent layer with blending off, and each layer
 * is laid over the frame once with straight alpha (`pipeline-v2.ts`, `renderDepthOverlay` / `paintOverlay`).
 *
 * Measured why it matters, on the PostproductionRenderer example: with the grid drawn inside the scene pass
 * the ground came out `737e70` against WebGL's `556350`, and with the grid hidden `53644d`. The grid was
 * being tonemapped and composited as if it were a surface, over a ground WebGL draws it under.
 *
 * Built lazily because `three` is only the WebGPU build when a composition is mounted.
 */
let passClasses = null;

/**
 * `?overlayProxy=1`: an overlay layer draws a stand-in group whose `children` ARE the overlay objects, instead
 * of the whole scene with everything else hidden.
 *
 * The hide-everything way walks the scene, flips `visible` on every drawable object, turns every bundle group
 * back into loose objects for the pass and restores it all afterwards: on a 37-model federation 2,700
 * objects for ONE grid plane, 1.0 ms of main thread a frame. The stand-in lists the overlay objects without
 * adopting them (their `parent` and world matrices stay the scene's, already current from the scene pass), so
 * nothing is hidden, no bundle is touched and three projects a handful of objects. Off is the control.
 */
export const OVERLAY_KNOBS = { proxy: false };

function overlayPassClasses() {
  if (passClasses) return passClasses;
  const { PassNode } = THREE;

  /** The scene pass, with the overlay materials hidden while it draws (WebGL's `hideForCapture`). */
  class ScenePass extends PassNode {
    constructor(scene, camera, overlays, capture = null) {
      super(PassNode.COLOR, scene, camera);
      this.overlays = overlays;
      // The host's capture switches (WebGL's `deferred.capture`), read live: `translucentAsOpaque`.
      this.capture = capture;
    }

    updateBefore(frame) {
      const hidden = [];
      for (const material of this.overlays) {
        if (!material.visible) continue;
        material.visible = false;
        hidden.push(material);
      }
      // 🔴 TRANSLUCENT SURFACES LAY DOWN NO DEPTH, as in the WebGL capture's translucent phase: glass stays
      // hidden behind opaque geometry but leaves the depth of what is behind it, so the AO and the contour
      // see the room through the window rather than the pane. Measured on the PostproductionRenderer example
      // at the courtyard camera: with the four glass materials hidden, PEN ink recall against WebGL went
      // from 0.655 to 0.999. Plain render state, so toggling it recompiles nothing.
      // 🔴 EXCEPT IN A LINE DRAWING, WHICH HAS NO GLASS TO SEE THROUGH (the host's `translucentAsOpaque`, as in
      // the WebGL capture). A hidden-line view draws a glazed wall as a white surface with its strokes on it,
      // never the room behind. There a translucent surface is drawn full and writing depth for this pass, and
      // one drawn at no opacity at all, which is meant not to be seen, is not drawn: it would stand as a slab.
      const asOpaque = this.capture?.translucentAsOpaque === true;
      const depthWriters = [];
      const madeOpaque = [];
      const seen = new Set();
      this.scene.traverse((object) => {
        if (!object.visible) return;
        const material = object.material;
        if (!material) return;
        const materials = Array.isArray(material) ? material : [material];
        for (const m of materials) {
          if (!m || seen.has(m)) continue;
          seen.add(m);
          const translucent = m.transparent === true || (typeof m.opacity === "number" && m.opacity < 1);
          if (!translucent) continue;
          if (asOpaque) {
            if (!m.visible) continue;
            madeOpaque.push([m, m.transparent, m.opacity, m.depthWrite]);
            if (m.opacity <= 0) {
              m.visible = false;
            } else {
              m.transparent = false;
              m.opacity = 1;
              m.depthWrite = true;
            }
            continue;
          }
          if (!m.depthWrite) continue;
          m.depthWrite = false;
          depthWriters.push(m);
        }
      });
      // 🔴 CLEARED TRANSPARENT, WHOEVER DRAWS IT (Designer 2026-10-14, measured). This pass is drawn from inside an
      // RTTNode of the composite, whose `resetRendererState` leaves the clear at black with alpha 1: the empty sky
      // came out opaque black, the page colour behind it (`page`, `rgb + page·(1 − alpha)`) was multiplied by 0 and
      // the 3D background was black instead of the page's #19191E. As the overlay pass does below.
      const { renderer } = frame;
      const clearColour = renderer.getClearColor(new THREE.Color());
      const clearAlpha = renderer.getClearAlpha();
      renderer.setClearColor(0x000000, 0);
      try {
        super.updateBefore(frame);
      } finally {
        renderer.setClearColor(clearColour, clearAlpha);
        for (const material of hidden) material.visible = true;
        for (const material of depthWriters) material.depthWrite = true;
        for (const [m, transparent, opacity, depthWrite] of madeOpaque) {
          m.visible = true;
          m.transparent = transparent;
          m.opacity = opacity;
          m.depthWrite = depthWrite;
        }
      }
    }
  }

  /** One overlay layer: only the objects that carry an overlay material, on a transparent target. */
  class OverlayPass extends PassNode {
    constructor(scene, camera, overlays, depthTested, scenePass) {
      super(PassNode.COLOR, scene, camera);
      this.overlays = overlays;
      this.depthTested = depthTested;
      this.scenePass = scenePass;
      // Eight bits, as WebGL's overlay targets, so an overlay clamps where it clamps there.
      this.renderTarget.texture.type = THREE.UnsignedByteType;
      // ⚰️ THE DEPTH IS NOT BORROWED. WebGL attaches the capture's depth to its overlay target; here the
      // scene pass's depth texture attached to this target was destroyed under the scene pass every frame
      // ("Destroyed texture [Texture "depth"] used in a submit"), even with this target resized on its own
      // depth first, and the frame came out empty. This layer writes its own depth instead and the
      // composite keeps a pixel only where that depth is in front of the scene's: the same test, per pixel.
    }

    updateBefore(frame) {
      const { renderer } = frame;
      const { scene } = this;
      const picked = new Set(
        this.overlays.filter((material) => (material.depthTest !== false) === this.depthTested),
      );
      if (OVERLAY_KNOBS.proxy) return this.updateBeforeByProxy(frame, picked);
      const hidden = [];
      const restore = [];
      // 🔴 A BUNDLE GROUP REPLAYS WHAT IT RECORDED AND DOES NOT SEE THE PIECES HIDDEN BELOW, so with the
      // streamed pieces bundled (`opaqueBundles`, `glassBundles`) every piece was drawn into this layer too,
      // and the glass, whose depth is in front of the scene's, was laid over the frame: 35,381 pixels near a
      // building. For this layer the groups draw their children one by one, as they did before bundles.
      const unbundled = [];
      scene.traverse((object) => {
        if (!object.visible) return;
        if (object.isBundleGroup) {
          object.isBundleGroup = false;
          unbundled.push(object);
        }
        const material = object.material;
        if (!material) return;
        const materials = Array.isArray(material) ? material : [material];
        if (!materials.some((m) => picked.has(m))) {
          object.visible = false;
          hidden.push(object);
          return;
        }
        for (const m of materials) {
          if (!picked.has(m)) continue;
          if (!this.depthTested && m.userData?.preserveBlending) continue;
          restore.push([m, m.blending, m.depthWrite]);
          // Blending off, so overlapping layers of one colour collapse to one instead of a lighter wash.
          m.blending = THREE.NoBlending;
          // Written into this layer's own depth, which the composite tests against the scene's.
          if (this.depthTested) m.depthWrite = true;
        }
      });
      const clearColour = renderer.getClearColor(new THREE.Color());
      const clearAlpha = renderer.getClearAlpha();
      const clearDepth = renderer.autoClearDepth;
      const background = scene.background;
      renderer.setClearColor(0x000000, 0);
      scene.background = null;
      try {
        super.updateBefore(frame);
      } finally {
        renderer.setClearColor(clearColour, clearAlpha);
        renderer.autoClearDepth = clearDepth;
        scene.background = background;
        for (const object of hidden) object.visible = true;
        for (const group of unbundled) group.isBundleGroup = true;
        for (const [m, blending, depthWrite] of restore) {
          m.blending = blending;
          m.depthWrite = depthWrite;
        }
      }
    }

    /** `OVERLAY_KNOBS.proxy`: the same layer, drawn from a stand-in that lists only the overlay objects. */
    updateBeforeByProxy(frame, picked) {
      const { renderer } = frame;
      const scene = this.scene;
      // Only visible branches, as three itself would draw them. Nothing is flipped on the way.
      const users = [];
      scene.traverseVisible((object) => {
        const material = object.material;
        if (!material) return;
        const materials = Array.isArray(material) ? material : [material];
        if (materials.some((m) => picked.has(m))) users.push(object);
      });
      const restore = [];
      for (const m of picked) {
        if (!this.depthTested && m.userData?.preserveBlending) continue;
        restore.push([m, m.blending, m.depthWrite]);
        m.blending = THREE.NoBlending;
        if (this.depthTested) m.depthWrite = true;
      }
      // A plain group, never adopted by anyone: three walks `children` and reads each object's own
      // `matrixWorld`, which the scene pass has just brought up to date. Not a Scene, so three falls back
      // to an empty environment, which is what an overlay layer drawn without lights and background needs.
      const proxy = this._proxy ?? (this._proxy = new THREE.Group());
      proxy.matrixWorldAutoUpdate = false;
      proxy.children = users;
      const clearColour = renderer.getClearColor(new THREE.Color());
      const clearAlpha = renderer.getClearAlpha();
      const clearDepth = renderer.autoClearDepth;
      renderer.setClearColor(0x000000, 0);
      this.scene = proxy;
      try {
        super.updateBefore(frame);
      } finally {
        this.scene = scene;
        proxy.children = [];
        renderer.setClearColor(clearColour, clearAlpha);
        renderer.autoClearDepth = clearDepth;
        for (const [m, blending, depthWrite] of restore) {
          m.blending = blending;
          m.depthWrite = depthWrite;
        }
      }
    }
  }

  /**
   * The OUTLINE MASK: the host's outline pass hands over a scene of ghost
   * proxies (one id-writing material per group), and this pass renders it
   * into an RGBA8 target — group id in the R byte, 0 where nothing is
   * outlined, own depth so the closest outlined surface wins across groups.
   * Only mounted while something IS outlined (`options.outline`), so an app
   * that never outlines pays nothing.
   */
  class OutlineMaskPass extends PassNode {
    constructor(maskScene, camera) {
      super(PassNode.COLOR, maskScene, camera);
      // Data, not colour: the composite decodes the R byte back into an id.
      this.renderTarget.texture.type = THREE.UnsignedByteType;
      this.renderTarget.texture.colorSpace = THREE.NoColorSpace;
      this.renderTarget.texture.minFilter = THREE.NearestFilter;
      this.renderTarget.texture.magFilter = THREE.NearestFilter;
    }

    updateBefore(frame) {
      const { renderer } = frame;
      const clearColour = renderer.getClearColor(new THREE.Color());
      const clearAlpha = renderer.getClearAlpha();
      renderer.setClearColor(0x000000, 0);
      try {
        super.updateBefore(frame);
      } finally {
        renderer.setClearColor(clearColour, clearAlpha);
      }
    }
  }

  /**
   * 🔴 THE OCCLUSION SEAM: `pipeline-v2`'s step 7, which had no WebGPU twin until now.
   *
   * Point clouds and gaussian splats do NOT live in the world scene. Each loader keeps its own private
   * scene and hands the renderer a callback, which WebGL fires after the composite with the capture's
   * depth ATTACHED to the frame, so the GPU depth-tests the points against the real BIM depth. Under
   * WebGPU the registered callbacks were stored in a Map and never called, so neither loader drew
   * anything: the material port was necessary and not sufficient.
   *
   * ⚰️ THE DEPTH IS NOT BORROWED HERE EITHER, for the reason `OverlayPass` records: the scene pass's
   * depth texture attached to another target is destroyed under the scene pass every frame. So this
   * layer writes its OWN depth and the composite keeps a pixel only where that depth is in front of
   * the scene's — the same test as WebGL's, done per pixel instead of by the depth unit.
   *
   * The pass renders an EMPTY scene through `PassNode` first, which is not waste: that is what sizes
   * the target, binds it and clears it. The consumer then draws into the SAME bound target with
   * `autoClear` off.
   */
  class SeamPass extends PassNode {
    constructor(camera, draw, scenePass) {
      super(PassNode.COLOR, new THREE.Scene(), camera);
      this.draw = draw;
      this.scenePass = scenePass;
    }

    updateBefore(frame) {
      const { renderer } = frame;
      const clearColour = renderer.getClearColor(new THREE.Color());
      const clearAlpha = renderer.getClearAlpha();
      renderer.setClearColor(0x000000, 0);
      try {
        super.updateBefore(frame);
        const previous = renderer.getRenderTarget();
        const autoClear = renderer.autoClear;
        renderer.setRenderTarget(this.renderTarget);
        renderer.autoClear = false;
        try {
          this.draw({
            renderer,
            camera: this.camera,
            target: this.renderTarget,
            // This layer's own depth, not the scene's (see above). A consumer must not attach it
            // elsewhere; the composite is what tests it against the BIM depth.
            depth: this.renderTarget.depthTexture,
            // 🔴 THE SCENE'S DEPTH, TO SAMPLE — the one thing a LAYER consumer cannot do without.
            // A layer that writes no depth of its own (gaussian splats: transparent, sorted, never
            // depth-writing) has nothing for the composite to gate on, and WebGPU will not lend it
            // the attachment. So it is handed the scene's depth as a TEXTURE and does the occlusion
            // test per fragment, which is what WebGL gets for free from the borrowed attachment.
            sceneDepth: this.scenePass?.renderTarget?.depthTexture ?? null,
            width: this.renderTarget.width,
            height: this.renderTarget.height,
          });
        } finally {
          renderer.autoClear = autoClear;
          renderer.setRenderTarget(previous);
        }
      } finally {
        renderer.setClearColor(clearColour, clearAlpha);
      }
    }
  }

  /**
   * 🔴 THE SCENE AS THE SUN SEES IT, for the cast shadows of a drawing (`core/polish/sun-shadow.mjs`).
   *
   * The scene itself, with its own materials, and not an override: a fragments mesh places its vertices in its
   * own shader, and whatever clips the view (a section's planes, a view's crop) is cut away from the sun too,
   * which is what a drawing's shadow is: the shadow of what the view shows. Only its depth is read.
   *
   * It draws when the host's view has a sun (`state.on`) and costs nothing when it has not: the composite
   * holds this pass's depth either way, so a view with shadows after one without needs no remount.
   *
   * 🔴 ONE TARGET OF ONE SIZE, AND EACH MAP IN A CORNER OF IT. A map needs as many texels as the pass it serves
   * has pixels, which changes from one photograph to the next, and resizing the target for each was the first
   * thing tried: the composite went on reading the texture the resize had just destroyed, and every tile came
   * out with a sawtooth of shadow that belonged to no building. So the target is as large as the largest map
   * allowed (`state.most`) from the start and is never resized; a map of `state.side` is drawn into its first
   * `side` texels each way, and the composite scales its lookup by `side / most`.
   */
  class SunPass extends PassNode {
    constructor(scene, state, overlays) {
      super(PassNode.COLOR, scene, state.camera);
      this.state = state;
      this.overlays = overlays;
      // Only the depth is read: the smallest colour a pass can carry.
      this.renderTarget.texture.type = THREE.UnsignedByteType;
      this.renderTarget.texture.format = THREE.RedFormat;
      this.setSize(state.most, state.most);
    }

    updateBefore(frame) {
      const { state } = this;
      if (!state.on) return;
      const { renderer } = frame;
      const side = Math.min(state.side, state.most);
      this.renderTarget.viewport.set(0, 0, side, side);
      this.renderTarget.scissor.set(0, 0, side, side);
      this.renderTarget.scissorTest = true;
      const hidden = [];
      for (const material of this.overlays) {
        if (!material.visible) continue;
        material.visible = false;
        hidden.push(material);
      }
      // 🔴 A TRANSLUCENT SURFACE CASTS A FULL SHADOW (Antonio 19-10, Planner's roof plan): a drawing's shadow is
      // the building's, solid, as the PDF prints it, not one with its windows cut out as parallelograms of light.
      // So for the sun it is drawn opaque and writing depth, as the line drawing's `translucentAsOpaque` does,
      // and given back after. Never drawn blending: this target's colour is one byte, and a surface that blends
      // needs an alpha to blend with ("reading alpha but it is missing from fragment output", and the whole pass
      // is refused). What is drawn at no opacity is not there (room volumes): that one is not drawn at all.
      const unseen = [];
      const madeOpaque = [];
      const seen = new Set();
      this.scene.traverse((object) => {
        if (!object.visible) return;
        const material = object.material;
        if (!material) return;
        for (const m of Array.isArray(material) ? material : [material]) {
          if (!m || seen.has(m)) continue;
          seen.add(m);
          if (!m.visible) continue;
          if (m.transparent !== true && !(typeof m.opacity === "number" && m.opacity < 1)) continue;
          if (typeof m.opacity === "number" && m.opacity <= 0) {
            m.visible = false;
            unseen.push(m);
            continue;
          }
          madeOpaque.push([m, m.transparent, m.opacity, m.depthWrite]);
          m.transparent = false;
          m.opacity = 1;
          m.depthWrite = true;
        }
      });
      const target = renderer.getRenderTarget();
      const mrt = renderer.getMRT();
      const background = this.scene.background;
      this.scene.background = null;
      // 🔴 CLEARED BEFORE EACH MAP, whatever the host's `autoClear` says. A host that paints its own quads turns
      // `autoClear` off for the whole renderer (the modelling canvas does), and then this render laid each map's
      // depth over the last one's without wiping it: the nearest of every map drawn so far stood in the target,
      // from other views, other suns and other sides. Measured on racbasic's site plan zoomed in after A104 had
      // been drawn: square blocks of shadow (102 on 255, the print's tone) that stayed with the whole model
      // hidden, because nothing of this pass cast them.
      const autoClear = renderer.autoClear;
      try {
        renderer.setRenderTarget(this.renderTarget);
        renderer.setMRT(null);
        renderer.autoClear = true;
        renderer.render(this.scene, state.camera);
      } finally {
        renderer.autoClear = autoClear;
        renderer.setRenderTarget(target);
        renderer.setMRT(mrt);
        this.scene.background = background;
        for (const material of hidden) material.visible = true;
        for (const material of unseen) material.visible = true;
        for (const [m, transparent, opacity, depthWrite] of madeOpaque) {
          m.transparent = transparent;
          m.opacity = opacity;
          m.depthWrite = depthWrite;
        }
      }
    }
  }

  passClasses = { ScenePass, OverlayPass, OutlineMaskPass, SeamPass, SunPass };
  return passClasses;
}

export function mountComposition(renderer, scene, camera, options = {}) {
  const {
    ao: wantsTone = true,
    edges = true,
    fxaa = true,
    scene8 = false,
    tonal = true,
    sheen = true,
    dither = true,
    // The scene pass at this fraction of the canvas (1 = full). A host keeps two mounts, one at 1 and one lower,
    // and draws with the lower one while the camera moves: the canvas and every target keep their size, so a
    // switch rebuilds nothing (04-10: changing the pixel ratio cost a ~25-30 ms frame per switch, two per pause).
    sceneScale = 1,
  } = options;
  if (options.volumenAo || options.piramideAo) {
    console.warn("[composition] volumenAo/piramideAo belonged to the previous pipeline; they do not exist here");
  }

  // 🔴 WHAT IS SHOWN DECIDES WHAT IS BUILT, NOT WHAT IS MULTIPLIED BY ZERO. A style's numeric values are the
  // WebGL `PostproductionAspect`'s (COLOR 0, PEN 1, PEN_SHADOWS 2, COLOR_PEN 3, COLOR_SHADOWS 4,
  // COLOR_PEN_SHADOWS 5) and resolve to the same three switches WebGL's `_applyDeferredStyle` sets.
  let settings = options.composite;
  let wantsShade = wantsTone;
  if (!settings) {
    const manner = options.style ?? PostproductionAspect.HUE_QUILL_SHADOWS;
    const { extraHue, extraPigment, extraShadeCast } = flipsFor(manner);
    settings = deferredLookDefaults();
    settings.colorEnabled = extraHue;
    settings.contourEnabled = extraPigment;
    if (!tonal) settings.tonalShadingEnabled = false;
    if (!sheen) {
      settings.glossFactor = 0;
      settings.fresnelFactor = 0;
    }
    if (!dither) settings.ditherAmount = 0;
    wantsShade = wantsTone && extraShadeCast;
  }
  const wantsInk = edges && settings.contourEnabled === true;
  // The id carries the contour and, in its alpha, which surfaces the AO leaves out.
  const wantsFace = wantsInk || wantsShade;

  // `overlays` is the host's live list (WebGL's `basePass.isolatedMaterials`). Which layers exist is decided
  // here; which materials go in each is read again every frame, as WebGL does.
  const overlaySource = options.overlays ?? [];
  const hasDepthOverlays = overlaySource.some((material) => material.depthTest !== false);
  const hasFlatOverlays = overlaySource.some((material) => material.depthTest === false);
  const { ScenePass, OverlayPass, SunPass } = overlayPassClasses();
  const principalPass = new ScenePass(scene, camera, overlaySource, options.capture ?? null);
  const principalSweep = nodeObject(principalPass);
  if (sceneScale !== 1) principalPass.setResolutionScale(sceneScale);
  // The colour is read once per pixel at its own texel centre: nearest returns the same value in one fetch.
  principalSweep.renderTarget.texture.minFilter = THREE.NearestFilter;
  principalSweep.renderTarget.texture.magFilter = THREE.NearestFilter;
  if (scene8) {
    // Eight bits in the TARGET, not only the colour space: an owned renderer gets it from its
    // `outputBufferType`, which a host renderer does not set, so the pass was half float here and wrote twice
    // the bytes per fragment while calling itself eight-bit.
    principalSweep.renderTarget.texture.colorSpace = THREE.SRGBColorSpace;
    principalSweep.renderTarget.texture.type = THREE.UnsignedByteType;
  }

  const channels = { output };
  if (wantsFace) channels.face = vec4(1, 1, 1, 0);
  // 🔴 THE NORMAL IS BUILT ONLY WHEN SOMETHING READS IT: the tonal shade and the sheen. A full-resolution RGBA
  // attachment written by every fragment is a real cost on this machine (measured: 0.63 ms for
  // one), and with both cues off it bought nothing. Turning either on remounts (`compiled.normal`).
  const wantsNormal = settings.tonalShadingEnabled === true || settings.glossFactor > 0 || settings.fresnelFactor > 0;
  // `faceR8`: one byte of id and no role byte, the streamed face attachment. Enough for streamed ids, which
  // are eight bits; NOT for local fragments, whose ids are 24, so it is opt-in for streamed-only scenes.
  const faceR8 = options.faceR8 === true;
  // The view normal the WebGL G-buffer carries, for the tonal shade and the sheen. Eight bits a channel is
  // a thousandth of |N·V| at worst, below what the tonal floor can show.
  //
  // 🔴 ALPHA 0 ON BOTH EXTRA CHANNELS, AND MATERIAL BLENDING ON THEM, WHICH IS WHAT MAKES THE ALPHA MATTER.
  // three writes every MRT channel but `output` with NO blending unless the pass's MRT says otherwise
  // (`WebGPUPipelineUtils` reads the render context's MRT, this one). With the default, each glass pane
  // overwrote the face id and the normal of the room behind it, and a PEN frame lost every line seen through
  // a window: ink recall against WebGL 0.655 at the courtyard camera, 0.999 with the glass hidden. With
  // material blending an opaque surface still writes as is (it does not blend), and a translucent one blends
  // by the alpha written here, 0, so it leaves what is behind it: what the WebGL capture gets by detaching
  // those attachments while it draws translucent surfaces. Nothing reads these alphas as data except the
  // face's role byte, and 0 is "opaque".
  // `normalFromDepth` (`globalThis.__normalFromDepth`, read at mount): no normal attachment at all; the composite
  // rebuilds the view normal from three depth reads (this texel, the next one right, the next one down). BIM is
  // drawn with flat faces, so the face normal IS the surface normal away from silhouettes, where the contour inks
  // anyway. Measured 03-10 on a large federation: the scene pass writes 16 bytes a fragment (8 colour + 4 face + 4 normal) and
  // the composite reads them back; the normal is a quarter of both.
  const normalFromDepth = wantsNormal && (options.normalFromDepth ?? globalThis.__normalFromDepth) === true;
  if (wantsNormal && !normalFromDepth) channels.normal = vec4(normalView.mul(0.5).add(0.5), 0);
  // Target-aware, so merging it with a material's own MRT never names a channel this pass lacks.
  const passMRT = targetAwareMRT(channels);
  const materialBlending = new THREE.BlendMode(THREE.MaterialBlending);
  for (const name of ["face", "normal"]) {
    // ⚠️ NOT on a one-byte face: material blending on a translucent surface reads the target's alpha, which an
    // R8 attachment does not have, and WebGPU rejects the pipeline ("reading alpha but it is missing from
    // fragment output"), so the surface stops drawing. An R8 face therefore has no blending.
    if (name === "face" && faceR8) continue;
    if (channels[name]) passMRT.setBlendMode(name, materialBlending);
  }
  principalSweep.setMRT(passMRT);
  for (const name of ["face", "normal"]) {
    if (!channels[name]) continue;
    // RGBA and eight bits: a local fragments faceId is 24 bits packed across RGB, with the role in alpha.
    // `faceR8` keeps only the first byte.
    const image = principalSweep.getTexture(name);
    image.format = name === "face" && faceR8 ? THREE.RedFormat : THREE.RGBAFormat;
    // Data, not colour: `getTexture` clones the output texture, which `scene8` has just made sRGB, and an sRGB
    // id attachment would bend every byte on the way in.
    image.colorSpace = THREE.NoColorSpace;
    // 🔴 NEAREST, BECAUSE EVERY READ LANDS ON A TEXEL CENTRE. The composite samples at `uv()` of a full-screen
    // quad plus whole-texel offsets, so a linear filter returns the same value after four fetches instead of
    // one — and the contour makes thirteen of these reads a pixel.
    image.minFilter = THREE.NearestFilter;
    image.magFilter = THREE.NearestFilter;
    image.type = THREE.UnsignedByteType;
    image.name = name;
  }

  const deepnessTick = principalSweep.getTextureNode("depth");

  let craftedTone = null;
  let aoSized = [renderer.domElement.width, renderer.domElement.height];
  if (wantsShade) {
    craftedTone = withGentleTone(renderer, {
      deepnessTick,
      camera,
      facetKeyVertexPoint: null,
    });
  }

  // The sun's pass, for a host that states what the view says (`options.view`): its shadows are one of them.
  // Only once the host has stated a sun (`options.sunMost`, the most texels a side its map may have): the
  // target is allocated whole, and a host whose views cast no shadow should not hold it.
  const sunState = options.view && options.sunMost > 0 ? sunStateNew(options.sunMost) : null;
  const sunPass = sunState ? new SunPass(scene, sunState, overlaySource) : null;

  // The contour's seeds by tiles in a compute pass: the same lines for fewer reads (`contour-tiles.mjs`). On by
  // default (Antonio, 2026-10-03, after seeing it); `globalThis.__contourTiles = false` before mounting is the
  // control. Only where the look would draw the same thing: no view, a face with its role byte.
  const contourTiles = globalThis.__contourTiles !== false && wantsInk && !options.view && !faceR8
    ? contourTilesNode({
      renderer,
      faceTexture: principalSweep.getTexture("face"),
      depthTexture: principalSweep.renderTarget.depthTexture,
      reach: lineRadius(settings),
      maxRadius: MAX_LINE_RADIUS,
      reversed: renderer.reversedDepthBuffer === true,
      emptyFromFace: (globalThis.__lookKnobs ?? LOOK_KNOBS).emptyFromFace === true,
    })
    : null;
  // The normal from depth (see `normalFromDepth`): the same `sample(coord) → rgb = n × 0.5 + 0.5` surface the
  // composite reads, built from the depth at the texel and its right and lower neighbours, facing the camera.
  // A uniform over the camera's own matrix object: three updates it in place, so it is current every frame.
  const sceneUnproject = normalFromDepth ? uniform(camera.projectionMatrixInverse) : null;
  const depthNormal = normalFromDepth ? {
    sample(coord) {
      // One texel OF THE DEPTH, which is at `sceneScale` of the canvas (04-10). A canvas texel is half a depth
      // texel at 0.5: half the neighbour reads landed in the same depth texel, the cross product collapsed, and
      // wide grazing surfaces (floors) came out with wrong normals while moving: the gradient reflection there
      // went dark and came back on stopping (Antonio).
      const texel = vec2(1).div(screenSize.mul(sceneScale));
      // The SCENE camera's inverse projection. `cameraProjectionMatrixInverse` is whatever camera renders the
      // node, which for this full-screen pass is the quad's: every rebuilt normal came out nearly facing the eye,
      // so the tonal shade barely moved and the gradient reflection went flat while moving (04-10).
      const at = (c) => getViewPosition(c, deepnessTick.sample(c).r, sceneUnproject);
      const p = at(coord);
      const n = normalize(cross(at(coord.add(vec2(texel.x, 0))).sub(p), at(coord.add(vec2(0, texel.y))).sub(p)));
      const facing = n.z.lessThan(0).select(n.negate(), n);
      return vec4(facing.mul(0.5).add(0.5), 1);
    },
  } : null;
  const look = withDeferredLook({
    seedDistance: contourTiles ? contourTiles.node : null,
    colourTex: principalSweep.getTextureNode("output"),
    depthImage: deepnessTick,
    normalTex: wantsNormal ? depthNormal ?? principalSweep.getTextureNode("normal") : null,
    faceTex: wantsInk ? principalSweep.getTextureNode("face") : null,
    faceHasRole: !faceR8,
    ao: craftedTone ? craftedTone.upsampled : null,
    camera,
    renderer,
    settings,
    pageColour: options.page ?? null,
    view: options.view ?? null,
    sunDepth: sunPass ? nodeObject(sunPass).getTextureNode("depth") : null,
    sunState,
    sceneScale,
  });

  const post = new THREE.RenderPipeline(renderer);
  // The composite tonemaps and gamma-encodes on its own, as the WebGL one does.
  post.outputColorTransform = false;
  // The same FXAA as the WebGL pipeline's, not three's `FXAANode`: see `deferred-fxaa.mjs` for the measured
  // difference on a one-pixel contour.
  // With `sceneScale` the composite is drawn at the scene's size too and the FXAA, which reads it bilinearly,
  // is the upscale to the canvas: composing at full size cost the scaled pipeline 4-7 ms more than a lower pixel
  // ratio (04-10).
  let frameNode = fxaa ? withDeferredFxaa(look.node, { scale: sceneScale }) : look.node;

  // ── The occlusion seam: the loaders that keep their own scene (points, splats) ───────────────────
  // WebGL's step 7, in the same place in the frame: over the finished, antialiased image and UNDER the
  // overlays and the outline. DIRECT draws opaque straight over (points, which self-occlude in their own
  // depth); LAYER composites premultiplied (splats, which are transparent). Both are gated per pixel by
  // the layer's depth against the scene's, which is the BIM occlusion.
  const seamSource = options.seams ?? [];
  const seamPasses = [];
  if (seamSource.length > 0) {
    const { SeamPass } = overlayPassClasses();
    const reversed = renderer.reversedDepthBuffer === true;
    const seams = [];
    for (const { pass, direct } of seamSource) {
      const seamPass = new SeamPass(camera, pass, principalPass);
      seamPasses.push(seamPass);
      const sweep = nodeObject(seamPass);
      seams.push({
        colour: sweep.getTextureNode(),
        depth: sweep.getTextureNode("depth"),
        direct: direct !== false,
      });
    }
    const under = frameNode;
    frameNode = Fn(() => {
      const colour = under.toVar();
      for (const seam of seams) {
        const texel = seam.colour.toVar();
        if (seam.direct) {
          // The layer wrote its own depth (opaque points), so the composite can do the test the
          // depth unit does in WebGL: keep the pixel only where it is in front of the scene.
          const mine = seam.depth.r;
          const scenes = deepnessTick.r;
          const inFront = reversed ? mine.greaterThanEqual(scenes) : mine.lessThanEqual(scenes);
          const coverage = inFront.select(texel.a, float(0));
          // With its alpha, for the reason the overlay layers give below (`layOver`).
          colour.assign(layOver(colour, texel.rgb, coverage));
        } else {
          // 🔴 NO DEPTH GATE HERE, AND THAT IS THE DESIGN, not an omission. A LAYER consumer is
          // transparent and sorted and writes NO depth (splats), so this layer's depth stays at
          // its clear value: gating on it would keep the layer only over the background, which is
          // the whole scene minus the part that matters. The consumer is handed the scene's depth
          // as a texture (`sceneDepth`) and discards behind it per fragment instead.
          colour.assign(
            vec4(texel.rgb.add(colour.rgb.mul(float(1).sub(texel.a))), colour.a.add(texel.a.mul(float(1).sub(colour.a)))),
          );
        }
      }
      return colour;
    })();
  }

  // ── The outline stage, OPT-IN: only mounted while the host says something IS outlined ────────────────
  // (`options.outline` is the host's outline pass, handed over only then; see `WebGPUOutlinePass.active`).
  // One small render of the ghost-proxy scene into an RGBA8 mask (group id in R), then the WebGL
  // SimpleOutlinePass composite, the same tap for tap: centre id 0 = untouched pixel (one mask read); inside a
  // group, palette fill + an 8-tap RING at the group's thickness — a tap hitting a different id means a
  // boundary within t along that direction, the same solid inward band at O(1) per pixel. Drawn after FXAA
  // (the frame under it stays antialiased) and under the overlay layers, as WebGL layers it.
  const outline = options.outline ?? null;
  let outlineMaskPass = null;
  if (outline) {
    const { OutlineMaskPass } = overlayPassClasses();
    const maskPass = new OutlineMaskPass(outline.maskScene, camera);
    outlineMaskPass = maskPass;
    const maskSweep = nodeObject(maskPass);
    const maskTex = maskSweep.getTextureNode();
    const palette = outline.paletteTexture;
    const under = frameNode;
    const readId = (at) => floor(maskTex.sample(at).r.mul(255).add(0.5));
    frameNode = Fn(() => {
      const here = uv();
      const colour = vec4(under).toVar();
      const centerId = readId(here).toVar();
      If(centerId.greaterThan(0.5), () => {
        // Palette row 0 (y .25) line colour + thickness byte; row 1 (y .75) fill colour + opacity.
        const paletteU = centerId.add(0.5).div(256);
        const line = texture(palette, vec2(paletteU, 0.25)).toVar();
        const fill = texture(palette, vec2(paletteU, 0.75)).toVar();
        const rgb = mix(colour.rgb, fill.rgb, fill.a).toVar();
        const t = line.a.mul(255).toVar();
        If(t.greaterThanEqual(0.5), () => {
          const o = vec2(t).div(screenSize).toVar();
          const D = 0.70710678; // 1/sqrt(2): diagonal taps land at radius t too
          const edge = readId(here.add(vec2(o.x, 0))).notEqual(centerId)
            .or(readId(here.add(vec2(o.x.negate(), 0))).notEqual(centerId))
            .or(readId(here.add(vec2(0, o.y))).notEqual(centerId))
            .or(readId(here.add(vec2(0, o.y.negate()))).notEqual(centerId))
            .or(readId(here.add(vec2(o.x.mul(D), o.y.mul(D)))).notEqual(centerId))
            .or(readId(here.add(vec2(o.x.mul(-D), o.y.mul(D)))).notEqual(centerId))
            .or(readId(here.add(vec2(o.x.mul(D), o.y.mul(-D)))).notEqual(centerId))
            .or(readId(here.add(vec2(o.x.mul(-D), o.y.mul(-D)))).notEqual(centerId));
          If(edge, () => {
            rgb.assign(line.rgb);
          });
        });
        colour.assign(vec4(rgb, colour.a));
      });
      return colour;
    })();
  }
  // After FXAA, as in WebGL: the depth-tested overlays, then the flat ones, each laid over once.
  const layers = [];
  const overlayPasses = [];
  if (hasDepthOverlays) {
    const layerPass = nodeObject(new OverlayPass(scene, camera, overlaySource, true, principalPass));
    overlayPasses.push(layerPass);
    layers.push({ colour: layerPass.getTextureNode(), depth: layerPass.getTextureNode("depth") });
  }
  if (hasFlatOverlays) {
    const layerPass = nodeObject(new OverlayPass(scene, camera, overlaySource, false, principalPass));
    overlayPasses.push(layerPass);
    layers.push({ colour: layerPass.getTextureNode(), depth: null });
  }
  if (layers.length > 0) {
    const under = frameNode;
    const reversed = renderer.reversedDepthBuffer === true;
    frameNode = Fn(() => {
      const colour = under.toVar();
      for (const layer of layers) {
        const texel = layer.colour.toVar();
        let coverage = texel.a;
        if (layer.depth) {
          // The depth test WebGL's GPU does against the borrowed capture depth, done here per pixel.
          const mine = layer.depth.r;
          const scenes = deepnessTick.r;
          const inFront = reversed ? mine.greaterThanEqual(scenes) : mine.lessThanEqual(scenes);
          coverage = inFront.select(texel.a, float(0));
        }
        // 🔴 AND ONLY INSIDE THE VIEW'S CROP. What a layer holds is drawn on the view's plane (a section's cut, its
        // hatch, plan symbols, detail lines), and in WebGL its materials carry the crop's planes. Here the host
        // puts those objects in a ClippingGroup, and three uploads a clipping group's planes into a shared
        // shader's per-object uniforms only for the first object it draws (the same refresh rule that froze the
        // fat lines' viewport): measured on racbasic's A104 details, setting every crop plane to cut everything
        // away changed not one pixel, and the cuts ran on past each detail's break line. The crop is a rectangle
        // on the frame for a drawing (`insideCrop`), so the layer is kept inside it here, where it cannot go stale.
        if (look.insideCrop) coverage = look.insideCrop(uv()).select(coverage, float(0));
        // 🔴 AND ITS ALPHA, as WebGL's blend lays a layer over the frame (`a + frame · (1 − a)`). Only the colour
        // was mixed, so a layer over a pixel where nothing was drawn kept that pixel's alpha of 0: the cut's
        // fill in a section whose model stops at the plane came out (184, 184, 184, 0), there in the photograph
        // and invisible on the sheet, which showed the paper through the cut. And laid over, not mixed (`layOver`).
        colour.assign(layOver(colour, texel.rgb, coverage));
      }
      return colour;
    })();
  }
  post.outputNode = frameNode;

  // ⚰️ A ONCE-PER-FRAME RENDER GUARD (rAF token) WAS TRIED HERE AND RETIRED: its own rAF collided with the
  // frame ordering (see `colocated-double-render`) and dropped the fps from 72.8 to 67.5. The second render
  // is cut where it belongs, in `PostproductionRenderer`'s update.
  const pipeline = {
    principalSweep,
    ao: craftedTone,
    look,
    /** The sun of the pass being drawn, and how its map was last fitted (`sun-shadow.mjs`); null without a view. */
    sun: sunState,
    /** What this mount compiled in. A host compares it against its settings to know when to remount. */
    compiled: {
      ...look.compiled,
      faceR8,
      ao: wantsShade,
      fxaa,
      edges,
      depthOverlays: hasDepthOverlays,
      flatOverlays: hasFlatOverlays,
      sceneScale,
      // Whether what the view says (crop, sky, sun) is compiled in: only for a host that hands it over.
      view: !!options.view,
      // The side of the sun's target, 0 without one: stating a sun, or a finer one, remounts.
      sunMost: sunState ? sunState.most : 0,
      outlines: !!outline,
      // One letter per occlusion seam, in registration order ("d" direct, "l" layer). A count would
      // not do: flipping one pass from direct to layer changes what is compiled and nothing else.
      seams: seamSource.map(({ direct }) => (direct === false ? "l" : "d")).join(""),
    },
    render: () => post.render(),
    /** The once-per-FRAME advances, before rendering: the AO's camera constants, then the composite's. */
    __refresh: () => {
      // 🔴 THE AO FOLLOWS THE CANVAS. Its targets were sized once, at mount, and nothing resized them: with
      // the pixel ratio dropped while moving (03-10, dynamic resolution) the AO went on estimating 1440x709
      // at 1.6 ms while everything else got cheaper. `globalThis.__aoFollowsCanvas = false` is the control.
      // At the scene's own scale: the AO reads the scene's depth and is upsampled to the canvas anyway.
      const cw = Math.floor(renderer.domElement.width * sceneScale), ch = Math.floor(renderer.domElement.height * sceneScale);
      if (craftedTone && globalThis.__aoFollowsCanvas !== false && (cw !== aoSized[0] || ch !== aoSized[1])) {
        aoSized = [cw, ch];
        craftedTone.setSize(cw, ch);
      }
      craftedTone?.advance();
      look.advance();
      // Sync the outline proxies' matrices from their source tiles.
      outline?.advance?.();
    },
    // 🔴 THE PASSES' TARGETS ARE FREED TOO. Disposing only the pipeline left the scene pass (colour, face,
    // depth at full resolution) and the overlay layers alive on every remount, and a host remounts on every
    // style change: measured on superbig at the same settled camera, a fresh page turned at 41.8 fps and the
    // same page after a few style changes at 30.
    dispose: () => {
      post.dispose?.();
      craftedTone?.dispose?.();
      contourTiles?.dispose();
      principalPass.dispose?.();
      sunPass?.dispose?.();
      for (const layer of overlayPasses) layer.dispose?.();
      for (const seam of seamPasses) seam.dispose?.();
      // The outline mask target too: the stage compiles out when the last
      // outline detaches, and its remount must free the full-res mask.
      outlineMaskPass?.dispose?.();
    },
  };
  pipeline.__refresh();
  return pipeline;
}
