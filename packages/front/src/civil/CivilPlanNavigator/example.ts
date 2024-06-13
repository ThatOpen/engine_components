/* MD
### 🛣️ Horizontal alignments
---

In this page, we'll learn how to represent the horizontal alignment of civil models and make it interactive.

:::tip Horizontal alignment?

Civil models include 2D alignments with explicit information about the asset. One of these alignments is horizontal and represents the floor plan of the alignment curves.

:::

In this tutorial, we will import:

- `@thatopen/components` to set up the barebone of our app.
- `@thatopen/ui` to add some simple and cool UI menus.
- `@thatopen/ui-obc` to add some cool pre-made UI menus for components.
- `@thatopen/components-front` to use some frontend-oriented components.
- `Stats.js` (optional) to measure the performance of our app.
*/

import * as THREE from "three";
import * as OBC from "@thatopen/components";
import * as OBCF from "@thatopen/components-front";
import * as BUI from "@thatopen/ui";
import * as BUIC from "@thatopen/ui-obc";
import Stats from "stats.js";

/* MD
  ### 📋 Initializing the UI
  ---

  The UI Components need to be initialized before we can use them. First, we will do it with both UI libraries:
*/

BUI.Manager.init();
BUIC.Manager.init();

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
  OBC.OrthoPerspectiveCamera,
  OBCF.RendererWith2D
>();

world.scene = new OBC.SimpleScene(components);
world.renderer = new OBCF.RendererWith2D(components, container);
world.camera = new OBC.OrthoPerspectiveCamera(components);

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
const model = fragments.load(buffer);
world.scene.three.add(model);

/* MD
  ### 🚕 Adding the civil 3D navigator
  ---

  First we'll add the civil 3D navigator to move the camera when the user interacts with the civil plan navigator, which we will add later.

    :::tip Civil 3D navigator?

    If you are not familiar with the civil 3D navigator, check out that tutorial first!

  :::

  We'll simply get an instance of the civil 3D navigator:
*/

const navigator = components.get(OBCF.Civil3DNavigator);
navigator.world = world;
navigator.draw(model);

/* MD
  ### 🚗 Adding the civil plan navigator
  ---

 We'll now add the civil plan navigator. The idea of this app is very simple: we will allow the user to click on the plan navigator to navigate across the 3D scene. So first we'll fetch the world-2d HTML element we added to this page (don't forget to check out the HTML file of this example):
*/

const world2D = document.getElementById("scene-2d") as BUIC.World2D;

/* MD
  And now we'll get a new instance of the civil plan navigator, assign it to the world-2d that we just fetched and draw the horizontal alignment on it:
*/

const planNavigator = components.get(OBCF.CivilPlanNavigator);
world2D.components = components;
planNavigator.world = world2D.world;
await planNavigator.draw(model);

/* MD
  ### 🚗🚕 Binding navigators
  ---
  Now we'll bind the elevation navigator with the 3D navigator. We'll use the highlight event for that. When the plan navigator is highlighted, the 3D navigator will be highlighted as well and the camera will travel to the selected point in 3D.
*/

planNavigator.onHighlight.add(({ mesh }) => {
  navigator.highlighter.select(mesh);
  const index = mesh.curve.index;
  const curve3d = mesh.curve.alignment.absolute[index];
  curve3d.mesh.geometry.computeBoundingSphere();
  const sphere = curve3d.mesh.geometry.boundingSphere;
  if (sphere) {
    world.camera.controls.fitToSphere(sphere, true);
  }
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

  That's it! You have created an app that can generate the horizontal alignment any civil model and navigate through it smoothly. Congratulations!
*/
