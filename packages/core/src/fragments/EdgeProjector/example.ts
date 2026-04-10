/* MD
  ## 📐 2D Edge Projections
  ---
  Technical drawings and floor plans require 2D line work derived from 3D model geometry — but extracting clean edges from a BIM model manually is complex and slow. The `EdgeProjector` automates this by computing visible and hidden edge projections from any direction, turning 3D model geometry into the line segments needed for plans, sections, and elevations.

  This tutorial covers projecting all model items from any standard orientation (top, front, left, etc.), projecting only a filtered subset by category, controlling near and far clipping planes to isolate specific floors or sections, adjusting the angle threshold for edge detection, and toggling hidden line visibility. By the end, you'll have a configurable 2D projection tool ready to feed technical drawings with accurate line work from any BIM model.

  ### 🖖 Importing our Libraries
  First things first, let's install all necessary dependencies to make this example work:
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

world.camera.controls.addEventListener("update", () => fragments.core.update());

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

// Remove z fighting
fragments.core.models.materials.list.onItemSet.add(({ value: material }) => {
  if (!("isLodMaterial" in material && material.isLodMaterial)) {
    material.polygonOffset = true;
    material.polygonOffsetUnits = 1;
    material.polygonOffsetFactor = Math.random();
  }
});

/* MD
  ### 📂 Loading Fragments Models
  With the core setup complete, it's time to load a Fragments model into our scene:
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
  ### ✨ Using the Edge Projector Component
  Now let's use the EdgeProjector to generate 2D edge projections from model items. First, get an instance of the component:
*/

const edgeProjector = components.get(OBC.EdgeProjector);

/* MD
  The EdgeProjector wraps the `three-edge-projection` library. You can configure its underlying generator settings:
*/

edgeProjector.generator.angleThreshold = 50;

// Compute model bounding box for plane helpers and slider ranges
const boxer = components.get(OBC.BoundingBoxer);
boxer.list.clear();
boxer.addFromModels();
const modelBox = boxer.get();
boxer.list.clear();
const modelSize = new THREE.Vector3();
modelBox.getSize(modelSize);
const modelCenter = new THREE.Vector3();
modelBox.getCenter(modelCenter);

// Orientation presets
const orientations: Record<
  string,
  { direction: THREE.Vector3; up: THREE.Vector3 }
> = {
  "Top (Plan)": {
    direction: new THREE.Vector3(0, -1, 0),
    up: new THREE.Vector3(0, 0, -1),
  },
  Front: {
    direction: new THREE.Vector3(0, 0, -1),
    up: new THREE.Vector3(0, 1, 0),
  },
  Back: {
    direction: new THREE.Vector3(0, 0, 1),
    up: new THREE.Vector3(0, 1, 0),
  },
  Left: {
    direction: new THREE.Vector3(-1, 0, 0),
    up: new THREE.Vector3(0, 1, 0),
  },
  Right: {
    direction: new THREE.Vector3(1, 0, 0),
    up: new THREE.Vector3(0, 1, 0),
  },
};

// Get the model extent along a direction (returns { min, max } as signed distances from center)
const getExtentAlongDirection = (dir: THREE.Vector3) => {
  const corners = [
    new THREE.Vector3(modelBox.min.x, modelBox.min.y, modelBox.min.z),
    new THREE.Vector3(modelBox.max.x, modelBox.min.y, modelBox.min.z),
    new THREE.Vector3(modelBox.min.x, modelBox.max.y, modelBox.min.z),
    new THREE.Vector3(modelBox.max.x, modelBox.max.y, modelBox.min.z),
    new THREE.Vector3(modelBox.min.x, modelBox.min.y, modelBox.max.z),
    new THREE.Vector3(modelBox.max.x, modelBox.min.y, modelBox.max.z),
    new THREE.Vector3(modelBox.min.x, modelBox.max.y, modelBox.max.z),
    new THREE.Vector3(modelBox.max.x, modelBox.max.y, modelBox.max.z),
  ];
  let minD = Infinity;
  let maxD = -Infinity;
  for (const c of corners) {
    const d = c.dot(dir);
    if (d < minD) minD = d;
    if (d > maxD) maxD = d;
  }
  return { min: minD, max: maxD };
};

// Get the plane size perpendicular to a direction
const getPlaneSizeForDirection = (dir: THREE.Vector3) => {
  const absDir = new THREE.Vector3(
    Math.abs(dir.x),
    Math.abs(dir.y),
    Math.abs(dir.z),
  );
  // The plane size is the extent in the two axes perpendicular to the direction
  if (absDir.y > 0.9) return Math.max(modelSize.x, modelSize.z) * 1.2;
  if (absDir.x > 0.9) return Math.max(modelSize.y, modelSize.z) * 1.2;
  return Math.max(modelSize.x, modelSize.y) * 1.2;
};

// Current orientation state
let currentOrientation = "Top (Plan)";
let currentExtent = getExtentAlongDirection(
  edgeProjector.projectionDirection.clone().negate(),
);

// Initialize near/far to model bounds along current direction
edgeProjector.nearPlane = currentExtent.min;
edgeProjector.farPlane = currentExtent.max;

// Visual clip plane helpers — oriented perpendicular to projection direction
const clipPlaneMat = (color: number) =>
  new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.15,
    side: THREE.DoubleSide,
    depthWrite: false,
  });

let planeSize = getPlaneSizeForDirection(edgeProjector.projectionDirection);

const nearPlaneHelper = new THREE.Mesh(
  new THREE.PlaneGeometry(planeSize, planeSize),
  clipPlaneMat(0x00aaff),
);
nearPlaneHelper.visible = false;
world.scene.three.add(nearPlaneHelper);

const farPlaneHelper = new THREE.Mesh(
  new THREE.PlaneGeometry(planeSize, planeSize),
  clipPlaneMat(0xff4400),
);
farPlaneHelper.visible = false;
world.scene.three.add(farPlaneHelper);

// Orient a plane helper perpendicular to the projection direction at a given depth
const orientPlaneHelper = (
  helper: THREE.Mesh,
  dir: THREE.Vector3,
  depth: number,
) => {
  // The plane's normal should face opposite to the projection direction
  const quat = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 0, 1),
    dir.clone().negate(),
  );
  helper.quaternion.copy(quat);
  // Position along the projection direction at the given depth
  // depth is measured along -projectionDirection (the "look" axis)
  helper.position
    .copy(modelCenter)
    .addScaledVector(dir.clone().negate(), depth - modelCenter.dot(dir.clone().negate()));
  // Simpler: position = dir.negate * depth
  helper.position.copy(dir.clone().negate().multiplyScalar(depth));
  // Project center onto perpendicular plane and add
  const centerOnAxis = dir.clone().negate().multiplyScalar(modelCenter.dot(dir.clone().negate()));
  const centerPerp = modelCenter.clone().sub(centerOnAxis);
  helper.position.add(centerPerp);
};

const updatePlaneHelpers = () => {
  const dir = edgeProjector.projectionDirection;

  orientPlaneHelper(nearPlaneHelper, dir, edgeProjector.nearPlane);
  orientPlaneHelper(farPlaneHelper, dir, edgeProjector.farPlane);

  nearPlaneHelper.visible = edgeProjector.nearPlane > currentExtent.min;
  farPlaneHelper.visible = edgeProjector.farPlane < currentExtent.max;
};

const updateOrientation = (name: string) => {
  const preset = orientations[name];
  if (!preset) return;
  currentOrientation = name;
  edgeProjector.projectionDirection.copy(preset.direction);

  // Recompute extent along new direction
  // The "depth" axis is -projectionDirection
  const depthAxis = preset.direction.clone().negate();
  currentExtent = getExtentAlongDirection(depthAxis);

  edgeProjector.nearPlane = currentExtent.min;
  edgeProjector.farPlane = currentExtent.max;

  // Resize plane helpers
  planeSize = getPlaneSizeForDirection(preset.direction);
  nearPlaneHelper.geometry.dispose();
  nearPlaneHelper.geometry = new THREE.PlaneGeometry(planeSize, planeSize);
  farPlaneHelper.geometry.dispose();
  farPlaneHelper.geometry = new THREE.PlaneGeometry(planeSize, planeSize);

  updatePlaneHelpers();
};

// Initialize helpers
updatePlaneHelpers();

/* MD
  Now let's create a material for displaying the projected edges and a helper function to generate the projection for all loaded model items. We'll also add a translucent white plane below the projection to make the edges easier to see:
*/

const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
const hiddenLineMaterial = new THREE.LineBasicMaterial({
  color: 0x888888,
  transparent: true,
  opacity: 0.3,
});

let visibleLines: THREE.LineSegments | null = null;
let hiddenLines: THREE.LineSegments | null = null;
let backgroundPlane: THREE.Mesh | null = null;

const cleanProjection = () => {
  if (visibleLines) {
    visibleLines.removeFromParent();
    visibleLines.geometry.dispose();
    visibleLines = null;
  }
  if (hiddenLines) {
    hiddenLines.removeFromParent();
    hiddenLines.geometry.dispose();
    hiddenLines = null;
  }
  if (backgroundPlane) {
    backgroundPlane.removeFromParent();
    backgroundPlane.geometry.dispose();
    (backgroundPlane.material as THREE.Material).dispose();
    backgroundPlane = null;
  }
};

// Create a background plane and position the results relative to it
const addResultPlane = () => {
  const dir = edgeProjector.projectionDirection;
  const depthAxis = dir.clone().negate();

  // Position the result plane just above the model along the depth axis
  const resultDepth = currentExtent.max + 3;
  const resultPlaneSize = planeSize * 1.3;

  const planeGeom = new THREE.PlaneGeometry(resultPlaneSize, resultPlaneSize);
  const planeMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.9,
    side: THREE.DoubleSide,
  });
  backgroundPlane = new THREE.Mesh(planeGeom, planeMat);

  // Orient perpendicular to projection direction
  const quat = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 0, 1),
    dir.clone().negate(),
  );
  backgroundPlane.quaternion.copy(quat);

  // Position along depth axis
  const centerPerp = modelCenter
    .clone()
    .sub(depthAxis.clone().multiplyScalar(modelCenter.dot(depthAxis)));
  backgroundPlane.position
    .copy(depthAxis.clone().multiplyScalar(resultDepth))
    .add(centerPerp);

  world.scene.three.add(backgroundPlane);

  return { resultDepth, depthAxis, centerPerp };
};

const generateProjection = async () => {
  cleanProjection();

  // Build a ModelIdMap with all items that have geometry
  const modelIdMap: OBC.ModelIdMap = {};
  for (const [modelId, model] of fragments.list) {
    const idsWithGeometry = await model.getItemsIdsWithGeometry();
    modelIdMap[modelId] = new Set(idsWithGeometry);
  }

  const { visible, hidden } = await edgeProjector.get(modelIdMap, world, {
    onProgress: (message, progress) => {
      if (progress !== undefined) {
        console.log(`${message}: ${(progress * 100).toFixed(1)}%`);
      } else {
        console.log(message);
      }
    },
  });

  const { resultDepth, depthAxis } = addResultPlane();

  // Offset edges slightly in front of the background plane (along depth axis only)
  const edgeOffset = depthAxis.clone().multiplyScalar(resultDepth + 0.01);

  visibleLines = new THREE.LineSegments(visible, lineMaterial);
  visibleLines.position.copy(edgeOffset);
  hiddenLines = new THREE.LineSegments(hidden, hiddenLineMaterial);
  hiddenLines.visible = false;
  hiddenLines.position.copy(edgeOffset);

  world.scene.three.add(visibleLines);
  world.scene.three.add(hiddenLines);
};

/* MD
  We can also project a subset of items. Let's create a function that projects only items matching a category:
*/

const generateCategoryProjection = async (category: string) => {
  cleanProjection();

  const arqId = [...fragments.list.keys()].find((modelId) =>
    /arq/.test(modelId),
  );
  if (!arqId) return;
  const model = fragments.list.get(arqId);
  if (!model) return;

  const items = await model.getItemsOfCategories([new RegExp(`^${category}$`)]);
  const localIds = Object.values(items).flat();
  if (localIds.length === 0) return;

  const modelIdMap: OBC.ModelIdMap = { [arqId]: new Set(localIds) };

  const { visible, hidden } = await edgeProjector.get(modelIdMap, world);

  const { resultDepth, depthAxis, centerPerp } = addResultPlane();

  const edgeOffset = depthAxis
    .clone()
    .multiplyScalar(resultDepth + 0.01)
    .add(centerPerp);

  visibleLines = new THREE.LineSegments(visible, lineMaterial);
  visibleLines.position.copy(edgeOffset);
  hiddenLines = new THREE.LineSegments(hidden, hiddenLineMaterial);
  hiddenLines.visible = false;
  hiddenLines.position.copy(edgeOffset);

  world.scene.three.add(visibleLines);
  world.scene.three.add(hiddenLines);
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
  let categoriesDropdown: BUI.Dropdown | undefined;
  let orientationDropdown: BUI.Dropdown | undefined;
  let nearInput: BUI.NumberInput | undefined;
  let farInput: BUI.NumberInput | undefined;

  const onGenerateAll = async ({ target }: { target: BUI.Button }) => {
    target.loading = true;
    await generateProjection();
    target.loading = false;
  };

  const onGenerateCategory = async ({ target }: { target: BUI.Button }) => {
    if (!categoriesDropdown) return;
    target.loading = true;
    const [category] = categoriesDropdown.value;
    await generateCategoryProjection(category);
    target.loading = false;
  };

  const onCategoriesDropdownCreated = async (e?: Element) => {
    if (!e) return;

    const arqId = [...fragments.list.keys()].find((modelId) =>
      /arq/.test(modelId),
    );
    if (!arqId) return;
    const model = fragments.list.get(arqId);
    if (!model) return;

    const dropdown = e as BUI.Dropdown;
    categoriesDropdown = dropdown;
    dropdown.innerHTML = "";

    const modelCategories = await model.getItemsWithGeometryCategories();
    for (const [index, category] of modelCategories.entries()) {
      const option = BUI.Component.create(
        () =>
          BUI.html`<bim-option ?checked=${index === 0} label=${category}></bim-option>`,
      );
      dropdown.append(option);
    }
  };

  const onOrientationDropdownCreated = (e?: Element) => {
    if (!e) return;
    orientationDropdown = e as BUI.Dropdown;
  };

  const onOrientationChange = () => {
    if (!orientationDropdown) return;
    const [name] = orientationDropdown.value;
    updateOrientation(name);

    // Update near/far slider ranges and values
    if (nearInput) {
      nearInput.min = currentExtent.min;
      nearInput.max = currentExtent.max;
      nearInput.value = currentExtent.min;
    }
    if (farInput) {
      farInput.min = currentExtent.min;
      farInput.max = currentExtent.max;
      farInput.value = currentExtent.max;
    }
  };

  const onClean = () => {
    cleanProjection();
  };

  const onAngleChange = ({ target }: { target: BUI.NumberInput }) => {
    edgeProjector.generator.angleThreshold = target.value;
  };

  const onToggleHidden = ({ target }: { target: BUI.Checkbox }) => {
    if (hiddenLines) hiddenLines.visible = target.checked;
  };

  const onCullerPrecisionChange = ({ target }: { target: BUI.NumberInput }) => {
    edgeProjector.cullerPixelsPerMeter = target.value;
  };

  const onNearPlaneCreated = (e?: Element) => {
    if (!e) return;
    nearInput = e as BUI.NumberInput;
  };

  const onFarPlaneCreated = (e?: Element) => {
    if (!e) return;
    farInput = e as BUI.NumberInput;
  };

  const onNearPlaneChange = ({ target }: { target: BUI.NumberInput }) => {
    edgeProjector.nearPlane = target.value;
    updatePlaneHelpers();
  };

  const onFarPlaneChange = ({ target }: { target: BUI.NumberInput }) => {
    edgeProjector.farPlane = target.value;
    updatePlaneHelpers();
  };

  return BUI.html`
    <bim-panel active label="Edge Projector Tutorial" class="options-menu">
      <bim-panel-section label="Orientation">
        <bim-dropdown ${BUI.ref(onOrientationDropdownCreated)} required @change=${onOrientationChange}>
          <bim-option checked label="Top (Plan)"></bim-option>
          <bim-option label="Front"></bim-option>
          <bim-option label="Back"></bim-option>
          <bim-option label="Left"></bim-option>
          <bim-option label="Right"></bim-option>
        </bim-dropdown>
      </bim-panel-section>
      <bim-panel-section label="Clipping">
        <bim-number-input ${BUI.ref(onNearPlaneCreated)} vertical value=${currentExtent.min} min=${currentExtent.min} max=${currentExtent.max} step=0.1 slider label="Near Plane" @change=${onNearPlaneChange}></bim-number-input>
        <bim-number-input ${BUI.ref(onFarPlaneCreated)} vertical value=${currentExtent.max} min=${currentExtent.min} max=${currentExtent.max} step=0.1 slider label="Far Plane" @change=${onFarPlaneChange}></bim-number-input>
      </bim-panel-section>
      <bim-panel-section label="Settings">
        <bim-number-input vertical value=${edgeProjector.generator.angleThreshold} min=0 max=180 step=1 slider label="Angle Threshold" @change=${onAngleChange}></bim-number-input>
        <bim-number-input vertical value=${edgeProjector.cullerPixelsPerMeter} min=0.01 max=1 step=0.01 slider label="Culler Precision" @change=${onCullerPrecisionChange}></bim-number-input>
        <bim-checkbox label="Show Hidden Lines" @change=${onToggleHidden}></bim-checkbox>
      </bim-panel-section>
      <bim-panel-section label="All Items">
        <bim-button label="Generate Projection" @click=${onGenerateAll}></bim-button>
      </bim-panel-section>
      <bim-panel-section label="By Category">
        <bim-dropdown ${BUI.ref(onCategoriesDropdownCreated)} required></bim-dropdown>
        <bim-button label="Generate Category Projection" @click=${onGenerateCategory}></bim-button>
      </bim-panel-section>
      <bim-panel-section label="General">
        <bim-button label="Clean Projection" @click=${onClean}></bim-button>
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
  That's it! Now you're able to:

  - Generate 2D edge projections from BIM model items.
  - Configure projection orientation for plans, sections, and elevations.
  - Use near/far clipping planes to isolate specific floors or sections.
  - Filter by category and toggle hidden lines.

  Congratulations! Keep going with more tutorials in the documentation.
*/
