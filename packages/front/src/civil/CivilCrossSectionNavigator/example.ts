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

const fragments = components.get(OBC.FragmentsManager);

const file = await fetch("../../../../../resources/road.frag");
const data = await file.arrayBuffer();
const buffer = new Uint8Array(data);
const model = fragments.load(buffer);
world.scene.three.add(model);

const properties = await fetch("../../../../../resources/road.json");
model.setLocalProperties(await properties.json());

const navigator = new OBCF.CivilPlanNavigator(components);
navigator.draw(model);


const elevationNavigator = new OBC.CivilElevationNavigator(components);
const drawer = elevationNavigator.uiElement.get("drawer");
drawer.visible = true;

const navigator3D = new OBC.Civil3DNavigator(components);
navigator3D.draw(model);
navigator3D.setup();

navigator3D._highlighter.hoverCurve.material.color.set(1, 1, 1);
const { material: hoverPointsMaterial } = navigator.highlighter.hoverPoints;
if (Array.isArray(hoverPointsMaterial)) {
  const material = hoverPointsMaterial[0];
  if ("color" in material) (material.color as THREE.Color).set(1, 1, 1);
} else if ("color" in hoverPointsMaterial)
  (hoverPointsMaterial.color as THREE.Color).set(1, 1, 1);

navigator.onHighlight.add(({ mesh }) => {
  elevationNavigator.clear();
  elevationNavigator.draw(model, [mesh.curve.alignment]);
  elevationNavigator.highlighter.select(mesh);
  navigator3D._highlighter.select(mesh);

  const index = mesh.curve.index;
  const curve3d = mesh.curve.alignment.absolute[index];
  curve3d.mesh.geometry.computeBoundingSphere();
  cameraComponent.controls.fitToSphere(
    curve3d.mesh.geometry.boundingSphere,
    true,
  );
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

const crossNavigator = new OBC.CivilCrossSectionNavigator(components);

/*
**🌅 Defining the UI for the tool**
    ___
    The UI element to be used with this tool is a floating window, so let's
    define it and introduce it to our scene.
*/

const crossWindow = crossNavigator.uiElement.get("floatingWindow");
crossWindow.visible = true;

/*
  And that's it! You've successfully set up the Civil Cross Section Navigator.
  Go ahead and interact with the Horizontal Alignment Window in any point of an alignment,
  and the cross section of the selected area will be displayed in the Cross Section Window.
*/

navigator.onMarkerChange.add(({ alignment, percentage, type, curve }) => {
  elevationNavigator.setMarker(alignment, percentage, type);
  navigator3D.setMarker(alignment, percentage, type);

  if (type === "select") {
    const mesh = curve.alignment.absolute[curve.index].mesh;
    const point = alignment.getPointAt(percentage, "absolute");
    crossNavigator.set(mesh, point);
  }
});

navigator.onMarkerHidden.add(({ type }) => {
  elevationNavigator.hideMarker(type);
  navigator3D.hideMarker(type);
});

window.addEventListener("keydown", () => {
  elevationNavigator.scene.scaleY += 0.1;
});

const classifier = new OBC.FragmentClassifier(components);
classifier.byEntity(model);

const classifications = classifier.get();

const clipper = components.tools.get(OBC.ClipEdges);
const styles = clipper.styles.get();

for (const category in classifications.entities) {
  const found = classifier.find({ entities: [category] });

  const color = new THREE.Color(Math.random(), Math.random(), Math.random());

  const lineMaterial = new THREE.LineBasicMaterial({ color });
  clipper.styles.create(category, new Set(), lineMaterial);

  for (const fragID in found) {
    const foundFrag = fragments.list[fragID];
    if (!foundFrag) {
      continue;
    }
    styles[category].fragments[fragID] = new Set(found[fragID]);
    styles[category].meshes.add(foundFrag.mesh);
  }
}

const stats = new Stats();
stats.showPanel(2);
document.body.append(stats.dom);
stats.dom.style.left = "0px";
world.renderer.onBeforeUpdate.add(() => stats.begin());
world.renderer.onAfterUpdate.add(() => stats.end());
