/* MD
  ## 🧐 Reviewing Your IFC Files
  ---
  The buildingSMART has been creating nice standards for the AEC just like IFC for BIM models and BCF for communication. The two of them are great, but when it comes to review if an IFC file complies with some requirements there is the perfect standard for it: IDS. In That Open Engine is possibile not only to create IDS files, but also to import and export then; in this tutorial you will learn everything you need to know to get started!

  ### 🖖 Importing our Libraries
  First things first, let's install all necessary dependencies to make this example work:
*/

import * as THREE from "three";
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
  ### ✨ Using the IDS Specifications Component
  Leveraging this component in That Open Engine is straightforward. The process revolves around creating specifications based on facets from the IDS schema. Let's begin by obtaining the component instance:
*/

const ids = components.get(OBC.IDSSpecifications);

/* MD
  Next, let's create a new specification. In this example, the specification will require that all doors must have the FireRating property defined.
*/

const spec = ids.create("Sample", ["IFC4"]);
spec.description =
  "All doors must have FireRating specified in Pset_DoorCommon";

/* MD
  IDS schema uses "facets" to define conditions for elements. Facets identify elements (applicability) and specify requirements. Common types include entity, attribute, property, material, classification, and partOf. Learn more in the [IDS schema GitHub repository](https://github.com/buildingSMART/IDS). In this example, we use two facets: one to match IfcDoor items (entity facet for applicability) and another to verify the FireRating property (property facet for requirements).
*/

const entity = new OBC.IDSEntity(components, {
  type: "simple",
  parameter: "IFCDOOR",
});

const property = new OBC.IDSProperty(
  components,
  {
    type: "simple",
    parameter: "Pset_DoorCommon",
  },
  { type: "simple", parameter: "FireRating" },
);

/* MD
  Next, simply provide the facets to the specification:
*/

spec.applicability.add(entity);
spec.requirements.add(property);

/* MD
  ### 👻 Ghost Mode for Easy Inspection (optional)
  For demonstration purposes, let's create functions that make it easier to review the test results:
*/

const originalColors = new Map<
  FRAGS.BIMMaterial,
  { color: number; transparent: boolean; opacity: number }
>();

const setModelTransparent = (components: OBC.Components) => {
  const fragments = components.get(OBC.FragmentsManager);

  const materials = [...fragments.core.models.materials.list.values()];
  for (const material of materials) {
    if (material.userData.customId) continue;
    // save colors
    let color: number | undefined;
    if ("color" in material) {
      color = material.color.getHex();
    } else {
      color = material.lodColor.getHex();
    }

    originalColors.set(material, {
      color,
      transparent: material.transparent,
      opacity: material.opacity,
    });

    // set color
    material.transparent = true;
    material.opacity = 0.05;
    material.needsUpdate = true;
    if ("color" in material) {
      material.color.setColorName("white");
    } else {
      material.lodColor.setColorName("white");
    }
  }
};

const restoreModelMaterials = () => {
  for (const [material, data] of originalColors) {
    const { color, transparent, opacity } = data;
    material.transparent = transparent;
    material.opacity = opacity;
    if ("color" in material) {
      material.color.setHex(color);
    } else {
      material.lodColor.setHex(color);
    }
    material.needsUpdate = true;
  }
  originalColors.clear();
};

const toggleGhost = () => {
  if (originalColors.size) {
    restoreModelMaterials();
  } else {
    setModelTransparent(components);
  }
};

/* MD
  ### ✨ Testing a Specification
  Testing a specification is straightforward. Use the class method to test it and convert the result into a ModelIdMap for easy integration with other engine components. Below is a function that tests the specification and highlights passing and failing elements in green and red, respectively.

  :::warning Colorizing

  The colorizing method below is for demonstration purposes only. For real-world applications, use the Highlighter component. Refer to its tutorial for detailed usage.

  :::
*/

const testSpec = async () => {
  const result = await spec.test([/arq/]);
  const { fail, pass } = ids.getModelIdMap(result);

  const highlightPromises = [fragments.resetHighlight()];

  highlightPromises.push(
    fragments.highlight(
      {
        customId: "green",
        color: new THREE.Color("green"),
        renderedFaces: FRAGS.RenderedFaces.ONE,
        opacity: 1,
        transparent: false,
      },
      pass,
    ),
  );

  highlightPromises.push(
    fragments.highlight(
      {
        customId: "red",
        color: new THREE.Color("red"),
        renderedFaces: FRAGS.RenderedFaces.ONE,
        opacity: 1,
        transparent: false,
      },
      fail,
    ),
  );

  highlightPromises.push(fragments.core.update(true));

  await Promise.all(highlightPromises);
  toggleGhost();
};

/* MD
  ### 🧩 Adding some UI (optional but recommended)
  We will use the `@thatopen/ui` library to add some simple and cool UI elements to our app. First, we need to call the `init` method of the `BUI.Manager` class to initialize the library:
*/

BUI.Manager.init();

/* MD
Now we will add some UI to play around with the actions in this tutorial. For more information about the UI library, you can check the specific documentation for it!
*/

const panel = BUI.Component.create<BUI.PanelSection>(() => {
  const onReviewModel = async ({ target }: { target: BUI.Button }) => {
    target.loading = true;
    await testSpec();
    target.loading = false;
  };

  return BUI.html`
    <bim-panel active label="IDS Specifications Tutorial" class="options-menu">
      <bim-panel-section label="General">
        <bim-button label="Toogle Ghost" @click=${toggleGhost}></bim-button>
      </bim-panel-section>
      <bim-panel-section label="Specification">
        <bim-button label="Review Model" @click=${onReviewModel}></bim-button>
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
  That's it! Now you're able to create IDS specifications, test them, and visualize the results in a 3D scene. Congratulations! Keep exploring more tutorials in the documentation to enhance your skills further.
*/
