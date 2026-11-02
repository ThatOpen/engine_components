// Deferred postproduction pipeline — public surface.
//
// The pipeline implementation lives in ./pipeline-v2 (the from-scratch rebuild
// validated pass-by-pass in the PipelineBisect harness, stages 18–23). This
// module re-exports it as `DeferredPipeline` along with its types and the shared
// pass classes, so every consumer (Postproduction, the examples, external apps)
// keeps the exact same import surface it had with the previous implementation.
//
// The previous inline ~1000-line DeferredPipeline class was retired here in
// favour of that rebuild (same public API: constructor, settings, render args,
// accessors). See git history for the old implementation.

export { DeferredPipeline, DeferredAoMode } from "./pipeline-v2";
export type {
  DeferredPipelineSettings,
  OcclusionPass,
  OcclusionPassContext,
} from "./pipeline-v2";

export { SurfaceCapturePass } from "./surface-capture-pass";
export { SurfaceCaptureTarget } from "./surface-capture-target";
export { DepthMipPyramid } from "./depth-mip-pyramid";
export { ScreenSpaceAoPass } from "./screen-space-ao-pass";
export { WorldSpaceAoPass } from "./world-space-ao-pass";
export { AoDenoisePass } from "./ao-denoise-pass";
export { CombinedCompositePass } from "./combined-composite-pass";
export { FxaaPass } from "./fxaa-pass";
