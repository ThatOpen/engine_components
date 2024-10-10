/* MD
### ✂️ Fancy clippings
---

Clipping planes are very common in BIM applications. They are used for floor plans, sections, looking inside a 3D model, etc. But simple clipping planes are not enough: they don't have fills or outlines, which are common in BIM software. The Edges Clipper can do them, and in this tutorial you'll learn how to do it.

:::tip Fills and outlines?

Traditionally, architects created plans with a certain style. For instance, thick lines with solid fill for cutted walls and structure, thin lines for cutted doors and windows, etc. These same conventions are still common in BIM software.

:::

In this tutorial, we will import:

- `three` to create some 3D items.
- `@thatopen/components` to set up the barebone of our app.
- `@thatopen/ui` to add some simple and cool UI menus.
- `@thatopen/components-front` to use some frontend-oriented components.
- `Stats.js` (optional) to measure the performance of our app.
*/

import Stats from "stats.js";
import * as BUI from "@thatopen/ui";
import * as THREE from "three";
import * as OBC from "@thatopen/components";
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
const grid = grids.create(world);
grid.config.color.setHex(0x666666);
world.renderer.postproduction.customEffects.excludedMeshes.push(grid.three);

/* MD

  We'll make the background of the scene transparent so that it looks good in our docs page, but you don't have to do that in your app!

*/

world.scene.three.background = null;

/* MD
  ### 🧩 Adding Objects to Scene
  ---

  Now, let's start by adding two Cubes, we will create a [Box Geometry](https://threejs.org/docs/index.html?q=box#api/en/geometries/BoxGeometry) and use it for both Meshes.

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
  ### ⚔️ Getting the components
  ---

  Now we will get all the components we will use for this small app. These are:
  1. The Raycasters, to create a clipping plane when clicking a cube.
  2. The Clipper to create the clipping planes.
  3. The Clip Edges to create the fills and outlines.

*/

const casters = components.get(OBC.Raycasters);
casters.get(world);

const clipper = components.get(OBC.Clipper);
clipper.enabled = true;

const edges = components.get(OBCF.ClipEdges);
clipper.Type = OBCF.EdgesPlane;

/* MD
  ### 🖌️ Creating the styles
  ---

  Now it's time to create the styles for the clipping planes. We will create two styles, one for each cube. One will be red, and the other will be blue.
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
  Now we need a method for creating clipping planes. For this tutorial, we will use **Double Click**, to create a Clipper that will generate a plane on the 3D object's face.
*/

container.ondblclick = () => {
  if (clipper.enabled) {
    clipper.create(world);
  }
};

/* MD
  ### 🧹 Deleting the Clipping Planes
  ---
  Now that we know how to make multiple clippers, we must also know how to delete them when necessary. Clipping Edges can be removed using `clipper.delete()` or `clipper.delete(plane)`, which deletes a single plane.

*/

window.onkeydown = (event) => {
  if (event.code === "Delete" || event.code === "Backspace") {
    if (clipper.enabled) {
      clipper.delete(world);
    }
  }
};

/* MD
  
  :::tip Delete all Clipping Planes

  ❎ If you want to safely delete all the clipping edges that were created you can simply call
  `clipper.deleteAll()`.

  :::

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
Now we will add some UI to play around with the clipping plane properties. For more information about the UI library, you can check the specific documentation for it!
*/

const panel = BUI.Component.create<BUI.PanelSection>(() => {
  return BUI.html`
  <bim-panel active label="Edges Clipper Tutorial" class="options-menu">
      <bim-panel-section collapsed label="Controls">
      
        <bim-label>Double click: Create clipping plane</bim-label>
        <bim-label>Delete key: Delete clipping plane</bim-label>
       
        
      </bim-panel-section>
      <bim-panel-section collapsed label="Others">
          
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

  That's it! You have created an app that can create, manipulate, edit and delete clipping planes on any 3D object. Congratulations!
*/
