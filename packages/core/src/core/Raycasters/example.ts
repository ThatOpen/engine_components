/* MD
### 🐁 Picking things with the mouse
---

In this tutorial you'll learn how to use the Raycaster to pick objects in the scene with the mouse.

:::tip What's ray casting?

Ray casting is the process of casting a ray from a point in space to another point in space. We will cast a ray from the mouse position to the 3D world and check if there is an object in its way. That way, when you hover or click on an object, we can know which one it is and do something with it.

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

world.camera.controls.setLookAt(10, 10, 10, 0, 0, 0);

world.scene.setup();

/* MD

  We'll make the background of the scene transparent so that it looks good in our docs page, but you don't have to do that in your app!

*/

world.scene.three.background = null;

/* MD
  ### 🧊 Adding some cubes to the scene
  ---

  Now we will add some cubes to the scene and create some materials. The idea for this app is simple: when you click on a cube, it will change its color to green.

*/

const cubeMaterial = new THREE.MeshStandardMaterial({ color: "#6528D7" });
const greenMaterial = new THREE.MeshStandardMaterial({ color: "#BCF124" });

const boxGeometry = new THREE.BoxGeometry(3, 3, 3);

const cube1 = new THREE.Mesh(boxGeometry, cubeMaterial);
const cube2 = new THREE.Mesh(boxGeometry, cubeMaterial);
const cube3 = new THREE.Mesh(boxGeometry, cubeMaterial);
world.scene.three.add(cube1, cube2, cube3);
const cubes = [cube1, cube2, cube3];

cube2.position.x = 5;
cube3.position.x = -5;

/* MD
  To make this more interesting, we will add a rotation to the cubes. We can do it by subscribing to the `onBeforeUpdate` event of the world, which fires 60 times per second.
*/

const oneDegree = Math.PI / 180;

function rotateCubes() {
  cube1.rotation.x += oneDegree;
  cube1.rotation.y += oneDegree;
  cube2.rotation.x += oneDegree;
  cube2.rotation.z += oneDegree;
  cube3.rotation.y += oneDegree;
  cube3.rotation.z += oneDegree;
}

world.renderer.onBeforeUpdate.add(rotateCubes);

/* MD
  ### ⚡ Setting up the raycaster
  ---

  Next, we will set up the raycaster. We will use the `Raycasters` component. Instead of instantiating it, we will get it from the `components` object, which is usually safer, as all components are meant to be singletons.
*/

const casters = components.get(OBC.Raycasters);

/* MD
  Each raycaster is bound to a specific world. In this case, we will get the raycaster from the `world` we are using for our scene:
*/

const caster = casters.get(world);

/* MD
  Finally, we will subscribe to the mousemove event of the window. We will use the `castRay` method of the raycaster to find out if the mouse is over a cube. If it is, we will change its color to green. Otherwise, we will change its color to the original color.
*/

let previousSelection: THREE.Mesh | null = null;

window.onmousemove = () => {
  const result = caster.castRay(cubes);
  if (previousSelection) {
    previousSelection.material = cubeMaterial;
  }
  if (!result || !(result.object instanceof THREE.Mesh)) {
    return;
  }
  result.object.material = greenMaterial;
  previousSelection = result.object;
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

  That's it! We have created a simple app that uses the Raycaster to pick objects in the scene with the mouse. Easy, right? Now you can allow your users to interact with your 3D world.

*/
