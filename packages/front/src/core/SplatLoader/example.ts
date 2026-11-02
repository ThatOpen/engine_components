/* MD
### ✨ Reality capture: gaussian splats + BIM
---

  The `SplatLoader` renders 3D Gaussian splats (`.ply` / `.compressed.ply`) through
  the deferred `PostproductionRenderer`, so they are correctly occluded by BIM
  geometry. The splats are drawn by an in-house WebGL2 renderer (EWA covariance
  billboards + a worker global depth sort) into the deferred occlusion layer and
  depth-tested against the BIM depth: no external splat engine.

  This example does not ship any capture: you load your own. Pick (or drag and
  drop) a gaussian splat `.ply` (INRIA 3DGS) or `.compressed.ply` file.

  ### 🖖 Importing our Libraries
*/

import * as THREE from "three";
import * as OBC from "@thatopen/components";
import Stats from "stats.js";
import * as BUI from "@thatopen/ui";
// You have to import * as OBF from "@thatopen/components-front"
import * as OBF from "../..";

/* MD
  ### 🌎 Setting up the scene
  ---

  A simple world with the `PostproductionRenderer` in DEFERRED mode: the pipeline
  the splat loader draws through.
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
world.renderer = new OBF.PostproductionRenderer(components, container);
world.camera = new OBC.OrthoPerspectiveCamera(components);

components.init();

const grids = components.get(OBC.Grids);
const grid = grids.create(world);
grid.config.color.set(0x666666);

world.renderer.postproduction.enabled = true;
world.renderer.postproduction.mode = OBF.PostproductionMode.DEFERRED;
world.renderer.postproduction.style =
  OBF.PostproductionAspect.COLOR_PEN_SHADOWS;
world.renderer.postproduction.basePass.isolatedMaterials.push(grid.material);
world.dynamicAnchor = false;

/* MD
  ### 🏢 A BIM model as occluder
  ---

  We load a sample Fragments model so splats behind its walls get hidden once
  your capture is placed next to it. The `FragmentsManager` is initialised
  regardless: the splat loader registers a pick contributor on the world's
  `FastModelPicker`, which relies on it.
*/

const workerUrl = await OBC.FragmentsManager.getWorker();
const fragments = components.get(OBC.FragmentsManager);
fragments.init(workerUrl);
world.camera.controls.addEventListener("update", () => fragments.core.update());
world.onCameraChanged.add((camera) => {
  for (const [, model] of fragments.list) model.useCamera(camera.three);
  fragments.core.update(true);
});
const bimObjects: THREE.Object3D[] = [];
fragments.list.onItemSet.add(({ value: model }) => {
  model.useCamera(world.camera.three);
  world.scene.three.add(model.object);
  bimObjects.push(model.object);
  fragments.core.update(true);
});

const fragFile = await fetch(
  "https://thatopen.github.io/engine_components/resources/frags/school_arq.frag",
);
await fragments.core.load(await fragFile.arrayBuffer(), {
  modelId: "school_arq",
});

/* MD
  ### ✨ Loading your splats
  ---

  Get the `SplatLoader`, give it the world, and hand it the bytes of your file.
  Captured splats are often non-metric: `gaussianScale` scales every dataset so
  you can bring yours to true size next to the BIM.
*/

const splats = components.get(OBF.SplatLoader);
splats.world = world;

let current: OBF.LoadedSplat | null = null;

const frameSplat = async () => {
  if (!current) return;
  const center = current.box.getCenter(new THREE.Vector3());
  const radius = current.box.getSize(new THREE.Vector3()).length() / 2 || 8;
  await world.camera.controls.setLookAt(
    center.x + radius,
    center.y + radius * 0.7,
    center.z + radius,
    center.x,
    center.y,
    center.z,
    true,
  );
};

const loadFile = async (file: File) => {
  const fileBytes = new Uint8Array(await file.arrayBuffer());
  if (current) splats.remove(current.id);
  current = await splats.load({ fileBytes }, { id: file.name });
  await frameSplat();
};

const pickFile = () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".ply";
  input.addEventListener("change", () => {
    const file = input.files?.[0];
    if (file) void loadFile(file);
  });
  input.click();
};

// Drag and drop the file onto the viewer works too.
container.addEventListener("dragover", (event) => event.preventDefault());
container.addEventListener("drop", (event) => {
  event.preventDefault();
  const file = event.dataTransfer?.files?.[0];
  if (file) void loadFile(file);
});

/* MD
  ### ⏱️ Measuring the performance (optional)
  ---
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

  We use `@thatopen/ui` to load your file and to wire the splat settings to a
  panel.
*/

BUI.Manager.init();

const panel = BUI.Component.create<BUI.PanelSection>(() => {
  return BUI.html`
  <bim-panel active label="Splat Loader" class="options-menu">

    <bim-panel-section label="Your capture">
      <bim-label style="white-space: normal">
        Pick or drop a gaussian splat .ply / .compressed.ply file.
      </bim-label>
      <bim-button label="Load splat file" @click=${pickFile}></bim-button>
      <bim-button label="Frame splats" @click=${() => frameSplat()}></bim-button>
      <bim-label id="splat-count">No splats loaded</bim-label>
    </bim-panel-section>

    <bim-panel-section label="Settings">

      <bim-checkbox label="BIM model" checked
        @change="${({ target }: { target: BUI.Checkbox }) => {
          for (const object of bimObjects) object.visible = target.value;
        }}">
      </bim-checkbox>

      <bim-checkbox label="Splats enabled" checked
        @change="${({ target }: { target: BUI.Checkbox }) => {
          splats.enabled = target.value;
        }}">
      </bim-checkbox>

      <bim-number-input label="Gaussian scale" slider
        value="${splats.gaussianScale}" min="0.01" max="200" step="0.01"
        @change="${({ target }: { target: BUI.NumberInput }) => {
          splats.gaussianScale = target.value;
        }}">
      </bim-number-input>

      <bim-number-input label="Min pixel size (cull)" slider
        value="${splats.minPixelSize}" min="0" max="8" step="0.25"
        @change="${({ target }: { target: BUI.NumberInput }) => {
          splats.minPixelSize = target.value;
        }}">
      </bim-number-input>

      <bim-number-input label="LOD distance (×radius)" slider
        value="${splats.lodQuality}" min="0.1" max="4" step="0.05"
        @change="${({ target }: { target: BUI.NumberInput }) => {
          splats.lodQuality = target.value;
        }}">
      </bim-number-input>

      <bim-number-input label="View-dependent colour (SH)" slider
        value="${splats.shStrength}" min="0" max="1" step="0.05"
        @change="${({ target }: { target: BUI.NumberInput }) => {
          splats.shStrength = target.value;
        }}">
      </bim-number-input>

    </bim-panel-section>

  </bim-panel>
  `;
});

document.body.append(panel);

const countLabel = panel.querySelector("#splat-count")!;
setInterval(() => {
  if (!current) return;
  const total = current.object.total.toLocaleString();
  countLabel.textContent = `${splats.splatCount.toLocaleString()} / ${total} gaussians`;
}, 250);
