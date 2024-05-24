/* MD

### 🕸️ Adding a fancy grid to our scene 
---

In this tutorial you'll learn how to add a fancy grid to your scene. It's super easy and will make your app look much more professional!

:::tip Why a grid?

Grids are very common in 3D apps, and it's a great way to have a reference point for your users to navigate around, even when there are no visible objects around.

:::

In this tutorial, we will import:

- `Three.js` to get some 3D entities for our app.
- `@thatopen/components` to set up the barebone of our app.

*/

import * as THREE from "three";
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

const cube = new THREE.Mesh(new THREE.BoxGeometry());
world.scene.three.add(cube);

/* MD

  We'll make the background of the scene transparent so that it looks good in our docs page, but you don't have to do that in your app!

*/

world.scene.three.background = null;

/* MD
  ### 🕷️ Adding the grid to the world
  ---

  To add the grid to the world, we will use the `Grids` component. Instead of instantiating it, we will get it directly from the `components` object. Remember that all components are meant to be singletons. Then, we will call the `create` method to add a grid to the scene.

*/

const grids = components.get(OBC.Grids);
const grid = grids.create(world);
console.log(grid);

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

  Congratulations! You have created your first infinite grid in your 3D app. As you can see, it's super easy and it looks great!

*/
