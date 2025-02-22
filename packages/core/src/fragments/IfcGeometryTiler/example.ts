/* MD
### 🧩 Tiling BIM geometry
---

Opening big BIM models is hard because of 2 reasons: they have a lot of data and the geometry has to be computed to implicit (e.g. extrusion) to explicit (triangles). Our library allows to tile IFC files, solving both problems. This allows to open quite big IFC models in seconds and consuming minimal resources by just opening the parts of the model that are visible to the user. In this tutorial you'll learn to convert the geometry of an IFC model into tiles.

:::tip Tiles?

Tiles are very simple. We just take a bunch of geometries within the IFC file, convert them into triangles and store them in a binary file. These files are then loaded as a stream into the scen as the user moves around and discovers them.

:::

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

  This is not compulsory, as the data will come from an .ifc file, not from fragments. But at least we'll see the model whose geometry we will be converting to tiles!
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
  ### 🔪 Getting the geometry tiler
  ---

  The way the streaming works is by fetching files based on the visible things in the viewer. Those files contain pieces of geometry information (geometry chunks) that the engine uses in order to create and display the geometry. But, where do we get those files from? Easy! From the IFC conversion to tiles. So the first step is to transform the IFC model into BIM tiles.
  
  :::note
  
  As you know, IFC files contains two things: geometries and properties. We need to convert both things if we want to take full advantage of streaming! For tiling properties, check out the Property Tiling tutorial.

  :::

  So, let's start converting the IFC geometry to tiles and getting those files so the streamer can do its job:

  */

const tiler = components.get(OBC.IfcGeometryTiler);

const wasm = {
  path: "https://unpkg.com/web-ifc@0.0.66/",
  absolute: true,
};

tiler.settings.wasm = wasm;
tiler.settings.minGeometrySize = 20;
tiler.settings.minAssetsSize = 1000;

/* MD
  This component takes IFC files and transform their geometry into tiles. 
  
  :::warning

  The converter doesn't give you the files needed to streaming right away, just the data that must be contained in those files. Is your job to create the files! Why? Because then you can have full control over when, where and how to create them.

  :::

  The first file we need is a JSON which is the entry point of the geometries streaming. That JSON must have the following structure:
  */

interface GeometriesStreaming {
  assets: {
    id: number;
    geometries: {
      color: number[];
      geometryID: number;
      transformation: number[];
    }[];
  }[];

  geometries: {
    [id: number]: {
      boundingBox: { [id: number]: number };
      hasHoles: boolean;
      geometryFile: "url-to-geometry-file-in-your-backend";
    };
  };

  globalDataFileId: "url-to-fragments-group-file-in-your-backend";
}

/* MD
  ### 📅 Setting up the events
  ---

  The second file is actually not just a single file, but X number of files (depends on how big is your model) that contains the required information to generate the geometry while streaming.

  In order to create the JSON file and get the information with the geometry, these components, emits events that let you get the processed data from the conversion process.
  
  :::important

  Nedless to say, you need to set up your event listeners before triggering the conversion!

  :::
  
  Let's start with the first event:
*/

let files: { name: string; bits: (Uint8Array | string)[] }[] = [];
let geometriesData: OBC.StreamedGeometries = {};
let geometryFilesCount = 1;

tiler.onGeometryStreamed.add((geometry) => {
  const { buffer, data } = geometry;
  const bufferFileName = `small.ifc-processed-geometries-${geometryFilesCount}`;
  for (const expressID in data) {
    const value = data[expressID];
    value.geometryFile = bufferFileName;
    geometriesData[expressID] = value;
  }
  files.push({ name: bufferFileName, bits: [buffer] });
  geometryFilesCount++;
});

/* MD
  One of the most important things to keep in mind is that the event we just setup will get fired as many times as per the "chunk" data generated by the converted. Simply put, the event will get fired several times ⏲ and per each time we will produce one file data that is stored in the `geometryFiles` array. Later on, we will download the geometry files ⏬.

  :::note

  As you see, `geometriesData` is not being stored as a file to be downloaded. The reason is because that is part of the information we need to create the entry JSON file 🚀.

  :::

  Nice! Let's go with the second event that will give us more information to create the required files:
  */

let assetsData: OBC.StreamedAsset[] = [];

tiler.onAssetStreamed.add((assets) => {
  assetsData = [...assetsData, ...assets];
});

/* MD
  This one is easier as the event doesn't produce binary data, but information we need to create the JSON file. 
  
  :::note Are you familiar with Fragments?
  
  If you're familiar with That Open Engine (our libraries), you should recall fragments. Fragments are just a fancy word we use to refer to ThreeJS geometry efficiently created from IFC files which are the things you end up see in the viewer... one IFC file is usually composed of many fragments and all of them are grouped in a FragmentsGroup, which is the final processed IFC model.
  
  :::
  
  Why do we remind you about FragmentsGroup? Because streaming also works with them! So yes, when you convert an IFC to tiles, the converter also creates a FragmentsGroup in the background, and that information is extremely important for the streamer in order to display the streamed file as everything gets grouped there. So, there is another event that gives you the FragmentsGroup binary data and we also need to create a file with that information.
  */

tiler.onIfcLoaded.add((groupBuffer) => {
  files.push({
    name: "small.ifc-processed-global",
    bits: [groupBuffer],
  });
});

/* MD
  :::warning

  You can name the file whatever you want, but is *extremely important* you finish the file name with `-global`!

  :::

  ### ↘️ Downloading the tiles
  ---

  Now that we've setup the main listeners, the last thing is to download all the data once the conversion has fininshed. To do so, we can use the progress event:
*/

function downloadFile(name: string, ...bits: (Uint8Array | string)[]) {
  const file = new File(bits, name);
  const anchor = document.createElement("a");
  const url = URL.createObjectURL(file);
  anchor.href = url;
  anchor.download = file.name;
  anchor.click();
  URL.revokeObjectURL(url);
}

async function downloadFilesSequentially(
  fileList: { name: string; bits: (Uint8Array | string)[] }[],
) {
  for (const { name, bits } of fileList) {
    downloadFile(name, ...bits);
    await new Promise((resolve) => {
      setTimeout(resolve, 100);
    });
  }
}

tiler.onProgress.add((progress) => {
  if (progress !== 1) return;
  setTimeout(async () => {
    const processedData = {
      geometries: geometriesData,
      assets: assetsData,
      globalDataFileId: "small.ifc-processed-global",
    };
    files.push({
      name: "small.ifc-processed.json",
      bits: [JSON.stringify(processedData)],
    });
    await downloadFilesSequentially(files);
    assetsData = [];
    geometriesData = {};
    files = [];
    geometryFilesCount = 1;
  });
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
      
        <bim-button label="Export IFC Geometry Tiles"
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
