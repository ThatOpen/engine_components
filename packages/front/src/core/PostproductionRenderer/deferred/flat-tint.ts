import * as THREE from "three";

/**
 * 🔴 A SURFACE A VIEW FILLS SOLID PRINTS THAT FILL FLAT, NOT LIT. Revit draws a solid surface-pattern override as
 * paint laid on the paper: the colour it states, whatever way the face turns and whatever is beside it. Ours went
 * through the tint table, which mixes into the material's colour BEFORE the lighting, so the white that DACH's
 * «Geschossdecken Umgebung» states for the neighbours printed lit grey, and its site plan read as a grey city.
 *
 * The tint table has one byte to say how much of its colour to mix in, and no other room. A full replacement is 255;
 * 254 is still a replacement to the eye and is the mark of a flat one (`FLAT_TINT_AMOUNT`, set where the view's
 * overrides are read). Fragments' own shaders are not touched: this chains one more `onBeforeCompile` onto its SHELL
 * materials, the way its capture, ghost and tint patches chain onto each other, and only for the capture (the MRT
 * extras exist only under `CAPTURE_EMISSION`):
 *
 *   - location 0 takes the tint's colour as it is, unlit;
 *   - the role byte says 0.3 instead of the 0.4 of a repainted surface, so the composite
 *     (`combined-composite-pass.ts`) keeps the colour untonemapped and leaves out the AO, the facing shade and the
 *     sheen, which are all lighting.
 *
 * WebGL only: under the node renderer there is no GLSL to patch, and the sheets are drawn with WebGL.
 */
export const FLAT_TINT_AMOUNT = 254 / 255;

/**
 * 🔴 AND HALFTONE IN A LINE DRAWING GREYS THE LINES, NOT THE FACE. Revit's halftone in a hidden-line view draws an
 * element's lines half way to the paper and leaves its faces paper: DACH's TGA sections show the whole building so,
 * faint, round the ducts in black. The edges here are one ink for everything, so the element says it with the same
 * byte: 252 of 255 is the mark of halftone lines. The capture keeps the face as it was and writes role 0.2, and the
 * composite draws the lines of a pixel of that role in a lighter ink.
 */
export const HALFTONE_LINES_AMOUNT = 252 / 255;

/**
 * 🔴 AND A VIEW CAN DRAW AN ELEMENT'S LINES IN A COLOUR OF THEIR OWN (proposal «control de vista»: a style's
 * Visibility/Graphics row says «projection line colour»). Revit draws a category's projection lines in the colour its row
 * says and leaves its faces as they are. 248 of 255 is the mark: the capture keeps the face paper, writes the tint's colour
 * where the composite reads the face's, and role 0.12; the composite inks the lines of a pixel of that role in that colour.
 */
export const INKED_LINES_AMOUNT = 248 / 255;

/**
 * 🔴 AND A VIEW CAN DRAW AN ELEMENT SEE-THROUGH. Revit's «Transparency» in a view's overrides (by category, filter or
 * element) shows what is behind a surface and keeps the surface's edges: DACH's reinforcement cover draws its column
 * and slabs at 85 % as outlines with the bars inside them. The photograph had no channel for it and drew them opaque,
 * or left them out with their edges. 250 of 255 is the mark of a see-through element in a view's tint table:
 *
 *   - the capture leaves its fragments out, so what is behind is drawn, lit and outlined as if it were not there;
 *   - a second pass (`setSeeThroughPass(true)`, run by the capture for its edges) draws ONLY the marked ones, flagged
 *     translucent as glass is, and their edges are stamped into the face buffer (`translucentEdges`).
 */
export const SEE_THROUGH_AMOUNT = 250 / 255;

const seeThroughPass = { value: 0 };
/**
 * The pass that draws only what a view marks see-through: off (the ordinary capture), on (its faces' ids, for the
 * edges) or "veil" (its colour, at the view's opacity, over what the capture drew).
 */
export function setSeeThroughPass(on: boolean | "veil") {
  seeThroughPass.value = on === "veil" ? 2 : on ? 1 : 0;
}

/**
 * 🔴 AND SEE-THROUGH IS NOT ABSENT: at 80 % a surface still prints a fifth of its colour. DACH's «3D Positionen» draws
 * its steel and slabs so, pale over the white, and as outlines alone the steel was gone from the print. How much of
 * its colour what is see-through lays, for the capture under way: one minus the view's transparency.
 */
const seeThroughOpacity = { value: 0.15 };
export function setSeeThroughOpacity(opacity: number) {
  seeThroughOpacity.value = Math.max(0, Math.min(1, opacity));
}

/**
 * 🔴 AND A VIEW CAN MOVE AN ELEMENT APART FROM THE REST. Revit's «Displace Elements» draws an exploded detail in one
 * 3D view and leaves the model where it is: DACH's cover shows its timber truss with every member lifted off its
 * joint. Where an element is drawn is the view's, like its colour, so it rides the same table: an amount of 232 to
 * 247 says the element is drawn in the tint's colour AND moved by the view's vector number (amount - 232), one of the
 * sixteen `setDisplacements` holds for the capture under way. In the world's frame, metres.
 */
export const DISPLACED_AMOUNT_FIRST = 232;
export const DISPLACED_SLOTS = 16;
export const displacedAmount = (slot: number) => (DISPLACED_AMOUNT_FIRST + slot) / 255;

const displacements = { value: Array.from({ length: DISPLACED_SLOTS }, () => new THREE.Vector3()) };
/** The vectors the view being captured moves its displaced elements by, by slot; none clears them. */
export function setDisplacements(vectors: readonly (readonly number[])[] = []) {
  displacements.value.forEach((vector, slot) => {
    const said = vectors[slot];
    vector.set(said?.[0] ?? 0, said?.[1] ?? 0, said?.[2] ?? 0);
  });
}

/**
 * 🔴 AND A SHADED VIEW OF A SET PRINTS THE MATERIAL'S COLOUR, NOT A LIT SCENE. Revit's shaded and realistic styles
 * print a surface in its colour, a little darker as it turns from the eye; ours lit it with the scene's lights and
 * tone-mapped the result, and a roof seen from above came out overexposed and washed: DACH's site plan printed its
 * orange neighbour (232/193/155) as 237/230/215 where Revit prints 208/184/148, and the whole block as off-whites.
 * With this on, an opaque surface leaves the capture in its own colour (after the view's tint), unlit, with role 0.45:
 * the composite does not tone-map it and still lays the occlusion, the facing shade, the shadows and the ink over it.
 */
const unlit = { value: 0 };
/** The capture under way prints its opaque surfaces in their own colour (see above), or lights them as ever. */
export function setUnlit(on: boolean) {
  unlit.value = on ? 1 : 0;
}

const VERTEX_ANCHOR = "#include <project_vertex>";
const VERTEX_INJECT = /* glsl */ `
#include <project_vertex>
  #ifdef TINT
    // 232 to 247 of 255: displaced by the view (see flat-tint.ts in components front). In view space, after the
    // instance and model matrices, so it is the same shift wherever the element's own frame points.
    float displacedBy = vTint.a * 255.0;
    if (displacedBy > 231.5 && displacedBy < 247.5) {
      mvPosition.xyz += (viewMatrix * vec4(flatTintDisplacements[int(displacedBy - 231.5)], 0.0)).xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  #endif
`;

const ANCHOR = "gCaptureFaceId = vec4(vCaptureFaceId, captureRole);";

const INJECT = /* glsl */ `
  // 250 of 255: see-through (see flat-tint.ts in components front). Outside the tint's own guard on purpose: with no
  // tint at all nothing is see-through, and the see-through pass must then draw nothing.
  bool seeThroughHere = false;
  #ifdef TINT
    seeThroughHere = vTint.a > 0.977 && vTint.a < 0.983;
  #endif
  if ((flatTintSeeThroughPass > 0.5) != seeThroughHere) discard;
  // A shaded view of a set: the surface's own colour, unlit, role 0.45 (see setUnlit). Opaque ones only, and what is
  // see-through in its veil alone (its ids pass writes the role the edges read).
  if (flatTintUnlit > 0.5 && captureRole < 0.5 && (!seeThroughHere || flatTintSeeThroughPass > 1.5)) {
    gl_FragColor = vec4(diffuseColor.rgb, gl_FragColor.a);
    gCaptureFaceId.a = 0.45;
  }
  if (seeThroughHere) {
    // The veil: its colour at the opacity the view leaves it (see setSeeThroughOpacity).
    if (flatTintSeeThroughPass > 1.5) gl_FragColor = vec4(gl_FragColor.rgb, flatTintSeeThroughOpacity);
    // Its id as a small hash, for the pass adds up every see-through face over a pixel (see the capture's edges).
    else gCaptureFaceId = vec4(0.03 + 0.2 * fract(sin(vec3(dot(vCaptureFaceId, vec3(12.9898, 78.233, 37.719)),
      dot(vCaptureFaceId, vec3(39.346, 11.135, 83.155)), dot(vCaptureFaceId, vec3(73.156, 52.235, 9.151)))) * 43758.5453), 1.0);
  }
  #ifdef TINT
    // 254 of 255: a flat tint (see flat-tint.ts in components front).
    if (captureRole > 0.3 && captureRole < 0.5 && vTint.a > 0.993 && vTint.a < 0.998) {
      gl_FragColor = vec4(vTint.rgb, gl_FragColor.a);
      gCaptureFaceId.a = 0.3;
    }
    // And a flat tint on a see-through material is laid as solid as on any other: Revit prints a solid surface
    // pattern whole whatever the material lets through. Its colour only (a translucent surface writes no role).
    else if (captureRole > 0.5 && vTint.a > 0.993 && vTint.a < 0.998) {
      gl_FragColor = vec4(vTint.rgb, 1.0);
    }
    // 252 of 255: halftone lines. The face is not repainted (its role drops below the repainted band), so a pen view
    // keeps it paper; the composite greys its lines.
    else if (captureRole > 0.3 && captureRole < 0.5 && vTint.a > 0.985 && vTint.a < 0.991) {
      gCaptureFaceId.a = 0.2;
    }
    // 248 of 255: lines in a colour of their own. The face's colour is the ink's (a pen view lays paper over it), role
    // 0.12: the composite inks its lines in it.
    else if (captureRole > 0.3 && captureRole < 0.5 && vTint.a > 0.9706 && vTint.a < 0.9745) {
      gl_FragColor = vec4(vTint.rgb, gl_FragColor.a);
      gCaptureFaceId.a = 0.12;
    }
  #endif
`;

/** Chains the flat tint onto a SHELL material that emits the capture and is tinted, once. */
export function paintFlatTints(material: THREE.Material) {
  const data = material.userData;
  if (data.paintsFlatTints || !data.hasCaptureEmission || !data.hasTint) return;
  data.paintsFlatTints = true;
  const previousCompile = material.onBeforeCompile;
  material.onBeforeCompile = function (shader, renderer) {
    previousCompile.call(this, shader, renderer);
    if (!shader.fragmentShader.includes(ANCHOR)) return;
    shader.uniforms.flatTintDisplacements = displacements;
    if (shader.vertexShader.includes(VERTEX_ANCHOR)) {
      shader.vertexShader = `uniform vec3 flatTintDisplacements[${DISPLACED_SLOTS}];\n${shader.vertexShader.replace(VERTEX_ANCHOR, VERTEX_INJECT)}`;
    }
    shader.uniforms.flatTintSeeThroughPass = seeThroughPass;
    shader.uniforms.flatTintUnlit = unlit;
    shader.uniforms.flatTintSeeThroughOpacity = seeThroughOpacity;
    shader.fragmentShader = `uniform float flatTintSeeThroughPass;\nuniform float flatTintUnlit;\nuniform float flatTintSeeThroughOpacity;\n${shader.fragmentShader.replace(ANCHOR, `${ANCHOR}\n${INJECT}`)}`;
  };
  // A new key, or three hands back the program it already compiled without this.
  const previousKey = material.customProgramCacheKey.bind(material);
  material.customProgramCacheKey = () => `${previousKey()}|flatTint+seeThroughAdded+unlit+flatOverGlass+veil+inkedLines`;
  material.needsUpdate = true;
}
