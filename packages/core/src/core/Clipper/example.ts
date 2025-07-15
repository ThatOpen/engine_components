/* MD
  ## ✂️ Cutting Models
  ---
  The Clipping Tool is a powerful feature in 3D modelling that helps you dissect 3D objects. Clipping Tool is useful for inspecting and analyzing objects in detail.💪

  :::tip Clipping?

  Clipping is the process of "cutting" a 3D object by creating a plane. That way, we can have a bird view of the inside of a BIM model.

  :::

  ### 🖖 Importing our Libraries
  First things first, let's install all necessary dependencies to make this example work:
*/

import * as THREE from "three";
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

const fragPaths = [
  "https://thatopen.github.io/engine_components/resources/frags/school_arq.frag",
];
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
  ### ✨ Using The Clipper Component
  Now comes the exciting part! We will add a Simple Clipper to our scene. While you can instantiate it directly, it's recommended to use the `components.get(OBC.Clipper)` method to retrieve it. All components are designed to function as singletons within a components instance, and using this approach ensures proper singleton behavior.
*/

// Initialize the Raycaster for the world to track mouse position for clipping planes.
const casters = components.get(OBC.Raycasters);
casters.get(world);

const clipper = components.get(OBC.Clipper);
clipper.enabled = true;

/* MD
  Now, we want a way to create a clipping plane on demand. You can do it with a `Single Click` or `Double Click` of a mouse. For this tutorial, we will use `Double Click`. This will cast a ray from the mouse position to the scene and check if the ray intersects with any of the 3D objects. If it does, it will create a new clipping plane in the point of intersection.
*/

container.ondblclick = () => {
  if (clipper.enabled) {
    clipper.create(world);
  }
};

/* MD
  We can also easily toggle the clipping planes' enabled state, allowing them to either cut or not cut the model, depending on the specific requirements of your application.
*/

const toggleClippings = () => {
  for (const [, clipping] of clipper.list) {
    clipping.enabled = !clipping.enabled;
  }
};

/* MD

  :::info Raycaster Under the Hood 🎩

  The Raycaster is used to detect intersections within the scene. When the clipper detects a face under the mouse click, it places a clipping plane at the point of intersection. 😎

  :::

  ### 🧹 Deleting Clipping Planes
  Now that we know how to create multiple clipping planes, it's equally important to understand how to delete them when needed. Clipping planes can be removed using `clipper.delete(world)` (which deletes the first plane detected under the mouse using the Raycaster in the specified world) or `clipper.delete(world, plane)` (which deletes a specific clipping plane).
*/

window.onkeydown = (event) => {
  if (event.code === "Delete" || event.code === "Backspace") {
    if (clipper.enabled) clipper.delete(world);
  }
};

/* MD
  ### 🧩 Adding some UI (optional but recommended)
  We will use the `@thatopen/ui` library to add some simple and cool UI elements to our app. First, we need to call the `init` method of the `BUI.Manager` class to initialize the library:
*/

BUI.Manager.init();

/* MD
Now we will add some UI to play around with the actions in this tutorial. For more information about the UI library, you can check the specific documentation for it!
*/

const panel = BUI.Component.create<BUI.PanelSection>(() => {
  return BUI.html`
    <bim-panel active label="Clipper Tutorial" class="options-menu">
      <bim-panel-section label="Commands">
        <bim-label>Double click: Create clipping plane</bim-label>
        <bim-label>Delete key: Delete clipping plane</bim-label>
      </bim-panel-section>
      <bim-panel-section label="Controls">
        <bim-checkbox label="Component Enabled" checked 
          @change="${({ target }: { target: BUI.Checkbox }) => {
            clipper.config.enabled = target.value;
          }}">
        </bim-checkbox>
        
        <bim-checkbox label="Clipper Visible" checked 
          @change="${({ target }: { target: BUI.Checkbox }) => {
            clipper.config.visible = target.value;
          }}">
        </bim-checkbox>
      
        <bim-color-input 
          label="Planes Color" color="#202932" 
          @input="${({ target }: { target: BUI.ColorInput }) => {
            clipper.config.color = new THREE.Color(target.color);
          }}">
        </bim-color-input>
        
        <bim-number-input 
          slider step="0.01" label="Planes Opacity" value="0.2" min="0.1" max="1"
          @change="${({ target }: { target: BUI.NumberInput }) => {
            clipper.config.opacity = target.value;
          }}">
        </bim-number-input>
        
        <bim-number-input 
          slider step="0.1" label="Planes Size" value="5" min="2" max="10"
          @change="${({ target }: { target: BUI.NumberInput }) => {
            clipper.config.size = target.value;
          }}">
        </bim-number-input>
        
        <bim-button 
          label="Toggle Clippings" 
          @click=${toggleClippings}>  
        </bim-button>       
        
        <bim-button 
          label="Delete All" 
          @click="${() => {
            clipper.deleteAll();
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
  That's it! Now you're able to create and manipulate clipping planes, toggle their visibility, and delete them as needed. Congratulations! Keep exploring more tutorials in the documentation to enhance your skills further.
*/
