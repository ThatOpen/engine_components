import * as THREE from "three";

/**
 * The point material and its geometry, for the WebGPU build.
 *
 * 🔴 THIS IS NOT A TRANSLATION OF THE GLSL, AND IT CANNOT BE. WebGPU has no
 * `gl_PointSize`: a point primitive is one pixel, full stop — three says so in
 * `PointsNodeMaterial` itself ("WebGPU only supports point primitives with 1
 * pixel size... the material should be used with Sprite and instancing"). The
 * whole design of the WebGL material is adaptive per-point SIZE, so a faithful
 * shader translation would have produced a cloud of one-pixel dots.
 *
 * So the points are drawn as INSTANCED QUADS. three's own `PointsNodeMaterial`
 * already expands a quad per instance whenever the object it draws is not a
 * `THREE.Points` (`setupVertex` branches on `object.isPoints`), so the expansion,
 * the DPR handling and the screen-space offset are three's, not ours; what we
 * supply is where each point is, how big it is in pixels, and what colour.
 *
 * The geometry does NOT copy anything: potree's per-node `position` and `rgba`
 * buffers are re-read as instanced attributes on a shared unit quad. A node that
 * streams in is wrapped, not converted.
 *
 * Everything else — the `getLOD` walk over the visibility texture, the
 * overlap lever, the min/max clamp, the ortho/perspective factor, the round
 * shape with its faded rim, the section planes — is the same arithmetic as the
 * WebGL material, written in TSL.
 */

/** The unit quad three's sprite expansion offsets from (`positionGeometry.xy`). */
const QUAD_POSITIONS = new Float32Array([
  -0.5, -0.5, 0, 0.5, -0.5, 0, 0.5, 0.5, 0, -0.5, 0.5, 0,
]);
const QUAD_INDEX = [0, 1, 2, 0, 2, 3];
/**
 * The quad's own uv, corner for corner. NOT optional: the colour node reads
 * `uv()` to find how far the fragment is from the point's centre, and without
 * the attribute that read is a constant (0,0), which puts every fragment at
 * radius √2 — outside the disc — so the round shape discarded the ENTIRE cloud.
 */
const QUAD_UVS = new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]);

/** Same knobs as the WebGL material's uniform block, so the loader drives both alike. */
export interface PointUniformValues {
  visibleNodes: { value: THREE.Texture | null };
  uOctreeSize: { value: number };
  uOctreeSpacing: { value: number };
  uScreenHeight: { value: number };
  fov: { value: number };
  uOrtho: { value: number };
  uOrthoWorldHeight: { value: number };
  size: { value: number };
  smallestSize: { value: number };
  maxSize: { value: number };
  uOverlap: { value: number };
  uLevel: { value: number };
  uVNStart: { value: number };
  uCircle: { value: number };
  uOutline: { value: number };
  uEmitDepth: { value: number };
  uCutPlanes: { value: THREE.Vector4[] };
  uNumClip: { value: number };
}

export type WebgpuPointMaterial = THREE.Material & {
  uniforms: PointUniformValues;
};

/** Cached per source geometry, so a node is wrapped once however often it is drawn. */
const INSTANCED = new WeakMap<THREE.BufferGeometry, THREE.InstancedBufferGeometry>();

/**
 * Wraps a potree node's geometry as instances of the unit quad. The point
 * positions and colours are the SAME `ArrayBuffer`s potree decoded — re-read
 * through `InstancedBufferAttribute`, never copied.
 */
export function instancedPointGeometry(src: THREE.BufferGeometry) {
  const cached = INSTANCED.get(src);
  if (cached) return cached;

  const position = src.getAttribute("position");
  const rgba = src.getAttribute("rgba");
  const geometry = new THREE.InstancedBufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(QUAD_POSITIONS, 3),
  );
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(QUAD_UVS, 2));
  geometry.setIndex(QUAD_INDEX);
  geometry.setAttribute(
    "iPosition",
    new THREE.InstancedBufferAttribute(
      position.array as Float32Array,
      position.itemSize,
    ),
  );
  geometry.setAttribute(
    "iRgba",
    new THREE.InstancedBufferAttribute(
      rgba.array as Float32Array,
      rgba.itemSize,
      (rgba as THREE.BufferAttribute).normalized,
    ),
  );
  geometry.instanceCount = position.count;
  // The quad is expanded in screen space, so its own bounds say nothing about
  // where the points are; the loader culls by node anyway.
  geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), Infinity);
  INSTANCED.set(src, geometry);
  return geometry;
}

/** Frees the instanced wrapper of a node whose geometry potree has dropped. */
export function disposeInstancedPointGeometry(src: THREE.BufferGeometry) {
  const geometry = INSTANCED.get(src);
  if (!geometry) return;
  geometry.dispose();
  INSTANCED.delete(src);
}

let TSL_MODULE: any = null;

/**
 * Resolves `three/tsl` once, so building a material per streamed node stays
 * synchronous. Lazy on purpose: under the WebGL build that specifier drags in
 * the whole webgpu bundle, and this file is reachable from a module the WebGL
 * road also loads.
 */
export async function prepareWebgpuPoints() {
  TSL_MODULE ??= await import("three/tsl");
}

/**
 * Builds one point material. NOT cloneable: a TSL material's `clone()` copies
 * node REFERENCES, so two wrappers would share one `uLevel` and one visibility
 * texture and fight over them every frame. One call, one material.
 */
export function createWebgpuPointMaterial(
  visibleNodes: THREE.Texture,
): WebgpuPointMaterial {
  const TSL = TSL_MODULE;
  if (!TSL) {
    throw new Error(
      "PointCloudLoader: call `prepareWebgpuPoints()` before building a webgpu point material.",
    );
  }
  const {
    Fn, If, Loop, attribute, uniform, texture,
    int, float, vec3, vec4, ivec2, bitAnd, shiftRight, positionView,
  } = TSL as any;

  const u = {
    // 🔴 A TEXTURE NODE BUILT OVER THE REAL TEXTURE, not `uniform(null, "texture")`.
    // That call makes a plain `UniformNode` holding null, and `textureLoad` feeds
    // its argument to `texture()`, which demands a `THREE.Texture` and throws at
    // BUILD time ("expects a valid instance of THREE.Texture"). The error never
    // showed while the seam was unimplemented, because the material was never
    // compiled: nothing drew it.
    visibleNodes: texture(visibleNodes),
    uOctreeSize: uniform(1),
    uOctreeSpacing: uniform(1),
    uScreenHeight: uniform(1),
    fov: uniform(1),
    uOrtho: uniform(0),
    uOrthoWorldHeight: uniform(1),
    size: uniform(1),
    smallestSize: uniform(2),
    maxSize: uniform(50),
    uOverlap: uniform(1.2),
    uLevel: uniform(0),
    uVNStart: uniform(0),
    uCircle: uniform(1),
    uOutline: uniform(0.18),
    uEmitDepth: uniform(0),
    uNumClip: uniform(0),
    // EIGHT PLAIN UNIFORMS, not a `uniformArray`. An array node mutated through
    // `.array[i].set(...)` was measured never re-uploading in this codebase
    // (`section-blades.mjs` carries the same note): the values stayed at zero on
    // the GPU and every clip test silently passed.
    clip: Array.from({ length: 8 }, () => uniform(new THREE.Vector4())),
  };

  const iPosition = attribute("iPosition", "vec3");
  const iRgba = attribute("iRgba", "vec4");

  /**
   * The LOD walk: descend the visibility texture until the node holding
   * this point is not subdivided, and report the depth reached. The same
   * arithmetic as the WebGL material's GLSL, with two differences that are not choices:
   * `textureLoad` instead of a filtered sample (a vertex stage has no
   * derivatives, and the texture is a 1-D lookup table where filtering would be
   * a bug), and real bit operations instead of the divide-and-compare the GLSL
   * used to fake them on hardware without integer ops.
   */
  const readDetailTier = Fn(() => {
    const offset = vec3(0, 0, 0).toVar();
    const iOffset = int(u.uVNStart).toVar();
    const depth = float(u.uLevel).toVar();
    const result = float(u.uLevel).toVar();
    const done = int(0).toVar();

    Loop({ start: 0, end: 31, type: "int" }, ({ i }: any) => {
      If(done.equal(int(0)), () => {
        const nodeSpan = u.uOctreeSize.div(
          float(2).pow(float(i).add(u.uLevel)),
        );
        const index3d = iPosition.sub(offset).div(nodeSpan).add(0.5).floor();
        const index = int(
          index3d.x.mul(4).add(index3d.y.mul(2)).add(index3d.z).add(0.5).floor(),
        );
        // `.load` clones the base node and points the clone's uniform back at it
        // (`referenceNode`), so every read in this walk shares one binding and a
        // later `.value` swap still reaches all of them.
        const value = u.visibleNodes.load(ivec2(iOffset, int(0)));
        const mask = int(value.r.mul(255).add(0.5).floor());

        If(bitAnd(shiftRight(mask, index), int(1)).equal(int(1)), () => {
          const advanceG = int(value.g.mul(255).add(0.5).floor()).mul(int(256));
          const advanceB = int(value.b.mul(255).add(0.5).floor());
          // How many of this node's children come before ours: the ones below
          // our bit in the mask.
          const below = bitAnd(mask, shiftRight(int(255), int(8).sub(index)));
          const advanceChild = int(0).toVar();
          Loop({ start: 0, end: 8, type: "int" }, ({ i: b }: any) => {
            advanceChild.addAssign(bitAnd(shiftRight(below, b), int(1)));
          });
          iOffset.assign(iOffset.add(advanceG).add(advanceB).add(advanceChild));
          depth.addAssign(1);
        }).Else(() => {
          // A leaf: the texture's alpha carries the node's own LOD offset.
          result.assign(depth.add(value.a.mul(255).div(10).sub(10)));
          done.assign(int(1));
        });

        If(done.equal(int(0)), () => {
          offset.assign(offset.add(index3d.mul(nodeSpan).mul(0.5)));
          result.assign(depth);
        });
      });
    });

    return result;
  });

  /** The point's size IN PIXELS, which is what `sizeNode` wants. */
  const pointSize = Fn(() => {
    const viewZ = positionView.z;
    const projFactor = float(0).toVar();
    If(u.uOrtho.greaterThan(0.5), () => {
      // Orthographic: distance-INDEPENDENT, a constant pixels-per-world-unit.
      projFactor.assign(u.uScreenHeight.div(u.uOrthoWorldHeight));
    }).Else(() => {
      const slope = u.fov.div(2).tan();
      projFactor.assign(u.uScreenHeight.mul(-0.5).div(slope.mul(viewZ)));
    });
    const r = u.uOctreeSpacing.mul(u.uOverlap);
    const worldExtentSize = u.size.mul(r).div(float(2).pow(readDetailTier()));
    return worldExtentSize.mul(projFactor).max(u.smallestSize).min(u.maxSize);
  });

  /** True when the point is on the clipped side of any active section plane. */
  const clipped = Fn(() => {
    const out = int(0).toVar();
    for (let i = 0; i < 8; i++) {
      If(int(i).lessThan(u.uNumClip), () => {
        const plane = u.clip[i];
        If(positionView.dot(plane.xyz).greaterThan(plane.w), () => {
          out.assign(int(1));
        });
      });
    }
    return out;
  });

  const material = new (THREE as any).PointsNodeMaterial();
  // Our own size arithmetic already carries the perspective factor; three's
  // attenuation would apply it a second time.
  material.sizeAttenuation = false;
  material.transparent = false;
  material.blending = THREE.NoBlending;

  material.positionNode = iPosition;
  // A clipped point is collapsed to nothing rather than discarded per fragment:
  // the quad is built in the vertex stage, so zero size is the cheap way out.
  material.sizeNode = Fn(() =>
    clipped().equal(int(1)).select(float(0), pointSize()),
  )();

  material.colorNode = Fn(() => {
    // `uv()` of the expanded quad: (0,0) at one corner, (1,1) at the other.
    const p = TSL.uv().sub(0.5).mul(2);
    const r = p.length();
    If(u.uCircle.greaterThan(0.5).and(r.greaterThan(1)), () => {
      TSL.Discard();
    });
    const rim = u.uOutline
      .mul(TSL.smoothstep(3, 8, pointSize()))
      // (Chained, `x.step(edge)` is `step(edge, x)`: 1 on round points, which are the only ones with a rim.)
      .mul(u.uCircle.step(0.5));
    const col = TSL.mix(
      iRgba.rgb,
      iRgba.rgb.mul(0.25),
      TSL.smoothstep(float(1).sub(rim), float(1), r),
    );
    // uEmitDepth = 1 (EDL pass): alpha carries the linear eye depth; otherwise
    // the composite wants opaque.
    return vec4(col, u.uEmitDepth.greaterThan(0.5).select(positionView.z.negate(), float(1)));
  })();

  // The loader drives both roads through `material.uniforms.X.value`. Rather
  // than teach it two shapes, the node uniforms wear the WebGL one.
  const planes = Array.from({ length: 8 }, (_, i) => u.clip[i].value);
  const facade: any = {
    uCutPlanes: {
      get value() {
        return planes;
      },
      set value(list: THREE.Vector4[]) {
        for (let i = 0; i < 8; i++) u.clip[i].value.copy(list[i] ?? new THREE.Vector4());
      },
    },
  };
  for (const key of Object.keys(u)) {
    if (key === "clip") continue;
    const node = (u as any)[key];
    Object.defineProperty(facade, key, {
      enumerable: true,
      get: () => node,
      set: () => {},
    });
  }
  material.uniforms = facade;
  return material as WebgpuPointMaterial;
}
