// WebGL-only addon STUB for a page that runs the WebGPU build of three.
//
// Under the one-graph rule ("three" IS three.webgpu.js), modules like
// three/examples/jsm/lines/LineMaterial and postprocessing/GTAOPass cannot
// even LINK — they import ShaderLib/UniformsLib, which the webgpu build does
// not export. The earlier engine's gpu page never imports them; this stack's
// WebGL branches do (fat-line edges, the GLSL Postproduction), statically,
// even though no webgpu code path ever CONSTRUCTS them.
//
// So such a page aliases those two addon directories here in its bundler: every name the
// graph imports exists (the module links), and CONSTRUCTING one throws with
// the reason (a webgl branch running under webgpu is a bug to hear about,
// never a silent no-op).
import * as THREE from "three";

const refusal = (name) =>
  class {
    constructor() {
      throw new Error(
        `${name} is a WebGL-only addon and this page runs the webgpu build ` +
          `of three: a WebGL code path is executing ` +
          `under webgpu mode, which is the bug to report.`,
      );
    }
  };

export const LineMaterial = refusal("LineMaterial");
export const Line2 = refusal("Line2");
export const LineGeometry = refusal("LineGeometry");
export const LineSegments2 = refusal("LineSegments2");
export const LineSegmentsGeometry = refusal("LineSegmentsGeometry");
export const EffectComposer = refusal("EffectComposer");
export const GTAOPass = refusal("GTAOPass");
export const OutputPass = refusal("OutputPass");
export const SMAAPass = refusal("SMAAPass");

// `Pass` is EXTENDED at class-definition time (front's custom passes), so a
// refusal-on-construct base class is exactly right: the subclass declares
// fine and explodes only if something instantiates it under webgpu.
export class Pass {
  constructor() {
    throw new Error(
      `Pass is a WebGL-only addon base and this page runs the webgpu build ` +
        `of three: a WebGL code path is executing ` +
        `under webgpu mode, which is the bug to report.`,
    );
  }
}
// Some passes reference Pass.FullScreenQuad-style statics; keep the shape.
export class FullScreenQuad {
  constructor() {
    throw new Error("FullScreenQuad is WebGL-only and this page runs the webgpu build of three.");
  }
}

// Type-only import in TS files; harmless value here.
export const LineMaterialParameters = {};

// Keep the namespace referenced so tree-shakers cannot decide the module is
// empty (and so the stub demonstrably shares the page's three).
export const __three = THREE.REVISION;
