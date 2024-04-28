/* eslint import/no-extraneous-dependencies: 0 */

import Stats from "stats.js";
// @ts-ignore
import * as dat from "three/examples/jsm/libs/lil-gui.module.min";
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

const streamer = new OBC.FragmentIfcStreamConverter(components);
streamer.settings.wasm = {
  path: "https://unpkg.com/web-ifc@0.0.53/",
  absolute: true,
};

/* MD
    The `FragmentIfcStreamConverter` class takes IFC files and transform them into
    tiles. You can use events to get the data. The `onGeometryStreamed` event will
    give you the geometries bundled in a binary file, as well as an object with
    information about the geometries contained within this file.
    */

streamer.onGeometryStreamed.add((geometry) => {
  console.log(geometry);
});

/* MD
    You can control the amount of geometries inside a file using the settings. The
    way the streaming works can't guarantee a precise number of geometries within a file,
    but in most cases it will be quite close to the given number.
    */

streamer.settings.minGeometrySize = 20;

/* MD
    Similarly, you can get the assets data and control the number of assets per chunk like this:
    */

streamer.onAssetStreamed.add((assets) => {
  console.log(assets);
});

streamer.settings.minAssetsSize = 1000;

/* MD
    Just like when using the normal `FragmentIfcLoader`, when you stream an IFC file you are
    creating a `FragmentsGroup`. Using this event, you can get it:
    */

streamer.onIfcLoaded.add(async (groupBuffer) => {
  console.log(groupBuffer);
});

/* MD
    Finally, you can use this to get notified as the streaming process progresses:
    */

streamer.onProgress.add((progress) => {
  console.log(progress);
});

/* MD
    With everything in place, it's time to stream the IFC file and get all the tiles!
    */

const fetchedIfc = await fetch("../../../resources/small.ifc");
const ifcBuffer = await fetchedIfc.arrayBuffer();
streamer.streamFromBuffer(new Uint8Array(ifcBuffer));

/* MD
    ### 📋 Streaming the properties
    ___
    You can also stream the properties of an IFC file. Why? Because some files can have
    millions of properties, and trying to save them naively in a normal DB is not very
    scalable/affordable. Using this system, you'll be able to store and retrieve the
    data of models of any size without big cloud costs. We can do this conversion
    using the `FragmentPropsStreamConverter`:

    */

const propsStreamer = new OBC.FragmentPropsStreamConverter(components);

propsStreamer.settings.wasm = {
  path: "https://unpkg.com/web-ifc@0.0.53/",
  absolute: true,
};

/* MD
    Similarly to geometries, here you will also get data and progress notification
    using events. In addition to properties, you will get `indices`, which is an
    indexation data of the properties to be able to use them effectively when
    streamed.
    */

propsStreamer.onPropertiesStreamed.add(async (props) => {
  console.log(props);
});

propsStreamer.onProgress.add(async (progress) => {
  console.log(progress);
});

propsStreamer.onIndicesStreamed.add(async (props) => {
  console.log(props);
});

/* MD
    Just call the `streamFromBuffer` method and you are ready to go!
    */

propsStreamer.streamFromBuffer(new Uint8Array(ifcBuffer));

// Set up stats

const stats = new Stats();
stats.showPanel(2);
document.body.append(stats.dom);
stats.dom.style.left = "0px";
world.renderer.onBeforeUpdate.add(() => stats.begin());
world.renderer.onAfterUpdate.add(() => stats.end());
