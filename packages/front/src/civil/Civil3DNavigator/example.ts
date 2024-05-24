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
### 🌍 Creating a 3D World with Civil 3D Navigator

**🔧 Setting up Civil 3D Navigator**
    ___
    Now that we've established our simple scene, let's integrate the
    Civil 3D Navigator to explore our 3D model further. First, we need to
    create an instance of the Civil 3D Navigator component. This will enable
    us to navigate through our 3D environment and interact with the model.
*/

const navigator = components.get(OBCF.Civil3DNavigator);
navigator.world = world;
navigator.draw(model);

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
**🖌️ Configuring Navigator Highlighting**
    ___
    To enhance user interaction, we'll configure highlighting for
    civil elements within the navigator. This will provide visual feedback
    when interacting with civil elements, making the experience more intuitive.
*/

navigator.highlighter.hoverCurve.material.color.set(1, 1, 1);

const { material: hoverPointsMaterial } = navigator.highlighter.hoverPoints;
if (Array.isArray(hoverPointsMaterial)) {
  const material = hoverPointsMaterial[0];
  if ("color" in material) (material.color as THREE.Color).set(1, 1, 1);
} else if ("color" in hoverPointsMaterial)
  (hoverPointsMaterial.color as THREE.Color).set(1, 1, 1);

/*
**⚪ Highlight Sphere**
    ___
    A sphere object is defined and introduced to the scene everytime the
    user interacts with the alignments. Try it out!
*/

const sphere = new THREE.Sphere(undefined, 20);

navigator.onHighlight.add(({ point }) => {
  sphere.center.copy(point);
  world.camera.controls.fitToSphere(sphere, true);
});

/*
  With that, we finished! You've successfully created a Navigator compatible
  with Civil elements and other Civil components.
*/

const stats = new Stats();
stats.showPanel(2);
document.body.append(stats.dom);
stats.dom.style.left = "0px";
world.renderer.onBeforeUpdate.add(() => stats.begin());
world.renderer.onAfterUpdate.add(() => stats.end());
