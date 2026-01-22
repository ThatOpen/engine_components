/* MD
  ## 🔦 Highlighting Items
  ---
  In 3D apps, users get some feedback when they hover or click on an object. Generally, it changes its color or shading. In this tutorial, you'll learn how to do that with the highlighter.

  :::tip Highlighting?

  Highlighting means changing the color of one or many objects to make them stand out. This can be used for hovering, for selection, for bringing the attention of the user to certain items, etc.

  :::

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
  ### ✨ Using The Highlighter Component
  Next, we'll configure the highlighter component. The setup process is straightforward and can be done as follows:
*/

components.get(OBC.Raycasters).get(world);

const highlighter = components.get(OBF.Highlighter);
highlighter.setup({
  world,
  selectMaterialDefinition: {
    // you can change this to define the color of your highligthing
    color: new THREE.Color("#bcf124"),
    opacity: 1,
    transparent: false,
    renderedFaces: 0,
  },
});

/* MD
  The highlighter creates a built-in "select" type by default, which activates when the user clicks on an object. Selected elements change color to indicate selection and can be deselected automatically. You can listen for selection or deselection events to perform additional actions, such as retrieving element information. Let's proceed as follows:
*/

// You can handle the event callback as needed.
// For example, here we retrieve the attributes of the selected items.
highlighter.events.select.onHighlight.add(async (modelIdMap) => {
  console.log("Something was selected");

  const promises = [];
  for (const [modelId, localIds] of Object.entries(modelIdMap)) {
    const model = fragments.list.get(modelId);
    if (!model) continue;
    promises.push(model.getItemsData([...localIds]));
  }

  const data = (await Promise.all(promises)).flat();
  console.log(data);
});

highlighter.events.select.onClear.add(() => {
  console.log("Selection was cleared");
});

/* MD
  Pretty cool, right? But there's more! 
  
  ### 🎨 Creating Custom Highlights
  The highlighter component allows you to create additional highlighters to customize the color of items as needed. For instance, you might want to change colors based on specific attributes or any criteria you choose. The first step is to define the highlighter style:
*/

const customHighlighterName = "Red";

highlighter.styles.set(customHighlighterName, {
  color: new THREE.Color("red"),
  opacity: 1,
  transparent: false,
  renderedFaces: 0,
});

// You can also listen to highligth events
// with custom styles
highlighter.events[customHighlighterName].onHighlight.add((map) => {
  console.log("Highligthed with red", map);
});

highlighter.events[customHighlighterName].onClear.add((map) => {
  console.log("Red highlighter cleared", map);
});

/* MD
  The select highlighter takes precedence over custom highlighters. When an item is colorized with a custom highlighter and then selected, it will display the select highlighter's color until deselected. Let's create a function to apply the custom highlighter to selected elements and observe this behavior.
*/

const applyCustomHighlight = async () => {
  if (!highlighter.styles.has(customHighlighterName)) return;
  const selection = highlighter.selection.select;
  if (OBC.ModelIdMapUtils.isEmpty(selection)) return;
  await highlighter.highlightByID(customHighlighterName, selection, false);

  // If you want the selection to become empty after it is colorized
  // with the custom highlighter, add the following code:
  // await highlighter.clear("select");
};

/* MD
  Let's also create a function to clear the custom highlighter, allowing the items to return to their original color (unless they are selected):
*/

const resetCustomHighlighter = async (onlySelected = true) => {
  if (!highlighter.styles.has(customHighlighterName)) return;
  const modelIdMap = highlighter.selection.select;
  await highlighter.clear(
    customHighlighterName,
    onlySelected ? modelIdMap : undefined,
  );

  // Just for demo purposes, let's also deselect the elements
  await highlighter.clear("select");
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
  return BUI.html`
    <bim-panel active label="Highlighter Tutorial" class="options-menu">
      <bim-panel-section label="Controls">
        <bim-label>Click: single-selection</bim-label>
        <bim-label>Ctrl + click: multi-selection</bim-label>
      </bim-panel-section>
      <bim-panel-section label="Actions">
        <bim-label style="white-space: normal; width: 14rem;">Select some items, click the apply button, and then deselect them again to see the color applied</bim-label>
        <bim-button @click=${applyCustomHighlight} label="Apply ${customHighlighterName}"></bim-button>
        <bim-label style="white-space: normal; width: 14rem;">Select some item colored with red and apply the button. Then, deselect it to </bim-label>
        <bim-button @click=${resetCustomHighlighter} label="Reset ${customHighlighterName}"></bim-button>
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
  That's it! Now you're able to highlight objects in your 3D scene, customize highlight styles, and interact with selections using the highlighter component. Congratulations! Keep going with more tutorials in the documentation.
*/
