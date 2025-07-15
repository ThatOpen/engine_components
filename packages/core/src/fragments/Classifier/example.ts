/* MD
  ## 📄 Making Items Groupings
  ---
  Classifications are a powerful way to organize your BIM models. They allow you to group them according to different parameters. For example: getting all the walls, or all the items that belong to a specific floor or room. In this tutorial, you'll learn how to classify your BIM models by different criterias, and how to get the list of items that belong to a specific category. Let's go!

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
  ### ✨ Using The Classifier Component
  The classifier component is straightforward to use. Groups can be static, dynamic, or combined. Static groups consist of a fixed set of elements that you specify, while dynamic groups use queries to define the elements within the group. Combined groups, on the other hand, includes both static and dynamic elements. To begin, let's obtain an instance of the component:
*/

const classifier = components.get(OBC.Classifier);

/* MD
  The most common use case for static groups is to allow users to manually assign selected elements to a group. However, for demonstration purposes, let's add some elements programmatically. Let's start by creating a group:
*/

const classificationName = "Custom Classification";
const groupName = "My Group";
classifier.getGroupData("Custom Classification", "My Group");

/* MD
  To replicate the functionality of adding static elements, let's programmatically include the first two slabs from each model. After retrieving these elements, we can add them to the group.
*/

const slabsModelIdMap: OBC.ModelIdMap = {};
for (const [modelId, model] of fragments.list) {
  const items = await model.getItemsOfCategories([/SLAB/]);
  const localIds = Object.values(items).flat().slice(0, 2);
  slabsModelIdMap[modelId] = new Set(localIds);
}

classifier.addGroupItems(classificationName, groupName, slabsModelIdMap);

/* MD
  :::note Multi-Model Compatibility

  You don't need to worry about making the Classifier component work with multiple models; it handles this automatically (as do all other components) using the modelIdMap.

  :::

  ### 🧩 Adding Dynamic Items
  While adding static items to classifier groups is useful, the component truly shines when you define queries to assign items dynamically. This is an advanced feature because if you load additional models after the dynamic group has been set, it will automatically update with the new items. To do it, let's first configure some simple query using the corresponding component:
*/

const finder = components.get(OBC.ItemsFinder);
const queryName = "First Floor Walls";
finder.create("First Floor Walls", [
  {
    categories: [/WALL/],
    relation: {
      name: "ContainedInStructure",
      query: {
        categories: [/STOREY/],
        attributes: { queries: [{ name: /Name/, value: /01/ }] },
      },
    },
  },
]);

/* MD
  :::note Advanced Queries

  For more information about the query system in the engine, please refer to the Items Finder tutorial in the documentation.

  :::

  Once the query has been set, it is just a matter of adding it to the group:
*/

classifier.setGroupQuery(classificationName, groupName, {
  name: queryName,
});

/* MD
  From this point forward, when we get the items from the classifier group we have created, the result will include the combination of the static items (the first two slabs of each model) plus all the dynamic items (all the walls in the first floor of each model).

  ### 🏷️ Built-in Ways to Classify
  While is very convinient to do custom groupings based on static and dynamic items, the classifier comes with some methods to classify the model in the most common ways: by category, levels and models. Let's do it as follows:
*/

const addDefaultGroupings = async () => {
  await classifier.byCategory();
  await classifier.byIfcBuildingStorey({ classificationName: "Levels" });
};

/* MD
  ### 🧩 Adding some UI (optional but recommended)
  We will use the `@thatopen/ui` library to add some simple and cool UI elements to our app. First, we need to call the `init` method of the `BUI.Manager` class to initialize the library:
*/

BUI.Manager.init();

/* MD
Now we will add some UI to play around with the actions in this tutorial. For more information about the UI library, you can check the specific documentation for it!
*/

type GroupsTableData = {
  Classification: string;
  Name: string;
  Actions: string;
};

interface GroupsTableState {
  components: OBC.Components;
}

const groupsTableTemplate = (_state: GroupsTableState) => {
  const onCreated = (e?: Element) => {
    if (!e) return;
    const table = e as BUI.Table<GroupsTableData>;

    table.loadFunction = async () => {
      const data: BUI.TableGroupData<GroupsTableData>[] = [];

      for (const [classification, groups] of classifier.list) {
        for (const [name] of groups) {
          data.push({
            data: { Name: name, Classification: classification, Actions: "" },
          });
        }
      }

      return data;
    };

    table.loadData(true);
  };

  return BUI.html`
    <bim-table ${BUI.ref(onCreated)}></bim-table>
  `;
};

const [groupsTable, updateTable] = BUI.Component.create<
  BUI.Table<GroupsTableData>,
  GroupsTableState
>(groupsTableTemplate, {
  components,
});

groupsTable.style.maxHeight = "25rem";
groupsTable.hiddenColumns = ["Classification"];
groupsTable.columns = ["Name", { name: "Actions", width: "auto" }];
groupsTable.noIndentation = true;
groupsTable.headersHidden = true;
groupsTable.dataTransform = {
  Actions: (_, rowData) => {
    const { Name, Classification } = rowData;
    if (!(Name && Classification)) return _;
    const classification = classifier.list.get(Classification);
    if (!classification) return _;
    const groupData = classification.get(Name);
    if (!groupData) return _;

    const hider = components.get(OBC.Hider);
    const onClick = async ({ target }: { target: BUI.Button }) => {
      target.loading = true;
      const modelIdMap = await groupData.get();
      await hider.isolate(modelIdMap);
      target.loading = false;
    };

    return BUI.html`<bim-button icon="solar:cursor-bold" @click=${onClick}></bim-button>`;
  },
};

classifier.list.onItemSet.add(() => setTimeout(() => updateTable()));

const panel = BUI.Component.create<BUI.PanelSection>(() => {
  const onResetVisibility = async ({ target }: { target: BUI.Button }) => {
    target.loading = true;
    const hider = components.get(OBC.Hider);
    await hider.set(true);
    target.loading = false;
  };

  const onAddDefaults = async () => {
    await addDefaultGroupings();
  };

  return BUI.html`
    <bim-panel active label="Classifier Tutorial" class="options-menu">
      <bim-panel-section style="min-width: 14rem" label="General">
        <bim-button label="Reset Visibility" @click=${onResetVisibility}></bim-button>
      </bim-panel-section>
      <bim-panel-section label="Groupings">
        <bim-button label="Add Defaults" @click=${onAddDefaults}></bim-button>
        ${groupsTable}
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
  That's it! Now you're able to classify your BIM models using static and dynamic groups. Congratulations! Keep going with more tutorials in the documentation.
*/
