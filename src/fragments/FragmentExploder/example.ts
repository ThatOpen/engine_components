import * as THREE from "three";
import Stats from "stats.js";
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
cameraComponent.controls.setLookAt(10, 5, 10, -5, 0, -3);

components.raycaster = new OBC.SimpleRaycaster(components);

components.init();

rendererComponent.postproduction.enabled = true;
const scene = components.scene.get();

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

  ### 💣 Breaking down Model Dynamically

  You may have previously used the Simple Clipper component to dismantle a 3D models.

  Although Simple Clipper is fantastic for dissecting,
  there may be instances when you need to inspect the model while keeping it intact.🔧

  At such times, Fragment Exploder is useful for giving you an exploded view of all the Elements inside the BIM Model.

  :::tip First, let's set up a simple scene!

  👀 If you haven't started there, check out [that tutorial first](SimpleScene.mdx)!

  :::

  This tutorial will show you how to use **Fragment Exploder** for exploring BIM Models in detail.👓

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

  :::info Showing Fragments in the Scene

  🏔️ There is a dedicated tutorial on how to use Fragment Manager to load **IFC files**, checkout [that tutorial here](FragmentManager.mdx)!

  :::

  ### 🗂️ Strategically Classifying Fragments

  In this tutorial, we will deconstruct the model into floors. But before we explode them, we need to classify them by floor.

  For breaking down the model in the required way, we'll utilize [**FragmentClassifier**](../api/classes/components.FragmentClassifier).

  */

const classifier = new OBC.FragmentClassifier(components);

/* MD

  #### Getting Properties

  Fragment Classifier requires model properties that will help the classifier in identifying the floors included inside the Fragment.🧮
  We will fetch the properties from `json` file and store it in `model.properties`.

  */

const properties = await fetch("../../../resources/small.json");
model.setLocalProperties(await properties.json());

/* MD

  Now that we have the properties, we will pass the model to classifier and use `classifier.byStorey()` which will group the Fragments according to Floors.

*/
classifier.byStorey(model);

/* MD

  ### 💥 Exploding the Fragment

  Now that we've completed the setup, we'll use the `FragmentExploder` and send the **fragment** and **classifier** data to it.

  Our Fragment Exploder is now complete, and we can simply explode the model by calling [`exploder.explode()`](../api/classes/components.FragmentExploder.explode).💪

  */

const exploder = new OBC.FragmentExploder(components);

/* MD

  ### 🌡️ Screen Culling for Better Performance

  We will also add [Screen Culler](../api/classes/components.ScreenCuller) which will enhance the performance of our
  BIM App by removing Fragment elements that are not in our viewing area.

  */

const culler = new OBC.ScreenCuller(components);
culler.setup();

container.addEventListener(
  "mouseup",
  () => (culler.elements.needsUpdate = true),
);
container.addEventListener("wheel", () => (culler.elements.needsUpdate = true));

for (const fragment of model.items) {
  culler.elements.add(fragment.mesh);
}

culler.elements.needsUpdate = true;

/* MD

  :::info Culling unnecessary Fragments

  🚅 If you're wondering how to add Screen Culler to your BIM app, we have a dedicated tutorial for it! Checkout [that tutorial here](ScreenCuller.mdx)!

  :::

  **Congratulations** 🎉 on completing this tutorial!
  Your BIM App now has the power to deconstruct a model on a single click using **[Fragment Exploder](../api/classes/components.FragmentExploder)**😎
  Let's keep it up and check out another tutorial! 🎓

  */

const toolbar = new OBC.Toolbar(components);
toolbar.addChild(exploder.uiElement.get("main"));
components.ui.addToolbar(toolbar);

// Set up stats
const stats = new Stats();
stats.showPanel(2);
document.body.append(stats.dom);
stats.dom.style.left = "0px";
stats.dom.style.right = "auto";

rendererComponent.onBeforeUpdate.add(() => stats.begin());
rendererComponent.onAfterUpdate.add(() => stats.end());
