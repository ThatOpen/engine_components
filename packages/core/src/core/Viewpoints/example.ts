/* MD
  ## 📄 Storing View Information
  ---
  Most 3D applications commonly store camera positions for easy retrieval. In BIM apps, it's also useful to store selected and filtered elements. While there isn't a universal standard for this, the BCF schema (used for communication between BIM apps) includes topics and viewpoints.

  :::info

  Topics store communication details like title, type, status, assignee, and comments. Viewpoints define camera positions, targets, selected elements, and isolations.

  :::

  The Viewpoints component in That Open Engine extracts BCF viewpoints, enabling you to manage camera positions and related elements effectively. Let's explore how to use it!
*/

import * as THREE from "three";
import Stats from "stats.js";
import * as BUI from "@thatopen/ui";
// You have to import * as OBC from "@thatopen/components"
import * as OBC from "../..";

/* MD
  ### 🌎 Setting up a Simple Scene
  To get started, let's set up a basic ThreeJS scene. This will serve as the foundation for our application and allow us to visualize the 3D models effectively:
*/

const components = new OBC.Components();

const worlds = components.get(OBC.Worlds);
const world = worlds.create<
  OBC.SimpleScene,
  OBC.OrthoPerspectiveCamera,
  OBC.SimpleRenderer
>();

world.scene = new OBC.SimpleScene(components);
world.scene.setup();
world.scene.three.background = null;

const container = document.getElementById("container")!;
world.renderer = new OBC.SimpleRenderer(components, container);
world.camera = new OBC.OrthoPerspectiveCamera(components);
await world.camera.controls.setLookAt(78, 20, -2.2, 26, -4, 25);

components.init();

/* MD
  ### 🛠️ Setting Up Fragments
  Now, let's configure the FragmentsManager. This will allow us to load models effortlessly and start manipulating them with ease:
*/

const githubUrl =
  "https://thatopen.github.io/engine_fragment/resources/worker.mjs";
const fetchedUrl = await fetch(githubUrl);
const workerBlob = await fetchedUrl.blob();
const workerFile = new File([workerBlob], "worker.mjs", {
  type: "text/javascript",
});
const workerUrl = URL.createObjectURL(workerFile);
const fragments = components.get(OBC.FragmentsManager);
fragments.init(workerUrl);

world.camera.controls.addEventListener("rest", () =>
  fragments.core.update(true),
);

world.onCameraChanged.add((camera) => {
  for (const [, model] of fragments.list) {
    model.useCamera(camera.three);
  }
  fragments.core.update(true);
});

fragments.list.onItemSet.add(({ value: model }) => {
  model.useCamera(world.camera.three);
  world.scene.three.add(model.object);
  fragments.core.update(true);
});

/* MD
  ### 📂 Loading Fragments Models
  With the core setup complete, it's time to load a Fragments model into our scene. Fragments are optimized for fast loading and rendering, making them ideal for large-scale 3D models.

  :::info Where can I find Fragment files?

  You can use the sample Fragment files available in our repository for testing. If you have an IFC model you'd like to convert to Fragments, check out the IfcImporter tutorial for detailed instructions.

  :::
*/

const fragPaths = [
  "https://thatopen.github.io/engine_components/resources/frags/school_arq.frag",
  "https://thatopen.github.io/engine_components/resources/frags/school_str.frag",
];

await Promise.all(
  fragPaths.map(async (path) => {
    const modelId = path.split("/").pop()?.split(".").shift();
    if (!modelId) return null;
    const file = await fetch(path);
    const buffer = await file.arrayBuffer();
    return fragments.core.load(buffer, { modelId });
  }),
);

/* MD
  ### ✨ Using The Viewpoints Component
  Creating viewpoints is extremely simple. Let's start by getting the component's instance to use it along the example:
*/

const viewpoints = components.get(OBC.Viewpoints);
viewpoints.world = world;

/* MD
  Once completed, creating the viewpoint is straightforward. Let's define a helper function to streamline the process, allowing us to maintain the flow of the example and execute the function from the UI.
*/

let viewpoint: OBC.Viewpoint | undefined;
const createViewpoint = async () => {
  viewpoint = viewpoints.create();
  // You can set an optional title for UI purposes
  viewpoint.title = "My Viewpoint";

  // Update the viewpoint to capture the current camera data, as this is the most common use case:
  await viewpoint.updateCamera();
};

/* MD
  By default, the method used to update the viewpoint camera captures a snapshot of the current world's camera view. This snapshot is included when the viewpoint is exported as part of a BCF topic. You can update the snapshot at any time:
*/

const updateSnapshot = () => {
  if (!viewpoint) return;
  viewpoint.takeSnapshot();
};

/* MD
  The viewpoint position is automatically set based on the world's camera by default. If you need to update it, you can adjust the camera position and trigger the corresponding method. For demonstration purposes, let's create a general function that can be triggered later using a button:
*/

const updateViewpointCamera = async () => {
  if (!viewpoint) return;
  console.log("Position before updating", viewpoint.position);
  await viewpoint.updateCamera();
  console.log("Position after updating", viewpoint.position);
};

/* MD
  Setting the camera back to the viewpoint position is straightforward. Let's create a simple function that can be triggered from the UI:
*/

const setWorldCamera = async () => {
  if (!viewpoint) return;
  const initialPosition = new THREE.Vector3();
  world.camera.controls.getPosition(initialPosition);
  console.log("Camera position before updating", initialPosition);
  await viewpoint.go();
  const finalPosition = new THREE.Vector3();
  world.camera.controls.getPosition(finalPosition);
  console.log("Camera position before updating", finalPosition);
};

/* MD
  ### 🧱 Adding and Retrieving Model Elements
  ---
  Viewpoints make it easy to store and retrieve selected elements. You can add elements using GUIDs obtained from ModelIdMaps. For instance, if you already have some GUIDs, you can add them to a viewpoint. Since the viewpoint will be created dynamically using the UI in this example, let's listen for the creation of a new viewpoint and add some default items to it:
  */

viewpoints.list.onItemSet.add(({ value: viewpoint }) => {
  viewpoint.selectionComponents.add(
    "3V$FMCDUfCoPwUaHMPfteW",
    "1fIVuvFffDJRV_SJESOtCZ",
  );
});

/* MD
  While GUIDs are ideal for transferring selections between BIM apps, within That Open Engine, ModelIdMaps are more commonly used for selections. For example, the Highlighter component generates these maps based on model selections. Here's how to programmatically create a ModelIdMap for all doors in the model and add it to the viewpoint:
*/

// Once again, as the viewpoint will be created on demand
// let's listen for the creation event to assing the doors to it
viewpoints.list.onItemSet.add(async ({ value: viewpoint }) => {
  const finder = components.get(OBC.ItemsFinder);
  const doors = await finder.getItems([{ categories: [/DOOR/] }]);
  const guids = await fragments.modelIdMapToGuids(doors);
  viewpoint.selectionComponents.add(...guids);
});

/* MD
  :::info

  In BCF, the elements associated with a viewpoint are referred to as components. If you're unsure how to use the ItemsFinder to retrieve the elements you need, check out the corresponding component tutorial for guidance.

  :::

  Viewpoint components include the GUIDs added earlier and new ones from the FragmentIdMap. Here's a simple function to log selection components as GUIDs and a FragmentIdMap for use with Highlighter or Hider:
*/

const reportComponents = async () => {
  if (!viewpoint) return;
  const selectionGuids = viewpoint.selectionComponents;
  const selectionMap = await viewpoint.getSelectionMap();
  console.log(selectionGuids, selectionMap);
};

/* MD
  To make things more engaging, let's isolate the elements associated with the viewpoint as follows:
*/

const isolateComponents = async () => {
  if (!viewpoint) return;
  const items = await viewpoint.getSelectionMap();
  const hider = components.get(OBC.Hider);
  hider.isolate(items);
};

/* MD
  ### 🔗 Linking Viewpoints to Topics
  Viewpoints can be linked to topics to enhance communication. While topics and viewpoints are created independently, you can associate one or more viewpoint GUIDs with a topic as follows:
  */

// Once again, as the viewpoint will be created on demand
// let's listen for the creation event to assing the doors to it
viewpoints.list.onItemSet.add(({ value: viewpoint }) => {
  const bcfTopics = components.get(OBC.BCFTopics);
  const topic = bcfTopics.create();
  topic.viewpoints.add(viewpoint.guid);
});

/* MD
  Simple as that! Using GUIDs instead of full viewpoint objects helps avoid memory leaks when deleting viewpoints. Finally, just for fun, let's get the data from the viewpoint snapshot so it can be displayed in the UI
  */

const getViewpointSnapshotData = () => {
  if (!viewpoint) return null;
  const data = viewpoints.snapshots.get(viewpoint.snapshot);
  if (!data) return null;
  return data;
};

/* MD
  ### 🧩 Adding some UI (optional but recommended)
  We will use the `@thatopen/ui` library to add some simple and cool UI elements to our app. First, we need to call the `init` method of the `BUI.Manager` class to initialize the library:
*/

BUI.Manager.init();

/* MD
Now we will add some UI to play around with the actions in this tutorial. For more information about the UI library, you can check the specific documentation for it!
*/

const [panel, updatePanel] = BUI.Component.create<BUI.PanelSection, {}>((_) => {
  const onResetVisibility = async ({ target }: { target: BUI.Button }) => {
    target.loading = true;
    const hider = components.get(OBC.Hider);
    await hider.set(true);
    target.loading = false;
  };

  let controls = BUI.html`
    <bim-panel-section label="Viewpoint Creation">
      <bim-label>To start, hit the button below to create a new viewpoint</bim-label>
      <bim-button label="Create Viewpoint" @click=${createViewpoint}></bim-button>
    </bim-panel-section>
  `;

  if (viewpoint) {
    const snapshotData = getViewpointSnapshotData();

    let snapshotElement: BUI.TemplateResult | undefined;
    if (snapshotData) {
      const blob = new Blob([snapshotData], { type: "image/png" });
      const url = URL.createObjectURL(blob);
      snapshotElement = BUI.html`
        <img src="${url}" alt="Viewpoint Snapshot" style="max-width: 20rem;"/>
      `;
    }

    const onDeleteViewpoint = () => {
      if (!viewpoint) return;
      const { guid } = viewpoint;
      viewpoint = undefined;
      viewpoints.list.delete(guid);
    };

    controls = BUI.html`
      <bim-panel-section label="Controls">
        <bim-button @click=${updateSnapshot} label="Update Snapshot"></bim-button>
        ${snapshotElement}
        <bim-button @click=${updateViewpointCamera} label="Update Viewpoint Camera"></bim-button>
        <bim-button @click=${setWorldCamera} label="Set World Camera"></bim-button>
        <bim-button @click=${reportComponents} label="Report Selection Components"></bim-button>
        <bim-button @click=${isolateComponents} label="Isolate Components"></bim-button>
        <bim-button @click=${onDeleteViewpoint} label="Delete Viewpoint"></bim-button>
      </bim-panel-section>
    `;
  }

  return BUI.html`
    <bim-panel active label="Viewpoints Tutorial" class="options-menu">
      <bim-panel-section label="Information">
        <bim-label style="white-space: normal; width: 18rem;">To better experience this tutorial, open the developer tool's console in your browser to see some logs.</bim-label>
        <bim-button label="Reset Visibility" @click=${onResetVisibility}></bim-button>
      </bim-panel-section>
      ${controls}
    </bim-panel>
  `;
}, {});

viewpoints.list.onItemDeleted.add(() => updatePanel());
viewpoints.list.onItemUpdated.add(() => updatePanel());

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
  ### ⏱️ Measuring the performance (optional)
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
  ### 🎉 Wrap up
  That's it! Now you're able to create, update, and manage viewpoints effectively using That Open Engine. Congratulations! Keep exploring more tutorials in the documentation to enhance your skills further.
*/
