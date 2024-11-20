/* MD
  ### Communicating The Right Way 👌
  ---
  If there is something key in all projects (construction or not) is communication. Having not also a way to easily communicate between different project members but also to track communications is a must. For construction projects, the BuildingSMART created the BIM Collaboration Format (BCF) to standardize once and for all the way stakeholders communicate about on-going topics in the project. That Open Engine includes an integration with BCF, so you can read, create and update any BCF file you want. Let's learn how it works!

  ### 🚧 Scaffolding The Project
  ---
  Before we dive in, let's create a very simple app with the engine. Start by including the dependencies:
  */

// eslint-disable-next-line import/no-extraneous-dependencies
import * as BUI from "@thatopen/ui";
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

world.camera.controls.setLookAt(12, 6, 8, 0, 2, -2);

/* MD
  Depite BCFs can be used without any model, it is more convenient when you use it in conjuction with IFC files. So, let's load a pretty basic IFC model from a remote repository:
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
  ### Integrating With BCF 📃
  ---
  Now the fun part! Allowing your app to accept and generate BCF files is extremely simple, and it can be done in very few lines of code. Before going further, you should be aware of the BCF files structure:

  :::info[BCF 101]

  In a nutshell, BCF files are just compressed files (zip). In the compressed file you find one or more folders. Each folder represents what is known as a topic. A topic is a particular communication made in the same project; it can be a design issue, a construction progress, an information request, etc. The topics by themselves can hold information like the title, description, status, assignee, stage, comments, etc. Apart from the topics, the BCF can also hold viewpoints. Viewpoints include information such as camera position and target, while also containing reference to entities in the IFC model through its GUID. Finally, topics and viewpoints can be related to each other; however, in a BCF file a viewpoint shouldn't exist without a topic, but a topic can exist without a viewpoint.

  :::

  The approach took in That Open Engine is you can create topics and viewpoints appart. Then, you decide which viewpoints and topics to relate. This tutorial will be focused in topics, but you can see the corresponding viewpoints tutorial to know more about them! So, let's simply create an instance of the topics component: 
  */

const bcfTopics = components.get(OBC.BCFTopics);
bcfTopics.setup({
  author: "signed.user@mail.com", // This will be the mail used in all topics created
  types: new Set([...bcfTopics.config.types, "Information", "Coordination"]),
  statuses: new Set(["Active", "In Progress", "Done", "In Review", "Closed"]),
  users: new Set(["juan.hoyos4@gmail.com"]),
});

/* MD
  One cool thing about the component is you can add callbacks each time a topic is created, deleted or updated. In this case, and for demostration purposes, let's create a new viewpoint whenever a topic is created.
  */

const viewpoints = components.get(OBC.Viewpoints);
bcfTopics.list.onItemSet.add(({ value: topic }) => {
  const viewpoint = viewpoints.create(world, { title: topic.title });
  // Topics include references to the viewpoints.
  // The reference is made using the viewpoint GUID instead of the whole viewpoint object.
  // This prevents having possible memory leaks.
  topic.viewpoints.add(viewpoint.guid);

  // Comments can be optionally related to viewpoints.
  // In this case, each time a comment is added the default viewpoint is used on it.
  topic.comments.onItemSet.add(({ value: comment }) => {
    comment.viewpoint = viewpoint;
  });
});

/* MD
  :::info

  If you want to know more about viewpoints, please refer to the corresponding tutorial.

  :::

  ### Creating Topics 📡
  ---
  As the component is already setup, let's create a topic. Despite you can create instances of a Topic by yourslef, the best practice is to always make them through the BCFTopics component it-self as it always holds a reference to the created topic, so you can access it later. Also, by default some of the UI components in `@thatopen/ui-obc` listen to changes in `BCFTopics.list` to know when the UI has to be updated. Let's create the topic as follows:
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
  Based on the BCF standard, all topics must have at least the following information:

  - guid
  - type
  - status
  - title
  - creationDate
  - creationAuthor

  However, you will notice when creating a topic all parameters are optional. The reason is because, to simplify everything, the topics already comes with defaults for those. The great news is you can modify the defaults when creating topics (not only for the values above, but for other topic properties), so you adapt it to your app! You can do it as follows:
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

  In comments, the author and the creationDate are set automatically based on BCFTopics.config.author and the current date, respectively.

  :::

  ### Editing Topics 🔄
  ---
  Topics are just classes, and that means you can edit any information accessing its properties like any other regular class. However, you should be aware when you need the update to trigger an event or not. By default, when you set the topic property replacing its current value no updates will be triggered, but using the corresponding method does. Let's implement a listener on topics update, and see when it triggers and when it does not:
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
  ### Exporting BCF Files ⏬
  ---
  What is the purpose of having a great BCF system in your app if you can't let users download the files to bring them into other BIM apps? Well, luckily is very easy to export as many BCFs as you want from your topics! Let's create a very simple general function to export the BCFs, like this:
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
  ### Loading BCF Files ⏫
  ---
  The BCFTopics component gives not only the possibility to export, but also to import any valid 2.1/3.0 BCF file you got. Just as before, let's implement a really simple functionality to load BCFs:
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
    bcfTopics.load(new Uint8Array(buffer), world);
  });

  input.click();
};

/* MD
  :::tip

  When a BCF is uploaded, it not only creates the corresponding topics but also all the associated viewpoints. To know more about the viewpoints, check out the corresponding tutorial.

  :::

  ### Wrapping Up ✅
  ---
  To complete this tutorial, let's create a very simple panel to include buttons that triggers the import and export funcionalities, and also setup the app content like this:
  */

const panel = BUI.Component.create<BUI.PanelSection>(() => {
  return BUI.html`
    <bim-panel active label="BCFTopics Tutorial" class="options-menu">
      <bim-panel-section collapsed label="Controls">
        <bim-button @click=${exportBCF} label="Export BCF"></bim-button> 
        <bim-button @click=${loadBCF} label="Load BCF"></bim-button>
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
  :::info

  `@thatopen/ui` comes with cool UI components you can use with topics to create BIM apps with BCF integration in no time. We recommend you taking a look at the corresponding tutorial for topics UI in Tutorials/UserInterface/OBC/TopicsUI 😉

  :::

  Congratulations! You already have the tools you need to create BCF integrations in your next BIM app. Let's continue with more tutorials!
  */
