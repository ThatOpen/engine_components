import type * as THREE from "three";

/**
 * Which GPU API a {@link SimpleRenderer} runs on. `"webgl"` is the default
 * and the renderer this library has always built. `"webgpu"` is opt-in: see
 * {@link SimpleRendererParameters.mode}.
 */
export type RendererApi = "webgl" | "webgpu";

/**
 * The renderer construction options: THREE's own WebGLRenderer parameters
 * plus the GPU API.
 */
export type SimpleRendererParameters =
  Partial<THREE.WebGLRendererParameters> & {
    /**
     * The GPU API. Omitted (or `"webgl"`), the renderer is a
     * `THREE.WebGLRenderer`, exactly as before this option existed.
     *
     * `"webgpu"` builds a `THREE.WebGPURenderer` and the WebGPU pipeline
     * (TSL materials, and in `@thatopen/components-front` the WebGPU
     * postproduction). It is never chosen automatically. It needs:
     *
     * - **three r185 or newer** (`three@>=0.185`): the WebGPU pipeline uses
     *   r185 features. An older three throws a clear error here.
     * - **The application resolving `three` to `three/webgpu`**, the superset
     *   build that ships `WebGPURenderer` and the node materials. One module
     *   graph: this library reads the WebGPU classes off the same `three`
     *   namespace it uses for everything else, which is what keeps WebGL
     *   applications from loading any of it. With Vite:
     *
     * ```ts
     * resolve: {
     *   alias: [
     *     { find: /^three$/, replacement: "three/webgpu" },
     *     // The WebGL-only line and postprocessing addons the libraries
     *     // import cannot link against three/webgpu: aliases shipped in
     *     // @thatopen/components-front (see its README, "WebGPU").
     *     {
     *       find: /^three\/(examples\/jsm|addons)\/lines\/(Line2|LineSegments2|LineMaterial|Wireframe)\.js$/,
     *       replacement: "@thatopen/components-front/webgpu/lines.mjs",
     *     },
     *     {
     *       find: /^three\/(examples\/jsm|addons)\/postprocessing\/.*$/,
     *       replacement: "@thatopen/components-front/webgpu/webgl-addons-stub.mjs",
     *     },
     *   ],
     * },
     * ```
     *
     * A `three` that resolves to the WebGPU build has no `WebGLRenderer`, so
     * under that alias `mode: "webgpu"` must be passed explicitly; omitting it
     * throws instead of silently switching API.
     */
    mode?: RendererApi;
  };

/** The members of the `three` namespace the renderer construction reads. */
export interface RendererNamespace {
  REVISION: string;
  WebGLRenderer?: unknown;
  WebGPURenderer?: unknown;
  UnsignedByteType: number;
}

/** The oldest three revision the WebGPU pipeline runs on. */
export const MIN_WEBGPU_REVISION = 185;

/**
 * Builds the THREE renderer for the requested API. WebGL unless
 * `parameters.mode` is `"webgpu"`; nothing WebGPU is touched otherwise.
 * Throws a clear error when the requested API cannot be built from the
 * `three` the application resolved.
 *
 * @param three - The `three` namespace (passed in so it can be tested).
 * @param parameters - The renderer parameters, `mode` included.
 */
export function createThreeRenderer(
  three: RendererNamespace,
  parameters?: SimpleRendererParameters,
): { api: RendererApi; renderer: THREE.WebGLRenderer } {
  const { mode, ...threeParameters } = parameters ?? {};
  const api: RendererApi = mode ?? "webgl";

  if (api === "webgpu") {
    if (typeof three.WebGPURenderer !== "function") {
      throw new Error(
        'SimpleRenderer: mode "webgpu" needs the application to resolve the ' +
          '"three" import to "three/webgpu" (the superset build that ships ' +
          "WebGPURenderer). This page resolved the classic build.",
      );
    }
    const revision = Number.parseInt(three.REVISION, 10);
    if (!(revision >= MIN_WEBGPU_REVISION)) {
      throw new Error(
        `SimpleRenderer: mode "webgpu" needs three r${MIN_WEBGPU_REVISION} ` +
          `or newer (three@>=0.${MIN_WEBGPU_REVISION}); this page runs ` +
          `r${three.REVISION}.`,
      );
    }
    // No MSAA (the postproduction composites from its own targets), 8-bit
    // output (tone mapping is done by the pipeline), an OPAQUE canvas (a
    // premultiplied one makes the compositor blend the whole canvas against
    // the page every frame) and no GPU timestamp queries (only a measuring
    // page resolves them; unresolved, three warns every frame). Each one can
    // be overridden through the parameters.
    const Renderer = three.WebGPURenderer as new (
      options: Record<string, unknown>,
    ) => any;
    const renderer = new Renderer({
      antialias: false,
      alpha: false,
      trackTimestamp: false,
      outputBufferType: three.UnsignedByteType,
      ...threeParameters,
    });
    return { api, renderer: renderer as THREE.WebGLRenderer };
  }

  if (typeof three.WebGLRenderer !== "function") {
    throw new Error(
      'SimpleRenderer: "three" resolved to the WebGPU build, which ships no ' +
        'WebGLRenderer. Pass `mode: "webgpu"` to the renderer, or resolve ' +
        '"three" to the classic build.',
    );
  }
  const Renderer = three.WebGLRenderer as new (
    options: Partial<THREE.WebGLRendererParameters>,
  ) => THREE.WebGLRenderer;
  const renderer = new Renderer({
    antialias: true,
    alpha: true,
    ...threeParameters,
  });
  return { api, renderer };
}
