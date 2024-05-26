/* MD
### 🚀 Handling BIM models like a boss
---

In this tutorial, you'll learn how to load your BIM models in Fragment format. Fragment is an [open source geometry system](https://github.com/ThatOpen/engine_fragment/) that we created on top of [Three.js](https://threejs.org/) to display BIM models fast, while keeping control over the individual items of the model. The idea is simple: a BIM model is a FragmentsGroup, which is (like the name implies) a collection of fragments. A fragment is a set of identical geometries instantiated around the scene.

:::tip How do I get a BIM model in Fragment format?

The IfcLoader component does exactly that! It converts IFC models to Fragments. Check out that tutorial if you are starting out with IFC files. Of course, you can just use the IfcLoader in your app, but loading fragments is more than x10 faster than loading IFC files. Our recommendation is to convert your IFC files to fragments just once, store the fragment somewhere (frontent of backend) and then load the fragments instead of teh IFC models directly.

:::

In this tutorial, we will import:

- `Three.js` to get some 3D entities for our app.
- `@thatopen/ui` to add some simple and cool UI menus.
- `@thatopen/components` to set up the barebone of our app.
- `Stats.js` (optional) to measure the performance of our app.
*/

import * as THREE from "three";
import Stats from "stats.js";
import * as OBC from "@thatopen/components";
import * as BUI from "@thatopen/ui";

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
  OBC.SimpleRenderer
>();

world.scene = new OBC.SimpleScene(components);
world.renderer = new OBC.SimpleRenderer(components, container);
world.camera = new OBC.SimpleCamera(components);

components.init();

world.camera.controls.setLookAt(12, 6, 8, 0, 0, -10);

world.scene.setup();

const grids = components.get(OBC.Grids);
grids.create(world);

/* MD

  We'll make the background of the scene transparent so that it looks good in our docs page, but you don't have to do that in your app!

*/

world.scene.three.background = null;

/* MD
  ### 🧶 Loading a fragments model
  ---

  Let's begin by getting the FragmentsManager, which is the component to load, export, get and dispose Fragments in your app.🏭

  */

const fragments = components.get(OBC.FragmentsManager);

/* MD
  Now we can load a fragment from a file. We will fetch the model data and use the `load` method of the FragmentsManager to get the fragment object. Then, we'll add it to the scene of the current world. We will also create an UUID of the model to later get it somewhere else.
*/

let uuid = "";

async function loadFragments() {
  if (fragments.groups.size) {
    return;
  }
  const file = await fetch(
    "https://thatopen.github.io/engine_components/resources/small.frag",
  );
  const data = await file.arrayBuffer();
  const buffer = new Uint8Array(data);
  const group = fragments.load(buffer);
  world.scene.three.add(group);
  uuid = group.uuid;
}

/* MD

  ### 📤 Storing Fragments
  ---

  Let's see how you can export fragments as a file. First, we'll define a function to download a file:

  */

function download(file: File) {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(file);
  link.download = file.name;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

/* MD
 **Fragments Manager** can export fragments using the `export` method. The method takes the UUID of a fragment as an argument and returns a **[Blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob/Blob)**, which can be used to generate a File and then download it using the function defined just before.↗️
 */

function exportFragments() {
  if (!fragments.groups.size) {
    return;
  }
  const group = fragments.groups.get(uuid);
  if (!group) {
    return;
  }
  const data = fragments.export(group);
  const blob = new Blob([data]);
  const file = new File([blob], "small.frag");
  download(file);
}

/* MD

  ### 🧹 Discard Fragment and Clean the Scene
  ---

  When your user "closes" one or many BIM models, you'll need to discard that FragmetsGroup. You can dispose a specific FragmentsGroup using the `disposeGroup` method, or dispose all FragmentsGroups using the `dispose` method.

  */

function disposeFragments() {
  fragments.dispose();
}

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
  Now we will create a simple panel with a set of buttons that call the previously defined functions. For more information about the UI library, you can check the specific documentation for it!
*/

const panel = BUI.Component.create<BUI.PanelSection>(() => {
  return BUI.html`
    <bim-panel active label="Fragments Manager Tutorial" class="options-menu">
      <bim-panel-section collapsed label="Controls">
      
        <bim-button 
          label="Load fragments" 
          @click="${() => {
            loadFragments();
          }}">
        </bim-button>
        
        <bim-button 
          label="Dispose fragments" 
          @click="${() => {
            disposeFragments();
          }}">
        </bim-button>
        
        <bim-button 
          label="Export fragments" 
          @click="${() => {
            exportFragments();
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

  That's it! Now you know how to load, export and dispose Fragments in your app. Fragments are much faster than raw IFC models, so you should definitely store them in your app if you want your users to have a fast loading experience. For bigger models you can use streaming, but that's another tutorial!
*/
