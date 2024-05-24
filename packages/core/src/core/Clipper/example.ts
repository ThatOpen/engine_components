/* eslint import/no-extraneous-dependencies: 0 */

import * as THREE from "three";
import Stats from "stats.js";
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

world.camera.controls.setLookAt(10, 10, 10, 0, 0, 0);

world.scene.setup();

/* MD
  ### ✂️ Clipping Tool
  ---
  The Clipping Tool is a powerful feature in 3D modelling that helps you dissect 3D objects.
  Clipping Tool is useful for inspecting and analyzing objects in detail.💪

  In this tutorial, we will use the Clipping Tool to dissect a Cube using planes and transformation controls.
  This tutorial will help you add Clipping functionality to your project easily.🚀

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
    */

world.scene.three.add(cube);
world.meshes.add(cube);

const casters = components.get(OBC.Raycasters);
casters.get(world);

/* MD
  ### ⚙️ Adding Simple Clipper
  ---
  Here comes the interesting part, we will add a Simple Clipper to our scene 🥁
  A **[Simple Clipper](../api/classes/components.SimpleClipper)** requires two things: `components` and `Simple Plane`
  */

const clipper = new OBC.Clipper(components);

/* MD

  :::info PLANE WITH TRANSFORMATION CONTROLS AND MORE

  **[Simple Plane](../api/classes/components.SimplePlane)** is useful in generating planes along with
  customizations.

  :::

  **SimpleClipper** includes everything needed to provide clipping capabilities,
  including the ability to build numerous clipping planes.

  SimpleClipper also controls the SimplePlane internally,
  allowing you to execute clipping on any 3D object by just dragging the planes.

  */

clipper.enabled = true;

/* MD

  ### 🤝 Performing Clipping Events
  ---
  Now, we need a way to create a Clipping Plane on demand, you can do it with a `Single Click` or
  `Double Click` of a mouse.

  For this tutorial, we will use **Double Click**, to create a Clipper that will generate a
  plane on the 3D object's face.

  */

container.ondblclick = () => clipper.create(world);

/* MD

  :::info Raycaster below the hood 🎩

  We use the **[Simple Raycaster](SimpleRaycaster.mdx)** to determine if the intersection has occurred.
  The clipper places a plane after detecting the face on which the mouse was clicked.
  Here, the SimpleClipper handles everything for you 😎

  :::

  ### 🧹 Deleting the Clipping Planes
  ---
  Now that we know how to make multiple clippers, we must also know how to delete them when necessary.
  Clipping planes can be removed using `clipper.delete()` or `clipper.delete(plane)`, which deletes a single plane.

  **clipper.delete()** deletes the plane on which your mouse pointer is now located.

  */

window.onkeydown = (event) => {
  if (event.code === "Delete" || event.code === "Backspace") {
    clipper.delete(world);
  }
};

/* MD

  :::tip Delete all the Clipping Planes
  ❎ If you want to safely delete all the clipping planes that were created you can simply call
  **`clipper.deleteAll()`**
  :::

  **Congratulations** 🎉 on completing this tutorial! Now you can inspect BIM Models or any 3D Object easily using
  **[Clipper Component](../api/classes/components.SimpleClipper)** 🧐
  Let's keep it up and check out another tutorial! 🎓
  */

// Set up stats

const stats = new Stats();
stats.showPanel(2);
document.body.append(stats.dom);
stats.dom.style.left = "0px";
world.renderer.onBeforeUpdate.add(() => stats.begin());
world.renderer.onAfterUpdate.add(() => stats.end());

// Set up UI

BUI.Manager.init();

const panel = BUI.Component.create<BUI.PanelSection>(() => {
  return BUI.html`
    <bim-panel label="Clipper Tutorial" style="position: fixed; top: 5px; right: 5px" active>
          <bim-panel-section fixed label="Commands">
      
        <bim-label label="Double click: Create clipping plane"></bim-label>
        <bim-label label="Delete key: Delete clipping plane"></bim-label>
       
        
      </bim-panel-section>
      <bim-panel-section fixed label="Others"">
          
        <bim-checkbox label="Clipper enabled" checked 
          @change="${({ target }: { target: BUI.Checkbox }) => {
            clipper.enabled = target.value;
          }}">
        </bim-checkbox>
        
        <bim-checkbox label="Clipper visible" checked 
          @change="${({ target }: { target: BUI.Checkbox }) => {
            clipper.visible = target.value;
          }}">
        </bim-checkbox>
      
        <bim-color-input 
          label="Planes Color" color="#202932" 
          @input="${({ target }: { target: BUI.ColorInput }) => {
            clipper.material.color.set(target.color);
          }}">
        </bim-color-input>
        
        <bim-number-input 
          slider step="0.01" label="Planes opacity" value="0.2" min="0.1" max="1"
          @change="${({ target }: { target: BUI.NumberInput }) => {
            clipper.material.opacity = target.value;
          }}">
        </bim-number-input>
        
        <bim-number-input 
          slider step="0.1" label="Planes size" value="5" min="2" max="10"
          @change="${({ target }: { target: BUI.NumberInput }) => {
            clipper.size = target.value;
          }}">
        </bim-number-input>
        
        <bim-button 
          label="Delete all" 
          @click="${() => {
            clipper.deleteAll();
          }}">  
        </bim-button>        
        
        <bim-button 
          label="Rotate cube" 
          @click="${() => {
            cube.rotation.x = 2 * Math.PI * Math.random();
            cube.rotation.y = 2 * Math.PI * Math.random();
            cube.rotation.z = 2 * Math.PI * Math.random();
          }}">  
        </bim-button>
       
        
      </bim-panel-section>
    </bim-panel>
    `;
});

document.body.append(panel);
