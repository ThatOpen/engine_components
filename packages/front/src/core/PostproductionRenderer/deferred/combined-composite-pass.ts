import * as THREE from "three";
import { FullscreenQuad } from "./fullscreen-quad";

/**
 * Single fullscreen composite. Folds, in order: tonemap the shaded colour, paper
 * mix, AO multiply, tonal orientation shade, facing-sheen + Fresnel NPR term,
 * faceId contour overlay, sRGB encode, dither.
 *
 * Effects:
 *  - Contour (faceId): edges come from the faceId attachment alone. The capture
 *    clears it to a reserved "no element" sentinel, so background reads as a faceId
 *    no surface uses. Left / down neighbours are tested only for that sentinel
 *    (silhouette), right / up for any faceId change (interior), so silhouettes ink
 *    on every empty-touching side while interior boundaries ink one side and stay
 *    1px wide. Diagonals step evenly because one rule owns the whole outline.
 *  - Sheen (facing-sheen + Fresnel):
 *    gloss = glossFactor * pow(1 - max(N·V,0), glossExp);
 *    fresnel = fresnelFactor * pow(max(N·V,0), fresnelExp);
 *    combined = remap(gloss+fresnel, outputMin, outputMax); colour = base + combined.
 *    Defaults are tuned subtle: sheen tight + subtle, Fresnel quieted, output floor
 *    0 / ceiling ~half. Additive composition can bias dark, so keep it subtle.
 *  - Tonemap (Narkowicz ACES rational fit, 2015): public constants a..e; INPUT IS
 *    CLAMPED >= 0 first, because a slightly negative channel otherwise maps to a
 *    positive hue-shifted (magenta) value. Applied ONLY to the scene-referred
 *    shaded colour, before the paper mix — the synthetic paper, AO, ink and the
 *    background clear are already display-referred and must not be tonemapped (a
 *    film curve maps white 1.0 to ~0.8, which would gray out paper + background).
 *
 * Order invariant: tonemap the shaded colour first, gamma-encode last, dither
 * after the encode. The background branch passes the clear through untouched.
 */
const compositeFragment = /* glsl */ `
  precision highp float;
  in vec2 vUv;
  out vec4 outColor;

  uniform sampler2D uColor;     // forward-shaded scene colour (HDR-ish, linear)
  uniform sampler2D uOcclusion;        // R = denoised AO
  uniform sampler2D uDepthSheet;     // R = float32 NDC depth in [0,1] (capture depth)
  uniform sampler2D uNormal;    // RG = octahedral view normal
  uniform sampler2D uFaceId;    // RGBA8 packed faceId (+ role byte)
  uniform sampler2D uSeed;      // R = 1.0 where a pixel is a contour seed (pre-pass)
  uniform vec2 uTexel;
  uniform vec2 uProjScaleXY;    // (P00, P11)
  uniform float uNear;
  uniform float uFar;
  uniform bool uReversed;       // reversed-Z buffer (ZERO_TO_ONE, near->1 far->0)
  uniform bool uOrtho;          // orthographic projection

  // Surface colour vs flat "paper" (NPR styles drop the shaded colour and draw
  // on white, so AO reads as shadow and the contour reads as ink).
  uniform float uColorEnabled;  // 0 = paper white, 1 = shaded colour
  uniform vec3 uPaper;          // the paper's colour, linear: white unless a view is drawn on another ground
  // AO
  uniform float uAoStrength;
  // Tonal orientation shade (view-angle darkening)
  uniform float uTonalEnabled; // 0 = off, 1 = on
  uniform float uTonalFloor;   // brightness of fully-grazing surfaces (1 = no effect)
  // Contour
  uniform vec3 uEdgeColor;
  uniform float uEdgeStrength;
  uniform float uContourEnabled; // 0 = no ink, 1 = draw contour
  uniform float uEdgeHalfWidth;  // distance-coverage line half-width (px)
  uniform float uEdgeAA;         // smoothstep softness (px)
  // Sheen
  uniform float uGlossExp;
  uniform float uGlossFactor;
  uniform float uFresnelExp;
  uniform float uFresnelFactor;
  uniform float uSheenOutMin;
  uniform float uSheenOutMax;
  uniform vec3 uSheenColor;
  // Dither
  uniform float uDitherAmount;
  // Cast shadow of the sun (see sun-shadow-pass.ts): a depth map seen from the sun and a flat tone.
  uniform float uSunOn;
  uniform sampler2D uSunDepth;
  uniform mat4 uViewToSunClip;  // this camera's view space -> the sun camera's clip space
  uniform mat4 uViewToSunView;  // this camera's view space -> the sun camera's view space
  uniform float uSunNear;
  uniform float uSunFar;
  uniform float uSunTone;
  uniform float uGroundOn;      // the view's shadows also fall on a plane that is not drawn
  uniform float uGroundAt;      // its height, world +Y
  uniform float uSunNormalBias; // metres the lookup is pushed along the normal, against acne
  uniform float uSunBias;       // metres of slack in the depth comparison
  uniform vec2 uProjOffsetXY;   // ortho (P12, P13), perspective (P8, P9): an off-centre frustum's shift
  // The view's sky (see ViewBackgroundSettings): colours, the crop it is painted inside, and its heights.
  uniform float uSkyOn;
  uniform vec3 uSky;
  uniform vec3 uHorizon;
  uniform vec3 uGround;
  uniform mat4 uViewToWorld;
  uniform vec3 uCropCentre;
  uniform vec3 uCropRight;
  uniform vec3 uCropUp;
  uniform vec2 uCropHalf;
  uniform float uSkyTop;        // world height of the crop's top edge; the horizon is at zero
  uniform float uSkyBottom;     // and of its bottom edge

  vec3 octDecode(vec2 e) {
    vec3 n = vec3(e.xy, 1.0 - abs(e.x) - abs(e.y));
    if (n.z < 0.0) {
      n.xy = (1.0 - abs(n.yx)) * vec2(n.x >= 0.0 ? 1.0 : -1.0, n.y >= 0.0 ? 1.0 : -1.0);
    }
    return normalize(n);
  }

  vec3 viewPos(vec2 uv, float d) {
    vec2 ndc = uv * 2.0 - 1.0;
    // Orthographic eye-X/Y are depth-independent (x = ndc.x / P00); only the
    // perspective frustum scales them by depth.
    float s = uOrtho ? 1.0 : d;
    return vec3(ndc.x * s / uProjScaleXY.x, ndc.y * s / uProjScaleXY.y, -d);
  }

  // The view-space point, exact for an OFF-CENTRE frustum too.
  //
  // viewPos above assumes a symmetric one, which is right for the AO and the sheen and wrong here: the canvas
  // photographs a sheet in tiles, each through a camera cropped to its region, and ignoring the crop put
  // every pixel metres away from where it is — the sun's lookup fell off its map and nothing was shadowed.
  vec3 viewPosExact(vec2 uv, float d) {
    vec2 ndc = uv * 2.0 - 1.0;
    if (uOrtho) {
      return vec3((ndc.x - uProjOffsetXY.x) / uProjScaleXY.x, (ndc.y - uProjOffsetXY.y) / uProjScaleXY.y, -d);
    }
    return vec3(d * (ndc.x + uProjOffsetXY.x) / uProjScaleXY.x, d * (ndc.y + uProjOffsetXY.y) / uProjScaleXY.y, -d);
  }

  // The sky behind the model at this pixel, and whether there is any: none outside the view's crop.
  vec4 skyAt(vec2 uv) {
    if (uSkyOn < 0.5) return vec4(0.0);
    vec3 W = (uViewToWorld * vec4(viewPosExact(uv, uNear), 1.0)).xyz;
    vec3 fromCentre = W - uCropCentre;
    if (abs(dot(fromCentre, uCropRight)) > uCropHalf.x || abs(dot(fromCentre, uCropUp)) > uCropHalf.y) return vec4(0.0);
    float h = W.y;
    vec3 c = h >= 0.0
      ? mix(uHorizon, uSky, uSkyTop > 0.0 ? clamp(h / uSkyTop, 0.0, 1.0) : 1.0)
      : mix(uHorizon, uGround, uSkyBottom < 0.0 ? clamp(h / uSkyBottom, 0.0, 1.0) : 1.0);
    return vec4(c, 1.0);
  }

  // Whether the sun's shadow falls on the view's ground plane at this pixel, where no model was drawn.
  // The plane is where this pixel's ray crosses the ground height; it is in shadow when something the sun's
  // map holds is nearer the sun. A texel the map never wrote (cleared to its far end) holds nothing, so a
  // point beyond the model's box is lit, not dark.
  bool groundInShadow(vec2 uv) {
    if (uSunOn < 0.5 || uGroundOn < 0.5) return false;
    vec3 A = viewPosExact(uv, uNear);
    vec3 B = viewPosExact(uv, uFar);
    float ya = (uViewToWorld * vec4(A, 1.0)).y;
    float yb = (uViewToWorld * vec4(B, 1.0)).y;
    if (abs(yb - ya) < 1e-6) return false;
    float s = (uGroundAt - ya) / (yb - ya);
    if (s < 0.0 || s > 1.0) return false;
    vec3 P = mix(A, B, s);
    vec4 clip = uViewToSunClip * vec4(P, 1.0);
    vec2 suv = clip.xy / clip.w * 0.5 + 0.5;
    if (suv.x < 0.0 || suv.x > 1.0 || suv.y < 0.0 || suv.y > 1.0) return false;
    float d = texture(uSunDepth, suv).r;
    float t = uReversed ? (1.0 - d) : d;
    if (t >= 0.9999) return false;
    float mapDist = uSunNear + t * (uSunFar - uSunNear);
    float pixelDist = -(uViewToSunView * vec4(P, 1.0)).z;
    return pixelDist > mapDist + uSunBias;
  }

  // NDC depth -> positive linear eye distance. The same mapping the Hi-Z
  // linearize uses, so AO-on and AO-off frames agree. We read the raw capture
  // depth here rather than the Hi-Z level-0 texture, so the composite needs no
  // depth pyramid: with AO off none is built at all. Orthographic depth is already
  // linear in eye-Z, so it gets a plain [near,far] remap, not the perspective
  // rational fit (which would be wrong for it).
  float linearizeDepth(float d) {
    if (uOrtho) {
      float t = uReversed ? (1.0 - d) : d;
      return uNear + t * (uFar - uNear);
    }
    if (uReversed) return (uNear * uFar) / (uNear - (uNear - uFar) * d);
    float z = d * 2.0 - 1.0;
    return (2.0 * uNear * uFar) / (uFar + uNear - z * (uFar - uNear));
  }

  // 24-bit packed faceId -> integer (exact). +0.5 rounds the byte channels losslessly.
  int decodeFaceId(vec4 packed) {
    int r = int(packed.r * 255.0 + 0.5);
    int g = int(packed.g * 255.0 + 0.5);
    int b = int(packed.b * 255.0 + 0.5);
    return (r << 16) | (g << 8) | b;
  }

  // Narkowicz ACES rational fit (2015). Input clamped >= 0: a slightly negative
  // channel crosses x < -b/a and tonemaps to a positive hue-shifted value.
  vec3 narkowiczAces(vec3 x) {
    x = max(x, vec3(0.0));
    const float a = 2.51, b = 0.03, c = 2.43, d = 0.59, e = 0.14;
    return clamp((x * (a * x + b)) / (x * (c * x + d) + e), 0.0, 1.0);
  }

  float luminanceDither(vec2 fragCoord) {
    return fract(sin(dot(fragCoord, vec2(12.9898, 78.233))) * 43758.5453);
  }

  // Isotropic distance-transform contour coverage at a pixel. A seed pixel is one
  // whose faceId differs from ANY 4-neighbour -- a SYMMETRIC test, so it fires on
  // BOTH sides of every boundary (interior id-change AND silhouette vs the NO_ID
  // background). We then take the Euclidean distance to the nearest seed and ramp
  // coverage with smoothstep, giving a band of uniform perpendicular width at any
  // angle. Because the seed is symmetric and this runs for background pixels too
  // (see main), silhouette and interior edges inflate the same on both sides.
  // Reads the precomputed seed mask (uSeed.r == 1.0 where a pixel's faceId differs from
  // ANY 4-neighbour — the SAME symmetric test, computed once in the seed pre-pass). Single
  // taps instead of re-deriving seeds inline; output is identical.
  //
  // The search window follows the requested width. It used to be a fixed 5x5, so the
  // nearest seed it could see was about 2 px away: any uEdgeHalfWidth past that drew the
  // same line as 2 without saying so, and a caller asking for a wide pen (a drawing at a
  // real paper weight, seen close) got a thin one. The radius is now the band's outer
  // edge, uEdgeHalfWidth + uEdgeAA, rounded up and capped at MAX_EDGE_RADIUS. At the
  // default width (0.6 + 0.7) that is 2, which is the same 25 taps as before.
  float edgeCoverage(vec2 uv0) {
    const int MAX_EDGE_RADIUS = 6;
    int radius = int(clamp(ceil(uEdgeHalfWidth + uEdgeAA), 1.0, float(MAX_EDGE_RADIUS)));
    float best = 1e3;
    for (int oy = -MAX_EDGE_RADIUS; oy <= MAX_EDGE_RADIUS; oy++) {
      if (oy < -radius || oy > radius) continue;
      for (int ox = -MAX_EDGE_RADIUS; ox <= MAX_EDGE_RADIUS; ox++) {
        if (ox < -radius || ox > radius) continue;
        vec2 off = vec2(float(ox), float(oy));
        if (texture(uSeed, uv0 + off * uTexel).r > 0.5) best = min(best, length(off));
      }
    }
    return 1.0 - smoothstep(uEdgeHalfWidth - uEdgeAA, uEdgeHalfWidth + uEdgeAA, best);
  }

  void main() {
    vec3 base = texture(uColor, vUv).rgb;
    float rawDepth = texture(uDepthSheet, vUv).r;
    // Cleared/far texels: depth 0 under reversed-Z, 1 under standard-Z. Mapped to
    // uFar so the background test below fires.
    bool isFar = uReversed ? (rawDepth <= 0.0) : (rawDepth >= 1.0);
    float depth = isFar ? uFar : linearizeDepth(rawDepth);

    // No opaque geometry here. A translucent surface writes colour but (by the
    // capture's depth-write-off rule) no depth, so it lands here too: colour alpha
    // marks it. True background keeps the zero clear alpha and passes through
    // untonemapped, so a zero-alpha clear stays transparent and the page/scene
    // behind shows through. Glass over background has alpha > 0; paper styles paint
    // it white so a pen view stays pure white, colour styles keep the tint.
    if (depth >= uFar) {
      vec4 bg = texture(uColor, vUv);
      if (uColorEnabled < 0.5 && bg.a > 0.001) bg = vec4(uPaper, 1.0);
      // The view's sky, under whatever the pass left here (glass keeps its tint over it).
      vec4 sky = skyAt(vUv);
      if (sky.a > 0.0) bg = vec4(mix(sky.rgb, bg.rgb, bg.a), 1.0);
      // The ground plane's shadow, over whatever is behind: where nothing is painted here, a black of the
      // shadow's strength over the paper, so white prints at the tone exactly (a tone of 0.40 prints 102 of 255).
      if (groundInShadow(vUv)) {
        bg = bg.a > 0.001 ? vec4(bg.rgb * uSunTone, bg.a) : vec4(0.0, 0.0, 0.0, 1.0 - uSunTone);
      }
      vec3 bgCol = bg.rgb;
      // Silhouette ink on the BACKGROUND side: without this the outline only
      // grows inward from geometry, so silhouettes read half as thick as interior
      // edges. A background pixel within the line half-width of a silhouette gets
      // the same coverage ramp, so exterior and interior lines inflate equally.
      if (uContourEnabled > 0.5) {
        float covBg = edgeCoverage(vUv);
        if (covBg > 0.0) {
          float a = bg.a;
          outColor = vec4(mix(bgCol, uEdgeColor, uEdgeStrength * covBg),
                          max(a, uEdgeStrength * covBg));
          return;
        }
      }
      outColor = bg;
      return;
    }

    vec3 P = viewPos(vUv, depth);
    vec3 N = octDecode(texture(uNormal, vUv).rg);
    vec4 faceTexel = texture(uFaceId, vUv);
    int idC = decodeFaceId(faceTexel);
    // Role byte (faceId alpha): 1 = translucent surface. Those are excluded from
    // ambient occlusion, so they never read as darkened glass.
    bool translucent = faceTexel.a > 0.5;

    // View direction. Perspective: rays diverge from the eye at the origin, so it
    // is normalize(-P). Orthographic: all rays are parallel down the view axis, so
    // V is the constant +Z (toward the camera) — using normalize(-P) under ortho
    // makes N.V vary across a flat plane and produces a spurious moving hotspot.
    vec3 V = uOrtho ? vec3(0.0, 0.0, 1.0) : normalize(-P);

    // --- Surface colour vs paper ---
    // Tonemap ONLY the real shaded colour here (scene-referred HDR -> display
    // range). The pen styles then drop it for flat display-white paper, so the AO,
    // tonal shade and contour below read as graphite shadow + ink on TRUE white,
    // never a tonemapped off-white. Everything past this point is display-referred.
    // A surface printed in its own colour (role 0.45, see setUnlit in flat-tint.ts) is display-referred already.
    bool ownColour = faceTexel.a > 0.425 && faceTexel.a < 0.5;
    vec3 shaded = ownColour ? clamp(base, 0.0, 1.0) : narkowiczAces(base);
    // A surface its view repaints keeps the paint on paper too (role 0.4, written by fragments' capture only
    // for a tinted shell): DACH's line drawings print their furniture beige, not white.
    bool repainted = faceTexel.a > 0.25 && faceTexel.a < 0.5;
    // And one it fills SOLID (role 0.3, see flat-tint.ts) is paint on the paper: its colour as stated, unlit, with no
    // occlusion, facing shade or sheen, as Revit prints a solid surface-pattern override.
    bool flatPaint = faceTexel.a > 0.25 && faceTexel.a < 0.35;
    vec3 surface = flatPaint ? clamp(base, 0.0, 1.0) : mix(uPaper, shaded, repainted ? 1.0 : uColorEnabled);

    // --- AO multiply ---
    // Translucent surfaces opt out entirely (ao = 1, fully lit).
    float ao = translucent || flatPaint ? 1.0 : texture(uOcclusion, vUv).r;
    ao = mix(1.0, ao, uAoStrength);
    vec3 colour = surface * ao;

    // --- Cast shadow (flat) ---
    // Is this point the first thing the sun meets along its ray? Read in the sun's own depth map, after
    // pushing the point a little off its surface along the normal so a face does not shadow itself.
    // What is behind something else, as the sun sees it, takes one flat tone: a drawing's shadow, not a
    // lighting term. Before the contour, so the ink stays black over it; translucent surfaces opt out.
    // 🔴 BELOW THE GROUND PLANE, THE PLANE TAKES THE SHADOW. A surface lower than the view's ground plane is
    // under it: the shadow is read where this pixel's ray crosses the plane, as for a pixel with no model.
    // Measured on racbasic's site plan: the ground falls to -6 m south of the house, and shaded where it lay
    // the house threw a long blot across it; a plan shadow should stop where the
    // ground drops below Level 1.
    // Only where the view looks down through the plane: an elevation's rays run along it and never cross it,
    // so a surface there keeps its own shadow.
    float viewDrop = (uViewToWorld * vec4(viewPosExact(vUv, uNear), 1.0)).y - (uViewToWorld * vec4(viewPosExact(vUv, uFar), 1.0)).y;
    bool underTheGround = uSunOn > 0.5 && uGroundOn > 0.5 && viewDrop > 1e-3
      && (uViewToWorld * vec4(viewPosExact(vUv, depth), 1.0)).y < uGroundAt - uSunBias;
    if (underTheGround && !translucent) {
      if (groundInShadow(vUv)) colour *= pow(uSunTone, 2.2);
    } else if (uSunOn > 0.5 && !translucent) {
      // 🔴 A FACE THE SUN GRAZES IS NOT ASKED OF THE MAP WITH A FLAT SLACK. An elevation's sun stands ten degrees up
      // (DACH 4-01's three elevations), nearly along every floor, roof and return wall, and there one texel of the map
      // spans metres of the face: with a fixed slack those faces came out striped, lit and shadowed by turns. The
      // slack grows as the face turns along the light, and a face turned away from it is in shadow with no lookup,
      // as it is in the original. (The normal is taken towards the eye: a face is drawn from either side.)
      vec3 toSun = normalize(transpose(mat3(uViewToSunView)) * vec3(0.0, 0.0, 1.0));
      vec3 seen = N.z < 0.0 ? -N : N;
      float facing = dot(seen, toSun);
      float slack = min(8.0, 1.0 / max(facing, 0.125));
      vec3 Pn = viewPosExact(vUv, depth) + N * uSunNormalBias * slack;
      vec4 clip = uViewToSunClip * vec4(Pn, 1.0);
      vec2 suv = clip.xy / clip.w * 0.5 + 0.5;
      if (facing <= 0.02) {
        colour *= pow(uSunTone, 2.2);
      } else if (suv.x >= 0.0 && suv.x <= 1.0 && suv.y >= 0.0 && suv.y <= 1.0) {
        float d = texture(uSunDepth, suv).r;
        float t = uReversed ? (1.0 - d) : d;
        float mapDist = uSunNear + t * (uSunFar - uSunNear);
        float pixelDist = -(uViewToSunView * vec4(Pn, 1.0)).z;
        // The tone is a fraction of the PRINTED light (a tone of 0.40 prints 102 of 255), and
        // this colour is encoded with gamma 2.2 at the end, so the fraction is decoded here. Multiplied as it
        // came, 0.40 printed as 0.66 and the site plan's shadows read pale grey where the original is dark.
        if (pixelDist > mapDist + uSunBias * slack) colour *= pow(uSunTone, 2.2);
      }
    }

    // --- Tonal orientation shade ---
    // Cheap form cue: surfaces facing the camera keep full brightness, grazing
    // surfaces fall toward uTonalFloor. abs() so DoubleSide back-faces shade
    // too. A multiply (like AO), so it darkens without shifting hue.
    float facing = abs(dot(N, V));
    float tonal = mix(uTonalFloor, 1.0, facing);
    colour *= flatPaint ? 1.0 : mix(1.0, tonal, uTonalEnabled);

    // --- Sheen (grazing-edge sheen + facing highlight) ---
    // gloss  = pow(1 - N.V): peaks at GRAZING angles -> a thin rim sheen.
    // facing = pow(N.V):     peaks when the surface faces the camera -> a soft
    //          central highlight. On a large matte plane (roof/slab) that facing
    //          highlight reads as a stray "reflected light" hotspot that slides
    //          around as the camera moves (and, before the ortho fix above, sat
    //          wherever N.V happened to peak). It is additive white on top of the
    //          matte colour, so it vanishes when Surface colour is off (the paper
    //          is already white). The facing term is off by default (factor 0) so
    //          matte surfaces stay matte; raise uFresnelFactor to opt back in.
    float NdotV = max(dot(N, V), 0.0);
    float gloss = uGlossFactor * pow(1.0 - NdotV, uGlossExp);
    float facingHighlight = uFresnelFactor * pow(NdotV, uFresnelExp);
    float combined = uSheenOutMin + (uSheenOutMax - uSheenOutMin) * (gloss + facingHighlight);
    if (!flatPaint && !ownColour) colour += uSheenColor * combined;

    // --- faceId contour ---
    // Isotropic distance-transform coverage (see edgeCoverage). A hard 1px id
    // test inks exactly one pixel per scanline, so a diagonal staircases ~sqrt(2)
    // thicker than an axis-aligned edge; ramping coverage by the Euclidean
    // distance to the nearest edge instead gives a band of uniform perpendicular
    // width at every orientation. The silhouette's outer (background) side is
    // inked in the background branch above so exterior and interior lines match.
    if (uContourEnabled > 0.5) {
      float coverage = edgeCoverage(vUv);
      // Halftone lines (role 0.2, see flat-tint.ts): the ink half way to the paper, as Revit draws them.
      bool halftoneInk = faceTexel.a > 0.15 && faceTexel.a < 0.25;
      // Lines in a colour of their own (role 0.12, see flat-tint.ts): the colour the capture left where the face's is.
      bool ownInk = faceTexel.a > 0.09 && faceTexel.a < 0.15;
      vec3 ink = ownInk ? clamp(base, 0.0, 1.0) : halftoneInk ? mix(uEdgeColor, uPaper, 0.6) : uEdgeColor;
      colour = mix(colour, ink, uEdgeStrength * coverage);
    }

    // --- sRGB encode -> dither ---
    // No second tonemap: the shaded term was already tonemapped above, and the
    // paper / AO / ink composite in display space. Only the gamma encode remains.
    colour = pow(colour, vec3(1.0 / 2.2)); // sRGB-ish encode (gamma 2.2)
    colour += (luminanceDither(gl_FragCoord.xy) - 0.5) * uDitherAmount;

    outColor = vec4(colour, 1.0);
  }
`;

// Seed pre-pass: marks every contour-seed pixel (faceId differs from ANY 4-neighbour) into
// an R8 mask. 5 taps/px, run once when the contour is enabled. The composite's edgeCoverage
// then reads this mask (25 single taps) instead of re-deriving seeds inline (125 taps). The
// seed RULE here is IDENTICAL to the old inline test, so the inked outline is pixel-identical.
const seedFragment = /* glsl */ `
  precision highp float;
  in vec2 vUv;
  out vec4 outColor;
  uniform sampler2D uFaceId;
  uniform vec2 uTexel;
  // The view's crop on the frame (min x, min y, max x, max y, in uv). Outside it the model was clipped away,
  // not absent, so the change from model to nothing there is not a silhouette and seeds no line.
  uniform vec4 uCropUv;
  int decodeFaceId(vec4 packed) {
    int r = int(packed.r * 255.0 + 0.5);
    int g = int(packed.g * 255.0 + 0.5);
    int b = int(packed.b * 255.0 + 0.5);
    return (r << 16) | (g << 8) | b;
  }
  bool inCrop(vec2 uv) {
    return uv.x >= uCropUv.x && uv.y >= uCropUv.y && uv.x <= uCropUv.z && uv.y <= uCropUv.w;
  }
  bool differs(int c, vec2 uv) {
    return inCrop(uv) && decodeFaceId(texture(uFaceId, uv)) != c;
  }
  void main() {
    if (!inCrop(vUv)) {
      outColor = vec4(0.0);
      return;
    }
    int c = decodeFaceId(texture(uFaceId, vUv));
    bool isEdge = differs(c, vUv + vec2(uTexel.x, 0.0)) || differs(c, vUv + vec2(0.0, uTexel.y))
      || differs(c, vUv + vec2(-uTexel.x, 0.0)) || differs(c, vUv + vec2(0.0, -uTexel.y));
    outColor = vec4(isEdge ? 1.0 : 0.0);
  }
`;

/**
 * A view's sky, as the composite paints it where the pass has no model: `sky` at the crop's top, `horizon` at
 * the world's zero height, `ground` at the crop's bottom, a straight blend in the colours as given between
 * (see `backgroundAt` in the modelling core, which states the rule and where it was measured). Only inside the
 * crop: a pass can frame more than the view's model crop (its paper viewport), and the authoring tool paints
 * nothing there.
 */
export interface ViewBackgroundSettings extends ViewCropSettings {
  /** Display colours, 0..1, as stored: the frame is written in them as they are. */
  readonly sky: readonly [number, number, number];
  readonly horizon: readonly [number, number, number];
  readonly ground: readonly [number, number, number];
}

/**
 * A view's crop: its centre and axes in the world, and its size along them, in metres.
 *
 * 🔴 A CROP DRAWS NO LINE OF ITS OWN. The model is clipped at the crop, and to the contour a surface that stops
 * there against nothing reads as a silhouette: every view whose model reaches its crop came out framed (racbasic's
 * «Typical Foundation Detail», West's left and bottom edges), and the authoring tool prints nothing there. Given
 * the crop, the contour neither starts a line outside it nor across its edge. Only an orthographic pass uses it:
 * there the crop is a rectangle of the frame.
 */
export interface ViewCropSettings {
  readonly centre: THREE.Vector3;
  readonly right: THREE.Vector3;
  readonly up: THREE.Vector3;
  readonly width: number;
  readonly height: number;
}

/** The whole frame and a margin: nothing is outside it. */
const NO_CROP_UV = new THREE.Vector4(-1, -1, 2, 2);

export interface CompositeSettings {
  // When false the shaded surface colour is replaced with flat white, turning the
  // frame into an NPR "paper" drawing (AO + contour still apply). Toggled by the
  // pen-family visual styles.
  colorEnabled: boolean;
  // Gates the contour overlay independently of its strength, so a style can drop
  // the ink without losing the user's tuned edgeStrength.
  contourEnabled: boolean;
  aoStrength: number;
  // Tonal orientation shade: multiplies surface colour by mix(tonalFloor, 1, |N·V|),
  // so grazing surfaces darken toward the floor. A near-free volume/form cue.
  tonalShadingEnabled: boolean;
  tonalFloor: number;
  edgeColor: THREE.Color;
  // The colour a pen style's surfaces are printed in: paper white unless a view is drawn on another ground (a plan
  // looked at live over a dark world). Per pass, so a sheet canvas that never says it keeps its white paper.
  paperColor: THREE.Color;
  edgeStrength: number;
  // Distance-transform contour coverage: line half-width and AA softness in px.
  edgeHalfWidth: number;
  edgeAA: number;
  // sheen — subtle defaults, found by tuning and testing
  glossExp: number;
  glossFactor: number;
  fresnelExp: number;
  fresnelFactor: number;
  sheenOutMin: number;
  sheenOutMax: number;
  sheenColor: THREE.Color;
  ditherAmount: number;
}

export const defaultCompositeSettings: CompositeSettings = {
  // Default look is the full colour + ink + shadow combination.
  colorEnabled: true,
  contourEnabled: true,
  aoStrength: 1.0,
  // On by default: a subtle floor (grazing surfaces ~70% bright) reads as soft
  // volume without crushing wall/floor planes that are nearly edge-on.
  tonalShadingEnabled: true,
  tonalFloor: 0.7,
  edgeColor: new THREE.Color(0, 0, 0),
  paperColor: new THREE.Color(1, 1, 1),
  edgeStrength: 0.8,
  edgeHalfWidth: 0.6,
  edgeAA: 0.7,
  glossExp: 10,
  glossFactor: 0.2,
  fresnelExp: 7,
  // Facing highlight OFF by default: on a flat matte slab pow(N.V) produced a
  // soft white hotspot that slid with the camera (the "weird reflected light").
  // The grazing-edge `gloss` sheen above is kept; raise this to re-enable the
  // facing highlight for a glossier look.
  fresnelFactor: 0.0,
  sheenOutMin: 0.0,
  sheenOutMax: 0.5,
  sheenColor: new THREE.Color(1, 1, 1),
  ditherAmount: 1.0 / 255.0,
};

const WHITE_PAPER = new THREE.Color(1, 1, 1);

export class CombinedCompositePass {
  readonly settings: CompositeSettings;
  private _material: THREE.ShaderMaterial;
  private _quad: FullscreenQuad;
  private _width: number;
  private _height: number;
  // Contour seed pre-pass (faceId -> R8 edge-seed mask). Lets the composite read seeds in
  // 25 taps instead of re-deriving them in 125. Only run when the contour is enabled.
  private _seedMaterial: THREE.ShaderMaterial;
  private _seedQuad: FullscreenQuad;
  private _seedTarget: THREE.WebGLRenderTarget;

  constructor(width: number, height: number, settings = defaultCompositeSettings) {
    this._width = Math.max(1, Math.floor(width));
    this._height = Math.max(1, Math.floor(height));
    // The paper a copy of its own: the default's instance is shared by every pass, and a view that paints its paper
    // would repaint every other one.
    this.settings = { ...settings, paperColor: (settings.paperColor ?? new THREE.Color(1, 1, 1)).clone() };

    this._seedMaterial = new THREE.ShaderMaterial({
      glslVersion: THREE.GLSL3,
      vertexShader: /* glsl */ `
        out vec2 vUv;
        void main() { vUv = uv; gl_Position = vec4(position, 1.0); }
      `,
      fragmentShader: seedFragment,
      uniforms: {
        uFaceId: { value: null },
        uTexel: { value: new THREE.Vector2(1 / this._width, 1 / this._height) },
        uCropUv: { value: NO_CROP_UV.clone() },
      },
      depthTest: false,
      depthWrite: false,
    });
    this._seedQuad = new FullscreenQuad(this._seedMaterial);
    // R8 full-res mask. NearestFilter: edgeCoverage samples exact texel centres.
    this._seedTarget = new THREE.WebGLRenderTarget(this._width, this._height, {
      type: THREE.UnsignedByteType,
      format: THREE.RedFormat,
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      depthBuffer: false,
      stencilBuffer: false,
    });
    this._seedTarget.texture.name = "contourSeed";

    this._material = new THREE.ShaderMaterial({
      glslVersion: THREE.GLSL3,
      vertexShader: /* glsl */ `
        out vec2 vUv;
        void main() { vUv = uv; gl_Position = vec4(position, 1.0); }
      `,
      fragmentShader: compositeFragment,
      uniforms: {
        uColor: { value: null },
        uOcclusion: { value: null },
        uDepthSheet: { value: null },
        uNormal: { value: null },
        uFaceId: { value: null },
        uSeed: { value: this._seedTarget.texture },
        uTexel: { value: new THREE.Vector2(1 / this._width, 1 / this._height) },
        uProjScaleXY: { value: new THREE.Vector2(1, 1) },
        uNear: { value: 0.1 },
        uFar: { value: 1000 },
        uReversed: { value: false },
        uOrtho: { value: false },
        uColorEnabled: { value: this.settings.colorEnabled ? 1 : 0 },
        uPaper: { value: this.settings.paperColor },
        uContourEnabled: { value: this.settings.contourEnabled ? 1 : 0 },
        uAoStrength: { value: this.settings.aoStrength },
        uTonalEnabled: { value: this.settings.tonalShadingEnabled ? 1 : 0 },
        uTonalFloor: { value: this.settings.tonalFloor },
        uEdgeColor: { value: this.settings.edgeColor },
        uEdgeStrength: { value: this.settings.edgeStrength },
        uEdgeHalfWidth: { value: this.settings.edgeHalfWidth },
        uEdgeAA: { value: this.settings.edgeAA },
        uGlossExp: { value: this.settings.glossExp },
        uGlossFactor: { value: this.settings.glossFactor },
        uFresnelExp: { value: this.settings.fresnelExp },
        uFresnelFactor: { value: this.settings.fresnelFactor },
        uSheenOutMin: { value: this.settings.sheenOutMin },
        uSheenOutMax: { value: this.settings.sheenOutMax },
        uSheenColor: { value: this.settings.sheenColor },
        uDitherAmount: { value: this.settings.ditherAmount },
        uSunOn: { value: 0 },
        uSunDepth: { value: null },
        uViewToSunClip: { value: new THREE.Matrix4() },
        uViewToSunView: { value: new THREE.Matrix4() },
        uSunNear: { value: 0.01 },
        uSunFar: { value: 10 },
        uSunTone: { value: 1 },
        uGroundOn: { value: 0 },
        uGroundAt: { value: 0 },
        uSunNormalBias: { value: 0 },
        uSunBias: { value: 0 },
        uProjOffsetXY: { value: new THREE.Vector2(0, 0) },
        uSkyOn: { value: 0 },
        uSky: { value: new THREE.Vector3() },
        uHorizon: { value: new THREE.Vector3() },
        uGround: { value: new THREE.Vector3() },
        uViewToWorld: { value: new THREE.Matrix4() },
        uCropCentre: { value: new THREE.Vector3() },
        uCropRight: { value: new THREE.Vector3(1, 0, 0) },
        uCropUp: { value: new THREE.Vector3(0, 1, 0) },
        uCropHalf: { value: new THREE.Vector2() },
        uSkyTop: { value: 0 },
        uSkyBottom: { value: 0 },
      },
      depthTest: false,
      depthWrite: false,
    });
    this._quad = new FullscreenQuad(this._material);
  }

  setSize(width: number, height: number) {
    this._width = Math.max(1, Math.floor(width));
    this._height = Math.max(1, Math.floor(height));
    this._material.uniforms.uTexel.value.set(1 / this._width, 1 / this._height);
    this._seedMaterial.uniforms.uTexel.value.set(1 / this._width, 1 / this._height);
    this._seedTarget.setSize(this._width, this._height);
  }

  /** Composite into `target` (null = screen). */
  render(
    renderer: THREE.WebGLRenderer,
    target: THREE.WebGLRenderTarget | null,
    inputs: {
      color: THREE.Texture;
      ao: THREE.Texture;
      depth: THREE.Texture;
      normal: THREE.Texture;
      faceId: THREE.Texture;
    },
    camera: THREE.PerspectiveCamera | THREE.OrthographicCamera,
    sun?: {
      depth: THREE.Texture;
      camera: THREE.OrthographicCamera;
      tone: number;
      /** Metres one texel of the sun's map covers. */
      texel: number;
      /** The height of the plane the shadows also fall on, or null for none. */
      groundAt?: number | null;
    } | null,
    background?: ViewBackgroundSettings | null,
    crop?: ViewCropSettings | null,
  ) {
    this._cropOnFrame(camera, crop ?? null, this._seedMaterial.uniforms.uCropUv.value);
    const u = this._material.uniforms;
    u.uSkyOn.value = background ? 1 : 0;
    if (background) {
      camera.updateMatrixWorld();
      u.uSky.value.fromArray(background.sky);
      u.uHorizon.value.fromArray(background.horizon);
      u.uGround.value.fromArray(background.ground);
      u.uViewToWorld.value.copy(camera.matrixWorld);
      u.uCropCentre.value.copy(background.centre);
      u.uCropRight.value.copy(background.right).normalize();
      u.uCropUp.value.copy(background.up).normalize();
      u.uCropHalf.value.set(background.width / 2, background.height / 2);
      // The heights of the crop's top and bottom edges: the world's up is +Y.
      const halfUp = u.uCropUp.value.y * (background.height / 2);
      u.uSkyTop.value = background.centre.y + Math.abs(halfUp);
      u.uSkyBottom.value = background.centre.y - Math.abs(halfUp);
    }
    u.uSunOn.value = sun ? 1 : 0;
    if (sun) {
      camera.updateMatrixWorld();
      u.uSunDepth.value = sun.depth;
      u.uViewToSunView.value.multiplyMatrices(sun.camera.matrixWorldInverse, camera.matrixWorld);
      u.uViewToSunClip.value.multiplyMatrices(sun.camera.projectionMatrix, u.uViewToSunView.value);
      u.uSunNear.value = sun.camera.near;
      u.uSunFar.value = sun.camera.far;
      u.uSunTone.value = sun.tone;
      const ground = sun.groundAt ?? null;
      u.uGroundOn.value = ground === null ? 0 : 1;
      u.uGroundAt.value = ground ?? 0;
      // The plane is found in the world, so the camera's own frame is needed without a sky too.
      u.uViewToWorld.value.copy(camera.matrixWorld);
      // A texel and a half along the normal, and one texel of slack: the map's own resolution is what a
      // surface can be mistaken for being behind itself by.
      u.uSunNormalBias.value = sun.texel * 1.5;
      u.uSunBias.value = sun.texel;
    }
    u.uColor.value = inputs.color;
    u.uOcclusion.value = inputs.ao;
    u.uDepthSheet.value = inputs.depth;
    u.uNormal.value = inputs.normal;
    u.uFaceId.value = inputs.faceId;
    u.uNear.value = camera.near;
    u.uFar.value = camera.far;
    u.uReversed.value =
      (renderer.capabilities as { reversedDepthBuffer?: boolean })
        .reversedDepthBuffer === true;
    u.uOrtho.value =
      // Read off the projection, not the camera's class: a sheet's perspective is an orthographic camera
      // whose matrix projects in perspective, and reconstructed as ortho its depth changed with every tile.
      camera.projectionMatrix.elements[15] !== 0;
    const p = camera.projectionMatrix.elements;
    u.uProjScaleXY.value.set(p[0], p[5]);
    if (u.uOrtho.value) u.uProjOffsetXY.value.set(p[12], p[13]);
    else u.uProjOffsetXY.value.set(p[8], p[9]);
    // Re-read every look knob from `settings` each frame so external callers
    // (e.g. a tuning panel) can mutate `settings.*` live and see it next frame
    // without poking uniforms directly. The colour uniforms share the same
    // THREE.Color instance as `settings`, so an in-place `.set()` is picked up
    // for free; the scalars are copied here.
    const s = this.settings;
    u.uColorEnabled.value = s.colorEnabled ? 1 : 0;
    // The colours by reference too, so one replaced (not only set in place) is drawn next frame.
    u.uPaper.value = s.paperColor ?? WHITE_PAPER;
    u.uEdgeColor.value = s.edgeColor;
    u.uContourEnabled.value = s.contourEnabled ? 1 : 0;
    u.uAoStrength.value = s.aoStrength;
    u.uTonalEnabled.value = s.tonalShadingEnabled ? 1 : 0;
    u.uTonalFloor.value = s.tonalFloor;
    u.uEdgeStrength.value = s.edgeStrength;
    u.uEdgeHalfWidth.value = s.edgeHalfWidth;
    u.uEdgeAA.value = s.edgeAA;
    u.uGlossExp.value = s.glossExp;
    u.uGlossFactor.value = s.glossFactor;
    u.uFresnelExp.value = s.fresnelExp;
    u.uFresnelFactor.value = s.fresnelFactor;
    u.uSheenOutMin.value = s.sheenOutMin;
    u.uSheenOutMax.value = s.sheenOutMax;
    u.uDitherAmount.value = s.ditherAmount;
    // Contour seed pre-pass: faceId -> R8 edge-seed mask, so edgeCoverage in the composite
    // reads seeds in 25 taps instead of re-deriving them in 125. Only when contour is on
    // (the composite skips edgeCoverage otherwise), so it costs nothing when disabled.
    if (s.contourEnabled) {
      const prevTarget = renderer.getRenderTarget();
      this._seedMaterial.uniforms.uFaceId.value = inputs.faceId;
      this._seedQuad.render(renderer, this._seedTarget);
      renderer.setRenderTarget(prevTarget);
    }
    this._quad.render(renderer, target);
  }

  private readonly _corner = new THREE.Vector3();

  /** The crop's rectangle on the frame, in uv, into `out`; the whole frame without a crop or in perspective. */
  private _cropOnFrame(
    camera: THREE.PerspectiveCamera | THREE.OrthographicCamera,
    crop: ViewCropSettings | null,
    out: THREE.Vector4,
  ) {
    out.copy(NO_CROP_UV);
    if (!crop || !(camera as THREE.OrthographicCamera).isOrthographicCamera) return;
    camera.updateMatrixWorld();
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (const sx of [-1, 1]) {
      for (const sy of [-1, 1]) {
        const p = this._corner
          .copy(crop.centre)
          .addScaledVector(crop.right, (sx * crop.width) / 2 / crop.right.length())
          .addScaledVector(crop.up, (sy * crop.height) / 2 / crop.up.length())
          .project(camera);
        minX = Math.min(minX, p.x * 0.5 + 0.5);
        maxX = Math.max(maxX, p.x * 0.5 + 0.5);
        minY = Math.min(minY, p.y * 0.5 + 0.5);
        maxY = Math.max(maxY, p.y * 0.5 + 0.5);
      }
    }
    if ([minX, minY, maxX, maxY].every(Number.isFinite)) out.set(minX, minY, maxX, maxY);
  }

  dispose() {
    this._material.dispose();
    this._seedMaterial.dispose();
    this._seedTarget.dispose();
  }
}
