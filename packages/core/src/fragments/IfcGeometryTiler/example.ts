/* MD
### 🧩 Tiling BIM geometry
---

Opening big BIM models is hard because of 2 reasons: they have a lot of data and the geometry has to be computed to implicit (e.g. extrusion) to explicit (triangles). Our library allows to tile IFC files, solving both problems. This allows to open quite big IFC models in seconds and consuming minimal resources by just opening the parts of the model that are visible to the user. In this tutorial you'll learn to convert the geometry of an IFC model into tiles.

:::tip Tiles?

Tiles are very simple. We just take a bunch of geometries within the IFC file, convert them into triangles and store them in a binary file. These files are then loaded as a stream into the scene as the user moves around and discovers them.

*/

/* MD
Like always, lets import our dependencies and start with the components instance

In this tutorial, we will need the following dependencies:

- `@thatopen/components` to set up the barebone of our app.
- `@thatopen/ui` for some helper ui.
- `web-ifc` to get some IFC items.
- `Stats.js` is optional, if we want to measure the performance of our app.
*/

import * as OBC from "@thatopen/components";
import * as BUI from "@thatopen/ui";
import Stats from "stats.js";

const components = new OBC.Components();

/* MD
  ### 🔪 Generating tiles from an IFC file
  ---

  Tiles can be created either directly in the browser or on a server. These files contain geometry chunks that can be streamed into the viewer.

  The tiler does not generate files for you. It only provides the necessary data. That way you have full control over where and how to store those files.
*/

const tiler = new OBC.IfcGeometryTiler(components);

tiler.settings.minGeometrySize = 20;
tiler.settings.minAssetsSize = 1000;

/* MD
  We need to create a json, that serves as entry point for streaming the geometry tiles. It is empty and will be filled with data from the tiler events. Note that the `globalDataFileId` must have a "-global" suffix.
*/

const json: OBC.GeometryTilesJson = {
  assets: [],
  geometries: {},
  globalDataFileId: "ifc_processed-global",
};

/* MD
  We have to index the files, and store them with a suffix like "-0". When streaming tiles to the viewer, it implicity expects this suffix.
*/

let fileIndex = 0;

/* MD
  We now have to pick how we want to store our files. In order for this example to work within a browser we can create the files in memory. 
  
  ::
  For larger files, this might overwhelm your clients memory capacity and freeze your browser, so it probably makes sense to do this on a server with `node:fs` or similar.
*/

const files: Array<{ name: string; data: Uint8Array | string }> = [];

/* MD
  The tiler exposes events that allow us to store the generated data.
  We write the binary data (buffer) to disk and add the `data` information to the json.
*/

tiler.onGeometryStreamed.add(async ({ buffer, data }) => {
  const fileName: OBC.GeometryTileFileName = `ifc_processed_geometries-${fileIndex}`;

  for (const id in data) {
    json.geometries[id] = { ...data[id], geometryFile: fileName };
  }

  files.push({
    name: fileName,
    data: buffer,
  });

  fileIndex++;
});

/* MD
  We can optionally also act on the progress. It contains a value between 0 and 1. We come back to this a bit later.
*/

tiler.onProgress.add(async (v) => {
  console.log(`Progress: ${v}`);
});

/* MD
  Asset data is only written to the json.
*/

tiler.onAssetStreamed.add(async (assets) => {
  json.assets.push(...assets);
});

/* MD
  Once all of the geometry chunks have been streamed, the `onIfcLoaded` event will fire.
  
  This event provides FragmentsGroups data as a parameter. This information is extremely important for the streamer as everything gets grouped there, so we also write it do disk.

  Since we're done, we can also write the json file to disk.
*/

tiler.onIfcLoaded.add(async (globalData) => {
  files.push({
    name: json.globalDataFileId,
    data: globalData,
  });

  files.push({
    name: "ifc_processed.json",
    data: JSON.stringify(json),
  });
});

/* MD
  ### ↘️ Downloading the tiles
  ---

  Now that we've setup the main listeners, the last thing is to download all the data once the conversion has fininshed. To do so, we can use the progress event:
*/

function downloadFile(name: string, data: Uint8Array | string) {
  const file = new File([data], name);
  const anchor = document.createElement("a");
  const url = URL.createObjectURL(file);
  anchor.href = url;
  anchor.download = file.name;
  anchor.click();
  URL.revokeObjectURL(url);
}

async function downloadFilesSequentially(
  files: { name: string; data: Uint8Array | string }[]
) {
  for (const { name, data } of files) {
    downloadFile(name, data);
    await new Promise((resolve) => {
      setTimeout(resolve, 100);
    });
  }
}

/* MD
  ### 🔥 Generating the tiles
  ---

  Great! Now that we have everything setup, is time to finally convert the IFC file. In order to trigger the conversion, we can just do the following:
*/

async function processFile() {
  const fetchedIfc = await fetch(
    "https://thatopen.github.io/engine_components/resources/small.ifc"
  );
  const ifcBuffer = await fetchedIfc.arrayBuffer();
  // We will need this information later to also convert the properties
  const ifcArrayBuffer = new Uint8Array(ifcBuffer);
  // This triggers the conversion, so the listeners start to be called
  await tiler.streamFromBuffer(ifcArrayBuffer);
}

/* MD
  If everything went as expected, you should now be seeing some files being downloaded from your app 🤯 Do not get scary if they're a lot, as big models tend to have many files! All of that is the information the streaming uses in order to display the geometry in the most efficient way possible 💪

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
    <bim-panel active label="Geometry tiles Tutorial" class="options-menu">
      <bim-panel-section collapsed label="Controls">
      
        <bim-button label="Load IFC"
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

  That's it! You have created an app that can generate the geometry BIM tiles for an IFC and download them to your computer. Now you have the power to process big IFC files! Don't forget to check out the IFC property tiler tutorial. To consume these tiles, check out the IFC streamer tutorial.
*/
