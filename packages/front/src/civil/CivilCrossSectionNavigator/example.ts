/* MD
### 🛣️ Infra cross sections
---

Cross sections are one of the most important sources of information to describe civil models. In this tutorial, you'll learn how to generate and display the 2D cross section of any civil model.

:::tip Why are Cross sections important for civil?

Infra models usually have a huge difference between X and Y. This means that the cross sections is measured in meters, while the long section is kilometers long. This makes the cross section one of the most important sources of information to describe civil assets. 

:::

In this tutorial, we will import:

- `three` to create some 3D items.
- `@thatopen/components` to set up the barebone of our app.
- `@thatopen/ui` to add some simple and cool UI menus.
- `@thatopen/ui-obc` to add some cool pre-made UI menus for components.
- `@thatopen/components-front` to use some frontend-oriented components.
- `Stats.js` (optional) to measure the performance of our app.
*/

import * as THREE from "three";
import * as OBC from "@thatopen/components";
import * as BUI from "@thatopen/ui";
import * as BUIC from "@thatopen/ui-obc";
import Stats from "stats.js";
import * as OBCF from "@thatopen/components-front";

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

const properties = await fetch(
  "https://thatopen.github.io/engine_components/resources/road.json",
);
model.setLocalProperties(await properties.json());

/* MD
  ### 🚗 Adding the civil plan navigator
  ---

 We'll now add the civil plan navigator. The idea of this app is very simple: we will allow the user to click on the plan navigator to generate and display the 2D cross section of the model on another menu, and also navigate to that civil curve in 3D.

  :::tip Civil plan navigator?

    If you are not familiar with the civil plan navigator, check out that tutorial first!

  :::

  So first we'll fetch the world-2d HTML element we added to this page (don't forget to check out the HTML file of this example):
*/

const world2DLeft = document.getElementById("scene-2d-left") as BUIC.World2D;
world2DLeft.components = components;
if (!world2DLeft.world) {
  throw new Error("World not found!");
}

/* MD
  And now we'll get a new instance of the civil plan navigator, assign it to the world-2d that we just fetched and draw the horizontal alignment on it:
*/

const planNavigator = components.get(OBCF.CivilPlanNavigator);
planNavigator.world = world2DLeft.world;
await planNavigator.draw(model);

/* MD
  ### 🚕 Adding the civil 3D navigator
  ---

 Next, we'll add the civil 3D navigator, which will allow us to make the camera travel to the 3D alignment curve that the user selects in the plan navigator.

  :::tip Civil 3D navigator?

    If you are not familiar with the civil 3D navigator, check out that tutorial first!

  :::

  We'll simply get an instance of the civil 3D navigator:
  
*/

const navigator3D = components.get(OBCF.Civil3DNavigator);
navigator3D.world = world;
navigator3D.draw(model);

/* MD
  ### 🚓 Setting up Civil Cross Section Navigator
  ---
  The Cross Section Navigator is a tool that will allow you to clearly visualize the cross section of any civil IFC model, in any point selected in an alignment. We'll start by getting the other world-2d that we added to this page (again, don't forget to check out the HTML of this example):
*/

const world2DRight = document.getElementById("scene-2d-right") as BUIC.World2D;
world2DRight.components = components;
if (!world2DRight.world) {
  throw new Error("World not found!");
}

/* MD
  And now we'll get an instance of the cross section navigator and assign it to the world-2d:
*/

const crossNavigator = components.get(OBCF.CivilCrossSectionNavigator);
crossNavigator.world = world2DRight.world;
crossNavigator.world3D = world;

/* MD
  ### 🚗🚕🚓 Binding navigators
  ---
  Now we'll bind the cross section navigator with the plan navigator and the 3D navigator. We'll use the marker change event for that. When the marker changes in the plan navigator:

  1. The marker of the 3D navigator will be updated.
  2. The cross navigator will be set to that point.
*/

planNavigator.onMarkerChange.add(({ alignment, percentage, type, curve }) => {
  navigator3D.setMarker(alignment, percentage, type);
  if (type === "select") {
    const mesh = curve.alignment.absolute[curve.index].mesh;
    const point = alignment.getPointAt(percentage, "absolute");
    crossNavigator.set(mesh, point);
  }
});

/* MD
  And now we'll subscribe to the highlight event of the plan navigator, so that each time the user clicks on the horizontal alignment, we travel to that point of the road in 3D:
  
*/

planNavigator.onHighlight.add(({ mesh }) => {
  navigator3D.highlighter.select(mesh);
  const index = mesh.curve.index;
  const curve3d = mesh.curve.alignment.absolute[index];
  curve3d.mesh.geometry.computeBoundingSphere();
  const sphere = curve3d.mesh.geometry.boundingSphere;
  if (sphere) {
    world.camera.controls.fitToSphere(sphere, true);
  }
});

/* MD
  Also, we will make sure that when the marker is hidden in the plan navigator, it's also hidden in 3D:
*/

planNavigator.onMarkerHidden.add(({ type }) => {
  navigator3D.hideMarker(type);
});

/* MD
  ### 🖌️ Setting up styles
  ---
  Now it's time to define how we want to see the lines of the cross section of the road. In this example, we'll give a different section color to each IFC category. First, let's fetch de classifier and classify the model by IFC category:
*/

const classifier = components.get(OBC.Classifier);
classifier.byEntity(model);
const classifications = classifier.list;

/* MD
  Now, we'll create a new clipping style for each IFC category. We'll just give a random color to each category.
*/

const clipper = components.get(OBCF.ClipEdges);
const styles = clipper.styles.list;

for (const category in classifications.entities) {
  const found = classifier.find({ entities: [category] });

  const color = new THREE.Color(Math.random(), Math.random(), Math.random());
  const lineMaterial = new THREE.LineBasicMaterial({ color });
  clipper.styles.create(category, new Set(), world2DRight.world, lineMaterial);

  for (const fragID in found) {
    const foundFrag = fragments.list.get(fragID);
    if (!foundFrag) {
      continue;
    }
    styles[category].fragments[fragID] = new Set(found[fragID]);
    styles[category].meshes.add(foundFrag.mesh);
  }
}

/* MD
  Don't forget to update the clipper after the styles have been created!
*/

clipper.update(true);

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

  That's it! You have created an app that can generate the cross section of any civil model and navigate through it smoothly. Congratulations!
*/
