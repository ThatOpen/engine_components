/* eslint import/no-extraneous-dependencies: 0 */

import * as THREE from "three";
import * as OBC from "@thatopen/components";
import * as BUI from "@thatopen/ui";
import * as BUIC from "@thatopen/ui-obc";
import Stats from "stats.js";
import * as OBCF from "../..";

BUI.Manager.init();
BUIC.Manager.init();

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

const fragments = components.get(OBC.FragmentsManager);

const file = await fetch("https://thatopen.github.io/engine_components/resources/road.frag");
const data = await file.arrayBuffer();
const buffer = new Uint8Array(data);
const model = fragments.load(buffer);
world.scene.three.add(model);

// const properties = await fetch("https://thatopen.github.io/engine_components/resources/road.json");
// model.setLocalProperties(await properties.json());

const navigator = new OBCF.Civil3DNavigator(components);
navigator.world = world;
navigator.draw(model);

navigator.highlighter.hoverCurve.material.color.set(1, 1, 1);
const { material: hoverPointsMaterial } = navigator.highlighter.hoverPoints;
if (Array.isArray(hoverPointsMaterial)) {
  const material = hoverPointsMaterial[0];
  if ("color" in material) (material.color as THREE.Color).set(1, 1, 1);
} else if ("color" in hoverPointsMaterial) {
  (hoverPointsMaterial.color as THREE.Color).set(1, 1, 1);
}

/*
### 🌍 Exploring Civil Plan View with Navigators

**🔧 Setting up Civil Plan Navigator**
    ___
    The Plan Navigator is a tool that allows exploration and visualization of
    the alignments in a civil IFC file, by creating a window that shows their
    plan view. Let's explore it!

    **Important**: This tool requires the Civil 3D Navigator tool to be
    initialized beforehand. Make sure to check out that respective tutorial
    before proceeding.

    We'll start by setting up the navigator component within our scene and
    adding our civil model to it.
*/

const world2D = document.getElementById("scene-2d") as BUIC.World2D;

const planNavigator = new OBCF.CivilPlanNavigator(components);
world2D.components = components;
if (!world2D.world) {
  throw new Error("World not found!");
}
planNavigator.world = world2D.world;

await planNavigator.draw(model);

/*
**🌅 Defining the UI for the tool**
    ___
    The UI element to be used with this tool is a floating window, so let's
    define it and introduce it to our scene.
*/

/*
**🖌️ Configuring Navigator Highlighting**
    ___
    Finally, we configure a highlighter to be able to interact with the
    alignments shown in the navigator. This will provide multiple visual objects
    when navigating through the model, making the experience more intuitive.
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

/*
  And we're done! You've successfully set up the Civil Plan Navigator.
  Now you can interact with the Horizontal Alignment Window. Now try adding
  some other compatible tools like the Civil Elevation Navigator and the
  Civil Cross Section Navigator.🚀
*/

const stats = new Stats();
stats.showPanel(2);
document.body.append(stats.dom);
stats.dom.style.left = "0px";
world.renderer.onBeforeUpdate.add(() => stats.begin());
world.renderer.onAfterUpdate.add(() => stats.end());
