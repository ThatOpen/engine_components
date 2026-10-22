/* MD
### ☁️ Reality capture: point clouds + BIM
---

  The `PointCloudLoader` streams out-of-core point clouds (Potree 2.0 octrees) and
  draws them through the deferred `PostproductionRenderer`, so they are correctly
  occluded by BIM geometry. It handles georeferenced precision (a float64 anchor),
  centres the cloud on its data centroid, and exposes the tuned point material as
  live quality settings (overlap, detail, point budget, max size, EDL).

  This example does not ship any point cloud: you load your own. Pick (or drag and
  drop) the three files of a Potree 2.0 dataset: `metadata.json`, `hierarchy.bin`
  and `octree.bin`. You can produce them from a `.las` file with
  `buildPotreeOctree` from `@thatopen/components` (`dist/realityCapture`), or with
  PotreeConverter 2.

  :::info Optional dependency

  The loader needs `potree-core` installed. It is an optional peer dependency,
  imported only when a cloud is loaded.

  :::

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
  the point loader draws through.
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

  We load a sample Fragments model so you can see points hidden behind its walls
  once your cloud is placed next to it.
*/

const workerUrl = await OBC.FragmentsManager.getWorker();
const fragments = components.get(OBC.FragmentsManager);
fragments.init(workerUrl);
world.camera.controls.addEventListener("update", () => fragments.core.update());
world.onCameraChanged.add((camera) => {
  for (const [, model] of fragments.list) model.useCamera(camera.three);
  fragments.core.update(true);
});
fragments.list.onItemSet.add(({ value: model }) => {
  model.useCamera(world.camera.three);
  world.scene.three.add(model.object);
  fragments.core.update(true);
});

const fragFile = await fetch(
  "https://thatopen.github.io/engine_components/resources/frags/school_arq.frag",
);
await fragments.core.load(await fragFile.arrayBuffer(), {
  modelId: "school_arq",
});

/* MD
  ### ☁️ Loading your point cloud
  ---

  Get the `PointCloudLoader` and give it the world. The loader fetches its bytes
  through a `requestManager`, so the transport is yours: here it serves the files
  you picked straight from memory, honouring the HTTP `Range` requests the octree
  streaming makes.
*/

const pcl = components.get(OBF.PointCloudLoader);
pcl.world = world;

const localFilesRequestManager = (
  files: Map<string, File>,
): OBF.PointCloudRequestManager => ({
  getUrl: (url: string) => url,
  async fetch(input: RequestInfo | URL, init?: RequestInit) {
    const url = typeof input === "string" ? input : input.toString();
    const name = url.split(/[\\/]/).pop()!.split("?")[0];
    const file = files.get(name);
    if (!file) return new Response(null, { status: 404 });
    const range = new Headers(init?.headers).get("Range");
    const match = range?.match(/bytes=(\d+)-(\d*)/);
    if (!match) return new Response(file);
    const start = Number(match[1]);
    const end = match[2] ? Number(match[2]) + 1 : file.size;
    return new Response(file.slice(start, end), { status: 206 });
  },
});

const clipper = components.get(OBC.Clipper);
clipper.enabled = true;
let section: string | null = null;

const loadFiles = async (list: FileList | File[]) => {
  const files = new Map<string, File>();
  for (const file of Array.from(list)) files.set(file.name, file);
  const required = ["metadata.json", "hierarchy.bin", "octree.bin"];
  const missing = required.filter((name) => !files.has(name));
  if (missing.length) {
    alert(`Missing Potree 2.0 files: ${missing.join(", ")}`);
    return;
  }
  // `fitCamera` because this tutorial is ABOUT the cloud: it defaults off so
  // the loader never moves a camera an app has placed.
  const cloud = await pcl.load(
    { url: "local", requestManager: localFilesRequestManager(files) },
    { id: `local-${pcl.list.size}`, fitCamera: true },
  );

  // Widen near/far so the anchored cloud isn't clipped at any scale.
  const diag = cloud.box.getSize(new THREE.Vector3()).length() || 100;
  world.camera.three.near = Math.max(diag / 5000, 0.01);
  world.camera.three.far = diag * 200;
  world.camera.three.updateProjectionMatrix();

  // A horizontal clipping plane through the middle of the cloud. The loader
  // hands the active planes to its point material, so the cut happens in the
  // point shader and a cloud and a model share one plane.
  if (section) await clipper.delete(world, section);
  section = clipper.createFromNormalAndCoplanarPoint(
    world,
    new THREE.Vector3(0, 1, 0),
    cloud.box.getCenter(new THREE.Vector3()),
  );
};

const pickFiles = () => {
  const input = document.createElement("input");
  input.type = "file";
  input.multiple = true;
  input.accept = ".json,.bin";
  input.addEventListener("change", () => {
    if (input.files) void loadFiles(input.files);
  });
  input.click();
};

// Drag and drop the three files onto the viewer works too.
container.addEventListener("dragover", (event) => event.preventDefault());
container.addEventListener("drop", (event) => {
  event.preventDefault();
  if (event.dataTransfer?.files) void loadFiles(event.dataTransfer.files);
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

  We use `@thatopen/ui` to load your files and to wire the point-cloud quality
  settings to a panel.
*/

BUI.Manager.init();

const s = pcl.settings;

const panel = BUI.Component.create<BUI.PanelSection>(() => {
  return BUI.html`
  <bim-panel active label="Point Cloud Loader" class="options-menu">

    <bim-panel-section label="Your point cloud">
      <bim-label style="white-space: normal">
        Pick or drop metadata.json, hierarchy.bin and octree.bin (Potree 2.0).
      </bim-label>
      <bim-button label="Load Potree 2.0 files" @click=${pickFiles}></bim-button>
    </bim-panel-section>

    <bim-panel-section label="Quality">

      <bim-number-input
        slider step="0.05" label="Overlap (overdraw / coverage)"
        value="${s.overlap}" min="1" max="1.7"
        @change="${({ target }: { target: BUI.NumberInput }) => {
          s.overlap = target.value;
        }}">
      </bim-number-input>

      <bim-number-input
        slider step="10" label="Detail (min node px)"
        value="${s.minNodePixelSize}" min="80" max="400"
        @change="${({ target }: { target: BUI.NumberInput }) => {
          s.minNodePixelSize = target.value;
        }}">
      </bim-number-input>

      <bim-number-input
        slider step="100000" label="Point budget"
        value="${s.pointBudget}" min="250000" max="3000000"
        @change="${({ target }: { target: BUI.NumberInput }) => {
          s.pointBudget = target.value;
        }}">
      </bim-number-input>

      <bim-number-input
        slider step="2" label="Max point size (px)"
        value="${s.maxSize}" min="2" max="50"
        @change="${({ target }: { target: BUI.NumberInput }) => {
          s.maxSize = target.value;
        }}">
      </bim-number-input>

      <bim-checkbox label="EDL (eye-dome lighting)"
        ?checked=${s.edl}
        @change="${({ target }: { target: BUI.Checkbox }) => {
          s.edl = target.value;
        }}">
      </bim-checkbox>

      <bim-checkbox checked label="Section the cloud"
        @change="${({ target }: { target: BUI.Checkbox }) => {
          const plane = section ? clipper.list.get(section) : undefined;
          if (plane) plane.enabled = target.value;
        }}">
      </bim-checkbox>

    </bim-panel-section>

  </bim-panel>
  `;
});

document.body.append(panel);
