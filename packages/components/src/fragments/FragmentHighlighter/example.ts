// Set up scene (see SimpleScene tutorial)

import * as THREE from "three";
import Stats from "stats.js";
// @ts-ignore
import * as dat from "three/examples/jsm/libs/lil-gui.module.min";
import * as OBC from "../..";

const container = document.getElementById("container")!;

const components = new OBC.Components();

const sceneComponent = new OBC.SimpleScene(components);
sceneComponent.setup();
components.scene = sceneComponent;

const rendererComponent = new OBC.PostproductionRenderer(components, container);
components.renderer = rendererComponent;

const cameraComponent = new OBC.SimpleCamera(components);
components.camera = cameraComponent;

components.raycaster = new OBC.SimpleRaycaster(components);

components.init();

rendererComponent.postproduction.enabled = true;

const scene = components.scene.get();

cameraComponent.controls.setLookAt(10, 10, 10, 0, 0, 0);

const directionalLight = new THREE.DirectionalLight();
directionalLight.position.set(5, 10, 3);
directionalLight.intensity = 0.5;
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight();
ambientLight.intensity = 0.5;
scene.add(ambientLight);

const grid = new OBC.SimpleGrid(components, new THREE.Color(0x666666));
const gridMesh = grid.get();
const effects = rendererComponent.postproduction.customEffects;
effects.excludedMeshes.push(gridMesh);

/* MD
  ### 🤏 Nudging Fragments
  ---

  Until now, you could add IFC files to your BIM App and render Fragments in your scene.

  In this lesson, we will show you how to select Fragment elements.

  This may appear to be an immense task but believe us when we say it will take less than 5 minutes to complete.🚀

  :::tip First, let's set up a simple scene!

  👀 If you haven't started there, check out [that tutorial first](SimpleScene.mdx)!

  :::

  #### Managing Fragments
  ---

  To deal with Fragments we will use `FragmentManager`, it will help us to render **Fragments** easily.💪

  */

const fragments = new OBC.FragmentManager(components);

/* MD

  :::tip 🏔️ Showing Fragments in the Scene

  Fragment Manager has its own tutorial, check out [that tutorial here](FragmentManager.mdx)!

  :::

  ### 📌 Selecting Fragments
  ---

  We will start by using [Fragment Highlighter](../api/classes/components.FragmentHighlighter),
  which needs reference of `component` and `fragments` to be provided to it.🧮

  Doing so, we will get an instance of **Fragment Highlighter** which will be used for our selection mechanism.

  */

const highlighter = new OBC.FragmentHighlighter(components);

const file = await fetch("../../../resources/small.frag");
const dataBlob = await file.arrayBuffer();
const buffer = new Uint8Array(dataBlob);
fragments.load(buffer);
highlighter.updateHighlight();

rendererComponent.postproduction.customEffects.outlineEnabled = true;
highlighter.outlineEnabled = true;

/* MD

  ### 🎨 Changing Highlight Appearance
  ---

  The beauty of **components** is it understands `three.js`,
  this will help us to instantly change the Highlight color for the Fragments selection.

  We will use **red** color and create a `MeshBasicMaterial`,
  which we will pass to the highlighter component using `highlighter.add()`.

  To remember the highlighter material created, we will pass first variable as the Highlighter Name.😎

    */

const highlightMaterial = new THREE.MeshBasicMaterial({
  color: "#BCF124",
  depthTest: false,
  opacity: 0.8,
  transparent: true,
});

highlighter.add("default", [highlightMaterial]);
highlighter.outlineMaterial.color.set(0xf0ff7a);

/* MD

  ### 🛎️ Getting Selection Events
  ---

  Now that we have our base setup ready, we will now implement the logic needed for selection of Fragment.
  Let's start by declaring a variable - `lastSelection` which will hold the **`fragment.id`** of the Fragment that was selected.

  Also, we define a variable which will convey Highlighter to only perform single selection and not multiple selection.🎯

    */

let lastSelection: Record<string, any>;

const singleSelection = {
  value: true,
};

/* MD

  #### Performing Highlighting On Click

  Now comes the exciting part: we will add an event listener to the **container** that will detect click events.🖱️

  When a click is detected, the function `highlightOnClick()` is called,
  which checks internally to see if the Fragment was present and returns the ID of the Fragment that was clicked on.📭

  To highlight the selection based upon the material you had created, you must pass the `Highlighter Name`.

    */

async function highlightOnClick() {
  const result = await highlighter.highlight("default", singleSelection.value);
  if (result) {
    lastSelection = {};
    for (const fragment of result.fragments) {
      const fragmentID = fragment.id;
      lastSelection[fragmentID] = [result.id];
    }
  }
}

container.addEventListener("click", () => highlightOnClick());

/* MD

    What if you need to highlight the item using Fragment ID?

    The same instance of Highlighter can be used to choose elements based on **Fragment ID**.🧩

    You can use `highlighter.highlightByID()` and provide an array of Fragment IDs to have the work done for you!

     */
function highlightOnID() {
  if (lastSelection !== undefined) {
    highlighter.highlightByID("default", lastSelection);
  }
}

/* MD

    **Congratulations** 🎉 on completing this tutorial! Now you can **Highlight** and perform **Selection** on any Fragment Model using
    **[Fragment Highlighter Component](../api/classes/components.FragmentHighlighter)** 🎨🖌️
    Let's keep it up and check out another tutorial! 🎓


     */
// Set up stats

const stats = new Stats();
stats.showPanel(2);
document.body.append(stats.dom);
stats.dom.style.left = "0px";
rendererComponent.onBeforeUpdate.add(() => stats.begin());
rendererComponent.onAfterUpdate.add(() => stats.end());

// Set up dat.gui menu

const commands = {
  highlight: "Click",
  highlightOnID: () => highlightOnID(),
};

const gui = new dat.GUI();

gui.add(commands, "highlight");
gui.add(commands, "highlightOnID").name("Select last selection");
gui.add(singleSelection, "value").name("Single selection");
gui.add(highlighter, "zoomToSelection").name("Zoom to selection");
gui.add(highlighter, "fillEnabled").name("Fill enabled");
gui.add(highlighter, "outlineEnabled").name("Outline enabled");
gui.addColor(highlightMaterial, "color").name("Fill color");
gui.addColor(highlighter.outlineMaterial, "color").name("Outline color");
gui
  .add(highlighter.outlineMaterial, "opacity")
  .name("Outline width")
  .min(0.3)
  .max(1)
  .step(0.05);
