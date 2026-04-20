/* MD

### 🌎 Creating our 3D world
---

Every BIM application needs a 3D environment to display models — a scene, a camera, and a renderer wired together and running. Setting this up from scratch with raw Three.js requires boilerplate that distracts from the actual app logic. The `Worlds` component gives you that foundation in a few lines, with sensible defaults and singleton management built in.

This tutorial covers creating a world with a scene, camera, and renderer, loading a BIM model into it, and controlling background color and light intensities through a UI panel. By the end, you'll have the minimal working scene that every other tutorial in the library builds on.

*/

import * as THREE from "three";
import Stats from "stats.js";
import * as BUI from "@thatopen/ui";
// You have to import * as OBC from "@thatopen/components"
import * as OBC from "../..";

/* MD
  ### 🖼️ Getting the container
  ---

  Next, we need to tell the library where do we want to render the 3D scene. We have added an DIV  element to this HTML page that occupies the whole width and height of the viewport. Let's fetch it by its ID:
*/

const container = document.getElementById("container")!;

/* MD
  ### 🚀 Creating a components instance
  ---

  Now we will create a new instance of the `Components` class. This class is the main entry point of the library. It will be used to register and manage all the components in your application.

  :::tip Don't forget to dispose it when you are done!

  Once you are done with your application, you need to dispose the `Components` instance to free up the memory. This is a requirement of Three.js, which can't dispose the memory of 3D related elements automatically.

  :::

*/

const components = new OBC.Components();

/* MD
  ### 🌎 Setting up the world
  ---

  Now we are ready to create our first world. We will use the `Worlds` component to manage all the worlds in your application. Instead of instancing it, we can get it from the `Components` instance. All components are singleton, so this is always a better way to get them.

*/

const worlds = components.get(OBC.Worlds);

/* MD

  We can create a new world by calling the `create` method of the `Worlds` component. It's a generic method, so we can specify the type of the scene, the camera and the renderer we want to use.

*/

const world = worlds.create<
  OBC.SimpleScene,
  OBC.SimpleCamera,
  OBC.SimpleRenderer
>();

/* MD

  Now we can set the scene, the camera and the renderer of the world, and call the init method to start the rendering process.

*/

world.scene = new OBC.SimpleScene(components);
world.renderer = new OBC.SimpleRenderer(components, container);
world.camera = new OBC.SimpleCamera(components);

components.init();

/* MD
  We could add some lights, but the SimpleScene class can do that easier for us using its `setup` method:
*/

world.scene.setup();

/* MD

  We'll make the background of the scene transparent so that it looks good in our docs page, but you don't have to do that in your app!

*/

world.scene.three.background = null;

/* MD
  ### 🏷️ The That Open logo
  ---

  Every `SimpleRenderer` draws a small **That Open Company** logo in the bottom-left corner of its container. It's on by default, and it's how people discover that the tools powering your app are built by That Open Company, the team that keeps `@thatopen/components`, `@thatopen/fragments`, and the rest of the stack free and open source.

  Every viewport that keeps the logo visible helps us reach more developers, which in turn lets us keep investing in the libraries you're using to build your app. **If the logo works for your design, we'd genuinely appreciate you leaving it on. Thank you!** 💜

  That said, we know it won't fit every product. If your app needs a clean viewport (a full-bleed print view, a white-label embed, a customer-branded surface), you can hide it per renderer via the `showLogo` property. It's live, so you can flip it at any time after the renderer is created.
*/

world.renderer.showLogo = true;

/* MD
  ### 💄 Adding things to our scene
  ---

  Now we are ready to start adding some 3D entities to our scene. We will load a Fragments model:

*/

// `FragmentsManager.getWorker()` fetches the matching worker for this library version from unpkg and returns a blob URL.
// You can also pass your own URL to `fragments.init(...)` if you'd rather host the worker yourself.
const workerUrl = await OBC.FragmentsManager.getWorker();
const fragments = components.get(OBC.FragmentsManager);
fragments.init(workerUrl);

fragments.init(workerUrl);

world.camera.controls.addEventListener("update", () => fragments.core.update());

// Remove z fighting
fragments.core.models.materials.list.onItemSet.add(({ value: material }) => {
  if (!("isLodMaterial" in material && material.isLodMaterial)) {
    material.polygonOffset = true;
    material.polygonOffsetUnits = 1;
    material.polygonOffsetFactor = Math.random();
  }
});

fragments.list.onItemSet.add(({ value: model }) => {
  model.useCamera(world.camera.three);
  world.scene.three.add(model.object);
  fragments.core.update(true);
});

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
  Finally, we will make the camera look at the model:
*/

await world.camera.controls.setLookAt(68, 23, -8.5, 21.5, -5.5, 23);
await fragments.core.update(true);

/* MD
  ### 🧩 Adding some UI
  ---

  We will use the `@thatopen/ui` library to add some simple and cool UI elements to our app. First, we need to call the `init` method of the `BUI.Manager` class to initialize the library:

*/

BUI.Manager.init();

/* MD
  Now we will create a new panel with some inputs to change the background color of the scene and the intensity of the directional and ambient lights. For more information about the UI library, you can check the specific documentation for it!
*/

const panel = BUI.Component.create<BUI.PanelSection>(() => {
  return BUI.html`
    <bim-panel label="Worlds Tutorial" class="options-menu">
      <bim-panel-section label="Controls">
      
        <bim-color-input 
          label="Background Color" color="#202932" 
          @input="${({ target }: { target: BUI.ColorInput }) => {
            world.scene.config.backgroundColor = new THREE.Color(target.color);
          }}">
        </bim-color-input>
        
        <bim-number-input 
          slider step="0.1" label="Directional lights intensity" value="1.5" min="0.1" max="10"
          @change="${({ target }: { target: BUI.NumberInput }) => {
            world.scene.config.directionalLight.intensity = target.value;
          }}">
        </bim-number-input>
        
        <bim-number-input 
          slider step="0.1" label="Ambient light intensity" value="1" min="0.1" max="5"
          @change="${({ target }: { target: BUI.NumberInput }) => {
            world.scene.config.ambientLight.intensity = target.value;
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
  ### 🎉 Wrap up
  That's it! You have created your first 3D world and added some UI elements to it. You can now play with the inputs to see how the scene changes.

*/
