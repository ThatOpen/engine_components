/* MD
  ## 📄 Picking With the Mouse
  ---
  Ray casting is the process of casting a ray from a point in space to another point in space. We will cast a ray from the mouse position to the 3D world and check if there is an object in its way. That way, when you hover or click on an object, we can know which one it is and do something with it. In this tutorial you'll learn how to use the Raycaster to pick objects in the scene with the mouse.

  ### 🖖 Importing our Libraries
  First things first, let's install all necessary dependencies to make this example work:
*/

import * as FRAGS from "@thatopen/fragments";
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
  ### ✨ Using The Raycasters Component
  With the model now loaded, we can leverage the raycaster to pick items in the scene. Let's retrieve the raycaster as shown below:
*/

const casters = components.get(OBC.Raycasters);
// Each raycaster is associated with a specific world.
// Here, we retrieve the raycaster for the `world` used in our scene.
const caster = casters.get(world);

/* MD
  With the world caster available, we can cast a ray under any condition we choose. In this example, we'll perform a raycast each time the user double-clicks within the viewer container.
*/

// We set a selection callback, so we can decide what
// happen with the selected element later
let onSelectCallback = (_modelIdMap: OBC.ModelIdMap) => {};

container.addEventListener("dblclick", async () => {
  const result = (await caster.castRay()) as any;
  if (!result) return;
  // The modelIdMap is how selections are represented in the engine.
  // The keys are modelIds, while the values are sets of localIds (items within the model)
  const modelIdMap = { [result.fragments.modelId]: new Set([result.localId]) };
  onSelectCallback(modelIdMap);
});

/* MD
  Now, for added functionality, let's modify the color of the selected element by reassigning the selection callback to something more useful. Additionally, we'll store the attributes of the selected element in a variable that can be utilized to display information (like the Name) in the UI for this example.
*/

let onItemSelected = () => {};
let attributes: FRAGS.ItemData | undefined;

// We set the color outside just to be able to change it from the UI
const color = new THREE.Color("purple");

onSelectCallback = async (modelIdMap) => {
  const modelId = Object.keys(modelIdMap)[0];
  if (modelId && fragments.list.get(modelId)) {
    const model = fragments.list.get(modelId)!;
    const [data] = await model.getItemsData([...modelIdMap[modelId]]);
    attributes = data;
  }

  await fragments.highlight(
    {
      color,
      renderedFaces: FRAGS.RenderedFaces.ONE,
      opacity: 1,
      transparent: false,
    },
    modelIdMap,
  );

  await fragments.core.update(true);

  onItemSelected();
};

/* MD
  :::warning Attention!

  In this example, we are directly using `fragments.highlight` for demonstration purposes. However, the recommended approach is to utilize the Highlighter component. Please refer to the corresponding tutorial for detailed instructions.

  :::
  
  ### 🧩 Adding some UI (optional but recommended)
  We will use the `@thatopen/ui` library to add some simple and cool UI elements to our app. First, we need to call the `init` method of the `BUI.Manager` class to initialize the library:
*/

BUI.Manager.init();

/* MD
Now we will add some UI to play around with the actions in this tutorial. For more information about the UI library, you can check the specific documentation for it!
*/

const [panel, updatePanel] = BUI.Component.create<BUI.PanelSection, {}>((_) => {
  const onColorChange = ({ target }: { target: BUI.ColorInput }) => {
    color.set(target.color);
  };

  let nameLabel = BUI.html`<bim-label>There is no item name to display.</bim-label>`;
  if (attributes && "value" in attributes.Name) {
    nameLabel = BUI.html`<bim-label>${attributes.Name.value}</bim-label>`;
  }

  const onClearColors = async ({ target }: { target: BUI.Button }) => {
    target.loading = true;
    await fragments.resetHighlight();
    await fragments.core.update(true);
    target.loading = false;
  };

  return BUI.html`
    <bim-panel active label="Raycasters Tutorial" class="options-menu">
      <bim-panel-section label="Controls">
        <bim-label>Double Click: Colorize element</bim-label>
        <bim-color-input @input=${onColorChange} color=#${color.getHexString()}></bim-color-input>
        <bim-button label="Clear Colors" @click=${onClearColors}></bim-button>
      </bim-panel-section>
      <bim-panel-section label="Item Data">
        ${nameLabel}
      </bim-panel-section>
    </bim-panel>
  `;
}, {});

onItemSelected = () => updatePanel();

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
  That's it! Now you're able to pick objects in the scene using raycasting. Congratulations! Keep exploring more tutorials in the documentation to enhance your skills further.
*/
