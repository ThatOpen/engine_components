/* eslint import/no-extraneous-dependencies: 0 */

import Stats from "stats.js";
import * as THREE from "three";
import * as OBC from "@thatopen/components";
import * as OBCF from "../..";

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

world.camera.controls.setLookAt(5, 5, 5, 0, 0, 0);

world.scene.setup();

const grids = components.get(OBC.Grids);
grids.create(world);

const dimensions = new OBCF.EdgeMeasurement(components);
dimensions.world = world;
dimensions.enabled = true;

const fragments = new OBC.FragmentsManager(components);
const file = await fetch("https://thatopen.github.io/engine_components/resources/small.frag");
const data = await file.arrayBuffer();
const buffer = new Uint8Array(data);
const model = fragments.load(buffer);
world.scene.three.add(model);

for (const child of model.children) {
  if (child instanceof THREE.Mesh) {
    world.meshes.add(child);
  }
}

let saved: number[][];

window.addEventListener("keydown", (event) => {
  if (event.code === "KeyO") {
    dimensions.delete();
  } else if (event.code === "KeyS") {
    saved = dimensions.get();
    dimensions.deleteAll();
  } else if (event.code === "KeyL") {
    if (saved) dimensions.set(saved);
  }
});

// Set up stats

const stats = new Stats();
stats.showPanel(2);
document.body.append(stats.dom);
stats.dom.style.left = "0px";
world.renderer.onBeforeUpdate.add(() => stats.begin());
world.renderer.onAfterUpdate.add(() => stats.end());
