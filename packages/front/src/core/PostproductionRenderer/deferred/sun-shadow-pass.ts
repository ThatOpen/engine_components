import * as THREE from "three";
import { SurfaceCapturePass } from "./surface-capture-pass";
import { FullscreenQuad } from "./fullscreen-quad";

/**
 * Where the sun is and how dark what it does not reach is drawn: the cast shadows of a drawing.
 *
 * 🔴 FLAT, BECAUSE THAT IS WHAT A DRAWING'S SHADOW IS. The authoring tool prints a site plan's shadows as one
 * even tone laid over whatever they fall on — no falloff, no light model — and three's own shadows are a
 * term of a lit material's shading: on the flat, unlit surfaces a hidden-line sheet is drawn with there is no
 * light for them to take away. So the shadow is decided per pixel here, from depth alone, and applied as a
 * multiply in the composite, which works the same for any material and any display style.
 */
export interface SunShadowSettings {
  /** Unit vector from the scene TOWARD the sun, in world space. */
  readonly towardSun: THREE.Vector3;
  /** What a shadowed pixel is multiplied by: 1 is no shadow, 0 black. */
  readonly tone: number;
  /** The world box whose geometry casts and receives: the sun's camera is fitted to it. */
  readonly bounds: THREE.Box3;
  /** Side of the sun's depth map, in texels. */
  readonly resolution?: number;
  /**
   * The height (world +Y) of a plane the shadows also fall on, which nothing draws: a ground
   * plane at a level. It receives, so the map is fitted to where the pass sees it too.
   */
  readonly groundAt?: number | null;
}

/** What the pass being shadowed saw: its camera, and the depth it captured, for fitting the sun's map to it. */
export interface SeenByThePass {
  readonly camera: THREE.Camera;
  readonly depth: THREE.Texture;
  readonly width: number;
  readonly height: number;
  /** Whether depth runs near 1 to far 0 (reversed, zero to one) rather than near 0 to far 1. */
  readonly reversed: boolean;
}

/**
 * How many blocks a side the pass's depth is summed into: each block says the nearest and farthest surface
 * in it. Fine enough that a roof in front of a distant hillside is two different depths, and small enough
 * that reading it back is a few kilobytes.
 */
const BLOCKS = 16;

const RANGE_SHADER = /* glsl */ `
  precision highp float;
  uniform sampler2D uDepthSheet;
  uniform ivec2 uSize;
  uniform bool uReversed;
  void main() {
    ivec2 block = ivec2(gl_FragCoord.xy);
    ivec2 from = block * uSize / ${BLOCKS};
    ivec2 to = (block + 1) * uSize / ${BLOCKS};
    float nearest = uReversed ? 0.0 : 1.0;
    float farthest = uReversed ? 1.0 : 0.0;
    float seen = 0.0;
    // A block is walked in steps so a large pass costs a bounded number of reads; a surface narrower than a
    // step can be missed, which only makes the map slightly smaller than it could be at worst.
    ivec2 span = max(to - from, ivec2(1));
    ivec2 step = max(span / 24, ivec2(1));
    for (int y = from.y; y < to.y; y += step.y) {
      for (int x = from.x; x < to.x; x += step.x) {
        float d = texelFetch(uDepthSheet, ivec2(x, y), 0).r;
        // Cleared texels are no surface: nothing there to receive a shadow.
        if (uReversed ? d <= 0.0 : d >= 1.0) continue;
        seen = 1.0;
        nearest = uReversed ? max(nearest, d) : min(nearest, d);
        farthest = uReversed ? min(farthest, d) : max(farthest, d);
      }
    }
    gl_FragColor = vec4(nearest, farthest, seen, 1.0);
  }
`;

/**
 * The depth of the scene as the sun sees it, drawn with the pipeline's own capture.
 *
 * 🔴 THE CAPTURE, NOT AN OVERRIDE MATERIAL. A fragments mesh places its vertices in its own shader, so a
 * depth material swapped in for the sun's view draws every instance at the origin. The capture pass already
 * draws every surface this pipeline shows — same materials, same clipping planes, so a section cut away from
 * the view is cut away from the sun too — and its depth attachment is exactly the map needed.
 */
export class SunShadowPass {
  readonly camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.01, 10);
  private _capture: SurfaceCapturePass | null = null;
  private readonly _captures = new Map<number, SurfaceCapturePass>();
  private _side = 0;
  private _ranges: THREE.WebGLRenderTarget | null = null;
  private _rangeQuad: FullscreenQuad | null = null;
  private readonly _rangePixels = new Float32Array(BLOCKS * BLOCKS * 4);
  /** Handed to the sun's capture: see `SurfaceCapturePass.onPixels`. A thin part casts its shadow too. */
  onPixels: ((width: number, height: number) => void) | null = null;
  /** How the last map was fitted, for whoever needs to see why a shadow is as sharp as it is. */
  lastFit: { width: number; texel: number; blocksSeen: number; why: string } | null = null;

  get depthTexture(): THREE.Texture | null {
    return this._capture?.target.depthTexture ?? null;
  }

  /** Metres covered by one texel of the map: what the lookup has to be pushed off a surface by. */
  get texelInMetres() {
    return this._side > 0 ? (this.camera.right - this.camera.left) / this._side : 0;
  }

  /**
   * Draw the sun's depth for one pass.
   *
   * 🔴 FITTED TO WHAT THE PASS SEES, NOT TO THE WHOLE BOX. Fitted to the box, one texel of the map was the
   * model's size over 4096 whatever the zoom: fine on a whole sheet, and a staircase of blocks along every
   * shadow edge once Antonio zoomed into a window. Only the surfaces the pass shows receive a shadow, so only
   * they have to be in the map: a caster outside the frame still lands inside it, because the map is taken
   * along the sun's own direction and a caster falls on the same spot of the map as its shadow. Depth stays
   * the whole box, so nothing between the sun and the frame is left out.
   *
   * 🔴 AND THE SURFACES, NOT THE FRAME. The frame alone was tried first and gained nothing: a five metre
   * window of an elevation, carried through the model's 77 metres of depth and seen from a sun at an angle,
   * is sixty metres across in the sun's view. What the pass shows is at a handful of depths, and its own
   * depth buffer says which, so the map is fitted to those (see `fitTo`).
   */
  render(
    renderer: THREE.WebGLRenderer,
    scene: THREE.Scene,
    sun: SunShadowSettings,
    hide: THREE.Material[],
    seen?: SeenByThePass | null,
  ) {
    const most = Math.max(256, Math.min(8192, Math.round(sun.resolution ?? 4096)));
    // From the sun's side, looking back at the box's centre, deep enough for its whole diagonal.
    const centre = sun.bounds.getCenter(new THREE.Vector3());
    const radius = Math.max(1e-3, sun.bounds.getSize(new THREE.Vector3()).length() / 2);
    const toward = sun.towardSun.clone().normalize();
    this.camera.position.copy(centre).addScaledVector(toward, radius * 2);
    // Any `up` that is not the sun's own direction.
    this.camera.up.set(0, 1, 0);
    if (Math.abs(toward.y) > 0.99) this.camera.up.set(0, 0, 1);
    this.camera.lookAt(centre);
    this.camera.updateMatrixWorld(true);
    const { sides, side } = this.fitTo(renderer, sun.bounds, radius, most, seen ?? null, sun.groundAt ?? null);
    const [left, right, bottom, top] = sides;
    // One capture per size, kept: the sizes are powers of two, so there are a handful, and resizing one
    // target on every pass would reallocate it on every tile.
    let capture = this._captures.get(side);
    if (!capture) {
      capture = new SurfaceCapturePass(side, side);
      this._captures.set(side, capture);
    }
    capture.onPixels = this.onPixels;
    this._capture = capture;
    this._side = side;
    this.camera.left = left;
    this.camera.right = right;
    this.camera.top = top;
    this.camera.bottom = bottom;
    this.camera.near = radius * 0.5;
    this.camera.far = radius * 3.5;
    this.camera.updateProjectionMatrix();
    this.camera.updateMatrixWorld(true);

    // The overlays are hidden for it exactly as for the main capture: they emit no G-buffer extras.
    const hidden: THREE.Material[] = [];
    for (const m of hide) {
      if (m.visible) {
        m.visible = false;
        hidden.push(m);
      }
    }
    // Depth only: it is all the shadow reads. `__sunFullCapture` draws the whole G-buffer, the control.
    this._capture.render(renderer, scene, this.camera, true, !(globalThis as any).__sunFullCapture);
    for (const m of hidden) m.visible = true;
  }

  /**
   * The sides of the sun's view, in its own x and y: where the pass's visible surfaces fall in it, within the
   * box's, rounded so a pan at one zoom moves the map a whole number of texels (a map that slides by a
   * fraction makes every shadow edge crawl) and a zoom changes it in steps rather than every wheel click.
   *
   * The pass's depth is summed into blocks, each with its nearest and farthest surface; each block is a small
   * box of the world, and the map covers where those boxes fall as the sun sees them.
   */
  private fitTo(
    renderer: THREE.WebGLRenderer,
    bounds: THREE.Box3,
    radius: number,
    most: number,
    seen: SeenByThePass | null,
    groundAt: number | null = null,
  ): { sides: [number, number, number, number]; side: number } {
    const whole: [number, number, number, number] = [-radius, radius, -radius, radius];
    /**
     * 🔴 HOW MANY TEXELS, FROM THE PASS, NOT A FIXED 4096. Every photograph of a tile drew a 4096 square
     * map of the sun — sixteen million depth pixels — for a tile of 377: measured on racbasic by replaying
     * Antonio's pan and zoom, the GPU process was busy 44 of 55 seconds and the tiles waited for it. A texel
     * finer than the pass's pixel shows nothing (see below), so the map needs as many texels as the width it
     * covers has pixels of the pass, in powers of two, and never more than the settings allow.
     */
    // `__sunFixedSide`: the control, every map at the most the settings allow, as before.
    const sideFor = (width: number, pixel: number) =>
      !(globalThis as any).__sunFixedSide && Number.isFinite(pixel) && pixel > 0
        ? Math.min(most, Math.max(256, 2 ** Math.ceil(Math.log2(width / pixel))))
        : most;
    const say = (why: string, side: number, width = 2 * radius, blocksSeen = 0) => {
      this.lastFit = { width, texel: width / side, blocksSeen, why };
    };
    if (!seen || !seen.width || !seen.height) {
      say("no pass to fit to", most);
      return { sides: whole, side: most };
    }
    const pixel = new THREE.Vector3(0, 0, 0.5)
      .unproject(seen.camera)
      .distanceTo(new THREE.Vector3(2 / seen.width, 0, 0.5).unproject(seen.camera));
    const wholly = (why: string, blocksSeen = 0) => {
      const side = sideFor(2 * radius, pixel);
      say(why, side, 2 * radius, blocksSeen);
      return { sides: whole, side };
    };
    const intoSun = this.camera.matrixWorldInverse;
    const point = new THREE.Vector3();
    const shadowBoundsOf = () => ({ lowX: Infinity, highX: -Infinity, lowY: Infinity, highY: -Infinity });
    const takeInto = (into: ReturnType<typeof shadowBoundsOf>) => (x: number, y: number, z: number) => {
      point.set(x, y, z).unproject(seen.camera).applyMatrix4(intoSun);
      into.lowX = Math.min(into.lowX, point.x);
      into.highX = Math.max(into.highX, point.x);
      into.lowY = Math.min(into.lowY, point.y);
      into.highY = Math.max(into.highY, point.y);
    };
    // Where the pass's frame crosses the ground plane, when there is one: those points receive a shadow with no
    // surface drawn under them, so no depth the pass captured says they are there.
    const lowCorner = new THREE.Vector3();
    const takeGround = (into: ReturnType<typeof shadowBoundsOf>) => {
      if (groundAt === null) return;
      const low = seen.reversed ? 1 : -1;
      const high = seen.reversed ? 0 : 1;
      for (const [x, y] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
        lowCorner.set(x, y, low).unproject(seen.camera);
        point.set(x, y, high).unproject(seen.camera);
        const run = point.y - lowCorner.y;
        if (Math.abs(run) < 1e-9) continue;
        const s = (groundAt - lowCorner.y) / run;
        if (s < 0 || s > 1) continue;
        point.sub(lowCorner).multiplyScalar(s).add(lowCorner).applyMatrix4(intoSun);
        into.lowX = Math.min(into.lowX, point.x);
        into.highX = Math.max(into.highX, point.x);
        into.lowY = Math.min(into.lowY, point.y);
        into.highY = Math.max(into.highY, point.y);
      }
    };
    const all = shadowBoundsOf();
    for (let i = 0; i < 8; i += 1) {
      point.set(i & 1 ? bounds.max.x : bounds.min.x, i & 2 ? bounds.max.y : bounds.min.y, i & 4 ? bounds.max.z : bounds.min.z);
      point.applyMatrix4(intoSun);
      all.lowX = Math.min(all.lowX, point.x);
      all.highX = Math.max(all.highX, point.x);
      all.lowY = Math.min(all.lowY, point.y);
      all.highY = Math.max(all.highY, point.y);
    }
    /**
     * A square map over what `found` covers, as wide as the wider side plus a margin for the lookup's own
     * offset, in quarter-doubling steps; never wider than the whole box. Null when it is not worth it.
     *
     * 🔴 AND NEVER FINER THAN A PIXEL OF THE PASS. A texel smaller than what the pass can show buys nothing,
     * and it costs: the lookup is pushed off its surface by a texel and a half, and once that went below what
     * the pass's own depth can tell apart (a tenth of a millimetre, against a texel of a tenth) the facades
     * came out striped with their own shadow. Measured on racbasic: 377 pixel tiles of 3.2 mm each, fitted
     * down to 0.1 mm texels where they showed a single wall.
     */
    const squareOver = (found: ReturnType<typeof shadowBoundsOf>) => {
      const lowX = Math.max(found.lowX, all.lowX);
      const highX = Math.min(found.highX, all.highX);
      const lowY = Math.max(found.lowY, all.lowY);
      const highY = Math.min(found.highY, all.highY);
      if (!(highX > lowX && highY > lowY) || !Number.isFinite(lowX + highX + lowY + highY)) return null;
      const covers = Math.max((highX - lowX) * 1.05, (highY - lowY) * 1.05);
      const side = sideFor(covers, pixel);
      const wanted = Math.max(covers, Number.isFinite(pixel) ? pixel * side : 0);
      const width = Math.min(2 * radius, 2 ** (Math.ceil(Math.log2(wanted) * 4) / 4));
      if (width >= 2 * radius) return null;
      const texel = width / side;
      const midX = Math.round((lowX + highX) / 2 / texel) * texel;
      const halfwayUp = Math.round((lowY + highY) / 2 / texel) * texel;
      return { sides: [midX - width / 2, midX + width / 2, halfwayUp - width / 2, halfwayUp + width / 2] as [number, number, number, number], side, width, texel };
    };
    /**
     * 🔴 THE CHEAP ANSWERS FIRST, BECAUSE THE GOOD ONE STALLS. Reading the pass's depth back makes the CPU wait
     * for the GPU to finish it: 4.7 s of one minute of Antonio's pan and zoom, on every photograph of every
     * tile. It is only worth it when nothing cheaper is fine enough. Zoomed out, a map of the whole box is
     * already as fine as a pixel of the pass. Nearer, the frame carried through the box's depth — which needs
     * nothing from the GPU — often is too. Only close in, where a small frame carried through the model's depth
     * spreads wide in the sun's view, are the pass's own depths read.
     */
    if (2 * radius / most <= pixel) return wholly("the whole box is as fine as the pass");
    {
      let nearestZ = Infinity;
      let farthestZ = -Infinity;
      for (let i = 0; i < 8; i += 1) {
        point.set(i & 1 ? bounds.max.x : bounds.min.x, i & 2 ? bounds.max.y : bounds.min.y, i & 4 ? bounds.max.z : bounds.min.z);
        // The box's depth range as the pass's own z, clamped to what it can see.
        const z = point.project(seen.camera).z;
        nearestZ = Math.min(nearestZ, z);
        farthestZ = Math.max(farthestZ, z);
      }
      const low = seen.reversed ? 0 : -1;
      const zs = [Math.max(low, Math.min(1, nearestZ)), Math.max(low, Math.min(1, farthestZ))];
      const framed = shadowBoundsOf();
      const take = takeInto(framed);
      for (const z of zs) for (const [x, y] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) take(x, y, z);
      takeGround(framed);
      const cheap = squareOver(framed);
      if (cheap && cheap.texel <= pixel) {
        say("fitted to the frame through the box", cheap.side, cheap.width);
        return { sides: cheap.sides, side: cheap.side };
      }
    }
    const ranges = this.rangesOf(renderer, seen);
    const fitted = shadowBoundsOf();
    const take = takeInto(fitted);
    // A depth value as the z `unproject` takes: the buffer's own under reversed (zero to one) depth.
    const ndc = (d: number) => (seen.reversed ? d : d * 2 - 1);
    let blocksSeen = 0;
    for (let j = 0; j < BLOCKS; j += 1) {
      for (let i = 0; i < BLOCKS; i += 1) {
        const at = (j * BLOCKS + i) * 4;
        if (!(ranges[at + 2] > 0)) continue;
        blocksSeen += 1;
        const x0 = (i / BLOCKS) * 2 - 1;
        const x1 = ((i + 1) / BLOCKS) * 2 - 1;
        const y0 = (j / BLOCKS) * 2 - 1;
        const y1 = ((j + 1) / BLOCKS) * 2 - 1;
        for (const z of [ndc(ranges[at]), ndc(ranges[at + 1])]) {
          take(x0, y0, z);
          take(x1, y0, z);
          take(x0, y1, z);
          take(x1, y1, z);
        }
      }
    }
    takeGround(fitted);
    // Nothing in the pass to receive a shadow: the smallest map there is, rather than the largest.
    if (!blocksSeen && groundAt === null) {
      say("the pass shows no surface", 256);
      return { sides: whole, side: 256 };
    }
    const fit = squareOver(fitted);
    if (!fit) return wholly("what the pass shows spans the whole box", blocksSeen);
    say("fitted to the surfaces the pass shows", fit.side, fit.width, blocksSeen);
    return { sides: fit.sides, side: fit.side };
  }

  /** The nearest and farthest depth in each block of the pass, and whether it had any surface, read back. */
  private rangesOf(renderer: THREE.WebGLRenderer, seen: SeenByThePass): Float32Array {
    if (!this._ranges) {
      this._ranges = new THREE.WebGLRenderTarget(BLOCKS, BLOCKS, {
        type: THREE.FloatType,
        format: THREE.RGBAFormat,
        minFilter: THREE.NearestFilter,
        magFilter: THREE.NearestFilter,
        depthBuffer: false,
      });
      this._rangeQuad = new FullscreenQuad(
        new THREE.ShaderMaterial({
          uniforms: {
            uDepthSheet: { value: null },
            uSize: { value: new THREE.Vector2() },
            uReversed: { value: false },
          },
          vertexShader: /* glsl */ `void main() { gl_Position = vec4(position.xy, 0.0, 1.0); }`,
          fragmentShader: RANGE_SHADER,
          depthTest: false,
          depthWrite: false,
        }),
      );
    }
    const material = this._rangeQuad!.material as THREE.ShaderMaterial;
    material.uniforms.uDepthSheet.value = seen.depth;
    material.uniforms.uSize.value.set(seen.width, seen.height);
    material.uniforms.uReversed.value = seen.reversed;
    this._rangeQuad!.render(renderer, this._ranges);
    renderer.readRenderTargetPixels(this._ranges, 0, 0, BLOCKS, BLOCKS, this._rangePixels);
    return this._rangePixels;
  }

  dispose() {
    for (const capture of this._captures.values()) capture.dispose();
    this._captures.clear();
    this._capture = null;
    this._ranges?.dispose();
    this._ranges = null;
    (this._rangeQuad?.material as THREE.Material | undefined)?.dispose();
    this._rangeQuad = null;
  }
}
