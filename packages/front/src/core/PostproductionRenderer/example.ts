/* MD
### 🎥 Great graphics
---

  The default Three.js renderer produces flat geometry that looks raw in production BIM apps: no edge definition, no depth cues, no polish. Adding those effects manually means wiring multiple render passes and managing their interactions.

  The PostproductionRenderer stacks GPU passes on top of the base render (ambient occlusion, edge detection, outlines, anti-aliasing, and preset visual styles) as a single drop-in renderer replacement. It can run two pipelines: the classic Composer stack of passes, and the Deferred pipeline, which captures the scene once into a G-buffer and then computes ambient occlusion, contours, sheen and anti-aliasing from it.

  This tutorial covers enabling postproduction on a loaded BIM model; switching between the Composer and Deferred pipelines; choosing the postproduction resolution (native or CSS pixels, adaptive resolution); outlining specific elements via the Outliner; switching between visual style presets (Basic, Pen, Shadowed Pen, Color Pen, Color Shadows, Color Pen Shadows); tuning the deferred ambient occlusion (screen-space or world-space), denoise and composite; configuring edge detection width, color, and mode; adjusting outline thickness and fill opacity; tuning the composer ambient occlusion parameters (GTAO and PD); toggling SMAA anti-aliasing; and excluding specific objects from postproduction effects.

  By the end, you'll have a fully configurable postproduction pipeline with live controls for every visual pass.
*/

import * as THREE from "three";
import * as OBC from "@thatopen/components";
import Stats from "stats.js";
import * as BUI from "@thatopen/ui";
// You have to import * as OBF from "@thatopen/components-front"
import * as OBF from "../..";

/* MD
  ### 🌎 Setting up a simple scene
  ---

  We will start by creating a simple scene with a camera and a renderer. If you don't know how to set up a scene, you can check the Worlds tutorial. Notice how we use the PostproductionRenderer in this case. We will also instantiate fragments right away to load BIM models.

  :::tip Fragments?

    If you are not familiar with fragments, check out the IfcLoader tutorial!

  :::
*/

const components = new OBC.Components();

const worlds = components.get(OBC.Worlds);
const world = worlds.create<
  OBC.SimpleScene,
  OBC.OrthoPerspectiveCamera,
  OBF.PostproductionRenderer
>();

world.scene = new OBC.SimpleScene(components);
world.scene.setup();
world.scene.three.background = null;

const container = document.getElementById("container")!;
// Tip: for models with lots of coplanar surfaces you can opt into reversed-Z
// depth for much cleaner edges (near-uniform precision across the scene):
//   new OBF.PostproductionRenderer(components, container, { reversedDepthBuffer: true })
// It pairs best with the pen styles; the ambient-occlusion shadow styles are
// not reversed-Z aware yet.
world.renderer = new OBF.PostproductionRenderer(components, container);
world.camera = new OBC.OrthoPerspectiveCamera(components);
await world.camera.controls.setLookAt(68, 23, -8.5, 21.5, -5.5, 23);

components.init();

const grids = components.get(OBC.Grids);
const grid = grids.create(world);
grid.config.color.set(0x666666);

/* MD
  We'll make the background of the scene transparent so that it looks good in our docs page, but you don't have to do that in your app!
*/

world.scene.three.background = null;

/* MD
  The renderer draws at the native resolution of the screen, and adaptive resolution lowers the postproduction resolution while the frame rate drops below the target, so navigation stays fluid on slower machines. You can change both in the panel below.
*/

world.renderer.cssSize = false;
world.renderer.adaptiveResolution = true;

/* MD
  We'll also set up the update logic for the renderer in manual mode (if enabled).
*/

const updateIfManualMode = () => {
  if (world.renderer!.mode === OBC.RendererMode.MANUAL) {
    world.renderer!.needsUpdate = true;
  }
};

world.camera.controls.addEventListener("update", updateIfManualMode);
world.renderer.onResize.add(updateIfManualMode);

/* MD
  ### 🛠️ Setting Up Fragments
  Now, let's configure the FragmentsManager. This will allow us to load models effortlessly and start manipulating them with ease:
*/

// `FragmentsManager.getWorker()` fetches the matching worker for this library version from unpkg and returns a blob URL.
// You can also pass your own URL to `fragments.init(...)` if you'd rather host the worker yourself.
const workerUrl = await OBC.FragmentsManager.getWorker();
const fragments = components.get(OBC.FragmentsManager);
fragments.init(workerUrl);

world.camera.controls.addEventListener("update", () => fragments.core.update());

world.onCameraChanged.add((camera) => {
  for (const [, model] of fragments.list) {
    model.useCamera(camera.three);
  }
  fragments.core.update(true);
});

fragments.list.onItemSet.add(({ value: model }) => {
  model.useCamera(world.camera.three);
  world.scene.three.add(model.object);
  fragments.core.update(true);
});

// Remove z fighting
fragments.core.models.materials.list.onItemSet.add(({ value: material }) => {
  if (!("isLodMaterial" in material && material.isLodMaterial)) {
    material.polygonOffset = true;
    material.polygonOffsetUnits = 1;
    material.polygonOffsetFactor = Math.random();
  }
});

/* MD
  ### 📂 Loading Fragments Models
  With the core setup complete, it's time to load a Fragments model into our scene. Fragments are optimized for fast loading and rendering, making them ideal for large-scale 3D models.

  :::info Where can I find Fragment files?

  You can use the sample Fragment files available in our repository for testing. If you have an IFC model you'd like to convert to Fragments, check out the IfcImporter tutorial for detailed instructions.

  :::
*/

const fragPaths = ["https://thatopen.github.io/engine_components/resources/frags/school_arq.frag"];
await Promise.all(
  fragPaths.map(async (path) => {
    const modelId = path.split("/").pop()?.split(".").shift();
    if (!modelId) return null;
    const file = await fetch(path);
    const buffer = await file.arrayBuffer();
    return fragments.core.load(buffer, { modelId });
  }),
);

/* MD
  ### 🎬 Turning on the Postproduction
  ---

  Now we will activate the postproduction effect and enable the visibility for postproduction layer.

  We will also pick the rendering pipeline. The postproduction can run in two modes: `COMPOSER`, the classic stack of passes, and `DEFERRED`, which captures the scene once into a G-buffer and builds ambient occlusion, contours, sheen and anti-aliasing from it. We'll start in `DEFERRED` mode; you can switch between both from the menu later.

*/

world.renderer.postproduction.enabled = true;
world.renderer.postproduction.style =
  OBF.PostproductionAspect.COLOR_PEN_SHADOWS;
world.dynamicAnchor = false;

world.renderer!.postproduction.basePass.isolatedMaterials.push(grid.material);

// Run the deferred pipeline by default. Touch `.deferred` first so it is
// allocated and sized before the first frame.
void world.renderer.postproduction.deferred;
world.renderer.postproduction.mode = OBF.PostproductionMode.DEFERRED;

// Outline

const model = fragments.list.values().next().value!;
const outliner = components.get(OBF.Outliner);
outliner.world = world;
// Turn outlines on so the selection is stroked in both composer and deferred.
outliner.enabled = true;
const walls = await model.getItemsOfCategories([/IFCWALL/]);
const wallsIds = walls.IFCWALL;
const [wall1, wall2] = wallsIds;
outliner.addItems({ [model.modelId]: new Set([wall1, wall2]) });

/* MD
  ### 📹 Switching the camera
  ---

  If you are using an orthoperspective camera, you need to update the postproduction renderer camera:

*/

// To update the camera

// window.addEventListener("dblclick", () => {
//   world.camera.projection.toggle();
//   model.useCamera(world.camera.three);
//   world.renderer.postproduction.updateCamera();
// });

/* MD
  ### ⏱️ Measuring the performance (optional)
  ---

  We'll use the [Stats.js](https://github.com/mrdoob/stats.js) to measure the performance of our app. We will add it to the top left corner of the viewport. This way, we'll make sure that the memory consumption and the FPS of our app are under control.

  :::tip Feels slow while moving the camera?

  The deferred pipeline does more work per frame than the classic one. If navigating feels slow on your machine, try these, from simplest to most involved:

  1. Lower the **Render scale** (Deferred · Pipeline, `postproduction.deferred.renderScale`): the pipeline renders at a fraction of the screen resolution.
  2. Turn on **Adaptive resolution (hold target fps)** (General, `renderer.adaptiveResolution`): the renderer measures its frame time and lowers the postproduction resolution, never below **Min resolution** (`adaptiveMinScale`), to hold the **Adaptive target fps** (`adaptiveTargetFps`).
  3. Turn on **Manual mode** (`renderer.mode = OBC.RendererMode.MANUAL`), so the renderer only draws when something changes, and draw a lighter picture while the camera moves: with **Turn off on manual mode** (`turnOffOnManualMode`) the postproduction is skipped while moving and comes back once the camera stops; under WebGPU, **Lower resolution while the camera moves** (`renderer.movingResolution.enabled`) draws at a lower resolution while moving and at full resolution once the camera settles.

  :::
*/

const stats = new Stats();
stats.showPanel(2);
document.body.append(stats.dom);
stats.dom.style.left = "0px";
stats.dom.style.zIndex = "unset";
world.renderer.onBeforeUpdate.add(() => stats.begin());
world.renderer.onAfterUpdate.add(() => stats.end());

/* MD
  ### 🧩 Adding some UI
  ---

  We will use the `@thatopen/ui` library to add some simple and cool UI elements to our app. First, we need to call the `init` method of the `BUI.Manager` class to initialize the library:
*/

BUI.Manager.init();

/* MD
Now we will add some UI to control some of the most common postproduction parameters. For more information about the UI library, you can check the specific documentation for it!
*/

const { aoPass, outlinePass, edgesPass, defaultAoParameters } =
  world.renderer.postproduction;

const pdParameters = {
  lumaPhi: 10,
  depthPhi: 2,
  normalPhi: 3,
  radius: 4,
  radiusExponent: 1,
  rings: 2,
  samples: 16,
};

aoPass.updateGtaoMaterial(defaultAoParameters);
aoPass.updatePdMaterial(pdParameters);

const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshLambertMaterial({ color: 0x00ff00 }),
);
cube.position.set(10, 0, 0);
world.scene.three.add(cube);
world.renderer.postproduction.excludedObjectsPass.addExcludedMaterial(
  cube.material,
);

/* MD
  The deferred pipeline exposes its own settings. Each of its passes keeps a settings object that it re-reads every frame, so changing these values from the menu takes effect on the next render without any explicit "apply" step.
*/

const deferred = world.renderer.postproduction.deferred;
const aoSettings = deferred.ao.settings;
const worldAoSettings = deferred.worldAo.settings;
const denoiseSettings = deferred.denoise.settings;
const lookSettings = deferred.composite.settings;

/* MD
  Now let's build the menu. The "General" section applies to both pipelines. The sections whose title starts with "Deferred" only apply to the deferred pipeline, and the rest of the postproduction sections only apply to the composer one, so we tag them with the `deferred-only` and `composer-only` classes to show only the ones for the active mode.
*/

const panel = BUI.Component.create<BUI.PanelSection>(() => {
  return BUI.html`
  <bim-panel active label="Postproduction Tutorial" class="options-menu">

    <bim-panel-section label="General">

      <bim-checkbox checked label="Postproduction enabled"
        @change="${({ target }: { target: BUI.Checkbox }) => {
          world.renderer!.postproduction.enabled = target.value;
          updateIfManualMode();
        }}">
      </bim-checkbox>

      <bim-dropdown required label="Postproduction mode"
        @change="${({ target }: { target: BUI.Dropdown }) => {
          const picked = Number(target.value[0]) as OBF.PostproductionMode;
          world.renderer!.postproduction.mode = picked;
          applyModeVisibility(picked);
          updateIfManualMode();
        }}">
        <bim-option label="Composer" value="${OBF.PostproductionMode.COMPOSER}"></bim-option>
        <bim-option checked label="Deferred" value="${OBF.PostproductionMode.DEFERRED}"></bim-option>
      </bim-dropdown>

      <bim-dropdown required label="Projection"
        @change="${async ({ target }: { target: BUI.Dropdown }) => {
          const projection = target.value[0] as OBC.CameraProjection;
          await world.camera.projection.set(projection);
          for (const model of fragments.list.values()) {
            model.useCamera(world.camera.three);
          }
          world.renderer!.postproduction.updateCamera();
          updateIfManualMode();
        }}">
        <bim-option checked label="Perspective" value="Perspective"></bim-option>
        <bim-option label="Orthographic" value="Orthographic"></bim-option>
      </bim-dropdown>

      <bim-checkbox label="Native DPR sizing (sharp, slower)"
        ?checked=${!world.renderer!.cssSize}
        @change="${({ target }: { target: BUI.Checkbox }) => {
          // Checked = render at the native drawing-buffer resolution (cssSize
          // off); unchecked = CSS-pixel sizing (faster on HiDPI). Applies to
          // both composer and deferred.
          world.renderer!.cssSize = !target.value;
          world.renderer!.applyPostproductionSize();
          updateIfManualMode();
        }}">
      </bim-checkbox>

      <bim-checkbox label="Adaptive resolution (hold target fps)"
        ?checked=${world.renderer!.adaptiveResolution}
        @change="${({ target }: { target: BUI.Checkbox }) => {
          world.renderer!.adaptiveResolution = target.value;
          updateIfManualMode();
        }}">
      </bim-checkbox>

      <bim-number-input
        slider step="5" label="Adaptive target fps"
        value="${world.renderer!.adaptiveTargetFps}" min="24" max="120"
        @change="${({ target }: { target: BUI.NumberInput }) => {
          world.renderer!.adaptiveTargetFps = target.value;
          updateIfManualMode();
        }}">
      </bim-number-input>

      <bim-number-input
        slider step="0.05" label="Min resolution (never blurrier than this)"
        value="${world.renderer!.adaptiveMinScale}" min="0.25" max="1"
        @change="${({ target }: { target: BUI.NumberInput }) => {
          world.renderer!.adaptiveMinScale = target.value;
          updateIfManualMode();
        }}">
      </bim-number-input>

      <bim-button label="${outliner.enabled ? "Outline: ON" : "Outline: OFF"}"
        @click="${({ target }: { target: BUI.Button }) => {
          outliner.enabled = !outliner.enabled;
          target.label = outliner.enabled ? "Outline: ON" : "Outline: OFF";
          updateIfManualMode();
        }}">
      </bim-button>

    </bim-panel-section>

    <bim-panel-section class="deferred-only" label="Deferred · Pipeline">

      <bim-dropdown required label="Visual style"
        @change="${({ target }: { target: BUI.Dropdown }) => {
          world.renderer!.postproduction.style = Number(
            target.value[0],
          ) as OBF.PostproductionAspect;
          updateIfManualMode();
        }}">
        <bim-option label="Color" value="${OBF.PostproductionAspect.COLOR}"></bim-option>
        <bim-option label="Pen" value="${OBF.PostproductionAspect.PEN}"></bim-option>
        <bim-option label="Pen shadows" value="${OBF.PostproductionAspect.PEN_SHADOWS}"></bim-option>
        <bim-option label="Color pen" value="${OBF.PostproductionAspect.COLOR_PEN}"></bim-option>
        <bim-option label="Color shadows" value="${OBF.PostproductionAspect.COLOR_SHADOWS}"></bim-option>
        <bim-option checked label="Color pen shadows" value="${OBF.PostproductionAspect.COLOR_PEN_SHADOWS}"></bim-option>
      </bim-dropdown>

      <bim-checkbox label="Ambient occlusion enabled"
        ?checked=${deferred.settings.aoEnabled}
        @change="${({ target }: { target: BUI.Checkbox }) => {
          deferred.settings.aoEnabled = target.value;
          updateIfManualMode();
        }}">
      </bim-checkbox>

      <bim-dropdown required label="AO estimator"
        @change="${({ target }: { target: BUI.Dropdown }) => {
          deferred.settings.aoMode = Number(
            target.value[0],
          ) as OBF.DeferredAoMode;
          updateIfManualMode();
        }}">
        <bim-option checked label="Screen-space" value="${OBF.DeferredAoMode.SCREEN_SPACE}"></bim-option>
        <bim-option label="World-space" value="${OBF.DeferredAoMode.WORLD_SPACE}"></bim-option>
      </bim-dropdown>

      <bim-checkbox label="Anti-aliasing (FXAA)"
        ?checked=${deferred.settings.fxaaEnabled}
        @change="${({ target }: { target: BUI.Checkbox }) => {
          deferred.settings.fxaaEnabled = target.value;
          updateIfManualMode();
        }}">
      </bim-checkbox>

      <bim-checkbox label="Half-resolution AO (faster, softer)"
        ?checked=${deferred.aoHalfRes}
        @change="${({ target }: { target: BUI.Checkbox }) => {
          deferred.aoHalfRes = target.value;
          updateIfManualMode();
        }}">
      </bim-checkbox>

      <bim-checkbox label="Tonal orientation shade"
        ?checked=${lookSettings.tonalShadingEnabled}
        @change="${({ target }: { target: BUI.Checkbox }) => {
          lookSettings.tonalShadingEnabled = target.value;
          updateIfManualMode();
        }}">
      </bim-checkbox>

      <bim-number-input
        slider step="0.05" label="Render scale"
        value="${deferred.renderScale}" min="0.25" max="1"
        @change="${({ target }: { target: BUI.NumberInput }) => {
          deferred.renderScale = target.value;
          updateIfManualMode();
        }}">
      </bim-number-input>

    </bim-panel-section>

    <bim-panel-section class="deferred-only" label="Deferred · Ambient Occlusion">

      <bim-number-input
        slider step="0.05" label="World radius"
        value="${aoSettings.radius}" min="0.05" max="4"
        @change="${({ target }: { target: BUI.NumberInput }) => {
          aoSettings.radius = target.value;
          updateIfManualMode();
        }}">
      </bim-number-input>

      <bim-number-input
        slider step="0.002" label="Bias"
        value="${aoSettings.bias}" min="0" max="0.1"
        @change="${({ target }: { target: BUI.NumberInput }) => {
          aoSettings.bias = target.value;
          updateIfManualMode();
        }}">
      </bim-number-input>

      <bim-number-input
        slider step="0.05" label="Intensity"
        value="${aoSettings.intensity}" min="0" max="3"
        @change="${({ target }: { target: BUI.NumberInput }) => {
          aoSettings.intensity = target.value;
          updateIfManualMode();
        }}">
      </bim-number-input>

      <bim-number-input
        slider step="0.05" label="Contrast"
        value="${aoSettings.contrast}" min="0.25" max="4"
        @change="${({ target }: { target: BUI.NumberInput }) => {
          aoSettings.contrast = target.value;
          updateIfManualMode();
        }}">
      </bim-number-input>

      <bim-number-input
        slider step="1" label="Samples"
        value="${aoSettings.samples}" min="4" max="32"
        @change="${({ target }: { target: BUI.NumberInput }) => {
          aoSettings.samples = target.value;
          updateIfManualMode();
        }}">
      </bim-number-input>

      <bim-number-input
        slider step="1" label="Denoise radius (taps)"
        value="${denoiseSettings.radius}" min="1" max="12"
        @change="${({ target }: { target: BUI.NumberInput }) => {
          denoiseSettings.radius = target.value;
          updateIfManualMode();
        }}">
      </bim-number-input>

      <bim-number-input
        slider step="0.05" label="Denoise depth sigma"
        value="${denoiseSettings.depthSigma}" min="0.05" max="3"
        @change="${({ target }: { target: BUI.NumberInput }) => {
          denoiseSettings.depthSigma = target.value;
          updateIfManualMode();
        }}">
      </bim-number-input>

      <bim-number-input
        slider step="0.05" label="Denoise normal sigma"
        value="${denoiseSettings.normalSigma}" min="0.05" max="2"
        @change="${({ target }: { target: BUI.NumberInput }) => {
          denoiseSettings.normalSigma = target.value;
          updateIfManualMode();
        }}">
      </bim-number-input>

    </bim-panel-section>

    <bim-panel-section class="deferred-only" label="Deferred · World AO">

      <bim-number-input
        slider step="0.05" label="Hemisphere reach"
        value="${worldAoSettings.reach}" min="0.05" max="4"
        @change="${({ target }: { target: BUI.NumberInput }) => {
          worldAoSettings.reach = target.value;
          updateIfManualMode();
        }}">
      </bim-number-input>

      <bim-number-input
        slider step="0.005" label="Probe lift"
        value="${worldAoSettings.lift}" min="0" max="0.2"
        @change="${({ target }: { target: BUI.NumberInput }) => {
          worldAoSettings.lift = target.value;
          updateIfManualMode();
        }}">
      </bim-number-input>

      <bim-number-input
        slider step="0.1" label="Range decay"
        value="${worldAoSettings.decay}" min="0.1" max="6"
        @change="${({ target }: { target: BUI.NumberInput }) => {
          worldAoSettings.decay = target.value;
          updateIfManualMode();
        }}">
      </bim-number-input>

      <bim-number-input
        slider step="0.05" label="Strength"
        value="${worldAoSettings.power}" min="0" max="3"
        @change="${({ target }: { target: BUI.NumberInput }) => {
          worldAoSettings.power = target.value;
          updateIfManualMode();
        }}">
      </bim-number-input>

      <bim-number-input
        slider step="0.05" label="Contrast"
        value="${worldAoSettings.shape}" min="0.25" max="4"
        @change="${({ target }: { target: BUI.NumberInput }) => {
          worldAoSettings.shape = target.value;
          updateIfManualMode();
        }}">
      </bim-number-input>

      <bim-number-input
        slider step="1" label="Probes"
        value="${worldAoSettings.rays}" min="4" max="32"
        @change="${({ target }: { target: BUI.NumberInput }) => {
          worldAoSettings.rays = target.value;
          updateIfManualMode();
        }}">
      </bim-number-input>

      <bim-number-input
        slider step="0.02" label="Distance fade start"
        value="${worldAoSettings.vanishStart}" min="0" max="1"
        @change="${({ target }: { target: BUI.NumberInput }) => {
          worldAoSettings.vanishStart = target.value;
          updateIfManualMode();
        }}">
      </bim-number-input>

      <bim-number-input
        slider step="0.02" label="Distance fade end"
        value="${worldAoSettings.vanishEnd}" min="0" max="1"
        @change="${({ target }: { target: BUI.NumberInput }) => {
          worldAoSettings.vanishEnd = target.value;
          updateIfManualMode();
        }}">
      </bim-number-input>

    </bim-panel-section>

    <bim-panel-section class="deferred-only" label="Deferred · Composite">

      <bim-number-input
        slider step="0.05" label="AO strength"
        value="${lookSettings.aoStrength}" min="0" max="3"
        @change="${({ target }: { target: BUI.NumberInput }) => {
          lookSettings.aoStrength = target.value;
          updateIfManualMode();
        }}">
      </bim-number-input>

      <bim-number-input
        slider step="0.02" label="Tonal floor"
        value="${lookSettings.tonalFloor}" min="0" max="1"
        @change="${({ target }: { target: BUI.NumberInput }) => {
          lookSettings.tonalFloor = target.value;
          updateIfManualMode();
        }}">
      </bim-number-input>

      <bim-number-input
        slider step="0.05" label="Contour strength"
        value="${lookSettings.edgeStrength}" min="0" max="1"
        @change="${({ target }: { target: BUI.NumberInput }) => {
          lookSettings.edgeStrength = target.value;
          updateIfManualMode();
        }}">
      </bim-number-input>

      <bim-number-input
        slider step="0.05" label="Contour width"
        value="${lookSettings.edgeHalfWidth}" min="0.1" max="2.5"
        @change="${({ target }: { target: BUI.NumberInput }) => {
          lookSettings.edgeHalfWidth = target.value;
          updateIfManualMode();
        }}">
      </bim-number-input>

      <bim-number-input
        slider step="0.05" label="Contour softness (AA)"
        value="${lookSettings.edgeAA}" min="0.1" max="2"
        @change="${({ target }: { target: BUI.NumberInput }) => {
          lookSettings.edgeAA = target.value;
          updateIfManualMode();
        }}">
      </bim-number-input>

      <bim-color-input label="Contour color"
        color="#${lookSettings.edgeColor.getHexString()}"
        @input="${({ target }: { target: BUI.ColorInput }) => {
          lookSettings.edgeColor.set(target.value.color);
          updateIfManualMode();
        }}">
      </bim-color-input>

      <bim-number-input
        slider step="0.5" label="Sheen gloss exponent"
        value="${lookSettings.glossExp}" min="0.5" max="24"
        @change="${({ target }: { target: BUI.NumberInput }) => {
          lookSettings.glossExp = target.value;
          updateIfManualMode();
        }}">
      </bim-number-input>

      <bim-number-input
        slider step="0.02" label="Sheen gloss factor"
        value="${lookSettings.glossFactor}" min="0" max="1"
        @change="${({ target }: { target: BUI.NumberInput }) => {
          lookSettings.glossFactor = target.value;
          updateIfManualMode();
        }}">
      </bim-number-input>

      <bim-number-input
        slider step="0.5" label="Fresnel exponent"
        value="${lookSettings.fresnelExp}" min="0.5" max="24"
        @change="${({ target }: { target: BUI.NumberInput }) => {
          lookSettings.fresnelExp = target.value;
          updateIfManualMode();
        }}">
      </bim-number-input>

      <bim-number-input
        slider step="0.02" label="Fresnel factor"
        value="${lookSettings.fresnelFactor}" min="0" max="1"
        @change="${({ target }: { target: BUI.NumberInput }) => {
          lookSettings.fresnelFactor = target.value;
          updateIfManualMode();
        }}">
      </bim-number-input>

      <bim-number-input
        slider step="0.02" label="Sheen output min"
        value="${lookSettings.sheenOutMin}" min="0" max="1"
        @change="${({ target }: { target: BUI.NumberInput }) => {
          lookSettings.sheenOutMin = target.value;
          updateIfManualMode();
        }}">
      </bim-number-input>

      <bim-number-input
        slider step="0.02" label="Sheen output max"
        value="${lookSettings.sheenOutMax}" min="0" max="1"
        @change="${({ target }: { target: BUI.NumberInput }) => {
          lookSettings.sheenOutMax = target.value;
          updateIfManualMode();
        }}">
      </bim-number-input>

    </bim-panel-section>

    <bim-panel-section class="composer-only" label="Composer · General">

      <bim-checkbox checked label="Outlines enabled"
        ?checked=${world.renderer!.postproduction.outlinesEnabled}
        @change="${({ target }: { target: BUI.Checkbox }) => {
          world.renderer!.postproduction.outlinesEnabled = target.value;
          updateIfManualMode();
        }}">
      </bim-checkbox>

      <bim-checkbox checked label="Excluded objects enabled"
        ?checked=${world.renderer!.postproduction.excludedObjectsEnabled}
        @change="${({ target }: { target: BUI.Checkbox }) => {
          world.renderer!.postproduction.excludedObjectsEnabled = target.value;
          updateIfManualMode();
        }}">
      </bim-checkbox>

      <bim-checkbox checked label="SMAA enabled"
        ?checked=${world.renderer!.postproduction.smaaEnabled}
        @change="${({ target }: { target: BUI.Checkbox }) => {
          world.renderer!.postproduction.smaaEnabled = target.value;
          updateIfManualMode();
        }}">
      </bim-checkbox>

      <bim-checkbox label="MSAA enabled"
        ?checked=${world.renderer!.postproduction.msaaEnabled}
        @change="${({ target }: { target: BUI.Checkbox }) => {
          world.renderer!.postproduction.msaaEnabled = target.value;
          updateIfManualMode();
        }}">
      </bim-checkbox>

      <bim-dropdown required label="Postproduction style"
        @change="${({ target }: { target: BUI.Dropdown }) => {
          const result = target.value[0] as OBF.PostproductionAspect;
          world.renderer!.postproduction.style = result;
          updateIfManualMode();
        }}">

        <bim-option label="Basic" value="${OBF.PostproductionAspect.COLOR}"></bim-option>
        <bim-option label="Pen" value="${OBF.PostproductionAspect.PEN}"></bim-option>
        <bim-option label="Shadowed Pen" value="${OBF.PostproductionAspect.PEN_SHADOWS}"></bim-option>
        <bim-option label="Color Pen" value="${OBF.PostproductionAspect.COLOR_PEN}"></bim-option>
        <bim-option label="Color Shadows" value="${OBF.PostproductionAspect.COLOR_SHADOWS}"></bim-option>
        <bim-option checked label="Color Pen Shadows" value="${OBF.PostproductionAspect.COLOR_PEN_SHADOWS}"></bim-option>
      </bim-dropdown>

    </bim-panel-section>

      <bim-panel-section class="composer-only" label="Edges">

      <bim-number-input
          slider step="0.1" label="Width"
          value="${world.renderer!.postproduction.edgesPass.width}" min="1" max="3"
          @change="${({ target }: { target: BUI.NumberInput }) => {
            world.renderer!.postproduction.edgesPass.width = target.value;
            updateIfManualMode();
          }}">
      </bim-number-input>

      <bim-color-input label="Edges color"
        color="#${edgesPass.color.getHexString()}"
        @input="${({ target }: { target: BUI.ColorInput }) => {
          edgesPass.color.set(target.value.color);
          updateIfManualMode();
        }}">
      </bim-color-input>

      <bim-dropdown label="Edges Mode"
        @change="${({ target }: { target: BUI.Dropdown }) => {
          edgesPass.mode = target.value[0] as OBF.EdgeDetectionPassMode;
          updateIfManualMode();
        }}">
        <bim-option checked label="Default" value="${OBF.EdgeDetectionPassMode.DEFAULT}"></bim-option>
        <bim-option label="Global" value="${OBF.EdgeDetectionPassMode.GLOBAL}"></bim-option>
      </bim-dropdown>

    </bim-panel-section>

    <bim-panel-section class="composer-only" label="Outline">

      <bim-number-input
          slider step="0.1" label="Outline thickness"
          value="${outlinePass.thickness}" min="1" max="10"
          @change="${({ target }: { target: BUI.NumberInput }) => {
            outlinePass.thickness = target.value;
            updateIfManualMode();
          }}">
      </bim-number-input>

      <bim-number-input
          slider step="0.01" label="Fill opacity"
          value="${outlinePass.fillOpacity}" min="0" max="1"
          @change="${({ target }: { target: BUI.NumberInput }) => {
            outlinePass.fillOpacity = target.value;
            updateIfManualMode();
          }}">
      </bim-number-input>

      <bim-color-input label="Line color"
        color="#${outlinePass.outlineColor.getHexString()}"
        @input="${({ target }: { target: BUI.ColorInput }) => {
          outlinePass.outlineColor.set(target.value.color);
          updateIfManualMode();
        }}">
      </bim-color-input>

      <bim-color-input label="Fill color"
        color="#${outlinePass.fillColor.getHexString()}"
        @input="${({ target }: { target: BUI.ColorInput }) => {
          outlinePass.fillColor.set(target.value.color);
          updateIfManualMode();
        }}">
      </bim-color-input>

    </bim-panel-section>

  
    <bim-panel-section class="composer-only" label="Gloss">

      <bim-checkbox label="Enabled"
        ?checked=${world.renderer!.postproduction.glossEnabled}
        @change="${({ target }: { target: BUI.Checkbox }) => {
          world.renderer!.postproduction.glossEnabled = target.value;
          updateIfManualMode();
        }}">
      </bim-checkbox>

      <bim-number-input
        slider step="0.01" label="Min gloss"
        value="${world.renderer!.postproduction.glossPass.minGloss}" min="-1" max="1"
        @change="${({ target }: { target: BUI.NumberInput }) => {
          world.renderer!.postproduction.glossPass.minGloss = target.value;
          updateIfManualMode();
        }}">
      </bim-number-input>

      <bim-number-input
        slider step="0.01" label="Max gloss"
        value="${world.renderer!.postproduction.glossPass.maxGloss}" min="-1" max="1"
        @change="${({ target }: { target: BUI.NumberInput }) => {
          world.renderer!.postproduction.glossPass.maxGloss = target.value;
          updateIfManualMode();
        }}">
      </bim-number-input>

      <bim-number-input
        slider step="0.01" label="Gloss exponent"
        value="${world.renderer!.postproduction.glossPass.glossExponent}" min="0.1" max="20"
        @change="${({ target }: { target: BUI.NumberInput }) => {
          world.renderer!.postproduction.glossPass.glossExponent = target.value;
          updateIfManualMode();
        }}">
      </bim-number-input>

      <bim-number-input
        slider step="0.01" label="Fresnel exponent"
        value="${world.renderer!.postproduction.glossPass.fresnelExponent}" min="0.1" max="50"
        @change="${({ target }: { target: BUI.NumberInput }) => {
          world.renderer!.postproduction.glossPass.fresnelExponent =
            target.value;
          updateIfManualMode();
        }}">
      </bim-number-input>

      <bim-number-input
        slider step="0.01" label="Gloss factor"
        value="${world.renderer!.postproduction.glossPass.glossFactor}" min="0" max="1"
        @change="${({ target }: { target: BUI.NumberInput }) => {
          world.renderer!.postproduction.glossPass.glossFactor = target.value;
          updateIfManualMode();
        }}">
      </bim-number-input>

      <bim-number-input
        slider step="0.01" label="Fresnel factor"
        value="${world.renderer!.postproduction.glossPass.fresnelFactor}" min="0" max="10"
        @change="${({ target }: { target: BUI.NumberInput }) => {
          world.renderer!.postproduction.glossPass.fresnelFactor = target.value;
          updateIfManualMode();
        }}">
      </bim-number-input>

    </bim-panel-section>

    ${world.renderer!.api === "webgpu" ? BUI.html`
    <bim-panel-section label="Moving resolution">
      <bim-checkbox label="Lower resolution while the camera moves"
        ?checked=${world.renderer!.movingResolution.enabled}
        @change="${({ target }: { target: BUI.Checkbox }) => {
          world.renderer!.movingResolution.enabled = target.value;
          updateIfManualMode();
        }}">
      </bim-checkbox>
    </bim-panel-section>` : null}

    <bim-panel-section label="Manual mode">
      <bim-checkbox label="Enabled"
        ?checked=${world.renderer!.mode === OBC.RendererMode.MANUAL}
        @change="${({ target }: { target: BUI.Checkbox }) => {
          world.renderer!.mode = target.value
            ? OBC.RendererMode.MANUAL
            : OBC.RendererMode.AUTO;
        }}">
      </bim-checkbox>

      <bim-number-input label="Delay"
        value="${world.renderer!.manualModeDelay}" min="10" max="1000"
        @change="${({ target }: { target: BUI.NumberInput }) => {
          world.renderer!.manualModeDelay = target.value;
          updateIfManualMode();
        }}">
      </bim-number-input>

      <bim-checkbox label="Turn off on manual mode"
        ?checked=${world.renderer!.turnOffOnManualMode}
        @change="${({ target }: { target: BUI.Checkbox }) => {
          world.renderer!.turnOffOnManualMode = target.value;
          updateIfManualMode();
        }}">
      </bim-checkbox>

      <bim-dropdown label="Default style"
        @change="${({ target }: { target: BUI.Dropdown }) => {
          const result = target.value[0] as OBF.PostproductionAspect;
          world.renderer!.manualDefaultStyle = result;
          updateIfManualMode();
        }}">
        <bim-option label="Basic" value="${OBF.PostproductionAspect.COLOR}"></bim-option>
        <bim-option label="Pen" value="${OBF.PostproductionAspect.PEN}"></bim-option>
        <bim-option label="Pen Shadows" value="${OBF.PostproductionAspect.PEN_SHADOWS}"></bim-option>
        <bim-option label="Color Pen" value="${OBF.PostproductionAspect.COLOR_PEN}"></bim-option>
        <bim-option label="Color Shadows" value="${OBF.PostproductionAspect.COLOR_SHADOWS}"></bim-option>
        <bim-option label="Color Pen Shadows" value="${OBF.PostproductionAspect.COLOR_PEN_SHADOWS}"></bim-option>
      </bim-dropdown>


    </bim-panel-section>

    <bim-panel-section class="composer-only" label="Ambient Occlusion">

        <bim-checkbox checked label="Screen Space Radius"
          ?checked=${defaultAoParameters.screenSpaceRadius}
          @change="${({ target }: { target: BUI.Checkbox }) => {
            defaultAoParameters.screenSpaceRadius = target.value;
            aoPass.updateGtaoMaterial(defaultAoParameters);
            updateIfManualMode();
          }}">
        </bim-checkbox>

        <bim-number-input
          slider step="0.01" label="Blend intensity"
          value="${aoPass.blendIntensity}" min="0" max="1"
          @change="${({ target }: { target: BUI.NumberInput }) => {
            aoPass.blendIntensity = target.value;
            updateIfManualMode();
          }}">
        </bim-number-input>

        <bim-number-input
          slider step="0.01" label="Radius"
          value="${defaultAoParameters.radius}" min="0.01" max="1"
          @change="${({ target }: { target: BUI.NumberInput }) => {
            defaultAoParameters.radius = target.value;
            aoPass.updateGtaoMaterial(defaultAoParameters);
            updateIfManualMode();
          }}">
        </bim-number-input>

        <bim-number-input
          slider step="0.01" label="Distance exponent"
          value="${defaultAoParameters.distanceExponent}" min="1" max="10"
          @change="${({ target }: { target: BUI.NumberInput }) => {
            defaultAoParameters.distanceExponent = target.value;
            aoPass.updateGtaoMaterial(defaultAoParameters);
            updateIfManualMode();
          }}">
        </bim-number-input>

        <bim-number-input
          slider step="0.01" label="Thickness"
          value="${defaultAoParameters.thickness}" min="0.01" max="10"
          @change="${({ target }: { target: BUI.NumberInput }) => {
            defaultAoParameters.thickness = target.value;
            aoPass.updateGtaoMaterial(defaultAoParameters);
            updateIfManualMode();
          }}">
        </bim-number-input>

        <bim-number-input
          slider step="0.01" label="Distance falloff"
          value="${defaultAoParameters.distanceFallOff}" min="0" max="1"
          @change="${({ target }: { target: BUI.NumberInput }) => {
            defaultAoParameters.distanceFallOff = target.value;
            aoPass.updateGtaoMaterial(defaultAoParameters);
            updateIfManualMode();
          }}">
        </bim-number-input>

        <bim-number-input
          slider step="0.01" label="Scale"
          value="${defaultAoParameters.scale}" min="0.01" max="10"
          @change="${({ target }: { target: BUI.NumberInput }) => {
            defaultAoParameters.scale = target.value;
            aoPass.updateGtaoMaterial(defaultAoParameters);
            updateIfManualMode();
          }}">
        </bim-number-input>

        <bim-number-input
          slider step="1" label="Samples"
          value="${defaultAoParameters.samples}" min="2" max="32"
          @change="${({ target }: { target: BUI.NumberInput }) => {
            defaultAoParameters.samples = target.value;
            aoPass.updateGtaoMaterial(defaultAoParameters);
            updateIfManualMode();
          }}">
        </bim-number-input>

        <bim-number-input
          slider step="0.1" label="PD Luma Phi"
          value="${pdParameters.lumaPhi}" min="0" max="20"
          @change="${({ target }: { target: BUI.NumberInput }) => {
            pdParameters.lumaPhi = target.value;
            aoPass.updatePdMaterial(pdParameters);
            updateIfManualMode();
          }}">
        </bim-number-input>

        <bim-number-input
          slider step="0.1" label="PD Depth Phi"
          value="${pdParameters.depthPhi}" min="0.01" max="20"
          @change="${({ target }: { target: BUI.NumberInput }) => {
            pdParameters.depthPhi = target.value;
            aoPass.updatePdMaterial(pdParameters);
            updateIfManualMode();
          }}">
        </bim-number-input>

        <bim-number-input
          slider step="0.1" label="PD Normal Phi"
          value="${pdParameters.normalPhi}" min="0.01" max="20"
          @change="${({ target }: { target: BUI.NumberInput }) => {
            pdParameters.normalPhi = target.value;
            aoPass.updatePdMaterial(pdParameters);
            updateIfManualMode();
          }}">
        </bim-number-input>

        <bim-number-input
          slider step="1" label="PD Radius"
          value="${pdParameters.radius}" min="0" max="32"
          @change="${({ target }: { target: BUI.NumberInput }) => {
            pdParameters.radius = target.value;
            aoPass.updatePdMaterial(pdParameters);
            updateIfManualMode();
          }}">
        </bim-number-input>

        <bim-number-input
          slider step="0.1" label="PD Radius Exponent"
          value="${pdParameters.radiusExponent}" min="0.1" max="4"
          @change="${({ target }: { target: BUI.NumberInput }) => {
            pdParameters.radiusExponent = target.value;
            aoPass.updatePdMaterial(pdParameters);
            updateIfManualMode();
          }}">
        </bim-number-input>

        <bim-number-input
          slider step="0.125" label="PD Rings"
          value="${pdParameters.rings}" min="1" max="16"
          @change="${({ target }: { target: BUI.NumberInput }) => {
            pdParameters.rings = target.value;
            aoPass.updatePdMaterial(pdParameters);
            updateIfManualMode();
          }}">
        </bim-number-input>

        <bim-number-input
          slider step="1" label="PD Samples"
          value="${pdParameters.samples}" min="2" max="32"
          @change="${({ target }: { target: BUI.NumberInput }) => {
            pdParameters.samples = target.value;
            aoPass.updatePdMaterial(pdParameters);
            updateIfManualMode();
          }}">
        </bim-number-input>

      </bim-panel-section>


    </bim-panel>
    `;
});

document.body.append(panel);

/* MD
  To keep the menu tidy, we will only show the sections that apply to the active pipeline: the ones tagged `deferred-only` while the deferred pipeline is running, and the ones tagged `composer-only` while the composer is running. We run this once at startup and again every time the "Postproduction mode" dropdown changes.
*/

function applyModeVisibility(mode: OBF.PostproductionMode) {
  const isDeferred = mode === OBF.PostproductionMode.DEFERRED;
  panel.querySelectorAll<HTMLElement>(".deferred-only").forEach((section) => {
    section.style.display = isDeferred ? "" : "none";
  });
  panel.querySelectorAll<HTMLElement>(".composer-only").forEach((section) => {
    section.style.display = isDeferred ? "none" : "";
  });
}

applyModeVisibility(world.renderer.postproduction.mode);

/* MD
  And we will make some logic that adds a button to the screen when the user is visiting our app from their phone, allowing to show or hide the menu. Otherwise, the menu would make the app unusable.
*/

const button = BUI.Component.create<BUI.PanelSection>(() => {
  return BUI.html`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${() => {
          if (panel.classList.contains("options-menu-visible")) {
            panel.classList.remove("options-menu-visible");
          } else {
            panel.classList.add("options-menu-visible");
          }
        }}">
      </bim-button>
    `;
});

document.body.append(button);

// /* MD
//   ### 🎉 Wrap up
//   ---

//   That's it! You have created an app that looks great thanks to postproduction and exposes a menu to allow the user control it in real time.
// */
