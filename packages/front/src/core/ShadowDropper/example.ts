/* MD
### ⛱️ Dropping shadows
---

Shadows are usually not very performant. But there's a small trick that allows us to have a neat projected shadow under our models that make our apps look great with almost zero performance impact. In this tutorial, you'll learn how to use it.

:::tip Dropped shadows?

Generally, there are 2 types of shadows: self shadows (the ones that an object project on itself) and projected shadows (the ones that are casted to other objects). Both are computationally expensive to compute, but in this tutorial we'll bake and display a very neat shadow that has no performance impact.

:::

In this tutorial, we will import:

- `web-ifc` to get some IFC items.
- `@thatopen/ui` to add some simple and cool UI menus.
- `@thatopen/components` to set up the barebone of our app.
- `@thatopen/components-front` to use some frontend-oriented components.
- `Stats.js` (optional) to measure the performance of our app.
*/

import * as THREE from "three";
import * as OBC from "@thatopen/components";
import Stats from "stats.js";
import * as BUI from "@thatopen/ui";
import * as OBCF from "@thatopen/components-front";

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
  OBCF.RendererWith2D
>();

world.scene = new OBC.SimpleScene(components);
world.renderer = new OBCF.RendererWith2D(components, container);
world.camera = new OBC.SimpleCamera(components);

world.scene.setup();

components.init();

world.camera.controls.setLookAt(5, 5, 5, 0, 0, 0);

container.appendChild(world.renderer.three2D.domElement);

const grids = components.get(OBC.Grids);
const grid = grids.create(world);
grid.config.color.setHex(0xdddddd);

/* MD
  ### 🎲 Creating a Cube Mesh
  ---
  Let's start by adding a simple [Cube](https://threejs.org/docs/index.html?q=box#api/en/geometries/BoxGeometry) to our scene.
*/

const cubeGeometry = new THREE.BoxGeometry(3, 3, 3);
const cubeMaterial = new THREE.MeshStandardMaterial({ color: "#6528D7" });
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.set(0, 1.5, 0);
world.scene.three.add(cube);
world.meshes.add(cube);

/* MD
  Next, we'll make the background of our scene white to make the shadow more visible. Of course, this is not compulsory, but shadows are a bit harder to see on darker backgrounds.
*/

world.scene.three.background = new THREE.Color("white");

/* MD
  ### 🌚 Adding Beautiful Shadow
  ---
  
  Now, to add a shadow, we can simply get an instance of the shadow dropper, which will make all the heavy lifting for us:

*/

const shadows = components.get(OBCF.ShadowDropper);
shadows.shadowExtraScaleFactor = 15;
shadows.shadowOffset = 0.1;

/* MD
  ### 🎨 Rendering the shadow
  ---
  Now, we will use shadow dropper to create shadows for the cube we created before. Of course, this would also work for your BIM models exactly the same way.
*/

const shadowID = "example";
shadows.create([cube], shadowID, world);

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
Now we will add some UI to control and re-render the shadow we have created. For more information about the UI library, you can check the specific documentation for it!
*/

const panel = BUI.Component.create<BUI.PanelSection>(() => {
  return BUI.html`
  <bim-panel active label="Shadow dropper Tutorial" class="options-menu">
    <bim-panel-section collapsed label="Controls">
          
        <bim-number-input 
          slider label="Extra scale factor" step="1" 
          value="${shadows.shadowExtraScaleFactor}" min="0" max="20"
          @change="${({ target }: { target: BUI.NumberInput }) => {
            shadows.shadowExtraScaleFactor = target.value;
            shadows.deleteShadow(shadowID);
            shadows.create([cube], shadowID, world);
          }}">
        </bim-number-input> 
                  
        <bim-number-input 
          slider label="Amount" step="1" 
          value="${shadows.amount}" min="0" max="20"
          @change="${({ target }: { target: BUI.NumberInput }) => {
            shadows.amount = target.value;
            shadows.deleteShadow(shadowID);
            shadows.create([cube], shadowID, world);
          }}">
        </bim-number-input>    
                       
        <bim-number-input 
          slider label="Shadow offset" step="0.01" 
          value="${shadows.shadowOffset}" min="0" max="3"
          @change="${({ target }: { target: BUI.NumberInput }) => {
            shadows.shadowOffset = target.value;
            shadows.deleteShadow(shadowID);
            shadows.create([cube], shadowID, world);
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

  That's it! You have created a scene where you can create a super efficient projected shadow on any object. Congratulations!
*/
