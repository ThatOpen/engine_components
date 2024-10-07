/* MD
### 🗺️ Orientating your user in the scene
---

In this tutorial you'll learn how to use the Minimap, which is a small 2D representation of the 3D world.

:::tip Do you mean a floorplan?

Not quite. The minimap is a simple 2D representation of the 3D world. It is useful to help your user understand where they are, and to have a simple top view of their surrounding. 

:::

In this tutorial, we will import:

- `@thatopen/components` to set up the barebone of our app.
- `@thatopen/ui` to add some simple and cool UI menus.
- `Stats.js` (optional) to measure the performance of our app.

*/

import Stats from "stats.js";
import * as BUI from "@thatopen/ui";
import * as OBC from "@thatopen/components";

/* MD
  ### 🌎 Setting up a simple scene
  ---

  We will start by creating a simple scene with a camera and a renderer. If you don't know how to set up a scene, you can check the Worlds tutorial.

*/

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

  We'll make the background of the scene transparent so that it looks good in our docs page, but you don't have to do that in your app!

*/

world.scene.three.background = null;

/* MD
  ### 🏠 Loading a model
  ---

 Now that we have a scene, let's load a model. We will use the Fragment Manager for it. 
 
   :::info Showing Fragments in the Scene

  🏔️ There is a dedicated tutorial on how to use Fragment Manager to load **IFC files**, check it out if you haven't already!

  :::

  */

const fragments = new OBC.FragmentsManager(components);

const file = await fetch(
  "https://thatopen.github.io/engine_components/resources/small.frag",
);
const dataBlob = await file.arrayBuffer();
const buffer = new Uint8Array(dataBlob);
const model = fragments.load(buffer);
world.scene.three.add(model);

/* MD

  ### 🗺 Setting up the map
  ---

  Now, that we have our setup ready. Let's start with the exciting stuff.
  We will use MiniMap component, which does all the work for us.🔮

*/

const maps = new OBC.MiniMaps(components);
const map = maps.create(world);

/* MD

  We have already created a simple DIV element with id `minimap` in our HTML file. We need to fetch it to add the canvas where our minimap is rendered to it. We'll also add a rounded border to make it look better.

*/

const mapContainer = document.getElementById("minimap") as HTMLDivElement;
const canvas = map.renderer.domElement;
canvas.style.borderRadius = "12px";
mapContainer.append(canvas);
map.resize();

/* MD
  ### ⏱️ Measuring the performance (optional)
  ---

  We'll use the [Stats.js](https://github.com/mrdoob/stats.js) to measure the performance of our app. We will add it to the top left corner of the viewport. This way, we'll make sure that the memory consumption and the FPS of our app are under control.

*/

const stats = new Stats();
stats.showPanel(2);
document.body.append(stats.dom);
stats.dom.style.left = "0px";
stats.dom.style.zIndex = "unset";
world.renderer.onBeforeUpdate.add(() => stats.begin());
world.renderer.onAfterUpdate.add(() => stats.end());

/* MD
  ### 🧩 Adding some UI
  ---

  We will use the `@thatopen/ui` library to add some simple and cool UI elements to our app. First, we need to call the `init` method of the `BUI.Manager` class to initialize the library:

*/

BUI.Manager.init();

/* MD
  we'll also need a reference to the  size of the minimap to control it:
*/

const mapSize = map.getSize();

/* MD
  Now we will create a new panel with some inputs to control the different parameters of the MiniMap, like zoom, size and front offset. For more information about the UI library, you can check the specific documentation for it!
*/

const panel = BUI.Component.create<BUI.PanelSection>(() => {
  return BUI.html`
    <bim-panel label="Minimap Tutorial" class="options-menu">
      <bim-panel-section collapsed label="Controls">
      
        <bim-checkbox checked="true" label="Enabled" 
          @change="${({ target }: { target: BUI.Checkbox }) => {
            map.enabled = target.value;
          }}">  
        </bim-checkbox>
        
        <bim-checkbox checked="true" label="Visible" 
          @change="${({ target }: { target: BUI.Checkbox }) => {
            map.config.visible = target.value;
          }}">  
        </bim-checkbox>
        
        <bim-checkbox checked label="Lock rotation" 
          @change="${({ target }: { target: BUI.Checkbox }) => {
            map.config.lockRotation = target.value;
          }}">  
        </bim-checkbox>
        
        <bim-number-input 
          slider label="Zoom" value="${map.zoom}" min="0.01" max="0.5" step="0.01" 
          @change="${({ target }: { target: BUI.NumberInput }) => {
            map.config.zoom = target.value;
          }}">
        </bim-number-input>
        
        <bim-number-input 
          slider label="Front offset" value="${map.frontOffset}" min="0" max="5" step="1" 
          @change="${({ target }: { target: BUI.NumberInput }) => {
            map.config.frontOffset = target.value;
          }}">
        </bim-number-input>
                
        <div style="display: flex; gap: 12px">
        
          <bim-number-input slider value="${mapSize.x}" pref="Size X" min="100" max="500" step="10"              
            @change="${({ target }: { target: BUI.NumberInput }) => {
              map.config.sizeX = target.value;
            }}">
          </bim-number-input>        
        
          <bim-number-input slider value="${mapSize.y}" pref="Size Y" min="100" max="500" step="10"            
            @change="${({ target }: { target: BUI.NumberInput }) => {
              map.config.sizeY = target.value;
            }}">
          </bim-number-input>
        </div>
  
        
      </bim-panel-section>
    </bim-panel>
    `;
});

document.body.append(panel);

/* MD
  And we will make some logic that adds a button to the screen when the user is visiting our app from their phone, allowing to show or hide the menu. Otherwise, the menu would make the app unusable.
*/

const button = BUI.Component.create<BUI.PanelSection>(() => {
  return BUI.html`
      <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
        @click="${() => {
          if (panel.classList.contains("options-menu-visible")) {
            panel.classList.remove("options-menu-visible");
          } else {
            panel.classList.add("options-menu-visible");
          }
        }}">
      </bim-button>
    `;
});

document.body.append(button);

/* MD
  ### 🎉 Wrap up
  ---

  That's it! You have created a simple app that loads a BIM model and displays a MiniMap of it. You can play around with the different parameters of the MiniMap and see how it changes in real time.

*/
