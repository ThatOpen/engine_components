/* MD
## 📄 Adding 2D Views
---
  In the construction industry, 2D views such as plans, elevations, and sections are essential for understanding and communicating project details effectively. With That Open Engine, you can create and manage these views seamlessly, leveraging its powerful and efficient handling of BIM data to streamline workflows and enhance visualization. Let's see how is done!
  
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
  ### ✨ Using The Views Component
  With just one single component, you can create any 2D view you need (plan, elevation, or section). Actually, you can create views at any arbitrary position and normal direction you want. But first things first, let's start by getting an instance of the component.
*/

const views = components.get(OBC.Views);

// The range defines how far the view will "see".
// You can specify a default value, but it can be changed
// independently for each view instance after creation.
OBC.Views.defaultRange = 100;

/* MD
  Views created with the component need a world to be displayed. You can specify the world at creation time, but it's more convenient to set the world directly in the Views component, so all new views created will inherit the value.
*/

views.world = world;

/* MD
  ### 🏢 Creating Views From IFC Storeys
  Despite you can create arbitrary views with the component, it's most common use is to represent the floor plans. You can do the calculations by yourself, but the component comes with a handy method that lets create the views from the IfcStoreys. Doing it is very simple, and you can proceed as follows:
*/

// You can specify which models the storeys will be taken from
// in order to create the views.
// In this case, just the architectural model will be used.
await views.createFromIfcStoreys({ modelIds: [/arq/] });

/* MD
  :::note Views From Storeys

  It's worth noting that the built-in method to create views from storeys assumes your Fragments Model comes from an IFC model, as it uses the IfcBuildingStorey attributes to extract the information. If your model uses a different schema than IFC, then you must create the views yourself based on the model attributes.

  :::

  ### 🧭 Creating Elevation Views
  Elevations are another useful type of view. They allow you to visualize the model from specific directions, such as north, south, east, or west. To achieve this, the model's bounding boxes are required. However, you don't need to do anything manually, as there is a built-in method that handles the heavy lifting. You can proceed as follows:
*/

views.createElevations({ combine: true });

/* MD
  :::warning Z-fighting

  Please be aware that the models used in this tutorial have z-fighting issues. This occurs because the same slabs and many walls are present in both models. Because of that, you will see some glitches in the views (even in 3D).

  :::
  
  ### ✂️ Creating Arbitrary Views
  So far, we have seen how to create views very easily for the most common use cases: plans and elevations. However, construction projects often require very specific 2D views to be made, called sections. As they can be located anywhere in the model, it is more convenient to create them manually. They can be created programmatically or through user interaction. In this case, let's use the Raycaster component to create sections when the user double-clicks on a surface.
*/

const casters = components.get(OBC.Raycasters);
const caster = casters.get(world);

window.addEventListener("dblclick", async () => {
  const result = await caster.castRay();
  if (!result) return;
  const { normal, point } = result;
  if (!(normal && point)) return;
  // you should invert the normal direction
  // so the view looks inside
  const invertedNormal = normal.clone().negate();
  const view = views.create(invertedNormal, point.addScaledVector(normal, 1), {
    id: `View - ${views.list.size + 1}`,
    world,
  });
  // You can specify a different range from the default once the view is created.
  view.range = 10;
  // Displaying the helper is optional and is recommended only for debugging purposes.
  view.helpersVisible = true;
});

/* MD
  ### 🧩 Adding some UI (optional but recommended)
  We will use the `@thatopen/ui` library to add some simple and cool UI elements to our app. First, we need to call the `init` method of the `BUI.Manager` class to initialize the library:
*/

BUI.Manager.init();

/* MD
Now we will add some UI to play around with the actions in this tutorial. For more information about the UI library, you can check the specific documentation for it!
*/

type ViewsListTableData = {
  Name: string;
  Actions: string;
};

interface ViewsListState {
  components: OBC.Components;
}

const viewsTemplate: BUI.StatefullComponent<ViewsListState> = (state) => {
  const { components } = state;
  const views = components.get(OBC.Views);

  const onCreated = (e?: Element) => {
    if (!e) return;
    const table = e as BUI.Table<ViewsListTableData>;
    table.data = [...views.list.keys()].map((key) => {
      return {
        data: {
          Name: key,
          Actions: "",
        },
      };
    });
  };

  return BUI.html`<bim-table ${BUI.ref(onCreated)}></bim-table>`;
};

const [viewsTable, updateViewsTable] = BUI.Component.create<
  BUI.Table<ViewsListTableData>,
  ViewsListState
>(viewsTemplate, { components });

viewsTable.headersHidden = true;
viewsTable.noIndentation = true;
viewsTable.columns = ["Name", { name: "Actions", width: "auto" }];

viewsTable.dataTransform = {
  Actions: (_, rowData) => {
    const { Name } = rowData;
    if (!Name) return _;
    const views = components.get(OBC.Views);
    const view = views.list.get(Name);
    if (!view) return _;

    const onOpen = () => {
      views.open(Name);
    };

    const onRemove = () => {
      views.list.delete(Name);
    };

    return BUI.html`
      <bim-button label-hidden icon="solar:cursor-bold" label="Open" @click=${onOpen}></bim-button>
      <bim-button label-hidden icon="material-symbols:delete" label="Remove" @click=${onRemove}></bim-button>
    `;
  },
};

const updateFunction = () => updateViewsTable();
views.list.onItemSet.add(updateFunction);
views.list.onItemDeleted.add(updateFunction);
views.list.onItemUpdated.add(updateFunction);
views.list.onCleared.add(updateFunction);

const panel = BUI.Component.create<BUI.PanelSection>(() => {
  const onCloseView = () => views.close();

  return BUI.html`
    <bim-panel active label="2D Views Tutorial" class="options-menu">
      <bim-panel-section  label="Info">
        <bim-label style="width: 16rem; white-space: normal;" icon="noto-v1:light-bulb">Tip: Go inside the building and double click a wall to create a section</bim-label>
      </bim-panel-section>
      <bim-panel-section  label="Views">
        <bim-button label="Close Active 2D View" @click=${onCloseView}></bim-button>
        ${viewsTable}
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
  That's it! Now you're able to create 2D views such as plans, elevations, and sections programmatically in your BIM app. Congratulations! Keep going with more tutorials in the documentation.
*/
