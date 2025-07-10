/* MD
### 🎥 Great graphics
---

  Postproduction effects enrich your 3D scenes. There are several post-production effects, such as adding shadows, rendering outlines, adding ambient occlusion and applying bloom, that can enhance and make your scene look cool. In this tutorial, you'll learn how to do it.

:::tip Postproduction?

The simple Three.js renderer isn't bad, but it's pretty basic. Postproduction are a collection of effects you can add to your scene to make it look much better. Of course, this means consuming more resources, but luckily for us, the power of devices is proportional to the size of its screen, so we should be able to enjoy this beauty in most scene even from our smartphones!

:::

In this tutorial, we will import:

- `three` to create some 3D items.
- `@thatopen/components` to set up the barebone of our app.
- `@thatopen/ui` to add some simple and cool UI menus.
- `@thatopen/components-front` to use some frontend-oriented components.
- `Stats.js` (optional) to measure the performance of our app.
*/

import * as THREE from "three";
import * as OBC from "@thatopen/components";
import Stats from "stats.js";
import * as BUI from "@thatopen/ui";
// You have to import * as OBF from "@thatopen/components-front"
import * as OBF from "../..";

/* MD
  ### 🌎 Setting up a simple scene
  ---

  We will start by creating a simple scene with a camera and a renderer. If you don't know how to set up a scene, you can check the Worlds tutorial. Notice how we use the PostproductionRenderer in this case. We will also instantiate fragments right away to load BIM models.

  :::tip Fragments?

    If you are not familiar with fragments, check out the IfcLoader tutorial!

  :::
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

const grids = components.get(OBC.Grids);
const grid = grids.create(world);
grid.config.color.set(0x666666);

/* MD
  We'll make the background of the scene transparent so that it looks good in our docs page, but you don't have to do that in your app!
*/

world.scene.three.background = null;

/* MD
  ### 🛠️ Setting Up Fragments
  Now, let's configure the FragmentsManager. This will allow us to load models effortlessly and start manipulating them with ease:
*/

const workerUrl =
  "https://thatopen.github.io/engine_fragment/resources/worker.mjs";
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
  ### 🎬 Turning on the Postproduction
  ---

  Now we will activate the postproduction effect and enable the visibility for postproduction layer.

*/

world.renderer.postproduction.enabled = true;
world.dynamicAnchor = false;

// We will exclude LOD objects from all the passes except the base pass:

fragments.core.models.materials.list.onItemSet.add(({ value: material }) => {
  const isLod = "isLodMaterial" in material && material.isLodMaterial;
  if (isLod) {
    world.renderer!.postproduction.basePass.isolatedMaterials.push(material);
  }
});

// Outline

const model = fragments.list.values().next().value!;
const outliner = components.get(OBF.Outliner);
outliner.world = world;
const walls = await model.getItemsOfCategories([/IFCWALL/]);
const wallsIds = walls.IFCWALL;
const [wall1, wall2] = wallsIds;
outliner.addItems({ [model.modelId]: new Set([wall1, wall2]) });

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

// To update the camera

// window.addEventListener("dblclick", () => {
//   world.camera.projection.toggle();
//   model.useCamera(world.camera.three);
//   world.renderer.postproduction.updateCamera();
// });

/* MD
  ### 🧩 Adding some UI
  ---

  We will use the `@thatopen/ui` library to add some simple and cool UI elements to our app. First, we need to call the `init` method of the `BUI.Manager` class to initialize the library:
*/

BUI.Manager.init();

/* MD
Now we will add some UI to control some of the most common postproduction parameters. For more information about the UI library, you can check the specific documentation for it!
*/

const { aoPass, outlinePass, edgesPass } = world.renderer.postproduction;

const aoParameters = {
  radius: 0.25,
  distanceExponent: 1,
  thickness: 1,
  scale: 1,
  samples: 16,
  distanceFallOff: 1,
  screenSpaceRadius: true,
};

const pdParameters = {
  lumaPhi: 10,
  depthPhi: 2,
  normalPhi: 3,
  radius: 4,
  radiusExponent: 1,
  rings: 2,
  samples: 16,
};

aoPass.updateGtaoMaterial(aoParameters);
aoPass.updatePdMaterial(pdParameters);

const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshLambertMaterial({ color: 0x00ff00 }),
);
cube.position.set(10, 0, 0);
world.scene.three.add(cube);
world.renderer.postproduction.excludedObjectsPass.addExcludedMaterial(
  cube.material,
);

const panel = BUI.Component.create<BUI.PanelSection>(() => {
  return BUI.html`
  <bim-panel active label="Postproduction Tutorial" class="options-menu">

    <bim-panel-section label="General">

      <bim-checkbox checked label="Postproduction enabled"
        @change="${({ target }: { target: BUI.Checkbox }) => {
          world.renderer!.postproduction.enabled = target.value;
        }}">
      </bim-checkbox>

      <bim-checkbox checked label="Outlines enabled"
        ?checked=${world.renderer!.postproduction.outlinesEnabled}
        @change="${({ target }: { target: BUI.Checkbox }) => {
          world.renderer!.postproduction.outlinesEnabled = target.value;
        }}">
      </bim-checkbox>

      <bim-checkbox checked label="Excluded objects enabled"
        ?checked=${world.renderer!.postproduction.excludedObjectsEnabled}
        @change="${({ target }: { target: BUI.Checkbox }) => {
          world.renderer!.postproduction.excludedObjectsEnabled = target.value;
        }}">
      </bim-checkbox>

      <bim-dropdown required label="Postproduction style"
        @change="${({ target }: { target: BUI.Dropdown }) => {
          const result = target.value[0] as OBF.PostproductionAspect;
          world.renderer!.postproduction.style = result;
        }}">

        <bim-option checked label="Basic" value="${OBF.PostproductionAspect.COLOR}"></bim-option>
        <bim-option label="Pen" value="${OBF.PostproductionAspect.PEN}"></bim-option>
        <bim-option label="Shadowed Pen" value="${OBF.PostproductionAspect.PEN_SHADOWS}"></bim-option>
        <bim-option label="Color Pen" value="${OBF.PostproductionAspect.COLOR_PEN}"></bim-option>
        <bim-option label="Color Shadows" value="${OBF.PostproductionAspect.COLOR_SHADOWS}"></bim-option>
        <bim-option label="Color Pen Shadows" value="${OBF.PostproductionAspect.COLOR_PEN_SHADOWS}"></bim-option>
      </bim-dropdown>

    </bim-panel-section>

      <bim-panel-section label="Edges">

      <bim-number-input
          slider step="0.1" label="Width"
          value="${world.renderer!.postproduction.edgesPass.width}" min="1" max="3"
          @change="${({ target }: { target: BUI.NumberInput }) => {
            world.renderer!.postproduction.edgesPass.width = target.value;
          }}">
      </bim-number-input>

      <bim-color-input label="Edges color"
        color="#${edgesPass.color.getHexString()}"
        @input="${({ target }: { target: BUI.ColorInput }) => {
          edgesPass.color.set(target.value.color);
        }}">
      </bim-color-input>

    </bim-panel-section>

    <bim-panel-section label="Outline">

      <bim-number-input
          slider step="0.1" label="Outline thickness"
          value="${outlinePass.thickness}" min="1" max="10"
          @change="${({ target }: { target: BUI.NumberInput }) => {
            outlinePass.thickness = target.value;
          }}">
      </bim-number-input>

      <bim-number-input
          slider step="0.01" label="Fill opacity"
          value="${outlinePass.fillOpacity}" min="0" max="1"
          @change="${({ target }: { target: BUI.NumberInput }) => {
            outlinePass.fillOpacity = target.value;
          }}">
      </bim-number-input>

      <bim-color-input label="Line color"
        color="#${outlinePass.outlineColor.getHexString()}"
        @input="${({ target }: { target: BUI.ColorInput }) => {
          outlinePass.outlineColor.set(target.value.color);
        }}">
      </bim-color-input>

      <bim-color-input label="Fill color"
        color="#${outlinePass.fillColor.getHexString()}"
        @input="${({ target }: { target: BUI.ColorInput }) => {
          outlinePass.fillColor.set(target.value.color);
        }}">
      </bim-color-input>

    </bim-panel-section>

    <bim-panel-section label="Ambient Occlusion">

        <bim-checkbox checked label="Screen Space Radius"
          ?checked=${aoParameters.screenSpaceRadius}
          @change="${({ target }: { target: BUI.Checkbox }) => {
            aoParameters.screenSpaceRadius = target.value;
            aoPass.updateGtaoMaterial(aoParameters);
          }}">
        </bim-checkbox>

        <bim-number-input
          slider step="0.01" label="Blend intensity"
          value="${aoPass.blendIntensity}" min="0" max="1"
          @change="${({ target }: { target: BUI.NumberInput }) => {
            aoPass.blendIntensity = target.value;
          }}">
        </bim-number-input>

        <bim-number-input
          slider step="0.01" label="Radius"
          value="${aoParameters.radius}" min="0.01" max="1"
          @change="${({ target }: { target: BUI.NumberInput }) => {
            aoParameters.radius = target.value;
            aoPass.updateGtaoMaterial(aoParameters);
          }}">
        </bim-number-input>

        <bim-number-input
          slider step="0.01" label="Distance exponent"
          value="${aoParameters.distanceExponent}" min="1" max="4"
          @change="${({ target }: { target: BUI.NumberInput }) => {
            aoParameters.distanceExponent = target.value;
            aoPass.updateGtaoMaterial(aoParameters);
          }}">
        </bim-number-input>

        <bim-number-input
          slider step="0.01" label="Thickness"
          value="${aoParameters.thickness}" min="0.01" max="10"
          @change="${({ target }: { target: BUI.NumberInput }) => {
            aoParameters.thickness = target.value;
            aoPass.updateGtaoMaterial(aoParameters);
          }}">
        </bim-number-input>

        <bim-number-input
          slider step="0.01" label="Distance falloff"
          value="${aoParameters.distanceFallOff}" min="0" max="1"
          @change="${({ target }: { target: BUI.NumberInput }) => {
            aoParameters.distanceFallOff = target.value;
            aoPass.updateGtaoMaterial(aoParameters);
          }}">
        </bim-number-input>

        <bim-number-input
          slider step="0.01" label="Scale"
          value="${aoParameters.scale}" min="0.01" max="2"
          @change="${({ target }: { target: BUI.NumberInput }) => {
            aoParameters.scale = target.value;
            aoPass.updateGtaoMaterial(aoParameters);
          }}">
        </bim-number-input>

        <bim-number-input
          slider step="1" label="Samples"
          value="${aoParameters.samples}" min="2" max="32"
          @change="${({ target }: { target: BUI.NumberInput }) => {
            aoParameters.samples = target.value;
            aoPass.updateGtaoMaterial(aoParameters);
          }}">
        </bim-number-input>

        <bim-number-input
          slider step="0.1" label="PD Luma Phi"
          value="${pdParameters.lumaPhi}" min="0" max="20"
          @change="${({ target }: { target: BUI.NumberInput }) => {
            pdParameters.lumaPhi = target.value;
            aoPass.updatePdMaterial(pdParameters);
          }}">
        </bim-number-input>

        <bim-number-input
          slider step="0.1" label="PD Depth Phi"
          value="${pdParameters.depthPhi}" min="0.01" max="20"
          @change="${({ target }: { target: BUI.NumberInput }) => {
            pdParameters.depthPhi = target.value;
            aoPass.updatePdMaterial(pdParameters);
          }}">
        </bim-number-input>

        <bim-number-input
          slider step="0.1" label="PD Normal Phi"
          value="${pdParameters.normalPhi}" min="0.01" max="20"
          @change="${({ target }: { target: BUI.NumberInput }) => {
            pdParameters.normalPhi = target.value;
            aoPass.updatePdMaterial(pdParameters);
          }}">
        </bim-number-input>

        <bim-number-input
          slider step="1" label="PD Radius"
          value="${pdParameters.radius}" min="0" max="32"
          @change="${({ target }: { target: BUI.NumberInput }) => {
            pdParameters.radius = target.value;
            aoPass.updatePdMaterial(pdParameters);
          }}">
        </bim-number-input>

        <bim-number-input
          slider step="0.1" label="PD Radius Exponent"
          value="${pdParameters.radiusExponent}" min="0.1" max="4"
          @change="${({ target }: { target: BUI.NumberInput }) => {
            pdParameters.radiusExponent = target.value;
            aoPass.updatePdMaterial(pdParameters);
          }}">
        </bim-number-input>

        <bim-number-input
          slider step="0.125" label="PD Rings"
          value="${pdParameters.rings}" min="1" max="16"
          @change="${({ target }: { target: BUI.NumberInput }) => {
            pdParameters.rings = target.value;
            aoPass.updatePdMaterial(pdParameters);
          }}">
        </bim-number-input>

        <bim-number-input
          slider step="1" label="PD Samples"
          value="${pdParameters.samples}" min="2" max="32"
          @change="${({ target }: { target: BUI.NumberInput }) => {
            pdParameters.samples = target.value;
            aoPass.updatePdMaterial(pdParameters);
          }}">
        </bim-number-input>

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
  ### 🎉 Wrap up
  ---

  That's it! You have created an app that looks great thanks to postproduction and exposes a menu to allow the user control it in real time.
*/
