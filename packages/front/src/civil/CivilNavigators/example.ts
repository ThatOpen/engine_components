/* MD
### 🛣️ Navigating 3D infrastructures
---

Infra models are awesome, but they are usually very, very long and thin. This makes it a bit hard to navigate through them. Luckily for you, the alignment data that comes in IFC models is processed by our libraries and generated in 3D, so you can use it for navigation!

:::tip 3D alignment?

The alignment data in IFC usually comes in 2D (floor plan and elevation). We use that data to regenerate the 3D curve from those 2D representations. You'll see the result in just a moment!

:::

In this tutorial, we will import:

- `three` to create some 3D items.
- `@thatopen/components` to set up the barebone of our app.
- `@thatopen/components-front` to use some frontend-oriented components.
- `Stats.js` (optional) to measure the performance of our app.
*/

import * as THREE from "three";
import * as OBC from "@thatopen/components";
import * as CUI from "@thatopen/ui-obc";
import Stats from "stats.js";
import * as BUI from "@thatopen/ui";
// You have to import * as OBF from "@thatopen/components-front"
import * as OBF from "../..";

/* MD
  ### 🌎 Setting up a simple scene
  ---

  We will start by creating a simple scene with a camera and a renderer. If you don't know how to set up a scene, you can check the Worlds tutorial.
*/

const container = document.getElementById("container")!;

const components = new OBC.Components();

const worlds = components.get(OBC.Worlds);

const world = worlds.create<
  OBC.SimpleScene,
  OBC.SimpleCamera,
  OBF.RendererWith2D
>();

world.scene = new OBC.SimpleScene(components);
world.renderer = new OBF.RendererWith2D(components, container);
world.camera = new OBC.SimpleCamera(components);

components.init();

BUI.Manager.init();
CUI.Manager.init();

world.scene.setup();

world.camera.controls.setLookAt(5, 5, 5, 0, 0, 0);

container.appendChild(world.renderer.three2D.domElement);

const grids = components.get(OBC.Grids);
grids.create(world);

world.camera.three.far = 10000;
world.camera.three.updateProjectionMatrix();

/* MD

  We'll make the background of the scene transparent so that it looks good in our docs page, but you don't have to do that in your app!

*/

world.scene.three.background = null;

/* MD
  ### 🧳 Loading a BIM model
  ---

 We'll start by adding a BIM model to our scene. That model is already converted to fragments, so it will load much faster than if we loaded the IFC file.

  :::tip Fragments?

    If you are not familiar with fragments, check out the IfcLoader tutorial!

  :::
*/

const fragments = components.get(OBC.FragmentsManager);
fragments.init(
  "https://thatopen.github.io/engine_fragment/resources/worker.mjs",
);

const url = "https://thatopen.github.io/engine_components/resources/test/small_road.frag";
const file = await fetch(url);
const data = await file.arrayBuffer();
const buffer = new Uint8Array(data);
const model = await fragments.core.load(buffer, {
  modelId: url,
  camera: world.camera.three,
});
world.scene.three.add(model.object);

await fragments.core.update(true);

world.camera.controls.addEventListener("control", () =>
  fragments.core.update(),
);

model.getClippingPlanesEvent = () => {
  return Array.from(world.renderer!.three.clippingPlanes) || [];
};

const alignments = await model.getAlignments();
world.scene.three.add(alignments);

/*
  ### 🚕 Setting up Civil 3D Navigator
  ---

  Now, we need to create an instance of the Civil 3D Navigator component. This will enable us to navigate through our 3D environment and interact with the model.
*/

// Absolute alignment

const navigators = components.get(OBF.CivilNavigators);

const navigator = navigators.create("absolute");
navigator.world = world;

// For now we don't read the initial station of alignments. You can set it like this:
for (const alignment of alignments.children) {
  alignment.userData.initialStation = 1925;
}

navigator.alignments.push(alignments);
navigator.updateAlignments();
console.log(alignments);

const sphere = new THREE.Sphere(undefined, 20);
navigator.onMarkerChange.add(({ point }) => {
  sphere.center.copy(point);
  world.camera.controls.fitToSphere(sphere, true);
});

const crossSectionNavigator = components.get(OBF.CivilCrossSectionNavigator);
crossSectionNavigator.world = world;

// Horizontal alignment

const horizontalMenu = document.getElementById("horizontal-menu")!;

const horizontalWorld = document.createElement("bim-world-2d") as CUI.World2D;
horizontalWorld.components = components;
if (!horizontalWorld.world) {
  throw new Error("World not found!");
}

horizontalMenu.appendChild(horizontalWorld);

const horizontalNavigator = navigators.create("horizontal");
horizontalNavigator.world = horizontalWorld.world;
const horizontalAlignments = await model.getHorizontalAlignments();
for (const alignment of horizontalAlignments.children) {
  alignment.rotation.x = Math.PI / 2;
  alignment.rotation.y = Math.PI / 2;
}
horizontalNavigator.alignments.push(horizontalAlignments);
horizontalNavigator.updateAlignments();
const horizontalScene = horizontalWorld.world.scene.three;
horizontalScene.background = null;
horizontalScene.add(horizontalAlignments);

for (const alignment of horizontalAlignments.children) {
  alignment.userData.initialStation = 1925;
}

navigator.onMarkerChange.add((civilPoint) => {
  console.log(civilPoint);
  const percentage = OBF.CivilUtils.curvePointToAlignmentPercentage(
    civilPoint.alignment,
    civilPoint.point,
    civilPoint.curve,
  );
  if (percentage === null) {
    return;
  }
  const point = OBF.CivilUtils.alignmentPercentageToPoint(
    horizontalAlignments.children[0] as THREE.Group,
    percentage,
  );
  if (point === null) {
    return;
  }
  horizontalNavigator.setMarkerAtPoint(point, "select");
  horizontalNavigator.setCursorValue(navigator.getCursorValue(), "select");
});

const casters = components.get(OBC.Raycasters);
const horizontalCaster = casters.get(horizontalWorld.world);
horizontalCaster.three.params.Line.threshold = 10;

await horizontalWorld.world.camera.controls.setLookAt(
  0,
  0,
  10000,
  0,
  0,
  0,
  false,
);

// navigator.draw(model);

/*
  ### ⚾ Navigating to the selected point
  ---

  There are many ways to navigate to the selected point in an alignment. We will make it simple: subscribing to the highlight event, we can get some information about the highlight, such as the point that was clicked in the alignment. We will use that point to set the position of an invisible sphere that will use to move the camera with a nice animation:
*/

// const sphere = new THREE.Sphere(undefined, 20);

// navigator.onHighlight.add(({ point }) => {
//   sphere.center.copy(point);
//   world.camera.controls.fitToSphere(sphere, true);
// });

/* MD
  ### ⏱️ Measuring the performance (optional)
  ---

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
  ### 🧩 Adding some UI
  ---

  We will use the `@thatopen/ui` library to add some simple and cool UI elements to our app. Now we will create a new panel with some inputs to change the background color of the scene and the intensity of the directional and ambient lights. For more information about the UI library, you can check the specific documentation for it!

*/

let selectedAlignment = 0;
let updateTimeout: any = null;
let alignmentCounter = 0;
let highlightSelected = true;
let showStations = false;

function updateHighlight() {
  const selected = alignments.children[selectedAlignment] as THREE.Group;
  const horizontalSelected = horizontalAlignments.children[
    selectedAlignment
  ] as THREE.Group;
  if (highlightSelected) {
    navigator.highlight(selected);
    horizontalNavigator.highlight(horizontalSelected);
  } else {
    navigator.clearHighlight();
    horizontalNavigator.clearHighlight();
  }
}
updateHighlight();

let previousSelection = -1;
function updateStations() {
  if (previousSelection !== selectedAlignment) {
    navigator.clearStations();
  }
  previousSelection = selectedAlignment;
  const selected = alignments.children[selectedAlignment] as THREE.Group;
  if (showStations) {
    navigator.createStations(selected);
    navigator.updateStations();
  } else {
    navigator.clearStations();
  }
}

function moveToPercentage(percentage: number) {
  const absolutePoint = OBF.CivilUtils.alignmentPercentageToPoint(
    alignments.children[selectedAlignment] as THREE.Group,
    percentage,
  );
  if (absolutePoint) {
    sphere.center.copy(absolutePoint.point);
    world.camera.controls.fitToSphere(sphere, true);
    navigator.setMarkerAtPoint(absolutePoint, "select");
    crossSectionNavigator.set(absolutePoint.point, absolutePoint.normal);
    if (updateTimeout) {
      clearTimeout(updateTimeout);
    }
    crossSectionNavigator.sectionVisible = false;
    updateTimeout = setTimeout(() => {
      if (crossSectionNavigator.plane.enabled) {
        crossSectionNavigator.update();
      }
    }, 1000);
    // Update kps only if the cross section is enabled
    if (showStations && crossSectionNavigator.plane.enabled) {
      updateStations();
    }
  }

  const horizontalPoint = OBF.CivilUtils.alignmentPercentageToPoint(
    horizontalAlignments.children[selectedAlignment] as THREE.Group,
    percentage,
  );
  if (horizontalPoint) {
    horizontalNavigator.setMarkerAtPoint(horizontalPoint, "select");
    horizontalNavigator.setCursorValue(navigator.getCursorValue(), "select");
  }
}

const debounce = 1000;
let lastUpdate = 0;
world.camera.controls.addEventListener("update", () => {
  const now = Date.now();
  if (now - lastUpdate > debounce) {
    updateStations();
    lastUpdate = now;
  }
});

world.camera.controls.addEventListener("update", () => {
  const now = Date.now();
  if (now - lastUpdate > debounce) {
    updateStations();
    lastUpdate = now;
  }
});

const panel = BUI.Component.create<BUI.PanelSection>(() => {
  return BUI.html`
  <bim-panel active label="Civil 3D Navigator Tutorial" class="options-menu">

      <bim-panel-section label="Alignments">

         <bim-dropdown required label="Selected alignment"
             @change="${({ target }: { target: BUI.Dropdown }) => {
               selectedAlignment = target.value[0];
               if (highlightSelected) {
                 updateHighlight();
               }
               if (showStations) {
                 updateStations();
               }
             }}">

          ${alignments.children.map(() => {
            return BUI.html`
              <bim-option ?checked=${alignmentCounter === 0} label="${alignmentCounter++}"></bim-option>
            `;
          })}
        </bim-dropdown>
        
        <bim-number-input
          slider step="1" label="Highlight width" value="${navigator.highlightMaterial.linewidth}" min="1" max="10"
          @change="${({ target }: { target: BUI.NumberInput }) => {
            navigators.highlightMaterial.linewidth = target.value;
          }}">
        </bim-number-input>

        <bim-color-input 
          label="Highlight Color" color="#${navigators.highlightMaterial.color.getHexString()}" 
          @input="${({ target }: { target: BUI.ColorInput }) => {
            navigators.highlightMaterial.color = new THREE.Color(target.color);
          }}">
        </bim-color-input>

        
        <bim-color-input 
          label="Station Label Color" color="#${navigators.stationLabelColor.getHexString()}" 
          @input="${({ target }: { target: BUI.ColorInput }) => {
            navigators.stationLabelColor = new THREE.Color(target.color);
          }}">
        </bim-color-input>

        
        <bim-color-input 
          label="Station Label Background Color" color="#${navigators.stationLabelBackgroundColor.getHexString()}" 
          @input="${({ target }: { target: BUI.ColorInput }) => {
            navigators.stationLabelBackgroundColor = new THREE.Color(
              target.color,
            );
          }}">
        </bim-color-input>

        <bim-color-input 
          label="Station Pointer Color" color="#${navigators.stationPointerColor.getHexString()}" 
          @input="${({ target }: { target: BUI.ColorInput }) => {
            navigators.stationPointerColor = new THREE.Color(target.color);
          }}">
        </bim-color-input>

        <bim-color-input 
          label="Station Pointer Background Color" color="#${navigators.stationPointerBackgroundColor.getHexString()}" 
          @input="${({ target }: { target: BUI.ColorInput }) => {
            navigators.stationPointerBackgroundColor = new THREE.Color(
              target.color,
            );
          }}">
        </bim-color-input>

        <bim-number-input
          slider step="0.05" label="Screen distance limit" value="${navigators.screenDistanceLimit}" min="0" max="1"
          @change="${({ target }: { target: BUI.NumberInput }) => {
            navigators.screenDistanceLimit = target.value;
            navigator.updateStations();
          }}">
        </bim-number-input>

        <bim-checkbox
          label="Highlight selected" checked="${highlightSelected}"
          @change="${({ target }: { target: BUI.Checkbox }) => {
            highlightSelected = target.checked;
            updateHighlight();
          }}">
        </bim-checkbox>

        <bim-checkbox
          label="Show kps"
          @change="${({ target }: { target: BUI.Checkbox }) => {
            showStations = target.checked;
            updateStations();
          }}">
        </bim-checkbox>

        
        <bim-checkbox
          label="Clip"
          @change="${({ target }: { target: BUI.Checkbox }) => {
            crossSectionNavigator.plane.enabled = target.checked;
            crossSectionNavigator.sectionVisible = target.checked;
            if (target.checked) {
              crossSectionNavigator.update();
              crossSectionNavigator.plane.update();
            }
            if (showStations) {
              updateStations();
            }
          }}">
        </bim-checkbox>

        
      <bim-checkbox
        label="Flip"
        @change="${({ target }: { target: BUI.Checkbox }) => {
          crossSectionNavigator.flip = target.checked;
          if (showStations) {
            updateStations();
          }
        }}">
      </bim-checkbox>

      <bim-number-input
      slider step="10" label="Increments" value="${navigator.increments}" min="10" max="100"
      @change="${({ target }: { target: BUI.NumberInput }) => {
        navigator.increments = target.value;
        updateStations();
      }}">
    </bim-number-input>

    <bim-number-input
      slider step="0.01" label="Alignment navigation" value="0.5" min="0" max="1"
      @change="${({ target }: { target: BUI.NumberInput }) => {
        moveToPercentage(target.value);
      }}">
    </bim-number-input>

    <bim-number-input
      slider step="10" label="Move to KP" value="2000" min="1925" max="3000"
      @change="${({ target }: { target: BUI.NumberInput }) => {
        const alignment = alignments.children[selectedAlignment] as THREE.Group;
        const length = OBF.CivilUtils.alignmentLength(alignment);
        const localPoint = target.value - alignment.userData.initialStation;
        const percentage = localPoint / length;
        const normalized = Math.min(Math.max(percentage, 0), 1);
        moveToPercentage(normalized);
      }}">
    </bim-number-input>

    </bim-panel-section>

    </bim-panel>
    `;
});

panel.style.zIndex = "9999";

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
  ### 🎉 Wrap up
  ---

  That's it! You have created a 3D app that can load infra models, represent its alignment in 3D and use it to navigate around with a nice camera animation. Well done!
*/
