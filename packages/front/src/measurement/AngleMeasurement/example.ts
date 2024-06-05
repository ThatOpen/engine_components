/* MD
### 📐 Measuring angles
---

Space control is one of the most important elements of BIM applications. In this tutorial, you'll learn how to expose an angle measurement tool to your end users.

We will import:

- `three` to create some 3D items.
- `@thatopen/components` to set up the barebone of our app.
- `@thatopen/components-front` to use some frontend-oriented components.
- `Stats.js` (optional) to measure the performance of our app.
*/

import * as THREE from "three";
import * as OBC from "@thatopen/components";
import * as OBCF from "@thatopen/components-front";
import Stats from "stats.js";

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
  OBCF.PostproductionRenderer
>();

world.scene = new OBC.SimpleScene(components);
world.renderer = new OBCF.PostproductionRenderer(components, container);
world.camera = new OBC.SimpleCamera(components);

components.init();

world.camera.controls.setLookAt(5, 5, 5, 0, 0, 0);

world.scene.setup();

const grids = components.get(OBC.Grids);
grids.create(world);

/* MD

  We'll make the background of the scene transparent so that it looks good in our docs page, but you don't have to do that in your app!

*/

world.scene.three.background = null;

/* MD
  ### 🎲 Creating a Cube Mesh
  ---
  For this tutorial we will use a Cube, you can add any geometry as per your preference. We will create a [Cube](https://threejs.org/docs/index.html?q=box#api/en/geometries/BoxGeometry) with `3x3x3` dimensions and use red color for the material.
*/

const cubeGeometry = new THREE.BoxGeometry(3, 3, 3);
const cubeMaterial = new THREE.MeshStandardMaterial({ color: "#6528D7" });
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.set(0, 1.5, 0);
world.scene.three.add(cube);
world.meshes.add(cube);

/* MD 
  ### 🛠️ Getting the angle measurements
  ---
  
  First, let's get an instance of the angle measurement component and initialize it:
*/

const angles = components.get(OBCF.AngleMeasurement);
angles.world = world;
angles.enabled = true;

/* MD
  ### 🖱️ Setting up mouse events
  ---

  Now, we'll define how to create the angle dimensions. In this case, we'll keep it simple and use the double click event of the container HTML element.

*/

container.ondblclick = () => angles.create();

/* MD
  
  ### 🧹 Deleting the Dimensions
  ---

  Now that we know how to make multiple dimensions, we'll learn how to delete them when necessary. Dimensions can be removed using the `deleteAll()` method, which deletes all the created dimensions. Again, we'll keep it simple and bind this event to the keydown event. Specifically, it will fire when the user presses the `Delete` or `Backspace` key.
*/

window.onkeydown = (event) => {
  if (event.code === "Delete" || event.code === "Backspace") {
    angles.deleteAll();
  }
};

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
  ### 🎉 Wrap up
  ---

  That's it! You have created an app that can create and delete angular dimensions on any 3D object. Congratulations!
*/