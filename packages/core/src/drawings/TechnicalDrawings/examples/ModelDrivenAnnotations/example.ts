/* MD
  ## 🏔️ Model-Driven Annotations
  ---
  Documenting slopes on roofs, ramps, or site grading by hand is error-prone — the data is already encoded in the model geometry as face normals, so measuring it manually introduces unnecessary risk. Model-driven annotations extract that data directly from a surface click, bypassing the multi-step placement workflow entirely.

  This tutorial covers clicking any surface to read its face normal, deriving the slope ratio and downhill direction from it, and recording the result as a `SlopeAnnotations` entry on the drawing — in either percentage or degrees format. By the end, you'll have a one-click slope annotation tool that reads geometry directly from the model with no manual input required.

  ### 🖖 Importing our Libraries
  First, let's install all necessary dependencies to make this example work:
*/

import * as THREE from "three";
// @ts-ignore
import { TTFLoader } from "three/examples/jsm/loaders/TTFLoader.js";
import { Font } from "three/examples/jsm/loaders/FontLoader.js";
import Stats from "stats.js";
import * as BUI from "@thatopen/ui";
// You have to import * as OBC from "@thatopen/components"
import * as OBC from "../../../../index";

/* MD
  ### 🌎 Setting up the scene
  Nothing special here — just a regular 3D scene. Annotation geometry lives on a
  separate layer so it can be toggled independently from model geometry; we need to
  make sure the world camera has that layer enabled.
*/

const components = new OBC.Components();

const worlds = components.get(OBC.Worlds);
const world = worlds.create<
  OBC.SimpleScene,
  OBC.SimpleCamera,
  OBC.SimpleRenderer
>();

world.scene = new OBC.SimpleScene(components);
world.scene.setup();
world.scene.three.background = null;

const container = document.getElementById("container")!;
world.renderer = new OBC.SimpleRenderer(components, container);
world.camera = new OBC.SimpleCamera(components);
await world.camera.controls.setLookAt(48.213, 33.495, -5.062, 13.117, -1.205, 22.223);


components.init();

/* MD
  ### 🏗️ Loading a BIM model
  With the scene ready, we bring in the architectural model. The building geometry
  is what we'll click on to derive slope annotations — face normals encoded in the
  mesh tell us both the steepness and the downhill direction of each surface.
*/

// `FragmentsManager.getWorker()` fetches the matching worker for this library version from unpkg and returns a blob URL.
// You can also pass your own URL to `fragments.init(...)` if you'd rather host the worker yourself.
const workerUrl = await OBC.FragmentsManager.getWorker();

const fragments = components.get(OBC.FragmentsManager);
fragments.init(workerUrl);

world.camera.controls.addEventListener("update", () => fragments.core.update());

fragments.list.onItemSet.add(({ value: model }) => {
  model.useCamera(world.camera.three);
  world.scene.three.add(model.object);
  fragments.core.update(true);
});

fragments.core.models.materials.list.onItemSet.add(({ value: material }) => {
  if (!("isLodMaterial" in material && material.isLodMaterial)) {
    material.polygonOffset = true;
    material.polygonOffsetUnits = 1;
    material.polygonOffsetFactor = Math.random();
  }
});

const arqFile = await fetch("https://thatopen.github.io/engine_components/resources/frags/school_arq.frag");
const arqBuffer = await arqFile.arrayBuffer();
await fragments.core.load(arqBuffer, { modelId: "school_arq" });

/* MD
  ### 📐 Creating the drawing and loading projection lines
  We create the drawing and load a pre-computed set of projection lines — a building
  floor plan already flattened to the drawing plane. These give the slope annotations
  spatial context: the arrows will appear projected onto the plan directly below the
  surfaces they measure.
*/

const techDrawings = components.get(OBC.TechnicalDrawings);
const drawing = techDrawings.create(world);
drawing.three.position.y = 11.427046;

const projData = await fetch("https://thatopen.github.io/engine_components/resources/projections/projection.json").then((r) =>
  r.json(),
) as { positions: number[] };
const projGeo = new THREE.BufferGeometry();
projGeo.setAttribute(
  "position",
  new THREE.BufferAttribute(new Float32Array(projData.positions), 3),
);
drawing.layers.create("projection", { material: new THREE.LineBasicMaterial({ color: 0xff0000 }) });
const projLines = new THREE.LineSegments(projGeo);
drawing.addProjectionLines(projLines, "projection");

/* MD
  ### 📍 Registering SlopeAnnotations
  Registration follows the same one-line pattern as every other system. Here we
  configure two named styles that display the same slope ratio in different formats:
  one in percentage and one in degrees. Switching the active style before a click
  decides which format is applied to the new annotation.
*/

const slopes = techDrawings.use(OBC.SlopeAnnotations);

slopes.styles.set("percentage", {
  lineTick: OBC.NoTick,
  meshTick: OBC.FilledArrowTick,
  tickSize: 0.09,
  length: 0.6,
  color: 0xdd3300,
  textOffset: 0.14,
  fontSize: 0.14,
  format: "percentage",
});

slopes.styles.set("degrees", {
  lineTick: OBC.NoTick,
  meshTick: OBC.FilledArrowTick,
  tickSize: 0.09,
  length: 0.6,
  color: 0x0055cc,
  textOffset: 0.14,
  fontSize: 0.14,
  format: "degrees",
});

slopes.activeStyle = "percentage";

/* MD
  ### 🔤 Text labels
  Slope annotations render the directional arrow, but the text label is
  consumer-side — built from the committed annotation data and attached to the
  annotation group so it moves, hides, and is deleted together with the arrow
  automatically.

  We factor label construction into a helper so the same logic can run both when an
  annotation is first created and when it is updated later (for example when switching
  between the percentage and degrees styles).
*/

let font: Font | null = null;
const ttfLoader = new TTFLoader();
ttfLoader.load("https://thatopen.github.io/engine_components/resources/fonts/PlusJakartaSans-Medium.ttf", (ttf: any) => {
  font = new Font(ttf);
});

const createTextMesh = (
  text: string,
  fontSize: number,
  color: number,
): THREE.Mesh | null => {
  if (!font) return null;
  const shapes = font.generateShapes(text, fontSize);
  const geo = new THREE.ShapeGeometry(shapes);
  const mesh = new THREE.Mesh(
    geo,
    new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide }),
  );
  // ShapeGeometry is built in the XY plane; rotating −90° around X maps it to
  // the XZ drawing plane so it lies flat alongside the annotation geometry.
  mesh.rotation.x = -Math.PI / 2;
  mesh.layers.set(1);
  // Centre the pivot so the label stays centred over its anchor point.
  const bbox = new THREE.Box3().setFromObject(mesh);
  const bc = bbox.getCenter(new THREE.Vector3());
  mesh.position.set(-bc.x, 0, -bc.z);
  return mesh;
};

const buildLabelGroup = (ann: OBC.SlopeAnnotation): THREE.Group | null => {
  const style = slopes.styles.get(ann.style) ?? slopes.styles.get("percentage")!;
  const text = OBC.formatSlope(ann.slope, style.format);
  const mesh = createTextMesh(text, style.fontSize, style.color);
  if (!mesh) return null;

  // Place the label beside the arrow midpoint, offset perpendicular to the direction.
  const mid = ann.position.clone().addScaledVector(ann.direction, style.length / 2);
  const perp = new THREE.Vector3(-ann.direction.z, 0, ann.direction.x);

  // The text is always written along X. When perp has a large X component (near-vertical
  // arrow), the text extends parallel to the offset and can cross the arrow. Compute how
  // much the text reaches in the perp direction and ensure the offset clears it.
  const bbox = new THREE.Box3().setFromObject(mesh);
  const halfW = (bbox.max.x - bbox.min.x) / 2;
  const halfH = Math.abs(bbox.max.z - bbox.min.z) / 2;
  const perpExtent = Math.abs(perp.x) * halfW + Math.abs(perp.z) * halfH;
  const offset = Math.max(style.textOffset, perpExtent + 0.05);

  const g = new THREE.Group();
  // Flag so onUpdate can identify and replace this group without touching the arrow.
  g.userData.isLabel = true;
  g.layers.set(1);
  g.position.copy(mid).addScaledVector(perp, offset).setY(0.005);
  g.add(mesh);
  return g;
};

// Forward reference — onCommit/onUpdate/onDelete handlers call updatePanel() but
// BUI.Component.create() comes later. Starts as a no-op, reassigned after the panel.
let updatePanel = () => {};

slopes.onCommit.add(([{ item: ann, group }]) => {
  const label = buildLabelGroup(ann);
  if (label) group.add(label);
  updatePanel();
});

slopes.onUpdate.add(({ item: ann, group }) => {
  // Replace the stale label with a freshly generated one.
  const old = group.children.find((c) => c.userData?.isLabel);
  if (old) {
    old.traverse((c) => {
      if ((c as THREE.Mesh).geometry) (c as THREE.Mesh).geometry.dispose();
      if ((c as THREE.Mesh).material instanceof THREE.Material)
        ((c as THREE.Mesh).material as THREE.Material).dispose();
    });
    group.remove(old);
  }
  const label = buildLabelGroup(ann);
  if (label) group.add(label);
  updatePanel();
});

slopes.onDelete.add(() => updatePanel());

/* MD
  ### 🖱️ Annotating surfaces from clicks
  This is where the model-driven pattern comes together. On every click we raycast
  against the surface meshes, read the face normal from the hit, and derive both the
  slope ratio and the downhill direction from it. The result goes straight to the
  system — no state machine, no multi-click workflow. All the data is already in the
  geometry.
*/

const casters = components.get(OBC.Raycasters);
const caster = casters.get(world);

container.addEventListener("click", async () => {
  const hit = await caster.castRay() as any;
  if (!hit?.normal) return;

  // Fragment hit exposes the normal directly in world space — no matrix transform needed.
  const worldNormal = hit.normal as THREE.Vector3;

  // A near-zero horizontal component means a flat surface — nothing to annotate.
  const run = Math.sqrt(worldNormal.x ** 2 + worldNormal.z ** 2);
  if (run < 1e-6) return;

  // A near-zero vertical component means a vertical surface — slope would be infinite.
  const yAbs = Math.abs(worldNormal.y);
  if (yAbs < 1e-6) return;

  const slope = run / yAbs;
  // The downhill direction is the horizontal projection of the normal — water flows
  // in the direction the surface faces horizontally.
  const direction = new THREE.Vector3(
    worldNormal.x,
    0,
    worldNormal.z,
  ).normalize();
  // Project the hit point onto the drawing plane (Y = 0 in drawing local space).
  const position = drawing.three.worldToLocal(hit.point.clone());
  position.y = 0;

  slopes.add(drawing, { position, direction, slope, style: slopes.activeStyle });
});

/* MD
  ### 🧩 Adding some UI (optional but recommended)
  We will use the `@thatopen/ui` library to add some simple and cool UI elements to
  our app. We need to initialize it once before creating any components:
*/

BUI.Manager.init();

/* MD
  Now we will add some UI to play around with the actions in this tutorial. For more
  information about the UI library, you can check the specific documentation for it!
*/

const [panel, _updatePanel] = BUI.Component.create<
  BUI.PanelSection,
  Record<string, never>
>(
  (_) => BUI.html`
    <bim-panel active label="Model Driven Annotations" class="options-menu">

      <bim-panel-section label="Slope Annotations">
        <bim-label>Click any surface to annotate its slope</bim-label>
        <bim-label>Committed: ${drawing.annotations.getBySystem(slopes).size}</bim-label>
        <bim-label>Active style: ${slopes.activeStyle}</bim-label>
        <bim-button
          label="Toggle style (percentage / degrees)"
          @click=${() => {
            slopes.activeStyle =
              slopes.activeStyle === "percentage" ? "degrees" : "percentage";
            updatePanel();
          }}>
        </bim-button>
        <bim-button
          label="Clear all"
          @click=${() => {
            slopes.clear();
            updatePanel();
          }}>
        </bim-button>
      </bim-panel-section>

    </bim-panel>
  `,
  {},
);

updatePanel = _updatePanel;
document.body.append(panel);

/* MD
  And we will make some logic that adds a button to the screen when the user is
  visiting our app from their phone, allowing to show or hide the menu. Otherwise,
  the menu would make the app unusable.
*/

const button = BUI.Component.create<BUI.PanelSection>(() => BUI.html`
  <bim-button class="phone-menu-toggler" icon="solar:settings-bold"
    @click="${() => {
      if (panel.classList.contains("options-menu-visible")) {
        panel.classList.remove("options-menu-visible");
      } else {
        panel.classList.add("options-menu-visible");
      }
    }}">
  </bim-button>
`);

document.body.append(button);

/* MD
  ### ⏱️ Measuring the performance (optional)
  We'll use the [Stats.js](https://github.com/mrdoob/stats.js) to measure the
  performance of our app. We will add it to the top left corner of the viewport.
  This way, we'll make sure that the memory consumption and the FPS of our app are
  under control.
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
  That's it! The model-driven pattern keeps annotation logic decoupled from user
  interaction: click a surface, let the geometry tell you the slope, and let the
  system record it. Swap the tilted planes for real fragment geometry loaded from an
  IFC file and the rest of the code stays exactly the same — the workflow scales from
  simple tutorials to production BIM applications without modification.
*/
