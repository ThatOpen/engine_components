/* MD
### 🛣️ Navigating 3D infrastructures
---

Infra models are awesome, but they are usually very, very long and thin. This makes it a bit hard to navigate through them. Luckily for you, the alignment data that comes in IFC models is processed by our libraries and generated in 3D, so you can use it for navigation!

:::tip 3D alignment?

The alignment data in IFC usually comes in 2D (floor plan and elevation). We use that data to regenerate the 3D curve from those 2D representations. You'll see the result in just a moment!

:::

In this tutorial, we will import:

- `three` to create some 3D items.
- `@thatopen/components` to set up the barebone of our app.
- `@thatopen/components-front` to use some frontend-oriented components.
- `Stats.js` (optional) to measure the performance of our app.
*/

import * as THREE from "three";
import * as OBC from "@thatopen/components";
import Stats from "stats.js";
import * as OBCF from "@thatopen/components-front";

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
  OBCF.RendererWith2D
>();

world.scene = new OBC.SimpleScene(components);
world.renderer = new OBCF.RendererWith2D(components, container);
world.camera = new OBC.SimpleCamera(components);

components.init();

world.scene.setup();

world.camera.controls.setLookAt(5, 5, 5, 0, 0, 0);

container.appendChild(world.renderer.three2D.domElement);

const grids = components.get(OBC.Grids);
grids.create(world);

/* MD

  We'll make the background of the scene transparent so that it looks good in our docs page, but you don't have to do that in your app!

*/

world.scene.three.background = null;

/* MD
  ### 🧳 Loading a BIM model
  ---

 We'll start by adding a BIM model to our scene. That model is already converted to fragments, so it will load much faster than if we loaded the IFC file.

  :::tip Fragments?

    If you are not familiar with fragments, check out the IfcLoader tutorial!

  :::
*/

const fragments = components.get(OBC.FragmentsManager);

const file = await fetch(
  "https://thatopen.github.io/engine_components/resources/road.frag",
);

const data = await file.arrayBuffer();
const buffer = new Uint8Array(data);
const model = await fragments.load(buffer);
world.scene.three.add(model);

const properties = await fetch(
  "https://thatopen.github.io/engine_components/resources/road.json",
);

model.setLocalProperties(await properties.json());

/*
  ### 🚕 Setting up Civil 3D Navigator
  ---

  Now, we need to create an instance of the Civil 3D Navigator component. This will enable us to navigate through our 3D environment and interact with the model.
*/

const navigator = components.get(OBCF.Civil3DNavigator);
navigator.world = world;
navigator.draw(model);

/*
  ### 👁️ Using the culler
  ---

  For perfomance reasons, we will use a culler to only render the parts of the model that the camera can see. We will create a new culler for this world, add the previously loaded model to it and configure the update logic to refresh the culler every time the user stops moving the camera.
*/

const cullers = components.get(OBC.Cullers);
const culler = cullers.create(world);
culler.threshold = 10;

for (const child of model.children) {
  if (child instanceof THREE.InstancedMesh) {
    culler.add(child);
  }
}

culler.needsUpdate = true;

world.camera.controls.addEventListener("sleep", () => {
  culler.needsUpdate = true;
});

/*
  ### ⚾ Navigating to the selected point
  ---

  There are many ways to navigate to the selected point in an alignment. We will make it simple: subscribing to the highlight event, we can get some information about the highlight, such as the point that was clicked in the alignment. We will use that point to set the position of an invisible sphere that will use to move the camera with a nice animation:
*/

const sphere = new THREE.Sphere(undefined, 20);

navigator.onHighlight.add(({ point }) => {
  sphere.center.copy(point);
  world.camera.controls.fitToSphere(sphere, true);
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
  ### 🎉 Wrap up
  ---

  That's it! You have created a 3D app that can load infra models, represent its alignment in 3D and use it to navigate around with a nice camera animation. Well done!
*/
