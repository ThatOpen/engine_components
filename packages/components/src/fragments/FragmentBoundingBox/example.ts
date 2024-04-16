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
cameraComponent.controls.setLookAt(30, 30, 30, 0, 0, 0);

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
rendererComponent.postproduction.customEffects.excludedMeshes.push(gridMesh);

/* MD
  ### 🧳 Gathering BIM Data
  ---

  Fragment help you to render your BIM files faster than ever.🚅 [**Fragment**](https://github.com/ThatOpen/engine_fragment) is a group of `FragmentMeshes`
  which are clubbed together to visualize the BIM model.

  When working with **large** BIM models, you may need to quit the navigation to see the whole model.📌
  To accomplish this, we must extract Mesh data from the Fragment and use `control` APIs to display the complete Fragment.

  :::tip First, let's set up a simple scene!

  👀 If you haven't started there, check out [that tutorial first](SimpleScene.mdx)!

  :::

  For this tutorial, we'll use the `FragmentBoundingBox` component, which will provide us with the **mesh** by using the Fragment Model.

  ### 🧩 Adding Fragments
  ---
  We'll start by adding a **Fragment** to our scene using **[FragmentManager](../api/classes/components.FragmentManager)**.

  We'll use a simple fragment for the purposes of this tutorial, but the code is capable of handling big files as well.🏗️

    */

const fragments = new OBC.FragmentManager(components);

const file = await fetch("../../../resources/small.frag");
const data = await file.arrayBuffer();
const buffer = new Uint8Array(data);
const model = await fragments.load(buffer);

/* MD
  ### 🎲 Creation of Bounding Boxes
  ---

  Now that our setup is done, lets see how you can use **[`FragmentBoundingBox()`](../api/classes/components.FragmentBoundingBox)**.

  You will be amazed to see how easy it is to create [bounding box](https://threejs.org/docs/?q=bound#api/en/math/Box3) using **components**.💪

  We will use `OBC.FragmentBoundingBox()` and add the Fragment model to it using `add(model)`.

    */

const fragmentBbox = new OBC.FragmentBoundingBox(components);
fragmentBbox.add(model);

/* MD

  #### 👓 Reading the Mesh Data

  After adding the model, we can now read the mesh from bounding box using **`getMesh()`**

  */
const bbox = fragmentBbox.getMesh();
fragmentBbox.reset();

/* MD

  ### ⏏️ Creating a Toolbar for Navigating the Model
  ---
  We'll make a **Toolbar Component** and set it at the bottom.
  In addition, we will add a **zoom in** button to this toolbar that will be used to zoom in at the BIM Model.

  */

const toolbar = new OBC.Toolbar(components, { position: "bottom" });
components.ui.addToolbar(toolbar);
const button = new OBC.Button(components);
button.materialIcon = "zoom_in_map";
button.tooltip = "Zoom to building";
toolbar.addChild(button);

/* MD

  :::tip Simplistic and Powerful Toolbar!

  🎛️ We have a dedicated tutorial on how to implement **Toolbar**, check **[Toolbar and UIManager](UIManager.mdx)** tutorial if you have any doubts!

  :::

  ### 🎮 Managing Zoom Events
  ---

  Now that all the setup is done, we need to trigger the zoom event on a button click.🖱

  We will use `fitToSphere` from **[camera.controls](../api/classes/components.SimpleCamera#controls)**,
  which takes the `mesh` as a parameter and zooms to it.

  Also, we will enable a nice transition effect while zooming to the mesh by setting the last parameter as **true**

  */

const controls = cameraComponent.controls;
button.onClick.add(() => {
  controls.fitToSphere(bbox, true);
});

/* MD

  **Congratulations** 🎉 on completing this short yet useful tutorial!
  You can now easily zoom to Fragment **Mesh** using **[FragmentBoundingBox](../api/classes/components.FragmentBoundingBox)**😎
  Let's keep it up and check out another tutorial! 🎓

  */

// Set up stats
const stats = new Stats();
stats.showPanel(2);
document.body.append(stats.dom);
stats.dom.style.left = "0px";
stats.dom.style.right = "auto";

rendererComponent.onBeforeUpdate.add(() => stats.begin());
rendererComponent.onAfterUpdate.add(() => stats.end());
