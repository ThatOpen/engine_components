/* eslint import/no-extraneous-dependencies: 0 */

// @ts-ignore
import * as dat from "three/examples/jsm/libs/lil-gui.module.min";
import Stats from "stats.js";
import * as THREE from "three";
import * as BUI from "@thatopen/ui";
import * as OBC from "../..";

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

const fragments = new OBC.FragmentsManager(components);

const file = await fetch("https://thatopen.github.io/engine_components/resources/small.frag");
const data = await file.arrayBuffer();
const buffer = new Uint8Array(data);
const model = fragments.load(buffer);
world.scene.three.add(model);

const classifier = components.get(OBC.Classifier);

classifier.byEntity(model);
classifier.byStorey(model);
classifier.byModel(model.uuid, model);

BUI.Manager.init();

const walls = classifier.find({
  entities: ["IFCWALLSTANDARDCASE"],
});

const slabs = classifier.find({
  entities: ["IFCSLAB"],
});

const curtainWalls = classifier.find({
  entities: ["IFCMEMBER", "IFCPLATE"],
});

const furniture = classifier.find({
  entities: ["IFCFURNISHINGELEMENT"],
});

const doors = classifier.find({
  entities: ["IFCDOOR"],
});

const all = classifier.find({
  models: [model.uuid],
});

const color = new THREE.Color();

const panel = BUI.Component.create<BUI.PanelSection>(() => {
  return BUI.html`
    <bim-panel active label="Classifier Tutorial" 
      style="position: fixed; top: 5px; right: 5px">
      <bim-panel-section style="padding-top: 10px;">
      
        <bim-color-input 
          label="Walls Color" color="#202932" 
          @input="${({ target }: { target: BUI.ColorInput }) => {
            color.set(target.color);
            classifier.setColor(walls, color);
          }}">
        </bim-color-input>
      
        <bim-color-input 
          label="Slabs Color" color="#202932" 
          @input="${({ target }: { target: BUI.ColorInput }) => {
            color.set(target.color);
            classifier.setColor(slabs, color);
          }}">
        </bim-color-input>
      
        <bim-color-input 
          label="Curtain walls Color" color="#202932" 
          @input="${({ target }: { target: BUI.ColorInput }) => {
            color.set(target.color);
            classifier.setColor(curtainWalls, color);
          }}">
        </bim-color-input>
      
        <bim-color-input 
          label="Furniture Color" color="#202932" 
          @input="${({ target }: { target: BUI.ColorInput }) => {
            color.set(target.color);
            classifier.setColor(furniture, color);
          }}">
        </bim-color-input>
      
        <bim-color-input 
          label="Doors Color" color="#202932" 
          @input="${({ target }: { target: BUI.ColorInput }) => {
            color.set(target.color);
            classifier.setColor(doors, color);
          }}">
        </bim-color-input>
                  
        <bim-button 
          label="Reset walls color" 
          @click="${() => {
            classifier.resetColor(all);
          }}">  
        </bim-button>  

      </bim-panel-section>
    </bim-panel>
    `;
});

document.body.append(panel);

// Set up stats
const stats = new Stats();
stats.showPanel(2);
document.body.append(stats.dom);
stats.dom.style.left = "0px";
stats.dom.style.right = "auto";

world.renderer.onBeforeUpdate.add(() => stats.begin());
world.renderer.onAfterUpdate.add(() => stats.end());
