/* MD
### 💱 From IFC to JSON
---

IFC is great, but it's not always easy to handle for developers. JSON, on the other hand, is one of the most common formats in the programming world for exchanging data easily. In thit tutorial, you'll learn to convert an IFC file to JSON.

:::tip Is JSON better?

It's not better or worse, it's just different. In fact, IFC is a schema, not a format, so you can't compare both. What you can compare is the STEP format (what you usually as .ifc file) and JSON. The first format is better if you want to move data among different BIM apps, whereas the second is more convenient to move data programmatically (e.g. from the backend to the frontend of your app).

:::

In this tutorial, we will import:

- `web-ifc` to get some IFC items.
- `@thatopen/ui` to add some simple and cool UI menus.
- `@thatopen/components` to set up the barebone of our app.
- `Stats.js` (optional) to measure the performance of our app.
*/

import Stats from "stats.js";
import * as BUI from "@thatopen/ui";
import * as WEBIFC from "web-ifc";
import * as OBC from "@thatopen/components";

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
  ### 🧳 Loading a BIM model
  ---

 We'll start by adding a BIM model to our scene. That model is already converted to fragments, so it will load much faster than if we loaded the IFC file.

  :::tip Fragments?

    If you are not familiar with fragments, check out the IfcLoader tutorial!

  :::

  This is not compulsory, as the data will come from an .ifc file, not from fragments. But at least we'll see the model whose properties we will be converting!
*/

const fragments = new OBC.FragmentsManager(components);
const fragFile = await fetch(
  "https://thatopen.github.io/engine_components/resources/small.frag",
);
const fragData = await fragFile.arrayBuffer();
const fragBuffer = new Uint8Array(fragData);
const model = fragments.load(fragBuffer);
world.scene.three.add(model);

/* MD
  ### 🧰 Getting the necessary tools
  ---

To convert IFC to JSON we need 2 things: `web-ifc` an the JSON exporter. The former is a component of this library, so we'll get it using the `get` method of the `components` instance. Next, we will create a new instance of web-ifc, which is the core of our libraries. This library can parse, read, edit and write IFC files very efficiently thanks to WebAssembly (WASM).
*/

const exporter = components.get(OBC.IfcJsonExporter);

const webIfc = new WEBIFC.IfcAPI();
webIfc.SetWasmPath("https://unpkg.com/web-ifc@0.0.66/", true);
await webIfc.Init();

/* MD
  ### ↘️ Loading the IFC data
  ---

 Now we can load the IFC file data using web-ifc. This can be done in a bunch of lines:
*/

const ifcFile = await fetch(
  "https://thatopen.github.io/engine_components/resources/small.ifc",
);
const ifcData = await ifcFile.arrayBuffer();
const ifcBuffer = new Uint8Array(ifcData);
const modelID = webIfc.OpenModel(ifcBuffer);

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
Now we will add some UI to export the loaded IFC file to JSON. For more information about the UI library, you can check the specific documentation for it!
*/

const panel = BUI.Component.create<BUI.PanelSection>(() => {
  return BUI.html`
  <bim-panel active label="IFC-JSON Exporter Tutorial" class="options-menu">
   <bim-panel-section collapsed label="Controls">
      <bim-panel-section style="padding-top: 10px;">
        <bim-button 
          label="Export properties JSON" 
          @click="${async () => {
            const exported = await exporter.export(webIfc, modelID);
            const serialized = JSON.stringify(exported);
            const file = new File([new Blob([serialized])], "properties.json");
            const url = URL.createObjectURL(file);
            const link = document.createElement("a");
            link.download = "properties.json";
            link.href = url;
            link.click();
            URL.revokeObjectURL(url);
            link.remove();
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

  That's it! You have created an app that can load IFC files and convert them to JSON! Now you can easily extract data from IFC files and move them around in your systems, regardless of the technology that you use in your stack. For bigger IFC files, exporting all the properties to a single JSON might not be feasible. In those cases, check out the properties tiler tutorial!
*/
