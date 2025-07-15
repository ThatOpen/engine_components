/* MD
### 😎 Adding some cool shadows
---

In this tutorial, you'll learn how to add some nice looking (yet performant) shadows to your scene.

In this tutorial, we will import:

- `Three.js` to get some 3D entities for our app.
- `@thatopen/components` to set up the barebone of our app.
- `Stats.js` (optional) to measure the performance of our app.
*/

import * as THREE from "three";
import Stats from "stats.js";
// You have to import * as OBC from "@thatopen/components"
import * as OBC from "../..";

/* MD
  ### 🌎 Setting up a simple scene
  ---

  We will start by creating a simple scene with a camera and a renderer. If you don't know how to set up a scene, you can check the Worlds tutorial.

*/

const container = document.getElementById("container")!;

const components = new OBC.Components();

const worlds = components.get(OBC.Worlds);

const world = worlds.create<
  OBC.ShadowedScene,
  OBC.OrthoPerspectiveCamera,
  OBC.SimpleRenderer
>();

world.scene = new OBC.ShadowedScene(components);
world.renderer = new OBC.SimpleRenderer(components, container);
world.camera = new OBC.OrthoPerspectiveCamera(components);

components.init();

world.camera.controls.setLookAt(12, 6, 8, 0, 0, -10);

const grids = components.get(OBC.Grids);
const grid = grids.create(world);

/* MD
  ### 🌎 Loading a model
  ---

  Now we will load a BIM fragments model. 
  
  :::tip Fragments?

    If you are not familiar with fragments, check out the IfcLoader tutorial!

  :::

*/

const fragments = components.get(OBC.FragmentsManager);
const githubUrl =
  "https://thatopen.github.io/engine_fragment/resources/worker.mjs";
const fetchedUrl = await fetch(githubUrl);
const workerBlob = await fetchedUrl.blob();
const workerFile = new File([workerBlob], "worker.mjs", {
  type: "text/javascript",
});
const workerUrl = URL.createObjectURL(workerFile);
fragments.init(workerUrl);

world.camera.controls.addEventListener("control", () =>
  fragments.core.update(),
);

const modelId = "example";

const file = await fetch(
  "https://thatopen.github.io/engine_components/resources/frags/school_arq.frag",
);
const data = await file.arrayBuffer();
const buffer = new Uint8Array(data);
const model = await fragments.core.load(buffer, {
  modelId,
  camera: world.camera.three,
});
world.scene.three.add(model.object);

/* MD
  ### ⛱️ Adding shadows
  ---

  Now we will add shadows. We will start by enabling the shadows in the three.js renderer.

*/

world.renderer.three.shadowMap.enabled = true;
world.renderer.three.shadowMap.type = THREE.PCFSoftShadowMap;

/* MD
  Next, we'll set up the scene and exclude the grid from the shadows. The shadows take into account the distance to the farthest visible object to decide a resolution for the shadows. The grid is infinite, so we don't want to take it into account.
*/

world.scene.setup({
  shadows: {
    cascade: 1,
    resolution: 1024,
  },
});

world.scene.distanceRenderer.excludedObjects.add(grid.three);

/* MD
  We will also need to enable the shadows for the materials and objects used in the fragments model:
*/

model.tiles.onItemSet.add(({ value: mesh }) => {
  if ("isMesh" in mesh) {
    const mat = mesh.material as THREE.MeshStandardMaterial[];
    if (mat[0].opacity === 1) {
      mesh.castShadow = true;
      mesh.receiveShadow = true;
    }
  }
});

for (const child of model.object.children) {
  child.castShadow = true;
  child.receiveShadow = true;
}

/* MD
  Finally, we just need to update the shadows every time the camera moves (and a first time to see something even before the user does anything).
*/

await world.scene.updateShadows();

world.camera.controls.addEventListener("rest", async () => {
  await world.scene.updateShadows();
});

world.scene.three.background = null;

/* MD
  ### ⏱️ Measuring the performance (optional)
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

  That's it! Now you know how to add some nice looking shadows to your scene. Congratulations! Keep exploring more tutorials in the documentation to keep learning.
*/
