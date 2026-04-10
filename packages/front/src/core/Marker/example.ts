/* MD
  ## 📄 2D Inside 3D
  ---
  Placing HTML labels, icons, or tooltips at fixed 3D positions is needed for digital twins, annotations, and sensor overlays — but wiring CSS2D elements to a Three.js scene manually, and collapsing overlapping ones into clusters as the camera moves, requires significant boilerplate.

  The Marker component handles this: it anchors any HTML element to a 3D position and automatically groups nearby markers into clusters based on a screen-distance threshold.

  This tutorial covers setting a clustering threshold, creating multiple HTML markers at arbitrary 3D positions, and controlling whether individual markers participate in clustering or remain static.

  By the end, you'll have a working 2D-in-3D marker system with automatic clustering ready to display icons, labels, or any HTML content anchored to model positions.

  ### 🖖 Importing our Libraries
  First things first, let's install all necessary dependencies to make this example work:
*/

import * as THREE from "three";
import Stats from "stats.js";
import * as OBC from "@thatopen/components";
import * as BUI from "@thatopen/ui";
// You have to import * as OBF from "@thatopen/components-front"
import * as OBF from "../..";

/* MD
  ### 🌎 Setting up a Simple Scene
  To get started, let's set up a basic ThreeJS scene. This will serve as the foundation for our application and allow us to visualize the 3D models effectively:
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
await world.camera.controls.setLookAt(68, 23, -8.5, 21.5, -5.5, 23);

components.init();

/* MD
  ### 🛠️ Setting Up Fragments
  Now, let's configure the FragmentsManager. This will allow us to load models effortlessly and start manipulating them with ease:
*/

const githubUrl =
  "https://thatopen.github.io/engine_fragment/resources/worker.mjs";
const fetchedUrl = await fetch(githubUrl);
const workerBlob = await fetchedUrl.blob();
const workerFile = new File([workerBlob], "worker.mjs", {
  type: "text/javascript",
});
const workerUrl = URL.createObjectURL(workerFile);
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

const fragPaths = [
  "https://thatopen.github.io/engine_components/resources/frags/school_arq.frag",
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
  ### ✨ Using The Marker Component
  Now we will get the marker instance. The threshold is the minimum distance that the marker will use to "cluster" the 2D elements together. You can create elements that are not clustered by defining them as static in the `create` method. You can disable clustering alltogether by using the autoCluster option.
*/

const marker = components.get(OBF.Marker);
marker.threshold = 10;

/* MD
  Now we will create a bunch of 2D elements in random positions:
*/

for (let i = 0; i < 20; i++) {
  const x = Math.random() * 100 - 50;
  const y = Math.random() * 10;
  const z = Math.random() * 100 - 50;
  const element = BUI.Component.create(
    () => BUI.html`<bim-label style="font-size: 20px">🚀</bim-label>`,
  );
  marker.create(world, element, new THREE.Vector3(x, y, z));
}

/* MD
  ### 🧩 Adding some UI (optional but recommended)
  We will use the `@thatopen/ui` library to add some simple and cool UI elements to our app. First, we need to call the `init` method of the `BUI.Manager` class to initialize the library:
*/

BUI.Manager.init();

/* MD
Now we will add some UI to play around with the actions in this tutorial. For more information about the UI library, you can check the specific documentation for it!
*/

const panel = BUI.Component.create<BUI.PanelSection>(() => {
  return BUI.html`
    <bim-panel active label="Marker Tutorial" class="options-menu">
    </bim-panel>
  `;
});

document.body.append(panel);

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

/* MD
  ### ⏱️ Measuring the performance (optional)
  We'll use the [Stats.js](https://github.com/mrdoob/stats.js) to measure the performance of our app. We will add it to the top left corner of the viewport. This way, we'll make sure that the memory consumption and the FPS of our app are under control.
*/

const stats = new Stats();
stats.showPanel(2);
document.body.append(stats.dom);
stats.dom.style.left = "0px";
stats.dom.style.zIndex = "unset";
world.renderer.onBeforeUpdate.add(() => stats.begin());
world.renderer.onAfterUpdate.add(() => stats.end());

/* MD
  ### 🎉 Wrap up
  That's it! Now you're able to create and manage 2D elements inside a 3D scene using the Marker component with clustering capabilities. Congratulations! Keep exploring more tutorials in the documentation to enhance your skills further.
*/
