// AN MRT THAT WRITES ONLY THE CHANNELS THE CURRENT TARGET HAS.
//
// A material's `mrtNode` is built once per target it is drawn into, and fragments materials are drawn into
// several: the postproduction's scene pass (colour, face, normal), a shadow pass's plain target (one texture,
// named ""), a picker's. three matches MRT outputs to a target's textures BY NAME, and two things go wrong
// when a name is missing:
//
//   - 🔴 three 0.185.0 has no guard for it. `MRTNode.setup` asks the builder for the output type of index -1
//     and throws ("Cannot read properties of undefined (reading 'type')"), so the object never draws. 0.185.1
//     skips the name. Found under components-beta, which runs 0.185.0: every local fragments shell came out
//     missing, because its MRT carried a `""` entry the scene pass has no texture for.
//   - a target that has NONE of the names (a plain render target's texture is named "") gets a fragment
//     output struct with no members, and WebGPU rejects the pipeline: "structures must have at least one
//     member". That is what the `""` entry was added for.
//
// This node skips the names a target does not have, and when it has none of them writes the colour to the
// first texture. `merge` returns the same kind, because three merges the pass MRT with the material's into a
// NEW node, and a plain one would bring the first fault back for any channel the pass lacks.
//
// ⚠️ NO STATIC IMPORT OF `three/webgpu` OR `three/tsl`: fragments' material manager runs on WebGL pages too,
// and those imports would drag the WebGPU module graph into them. The classes are looked up on the `three`
// namespace the first time an MRT is asked for, which only happens under the WebGPU build.

import * as THREE from "three";

let TargetAwareMRTNode = null;

function nodeClass() {
  if (TargetAwareMRTNode) return TargetAwareMRTNode;
  const { MRTNode, OutputStructNode } = THREE;
  TargetAwareMRTNode = class extends MRTNode {
    static get type() {
      return "TargetAwareMRTNode";
    }

    setup(builder) {
      const target = builder.renderer.getRenderTarget();
      const textures = target ? target.textures : [];
      const members = [];
      for (const name in this.outputNodes) {
        const index = textures.findIndex((texture) => texture.name === name);
        if (index < 0) continue;
        members[index] = this.outputNodes[name].convert(builder.getOutputType(index));
      }
      if (members.length === 0 && textures.length > 0 && this.outputNodes.output) {
        members[0] = this.outputNodes.output.convert(builder.getOutputType(0));
      }
      // 🔴 A GAP IN THE MIDDLE IS AN INVALID PIPELINE, AND IT FAILS AS AN EMPTY PICTURE RATHER THAN AS AN
      // EXCEPTION. `members` is indexed by the TEXTURE's position, so a material that supplies channels 0
      // and 2 of a three-texture target leaves slot 1 undefined. WebGPU then refuses the pipeline with
      // "Color target has no corresponding fragment stage output but writeMask is not zero, while
      // validating targets[1]", three logs it and carries on, and the object simply never draws again.
      //
      // ⚰️ Measured: the scene pass runs `["output", "face", "normal"]` and the ribbon material was built
      // carrying `{output, normal}` — 0 and 2, gap at 1. It compiled fine while the first pass to build it
      // was the two-texture `["output", "normal"]` one, and died the first time it was rebuilt against the
      // three-texture one. A fault that depends on WHICH PASS COMPILES FIRST is the worst kind to leave
      // reachable, so the shape is refused here rather than handed to the driver.
      //
      // ⚠️ IT DROPS THE CHANNELS ABOVE THE GAP INSTEAD OF INVENTING VALUES FOR IT. The only value this
      // wrapper could put in the gap is zero, and zero is not neutral: in the `face` channel it means
      // "background", which would erase whatever the geometry underneath wrote and change the AO. Dropping
      // is exactly what the material did before it grew the higher channel, so it can lose a refinement but
      // never corrupt a channel. The material that wants the higher channel has to supply the lower one —
      // see the ribbon's `face` lane in `coat-of-arms.mjs`.
      let gap = -1;
      for (let i = 0; i < members.length; i++) {
        if (members[i] === undefined) { gap = i; break; }
      }
      if (gap >= 0) {
        const lost = members.length - gap;
        members.length = gap;
        if (!TargetAwareMRTNode.warned) {
          TargetAwareMRTNode.warned = true;
          console.warn(
            `[fragments] an MRT skipped channel ${gap} of ${textures.map((t) => t.name).join(", ")} `
            + `(the material writes ${Object.keys(this.outputNodes).join(", ")}), so ${lost} higher channel(s) `
            + "were dropped to keep the pipeline valid. Give the material that channel.",
          );
        }
      }
      this.members = members;
      return OutputStructNode.prototype.setup.call(this, builder);
    }

    // ⚠️ The blend modes travel with the outputs. three's own `merge` assigns them to `blendings`, a name
    // nothing reads, so a merged node silently fell back to no blending on every channel but `output`.
    merge(other) {
      const merged = new TargetAwareMRTNode({ ...this.outputNodes, ...other.outputNodes });
      merged.blendModes = { ...this.blendModes, ...(other.blendModes ?? {}) };
      return merged;
    }
  };
  return TargetAwareMRTNode;
}

/**
 * `mrt(outputNodes)` that only writes the channels the current render target has.
 *
 * @param {Object<string, object>} outputNodes  channel name → node, as for three's `mrt`
 */
export function targetAwareMRT(outputNodes) {
  const NodeClass = nodeClass();
  return new NodeClass(outputNodes);
}
