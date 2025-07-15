/* MD
  ## 👌 Communicating The Right Way
  ---
  Effective communication is essential for all projects, whether in construction or other industries. It is crucial to have a reliable method for project members to communicate and track discussions. In construction projects, BuildingSMART introduced the BIM Collaboration Format (BCF) to standardize communication about ongoing topics among stakeholders. That Open Engine includes integration with BCF, enabling you to read, create, and update any BCF file seamlessly. Let's explore how it works!

  ### 🖖 Importing our Libraries
  First things first, let's install all necessary dependencies to make this example work:
*/

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
await world.camera.controls.setLookAt(68, 23, -8.5, 21.5, -5.5, 23);

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

const fragPaths = ["https://thatopen.github.io/engine_components/resources/frags/school_arq.frag"];
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
  ### ✨ Using The BCFTopics Component
  Let's enable your app to handle BCF files effortlessly. BCF files are compressed archives (zip) containing folders, each representing a topic. Topics are communications within a project, such as design issues, progress updates, or information requests. They include metadata like title, description, status, assignee, stage, comments, and some more.

  :::info[BCF Basics]

  BCF files also contain viewpoints, which store camera positions, targets, and references to IFC model entities via GUIDs. Viewpoints are linked to topics, but a topic can exist without a viewpoint, while a viewpoint must belong to a topic.

  :::

  In That Open Engine, you can create topics and viewpoints independently, then link them as needed. This tutorial focuses on topics. To get started, create an instance of the topics component:
*/

const bcfTopics = components.get(OBC.BCFTopics);
bcfTopics.setup({
  author: "signed.user@mail.com", // This will be the mail used in all topics created
  types: new Set([...bcfTopics.config.types, "Information", "Coordination"]),
  statuses: new Set(["Active", "In Progress", "Done", "In Review", "Closed"]),
  users: new Set(["juan.hoyos4@gmail.com"]),
  version: "3",
});

/* MD
  The component supports callbacks for topic creation, deletion, and updates. Here's an example of creating a new viewpoint whenever a topic is created:
*/

const viewpoints = components.get(OBC.Viewpoints);
bcfTopics.list.onItemSet.add(async ({ value: topic }) => {
  const viewpoint = viewpoints.create();
  viewpoint.world = world;

  // Topics include references to the viewpoints.
  // The reference is made using the viewpoint GUID instead of the whole viewpoint object.
  // This prevents having possible memory leaks.
  topic.viewpoints.add(viewpoint.guid);

  // Comments can be optionally related to viewpoints.
  // In this case, each time a comment is added the default viewpoint is used on it.
  topic.comments.onItemSet.add(({ value: comment }) => {
    comment.viewpoint = viewpoint.guid;
  });
});

/* MD
  :::info

  For more details on viewpoints, check the dedicated tutorial.

  :::

  ### 📡 Creating Topics
  With the component set up, let's create a topic. While you can instantiate a Topic directly, it's best to use the BCFTopics component. This ensures the topic is tracked and accessible later. Here's how to create a topic:
*/

const topic = bcfTopics.create({
  title: "Missing information",
  description: "It seems these elements are badly defined.",
  dueDate: new Date("08-01-2020"),
  type: "Clash",
  priority: "Major",
  stage: "Design",
  labels: new Set(["Architecture", "Cost Estimation"]),
  assignedTo: "juan.hoyos@thatopen.com",
});

/* MD
  By BCF standards, topics must include a guid, type, status, title, creationDate, and creationAuthor. However, when creating a topic, all parameters are optional because default values are preconfigured. You can customize these defaults, including additional properties, to better suit your app. Here's how:
*/

// Only topics creater after this will be affected.
// creationDate is excluded as is taken from the current date.
// creationAuthor is excluded as is taken from BCFTopics.config.author
// guid is excluded as its set internally by the class.
OBC.Topic.default = {
  title: "Custom Default Title",
  type: "Custom Default Topic Type",
  status: "Custom Default Topic Status",
  priority: "Custom Default Priority", // this is optional
};

/* MD
  One of the most common things in topics is to create comments. You can do it very easily like this:
  */

const firstComment = topic.createComment(
  "What if we talk about this next meeting?",
);

const secondComment = topic.createComment("Hi there! I agree.");

/* MD
  :::tip

  Comments automatically set the author and creationDate based on BCFTopics.config.author and the current date.

  :::

  ### 🔄 Editing Topics
  Topics are editable like regular classes. Direct property updates won't trigger events, but using the `set` method will. Here's an example of listening for topic updates:
*/

bcfTopics.list.onItemUpdated.add(({ value: topic }) => {
  console.log(`Topic ${topic.title} was updated!`);
});

// This updates the information, but doesn't trigger any update.
topic.title = "Updated Title";

// This updates the information, but also triggers updates listened by the UI in `@thatopen/ui`
topic.set({ title: "New Title" });

topic.comments.onItemUpdated.add(({ value: comment }) => {
  console.log("The following comment has been updated:", comment);
});

// When you update a comment, it triggers an event you can listen in topic.comments.onItemUpdated
firstComment.comment =
  "What if we talk about this next meeting with all partners?";

secondComment.comment = "Will tell you tomorrow when is more convenient!";

/* MD
  ### ⏬ Exporting BCF Files
  A robust BCF system is incomplete without the ability to export files for use in other BIM applications. Here's a simple function to export BCF files:
*/

const exportBCF = async () => {
  // You can indicate which topics to export. All are exported by default
  const bcf = await bcfTopics.export();
  // You must set the extension by yourself. The export just gives the binary data.
  const bcfFile = new File([bcf], "topics.bcf");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(bcfFile);
  a.download = bcfFile.name;
  a.click();
  URL.revokeObjectURL(a.href);
};

/* MD
  ### ⏫ Importing BCF Files
  The BCFTopics component allows importing valid BCF files (versions 2.1/3.0). Here's a simple implementation:
  */

const loadBCF = () => {
  const input = document.createElement("input");
  input.multiple = false;
  input.accept = ".bcf";
  input.type = "file";

  input.addEventListener("change", async () => {
    const file = input.files?.[0];
    if (!file) return;
    const buffer = await file.arrayBuffer();
    const { topics, viewpoints } = await bcfTopics.load(new Uint8Array(buffer));
    console.log(topics, viewpoints);
  });

  input.click();
};

/* MD
  :::tip

  Uploading a BCF file creates corresponding topics and their associated viewpoints. For more details on viewpoints, refer to the dedicated tutorial.

  :::

  ### 🧩 Adding some UI (optional but recommended)
  We will use the `@thatopen/ui` library to add some simple and cool UI elements to our app. First, we need to call the `init` method of the `BUI.Manager` class to initialize the library:
*/

BUI.Manager.init();

/* MD
Now we will add some UI to play around with the actions in this tutorial. For more information about the UI library, you can check the specific documentation for it!
*/

const panel = BUI.Component.create<BUI.PanelSection>(() => {
  return BUI.html`
    <bim-panel active label="BCFTopics Tutorial" class="options-menu">
      <bim-panel-section label="Info">
        <bim-label style="width: 14rem; white-space: normal;">💡 To fully experience this tutorial, open your browser console!</bim-label> 
      </bim-panel-section>
      <bim-panel-section label="Controls">
        <bim-button @click=${exportBCF} label="Export BCF"></bim-button> 
        <bim-button @click=${loadBCF} label="Load BCF"></bim-button>
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
  That's it! Now you're able to create, edit, import, and export BCF files, as well as manage topics effectively. Congratulations! Keep going with more tutorials in the documentation.
*/
