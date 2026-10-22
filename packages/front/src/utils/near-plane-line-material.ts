import {
  LineMaterial,
  LineMaterialParameters,
} from "three/examples/jsm/lines/LineMaterial.js";

/**
 * A fat line material (screen-space quad expansion, real `linewidth` in px) that
 * is also SAFE across the camera near plane.
 *
 * three's stock `LineMaterial` expands each segment into a screen-space quad in
 * the vertex shader. When a segment endpoint is behind the camera plane its
 * projected `w <= 0`, so the NDC math is garbage and the quad blows up to span the
 * whole screen — the "infinity streak" seen under clipping (and on LOD wires).
 * Stock `LineMaterial` handles only the case where ONE endpoint is behind (it
 * trims that endpoint to the near plane via `trimSegment`); it does nothing when
 * BOTH endpoints are behind, which is the remaining streak.
 *
 * This subclass injects the missing both-behind guard: if both endpoints are
 * behind the camera plane the segment has no valid projection, so we collapse it
 * offscreen (`gl_Position` past the far plane) instead of expanding a bogus quad.
 * This mirrors the near-plane guard of fragments' LOD line shader: one guard,
 * shared semantics across the fat-line consumers (section edges, measurement
 * lines, LOD wires).
 *
 * The guard lives in the material's OWN `vertexShader` string (NOT an
 * `onBeforeCompile` patch), so it SURVIVES `.clone()` — `ShaderMaterial.clone`
 * copies `vertexShader`, whereas it drops `onBeforeCompile`. That matters because
 * `ClipEdges` clones the style material per model in local-clipping mode.
 */
export class NearPlaneLineMaterial extends LineMaterial {
  constructor(params?: LineMaterialParameters) {
    super(params);

    // Insert the both-endpoints-behind discard right before the clip-space
    // projection, leaving three's existing one-endpoint `trimSegment` (run just
    // above) untouched. `perspective`, `start` and `end` (view space) are all in
    // scope at this point. Anchoring on the stable "// clip space" comment keeps
    // this robust to whitespace/line changes in three's shader source.
    const guard = /* glsl */ `
			// near-plane guard: discard any segment whose BOTH endpoints sit within a
			// thin band in front of / behind the camera plane. Two reasons to cover the
			// band (not just z >= 0): (1) both genuinely behind → no valid projection;
			// (2) a one-endpoint-behind segment was trimmed (above) so its behind end
			// now sits at z = -1e-3 — if its FRONT end also lands in this band (only at
			// very specific angles), both ends have tiny w and the quad still streaks
			// for that frame. The band (-2e-3) is a sub-millimetre sliver at the camera,
			// so no real geometry is lost. Runs AFTER three's trim, so it sees trimmed
			// values. Mirrors the LOD shader's lodNearPlaneGuard.
			if ( perspective && start.z >= -2e-3 && end.z >= -2e-3 ) {

				gl_Position = vec4( 0.0, 0.0, 2.0, 1.0 );
				return;

			}

			// clip space`;

    // In a WebGPU application the base class is Line2NodeMaterial (TSL, via
    // the `webgpu/lines.mjs` alias this package ships) and there is NO
    // vertexShader string to patch: the GLSL surgery below only applies to
    // the WebGL base. Known divergence: the near-plane guard has no TSL port
    // yet, so the both-endpoints-behind streak can reappear under WebGPU.
    if (typeof this.vertexShader !== "string") return;

    if (this.vertexShader.includes("// clip space")) {
      this.vertexShader = this.vertexShader.replace("// clip space", guard);
    }

    // Make three's ONE-endpoint-behind trim projection-INDEPENDENT. three's
    // trimSegment estimates the near plane as `-0.5 * b / a` (a = proj[2][2],
    // b = proj[3][2]). That assumes a standard projection. This viewer uses a
    // reversed-Z / infinite-far projection (proj[2][2] ≈ 0, proj[3][2] ≈ near),
    // where the estimate explodes (e.g. ~-500 instead of ~-1), so the trimmed
    // endpoint stays effectively behind the camera and the segment STILL streaks.
    // The fix needs no projection math: the only requirement to avoid the bogus
    // quad is that the trimmed endpoint sits in FRONT of the camera (view-space
    // z < 0 → clip w > 0). Trim to a tiny fixed distance in front; the GPU then
    // near-clips the rest of the segment precisely, so the visible end is exact.
    // NOTE: fragments' LOD line shader (cutLodLine) uses the IDENTICAL
    // `-(proj[3][2]/proj[2][2])/2` estimate, so LOD wires streak the same way
    // under reversed-Z — the same one-line fix belongs there too.
    this.vertexShader = this.vertexShader.replace(
      "float nearEstimate = - 0.5 * b / a;",
      "float nearEstimate = - 1e-3; // projection-independent (reversed-Z safe)",
    );
  }
}
