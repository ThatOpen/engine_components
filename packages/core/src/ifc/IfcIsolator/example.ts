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
	### 🚗🏎️ Getting IFC and fragments
	---
	When we read an IFC file, we convert it to a geometry called Fragments. Fragments are a lightweight representation of geometry built on top of THREE.js `InstancedMesh` to make it easy to work with BIM data efficiently. All the BIM geometry you see in our libraries are Fragments, and they are great: they are lightweight, they are fast and we have tons of tools to work with them. But fragments are not used outside our libraries. So how can we convert an IFC file to fragments? Let's check out how:
	*/

const fragmentIfcLoader = components.get(OBC.IfcLoader);

/* MD
	:::info Why not just IFC?

	IFC is nice because it lets us exchange data with many tools in the AECO industry. But your graphics card doesn't understand IFC. It only understands one thing: triangles. So we must convert IFC to triangles. There are many ways to do it, some more efficient than others. And that's exactly what Fragments are: a very efficient way to display the triangles coming from IFC files.

	:::

	Once Fragments have been generated, you can export them and then load them back directly, without needing the original IFC file. Why would you do that? Well, because fragments can load +10 times faster than IFC. And the reason is very simple.	 When reading an IFC, we must parse the file, read the implicit geometry, convert it to triangles (Fragments) and send it to the GPU. When reading fragments, we just take the triangles and send them, so it's super fast.

	:::danger How to use Fragments?

	If you want to find out more about Fragments, check out the Fragments Manager tutorial.

	:::


	### 🔭🔧 Calibrating the converter
	---
	Now, we need to configure the path of the WASM files. What's WASM? It's a technology that lets us run C++ on the browser, which means that we can load IFCs super fast! These files are the compilation of our `web-ifc` library. You can find them in the github repo and in NPM. These files need to be available to our app, so you have 2 options:

	- Download them and serve them statically.
	- Get them from a remote server.

	The easiest way is getting them from unpkg, and the cool thing is that you don't need to do it manually! It can be done directly by the tool just by writing the following:
	*/

await fragmentIfcLoader.setup();

/* MD
	We can further configure the conversion using the `webIfc` object. In this example, we will make the IFC model go to the origin of the scene (don't worry, this supports model federation):
	*/

fragmentIfcLoader.settings.webIfc.COORDINATE_TO_ORIGIN = true;

/* MD
	### 🚗🔥 Loading the IFC
	---
	Next, let's define a function to load the IFC programmatically. We have hardcoded the path to one of our IFC files, but feel free to do this with any of your own files!

 :::info Opening local IFCs

	Keep in mind that the browser can't access the file of your computer directly, so you will need to use the Open File API to open local files.

	:::
*/

async function loadIfc() {
	const file = await fetch(
		"https://thatopen.github.io/engine_components/resources/small.ifc",
	);
	const data = await file.arrayBuffer();
	const buffer = new Uint8Array(data);
	const model = await fragmentIfcLoader.load(buffer);
	model.name = "example";
	world.scene.three.add(model);
}

/* MD
	### 🧰 Getting the necessary tools
	---

To convert IFC to JSON we need 2 things: `web-ifc` an the JSON exporter. The former is a component of this library, so we'll get it using the `get` method of the `components` instance. Next, we will create a new instance of web-ifc, which is the core of our libraries. This library can parse, read, edit and write IFC files very efficiently thanks to WebAssembly (WASM).
*/

const isolator = components.get(OBC.IfcIsolator);

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
	<bim-panel active label="IFC Isolator Tutorial" class="options-menu">
	 <bim-panel-section collapsed label="Controls">
			<bim-panel-section style="padding-top: 10px;">
				<bim-button label="Load IFC"
					@click="${() => {
						loadIfc();
					}}">
				</bim-button>

				<bim-button 
					label="Isolate Elements and Export to IFC" 
					@click="${async () => {
						const data = await isolator.splitIfc(webIfc, ifcData, [6518]);
						const file = new File([new Blob([data])], "isolated.ifc");
						const url = URL.createObjectURL(file);
						const link = document.createElement("a");
						link.download = "isolated.ifc";
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
