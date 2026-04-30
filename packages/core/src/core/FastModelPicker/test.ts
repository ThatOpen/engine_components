/* MD
  ## 📄 Fast Model Picking with Color Coding
  ---
  This tutorial demonstrates how to use the FastModelPicker component to quickly identify which fragment model is under the mouse cursor. Unlike raycasting, this component uses color coding for extremely fast model identification, making it ideal for scenarios where you need to quickly determine which model the user is hovering over or clicking on.

  ### 🖖 Importing our Libraries
  First things first, let's install all necessary dependencies to make this example work:
*/

import * as THREE from "three";
import Stats from "stats.js";
// You have to import * as OBC from "@thatopen/components"
import * as OBC from "../..";

/* MD
  ### 🌎 Setting up a Simple Scene
  To get started, let's set up a basic ThreeJS scene. This will serve as the foundation for our application and allow us to visualize the 3D models effectively:
*/

const components = new OBC.Components();

const worlds = components.get(OBC.Worlds);
const world = worlds.create<
  OBC.SimpleScene,
  OBC.OrthoPerspectiveCamera,
  OBC.SimpleRenderer
>();

world.scene = new OBC.SimpleScene(components);
world.scene.setup();
world.scene.three.background = null;

const container = document.getElementById("container")!;
world.renderer = new OBC.SimpleRenderer(components, container);
world.camera = new OBC.OrthoPerspectiveCamera(components);
await world.camera.controls.setLookAt(68, 23, -8.5, 21.5, -5.5, 23);

components.init();

/* MD
  ### 🛠️ Setting Up Fragments
  Now, let's configure the FragmentsManager. This will allow us to load models effortlessly and start manipulating them with ease:
*/

const workerUrl =
  "/node_modules/@thatopen/fragments/dist/Worker/worker.mjs";
const fragments = components.get(OBC.FragmentsManager);
fragments.init(workerUrl);

world.camera.controls.addEventListener("rest", () =>
  fragments.core.update(true),
);

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

/* MD
  ### 📂 Loading Fragments Models
  With the core setup complete, it's time to load Fragments models into our scene. We'll load multiple models to demonstrate the picker's ability to distinguish between them:
*/

const fragPaths = [
  "/resources/frags/school_arq.frag",
  "/resources/frags/school_str.frag",
];

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
  ### ✨ Using The FastModelPicker Component
  Now let's set up the FastModelPicker. This component uses color coding to quickly identify which model is under the mouse cursor:
*/

const pickers = components.get(OBC.FastModelPickers);
const picker = pickers.get(world);

/* MD
  ### 🎨 Enabling Debug Mode
  Debug mode shows a small canvas in the top-right corner displaying the color-coded render. This is useful for understanding how the component works:
*/

picker.setDebugMode(true);

/* MD
  ### 🖱️ Picking Models on Mouse Move
  Let's add an event listener to detect which model is under the mouse cursor as you move it:
*/

const infoPanel = document.createElement("div");
infoPanel.style.position = "fixed";
infoPanel.style.top = "10px";
infoPanel.style.left = "10px";
infoPanel.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
infoPanel.style.color = "white";
infoPanel.style.padding = "10px";
infoPanel.style.borderRadius = "5px";
infoPanel.style.fontFamily = "monospace";
infoPanel.style.zIndex = "10000";
infoPanel.innerHTML = "Move your mouse over the models...";
document.body.appendChild(infoPanel);

container.addEventListener("pointermove", async (event) => {
  // Get mouse position in normalized coordinates
  const bounds = container.getBoundingClientRect();
  const x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
  const y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;
  const position = new THREE.Vector2(x, y);

  // The same picker now exposes both granularities. `getItemAt` reads
  // the same id render and additionally resolves the per-item localId
  // via a cached worker call. First hover on a new item pays one
  // round-trip; everything after is main-thread only.
  const item = await picker.getItemAt(position);

  if (item) {
    infoPanel.innerHTML = `Model: <strong>${item.modelId}</strong><br/>Item: <strong>${item.localId}</strong>`;
    infoPanel.style.color = "lime";
  } else {
    infoPanel.innerHTML = "No item detected";
    infoPanel.style.color = "white";
  }
});

/* MD
  ### 🎯 Picking Models on Click
  You can also pick models on click events:
*/

container.addEventListener("click", async (event) => {
  const bounds = container.getBoundingClientRect();
  const x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
  const y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;
  const position = new THREE.Vector2(x, y);

  const modelId = await picker.getModelAt(position);
  if (modelId) {
    console.log("Clicked on model:", modelId);
  }
});

/* MD
  ### 📊 Performance Stats
  Let's add performance monitoring to see how fast the picker is:
*/

const stats = new Stats();
stats.showPanel(2);
document.body.append(stats.dom);
stats.dom.style.left = "0px";
stats.dom.style.zIndex = "unset";

world.renderer.onBeforeUpdate.add(() => stats.begin());
world.renderer.onAfterUpdate.add(() => stats.end());

/* MD
  ### 💡 Tips
  - The FastModelPicker is much faster than raycasting for simple model identification
  - Debug mode is useful for understanding how the color coding works
  - The component automatically handles multiple models and assigns unique colors to each
  - You can disable debug mode by calling `picker.setDebugMode(false)`
*/

