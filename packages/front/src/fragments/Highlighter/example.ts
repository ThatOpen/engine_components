// Set up scene (see SimpleScene tutorial)

/* eslint import/no-extraneous-dependencies: 0 */

import * as WEBIFC from "web-ifc";
import Stats from "stats.js";
// @ts-ignore
import * as dat from "three/examples/jsm/libs/lil-gui.module.min";
import * as OBC from "@thatopen/components";
import * as OBCF from "../..";

const container = document.getElementById("container")!;

const components = new OBC.Components();

const worlds = components.get(OBC.Worlds);

const world = worlds.create<
  OBC.SimpleScene,
  OBC.SimpleCamera,
  OBC.SimpleRenderer
>();

world.scene = new OBC.SimpleScene(components);
world.renderer = new OBC.SimpleRenderer(components, container);
world.camera = new OBC.SimpleCamera(components);

components.init();

world.camera.controls.setLookAt(12, 6, 8, 0, 0, -10);

world.scene.setup();

const grids = components.get(OBC.Grids);
grids.create(world);

// const fragments = components.get(OBC.FragmentsManager);
const fragmentIfcLoader = components.get(OBC.IfcLoader);

await fragmentIfcLoader.setup();

const excludedCats = [
  WEBIFC.IFCTENDONANCHOR,
  WEBIFC.IFCREINFORCINGBAR,
  WEBIFC.IFCREINFORCINGELEMENT,
];

for (const cat of excludedCats) {
  fragmentIfcLoader.settings.excludedCategories.add(cat);
}

fragmentIfcLoader.settings.webIfc.COORDINATE_TO_ORIGIN = true;
fragmentIfcLoader.settings.webIfc.OPTIMIZE_PROFILES = true;

const file = await fetch("../../../../../resources/small.ifc");
const data = await file.arrayBuffer();
const buffer = new Uint8Array(data);
const model = await fragmentIfcLoader.load(buffer);
model.name = "example";
world.scene.three.add(model);

const highlighter = components.get(OBCF.Highlighter);
highlighter.setup({ world });
highlighter.zoomToSelection = true;

// Set up stats

const stats = new Stats();
stats.showPanel(2);
document.body.append(stats.dom);
stats.dom.style.left = "0px";
world.renderer.onBeforeUpdate.add(() => stats.begin());
world.renderer.onAfterUpdate.add(() => stats.end());
