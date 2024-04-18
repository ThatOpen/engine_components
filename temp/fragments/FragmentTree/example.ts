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

cameraComponent.controls.setLookAt(10, 10, 10, 0, 0, 0);

const grid = new OBC.SimpleGrid(components, new THREE.Color(0x666666));
rendererComponent.postproduction.customEffects.excludedMeshes.push(grid.get());

/* MD

  ### 🌲 Gathering Structured Insights
  ---

  Building Information Modeling comprises nesting elements in multiple hierarchies.
  Working with this information might become complicated and irritating.🤯

  **Tree-View** is extremely effective in managing this volume of data.
  Using **[Fragment Tree](../api/classes/components.FragmentTree)**, we have made it simple to generate a Tree-View for a fragment.🦾

  :::tip First, let's set up a simple scene!

  👀 If you haven't started there, check out [that tutorial first](SimpleScene.mdx)!

  :::

  In this lesson, we'll create a **Tree-View** for the items in the IFC file and zoom in on them when a node is clicked.

  ### 🧩 Adding Fragments
  ---
  We'll start by adding a **Fragment** to our scene using [**FragmentManager**](../api/classes/components.FragmentManager).

  We'll use a simple fragment for the purposes of this tutorial, but the code is capable of handling big files as well.🏗️

  */

const fragments = new OBC.FragmentManager(components);

const file = await fetch("../../../resources/small.frag");
const data = await file.arrayBuffer();
const buffer = new Uint8Array(data);
const model = await fragments.load(buffer);

/* MD

  ### 🕹 Selection of Fragments
  ---
  Whenever you click on a `node` in **Tree-View**, that particular element would be highlighted.

  To create the highlight mechanism, we will use **[Fragment Highlighter](../api/classes/components.FragmentHighlighter)**
  that manages the material and selection intuitively.

  */

const highlighter = new OBC.FragmentHighlighter(components);
highlighter.setup();

/* MD

  :::info Highlighting Fragments

  🖱Check out **[FragmentHighlighter.mdx](FragmentHighlighter.mdx)** for a detailed tutorial on how to utilize Fragment Highlighter to conduct selection on **IFC files**!

  :::

  #### Adding Aesthetic Outlines

  Now that highlighter setup is done, we will add a nice outline effect when the elements are selected.

  */

rendererComponent.postproduction.customEffects.outlineEnabled = true;
highlighter.outlineEnabled = true;

highlighter.updateHighlight();

/* MD

  ### 🗂️ Strategically Classifying Fragments

  In this tutorial, we will deconstruct the model in order to obtain a hierarchical view.💣
  To obtain a nested view, we must first classify them by **floors** and then by **type** entities.

  For breaking down the model in the required way, we'll utilize **[Fragment Classifier](../api/classes/components.FragmentClassifier)**.

  */

const classifier = new OBC.FragmentClassifier(components);

/* MD

  #### Getting Properties

  Fragment Classifier requires model properties that will help the classifier in identifying the floors and entities included inside the Fragment.🧮
  We will fetch the properties from `json` file and store it in `model.properties`.

  */

const properties = await fetch("../../../resources/small.json");
model.setLocalProperties(await properties.json());

/* MD

  Now that we have the properties, we will pass the model to classifier and use `classifier.byStorey()` which will group the Fragments according to Floors.

  The model then needs to be classified according to entities using `classifier.byEntity()`.🗂

  */

classifier.byStorey(model);
classifier.byEntity(model);

/* MD

  ### 🌱 Building Insightful Tree Views
  ---

  Now comes the interesting part, we will create **`FragmentTree`** using **components** and **classifier**.

  In addition, we will update the **Fragment Tree** to produce the Tree-View based on `storeys` and `entities`.

  */

const modelTree = new OBC.FragmentTree(components);
modelTree.init();

modelTree.update(["storeys", "entities"]);

/* MD

  #### 🛎️ Managing Tree-View Events
  ---

  We will zoom in on the element that is selected in the Tree-View and add a nice highlight effect when the user hovers over a tree node.🖱

  Let's use `modelTree.onSelected` to get the active selection from Fragment Tree, and we will use `highlighter.highlightByID()` to zoom in.🔍
  */

modelTree.onSelected.add(({ items, visible }) => {
  if (visible) {
    highlighter.highlightByID("select", items, true, true);
  }
});

modelTree.onHovered.add(({ items, visible }) => {
  if (visible) {
    highlighter.highlightByID("hover", items);
  }
});

/* MD

  #### 🎨 Rendering the Fragment Tree
  ---

  Now, that all the setup is done we will add the **Fragment Tree** to the **[Toolbar](../api/classes/components.Toolbar)**.

  We will use the `addChild()` method to pass the Fragment Tree data to the **Toolbar**

  🎛️ Check **[Toolbar and UIManager](./UIManager.mdx)** tutorial if you have any doubts!

  */

const toolbar = new OBC.Toolbar(components);
toolbar.addChild(modelTree.uiElement.get("main"));
components.ui.addToolbar(toolbar);

/* MD

  **Cheers and Congratulations** 🎉 on completing this short yet powerful tutorial!

  Now, you can provide a structured, navigable, and user-friendly interface to manage, explore, and interact with your BIM models.🥁

  Let's keep it up and check out another tutorial! 🎓

  */

const stats = new Stats();
stats.showPanel(2);
document.body.append(stats.dom);
stats.dom.style.left = "0px";
rendererComponent.onBeforeUpdate.add(() => stats.begin());
rendererComponent.onAfterUpdate.add(() => stats.end());
