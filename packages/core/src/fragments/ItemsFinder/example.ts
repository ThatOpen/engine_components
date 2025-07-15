/* MD
  ## 📄 Finding the Items you Need
  ---
  In the world of 3D modeling, finding the right information quickly is crucial for efficiency and productivity. The Items Finder component empowers you to locate specific elements in your models with ease, using powerful queries based on categories, attributes, and relationships. Let's dive in and see how it works!

  ### 🖖 Importing our Libraries
  First things first, let's install all necessary dependencies to make this example work:
*/

import * as FRAGS from "@thatopen/fragments";
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
  ### ✨ Using The Items Finder Component
  Using the Items Finder component is straightforward. The only thing you need to focus on is understanding the types of attributes and relationships your model may have, as well as the values you expect from them. The rest is handled automatically by the component itself. Let's begin by obtaining the component instance:
*/

const finder = components.get(OBC.ItemsFinder);

/* MD
  When using the finder, you create queries to locate the items you are searching for. Essentially, you can search based on three criteria: categories, attributes, and relationships. While this may seem limited, it is far more powerful than you might think. Let's create a few queries using one or more of these criteria. We'll start by searching for categories:
*/

finder.create("Walls & Slabs", [{ categories: [/WALL/, /SLAB/] }]);

/* MD
  :::note Storing Queries

  When you create queries, as demonstrated earlier, the query data is automatically stored within the Items Finder component under its `list` property.

  :::

  When searching for categories as shown earlier, the result will include all items matching any of the specified categories. This is because a single item cannot belong to more than one category. To make things more interesting, let's search for all items that match specific criteria in their attributes:
*/

finder.create("Masonry Walls", [
  {
    categories: [/WALL/],
    attributes: { queries: [{ name: /Name/, value: /Masonry/ }] },
  },
]);

/* MD
  As demonstrated, we are now searching for walls that include the word "Masonry" in their "Name" attribute. Note that both the name and value of the attribute are defined using regular expressions. This approach offers greater flexibility in specifying search criteria.
  
  :::tip Additional Attribute Types

  For improved flexibility, attribute values can also be numbers, booleans, or arrays of regular expressions.

  :::

  To keep making things even more interesting, let's create a query that is able to find the items that relates with another under some conditions:
*/

// First, define a query to find building storeys
// where the Name attribute contains the word "Entry".
const entryLevel: FRAGS.ItemsQueryParams = {
  categories: [/BUILDINGSTOREY/],
  attributes: { queries: [{ name: /Name/, value: /Entry/ }] },
};

// Next, we retrieve all columns that are related
// to any item matching the entryLevel query under the
// relation named ContainedInStructure.
finder.create("First Level Columns", [
  {
    categories: [/COLUMN/],
    relation: { name: "ContainedInStructure", query: entryLevel },
  },
]);

/* MD
  As demonstrated, this approach can become incredibly powerful with minimal code, as long as you understand the expected attribute types and the relationships within your model.

  :::note IFC Schema

  If your Fragment Models implement the IFC schema, refer to the buildingSMART documentation to learn more about the available attributes and relationship types.

  :::

  Lastly, let's create a helper function to return the `modelIdMap` result of the query:
*/

const getResult = async (name: string) => {
  const finderQuery = finder.list.get(name);
  if (!finderQuery) return {};
  const result = await finderQuery.test();
  return result;
};

/* MD
  ### 🧩 Adding some UI (optional but recommended)
  We will use the `@thatopen/ui` library to add some simple and cool UI elements to our app. First, we need to call the `init` method of the `BUI.Manager` class to initialize the library:
*/

BUI.Manager.init();

/* MD
Now we will add some UI to play around with the actions in this tutorial. For more information about the UI library, you can check the specific documentation for it!
*/

type QueriesListTableData = {
  Name: string;
  Actions: string;
};

const queriesListTemplate = () => {
  const onCreated = (e?: Element) => {
    if (!e) return;
    const table = e as BUI.Table<QueriesListTableData>;

    table.loadFunction = async () => {
      const data: BUI.TableGroupData<QueriesListTableData>[] = [];

      for (const [name] of finder.list) {
        data.push({
          data: { Name: name, Actions: "" },
        });
      }

      return data;
    };

    table.loadData(true);
  };

  return BUI.html`
    <bim-table ${BUI.ref(onCreated)}></bim-table>
  `;
};

const queriesList =
  BUI.Component.create<BUI.Table<QueriesListTableData>>(queriesListTemplate);

queriesList.style.maxHeight = "25rem";
queriesList.columns = ["Name", { name: "Actions", width: "auto" }];
queriesList.noIndentation = true;
queriesList.headersHidden = true;
queriesList.dataTransform = {
  Actions: (_, rowData) => {
    const { Name } = rowData;
    if (!Name) return _;

    const hider = components.get(OBC.Hider);
    const onClick = async ({ target }: { target: BUI.Button }) => {
      target.loading = true;
      const modelIdMap = await getResult(Name);
      await hider.isolate(modelIdMap);
      target.loading = false;
    };

    return BUI.html`<bim-button icon="solar:cursor-bold" @click=${onClick}></bim-button>`;
  },
};

const panel = BUI.Component.create<BUI.PanelSection>(() => {
  const onResetVisibility = async ({ target }: { target: BUI.Button }) => {
    target.loading = true;
    const hider = components.get(OBC.Hider);
    await hider.set(true);
    target.loading = false;
  };

  return BUI.html`
    <bim-panel active label="Items Finder Tutorial" class="options-menu">
      <bim-panel-section style="min-width: 14rem" label="General">
        <bim-button label="Reset Visibility" @click=${onResetVisibility}></bim-button>
      </bim-panel-section>
      <bim-panel-section label="Queries">
        ${queriesList}
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
  That's it! Now you're able to use the Items Finder component to create powerful queries for your 3D models. Congratulations! Keep exploring more tutorials in the documentation to enhance your skills further.
*/
