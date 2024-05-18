/* eslint import/no-extraneous-dependencies: 0 */

import Stats from "stats.js";

import * as THREE from "three";
import * as BUI from "@thatopen/ui";
import * as OBC from "../..";

/* MD
  ### 📽️ Managing Multiple Views
  ---
  Perspective view adds depth and realism, which helps in creating visually compelling representations in 3D scenes.🛤️
  While, Orthographic view is important for precise measurements and proportions.📐

  :::tip First, let's set up a simple scene!

  👀 If you haven't started there, check out [that tutorial first](SimpleScene.mdx)!

  :::

  We'll be using an advanced camera component for this tutorial.
  OrthoPerspectiveCamera makes it simple to use Orthographic and Perspective projections.

  ### 🎲 Creating a Cube Mesh
  ---
  First, let's create a simple Cube, which will render differently depending on the projection you choose.🧊
  We will create a [Cube](https://threejs.org/docs/index.html?q=box#api/en/geometries/BoxGeometry)
  with `3x3x3` dimensions and use red color for the material.🖍️

  */

const cubeGeometry = new THREE.BoxGeometry();
const cubeMaterial = new THREE.MeshStandardMaterial({ color: "#6528D7" });
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.set(0, 0.5, 0);

/* MD
  ### 🎞️ Developing an OrthoPerspective Camera
  ---

  We will create OrthoPerspectiveCamera by passing `components` as an argument to it.🗃️
  The OrthoPerspective Camera extends the SimpleCamera by providing you with extra controls.

  We will then configure the camera location and update the look at target using `setLookAt()` API.👀

  */

const container = document.getElementById("container")!;

const components = new OBC.Components();

const worlds = components.get(OBC.Worlds);

const world = worlds.create<
  OBC.SimpleScene,
  OBC.OrthoPerspectiveCamera,
  OBC.SimpleRenderer
>();

world.scene = new OBC.SimpleScene(components);
world.renderer = new OBC.SimpleRenderer(components, container);
world.camera = new OBC.OrthoPerspectiveCamera(components);

components.init();

world.scene.setup();

world.camera.controls.setLookAt(3, 3, 3, 0, 0, 0);

world.scene.three.add(cube);
world.meshes.add(cube);

const grids = components.get(OBC.Grids);
const grid = grids.create(world);

/* MD
  
  :::info Igniting Components!

  🔥 Whenever the components like scene, camera are created, you need to initialize the component library.
  Check out components.init() for more info!🔖

  :::

  ### 🕹️ Changing Views and Navigation
  ---
  Now, that our camera setup is done, we need to manage the camera projection on demand.

  #### Toggling Orthographic View and Perspective View

  Let's create a simple method **`toggleProjection()`** which toggles the Camera View using `camera.toggleProjection`.
  Alternatively, you can also use `camera.setProjection()` and pass `'Orthographic'` or `'Perspective'` to manage the views.💡

  */

// @ts-ignore
function toggleProjection() {
  world.camera.projection.toggle();
}

/* MD
    You can also subscribe to an event for when the projection changes. For instance, let's change the grid fading mode
    when the projection changes. This will make the grid look good in orthographic mode:
    */

world.camera.projection.onChanged.add(() => {
  const projection = world.camera.projection.current;
  grid.fade = projection === "Perspective";
});

/* MD
  #### Managing Navigation Modes
  Along with projection, we can also manage Navigation modes using **OrthoPerspective** camera.
  To update navigation modes, we will use `camera.setNavigationMode('Orbit' | 'FirstPerson' | 'Plan')`

  - **Orbit** - Orbit Mode helps us to easily navigate around the 3D Elements.
  - **FirstPerson** - It helps you to visualize scene from your own perspective.
  First Person mode is only available for Perspective Projection.
  - **Plan** - This mode helps you to easily navigate in 2D Projections.

  */

// @ts-ignore
function setNavigationMode(navMode: OBC.NavModeID) {
  world.camera.set(navMode);
}

/* MD
  :::info MORE CONTROLS, MORE POWER

  🧮 OrthoPerspective Camera also provides you an option to adjust your camera to fit the 3D elements.
  You can simply use fitModelToFrame(mesh)
  and provide the mesh which you want to fit to your window frame

  :::

  **Congratulations** 🎉 on completing this tutorial!
  Now you can add Advance Camera System to your web-app in minutes using
  **OrthoPerspectiveCamera** ⌚📽️
  Let's keep it up and check out another tutorial! 🎓

  */

BUI.Manager.registerComponents();

const panel = BUI.Component.create<BUI.PanelSection>(() => {
  return BUI.html`
    <bim-panel active label="Orthoperspective Camera Tutorial" 
      style="position: fixed; top: 5px; right: 5px">
      <bim-panel-section style="padding-top: 10px;">
         
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
