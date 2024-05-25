

import * as THREE from "three";
import * as OBC from "@thatopen/components";
import Stats from "stats.js";
import * as BUI from "@thatopen/ui";
import * as OBCF from "../..";

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
grids.config.color.setHex(0xdddddd);
grids.create(world);

/* MD
  ### 🌒 Adding Realism
  ---
  Have you ever wondered what makes a scene look realistic?
  Adding **Shadow** to 3D objects may quickly add depth to your creations.😎

  In this tutorial, we'll show you how to use Shadow Dropper to quickly apply shadows.
  In less than 5 minutes, you can create realistic shadows for all the meshes inside your scene.⏱️

  :::tip First, let's set up a simple scene!

  👀 If you haven't started there, check out [that tutorial first](SimpleScene.mdx)!

  :::

  ### 🎲 Creating a Cube Mesh
  ---
  Let's start by adding a Cube, which we can dissect.
  We will create a [Cube](https://threejs.org/docs/index.html?q=box#api/en/geometries/BoxGeometry)
  with `3x3x3` dimensions and use red color for the material.

  */

const cubeGeometry = new THREE.BoxGeometry(3, 3, 3);
const cubeMaterial = new THREE.MeshStandardMaterial({ color: "#6528D7" });
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.set(0, 1.5, 0);

/* MD

  Now, we will add the Cube to the `Scene`. We must also add the **cube** to `components.meshes`,
  which is simply an array of all the meshes in the Scene 🗄️.

  **`components.meshes`** acts as a store to help you manage your elements centrally.

  */

world.scene.three.background = new THREE.Color("white");
world.scene.three.add(cube);
world.meshes.add(cube);

/* MD
  ### 🌚 Adding Beautiful Shadow
  ---
  This completes our scene setup. Let's now include Shadows,
  we'll use **`ShadowDropper`** and pass `components` as an argument to it.🔗

  */

const shadows = new OBCF.ShadowDropper(components);

/* MD

  Shadow Dropper Component not only adds shadows to the scene, but it also helps you manage the **Shadows**.
  To obtain the required results, you can alter the `ShadowDropper` parameters.🔧

  */

shadows.shadowExtraScaleFactor = 15;
shadows.shadowOffset = 0.1;

/* MD
  - `shadowExtraScalarFactor` - With this, the shadow's area of impact can be adjusted.
  - `darkness` - This is used to increase or decrease the intensity of Shadow.

  :::info SHADOW and realism ✨

  Read the **Shadow Dropper** API for more on this.
  The Shadow Dropper API offers more configuration options to render realistic shadows.

  :::

  ### 🎨 Rendering Shadow
  ---
  Now, we will use Shadow Dropper to create shadows for the element.
  We will use **`renderShadow()`** to generate shadow for the `cube` we created.

  */

const shadowID = "example";
shadows.create([cube], shadowID, world);

/* MD

  **renderShadow** requires two parameter, the `element` and a `shadowID`.
  **shadowID** needs to be unique for the entire scene.

  :::tip Deleting Shadows

  ❎ If you want to safely delete the shadow using **shadowID** you can call
  **`shadows.deleteShadow(shadowId);`**

  :::

  **Congratulations** 🎉 on completing this tutorial!
  Now you can add shadows to BIM Models or any 3D Object in minutes using
  **Shadow Dropper** 🌗
  Let's keep it up and check out another tutorial! 🎓
  */

BUI.Manager.init();

const panel = BUI.Component.create<BUI.PanelSection>(() => {
  return BUI.html`
    <bim-panel active label="Shadow Dropper Tutorial" 
      style="position: fixed; top: 5px; right: 5px">
      <bim-panel-section style="padding-top: 10px;">
          
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

// Set up stats

const stats = new Stats();
stats.showPanel(2);
document.body.append(stats.dom);
stats.dom.style.left = "0px";
world.renderer.onBeforeUpdate.add(() => stats.begin());
world.renderer.onAfterUpdate.add(() => stats.end());
