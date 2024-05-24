/* eslint import/no-extraneous-dependencies: 0 */

import Stats from "stats.js";
import * as BUI from "@thatopen/ui";
import * as THREE from "three";
import * as OBC from "@thatopen/components";
import * as OBCF from "../..";

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

world.renderer.postproduction.enabled = true;
world.renderer.postproduction.customEffects.outlineEnabled = true;

components.init();

world.camera.controls.setLookAt(12, 6, 8, 0, 0, -10);

world.scene.setup();

const grids = components.get(OBC.Grids);
grids.config.color.setHex(0x666666);
const grid = grids.create(world);
world.renderer.postproduction.customEffects.excludedMeshes.push(grid.three);

/* MD
  ### ⭕️ Aesthetic Clipping Edges
  ---

  You can build whole BIM application using Components.💪
  One such essential component is **Edges Clipper** which helps you to add Clipping Planes along
  with beautiful yet functional edges.🖍️

  :::info Advanced but Simple to use

  ⚡️ **Simple Clipper** and **Edges Clipper** are similar, but `Edges Clipper` offers more advanced options.
  If you want to learn more about **[Simple Clipper](SimpleClipper.mdx)**, visit the tutorial.

  :::

  In this tutorial, we'll use the `EdgesClipper` to slice two distinct Cubes that each have a unique set of edge effects.
  With the help of this tutorial, you can quickly add **Clipping Planes** and **Configurable Edges** to your project.🚀

  :::tip First, let's set up a simple scene!

  👀 If you haven't started there, check out [that tutorial first](SimpleScene.mdx)!

  :::

  ### 🧩 Adding Objects to Scene
  ---

  Let's start by adding two Cubes, we will create a [Box Geometry](https://threejs.org/docs/index.html?q=box#api/en/geometries/BoxGeometry) and use it for both Meshes.

  */

const cubeGeometry = new THREE.BoxGeometry(3, 3, 3);

const cubeMaterial = new THREE.MeshStandardMaterial({ color: "#6528D7" });
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.set(-2, 1.5, 0);
world.scene.three.add(cube);
world.meshes.add(cube);

const cube2 = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube2.position.set(2, 1.5, 0);
world.scene.three.add(cube2);
world.meshes.add(cube2);

/* MD
  
  :::info Storing Components

  🧰 After adding cubes to the scene, we must also add them to `components.meshes`,
  which is just an array of all the meshes in the scene.🗄️

  :::

  ### ⚔️ Slicing Some Cubes
  ---

  Now that the setup is complete. Let's get started with the interesting part!
  We will create **[Edges Clipper](../api/classes/components.EdgesClipper)** and pass the **components** and
  **[Edges Plane](../api/classes/components.EdgesPlane)** to the constructor.

  */

const casters = components.get(OBC.Raycasters);
casters.get(world);

const clipper = components.get(OBC.Clipper);
clipper.enabled = true;

const edges = components.get(OBCF.ClipEdges);
clipper.Type = OBCF.EdgesPlane;

/* MD

  :::info PLANE WITH EDGES and TRANSFORMATION CONTROLS

  🟦 **[Edges Plane](../api/classes/components.EdgesPlane)** helps us in adding Clipping Planes to the Clipper Component.

  :::


  ### 🖌️ Creating Fine Edges
  ---

  Let's now prepare the materials that will be visible on the cube edges.

  We will use **[LineMaterial](https://threejs.org/examples/?q=line#webgl_lines_fat)** for creating edges.

  #### 💫 Using Line Material

  After creating the Line Material we will add it to the **clipper**
  using `clipper.styles.create(styleName: string, mesh: Mesh[], material: LineMaterial)`

  */

const blueFill = new THREE.MeshBasicMaterial({ color: "lightblue", side: 2 });
const blueLine = new THREE.LineBasicMaterial({ color: "blue" });
const blueOutline = new THREE.MeshBasicMaterial({
  color: "blue",
  opacity: 0.5,
  side: 2,
  transparent: true,
});

edges.styles.create(
  "Red lines",
  new Set([cube]),
  world,
  blueLine,
  blueFill,
  blueOutline,
);

const salmonFill = new THREE.MeshBasicMaterial({ color: "salmon", side: 2 });
const redLine = new THREE.LineBasicMaterial({ color: "red" });
const redOutline = new THREE.MeshBasicMaterial({
  color: "red",
  opacity: 0.5,
  side: 2,
  transparent: true,
});

edges.styles.create(
  "Blue lines",
  new Set([cube2]),
  world,
  redLine,
  salmonFill,
  redOutline,
);

/* MD
  
  ### 🤝 Performing Clipping Events
  ---
  We need a method for instantly producing a clipping plane;
  this can be accomplished with either a `single click` or a `double click` of the mouse.

  For this tutorial, we will use **Double Click**, to create a Clipper that will generate a
  plane on the 3D object's face.

  */

container.ondblclick = () => clipper.create(world);

/* MD
  
  :::info Raycaster below the hood 🎩

  We use the **[Simple Raycaster](SimpleRaycaster.mdx)** to determine if the intersection has occurred.
  The clipper places a plane after detecting the face on which the mouse was clicked.
  Here, the **EdgesClipper** handles everything for you 😎

  :::

  ### 🧹 Deleting the Clipping Planes
  ---
  Now that we know how to make multiple clippers, we must also know how to delete them when necessary.
  Clipping Edges can be removed using `clipper.delete()` or `clipper.delete(plane)`, which deletes a single plane.

  **clipper.delete()** deletes the plane on which your mouse pointer is now located.

  */

window.onkeydown = (event) => {
  if (event.code === "Delete" || event.code === "Backspace") {
    clipper.delete(world);
  }
};

/* MD
  
  :::tip Delete all Clipping Planes

  ❎ If you want to safely delete all the clipping edges that were created you can simply call
  **`clipper.deleteAll()`**

  :::

  Great job! 🎉 Using the **[Clipper Component](../api/classes/components.SimpleClipper)**,
  you can now effortlessly check BIM models or any other 3D objects with stunning edges.🧐

  Let's keep it up and check out another tutorial! 🎓

  */

const stats = new Stats();
stats.showPanel(2);
document.body.append(stats.dom);
stats.dom.style.left = "0px";
world.renderer.onBeforeUpdate.add(() => stats.begin());
world.renderer.onAfterUpdate.add(() => stats.end());

BUI.Manager.init();

const panel = BUI.Component.create<BUI.PanelSection>(() => {
  return BUI.html`
    <bim-panel label="Clipper Tutorial" style="position: fixed; top: 5px; right: 5px" active>
          <bim-panel-section fixed label="Commands" >
      
        <bim-label label="Double click: Create clipping plane"></bim-label>
        <bim-label label="Delete key: Delete clipping plane"></bim-label>
       
        
      </bim-panel-section>
      <bim-panel-section fixed label="Others" >
          
        <bim-checkbox label="Clipper enabled" checked 
          @change="${({ target }: { target: BUI.Checkbox }) => {
            clipper.enabled = target.value;
            edges.visible = target.value;
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
          label="Rotate cubes" 
          @click="${() => {
            cube.rotation.x = 2 * Math.PI * Math.random();
            cube.rotation.y = 2 * Math.PI * Math.random();
            cube.rotation.z = 2 * Math.PI * Math.random();
            cube.updateMatrixWorld();

            cube2.rotation.x = 2 * Math.PI * Math.random();
            cube2.rotation.y = 2 * Math.PI * Math.random();
            cube2.rotation.z = 2 * Math.PI * Math.random();
            cube2.updateMatrixWorld();

            edges.update(true);
          }}">  
        </bim-button>
       
        
      </bim-panel-section>
    </bim-panel>
    `;
});

document.body.append(panel);
