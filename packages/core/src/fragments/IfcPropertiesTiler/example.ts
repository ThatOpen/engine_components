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

// rendererComponent.postproduction.enabled = true;

/* MD
  ### 📋 Streaming the properties
  ___
  You can also stream the properties of an IFC file. Why? Because some files can have
  millions of properties, and trying to save them naively in a normal DB is not very
  scalable/affordable. Using this system, you'll be able to store and retrieve the
  data of models of any size without big cloud costs. We can do this conversion
  using the `FragmentPropsStreamConverter`:

  */

const propsStreamer = new OBC.IfcPropertiesTiler(components);

propsStreamer.settings.wasm = {
  path: "https://unpkg.com/web-ifc@0.0.53/",
  absolute: true,
};

/* MD
  We need to generate properties JSON with the following structure
  */

// @ts-ignore
interface StreamedProperties {
  types: {
    [typeID: number]: number[];
  };

  ids: {
    [id: number]: number;
  };

  indexesFile: string;
}

const jsonFile: StreamedProperties = {
  types: {},
  ids: {},
  indexesFile: "small.ifc-processed-properties-indexes",
};

/* MD
Similarly to geometries, here you will also get data and progress notification
using events. In addition to properties, you will get `indices`, which is an
indexation data of the properties to be able to use them effectively when
streamed.
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
  Great! Now that we have everything setup, is time to finally convert the IFC file. In order to trigger the conversion, we can just do the following:
  */

async function processFile() {
  const fetchedIfc = await fetch("https://thatopen.github.io/engine_components/resources/small.ifc");
  const ifcBuffer = await fetchedIfc.arrayBuffer();
  // We will need this information later to also convert the properties
  const ifcArrayBuffer = new Uint8Array(ifcBuffer);
  // This triggers the conversion, so the listeners start to be called
  await propsStreamer.streamFromBuffer(ifcArrayBuffer);
}

/* MD
  If everything went as expected, you should now be seeing some files being downloaded from your app 🤯 Do not get scary if they're a lot, as big models tend to have many files! All of that is the information the streaming uses in order to display the geometry in the most efficient way possible 💪
  */

BUI.Manager.init();

const panel = BUI.Component.create<BUI.PanelSection>(() => {
  return BUI.html`
    <bim-panel active label="IFC Properties Tiler Tutorial" 
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
