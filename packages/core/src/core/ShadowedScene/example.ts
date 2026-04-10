/* MD
### 🚀 Handling BIM models like a boss
---

Flat-lit 3D scenes feel disconnected and hard to read — without shadows, users lose depth cues and the model looks like a technical diagram rather than a real building. The `ShadowedScene` adds ground shadows that follow the model geometry, making the scene immediately more readable and visually grounded.

This tutorial covers setting up a `ShadowedScene` in place of the standard scene, configuring shadow cascade and resolution, enabling cast and receive shadows per mesh, and toggling shadows on and off at runtime. By the end, you'll have a BIM scene with live shadows that update as the camera comes to rest.
*/

import * as THREE from "three";
import Stats from "stats.js";
import * as BUI from "@thatopen/ui";
// You have to import * as OBC from "@thatopen/components"
import * as OBC from "../..";

/* MD
  ### 🌎 Setting up a simple scene
  ---

  We will start by creating a simple scene with a camera and a renderer. If you don't know how to set up a scene, you can check the Worlds tutorial.

*/

const container = document.getElementById("container")!;

const components = new OBC.Components();

const worlds = components.get(OBC.Worlds);

const world = worlds.create<
  OBC.ShadowedScene,
  OBC.OrthoPerspectiveCamera,
  OBC.SimpleRenderer
>();

world.scene = new OBC.ShadowedScene(components);
world.renderer = new OBC.SimpleRenderer(components, container);
world.camera = new OBC.OrthoPerspectiveCamera(components);

components.init();

world.camera.controls.setLookAt(12, 6, 8, 0, 0, -10);

const grids = components.get(OBC.Grids);
const grid = grids.create(world);

// Set up fragments

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

// Remove z fighting
fragments.core.models.materials.list.onItemSet.add(({ value: material }) => {
  if (!("isLodMaterial" in material && material.isLodMaterial)) {
    material.polygonOffset = true;
    material.polygonOffsetUnits = 1;
    material.polygonOffsetFactor = Math.random();
  }
});

const modelId = "example";

const file = await fetch(
  "https://thatopen.github.io/engine_components/resources/frags/school_arq.frag",
);
const data = await file.arrayBuffer();
const buffer = new Uint8Array(data);
const model = await fragments.core.load(buffer, {
  modelId,
  camera: world.camera.three,
});
world.scene.three.add(model.object);

// Set up stats

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
  Now we will create a simple panel with a set of buttons that call the previously defined functions. For more information about the UI library, you can check the specific documentation for it!
*/

const panel = BUI.Component.create<BUI.PanelSection>(() => {
  return BUI.html`
    <bim-panel active label="Shadowed Scene Tutorial" class="options-menu">
      <bim-panel-section>
        <bim-button icon="solar:sun-bold" label="Toggle Shadows" @click="${() => {
          world.scene.shadowsEnabled = !world.scene.shadowsEnabled;
        }}">
        </bim-button>
      </bim-panel-section>
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
  ### 🎉 Wrap up
  ---

  That's it! Now you know how to load, export and dispose Fragments in your app. Fragments are much faster than raw IFC models, so you should definitely store them in your app if you want your users to have a fast loading experience. For bigger models you can use streaming, but that's another tutorial!
*/

// Adding shadows

world.renderer.three.shadowMap.enabled = true;
world.renderer.three.shadowMap.type = THREE.VSMShadowMap;

world.scene.setup({
  shadows: {
    cascade: 1,
    resolution: 2048,
  },
});

world.scene.distanceRenderer.excludedObjects.add(grid.three);

model.tiles.onItemSet.add(({ value: mesh }) => {
  if ("isMesh" in mesh) {
    const mat = mesh.material as THREE.MeshStandardMaterial[];
    if (mat[0].opacity === 1) {
      mesh.castShadow = true;
      mesh.receiveShadow = true;
    }
  }
});

for (const child of model.object.children) {
  child.castShadow = true;
  child.receiveShadow = true;
}

await world.scene.updateShadows();

world.camera.controls.addEventListener("rest", async () => {
  await world.scene.updateShadows();
});

world.scene.three.background = null;
