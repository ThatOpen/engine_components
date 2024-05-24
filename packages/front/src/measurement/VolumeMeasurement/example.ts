/* eslint import/no-extraneous-dependencies: 0 */

import Stats from "stats.js";
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

const dimensions = new OBCF.VolumeMeasurement(components);
dimensions.world = world;
dimensions.enabled = true;

const fragments = new OBC.FragmentsManager(components);
const file = await fetch("https://thatopen.github.io/engine_components/resources/small.frag");
const data = await file.arrayBuffer();
const buffer = new Uint8Array(data);
const model = fragments.load(buffer);
world.scene.three.add(model);

const highlighter = new OBCF.Highlighter(components);
highlighter.setup({ world });

highlighter.events.select.onHighlight.add((event) => {
  const volume = dimensions.getVolumeFromFragments(event);
  console.log(volume);
});

highlighter.events.select.onClear.add(() => {
  dimensions.label?.three.removeFromParent();
});

container.ondblclick = () => dimensions.create();
container.oncontextmenu = () => dimensions.endCreation();

window.onkeydown = (event) => {
  if (event.code === "Delete" || event.code === "Backspace") {
    // WORK IN PROGRESS
    // dimensions.delete();
  }
};

// Set up stats

const stats = new Stats();
stats.showPanel(2);
document.body.append(stats.dom);
stats.dom.style.left = "0px";
world.renderer.onBeforeUpdate.add(() => stats.begin());
world.renderer.onAfterUpdate.add(() => stats.end());
