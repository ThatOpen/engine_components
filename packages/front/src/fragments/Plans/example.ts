// Set up scene (see SimpleScene tutorial)

/* eslint import/no-extraneous-dependencies: 0 */

import Stats from "stats.js";
import * as THREE from "three";
import * as OBC from "@thatopen/components";
import * as BUI from "@thatopen/ui";
import * as OBCF from "../..";

const container = document.getElementById("container")!;

const components = new OBC.Components();

const worlds = components.get(OBC.Worlds);

const world = worlds.create<
  OBC.SimpleScene,
  OBC.OrthoPerspectiveCamera,
  OBCF.PostproductionRenderer
>();

world.scene = new OBC.SimpleScene(components);
world.renderer = new OBCF.PostproductionRenderer(components, container);
world.camera = new OBC.OrthoPerspectiveCamera(components);

world.renderer.postproduction.enabled = true;
world.renderer.postproduction.customEffects.outlineEnabled = true;

components.init();

world.camera.controls.setLookAt(12, 6, 8, 0, 0, -10);

world.scene.setup();

const grids = components.get(OBC.Grids);
grids.config.color.setHex(0x666666);
const grid = grids.create(world);
grid.three.position.y -= 1;
world.renderer.postproduction.customEffects.excludedMeshes.push(grid.three);

const fragments = components.get(OBC.FragmentsManager);
const file = await fetch("https://thatopen.github.io/engine_components/resources/small.frag");
const data = await file.arrayBuffer();
const buffer = new Uint8Array(data);
const model = fragments.load(buffer);
world.scene.three.add(model);

const propsFile = await fetch("https://thatopen.github.io/engine_components/resources/small.json");
const propsData = await propsFile.json();
model.setLocalProperties(propsData);

const plans = components.get(OBCF.Plans);
plans.world = world;
await plans.generate(model);

BUI.Manager.init();

const classifier = components.get(OBC.Classifier);
classifier.byModel(model.uuid, model);
const modelItems = classifier.find({ models: [model.uuid] });
const whiteColor = new THREE.Color("white");
const defaultBackground = world.scene.three.background;

classifier.byEntity(model);

const edges = components.get(OBCF.ClipEdges);

const highlighter = components.get(OBCF.Highlighter);
highlighter.setup({ world });

const cullers = components.get(OBC.Cullers);
const culler = cullers.create(world);
for (const fragment of model.items) {
  culler.add(fragment.mesh);
}

culler.needsUpdate = true;

world.camera.controls.addEventListener("sleep", () => {
  culler.needsUpdate = true;
});

// Create thick style

const grayFill = new THREE.MeshBasicMaterial({ color: "gray", side: 2 });
const blackLine = new THREE.LineBasicMaterial({ color: "black" });
const blackOutline = new THREE.MeshBasicMaterial({
  color: "black",
  opacity: 0.5,
  side: 2,
  transparent: true,
});

edges.styles.create(
  "thick",
  new Set(),
  world,
  blackLine,
  grayFill,
  blackOutline,
);

const thickItems = classifier.find({
  entities: ["IFCWALLSTANDARDCASE", "IFCWALL"],
});
for (const fragID in thickItems) {
  const foundFrag = fragments.list.get(fragID);
  if (!foundFrag) continue;
  const { mesh } = foundFrag;
  edges.styles.list.thick.fragments[fragID] = new Set(thickItems[fragID]);
  edges.styles.list.thick.meshes.add(mesh);
}

// Create thin style

edges.styles.create("thin", new Set(), world);

const thinItems = classifier.find({
  entities: ["IFCDOOR", "IFCWINDOW", "IFCPLATE", "IFCMEMBER"],
});

for (const fragID in thinItems) {
  const foundFrag = fragments.list.get(fragID);
  if (!foundFrag) continue;
  const { mesh } = foundFrag;
  edges.styles.list.thin.fragments[fragID] = new Set(thinItems[fragID]);
  edges.styles.list.thin.meshes.add(mesh);
}

await edges.update(true);

const panel = BUI.Component.create<BUI.PanelSection>(() => {
  return BUI.html`
    <bim-panel active label="Plans Tutorial" 
      style="position: fixed; top: 5px; right: 5px">
      <bim-panel-section fixed name="floorPlans" label="Plan list" style="padding-top: 10px;">
      </bim-panel-section>
    </bim-panel>
    `;
});

document.body.append(panel);

const minGloss = world.renderer!.postproduction.customEffects.minGloss;

const panelSection = panel.querySelector(
  "bim-panel-section[name='floorPlans']",
) as BUI.PanelSection;

for (const plan of plans.list) {
  const planButton = BUI.Component.create<BUI.Checkbox>(() => {
    return BUI.html`
      <bim-button checked label="${plan.name}"
        @click="${() => {
          world.renderer!.postproduction.customEffects.minGloss = 0.1;
          highlighter.backupColor = whiteColor;
          classifier.setColor(modelItems, whiteColor);
          world.scene.three.background = whiteColor;
          plans.goTo(plan.id);
        }}">
      </bim-button>
    `;
  });
  panelSection.append(planButton);
}

const exitButton = BUI.Component.create<BUI.Checkbox>(() => {
  return BUI.html`
      <bim-button checked label="Exit"
        @click="${() => {
          highlighter.backupColor = null;
          world.renderer!.postproduction.customEffects.minGloss = minGloss;
          classifier.resetColor(modelItems);
          world.scene.three.background = defaultBackground;
          plans.exitPlanView();
        }}">
      </bim-button>
    `;
});

panelSection.append(exitButton);

// Set up stats

const stats = new Stats();
stats.showPanel(2);
document.body.append(stats.dom);
stats.dom.style.left = "0px";
world.renderer.onBeforeUpdate.add(() => stats.begin());
world.renderer.onAfterUpdate.add(() => stats.end());
