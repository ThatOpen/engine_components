/* MD
  ## 📐 Measuring Lengths
  ---

  Accurate length measurement is a cornerstone of Building Information Modeling (BIM) applications. Whether you're designing, analyzing, or collaborating, providing users with intuitive tools to measure distances in 3D space is essential. In this tutorial, you will learn how to integrate a measuring tool in your BIM app; let's go ahead!

  ### 🖖 Importing our Libraries
  First things first, let's install all necessary dependencies to make this example work:
*/

import * as THREE from "three";
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
  ### ✨ Using The Length Measurement Component
  Now, let's go with the tutorial core: measuring lengths. First, let's get an instance of the component:
*/

const measurer = components.get(OBF.LengthMeasurement);
// Provide a world to create dimensions inside
measurer.world = world;
measurer.color = new THREE.Color("#494cb6");
// As a best practice, always set the enabled state after the initial config
measurer.enabled = true;

/* MD 
  You can create dimensions both programatically or by user interaction. The most common way is by user interaction, so let's configure an event listener to create them when the user double clicks on the viewer container:
*/

container.ondblclick = () => measurer.create();

/* MD 
  ### 📄 The Measurements List
  Whenever you create a dimension using the component, it is automatically added to a list that keeps track of all dimensions. This centralized list allows you to perform various operations, such as deleting dimensions, calculating their centers, reporting all lengths, and more. To illustrate this functionality, let's implement some useful methods:
*/

const deleteDimensions = () => {
  measurer.list.clear();
};

const getAllValues = () => {
  const lengths: number[] = [];
  for (const line of measurer.list) {
    lengths.push(line.value);
  }
  return lengths;
};

/* MD 
  Now, when a dimension gets added to the list a couple of things happen. Among them, is the calculation of a bounding box that can be used to know when the cursor is on top of the graphical display of the measurement. That is used internally by the component to allow delete a dimension that is just beneath the mouse. We'll keep it simple and bind this functionality to the keydown event, specifically it will fire when the user presses the `Delete` or `Backspace` key.
*/

window.onkeydown = (event) => {
  if (event.code === "Delete" || event.code === "Backspace") {
    measurer.delete();
  }
};

/* MD 
  ### 🔗 Measurement Events
  You already know anytime you create a dimension the result will get added to the list. When something happens to the list (a dimension has been added or deleted, for example) you can perform side actions by just listening to the corresponding events. Just for fun, let's zoom into the dimension once it has been created:
*/

measurer.list.onItemAdded.add((line) => {
  const center = new THREE.Vector3();
  line.getCenter(center);
  const radius = line.distance() / 3;
  const sphere = new THREE.Sphere(center, radius);
  world.camera.controls.fitToSphere(sphere, true);
});

/* MD
  ### 🧹 Displaying Dimension Components
  ---
  When you create a new length measurement, only the linear dimension is displayed by default. However, additional components, such as rectangular dimensions, are also calculated in the background. These components provide more detailed measurements and can be displayed if needed. Here's how you can enable and work with these additional dimension components:
*/

// Rectangular dimensions represent measurements aligned to the X and Y axes when viewed in 2D.
// These dimensions complete the triangle formed by the linear dimension.
const displayRectangleDimensions = () => {
  for (const dimension of measurer.lines) {
    dimension.displayRectangularDimensions();
  }
};

const invertRectangleDimensions = () => {
  for (const dimension of measurer.lines) {
    dimension.invertRectangularDimensions();
  }
};

// Projection dimensions represent the measurements projected onto the planes defined by the normal direction of each click used to create the initial measurement.
const displayProjectionDimensions = () => {
  for (const dimension of measurer.lines) {
    dimension.displayProjectionDimensions();
  }
};

// You can just clear the complementary dimensions at any time
const removeComplementaryDimensions = () => {
  for (const dimension of measurer.lines) {
    dimension.rectangleDimensions.clear();
    dimension.projectionDimensions.clear();
  }
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
  const onLogValues = () => {
    const data = getAllValues();
    console.log(data);
  };

  return BUI.html`
    <bim-panel active label="Length Measurement Tutorial" class="options-menu">
      <bim-panel-section label="Controls">
          <bim-label>Create dimension: Double click</bim-label>  
          <bim-label>Delete dimension: Delete</bim-label>  
      </bim-panel-section>
      
      <bim-panel-section label="Measurer">
        <bim-checkbox checked label="Enabled" 
          @change="${({ target }: { target: BUI.Checkbox }) => {
            measurer.enabled = target.value;
          }}">  
        </bim-checkbox>       
        <bim-checkbox checked label="Measurements Visible" 
          @change="${({ target }: { target: BUI.Checkbox }) => {
            measurer.visible = target.value;
          }}">  
        </bim-checkbox>  
        
        <bim-color-input 
          label="Color" color=#${measurer.linesMaterial.color.getHexString()}
          @input="${({ target }: { target: BUI.ColorInput }) => {
            measurer.color = new THREE.Color(target.color);
          }}">
        </bim-color-input>
        
        <bim-dropdown 
          label="Measure Mode" required
          @change="${({ target }: { target: BUI.Dropdown }) => {
            const [mode] = target.value;
            measurer.mode = mode;
          }}"> ${measurer.modes.map(
            (mode) =>
              BUI.html`<bim-option label=${mode} value=${mode} ?checked=${mode === measurer.mode}></bim-option>`,
          )}
        </bim-dropdown>

        <bim-dropdown
          label="Units" required
          @change="${({ target }: { target: BUI.Dropdown }) => {
            const [units] = target.value;
            measurer.units = units;
          }}">
          ${measurer.unitsList.map(
            (unit) =>
              BUI.html`<bim-option label=${unit} value=${unit} ?checked=${unit === measurer.units}></bim-option>`,
          )}
        </bim-dropdown>

        <bim-dropdown 
          label="Pricision" required
          @change="${({ target }: { target: BUI.Dropdown }) => {
            const [rounding] = target.value;
            measurer.rounding = rounding;
          }}">
          <bim-option label="0" value=0></bim-option>
          <bim-option label="1" value=1></bim-option>
          <bim-option label="2" value=2 checked></bim-option>
          <bim-option label="3" value=3></bim-option>
          <bim-option label="4" value=4></bim-option>
          <bim-option label="5" value=5></bim-option>
        </bim-dropdown>

        <bim-button label="Display Rectangle Dimensions" @click=${displayRectangleDimensions}></bim-button>

        <bim-button label="Invert Rectangle Dimensions" @click=${invertRectangleDimensions}></bim-button>

        <bim-button label="Display Projection Dimensions" @click=${displayProjectionDimensions}></bim-button>

        <bim-button label="Remove Complementary Dimensions" @click=${removeComplementaryDimensions}></bim-button>

        <bim-button label="Delete all" @click=${() => deleteDimensions()}></bim-button>
        
        <bim-button label="Log Values" @click=${onLogValues}></bim-button>
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
  That's it! Now you're able to measure lengths in your BIM application using the LengthMeasurement component. Congratulations! Keep going with more tutorials in the documentation.
*/
