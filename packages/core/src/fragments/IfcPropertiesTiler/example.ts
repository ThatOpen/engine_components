/* MD
### 🧩 Tiling BIM properties
---

:::tip Tiles?

If you haven't checked out the geometry tiling tutorial, we recommend that you do it first! This tutorial assumes that you already have done it.

:::

You can also stream the properties of an IFC file. Why? Because some files can have
millions of properties, and trying to save them naively in a normal DB is not very
scalable/affordable. Using this system, you'll be able to store and retrieve the
data of models of any size without big cloud costs.

In this tutorial, we will import:

- `web-ifc` to get some IFC items.
- `@thatopen/components` to set up the barebone of our app.
- `Stats.js` (optional) to measure the performance of our app.
*/

import Stats from "stats.js";
import * as BUI from "@thatopen/ui";
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

  This is not compulsory, as the data will come from an .ifc file, not from fragments. But at least we'll see the model whose properties we will be converting to tiles!
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
  ### ↘️ Setting up downloads
  ---

  Now we will define some helper download functions that will allow us to get the property tiles that we generate in our computer.

*/

function downloadFile(name: string, bits: Blob) {
  const file = new File([bits], name);
  const anchor = document.createElement("a");
  const url = URL.createObjectURL(file);
  anchor.href = url;
  anchor.download = file.name;
  anchor.click();
  URL.revokeObjectURL(url);
}

async function downloadFilesSequentially(
  fileList: { name: string; bits: Blob }[],
) {
  for (const { name, bits } of fileList) {
    downloadFile(name, bits);
    await new Promise((resolve) => {
      setTimeout(resolve, 100);
    });
  }
}

/* MD
  ### 📋 Getting the streamer
  ---

  Now we will get the property streamer component from the library and initialize it.
*/

const propsStreamer = components.get(OBC.IfcPropertiesTiler);

propsStreamer.settings.wasm = {
  path: "https://unpkg.com/web-ifc@0.0.66/",
  absolute: true,
};

/* MD
  We need to generate properties JSON with the following structure:
*/

interface StreamedProperties {
  types: {
    [typeID: number]: number[];
  };

  ids: {
    [id: number]: number;
  };

  indexesFile: string;
}

/* MD
  So we will define an object where we will store the tiles as we generate them.
*/

const jsonFile: StreamedProperties = {
  types: {},
  ids: {},
  indexesFile: "small.ifc-processed-properties-indexes",
};

/* MD
  ### 📅 Setting up the events
  ---

  Similarly to geometries, here you will also get data and progress notification using events. In addition to properties, you will get `indices`, which is an indexation data of the properties to be able to use them effectively when streamed. Let's set up those events now!
*/

let counter = 0;

const files: { name: string; bits: Blob }[] = [];

propsStreamer.onPropertiesStreamed.add(async (props) => {
  if (!jsonFile.types[props.type]) {
    jsonFile.types[props.type] = [];
  }
  jsonFile.types[props.type].push(counter);

  for (const id in props.data) {
    jsonFile.ids[id] = counter;
  }

  const name = `small.ifc-processed-properties-${counter}`;
  const bits = new Blob([JSON.stringify(props.data)]);
  files.push({ bits, name });

  counter++;
});

propsStreamer.onProgress.add(async (progress) => {
  console.log(progress);
});

propsStreamer.onIndicesStreamed.add(async (props) => {
  files.push({
    name: `small.ifc-processed-properties.json`,
    bits: new Blob([JSON.stringify(jsonFile)]),
  });

  const relations = components.get(OBC.IfcRelationsIndexer);
  const serializedRels = relations.serializeRelations(props);

  files.push({
    name: "small.ifc-processed-properties-indexes",
    bits: new Blob([serializedRels]),
  });

  await downloadFilesSequentially(files);
});

/* MD
  ### 🔥 Generating the tiles
  ---

  Great! Now that we have everything setup, is time to finally convert the IFC file. In order to trigger the conversion, we can just do the following:
*/

async function processFile() {
  const fetchedIfc = await fetch(
    "https://thatopen.github.io/engine_components/resources/small.ifc",
  );
  const ifcBuffer = await fetchedIfc.arrayBuffer();
  // We will need this information later to also convert the properties
  const ifcArrayBuffer = new Uint8Array(ifcBuffer);
  // This triggers the conversion, so the listeners start to be called
  await propsStreamer.streamFromBuffer(ifcArrayBuffer);
}

/* MD
  If everything went as expected, you should now be seeing some files being downloaded from your app 🤯 Do not get scary if they're a lot, as big models tend to have many files! All of that is the information the streaming uses in order to display the geometry in the most efficient way possible. 💪

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
  Now we will add some UI to generate and download the tiles to our computer. For more information about the UI library, you can check the specific documentation for it!
*/

const panel = BUI.Component.create<BUI.PanelSection>(() => {
  return BUI.html`
  <bim-panel active label="Property Tiles Tutorial" class="options-menu">
   <bim-panel-section collapsed label="Controls">
      
      <bim-panel-section style="padding-top: 12px;">
      
        <bim-button label="Export IFC Property Tiles"
          @click="${() => {
            processFile();
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

  That's it! You have created an app that can generate the property BIM tiles for an IFC and download them to your computer. Now you have the power to process big IFC files! To consume these tiles, check out the IFC streamer tutorial.
*/
