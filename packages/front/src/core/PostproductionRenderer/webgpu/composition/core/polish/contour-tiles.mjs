// THE CONTOUR'S SEEDS, READ ONCE PER TILE INSTEAD OF THIRTEEN TIMES PER PIXEL. On by default (`globalThis.__contourTiles
// = false` before mounting is the control), and only where `deferred-look.mjs` would draw the same thing: no view
// crop, a face with its role byte. Cold machine, near views of a large federation (2026-10-03): the composite 5.6 → 3.3 ms plus 0.9
// for this dispatch; on Antonio's tour, inside 42 → 46 pictures a second.
//
// The composite's contour reads, for every pixel, the face id of 13 texels (5 seeds, each against its 4 neighbours),
// and each read that finds the attachment's clear also reads the depth. Measured with GPU timestamps on superbig at
// 2880×1530: ~0.37 ms per read per pixel, ~5-6.6 ms for the contour on a frame with NO line in it. This compute does
// the same arithmetic by 16×16 tiles: every id (and depth, where the face is clear) is read once per tile into
// workgroup memory, the seeds and the nearest-seed distance come out of shared memory, and the distance lands in an
// r32float texture the composite reads once. Measured 1.9-2.4 ms for the dispatch. Validated against a CPU port of
// the composite's own contour (0 of 65,536 pixels differ) and in the
// page: the whole 2880×1530 frame is identical with and without it (0 of 4,406,400 pixels), and the frame's GPU time
// drops ~5 ms (superbig ×1: 18.2 → 13.5 at the model, 16.8 → 11.4 on an empty view; GPU timestamps, 3 rounds).
//
// ⚠️ RAW WEBGPU INSIDE A TSL NODE. The dispatch is submitted from `updateBefore`, which runs after the scene pass (its
// texture nodes are built first, so its pass node is registered first) and before the composite quad; three submits
// each pass as it renders, so the queue order is scene → tiles → composite.

import * as THREE from "three";
import { texture, uv } from "three/tsl";

const TILE = 16;

function shaderFor(side, offsets, reversed, emptyFromFace) {
  const H = side + 1;
  const S = TILE + 2 * H;
  const Q = TILE + 2 * side;
  const far = reversed ? "d <= 0.0" : "d >= 1.0";
  const lines = offsets.map(([ox, oy, len]) =>
    `  if (seeds[u32(ly + ${oy + side}) * ${Q}u + u32(lx + ${ox + side})] != 0u) { nearest = min(nearest, ${len.toFixed(8)}); }`).join("\n");
  return /* wgsl */ `
@group(0) @binding(0) var faceT: texture_2d<f32>;
@group(0) @binding(1) var depthT: texture_depth_2d;
@group(0) @binding(2) var outT: texture_storage_2d<r32float, write>;
var<workgroup> ids: array<u32, ${S * S}>;
var<workgroup> seeds: array<u32, ${Q * Q}>;

fn idAt(c: vec2<i32>, size: vec2<i32>) -> u32 {
  let cc = clamp(c, vec2<i32>(0), size - vec2<i32>(1));
  let f = textureLoad(faceT, cc, 0);
  let b = vec3<u32>(round(f.rgb * 255.0));
  var id = b.x | (b.y << 8u) | (b.z << 16u);
  ${emptyFromFace
    ? `if (b.x == 0u && b.y == 0u && b.z == 0u && f.a > 0.5) { let d = textureLoad(depthT, cc, 0); if (${far}) { id = 0xFFFFFFu; } }`
    : `{ let d = textureLoad(depthT, cc, 0); if (${far}) { id = 0xFFFFFFu; } }`}
  return id;
}

@compute @workgroup_size(${TILE}, ${TILE})
fn main(@builtin(workgroup_id) wg: vec3<u32>, @builtin(local_invocation_index) li: u32) {
  let size = vec2<i32>(textureDimensions(faceT));
  let origin = vec2<i32>(wg.xy) * ${TILE} - vec2<i32>(${H});
  for (var i = li; i < ${S * S}u; i += ${TILE * TILE}u) {
    ids[i] = idAt(origin + vec2<i32>(i32(i % ${S}u), i32(i / ${S}u)), size);
  }
  workgroupBarrier();
  for (var i = li; i < ${Q * Q}u; i += ${TILE * TILE}u) {
    let sx = i % ${Q}u + 1u; let sy = i / ${Q}u + 1u;
    let c = ids[sy * ${S}u + sx];
    let s = ids[sy * ${S}u + sx + 1u] != c || ids[(sy + 1u) * ${S}u + sx] != c || ids[sy * ${S}u + sx - 1u] != c || ids[(sy - 1u) * ${S}u + sx] != c;
    seeds[i] = select(0u, 1u, s);
  }
  workgroupBarrier();
  let lx = i32(li % ${TILE}u); let ly = i32(li / ${TILE}u);
  let p = vec2<i32>(wg.xy) * ${TILE} + vec2<i32>(lx, ly);
  if (p.x >= size.x || p.y >= size.y) { return; }
  var nearest = 1000.0;
${lines}
  textureStore(outT, p, vec4<f32>(nearest, 0.0, 0.0, 0.0));
}`;
}

/** The same offsets `deferred-look.mjs` compiles in for a reach (`lineRadius`). */
function offsetsFor(reach, maxRadius) {
  const side = Math.floor(reach);
  const offsets = [];
  for (let oy = -side; oy <= side; oy++) {
    for (let ox = -side; ox <= side; ox++) {
      const length = Math.hypot(ox, oy);
      if (reach < maxRadius && length >= reach) continue;
      offsets.push([ox, oy, length]);
    }
  }
  return { side, offsets };
}

class ContourTilesNode extends THREE.Node {
  constructor(state) {
    super("float");
    this.state = state;
    this.updateBeforeType = THREE.NodeUpdateType.FRAME;
  }

  setup() {
    return this.state.sample;
  }

  updateBefore() {
    this.state.dispatch();
  }
}

/**
 * @returns a float node: the distance to the nearest contour seed at this pixel, as the composite's loop computes it
 *   (1000 where there is none).
 */
export function contourTilesNode({ renderer, faceTexture, depthTexture, reach, maxRadius, reversed, emptyFromFace }) {
  const { side, offsets } = offsetsFor(reach, maxRadius);
  const code = shaderFor(side, offsets, reversed, emptyFromFace);
  const out = new THREE.StorageTexture(1, 1);
  out.type = THREE.FloatType;
  out.format = THREE.RedFormat;
  out.minFilter = THREE.NearestFilter;
  out.magFilter = THREE.NearestFilter;
  out.generateMipmaps = false;
  const textureNode = texture(out);
  const state = {
    sample: textureNode.sample(uv()).r,
    pipeline: null,
    bind: null,
    key: [],
    dispatch() {
      const backend = renderer.backend;
      const device = backend.device;
      const face = backend.get(faceTexture)?.texture;
      const depth = backend.get(depthTexture)?.texture;
      if (!device || !face || !depth) return;
      if (out.image.width !== face.width || out.image.height !== face.height) {
        out.image.width = face.width;
        out.image.height = face.height;
        out.dispose();
        renderer.initTexture(out);
      }
      const target = backend.get(out)?.texture;
      if (!target) {
        renderer.initTexture(out);
        return;
      }
      // ⚠️ MULTISAMPLED TARGETS. With `antialias` the face and depth textures have 4 samples, and binding them as
      // plain textures made ONE invalid bind group at the first frame that then failed every frame after (
      // under WebGPU: the composite went dark, ~100 errors a second). The multisampled variant reads sample 0, the
      // same `textureLoad(t, c, 0)` call with the third argument meaning the sample instead of the level.
      // Each texture on its own: measured, the face channel arrives resolved (1 sample) while the depth keeps 4.
      const multisampled = `${face.sampleCount > 1 ? 1 : 0}${depth.sampleCount > 1 ? 1 : 0}`;
      if (!this.pipeline || this.multisampled !== multisampled) {
        this.multisampled = multisampled;
        let source = code;
        if (face.sampleCount > 1) source = source.replace("texture_2d<f32>", "texture_multisampled_2d<f32>");
        if (depth.sampleCount > 1) source = source.replace("texture_depth_2d", "texture_depth_multisampled_2d");
        this.pipeline = device.createComputePipeline({
          layout: "auto",
          compute: { module: device.createShaderModule({ code: source }), entryPoint: "main" },
        });
        this.key = [];
      }
      if (this.key[0] !== face || this.key[1] !== depth || this.key[2] !== target) {
        this.key = [face, depth, target];
        this.bind = device.createBindGroup({
          layout: this.pipeline.getBindGroupLayout(0),
          entries: [
            { binding: 0, resource: face.createView() },
            { binding: 1, resource: depth.createView({ aspect: "depth-only" }) },
            { binding: 2, resource: target.createView() },
          ],
        });
      }
      const encoder = device.createCommandEncoder();
      // ⏱️ `globalThis.__contourTilesTime`: GPU timestamps of this pass into `state.lastMs` (three's own timestamps do
      // not see a raw dispatch, so a frame measured with them leaves this out).
      const timed = globalThis.__contourTilesTime === true && device.features.has("timestamp-query");
      if (timed && !this.query) {
        this.query = {
          set: device.createQuerySet({ type: "timestamp", count: 2 }),
          resolve: device.createBuffer({ size: 16, usage: GPUBufferUsage.QUERY_RESOLVE | GPUBufferUsage.COPY_SRC }),
          read: device.createBuffer({ size: 16, usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ }),
          busy: false,
        };
      }
      const q = timed && !this.query.busy ? this.query : null;
      const pass = encoder.beginComputePass(q ? { timestampWrites: { querySet: q.set, beginningOfPassWriteIndex: 0, endOfPassWriteIndex: 1 } } : undefined);
      pass.setPipeline(this.pipeline);
      pass.setBindGroup(0, this.bind);
      pass.dispatchWorkgroups(Math.ceil(face.width / TILE), Math.ceil(face.height / TILE));
      pass.end();
      if (q) {
        encoder.resolveQuerySet(q.set, 0, 2, q.resolve, 0);
        encoder.copyBufferToBuffer(q.resolve, 0, q.read, 0, 16);
      }
      device.queue.submit([encoder.finish()]);
      if (q) {
        q.busy = true;
        q.read.mapAsync(GPUMapMode.READ).then(() => {
          const t = new BigUint64Array(q.read.getMappedRange().slice(0));
          q.read.unmap();
          this.lastMs = Number(t[1] - t[0]) / 1e6;
          globalThis.__contourTilesLastMs = this.lastMs;
          q.busy = false;
        });
      }
    },
  };
  const node = new ContourTilesNode(state);
  return {
    node,
    dispose() {
      out.dispose();
    },
  };
}
