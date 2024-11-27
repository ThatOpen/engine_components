/* MD
  ### Storing View Information 👁‍🗨
  ---
  Something that is pretty common in pretty much all 3D applications is to store the camera position to easily retrieve it later. When it comes to BIM apps, an important addition is not only to store the camera position but also the selected elements and filtered elements. Currently, there is not an isolated standard to define those things; however, the BCF schema (which is an standard for communication between different BIM apps) includes both topics and viewpoints.
  
  :::info

  In a nutshell, topics stores information about the communication (such as title, type, status, assignee, comments, etc) and the viewpoint stores the camera location, target, selected elements, isolations, etc.

  :::
  
  Despite there is not an isolated schema to define camera position and related elements, viewpoints in the BCF schema describes that! In That Open Engine we made a Viewpoints component, which is pretty much an extraction of the BCF viewpoints and you will learn how to use them right now!

  ### 🚧 Scaffolding a BIM App
  ---
  Before we dive in, let's create a very simple app with the engine. Start by including the dependencies:
  */

// eslint-disable-next-line import/no-extraneous-dependencies
import * as BUI from "@thatopen/ui";
import * as THREE from "three";
import * as WEBIFC from "web-ifc";
// You have to import from @thatopen/components
import * as OBC from "../..";

/* MD
  Then, initialize components:
  */

// To have the possibility to use some plug n play UI, initialize the user interface library
BUI.Manager.init();
const viewport = document.createElement("bim-viewport");

const components = new OBC.Components();

const worlds = components.get(OBC.Worlds);
const world = worlds.create<
  OBC.SimpleScene,
  OBC.SimpleCamera,
  OBC.SimpleRenderer
>();

world.scene = new OBC.SimpleScene(components);
world.scene.setup();

world.renderer = new OBC.SimpleRenderer(components, viewport);
world.camera = new OBC.SimpleCamera(components);

const viewerGrids = components.get(OBC.Grids);
viewerGrids.create(world);

components.init();

await world.camera.controls.setLookAt(12, 6, 8, 0, 2, -2);

/* MD
  Believe it or not, viewpoints can be used without any model. However, it is way more convenient when you use it in conjuction with IFC files. So, let's load a pretty basic IFC model from a remote repository to get started:
  */

const ifcLoader = components.get(OBC.IfcLoader);
await ifcLoader.setup();
const file = await fetch(
  "https://thatopen.github.io/engine_components/resources/small.ifc",
);
const data = await file.arrayBuffer();
const buffer = new Uint8Array(data);
const model = await ifcLoader.load(buffer);
world.scene.three.add(model);

/* MD
  ### 👀 Creating Viewpoints
  ---
  Creating viewpoints is extremely simple, and it can be done is just these few lines of code:
  */

const viewpoints = components.get(OBC.Viewpoints);
const viewpoint = viewpoints.create(world, { title: "My Viewpoint" }); // You can set an optional title for UI purposes

/* MD
  By default the viewpoint position will be set based on the world's camera. In case you need to update it, then you can change the camera position and trigger the corresponding method. For demostration purposes, let's create a general function that we can trigger later using a button:
*/

const updateViewpointCamera = async () => {
  console.log("Position before updating", viewpoint.position);
  viewpoint.updateCamera();
  console.log("Position after updating", viewpoint.position);
};

/* MD
  :::tip

  Of course, you don't have to create a function to trigger the update method in the viewpoint. You can just trigger it right away. We wrap it in a function to log the position before and after.

  :::

  Also, set the camera back to the viewpoint position is really easy. Once again, let's create a very simple function to trigger from the UI:
  */

const setWorldCamera = async () => {
  const initialPosition = new THREE.Vector3();
  world.camera.controls.getPosition(initialPosition);
  console.log("Camera position before updating", initialPosition);
  await viewpoint.go(world);
  const finalPosition = new THREE.Vector3();
  world.camera.controls.getPosition(finalPosition);
  console.log("Camera position before updating", finalPosition);
};

/* MD
  ### 🧱 Adding and Retrieving Model Elements
  ---
  What is a good viewpoint if you can't store and get back selections? Well, luckily it is extremely simple with viewpoints! There are mainly two ways in which you can store elements in a viewpoint: using a FragmentIdMap or GUIDs. The method you choice depends on your app needs. To start easy, let's suppose you already know some GUIDs of your model and want to add then to your viewpoint, in that case you can do it like this: 
  */

viewpoint.selectionComponents.add(
  "2idC0G3ezCdhA9WVjWe",
  "2idC0G3ezCdhA9WVjWe$Pp",
);

/* MD
  That method is fine if you are transfering selections between different BIM apps as the main way to do it is through GUIDs. However, using solely That Open Engine the most common way to get selections is through the use of FragmentIdMaps. Most of them comes from the Highlighter (see the related tutorial!) as it reports model selections. In this case, for simplicity purposes, let's programatically generate a FragmentIdMap for all walls in the model and add it to the viewpoint:
  */

const walls = await model.getAllPropertiesOfType(WEBIFC.IFCWALLSTANDARDCASE);
if (walls) {
  const expressIDs = Object.values(walls).map((attrs) => attrs.expressID);
  const fragmentIdMap = model.getFragmentMap(expressIDs);
  viewpoint.addComponentsFromMap(fragmentIdMap);
}

/* MD
  :::info

  In BCF, the elements related to a viewpoint are called components.

  :::

  If you inspect the viewpoint components (elements it includes) you will notice not only the two GUIDs we added before, but also new GUIDs representing the walls we added previously based on the FragmentIdMap. Let's create a pretty basic function to print into console the selection components both as GUIDs and as a FragmentIdMap you can use with components like the Highlighter or the Hider:
  */

const reportComponents = () => {
  const selectionGuids = viewpoint.selectionComponents;
  const selectionFragmentIdMap = viewpoint.selection;
  console.log(selectionGuids, selectionFragmentIdMap);
};

/* MD
  ### 🔗 Relating Viewpoints and Topics
  ---
  One of the most common uses of a viewpoint is to relate it with a topic to further describe a communication. Topics and viewpoints are always created separately, but then you can decide which viewpoints belongs to which topics (not the other way around). The relation is defined by adding one or several viewpoint GUID to the topic, and it can be done as follows:
  */

const bcfTopics = components.get(OBC.BCFTopics);
const topic = bcfTopics.create();
topic.viewpoints.add(viewpoint.guid);

/* MD
  As simple as that! A couple of things to consider are:

  - If you're using the plug n play topics UI from `@thatopen/ui-obc`, right after you add a viewpoint the topic the corresponding UI will be updated. Check the TopicsUI tutorial to know more!

  - When you export the topic to a BCF file, the viewpoint will be also serialized and exported following the standard.

  Now, you may be wondering why using the GUID and not the whole viewpoint? Easy, to prevent possible memory leaks when deleting viewpoints using the component. This means, if you need to get the actual viewpoint object from a topic, you can do the following:
  */

const reportTopicViewpoints = () => {
  const topicViewpoints = [...topic.viewpoints].map((guid) =>
    viewpoints.list.get(guid),
  );
  console.log(topicViewpoints);
};

/* MD
  ### Wrapping Up ✅
  ---
  To complete this tutorial, let's create a very simple panel to include buttons that triggers the import and export funcionalities, and also setup the app content like this:
  */

const panel = BUI.Component.create<BUI.PanelSection>(() => {
  return BUI.html`
    <bim-panel active label="Viewpoints Tutorial" class="options-menu">
      <bim-panel-section collapsed label="Controls">
        <bim-button @click=${updateViewpointCamera} label="Update Viewpoint Camera"></bim-button> 
        <bim-button @click=${setWorldCamera} label="Set World Camera"></bim-button>
        <bim-button @click=${reportComponents} label="Report Selection Components"></bim-button>
        <bim-button @click=${reportTopicViewpoints} label="Report Topic Viewpoints"></bim-button>
      </bim-panel-section>
    </bim-panel>
    `;
});

document.body.append(panel);

const app = document.getElementById("app") as BUI.Grid;
app.layouts = {
  main: {
    template: `"viewport"`,
    elements: { viewport },
  },
};

app.layout = "main";

/* MD
  Congratulations! You already have the tools you need to create viewpoints in your app. Let's continue with more tutorials!
  */
