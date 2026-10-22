// The FAT LINES family under the webgpu build: the FUNCTIONAL replacement for
// the refusal stub. The gpu server resolves every import of
// `three/(examples/jsm|addons)/lines/*` here, and this module re-exports, UNDER
// THE SAME NAMES, the webgpu variants three 0.185 already ships:
//
//   Line2 / LineSegments2 / Wireframe  -> three/examples/jsm/lines/webgpu/*
//   LineGeometry / LineSegmentsGeometry / WireframeGeometry2 -> the shared
//     ones (geometry only, build-agnostic; the webgpu classes reuse them as is)
//   LineMaterial -> a wrapper around Line2NodeMaterial (TSL) with the surface
//     consumers touch, `resolution` included (see below)
//
// With this, the TEN consumers (measurements, ClipStyler, civil, dimension-line,
// NearPlaneLineMaterial and the rest) do not change A SINGLE LINE: the server's
// resolution decides what "Line2" means, which is exactly the one-graph rule.
// The refusal stub is left for the postprocessing family alone.
//
// Documented divergence v1: NearPlaneLineMaterial's near-plane guard is GLSL
// surgery on vertexShader and does not apply here (there is no vertexShader);
// its constructor skips it with type guards. Under webgpu the "streak" risk
// with both ends behind the camera comes back until that guard is ported to TSL
// over Line2NodeMaterial, which is open as #213.
import * as THREE from "three";
import { float } from "three/tsl";

export { Line2 } from "three/examples/jsm/lines/webgpu/Line2.js";
export { LineSegments2 } from "three/examples/jsm/lines/webgpu/LineSegments2.js";
export { Wireframe } from "three/examples/jsm/lines/webgpu/Wireframe.js";
export { LineGeometry } from "three/examples/jsm/lines/LineGeometry.js";
export { LineSegmentsGeometry } from "three/examples/jsm/lines/LineSegmentsGeometry.js";
export { WireframeGeometry2 } from "three/examples/jsm/lines/WireframeGeometry2.js";

// The LineMaterialParameters type is erased at compile time, but some consumer
// imports it without `type`, and esbuild then demands a runtime export.
export const LineMaterialParameters = {};

const Base = THREE.Line2NodeMaterial;

/**
 * 🔴 WHAT MAKES A FAT LINE READ THE SIZE OF THE PASS IT IS DRAWN IN, EVERY TIME.
 *
 * `Line2NodeMaterial` turns `linewidth` into clip space by dividing by the viewport, which it reads from a node
 * three refreshes once per render. But WHETHER a drawn object refreshes its uniforms at all is decided per
 * shader, not per object (`NodeMaterialObserver.needsRefresh`): the first object drawn with a shader in a
 * render refreshes, and every other one only if its material, its geometry or its matrix has changed. The
 * viewport is none of those. So of five lines sharing a shader, four kept the viewport of the render they
 * were first drawn in, for good.
 *
 * Measured on a canvas that photographs each view at the size it is seen: a view first photographed at 256
 * px and then at 512 drew its 3.6 px cut lines 8 px wide, first photographed at 128 it drew them 14, and
 * neither a new photograph, a new target nor rebuilding the material moved them; halving the pixel ratio
 * and doubling the viewport by hand, in the node itself, changed not one pixel. The same view photographed
 * at 512 from the start was right.
 *
 * A material that carries a node as a property is refreshed on every draw (`containsNode`), which is what a
 * line needs. ONE node for all of them: a node's id is part of the shader's cache key, and one each would
 * compile one shader per material.
 */
const READS_THE_PASS = float(0);

/**
 * `LineMaterial` with three's TSL class underneath. Line2NodeMaterial takes the
 * same style parameters (color, linewidth, worldUnits, dashed and so on); what
 * it does NOT have is the `resolution` uniform, because the TSL reads the
 * viewport by itself. WebGL consumers call `material.resolution.set(w, h)` on
 * every resize, and here that has to be a harmless no-op, so a writable Vector2
 * nobody reads is exposed.
 */
export class LineMaterial extends Base {
  constructor(parameters = {}) {
    super(parameters);
    if (!this.resolution) {
      this.resolution = new THREE.Vector2(1, 1);
    }
    // Consumers DISCRIMINATE on this flag, not with instanceof (clip-edges
    // picks fat LineSegments2 over flat THREE.LineSegments with
    // `isLineMaterial`). Without it the TSL material ended up on a flat
    // BufferGeometry, with no uv/instanceStart/instanceEnd, and the pipeline's
    // WGSL was invalid: that was ClipStyler's failure on the sweep.
    this.isLineMaterial = true;
    // See `READS_THE_PASS`: without it the line keeps the viewport of its first draw.
    this.readsThePass = READS_THE_PASS;
  }

  /**
   * A see-through line is laid over what is under it by BLENDING, as the classic `LineMaterial` lays it.
   *
   * `Line2NodeMaterial` does something else when it is `transparent`: it mixes its colour, in the shader, with a
   * copy of what has been drawn behind it (`viewportOpaqueMipTexture`), and blends on top of that. Drawn into a
   * layer of its own, which is where every overlay goes (section lines, a drawing's hatch, plan symbols), that
   * copy is not the picture and the line comes out as nothing at all: measured on a set of six sheets, 99 line
   * objects drawn in every pass and not one of them on the photograph, trees, contours and property lines among
   * them; the same objects marked opaque, all there. `transparent` here means what it means everywhere else:
   * which list it is drawn in, and that it blends.
   */
  setupDiffuseColor(builder) {
    const seeThrough = this.transparent;
    this.transparent = false;
    try {
      super.setupDiffuseColor(builder);
    } finally {
      this.transparent = seeThrough;
    }
  }
}
