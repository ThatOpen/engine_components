/* eslint import/no-extraneous-dependencies: 0 */

import Stats from "stats.js";
// @ts-ignore
import * as dat from "three/examples/jsm/libs/lil-gui.module.min";
import * as BUI from "@thatopen/ui";
import * as OBC from "../..";

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

// rendererComponent.postproduction.enabled = true;

world.camera.controls.setLookAt(12, 6, 8, 0, 0, -10);

const grids = components.get(OBC.Grids);
grids.create(world);
// customEffects.excludedMeshes.push(grid.get());

// rendererComponent.postproduction.enabled = true;

/* MD
  ## 💪 Let's go BIG
  ___
  Do you need to open huge big IFC files fast, even on more modest devices? If so, you are in luck! We can open virtually any model on any device in seconds thanks to BIM TILES!

  :::info BIM tiles?

  The idea behind BIM tiles is pretty simple! Instead of loading the whole BIM model at once, we just load the explicit geometries that are seen by the user. It's way faster than opening the IFC directly, but for this you'll need a backend (or to rely on the file system of the user if you are building a desktop or mobile app).

  :::

  Let's see how to do this step by step!

  ### 🧩 Converting the IFC model to tiles
  ___

  The first step is to transform the IFC model into BIM tiles. The reason why we have to do this is pretty simple: geometry in IFC is implicit (e.g. a wall is defined as an extrusion). This means that it needs to be computed and converted to explicit geometry (triangles) so that it can be displayed in 3D. 
  
  :::note
  
  As you know, IFC files contains two things: geometries and properties. We need to convert both things if we want to take full advantage of streaming!

  :::

  The way the streaming works is by fetching files based on the visible things in the viewer. Those files contain pieces of geometry information (geometry chunks) that the engine uses in order to create and display the geometry. But, where do we get those files from? Easy! From the IFC conversion to tiles. So, let's start converting the IFC geometry to tiles and getting those files so the streamer can do its job. In order to do it, we need the first component from the collection of streaming components: `FragmentIfcStreamConverter`:

  */

// We need this wasm configuration later to convert properties
const wasm = {
  path: "https://unpkg.com/web-ifc@0.0.53/",
  absolute: true,
};

const tiler = new OBC.IfcGeometryTiler(components);
tiler.settings.wasm = wasm;
tiler.settings.minGeometrySize = 20;
tiler.settings.minAssetsSize = 1000;

/* MD
  The `FragmentIfcStreamConverter` class takes IFC files and transform their geometry into tiles. 
  
  :::warning

  The converter doesn't give you the files needed to streaming right away, just the data that must be contained in those files. Is your job to create the files! Why? Because then you can have full control over when, where and how to create them.

  :::

  The first file we need is a JSON which is the entry point of the geometries streaming. That JSON must have the following structure:
  */

// @ts-ignore
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
  The second file is actually not just a single file, but X number of files (depends on how big is your model) that contains the required information to generate the geometry while streaming.

  In order to create the JSON file and get the information with the geometry, the `FragmentIfcStreamConverter` as well as other components in the collection of streaming components, emits events that let you get the processed data from the conversion process.
  
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
  
  :::note Are you familiar with That Open Engine?
  
  If you're familiar with That Open Engine, you should recall fragments. Fragments are just a fancy word we use to refer to ThreeJS geometry efficiently created from IFC files which are the things you end up see in the viewer... one IFC file is usually composed of many fragments and all of them are grouped in a FragmentsGroup, which is the final processed IFC model.
  
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

  This is pretty much it! Now that we've setup the main listeners, the last thing is to download all the data once the conversion has fininshed. To do so, we can use the progress event:
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
  Great! Now that we have everything setup, is time to finally convert the IFC file. In order to trigger the conversion, we can just do the following:
  */

async function processFile() {
  const fetchedIfc = await fetch("https://thatopen.github.io/engine_components/resources/small.ifc");
  const ifcBuffer = await fetchedIfc.arrayBuffer();
  // We will need this information later to also convert the properties
  const ifcArrayBuffer = new Uint8Array(ifcBuffer);
  // This triggers the conversion, so the listeners start to be called
  await tiler.streamFromBuffer(ifcArrayBuffer);
}

/* MD
  If everything went as expected, you should now be seeing some files being downloaded from your app 🤯 Do not get scary if they're a lot, as big models tend to have many files! All of that is the information the streaming uses in order to display the geometry in the most efficient way possible 💪
*/

BUI.Manager.init();

const panel = BUI.Component.create<BUI.PanelSection>(() => {
  return BUI.html`
    <bim-panel active label="IFC Geometry Tiler Tutorial" 
      style="position: fixed; top: 5px; right: 5px">
      
      <bim-panel-section style="padding-top: 12px;">
      
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

// Set up stats

const stats = new Stats();
stats.showPanel(2);
document.body.append(stats.dom);
stats.dom.style.left = "0px";
world.renderer.onBeforeUpdate.add(() => stats.begin());
world.renderer.onAfterUpdate.add(() => stats.end());
