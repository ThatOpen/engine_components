/* MD
  ## ✂️ Fancy Clippings
  ---
  Clipping planes are very common in BIM applications. They are used for floor plans, sections, looking inside a 3D model, etc. But simple clipping planes are not enough: they don't have fills or outlines, which are common in BIM software. That Open Engine can do them, and in this tutorial you'll learn how!

  :::tip Fills and outlines?

  Traditionally, architects created plans with a certain style. For instance, thick lines with solid fill for cutted walls and structure, thin lines for cutted doors and windows, etc. These same conventions are still common in BIM software.

  :::

  ### 🖖 Importing our Libraries
  First things first, let's install all necessary dependencies to make this example work:
*/

import * as THREE from "three";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import Stats from "stats.js";
import * as OBC from "@thatopen/components";
import * as BUI from "@thatopen/ui";
// You have to import * as OBF from "@thatopen/components-front"
import * as OBF from "../..";

/* MD
  ### 🌎 Setting up a Simple Scene
  To get started, let's set up a basic ThreeJS scene. This will serve as the foundation for our application and allow us to visualize the 3D models effectively:
*/

const components = new OBC.Components();

const worlds = components.get(OBC.Worlds);
const world = worlds.create<
  OBC.SimpleScene,
  OBC.OrthoPerspectiveCamera,
  OBF.PostproductionRenderer
>();

world.scene = new OBC.SimpleScene(components);
world.scene.setup();
world.scene.three.background = null;

const container = document.getElementById("container")!;
world.renderer = new OBF.PostproductionRenderer(components, container);
world.camera = new OBC.OrthoPerspectiveCamera(components);
await world.camera.controls.setLookAt(68, 23, -8.5, 21.5, -5.5, 23);

components.init();

/* MD
  ### 🛠️ Setting Up Fragments
  Now, let's configure the FragmentsManager. This will allow us to load models effortlessly and start manipulating them with ease:
*/

const workerUrl =
  "/node_modules/@thatopen-platform/fragments-beta/dist/Worker/worker.mjs";
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
  world.renderer?.postproduction.updateCamera();
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

const fragPaths = ["/resources/frags/school_arq.frag"];
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
  ### ✨ Using The Clip Styler Component
  The primary purpose of the Clip Styler component is straightforward: it generates lines and fills based on model sections (defined by ThreeJS planes) and applies colors (and thickness for lines) to them. To get started, simply obtain the component instance and define the styles to be applied.
*/

const clipStyler = components.get(OBF.ClipStyler);
clipStyler.world = world;

/* MD
  Once the component is configured, you can define styles that will be applied to sections later. Styles consist of a line material and a fill material. Let's create the first style as follows:
*/

clipStyler.styles.set("Blue", {
  linesMaterial: new LineMaterial({ color: "black", linewidth: 2 }),
  fillsMaterial: new THREE.MeshBasicMaterial({
    color: "lightblue",
    side: 2,
  }),
});

/* MD
  :::info ThreeJS LineMaterial

  As you may have noticed, the `LineMaterial` uses a special type of class from ThreeJS. This class allows you to define thickness for lines, which is very convenient when styling sections.

  :::

  Cool! The same as before, we can create other styles:
*/

clipStyler.styles.set("Red", {
  linesMaterial: new LineMaterial({ color: "black", linewidth: 3 }),
  fillsMaterial: new THREE.MeshBasicMaterial({
    color: "salmon",
    side: 2,
  }),
});

clipStyler.styles.set("Green", {
  linesMaterial: new LineMaterial({ color: "black", linewidth: 2 }),
  fillsMaterial: new THREE.MeshBasicMaterial({
    color: "lightgreen",
    side: 2,
  }),
});

clipStyler.styles.set("Black", {
  linesMaterial: new LineMaterial({ color: "black", linewidth: 2 }),
  fillsMaterial: new THREE.MeshBasicMaterial({
    color: "black",
    side: 2,
  }),
});

// You don't need to define both line and fill materials.
// In this case, a style has been created with only the fill material.
// This means that when this style is applied to a section,
// only the fill will be visible, and no lines will be generated.
clipStyler.styles.set("BlackFill", {
  fillsMaterial: new THREE.MeshBasicMaterial({
    color: "black",
    side: 2,
  }),
});

/* MD
  Now that we have defined all the styles we need, the next step is to specify which elements will have these styles applied.

  ### 🖌️ Defining Styled Items
  Styles by themselves do nothing unless you specify which elements they should be applied to. The Clip Styler component expects groups from the Classifier, so let's create some dynamic groupings to use during styling:
*/

const finder = components.get(OBC.ItemsFinder);
finder.create("Walls", [{ categories: [/WALL/] }]);
finder.create("Slabs", [{ categories: [/SLAB/] }]);
finder.create("Columns", [{ categories: [/COLUMN/] }]);
finder.create("Doors", [{ categories: [/DOOR/] }]);
finder.create("Curtains", [{ categories: [/PLATE/, /MEMBER/] }]);
finder.create("Windows", [{ categories: [/WINDOW/] }]);

// Now, define the dynamic groupings using the finder queries.
const classifier = components.get(OBC.Classifier);
const classificationName = "ClipperGroups";
classifier.setGroupQuery(classificationName, "Walls", { name: "Walls" });
classifier.setGroupQuery(classificationName, "Slabs", { name: "Slabs" });
classifier.setGroupQuery(classificationName, "Columns", { name: "Columns" });
classifier.setGroupQuery(classificationName, "Doors", { name: "Doors" });
classifier.setGroupQuery(classificationName, "Curtains", { name: "Curtains" });
classifier.setGroupQuery(classificationName, "Windows", { name: "Windows" });

/* MD
  :::info Dynamic Groupings?

  If you found the previous code snippet about the ItemsFinder and the Classifier confusing, please refer to the Classifier tutorial for more details on its implementation.

  :::

  ### 🚀 Applying Styles to Items
  Now that everything is set up, we can start specifying which styles the ClipStyler component should apply to which elements. The only thing left is to tell the ClipStyler which ThreeJS plane to use for creating the model section. You can use arbitrary ThreeJS planes or any plane created by other components in the engine. For convenience, the ClipStyler provides methods to utilize and link planes created by other components! Let's begin by applying a fill to the planes created by the clipper:
*/

const casters = components.get(OBC.Raycasters);
casters.get(world);

// Get an instance of the Clipper component
// and set it enabled by default
// so clippings can be made
const clipper = components.get(OBC.Clipper);
clipper.enabled = true;

// Set the creation/deletion events
container.ondblclick = () => {
  if (clipper.enabled) clipper.create(world);
};

window.onkeydown = (event) => {
  if (event.code === "Delete" || event.code === "Backspace") {
    if (clipper.enabled) clipper.delete(world);
  }
};

/* MD
  Now that the clipper is configured, we want to ensure that whenever a new clipping plane is created, the clipped items are styled using specific styles defined in the ClipStyler. To achieve this, we can proceed as follows:
*/

clipper.list.onItemSet.add(({ key }) => {
  // As you see, there is an special method to link
  // clipping planes with the ClipStyler.
  clipStyler.createFromClipping(key, {
    items: { All: { style: "BlackFill" } },
  });
});

/* MD
  Then, for demo purposes, let's create a default clipping plane:
*/

clipper.createFromNormalAndCoplanarPoint(
  world,
  new THREE.Vector3(0, -1, 0),
  new THREE.Vector3(0, 3, 0),
);

/* MD
  Styling with clipping planes is great, but the implementation truly shines when applied to 2D views, as they also utilize ThreeJS planes to achieve the desired effect. Let's create a simple view:
*/

const views = components.get(OBC.Views);

const sectionView = views.createFromPlane(
  new THREE.Plane(new THREE.Vector3(-1, 0, 0), 35),
  { id: "Section", world },
);

sectionView.range = 5;
sectionView.helpersVisible = true;

/* MD
  :::info Views

  If the previous code snippet about views was unclear, please refer to the Views tutorial for more detailed explanations.

  :::

  Once the view is ready, the ClipStyler component provides a built-in method to link the view and apply styles. This process is straightforward:
*/

clipStyler.createFromView(sectionView, {
  // Use the dynamic groups to set the elements style in the plane ----
  items: {
    ArchElements: {
      style: "Blue",
      data: { [classificationName]: ["Walls", "Slabs", "Curtains", "Windows"] },
    },
  },
});

/* MD
  As you can see, we have applied the Blue style to the specified elements from the classification we defined earlier. Now, let's proceed with another view example:
*/

const [planView] = await views.createFromIfcStoreys({
  storeyNames: [/03/],
  world,
  offset: 1,
});

planView.helpersVisible = true;

const planEdges = clipStyler.createFromView(planView, {
  // Use the dynamic groups to set the elements style in the plane ----
  items: {
    Walls: {
      style: "Blue",
      data: { [classificationName]: ["Walls"] },
    },
    Columns: {
      style: "Red",
      data: { [classificationName]: ["Columns"] },
    },
    Doors: {
      style: "Green",
      data: { [classificationName]: ["Doors"] },
    },
  },
});

// You can also define the styled items in the view after the creation
// It will update everything automatically
planEdges.items.set("Curtains & Windows", {
  style: "Black",
  data: { [classificationName]: ["Curtains", "Windows"] },
});

// This is just for demo purposes in the tutorial
const manageVisibility = () => {
  for (const [, clippingPlane] of clipper.list) {
    clippingPlane.enabled = !views.hasOpenViews;
    clippingPlane.visible = !views.hasOpenViews;
  }

  for (const [, view] of views.list) {
    view.helpersVisible = !views.hasOpenViews;
  }
};

planView.onStateChanged.add(manageVisibility);
sectionView.onStateChanged.add(manageVisibility);

/* MD
  ### 🧩 Adding some UI (optional but recommended)
  We will use the `@thatopen/ui` library to add some simple and cool UI elements to our app. First, we need to call the `init` method of the `BUI.Manager` class to initialize the library:
*/

BUI.Manager.init();

/* MD
Now we will add some UI to play around with the actions in this tutorial. For more information about the UI library, you can check the specific documentation for it!
*/

type ViewsTableData = {
  Name: string;
  Actions: string;
};

interface ViewsListState {
  components: OBC.Components;
}

const viewsListTemplate: BUI.StatefullComponent<ViewsListState> = (state) => {
  const { components } = state;
  const views = components.get(OBC.Views);

  const onCreated = (e?: Element) => {
    if (!e) return;
    const table = e as BUI.Table<ViewsTableData>;
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

const [viewsList] = BUI.Component.create<
  BUI.Table<ViewsTableData>,
  ViewsListState
>(viewsListTemplate, { components });

viewsList.headersHidden = true;
viewsList.noIndentation = true;
viewsList.columns = ["Name", { name: "Actions", width: "auto" }];

viewsList.dataTransform = {
  Actions: (_, rowData) => {
    const { Name } = rowData;
    if (!Name) return _;
    const views = components.get(OBC.Views);
    const view = views.list.get(Name);
    if (!view) return _;

    const onOpen = () => {
      views.open(Name);
    };

    const onClose = () => {
      views.close(Name);
    };

    return BUI.html`
      <bim-button label-hidden icon="solar:cursor-bold" label="Open" @click=${onOpen}></bim-button>
      <bim-button label-hidden icon="material-symbols:close" label="Close" @click=${onClose}></bim-button>
    `;
  },
};

type StylesTableData = {
  Name: string;
  LineWidth: number;
  LineColor: string;
  FillColor: string;
};

const stylesTable = BUI.Component.create(() => {
  const onCreated = (_table?: Element) => {
    if (!(_table instanceof BUI.Table)) return;
    const table = _table as BUI.Table<StylesTableData>;
    table.dataTransform = {
      LineWidth: (value, rowData) => {
        const name = rowData.Name!;
        const style = clipStyler.styles.get(name);
        if (!style) return value;
        const { linesMaterial } = style;
        if (!linesMaterial) return value;
        const onChange = ({ target }: { target: BUI.NumberInput }) => {
          linesMaterial.linewidth = target.value;
        };
        return BUI.html`
          <bim-number-input .value=${value} min=0.5 max=10 slider step=0.05 @change=${onChange}></bim-number-input>
        `;
      },
      LineColor: (value, rowData) => {
        const name = rowData.Name!;
        const style = clipStyler.styles.get(name);
        if (!style) return value;
        const { linesMaterial } = style;
        if (!linesMaterial) return value;
        const onChange = ({ target }: { target: BUI.ColorInput }) => {
          linesMaterial.color = new THREE.Color(target.color);
        };
        return BUI.html`
          <bim-color-input .color=${value} @input=${onChange}></bim-color-input>
        `;
      },
      FillColor: (value, rowData) => {
        const name = rowData.Name!;
        const style = clipStyler.styles.get(name);
        if (!style) return value;
        const { fillsMaterial } = style;
        if (!fillsMaterial) return value;
        const onChange = ({ target }: { target: BUI.ColorInput }) => {
          if (
            !(
              "color" in fillsMaterial &&
              fillsMaterial.color instanceof THREE.Color
            )
          ) {
            return;
          }
          fillsMaterial.color = new THREE.Color(target.color);
        };
        return BUI.html`
          <bim-color-input .color=${value} @input=${onChange}></bim-color-input>
        `;
      },
    };

    table.data = Array.from(clipStyler.styles.entries()).map(
      ([name, style]) => {
        const linesMaterial = style.linesMaterial as LineMaterial | undefined;
        const fillsMaterial = style.fillsMaterial as
          | THREE.MeshBasicMaterial
          | undefined;

        const row: BUI.TableGroupData<StylesTableData> = {
          data: { Name: name },
        };

        if (linesMaterial) {
          row.data.LineWidth = linesMaterial.linewidth;
          row.data.LineColor = `#${linesMaterial.color.getHexString()}`;
        }

        if (fillsMaterial) {
          row.data.FillColor = `#${fillsMaterial.color.getHexString()}`;
        }

        return row;
      },
    );
  };

  return BUI.html`<bim-table no-indentation ${BUI.ref(onCreated)}></bim-table>`;
});

const panel = BUI.Component.create<BUI.PanelSection>(() => {
  return BUI.html`
    <bim-panel active label="Clip Styler Tutorial" class="options-menu">
      <bim-panel-section label="Styles">
        <bim-label style="white-space: normal;">Here you can manage the clipping styles of your app. Try to change some of these while a view is open to see the effect.</bim-label>
        ${stylesTable}
      </bim-panel-section>
      <bim-panel-section label="Views">
        <bim-label style="white-space: normal;">These are the views created in the project. They are linked to the clipping styles.</bim-label>
        ${viewsList}
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
  That's it! Now you're able to create and style clipping planes, views, and dynamically update styles in your BIM application using That Open Engine. Congratulations! Keep exploring more tutorials in the documentation to enhance your skills further.
*/
