/* MD
### 📹 How to handle a fancy camera
---

Sometimes, you need perspective for depth and realism. Other times, you need an orthographic camera to get precise measurements and proportions. Luckily for you, we have a camera that has both of those projections at the same time! It also has some cool functionality for navigation. In this tutorial, you'll learn to use it. 

:::tip Orthographic and Perspective cameras

The difference between Orthographic and Perspective cameras is that Orthographic cameras don't see things smaller when they are further away. This has some implications, like the camera being always "outside" of your scene. You can't see the interior of a room with an orthographic camera. The most common use for orthographic cameras are 2D floor plans and sections, but they can also be used to create cool-looking 3D scenes.

:::

In this tutorial, we will import:

- `Three.js` to get some 3D entities for our app.
- `@thatopen/components` to set up the barebone of our app.
- `@thatopen/ui` to add some simple and cool UI menus.
- `Stats.js` (optional) to measure the performance of our app.

*/

import Stats from "stats.js";
import * as THREE from "three";
import * as BUI from "@thatopen/ui";
import * as OBC from "@thatopen/components";

/* MD
  ### 🌎 Setting up the world AND the camera
  ---

  We will start by creating a simple scene with a camera and a renderer. If you don't know how to set up a scene, you can check the Worlds tutorial. But there's one difference: we will use the OrthoPerspectiveCamera for initializing the world.

*/

const container = document.getElementById("container")!;
let components = new OBC.Components();
let worlds = components.get(OBC.Worlds);

let world = worlds.create<
  OBC.SimpleScene,
  OBC.OrthoPerspectiveCamera,
  OBC.SimpleRenderer
>();

world.scene = new OBC.SimpleScene(components);
world.renderer = new OBC.SimpleRenderer(components, container);
world.camera = new OBC.OrthoPerspectiveCamera(components);

world.scene.setup();

await world.camera.controls.setLookAt(3, 3, 3, 0, 0, 0);

components.init();

/* MD

  We'll make the background of the scene transparent so that it looks good in our docs page, but you don't have to do that in your app!

*/

world.scene.three.background = null;

/* MD

  Easy, right? Believe it or not, this is all you need to use the OrthoPerspectiveCamera. Now, let's see it in action!


  ### 🧊 Creating a cube
  ---

  We will start by creating a simple cube and a grid that will serve as a reference point for our camera.

*/

let cubeGeometry = new THREE.BoxGeometry();
let cubeMaterial = new THREE.MeshStandardMaterial({ color: "#6528D7" });
let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.set(0, 0.5, 0);

world.scene.three.add(cube);
world.meshes.add(cube);

let grids = components.get(OBC.Grids);
let grid = grids.create(world);

/* MD
  ### 🎟️ Using camera events
  ---

  The OrthoPerspectiveCamera has a few events that you can use to manage the your scene. We will use the `camera.projection.onChanged` event to update the grid, so that when using the Orthographic camera, the grid will fade out if the camera zooms away a lot.
*/

world.camera.projection.onChanged.add(() => {
  const projection = world.camera.projection.current;
  grid.fade = projection === "Perspective";
});

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
  ### 🧩 Building a camera UI
  ---

  Now we will use @thatopen/ui to create a simple UI for the OrthoPerspectiveCamera. It will have 4 elements: 

  #### 🎛️ Navigation mode

  This will control the navigation mode of the OrthoPerspectiveCamera. It will have 3 options: 
  
  - `Orbit`: for 3D orbiting around the scene.
  - `FirstPerson`: for navigating the scene in with the mouse wheel in first person.
  - `Plan`: for navigating 2d plans (blocking the orbit).

  #### 📐 Projections

  Like its name implies, the OrthoPerspectiveCamera has 2 projections, and it's really easy to toggle between them. The camera position will remain the same, which is really convenient when you switch between different projections!

  #### ❌ Toggling user input

  Sometimes you might want to remove control from the user. For example, imagine you are animating the camera and you don't want the user to move the camera around. You can use the `setUserInput` method to toggle this.

  #### 🔎 Focusing objects

  The OrthoPerspectiveCamera has a `fit` method that will fit the camera to a list of meshes. This is really useful when you want to bring attention to a specific part of the scene, or for allowing your user to navigate the scene by focusing objects.
    
*/

BUI.Manager.init();

const panel = BUI.Component.create<BUI.PanelSection>(() => {
  return BUI.html`
    <bim-panel active label="Orthoperspective Camera Tutorial" class="options-menu">
      <bim-panel-section collapsed label="Controls">
         
          <bim-dropdown required label="Navigation mode" 
            @change="${({ target }: { target: BUI.Dropdown }) => {
              const selected = target.value[0] as OBC.NavModeID;

              const { current } = world.camera.projection;
              const isOrtho = current === "Orthographic";
              const isFirstPerson = selected === "FirstPerson";
              if (isOrtho && isFirstPerson) {
                alert("First person is not compatible with ortho!");
                target.value[0] = world.camera.mode.id;
                return;
              }
              world.camera.set(selected);
            }}">

          <bim-option checked label="Orbit"></bim-option>
          <bim-option label="FirstPerson"></bim-option>
          <bim-option label="Plan"></bim-option>
        </bim-dropdown>
         
      
        <bim-dropdown required label="Camera projection" 
            @change="${({ target }: { target: BUI.Dropdown }) => {
              const selected = target.value[0] as OBC.CameraProjection;
              const isOrtho = selected === "Orthographic";
              const isFirstPerson = world.camera.mode.id === "FirstPerson";
              if (isOrtho && isFirstPerson) {
                alert("First person is not compatible with ortho!");
                target.value[0] = world.camera.projection.current;
                return;
              }
              world.camera.projection.set(selected);
            }}">
          <bim-option checked label="Perspective"></bim-option>
          <bim-option label="Orthographic"></bim-option>
        </bim-dropdown>

        <bim-checkbox 
          label="Allow user input" checked 
          @change="${({ target }: { target: BUI.Checkbox }) => {
            world.camera.setUserInput(target.checked);
          }}">  
        </bim-checkbox>  
        
        <bim-button 
          label="Fit cube" 
          @click="${() => {
            world.camera.fit([cube]);
          }}">  
        </bim-button>
        
        <bim-button 
          label="Reset scene" 
          @click="${async () => {
            components.dispose();

            components = new OBC.Components();
            worlds = components.get(OBC.Worlds);

            world = worlds.create<
              OBC.SimpleScene,
              OBC.OrthoPerspectiveCamera,
              OBC.SimpleRenderer
            >();

            world.scene = new OBC.SimpleScene(components);
            world.renderer = new OBC.SimpleRenderer(components, container);
            world.camera = new OBC.OrthoPerspectiveCamera(components);

            world.scene.setup();

            await world.camera.controls.setLookAt(3, 3, 3, 0, 0, 0);

            components.init();

            world.scene.three.background = null;

            cubeGeometry = new THREE.BoxGeometry();
            cubeMaterial = new THREE.MeshStandardMaterial({ color: "#6528D7" });
            cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
            cube.position.set(0, 0.5, 0);

            world.scene.three.add(cube);
            world.meshes.add(cube);

            grids = components.get(OBC.Grids);
            grid = grids.create(world);

            world.camera.projection.onChanged.add(() => {
              const projection = world.camera.projection.current;
              grid.fade = projection === "Perspective";
            });
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

  That's it! We have created an OrthoPerspective camera that can be used to navigate a 3D scene with multiple projections and navigation modes, as well as a neat UI to control it. Great job!

*/
