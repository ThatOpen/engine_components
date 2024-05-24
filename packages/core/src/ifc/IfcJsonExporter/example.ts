/* eslint import/no-extraneous-dependencies: 0 */

// @ts-ignore
import * as dat from "three/examples/jsm/libs/lil-gui.module.min";
import Stats from "stats.js";
import * as BUI from "@thatopen/ui";
import * as WEBIFC from "web-ifc";
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
const fragFile = await fetch("https://thatopen.github.io/engine_components/resources/small.frag");
const fragData = await fragFile.arrayBuffer();
const fragBuffer = new Uint8Array(fragData);
const model = fragments.load(fragBuffer);
world.scene.three.add(model);

const webIfc = new WEBIFC.IfcAPI();
webIfc.SetWasmPath("https://unpkg.com/web-ifc@0.0.53/", true);
await webIfc.Init();

const ifcFile = await fetch("https://thatopen.github.io/engine_components/resources/small.ifc");
const ifcData = await ifcFile.arrayBuffer();
const ifcBuffer = new Uint8Array(ifcData);
const modelID = webIfc.OpenModel(ifcBuffer);

const exporter = components.get(OBC.IfcJsonExporter);

BUI.Manager.init();

const panel = BUI.Component.create<BUI.PanelSection>(() => {
  return BUI.html`
    <bim-panel active label="IFC JSON Exporter Tutorial" 
      style="position: fixed; top: 5px; right: 5px">
      <bim-panel-section style="padding-top: 10px;">
        <bim-button 
          label="Export properties JSON" 
          @click="${async () => {
            const exported = await exporter.export(webIfc, modelID);
            const serialized = JSON.stringify(exported);
            const file = new File([new Blob([serialized])], "properties.json");
            const url = URL.createObjectURL(file);
            const link = document.createElement("a");
            link.download = "properties.json";
            link.href = url;
            link.click();
            URL.revokeObjectURL(url);
            link.remove();
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
