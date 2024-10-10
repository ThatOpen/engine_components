/* MD
### 🎥 Great graphics
---

  Postproduction effects enrich your 3D scenes. There are several post-production effects, such as adding shadows, rendering outlines, adding ambient occlusion and applying bloom, that can enhance and make your scene look cool. In this tutorial, you'll learn how to do it.

:::tip Postproduction?

The simple Three.js renderer isn't bad, but it's pretty basic. Postproduction are a collection of effects you can add to your scene to make it look much better. Of course, this means consuming more resources, but luckily for us, the power of devices is proportional to the size of its screen, so we should be able to enjoy this beauty in most scene even from our smartphones!

:::

In this tutorial, we will import:

- `three` to create some 3D items.
- `@thatopen/components` to set up the barebone of our app.
- `@thatopen/ui` to add some simple and cool UI menus.
- `@thatopen/components-front` to use some frontend-oriented components.
- `Stats.js` (optional) to measure the performance of our app.
*/

import * as THREE from "three";
import Stats from "stats.js";
import * as BUI from "@thatopen/ui";
import * as OBC from "@thatopen/components";
import * as OBCF from "@thatopen/components-front";

/* MD
  ### 🌎 Setting up a simple scene
  ---

  We will start by creating a simple scene with a camera and a renderer. If you don't know how to set up a scene, you can check the Worlds tutorial. Notice how we use the PostproductionRenderer in this case.
*/

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

world.scene.three.background = null;

components.init();

world.camera.controls.setLookAt(12, 6, 8, 0, 0, -10);

world.scene.setup();

const grids = components.get(OBC.Grids);
const grid = grids.create(world);
grid.config.color.set(0x666666);

/* MD

  We'll make the background of the scene transparent so that it looks good in our docs page, but you don't have to do that in your app!

*/

world.scene.three.background = null;

/* MD
  ### 🧳 Loading a BIM model
  ---

 We'll start by adding a BIM model to our scene. That model is already converted to fragments, so it will load much faster than if we loaded the IFC file.

  :::tip Fragments?

    If you are not familiar with fragments, check out the IfcLoader tutorial!

  :::
*/

const fragments = new OBC.FragmentsManager(components);
const file = await fetch(
  "https://thatopen.github.io/engine_components/resources/small.frag",
);
const data = await file.arrayBuffer();
const buffer = new Uint8Array(data);
const model = fragments.load(buffer);
world.scene.three.add(model);

/* MD
  ### 🎬 Turning on the Postproduction
  ---

  Now we will activate the postproduction effect and enable the visibility for postproduction layer.

*/

const { postproduction } = world.renderer;
postproduction.enabled = true;
postproduction.customEffects.excludedMeshes.push(grid.three);
const ao = postproduction.n8ao.configuration;

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
Now we will add some UI to control some of the most common postproduction parameters. For more information about the UI library, you can check the specific documentation for it!
*/

const panel = BUI.Component.create<BUI.PanelSection>(() => {
  return BUI.html`
  <bim-panel active label="Postproduction Tutorial" class="options-menu">
      <bim-panel-section collapsed label="Gamma">
        <bim-checkbox checked label="Gamma Correction"
          @change="${({ target }: { target: BUI.Checkbox }) => {
            postproduction.setPasses({ gamma: target.value });
          }}">
        </bim-checkbox>
      </bim-panel-section>
      
      <bim-panel-section collapsed label="Custom effects" >
        <bim-checkbox checked label="Custom effects"
          @change="${({ target }: { target: BUI.Checkbox }) => {
            postproduction.setPasses({ custom: target.value });
          }}">
        </bim-checkbox>    
        
        <bim-checkbox checked label="Gamma Correction"
          @change="${({ target }: { target: BUI.Checkbox }) => {
            postproduction.customEffects.glossEnabled = target.value;
          }}">
        </bim-checkbox>   
      
        <bim-number-input 
          slider step="0.01" label="Opacity" 
          value="${postproduction.customEffects.opacity}" min="0" max="1"
          @change="${({ target }: { target: BUI.NumberInput }) => {
            postproduction.customEffects.opacity = target.value;
          }}">
        </bim-number-input>  
            
        <bim-number-input 
          slider step="0.1" label="Tolerance" 
          value="${postproduction.customEffects.tolerance}" min="0" max="6"
          @change="${({ target }: { target: BUI.NumberInput }) => {
            postproduction.customEffects.tolerance = target.value;
          }}">
        </bim-number-input> 
                      
        <bim-color-input label="Line color" 
          @input="${({ target }: { target: BUI.ColorInput }) => {
            const color = new THREE.Color(target.value.color);
            postproduction.customEffects.lineColor = color.getHex();
          }}">
        </bim-color-input>  
      
        <bim-number-input 
          slider label="Gloss exponent" step="0.1" 
          value="${postproduction.customEffects.glossExponent}" min="0" max="5"
          @change="${({ target }: { target: BUI.NumberInput }) => {
            postproduction.customEffects.glossExponent = target.value;
          }}">
        </bim-number-input>    
           
        <bim-number-input 
          slider label="Max gloss" step="0.05" 
          value="${postproduction.customEffects.maxGloss}" min="-2" max="2"
          @change="${({ target }: { target: BUI.NumberInput }) => {
            postproduction.customEffects.maxGloss = target.value;
          }}">
        </bim-number-input>  
                  
        <bim-number-input 
          slider label="Min gloss" step="0.05" 
          value="${postproduction.customEffects.minGloss}" min="-2" max="2"
          @change="${({ target }: { target: BUI.NumberInput }) => {
            postproduction.customEffects.minGloss = target.value;
          }}">
        </bim-number-input> 
        
      </bim-panel-section>
      
      <bim-panel-section collapsed label="Ambient Oclussion">
      
        <bim-checkbox label="AO enabled"
          @change="${({ target }: { target: BUI.Checkbox }) => {
            postproduction.setPasses({ ao: target.value });
          }}">
        </bim-checkbox>  
                
        <bim-checkbox checked label="Half resolution"
          @change="${({ target }: { target: BUI.Checkbox }) => {
            ao.halfRes = target.value;
          }}">
        </bim-checkbox>  
                      
        <bim-checkbox label="Screen space radius"
          @change="${({ target }: { target: BUI.Checkbox }) => {
            ao.screenSpaceRadius = target.value;
          }}">
        </bim-checkbox>
        
                              
        <bim-color-input label="AO color" 
          @input="${({ target }: { target: BUI.ColorInput }) => {
            const color = new THREE.Color(target.value.color);
            ao.color.r = color.r;
            ao.color.g = color.g;
            ao.color.b = color.b;
          }}">
        </bim-color-input>     
        
        <bim-number-input 
          slider label="AO Samples" step="1" 
          value="${ao.aoSamples}" min="1" max="16"
          @change="${({ target }: { target: BUI.NumberInput }) => {
            ao.aoSamples = target.value;
          }}">
        </bim-number-input>    
            
        <bim-number-input 
          slider label="Denoise Samples" step="1" 
          value="${ao.denoiseSamples}" min="1" max="16"
          @change="${({ target }: { target: BUI.NumberInput }) => {
            ao.denoiseSamples = target.value;
          }}">
        </bim-number-input>   
                  
        <bim-number-input 
          slider label="Denoise Radius" step="1" 
          value="${ao.denoiseRadius}" min="0" max="100"
          @change="${({ target }: { target: BUI.NumberInput }) => {
            ao.denoiseRadius = target.value;
          }}">
        </bim-number-input>   
                       
        <bim-number-input 
          slider label="AO Radius" step="1" 
          value="${ao.aoRadius}" min="0" max="16"
          @change="${({ target }: { target: BUI.NumberInput }) => {
            ao.aoRadius = target.value;
          }}">
        </bim-number-input>  
                              
        <bim-number-input 
          slider label="Distance falloff" step="1" 
          value="${ao.distanceFalloff}" min="0" max="16"
          @change="${({ target }: { target: BUI.NumberInput }) => {
            ao.distanceFalloff = target.value;
          }}">
        </bim-number-input> 
                                      
        <bim-number-input 
          slider label="Intensity" step="1" 
          value="${ao.intensity}" min="0" max="16"
          @change="${({ target }: { target: BUI.NumberInput }) => {
            ao.intensity = target.value;
          }}">
        </bim-number-input> 
        
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

  That's it! You have created an app that looks great thanks to postproduction and exposes a menu to allow the user control it in real time.
*/
