/* MD
### 🚀 Handling BIM models like a boss
---

In this tutorial, you'll learn how to load your BIM models in Fragment format. Fragment is an [open source geometry system](https://github.com/ThatOpen/engine_fragment/) that we created on top of [Three.js](https://threejs.org/) to display BIM models fast, while keeping control over the individual items of the model. The idea is simple: a BIM model is a FragmentsGroup, which is (like the name implies) a collection of fragments. A fragment is a set of identical geometries instantiated around the scene.

:::tip How do I get a BIM model in Fragment format?

The IfcLoader component does exactly that! It converts IFC models to Fragments. Check out that tutorial if you are starting out with IFC files. Of course, you can just use the IfcLoader in your app, but loading fragments is more than x10 faster than loading IFC files. Our recommendation is to convert your IFC files to fragments just once, store the fragment somewhere (frontent of backend) and then load the fragments instead of teh IFC models directly.

:::

In this tutorial, we will import:

- `Three.js` to get some 3D entities for our app.
- `@thatopen/ui` to add some simple and cool UI menus.
- `@thatopen/components` to set up the barebone of our app.
- `Stats.js` (optional) to measure the performance of our app.
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

const fragments = components.get(OBC.FragmentsManager);
fragments.init(
  "https://thatopen.github.io/engine_fragment/resources/worker.mjs",
);

world.camera.controls.addEventListener("control", () =>
  fragments.core.update(),
);

const modelId = "example";

const file = await fetch("https://thatopen.github.io/engine_components/resources/frags/school_arq.frag");
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
world.renderer.three.shadowMap.type = THREE.PCFSoftShadowMap;

world.scene.setup({
  shadows: {
    cascade: 1,
    resolution: 1024,
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
