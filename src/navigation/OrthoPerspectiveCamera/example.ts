// Set up scene (see SimpleScene tutorial)

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

components.raycaster = new OBC.SimpleRaycaster(components);

const scene = components.scene.get();

const directionalLight = new THREE.DirectionalLight();
directionalLight.position.set(5, 10, 3);
directionalLight.intensity = 0.5;
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight();
ambientLight.intensity = 0.5;
scene.add(ambientLight);

/* MD
  ### 📽️ Managing Multiple Views
  ---
  Perspective view adds depth and realism, which helps in creating visually compelling representations in 3D scenes.🛤️
  While, Orthographic view is important for precise measurements and proportions.📐

  :::tip First, let's set up a simple scene!

  👀 If you haven't started there, check out [that tutorial first](SimpleScene.mdx)!

  :::

  We'll be using an advanced camera component for this tutorial.
  OrthoPerspectiveCamera makes it simple to use Orthographic and Perspective projections.

  ### 🎲 Creating a Cube Mesh
  ---
  First, let's create a simple Cube, which will render differently depending on the projection you choose.🧊
  We will create a [Cube](https://threejs.org/docs/index.html?q=box#api/en/geometries/BoxGeometry)
  with `3x3x3` dimensions and use red color for the material.🖍️

  */

const cubeGeometry = new THREE.BoxGeometry(3, 3, 3);
const cubeMaterial = new THREE.MeshStandardMaterial({ color: "#6528D7" });
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.set(0, 1.5, 0);

/* MD
  
  Now, we will add the Cube to the `Scene`. We must also add the **cube** to `components.meshes`,
  which is simply an array of all the meshes in the Scene 🗄️.

  **`components.meshes`** acts as a store to help you manage your elements centrally.

  */
scene.add(cube);
components.meshes.add(cube);

/* MD
  ### 🎞️ Developing an OrthoPerspective Camera
  ---

  We will create OrthoPerspectiveCamera by passing `components` as an argument to it.🗃️
  The OrthoPerspective Camera extends the SimpleCamera by providing you with extra controls.

  We will then configure the camera location and update the look at target using `setLookAt()` API.👀

  */

const cameraComponent = new OBC.OrthoPerspectiveCamera(components);
components.camera = cameraComponent;
cameraComponent.controls.setLookAt(10, 10, 10, 0, 0, 0);
components.init();
const grid = new OBC.SimpleGrid(components);

/* MD
  
  :::info Igniting Components!

  🔥 Whenever the components like scene, camera are created, you need to initialize the component library.
  Check out components.init() for more info!🔖

  :::

  ### 🕹️ Changing Views and Navigation
  ---
  Now, that our camera setup is done, we need to manage the camera projection on demand.

  #### Toggling Orthographic View and Perspective View

  Let's create a simple method **`toggleProjection()`** which toggles the Camera View using `camera.toggleProjection`.
  Alternatively, you can also use `camera.setProjection()` and pass `'Orthographic'` or `'Perspective'` to manage the views.💡

  */

// @ts-ignore
function toggleProjection() {
  cameraComponent.toggleProjection();
}

/* MD
    You can also subscribe to an event for when the projection changes. For instance, let's change the grid fading mode
    when the projection changes. This will make the grid look good in orthographic mode:
    */

cameraComponent.projectionChanged.add(() => {
  const projection = cameraComponent.getProjection();
  grid.fade = projection === "Perspective";
});

/* MD
  #### Managing Navigation Modes
  Along with projection, we can also manage Navigation modes using **OrthoPerspective** camera.
  To update navigation modes, we will use `camera.setNavigationMode('Orbit' | 'FirstPerson' | 'Plan')`

  - **Orbit** - Orbit Mode helps us to easily navigate around the 3D Elements.
  - **FirstPerson** - It helps you to visualize scene from your own perspective.
  First Person mode is only available for Perspective Projection.
  - **Plan** - This mode helps you to easily navigate in 2D Projections.

  */

// @ts-ignore
function setNavigationMode(navMode: OBC.NavModeID) {
  cameraComponent.setNavigationMode(navMode);
}

/* MD
  :::info MORE CONTROLS, MORE POWER

  🧮 OrthoPerspective Camera also provides you an option to adjust your camera to fit the 3D elements.
  You can simply use fitModelToFrame(mesh)
  and provide the mesh which you want to fit to your window frame

  :::

  **Congratulations** 🎉 on completing this tutorial!
  Now you can add Advance Camera System to your web-app in minutes using
  **OrthoPerspectiveCamera** ⌚📽️
  Let's keep it up and check out another tutorial! 🎓

  */

const mainToolbar = new OBC.Toolbar(components, {
  name: "Main Toolbar",
  position: "bottom",
});
components.ui.addToolbar(mainToolbar);
mainToolbar.addChild(cameraComponent.uiElement.get("main"));

// Set up stats
const stats = new Stats();
stats.showPanel(2);
document.body.append(stats.dom);
stats.dom.style.left = "0px";
rendererComponent.onBeforeUpdate.add(() => stats.begin());
rendererComponent.onAfterUpdate.add(() => stats.end());
