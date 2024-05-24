/* eslint import/no-extraneous-dependencies: 0 */

import * as WEBIFC from "web-ifc";
import * as BUI from "@thatopen/ui";
import Stats from "stats.js";
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

world.camera.controls.setLookAt(12, 6, 8, 0, 0, -10);

world.scene.setup();

const grids = components.get(OBC.Grids);
grids.create(world);

/* MD
  ### 🏠👉🤖 From IFC to fragment in 1 minute
  ___
  Fragments are great: they are lightweight, they are fast and we
  have tons of tools to work with them. But fragments are not used
  outside our libraries. So how can we convert an IFC file to fragments?
  Easy: with the `FragmentIfcLoader`! Let's start by creating it.
  */

const fragments = components.get(OBC.FragmentsManager);
const fragmentIfcLoader = components.get(OBC.IfcLoader);

/* MD
  :::info Why not just IFC?

  IFC is nice because it lets us exchange data with many tools in the
  AECO industry. But it also has some limitations. In a nutshell,
  data coming from IFC needs to be processed and converted to triangles
  to be able to draw it in 3D, and that requires processing power
  and time! That's why we convert it to fragments to display it.
  Once you have the fragments, you can store them and load them
  directly the next time your user tries to load that IFC: it will
  load 10 times faster!

  :::


  ### 🔭🔧 Calibrating the converter
  ___
  Now, we need to configure the path of the WASM files. What's WASM?
  It's a technology that lets us run C++ on the browser, which means
  that we can load IFCs super fast! These files are the compilation of
  our `web-ifc` library. You can find them in the github repo and in NPM.
  These files need to be available to our app, so you have 2 options:

  - Download them and serve them statically.
  - Get them from a remote server.

  The easiest way is getting them from unpkg, and the cool thing is that
  you don't need to do it manually! It can be done directly by the tool
  just by writing the following:
  */

await fragmentIfcLoader.setup();

/* If you want to the path to unpkg manually, then you can skip the line
  above and set them manually as below:
  fragmentIfcLoader.settings.wasm = {
      path: "https://unpkg.com/web-ifc@0.0.53/",
      absolute: true
  } */

/* MD
  Awesome! Optionally, we can exclude categories that we don't want
  to convert to fragments like very easily:
  */

const excludedCats = [
  WEBIFC.IFCTENDONANCHOR,
  WEBIFC.IFCREINFORCINGBAR,
  WEBIFC.IFCREINFORCINGELEMENT,
];

for (const cat of excludedCats) {
  fragmentIfcLoader.settings.excludedCategories.add(cat);
}

/* MD
  We can further configure the conversion using the `webIfc` object.
  In this example, we will make the IFC model go to the origin of
  the scene (don't worry, this supports model federation) and
  optimize the profiles geometry so that it generates very
  efficient geometry for certain geometries (e.g. HVAC):
  */

fragmentIfcLoader.settings.webIfc.COORDINATE_TO_ORIGIN = true;
fragmentIfcLoader.settings.webIfc.OPTIMIZE_PROFILES = true;

/* MD
  ### 🚗🔥 Loading the IFC
  ___
  Next, let's define a function to load the IFC programmatically.
  We have hardcoded the path to one of our IFC files, but feel free
  to do this with any of your own files!

 :::info Opening local IFCs

  Keep in mind that the browser can't access the file of your
  computer directly, so you will need to use the Open File API to
  open local files.

  :::
  */

// const cullers = components.get(OBC.Cullers);
// const culler = cullers.create(world);
// culler.enabled = true;

async function loadIfc() {
  const file = await fetch("https://thatopen.github.io/engine_components/resources/small.ifc");
  const data = await file.arrayBuffer();
  const buffer = new Uint8Array(data);
  const model = await fragmentIfcLoader.load(buffer);
  model.name = "example";
  world.scene.three.add(model);
  // for (const mesh of model.children) {
  //   culler.add(mesh as any);
  // }
}

// world.camera.controls.addEventListener("sleep", () => {
//   culler.needsUpdate = true
// })

/* MD
  ### 🎁 Exporting the result
  ___
  Once you have your precious fragments, you might want to save them
  so that you don't need to open this IFC file each time your user
  gets into your app. Instead, the next time you can load the
  fragments directly. Defining a function to export fragments
  is as easy as this:

  */

function download(file: File) {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(file);
  link.download = file.name;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

async function exportFragments() {
  if (!fragments.groups.size) {
    return;
  }
  const group = Array.from(fragments.groups.values())[0];
  const data = fragments.export(group);
  download(new File([new Blob([data])], "small.frag"));

  const properties = group.getLocalProperties();
  if (properties) {
    download(new File([JSON.stringify(properties)], "small.json"));
  }
}

/* MD
  ### 🧠🧼 Cleaning memory
  ___
  Now, just like in the `FragmentManager` tutorial, you will need
  to dispose the memory if your user wants to reset the state of the
  scene, especially if you are using Single Page Application
  technologies like React, Angular, Vue, etc. To do that, you
  can simply call the `dispose` method:
*/

function disposeFragments() {
  fragments.dispose();
}

/* MD
  That's it! Congrats, now you can load IFC files into your app,
  generate the 3D geometry and property data for them and navigate
  them in 3D. In other tutorials, you'll find tons of tools to
  work with them and create amazing BIM apps! See you there 💪
*/

// Set up stats

const stats = new Stats();
stats.showPanel(2);
document.body.append(stats.dom);
stats.dom.style.left = "0px";
world.renderer.onBeforeUpdate.add(() => stats.begin());
world.renderer.onAfterUpdate.add(() => stats.end());

BUI.Manager.init();

const panel = BUI.Component.create<BUI.PanelSection>(() => {
  return BUI.html`
    <bim-panel active label="IFC Loader Tutorial" 
      style="position: fixed; top: 5px; right: 5px">
      
      <bim-panel-section style="padding-top: 12px;">
      
        <bim-button label="Load IFC"
          @click="${() => {
            loadIfc();
          }}">
        </bim-button>  
            
        <bim-button label="Export fragments"
          @click="${() => {
            exportFragments();
          }}">
        </bim-button>  
            
        <bim-button label="Dispose fragments"
          @click="${() => {
            disposeFragments();
          }}">
        </bim-button>
      
      </bim-panel-section>
      
    </bim-panel>
  `;
});

document.body.append(panel);

// For debugging

fragments.onFragmentsLoaded.add((model) => {
  console.log(model);
});
