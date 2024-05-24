/* eslint import/no-extraneous-dependencies: 0 */

import * as THREE from "three";
import Stats from "stats.js";
import * as BUI from "@thatopen/ui";
import * as OBC from "@thatopen/components";
import * as OBCF from "../..";

// @ts-ignore

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
grids.config.color.set(0x666666);
const grid = grids.create(world);

// Set up stats

const stats = new Stats();
stats.showPanel(2);
document.body.append(stats.dom);
stats.dom.style.left = "0px";
world.renderer.onBeforeUpdate.add(() => stats.begin());
world.renderer.onAfterUpdate.add(() => stats.end());

/* MD
  ### 🧪 Cool Post-Production Effects
  ---
  Post-production effects enrich your 3D scenes. There are several post-production effects, such as
  adding shadows, rendering outlines, adding ambient occlusion and applying bloom, that can enhance
  and make your scene look cool.🍹

  :::tip First, let's set up a simple scene!

  👀 If you haven't started there, check out [that tutorial first](SimpleScene.mdx)!

  :::

  In this tutorial we will use **Post-Production Renderer** to add neat **Outlines** and **Ambient Occlusion** to the 3D Model.🦾

  ### 🏢 Adding Fragments
  ---
  We'll start by adding a **Fragment** to our scene using Fragment Manager.

  We'll use a simple fragment for the purposes of this tutorial, but the code is capable of handling big files as well.🏗️

  :::info Using Fragment Manager!

  🏋️ There is a dedicated tutorial on how to use Fragment Manager to load **IFC** files!

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

// const meshes = [];

// const culler = new OBC.ScreenCuller(components);
// culler.setup();

// for (const fragment of model.items) {
//   meshes.push(fragment.mesh);
//   culler.elements.add(fragment.mesh);
// }
// culler.elements.needsUpdate = true;

// const controls = cameraComponent.controls;
// controls.addEventListener("controlend", () => {
//   culler.elements.needsUpdate = true;
// });

/* MD
  ### 🎬 Activating the Post-Production
  ---

  We will activate the post-production effect.
  Also, we will enable the visibility for post-production layer.

  - `postproduction.active` - Enable or Disable the active status of the post-processing effect
  - `postproduction.visible` - Toggle the visibility of post-processing layer that is created to display the effect.

  */

const { postproduction } = world.renderer;
postproduction.enabled = true;
postproduction.customEffects.excludedMeshes.push(grid.three);

const ao = postproduction.n8ao.configuration;

BUI.Manager.init();

const panel = BUI.Component.create<BUI.PanelSection>(() => {
  return BUI.html`
    <bim-panel label="Clipper Tutorial" style="position: fixed; top: 5px; right: 5px; max-height: calc(100vh - 10px)" active>
    
      <bim-panel-section collapsed label="Gamma" >
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
  **Congratulations** 🎉 on completing this tutorial! Now you know how to add cool effects easily using
  Post Production 🖼️
  Let's keep it up and check out another tutorial! 🎓
*/
