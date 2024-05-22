/* eslint import/no-extraneous-dependencies: 0 */

import Stats from "stats.js";
import * as BUI from "@thatopen/ui";
import * as THREE from "three";
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

world.scene.setup();

components.init();

const grids = components.get(OBC.Grids);
grids.create(world);

world.camera.controls.setLookAt(1, 2, -2, -2, 0, -5);

/* MD
  ### 🏂 Navigate through BIM like Pro!
  ---

  BIM Models are large and contain a lot of attributes.
  It can become complicated to manage the elements and painfully difficult to navigate around.🌪

  Understanding spatial relationships is crucial during the design and evaluation processes.

  By having a MiniMap functionality for navigation it makes easier to collaborate and enhance the productivity,
  let's see how you can integrate MiniMap in your BIM App! 💥

  :::tip First, let's set up a simple scene!

  👀 If you haven't started there, check out [that tutorial first](SimpleScene.mdx)!

  :::

  For this tutorial, we'll use the [**MiniMap**](../api/classes/components.MiniMap) component to create
  a navigation functionality!

  ### 🧩 Adding Fragments
  ---

  We'll start by adding a **Fragment** to our scene using [**FragmentManager**](../api/classes/components.FragmentManager).

  We'll use a simple fragment for the purposes of this tutorial, but the code is capable of handling big files as well.🏗️

  */

const fragments = new OBC.FragmentsManager(components);

const file = await fetch("../../../../../resources/small.frag");
const dataBlob = await file.arrayBuffer();
const buffer = new Uint8Array(dataBlob);
const model = fragments.load(buffer);
world.scene.three.add(model);

/* MD

  :::info Showing Fragments in the Scene

  🏔️ There is a dedicated tutorial on how to use Fragment Manager to load **IFC files**, checkout [that tutorial here](FragmentManager.mdx)!

  :::

  ### 🗺 Integrating Spatial Wonders
  ---

  Now, that we have our setup ready. Let's start with the exciting stuff.
  We will use [**Mini Map**](../api/classes/components.MiniMap) component which does all the work for us.🔮

  When we create a **Mini Map**, a **Map** element is created at the `bottom-right` of your browser window.

  */

const maps = new OBC.MiniMaps(components);
const map = maps.create(world);

const mapContainer = document.getElementById("minimap") as HTMLDivElement;
const canvas = map.renderer.domElement;
canvas.style.borderRadius = "12px";
mapContainer.append(canvas);

/* MD

  #### 🎩 Controlling Maps like a wizard!
  ---
  MiniMap Component makes it easy to add **map** to your app, and it also provides much easier way to manage the **map**.

  You can set the scale for map using `map.zoom` or modify the size of **UI** element using `map.getSize()`,
  you can find out about more controls [**here**](../api/classes/components.MiniMap#implements) 🎛

  */

map.lockRotation = false;
map.zoom = 0.2;

/* MD

  **Congratulations** 🎉 on completing this short yet important tutorial!
  Now you can easily add navigation **Map** to your BIM Apps 🎯
  Let's keep it up and check out another tutorial! 🎓

  */

// Set up stats
const stats = new Stats();
stats.showPanel(2);
document.body.append(stats.dom);
stats.dom.style.left = "0px";
world.renderer.onBeforeUpdate.add(() => stats.begin());
world.renderer.onAfterUpdate.add(() => stats.end());

BUI.Manager.init();

const mapSize = map.getSize();

const panel = BUI.Component.create<BUI.PanelSection>(() => {
  return BUI.html`
    <bim-panel label="Minimap Tutorial" style="position: fixed; top: 5px; right: 5px" active>
      <bim-panel-section style="padding-top: 10px">
      
        <bim-checkbox checked="true" label="Enabled" 
          @change="${({ target }: { target: BUI.Checkbox }) => {
            map.enabled = target.value;
          }}">  
        </bim-checkbox>
        
        <bim-checkbox label="Lock rotation" 
          @change="${({ target }: { target: BUI.Checkbox }) => {
            map.lockRotation = target.value;
          }}">  
        </bim-checkbox>
      
        <bim-color-input 
          label="Background Color" color="#202932" 
          @input="${({ target }: { target: BUI.ColorInput }) => {
            world.scene.three.background = new THREE.Color(target.color);
          }}">
        </bim-color-input>
        
        
        <bim-number-input 
          slider label="Zoom" value="${map.zoom}" min="0.01" max="0.5" step="0.01" 
          @change="${({ target }: { target: BUI.NumberInput }) => {
            // gui.add(map, "zoom").name("Zoom").min(0.01).max(0.5).step(0.01);
            map.frontOffset = target.value;
          }}">
        </bim-number-input>
                
        <div style="display: flex; gap: 12px">
        
          <bim-number-input slider value="${mapSize.x}" pref="Size X" min="100" max="500" step="10"              
            @change="${({ target }: { target: BUI.NumberInput }) => {
              const size = map.getSize();
              size.x = target.value;
              map.resize(size);
            }}">
          </bim-number-input>        
        
          <bim-number-input slider value="${mapSize.y}" pref="Size Y" min="100" max="500" step="10"            
            @change="${({ target }: { target: BUI.NumberInput }) => {
              const size = map.getSize();
              size.y = target.value;
              map.resize(size);
            }}">
          </bim-number-input>
        </div>
  
        
      </bim-panel-section>
    </bim-panel>
    `;
});

document.body.append(panel);
