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
rendererComponent.postproduction.customEffects.excludedMeshes.push(gridMesh);

/* MD
  ### 🏂 Navigate through BIM like Pro!
  ---

  BIM Models are large and contain a lot of attributes.
  It can become complicated to manage the elements and painfully difficult to navigate around.🌪

  Understanding spatial relationships is crucial during the design and evaluation processes.

  By having a MiniMap functionality for navigation it makes easier to collaborate and enhance the productivity,
  let's see how you can integrate MiniMap in your BIM App! 💥

  :::tip First, let's set up a simple scene!

  👀 If you haven't started there, check out [that tutorial first](SimpleScene.mdx)!

  :::

  For this tutorial, we'll use the [**MiniMap**](../api/classes/components.MiniMap) component to create
  a navigation functionality!

  ### 🧩 Adding Fragments
  ---

  We'll start by adding a **Fragment** to our scene using [**FragmentManager**](../api/classes/components.FragmentManager).

  We'll use a simple fragment for the purposes of this tutorial, but the code is capable of handling big files as well.🏗️

  */

const fragments = new OBC.FragmentManager(components);

const file = await fetch("../../../resources/small.frag");
const dataBlob = await file.arrayBuffer();
const buffer = new Uint8Array(dataBlob);
fragments.load(buffer);

/* MD

  :::info Showing Fragments in the Scene

  🏔️ There is a dedicated tutorial on how to use Fragment Manager to load **IFC files**, checkout [that tutorial here](FragmentManager.mdx)!

  :::

  ### 🗺 Integrating Spatial Wonders
  ---

  Now, that we have our setup ready. Let's start with the exciting stuff.
  We will use [**Mini Map**](../api/classes/components.MiniMap) component which does all the work for us.🔮

  When we create a **Mini Map**, a **Map** element is created at the `bottom-right` of your browser window.

  */

const map = new OBC.MiniMap(components);
components.ui.add(map.uiElement.get("canvas"));

/* MD

  #### 🎩 Controlling Maps like a wizard!
  ---
  MiniMap Component makes it easy to add **map** to your app, and it also provides much easier way to manage the **map**.

  You can set the scale for map using `map.zoom` or modify the size of **UI** element using `map.getSize()`,
  you can find out about more controls [**here**](../api/classes/components.MiniMap#implements) 🎛

  */

map.lockRotation = false;
map.zoom = 0.2;

/* MD

  **Congratulations** 🎉 on completing this short yet important tutorial!
  Now you can easily add navigation **Map** to your BIM Apps 🎯
  Let's keep it up and check out another tutorial! 🎓

  */

// Set up stats
const stats = new Stats();
stats.showPanel(2);
document.body.append(stats.dom);
stats.dom.style.left = "0px";
rendererComponent.onBeforeUpdate.add(() => stats.begin());
rendererComponent.onAfterUpdate.add(() => stats.end());

// gui

const gui = new dat.GUI();

const size = map.getSize();

gui.add(map, "enabled").name("Map enabled");
gui.add(map, "lockRotation").name("Lock rotation");
gui.add(map, "zoom").name("Zoom").min(0.01).max(0.5).step(0.01);
gui.add(map, "frontOffset").name("Front offset").min(0).max(10).step(0.5);
gui
  .add(size, "x")
  .name("Width")
  .min(100)
  .max(500)
  .step(10)
  .onChange(() => map.resize(size));
gui
  .add(size, "y")
  .name("Height")
  .min(100)
  .max(500)
  .step(10)
  .onChange(() => map.resize(size));
gui.addColor(map, "backgroundColor");
