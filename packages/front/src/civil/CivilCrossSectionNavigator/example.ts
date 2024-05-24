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

const properties = await fetch("https://thatopen.github.io/engine_components/resources/road.json");
model.setLocalProperties(await properties.json());

const world2DLeft = document.getElementById("scene-2d-left") as BUIC.World2D;
world2DLeft.components = components;
if (!world2DLeft.world) {
  throw new Error("World not found!");
}

const planNavigator = new OBCF.CivilPlanNavigator(components);
planNavigator.world = world2DLeft.world;

await planNavigator.draw(model);

const navigator3D = new OBCF.Civil3DNavigator(components);
navigator3D.world = world;
navigator3D.draw(model);

navigator3D.highlighter.hoverCurve.material.color.set(1, 1, 1);
const { material: hoverPointsMaterial } = planNavigator.highlighter.hoverPoints;
if (Array.isArray(hoverPointsMaterial)) {
  const material = hoverPointsMaterial[0];
  if ("color" in material) (material.color as THREE.Color).set(1, 1, 1);
} else if ("color" in hoverPointsMaterial)
  (hoverPointsMaterial.color as THREE.Color).set(1, 1, 1);

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

/*
### 🌍 Exploring Civil Cross Sections with Navigators

**🔧 Setting up Civil Cross Section Navigator**
    ___
    The Cross Section Navigator is a tool that will allow you to clearly visualize
    the cross section of any civil IFC model, in any point selected in an alignment.
    Let's begin!

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

const crossNavigator = new OBCF.CivilCrossSectionNavigator(components);
crossNavigator.world = world2DRight.world;
crossNavigator.world3D = world;

/*
**🌅 Defining the UI for the tool**
    ___
    The UI element to be used with this tool is a floating window, so let's
    define it and introduce it to our scene.
*/

/*
  And that's it! You've successfully set up the Civil Cross Section Navigator.
  Go ahead and interact with the Horizontal Alignment Window in any point of an alignment,
  and the cross section of the selected area will be displayed in the Cross Section Window.
*/

planNavigator.onMarkerChange.add(({ alignment, percentage, type, curve }) => {
  navigator3D.setMarker(alignment, percentage, type);

  if (type === "select") {
    const mesh = curve.alignment.absolute[curve.index].mesh;
    const point = alignment.getPointAt(percentage, "absolute");
    crossNavigator.set(mesh, point);
  }
});

planNavigator.onMarkerHidden.add(({ type }) => {
  navigator3D.hideMarker(type);
});

const classifier = new OBC.Classifier(components);
classifier.byEntity(model);

const classifications = classifier.list;

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

clipper.update(true);

const stats = new Stats();
stats.showPanel(2);
document.body.append(stats.dom);
stats.dom.style.left = "0px";
world.renderer.onBeforeUpdate.add(() => stats.begin());
world.renderer.onAfterUpdate.add(() => stats.end());
