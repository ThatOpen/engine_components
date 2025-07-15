/* MD
  ## 📄 Adding Fancy Grids
  ---
  In this tutorial you'll learn how to add a fancy grid to your scene. It's super easy and will make your app look much more professional!

  :::tip Why a grid?

  Grids are very common in 3D apps, and it's a great way to have a reference point for your users to navigate around, even when there are no visible objects around.

  :::

  ### 🖖 Importing our Libraries
  First things first, let's install all necessary dependencies to make this example work:
*/

import * as THREE from "three";
import Stats from "stats.js";
import * as BUI from "@thatopen/ui";
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
  With the core setup complete, it's time to load a Fragments model into our scene. Fragments are optimized for fast loading and rendering, making them ideal for large-scale 3D models.

  :::info Where can I find Fragment files?

  You can use the sample Fragment files available in our repository for testing. If you have an IFC model you'd like to convert to Fragments, check out the IfcImporter tutorial for detailed instructions.

  :::
*/

const fragPaths = ["https://thatopen.github.io/engine_components/resources/frags/school_arq.frag"];
const [model] = await Promise.all(
  fragPaths.map(async (path) => {
    const modelId = path.split("/").pop()?.split(".").shift();
    if (!modelId) return null;
    const file = await fetch(path);
    const buffer = await file.arrayBuffer();
    return fragments.core.load(buffer, { modelId });
  }),
);

/* MD
  ### ✨ Using The Grids Component
  The Grids component is straightforward to use. It allows you to create an infinite grid for any world in your application. Here's how you can proceed:
*/

const grids = components.get(OBC.Grids);
// create the grid for the world we set
const grid = grids.create(world);

/* MD
  Now, something convenient to do is set the grid at some height based on your model levels. For it, you need to know the levels (storeys if using IFC schema) of your model and get it's computed elevation from the attributes. First, let's get the model levels and it's attributes:
*/

const storeys = await model!.getItemsOfCategories([/BUILDINGSTOREY/]);
const localIds = Object.values(storeys).flat();
const data = await model!.getItemsData(localIds);

/* MD
  Then, we can create a very simple helper function that returns the storey elevation based on it's name:
*/

const getStoreyElevation = async (name: string) => {
  const storey = data.find((attributes) => {
    if (!("Name" in attributes && "value" in attributes.Name)) return false;
    return attributes.Name.value === name;
  });
  if (!storey) return 0;
  if (!("Elevation" in storey && "value" in storey.Elevation)) return 0;
  const [, coordHeight] = await model!.getCoordinates();
  return storey.Elevation.value + coordHeight;
};

/* MD
  ### 🧩 Adding some UI (optional but recommended)
  We will use the `@thatopen/ui` library to add some simple and cool UI elements to our app. First, we need to call the `init` method of the `BUI.Manager` class to initialize the library:
*/

BUI.Manager.init();

/* MD
Now we will add some UI to play around with the actions in this tutorial. For more information about the UI library, you can check the specific documentation for it!
*/

const panel = BUI.Component.create<BUI.PanelSection>(() => {
  const onGridLevelChange = async ({ target }: { target: BUI.Dropdown }) => {
    const [level] = target.value;
    if (!level) return;
    const elevation = await getStoreyElevation(level);
    grid.three.position.y = elevation;
  };

  return BUI.html`
    <bim-panel active label="Grids Tutorial" class="options-menu">
      <bim-panel-section label="Section">
        <bim-dropdown @change=${onGridLevelChange} placeholder="Select a grid level">
          ${data.map((attributes) => {
            if (!("Name" in attributes && "value" in attributes.Name)) {
              return null;
            }
            return BUI.html`<bim-option label=${attributes.Name.value}></bim-option>`;
          })}
        </bim-dropdown>
        <bim-checkbox label="Grid visible" checked 
          @change="${({ target }: { target: BUI.Checkbox }) => {
            grid.config.visible = target.value;
          }}">
        </bim-checkbox>
      
        <bim-color-input 
          label="Grid Color" color="#bbbbbb" 
          @input="${({ target }: { target: BUI.ColorInput }) => {
            grid.config.color = new THREE.Color(target.color);
          }}">
        </bim-color-input>
        
        <bim-number-input 
          slider step="0.1" label="Grid primary size" value="1" min="0" max="10"
          @change="${({ target }: { target: BUI.NumberInput }) => {
            grid.config.primarySize = target.value;
          }}">
        </bim-number-input>
        
        <bim-number-input 
          slider step="0.1" label="Grid secondary size" value="10" min="0" max="20"
          @change="${({ target }: { target: BUI.NumberInput }) => {
            grid.config.secondarySize = target.value;
          }}">
        </bim-number-input>
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
  That's it! Now you're able to [insert here the learnings]. Congratulations! Keep going with more tutorials in the documentation.
*/
