/* MD
### 🔦 Highlighting
---

In 3D apps, users get some feedback when they hover or click on an object. Generally, it changes its color or shading. In this tutorial, you'll learn how to do that with the highlighter.

:::tip Highlighting?

Highlighting means changing the color of one or many objects to make them stand out. This can be used for hovering, for selection, for bringing the attention of the user to certain items, etc.

:::

In this tutorial, we will import:

- `@thatopen/components` to set up the barebone of our app.
- `@thatopen/components-front` to use some frontend-oriented components.
- `Stats.js` (optional) to measure the performance of our app.
*/

import * as OBC from "@thatopen/components";
import * as OBCF from "@thatopen/components-front";
import Stats from "stats.js";
import * as THREE from "three";

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

world.renderer.postproduction.enabled = true;

world.camera.controls.setLookAt(12, 6, 8, 0, 0, -10);

world.scene.setup();

const grids = components.get(OBC.Grids);
const grid = grids.create(world);
world.renderer.postproduction.customEffects.excludedMeshes.push(grid.three);

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

const fragments = new OBC.FragmentsManager(components);
const file = await fetch(
  "https://thatopen.github.io/engine_components/resources/small.frag",
);
const data = await file.arrayBuffer();
const buffer = new Uint8Array(data);
const model = fragments.load(buffer);
world.scene.three.add(model);

/* MD
  ### 💡 Getting the highlighter
  ---

 Now, we will basically get the highlighter and set it up. This will create and configure 2 things:
 - Selecting: when clicking on an element.
 - Hovering: when hovering the mouse over an element.
*/

const highlighter = components.get(OBCF.Highlighter);
highlighter.setup({ world });
highlighter.zoomToSelection = true;

/* MD
  ### 🖊️ Adding some outlines
  ---

 Next, we will use the outliner to add some colored outlines to the selection. We just need to get it, create a new style and bind it to the highlighter selection event. You can control the width of the outline with the opacity of the material.
*/

const outliner = components.get(OBCF.Outliner);
outliner.world = world;
outliner.enabled = true;

outliner.create(
  "example",
  new THREE.MeshBasicMaterial({
    color: 0xbcf124,
    transparent: true,
    opacity: 0.5,
  }),
);

highlighter.events.select.onHighlight.add((data) => {
  outliner.clear("example");
  outliner.add("example", data);
});

highlighter.events.select.onClear.add(() => {
  outliner.clear("example");
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

  That's it! You have created an app that can highlight items on hover and on selection. Congratulations!
*/
