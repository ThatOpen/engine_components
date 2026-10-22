import * as THREE from "three";

/**
 * The common surface the {@link SplatLoader} drives, implemented by BOTH the in-core
 * {@link GSplat} (renderer.ts) and the out-of-core {@link GSplatStream} (stream.ts). The loader
 * holds either behind this interface so the placement / occlusion-pass / UI code is identical for
 * a fully-resident dataset and a streamed LOD-tree.
 */
export interface ISplatRenderer {
  /** The {@link THREE.Group} the loader places (anchor / BIM alignment) and adds to the scene. */
  readonly object: THREE.Group;
  /** Local-space dataset centre (for framing + the handle box). */
  readonly center: THREE.Vector3;
  /** Local-space bounding radius. */
  readonly radius: number;
  /** Total gaussians in the dataset (finest level / full count). */
  readonly total: number;
  /** Number of spatial cells / leaves (diagnostic). */
  readonly nCells: number;

  /** Gaussians actually drawn this frame (after LOD + frustum cull + residency). */
  readonly drawn: number;
  /** Cells / leaves passing the frustum cull this frame (diagnostic). */
  readonly cellsInView: number;
  /** Last sort time (ms, diagnostic). */
  readonly sortMs: number;
  /** LOD base distance (local units). Smaller = finer/closer = more splats. */
  lodBase: number;
  /** Spherical-harmonic bands this dataset carries (0 = flat colour). Streaming only — the
   * in-core renderer decodes a plain .ply, which we parse for its DC term alone. */
  readonly shBands?: number;
  /** 0..1 dial over the view-dependent SH term. Absent when {@link shBands} is 0. */
  shStrength?: number;
  /** Distance past which the SH term fades out (local units). 0 = no limit. */
  shMaxDistance?: number;
  /** Keep sub-pixel splats (grow + opacity compensation) rather than discarding them. */
  subPixelDetail?: boolean;
  /** Alpha at which a grown sub-pixel splat is dropped (see subPixelDetail). */
  subPixelMinAlpha?: number;
  /** Diagnostic: splats drawn this frame bucketed by leaf distance [<25,<50,<100,<200,>=200]. */
  readonly drawnByDistance?: number[];

  /** Push per-frame uniforms (viewport / focal / minPixelSize). */
  setFrameUniforms(
    width: number,
    height: number,
    camera: THREE.Camera,
    minPixelSize: number,
  ): void;
  /** Per frame: re-pick LOD, frustum-cull and re-sort the visible subset. */
  update(camera: THREE.PerspectiveCamera): void;
  /** Optional: process any pending GPU texture uploads (streaming only). The streaming renderer
   * needs the live WebGLRenderer to push partial-row texSubImage uploads; the loader hands it the
   * occlusion-pass renderer just before drawing. No-op / absent on the in-core renderer. */
  flushUploads?(renderer: THREE.WebGLRenderer): void;
  /** Free all GPU + worker resources. */
  dispose(): void;
}
