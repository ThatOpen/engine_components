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

const navigator = new OBCF.Civil3DNavigator(components);
navigator.world = world;
navigator.draw(model);

navigator.highlighter.hoverCurve.material.color.set(1, 1, 1);
const { material: hoverPointsMaterial } = navigator.highlighter.hoverPoints;
if (Array.isArray(hoverPointsMaterial)) {
  const material = hoverPointsMaterial[0];
  if ("color" in material) (material.color as THREE.Color).set(1, 1, 1);
} else if ("color" in hoverPointsMaterial)
  (hoverPointsMaterial.color as THREE.Color).set(1, 1, 1);

const world2DLeft = document.getElementById("scene-2d-left") as BUIC.World2D;
world2DLeft.components = components;
if (!world2DLeft.world) {
  throw new Error("World not found!");
}

const planNavigator = new OBCF.CivilPlanNavigator(components);
planNavigator.world = world2DLeft.world;
planNavigator.draw(model);

/*
### 🌍 Exploring Civil Elevation View with Navigators

**🔧 Setting up Civil Elevation Navigator**
    ___
    The Elevation Navigator is a tool that allows exploration and visualization of
    the alignments in a civil IFC file, by creating a drawer that shows their
    its elevation view. Let's get into it!

    **Important**: This tool requires the Civil 3D Navigator and the Civil Plan Navigator
    tools to be initialized beforehand. Make sure to check out those respective tutorials
    before proceeding.

    We'll start by setting up the navigator component within our scene.
*/

const world2DRight = document.getElementById("scene-2d-right") as BUIC.World2D;
world2DRight.components = components;
if (!world2DRight.world) {
  throw new Error("World not found!");
}
const elevationNavigator = new OBCF.CivilElevationNavigator(components);
elevationNavigator.world = world2DRight.world;
elevationNavigator.draw(model);

planNavigator.onMarkerChange.add(({ alignment, percentage }) => {
  elevationNavigator.setMarker(alignment, percentage, "hover");
  navigator.setMarker(alignment, percentage, "hover");
});

planNavigator.onHighlight.add(({ mesh, point }) => {
  /*
  **🖌️ Configuring Navigator Highlighting**
      ___
      Finally, the following lines are added to the highlighter tool defined
      previously for the Plan Navigator. These lines provide visual objects
      specific to the Elevation Navigator, improving user experience.
  */

  const { index, alignment } = mesh.curve;

  const percentage = alignment.getPercentageAt(point, "horizontal");
  if (percentage === null) return;
  const { curve } = alignment.getCurveAt(percentage, "vertical");
  elevationNavigator.highlighter.select(curve.mesh);

  elevationNavigator.setMarker(curve.alignment, percentage, "select");

  if (world2DRight.world) {
    if (!curve.mesh.geometry.boundingSphere) {
      curve.mesh.geometry.computeBoundingSphere();
    }
    const vertSphere = curve.mesh.geometry.boundingSphere!.clone();
    vertSphere.radius *= 1.5;
    world2DRight.world.camera.controls.fitToSphere(vertSphere, true);
  }

  navigator.highlighter.select(mesh);
  const curve3d = mesh.curve.alignment.absolute[index];
  curve3d.mesh.geometry.computeBoundingSphere();
  const sphere = curve3d.mesh.geometry.boundingSphere;
  if (sphere) {
    world.camera.controls.fitToSphere(sphere, true);
  }
});

/*
  That's it! We're done setting up the Civil Elevation Navigator. Now you can
  interact with any alignment in the Horizontal Alignment Window, and the Elevation
  View of that specific alignment will be displayed in the Elevation Window.
*/

const stats = new Stats();
stats.showPanel(2);
document.body.append(stats.dom);
stats.dom.style.left = "0px";
world.renderer.onBeforeUpdate.add(() => stats.begin());
world.renderer.onAfterUpdate.add(() => stats.end());
