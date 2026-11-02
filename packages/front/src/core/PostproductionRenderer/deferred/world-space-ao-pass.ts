import * as THREE from "three";
import { FullscreenQuad } from "./fullscreen-quad";
import { DepthMipPyramid, MAX_HIZ_LEVELS } from "./depth-mip-pyramid";

/**
 * World-space ambient occlusion.
 *
 * Where {@link ScreenSpaceAoPass} estimates obscurance from a flat screen-space
 * disk (the Alchemy estimator), this pass works the other way around: it places
 * a small cloud of probe points in a normal-oriented hemisphere of fixed *world*
 * size around the surface point, projects each probe back to the screen, and
 * asks the depth buffer whether that probe ended up buried behind geometry. An
 * occluder only counts while it sits within the hemisphere's world reach, and
 * its weight decays exponentially with world distance, so the darkening reads as
 * a physical contact shadow whose footprint is constant in metres regardless of
 * how far the camera is from the surface.
 *
 * Per pixel:
 *   - reconstruct the view-space point P from the Hi-Z level-0 eye depth and the
 *     octahedral normal N;
 *   - build a per-pixel-rotated tangent frame and march a low-discrepancy spiral
 *     of probes across the hemisphere, each pushed `lift` along N to escape self
 *     contact;
 *   - project each probe to screen, read the scene eye depth there (coarser Hi-Z
 *     mips for far probes), and count it occluded when the scene surface is in
 *     front of the probe; weight by exp(-worldDist * decay / reach);
 *   - normalise, raise to `shape`, then fade the whole result out for geometry
 *     approaching the far plane so distant fields stay clean.
 */
const buildLevelFetch = Array.from(
  { length: MAX_HIZ_LEVELS },
  (_, level) => `    if (slot == ${level}) return texture(uDepthChain[${level}], at).r;`,
).join("\n");

const occlusionFragment = /* glsl */ `
  precision highp float;
  #define LEVEL_COUNT ${MAX_HIZ_LEVELS}
  in vec2 vUv;
  out vec4 outColor;

  uniform sampler2D uDepthChain[LEVEL_COUNT]; // per-level linear eye depth (Hi-Z)
  uniform sampler2D uNormal;       // RG = octahedral view normal
  uniform sampler2D uFaceId;       // RGBA8: A = role byte (1 = translucent)
  uniform vec2 uViewport;          // AO target pixel size
  uniform float uTopLevel;         // highest valid Hi-Z level index
  uniform vec2 uLens;              // (P00, P11) of the projection matrix
  uniform bool uOrtho;             // orthographic projection
  uniform float uHorizon;          // camera far plane
  uniform float uReach;            // hemisphere radius, world units
  uniform float uLift;             // normal push-off, world units
  uniform float uDecay;            // exponential range-falloff rate
  uniform float uPowerValue;            // occlusion strength
  uniform float uForm;            // output contrast (gamma)
  uniform int uRays;               // probe count
  uniform float uVanishStart;      // eye-depth/far where the fade begins
  uniform float uVanishEnd;        // eye-depth/far where AO is fully gone

  const float TAU = 6.2831853071795864;
  const float WHIRL = 6.0;

  vec3 unfoldNormal(vec2 e) {
    vec3 n = vec3(e, 1.0 - abs(e.x) - abs(e.y));
    if (n.z < 0.0) {
      n.xy = (1.0 - abs(n.yx)) * vec2(n.x >= 0.0 ? 1.0 : -1.0, n.y >= 0.0 ? 1.0 : -1.0);
    }
    return normalize(n);
  }

  // View-space point from a UV and its linear eye distance. Perspective: eye-X/Y
  // scale with depth; orthographic: eye-X/Y are depth-independent (x = ndc.x/P00).
  vec3 unproject(vec2 uv, float eye) {
    vec2 ndc = uv * 2.0 - 1.0;
    float s = uOrtho ? 1.0 : eye;
    return vec3(ndc.x * s / uLens.x, ndc.y * s / uLens.y, -eye);
  }

  // View-space point -> screen UV. Perspective: project with the perspective
  // divide by -z. Orthographic: NO divide — ndc = (P00*x, P11*y) directly; the
  // perspective divide here would warp every probe's screen position under ortho.
  vec2 toScreen(vec3 v) {
    vec2 ndc = uOrtho ? vec2(uLens.x * v.x, uLens.y * v.y)
                      : vec2(uLens.x * v.x, uLens.y * v.y) / (-v.z);
    return ndc * 0.5 + 0.5;
  }

  float scramble(vec2 p) {
    return fract(52.9829189 * fract(dot(p, vec2(0.06711056, 0.00583715))));
  }

  // A Hi-Z sampler array must be indexed by a literal in GLSL ES 3.00, so the
  // level pick is unrolled into literal-indexed branches.
  float fetchDepth(vec2 at, int slot) {
${buildLevelFetch}
    return texture(uDepthChain[0], at).r;
  }

  void main() {
    float eye = fetchDepth(vUv, 0);
    if (eye >= uHorizon) { outColor = vec4(1.0); return; } // background stays open

    // Translucent surfaces opt out of AO: emit fully open so the denoise has a
    // clean value to spread instead of a hole.
    if (texture(uFaceId, vUv).a > 0.5) { outColor = vec4(1.0); return; }

    vec3 P = unproject(vUv, eye);
    vec3 N = unfoldNormal(texture(uNormal, vUv).rg);

    // Per-pixel rotated tangent frame around N.
    vec3 guide = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
    vec3 tangent = normalize(cross(guide, N));
    vec3 bitangent = cross(N, tangent);
    float spin = scramble(gl_FragCoord.xy) * TAU;

    float zBias = 0.012 * uReach;
    float buried = 0.0;
    int count = uRays;
    for (int i = 0; i < 64; i++) {
      if (i >= count) break;
      float t = (float(i) + 0.5) / float(count);
      float angle = t * WHIRL * TAU + spin;
      float disk = sqrt(t);                       // even areal spread on the disk
      float dome = sqrt(max(0.0, 1.0 - disk * disk));
      vec3 dir = tangent * (cos(angle) * disk)
               + bitangent * (sin(angle) * disk)
               + N * dome;
      // Probe sits at a growing fraction of the world reach, lifted off N.
      vec3 probe = P + dir * (uReach * mix(0.18, 1.0, t)) + N * uLift;
      if (probe.z >= 0.0) continue;               // behind the camera

      vec2 puv = toScreen(probe);
      if (puv.x < 0.0 || puv.x > 1.0 || puv.y < 0.0 || puv.y > 1.0) continue;

      // Coarser Hi-Z for probes that landed far from the centre texel.
      vec2 stepPx = (puv - vUv) * uViewport;
      float span = max(abs(stepPx.x), abs(stepPx.y));
      float slot = clamp(floor(log2(max(span, 1.0) / 4.0)), 0.0, uTopLevel);
      float sceneEye = fetchDepth(puv, int(slot));
      if (sceneEye >= uHorizon) continue;

      // Translucent occluders do not cast AO onto opaque geometry.
      if (texture(uFaceId, puv).a > 0.5) continue;

      // Probe is buried when the scene surface is nearer the camera than it.
      float gap = (-probe.z) - sceneEye;
      if (gap <= zBias) continue;

      vec3 sceneP = unproject(puv, sceneEye);
      float worldDist = length(sceneP - P);
      buried += exp(-worldDist * uDecay / uReach);
    }

    float ao = 1.0 - uPowerValue * buried / float(count);
    ao = pow(clamp(ao, 0.0, 1.0), uForm);

    // Ease the effect off as geometry nears the far plane.
    float fade = clamp(
      (eye / uHorizon - uVanishStart) / max(1.0e-4, uVanishEnd - uVanishStart),
      0.0, 1.0);
    ao = mix(ao, 1.0, fade);

    outColor = vec4(ao, ao, ao, 1.0);
  }
`;

export interface WorldSpaceAoSettings {
  /** Hemisphere radius in world units. The contact-shadow footprint. */
  reach: number;
  /** Normal push-off applied to every probe, world units, to skip self-contact. */
  lift: number;
  /** Exponential range-falloff rate; higher tightens AO to close contacts. */
  decay: number;
  /** Occlusion strength multiplier. */
  power: number;
  /** Output contrast exponent (1 = linear). */
  shape: number;
  /** Probe count per pixel. */
  rays: number;
  /** Eye-depth as a fraction of far where the distance fade begins. */
  vanishStart: number;
  /** Eye-depth as a fraction of far where AO is fully faded out. */
  vanishEnd: number;
}

export const defaultWorldAoSettings: WorldSpaceAoSettings = {
  reach: 0.7,
  lift: 0.025,
  decay: 2.0,
  power: 1.3,
  shape: 1.0,
  rays: 18,
  vanishStart: 0.5,
  vanishEnd: 0.9,
};

export class WorldSpaceAoPass {
  readonly renderTarget: THREE.WebGLRenderTarget;
  readonly settings: WorldSpaceAoSettings;

  private _material: THREE.ShaderMaterial;
  private _quad: FullscreenQuad;
  private _width: number;
  private _height: number;

  constructor(width: number, height: number, settings = defaultWorldAoSettings) {
    this._width = Math.max(1, Math.floor(width));
    this._height = Math.max(1, Math.floor(height));
    this.settings = { ...settings };

    this.renderTarget = new THREE.WebGLRenderTarget(this._width, this._height, {
      format: THREE.RedFormat,
      type: THREE.UnsignedByteType,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      depthBuffer: false,
      stencilBuffer: false,
    });
    this.renderTarget.texture.name = "worldAoRaw";

    this._material = new THREE.ShaderMaterial({
      glslVersion: THREE.GLSL3,
      vertexShader: /* glsl */ `
        out vec2 vUv;
        void main() { vUv = uv; gl_Position = vec4(position, 1.0); }
      `,
      fragmentShader: occlusionFragment,
      uniforms: {
        uDepthChain: { value: [] as THREE.Texture[] },
        uNormal: { value: null },
        uFaceId: { value: null },
        uViewport: { value: new THREE.Vector2(this._width, this._height) },
        uTopLevel: { value: 1 },
        uLens: { value: new THREE.Vector2(1, 1) },
        uOrtho: { value: false },
        uHorizon: { value: 1000 },
        uReach: { value: this.settings.reach },
        uLift: { value: this.settings.lift },
        uDecay: { value: this.settings.decay },
        uPowerValue: { value: this.settings.power },
        uForm: { value: this.settings.shape },
        uRays: { value: this.settings.rays },
        uVanishStart: { value: this.settings.vanishStart },
        uVanishEnd: { value: this.settings.vanishEnd },
      },
      depthTest: false,
      depthWrite: false,
    });

    this._quad = new FullscreenQuad(this._material);
  }

  get texture(): THREE.Texture {
    return this.renderTarget.texture;
  }

  setSize(width: number, height: number) {
    this._width = Math.max(1, Math.floor(width));
    this._height = Math.max(1, Math.floor(height));
    this.renderTarget.setSize(this._width, this._height);
    this._material.uniforms.uViewport.value.set(this._width, this._height);
  }

  render(
    renderer: THREE.WebGLRenderer,
    pyramid: DepthMipPyramid,
    normalTexture: THREE.Texture,
    faceIdTexture: THREE.Texture,
    camera: THREE.PerspectiveCamera | THREE.OrthographicCamera,
  ) {
    const u = this._material.uniforms;
    // Bind one sampler per declared slot, padding spare slots with the coarsest
    // level so every array element points at a live texture.
    const levels = pyramid.textures;
    const chain: THREE.Texture[] = [];
    for (let i = 0; i < MAX_HIZ_LEVELS; i++) {
      chain.push(levels[Math.min(i, levels.length - 1)]);
    }
    u.uDepthChain.value = chain;
    u.uNormal.value = normalTexture;
    u.uFaceId.value = faceIdTexture;
    u.uTopLevel.value = pyramid.levels - 1;
    u.uHorizon.value = camera.far;
    const p = camera.projectionMatrix.elements;
    u.uLens.value.set(p[0], p[5]);
    u.uOrtho.value =
      // Read off the projection, not the camera's class: a sheet's perspective is an orthographic camera
      // whose matrix projects in perspective, and reconstructed as ortho its depth changed with every tile.
      camera.projectionMatrix.elements[15] !== 0;
    u.uReach.value = this.settings.reach;
    u.uLift.value = this.settings.lift;
    u.uDecay.value = this.settings.decay;
    u.uPowerValue.value = this.settings.power;
    u.uForm.value = this.settings.shape;
    u.uRays.value = this.settings.rays;
    u.uVanishStart.value = this.settings.vanishStart;
    u.uVanishEnd.value = this.settings.vanishEnd;
    this._quad.render(renderer, this.renderTarget);
  }

  dispose() {
    this._material.dispose();
    this.renderTarget.dispose();
  }
}
