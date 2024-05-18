import * as THREE from "three";
// eslint-disable-next-line import/no-extraneous-dependencies
import Stats from "stats.js";
import * as OBC from "../..";

const container = document.getElementById("container")!;

const components = new OBC.Components();

const worlds = components.get(OBC.Worlds);
const world = worlds.create<
  OBC.SimpleScene,
  OBC.SimpleCamera,
  OBC.SimpleRenderer
>();

world.scene = new OBC.SimpleScene(components);
world.renderer = new OBC.SimpleRenderer(components, container);
world.camera = new OBC.SimpleCamera(components);

components.init();

world.camera.controls.setLookAt(13, 13, 13, 0, 0, 0);

world.scene.setup();

const grids = components.get(OBC.Grids);
grids.create(world);

/* MD

  ### 🚅 Managing Performance
  ---
  There are occasions when your scene has too many components.
  Multiple components being rendered simultaneously **lengthens computation time**⌛️ and **degrades performance**.🌡️

  :::tip First, let's set up a simple scene!

  👀 If you haven't started there, check out [that tutorial first](SimpleScene.mdx)!

  :::

  In this tutorial, we will use **ScreenCuller** to improve performance by reducing unnecessary computations.🚀
  This tutorial will show you how to manage a complex scenario with a lot of elements in an effective way.🦾

  ### 🧰 Creating Screen Culler
  ---
  Although adding Screen Culler to your project can appear difficult, it is actually rather easy.
  Now, we will add **Screen Culler Component**.
  This will create a Screen Culler which is now ready to be used.

  */

const cullers = new OBC.Cullers(components);
const culler = cullers.create(world);

/* MD

  You can also use the `threshold` property to control the minimum size of an element in screen in order
  for it to be revealed by the culler. Higher numbers result in less objects visible, but more performance:

  */

culler.threshold = 200;

/* MD

  Additionally, we will activate the `culler.renderDebugFrame`
  so that we can see the 2D screen of the elements that are not occluded.💻
  Also, we will get the **domElement** and attach it to the body so that we can see this frame in real-time.📊

  */

culler.renderDebugFrame = true;
const debugFrame = culler.renderer.domElement;
document.body.appendChild(debugFrame);
debugFrame.style.position = "fixed";
debugFrame.style.left = "0";
debugFrame.style.bottom = "0";
debugFrame.style.visibility = "collapse";

/* MD

  :::info Randomising the Cube Placement

  We'll write a quick **utility** function that returns a random number between 0 and the specified upper limit.
  You can use this for a variety of purposes, but for this tutorial
  it will be used to generate random positions for cube placement.📌

  :::

  */

function getRandomNumber(limit: number) {
  return Math.random() * limit;
}

/* MD

  ### 🧱 Adding a lot of 3D Objects

  We'll add the Simple 3D Cube and do it **300 times**!🤯
  Components are built using [Three.js](https://threejs.org/), making it simple to use any three.js code.
  For our cube, we'll generate box geometry and use basic material.
  */

const cubes: THREE.Mesh[] = [];
const geometry = new THREE.BoxGeometry(2, 2, 2);
const material = new THREE.MeshLambertMaterial({ color: "#6528D7" });

/* MD

  #### 🧪 Generate Multiple Cubes
  Now, using the `getRandomNumber()` method we previously created, we will add the 300 **`cube`** meshes to our scene
  and randomly position them. We'll add the cube to the scene and adjust its position between 0 and 10.

  Additionally, we will add meshes to the `culler` object, which will help **SimpleCuller** to recognize and
  draw the elements that are visible to the camera. To do this, **`culler.add(cube)`** will be used.

  Also, now that we can create multiple cubes, we will write a function to remove the cubes from scene on demand.
  `resetCubes()` iteratively removes the **cubes** using [**`cube.removeFromParent`**](https://threejs.org/docs/index.html?q=obje#api/en/core/Object3D.removeFromParent).

  */

function resetCubes() {
  for (const cube of cubes) {
    cube.removeFromParent();
  }
  cubes.length = 0;
}

function regenerateCubes() {
  resetCubes();
  for (let i = 0; i < 300; i++) {
    const cube = new THREE.Mesh(geometry, material);
    cube.position.x = getRandomNumber(10);
    cube.position.y = getRandomNumber(10);
    cube.position.z = getRandomNumber(10);
    cube.updateMatrix();
    world.scene.three.add(cube);
    culler.add(cube);
    cubes.push(cube);
  }
}

/* MD

  #### 📢 Rendering Cubes
  With everything ready, we will call `regenerateCubes()` which will generate cubes and add them to scene.

  */
regenerateCubes();

/* MD

  Here comes the most crucial part! The core aim of **ScreenCuller** is to output just those components that are
  visible to the camera.

  `culler.needsUpdate = true` instructs the ScreenCuller to render the updated view.

  ** Remember to update culler every time the camera is updated ❕ **

  In this tutorial we are updating it each time the camera stops moving.
  */

culler.needsUpdate = true;
world.camera.controls.addEventListener("controlend", () => {
  culler.needsUpdate = true;
});

/* MD

  Great job! 🎉 Now you know how to optimise your 3D scene using a
  **Screen Culler** component! 💪
  Your BIM app will now have unmatched performance and can render huge scenes easily. 🚀
  Let's keep it up and check out another tutorials!
  */

const stats = new Stats();
stats.showPanel(2);
document.body.append(stats.dom);
stats.dom.style.left = "0px";
world.renderer.onBeforeUpdate.add(() => stats.begin());
world.renderer.onAfterUpdate.add(() => stats.end());
