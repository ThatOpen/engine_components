/* MD
### 🚅 Managing Performance
---

There are occasions when your scene has too many objects. Multiple objects being rendered simultaneously **lengthens computation time**⌛️ and **degrades performance**.🌡️ In this tutorial, we will use **ScreenCuller** to improve performance by reducing unnecessary computations.🚀


:::tip What's "culling"?

Culling is a process where we hide some objects of the scene. In this case, we'll hide objects that are not visible, either because they are outside of the scope of the camera, or because there are other objects in front of them, hiding them from the camera. The goal is simple: only compute the objects visible by the camera. This is great in BIM models, because we generally don't want to see ALL the objects at the same time.

:::

In this tutorial, we will import:

- `Three.js` to get some 3D entities for our app.
- `@thatopen/components` to set up the barebone of our app.
- `Stats.js` (optional) to measure the performance of our app.

*/

import * as THREE from "three";
import Stats from "stats.js";
import * as OBC from "@thatopen/components";

/* MD
  ### 🌎 Setting up a simple scene
  ---

  We will start by creating a simple scene with a camera and a renderer. If you don't know how to set up a scene, you can check the Worlds tutorial.

*/

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

  We'll make the background of the scene transparent so that it looks good in our docs page, but you don't have to do that in your app!

*/

world.scene.three.background = null;

/* MD

  ### 🧰 Creating Screen Culler
  ---
  Although adding Screen Culler to your project can appear difficult, it is actually very easy. We just need to get the `Cullers` component and create a new instance of `ScreenCuller`. Remember that although you can instance the Cullers component, it's better to get it from the `components` object, as all the components are meant to be singletons within a Component instance, and this ensures that.

  */

const cullers = components.get(OBC.Cullers);
const culler = cullers.create(world);

/* MD
  You can use the `threshold` property to control the minimum size of an element in screen in order for it to be revealed by the culler. Higher numbers result in less objects visible, but more performance:
*/

culler.threshold = 200;

/* MD
  Additionally, we will activate the `culler.renderDebugFrame` so that we can see the 2D screen of the elements that are not occluded. We will get the **domElement** and attach it to the body so that we can see this frame in real-time. To see it in your app, just comment out the `debugFrame.style.visibility = "collapse";` line.
*/

culler.config.renderDebugFrame = true;
const debugFrame = culler.renderer.domElement;
document.body.appendChild(debugFrame);
debugFrame.style.position = "fixed";
debugFrame.style.left = "0";
debugFrame.style.bottom = "0";
debugFrame.style.visibility = "collapse";

/* MD

  ### 🧱 Adding a ton of cubes

  We'll add the Simple 3D Cube and do it **300 times**!🤯 We'll generate box geometry and use Lambert material.
*/

const cubes: THREE.Mesh[] = [];
const geometry = new THREE.BoxGeometry(2, 2, 2);
const material = new THREE.MeshLambertMaterial({ color: "#6528D7" });

/* MD
  :::info Randomising the Cubes Placement

  We'll write a quick **utility** function that returns a random number between 0 and the specified upper limit. You can use this for a variety of purposes, but for this tutorial it will be used to generate random positions for cubes that we will add later to our scene.📌

  :::

*/

function getRandomNumber(limit: number) {
  return Math.random() * limit;
}

/* MD
  Now, using the `getRandomNumber()` method we previously created, we will add the 300 **`cube`** meshes to our scene at random positions. We'll add the cube to the scene and adjust its position between 0 and 10.

  Additionally, we will add meshes to the `culler` object, which will help the culler  recognize and draw the elements that are visible to the camera, which can be done with the culler's `add()` method.
*/

function regenerateCubes() {
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

regenerateCubes();

/* MD
  ### 🔄️ Updating the Culler

  Here comes the most crucial part! The core aim of **ScreenCuller** is to output just those components that are visible to the camera.

  
  :::info How often should you update the culler?

  It depends on the experience you are looking for. Naturally, the most often you update it, the faster your user will discover new objects that were hidden before, but that also means that your app will be less performant.

  :::

  In this tutorial we are updating it each time the camera stops moving, which generally works well for most apps.
*/

culler.needsUpdate = true;
world.camera.controls.addEventListener("controlend", () => {
  culler.needsUpdate = true;
});

/* MD
  ### ⏱️ Measuring the performance (optional)
  ---

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
  Great job! 🎉 Now you know how to optimise your 3D scene using a
  **Screen Culler** component! Your BIM app will now have unmatched performance and can render huge scenes easily. 
*/
