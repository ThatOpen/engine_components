/* MD
  ## 📄 Handling Fancy Cameras
  ---
  Sometimes, you need perspective for depth and realism. Other times, you need an orthographic camera to get precise measurements and proportions. Luckily for you, we have a camera that has both of those projections at the same time! It also has some cool functionality for navigation. In this tutorial, you'll learn to use it. 

  :::tip Orthographic and Perspective cameras

  The difference between Orthographic and Perspective cameras is that Orthographic cameras don't see things smaller when they are further away. This has some implications, like the camera being always "outside" of your scene. You can't see the interior of a room with an orthographic camera. The most common use for orthographic cameras are 2D floor plans and sections, but they can also be used to create cool-looking 3D scenes.

  :::

  ### 🖖 Importing our Libraries
  First things first, let's install all necessary dependencies to make this example work:
*/

import Stats from "stats.js";
import * as BUI from "@thatopen/ui";
// You have to import * as OBC from "@thatopen/components"
import * as OBC from "../..";

/* MD
  ### 🌎 Setting up a Simple Scene
  To get started, let's set up a basic ThreeJS scene. This will serve as the foundation for our application and allow us to visualize the 3D models effectively:
*/

const components = new OBC.Components();

const worlds = components.get(OBC.Worlds);
const world = worlds.create<
  OBC.SimpleScene,
  OBC.OrthoPerspectiveCamera,
  OBC.SimpleRenderer
>();

world.scene = new OBC.SimpleScene(components);
world.scene.setup();
world.scene.three.background = null;

const container = document.getElementById("container")!;
world.renderer = new OBC.SimpleRenderer(components, container);
world.camera = new OBC.OrthoPerspectiveCamera(components);
await world.camera.controls.setLookAt(68, 23, -8.5, 21.5, -5.5, 23);

components.init();

const grid = components.get(OBC.Grids).create(world);

/* MD
  ### 🛠️ Setting Up Fragments
  Now, let's configure the FragmentsManager. This will allow us to load models effortlessly and start manipulating them with ease:
*/

const githubUrl =
  "https://thatopen.github.io/engine_fragment/resources/worker.mjs";
const fetchedUrl = await fetch(githubUrl);
const workerBlob = await fetchedUrl.blob();
const workerFile = new File([workerBlob], "worker.mjs", {
  type: "text/javascript",
});
const workerUrl = URL.createObjectURL(workerFile);
const fragments = components.get(OBC.FragmentsManager);
fragments.init(workerUrl);

world.camera.controls.addEventListener("rest", () =>
  fragments.core.update(true),
);

world.onCameraChanged.add((camera) => {
  for (const [, model] of fragments.list) {
    model.useCamera(camera.three);
  }
  fragments.core.update(true);
});

fragments.list.onItemSet.add(({ value: model }) => {
  model.useCamera(world.camera.three);
  world.scene.three.add(model.object);
  fragments.core.update(true);
});

/* MD
  ### 📂 Loading Fragments Models
  With the core setup complete, it's time to load a Fragments model into our scene. Fragments are optimized for fast loading and rendering, making them ideal for large-scale 3D models.

  :::info Where can I find Fragment files?

  You can use the sample Fragment files available in our repository for testing. If you have an IFC model you'd like to convert to Fragments, check out the IfcImporter tutorial for detailed instructions.

  :::
*/

const fragPaths = ["https://thatopen.github.io/engine_components/resources/frags/school_arq.frag"];
await Promise.all(
  fragPaths.map(async (path) => {
    const modelId = path.split("/").pop()?.split(".").shift();
    if (!modelId) return null;
    const file = await fetch(path);
    const buffer = await file.arrayBuffer();
    return fragments.core.load(buffer, { modelId });
  }),
);

/* MD
  ### ✨ Using The OrthoPerspectiveCamera Component
  We have already created the camera while setting up the world, making it incredibly simple. However, the camera itself comes with some exciting features that can be triggered through the UI in this tutorial. Since the camera can switch between different projections, the world's grid needs to be updated accordingly:
*/

world.camera.projection.onChanged.add(() => {
  const projection = world.camera.projection.current;
  grid.fade = projection === "Perspective";
});

/* MD
  ### 🧩 Adding some UI (optional but recommended)
  We will use the `@thatopen/ui` library to add some simple and cool UI elements to our app. First, we need to call the `init` method of the `BUI.Manager` class to initialize the library:
*/

BUI.Manager.init();

/* MD
  Now we will create a simple UI for the OrthoPerspectiveCamera. It will have 4 elements: 

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

const panel = BUI.Component.create<BUI.PanelSection>(() => {
  return BUI.html`
    <bim-panel active label="OrthoPerspectiveCamera Tutorial" class="options-menu">
      <bim-panel-section label="Section">
        <bim-dropdown required label="Navigation Mode" 
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
          
      
        <bim-dropdown required label="Projection" 
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
          label="Allow User Input" checked 
          @change="${({ target }: { target: BUI.Checkbox }) => {
            world.camera.setUserInput(target.checked);
          }}">  
        </bim-checkbox>  
        
        <bim-button 
          label="Fit Model" 
          @click=${() => world.camera.fitToItems()}>
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
  ### ⏱️ Measuring the performance (optional)
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
  ### 🎉 Wrap up
  That's it! Now you're able to use the OrthoPerspectiveCamera component effectively, toggle between projections, navigate your scene, and even fit the camera to the models. Congratulations! Keep exploring more tutorials in the documentation to enhance your skills further.
*/
