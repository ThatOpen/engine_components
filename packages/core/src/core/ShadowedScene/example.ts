/* MD
### ⛱️ Lights and shadows
---

In this tutorial you'll learn how to create cool and efficient cast shadows in your app.

:::tip Shadows?

Shadows can be computationally expensive, but we've got some tricks that make them fast, beautiful and easy to use!

:::

In this tutorial, we will import:

- `Three.js` to get some 3D entities for our app.
- `@thatopen/components` to set up the barebone of our app.
- `Stats.js` (optional) to measure the performance of our app.

*/

import Stats from "stats.js";
import * as THREE from "three";
import * as OBC from "@thatopen/components";

/* MD
  ### 🌎 Setting up a shadow scene
  ---

  We will start by creating a shadow scene with a camera and a renderer. If you don't know how to set up a scene, you can check the Worlds tutorial.

*/

const container = document.getElementById("container")!;

const components = new OBC.Components();

const worlds = components.get(OBC.Worlds);
const world = worlds.create<
  OBC.ShadowedScene,
  OBC.SimpleCamera,
  OBC.SimpleRenderer
>();

world.scene = new OBC.ShadowedScene(components);
world.renderer = new OBC.SimpleRenderer(components, container);
world.camera = new OBC.SimpleCamera(components);

components.init();

const grids = components.get(OBC.Grids);
const grid = grids.create(world);

world.camera.controls.setLookAt(1, 2, -2, -2, 0, -5);

/* MD
  ### 🏠 Loading a model
  ---

 Now that we have a scene, let's load a model. We will use the Fragment Manager for it. 
 
   :::info Showing Fragments in the Scene

  🏔️ There is a dedicated tutorial on how to use Fragment Manager to load **IFC files**, check it out if you haven't already!

  :::

*/

const fragments = new OBC.FragmentsManager(components);

const file = await fetch(
  "https://thatopen.github.io/engine_components/resources/small.frag",
);
const dataBlob = await file.arrayBuffer();
const buffer = new Uint8Array(dataBlob);
const model = fragments.load(buffer);
world.scene.three.add(model);

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(15, 25, 1),
  new THREE.MeshLambertMaterial({ color: "white" }),
);
plane.position.set(-2, -1, -7);
plane.rotation.x = -Math.PI / 2;
plane.receiveShadow = true;
world.scene.three.add(plane);

/* MD

  ### 🗺 Adding shadows
  ---

  Now we are ready to set up the shadows. First, we need to enable shadows in the THREE.js renderer.
  Also, we'll use soft shadows because they look better:

*/

world.renderer.three.shadowMap.enabled = true;
world.renderer.three.shadowMap.type = THREE.PCFSoftShadowMap;

/* MD

  Now, let's set up the shadow scene:

*/

world.scene.setup({
  shadows: {
    cascade: 1,
    resolution: 1024,
  },
});

/* MD

  Great! Now need to specify which items we want to cast/receive shadow. A good rule of thumb is to
  ignore translucent items. We can do it like this:

*/

type iMesh = THREE.InstancedMesh<
  THREE.BufferGeometry,
  THREE.MeshLambertMaterial[]
>;

for (const child of model.children) {
  const mesh = child as iMesh;
  if (mesh.material[0].opacity === 1) {
    mesh.castShadow = true;
    mesh.receiveShadow = true;
  }
}

/* MD

  This shadow system is based on computing the distance to the farthest objects. Some objects (like the base grid)
  shouldn't be taken into account in this computation. We can exclude it like this:

*/

world.scene.distanceRenderer.excludedObjects.add(grid.three);

/* MD

  Finally, we need to set the shadow update logic. We'll update shadows each time the camera moves, but you can
  decide any logic that suits your app!

*/

await world.scene.updateShadows();

world.camera.controls.addEventListener("update", async () => {
  await world.scene.updateShadows();
});

/* MD

  We'll make the background of the scene transparent so that it looks good in our docs page, but you don't have to do that in your app!

*/

world.scene.three.background = null;

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

  That's it! Now you know how to set up a scene with cool shadows and make your BIM applications shine!

*/
