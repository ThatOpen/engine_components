/* MD
  ## 🗂️ Drawing Layers
  ---
  A real technical drawing rarely contains a single type of geometry. Wall outlines,
  structural elements, furniture, and annotations each belong to a different
  *discipline*, and keeping them visually distinct — or temporarily hiding one while
  you work on another — is one of the first things a drafter needs to control.

  In this tutorial we'll organise a drawing's projection lines into named layers,
  then control their colour and visibility from a live panel. Along the way we'll see
  that annotation systems sit *above* the layer system — their colours come from
  their own styles and are never overridden by the layer they happen to live on.

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
  separate Three.js layer so it can be toggled independently from model geometry;
  we need to make sure the world camera has that layer enabled.
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
  We load the architectural model in Fragment format so the 3D context is visible
  while we work on the drawing. The projection lines we'll use in the next section
  were generated from a horizontal cut of this very model, so everything aligns
  automatically once the drawing is positioned at the right height.
*/

const githubUrl = "https://thatopen.github.io/engine_fragment/resources/worker.mjs";
const fetchedWorker = await fetch(githubUrl);
const workerBlob = await fetchedWorker.blob();
const workerFile = new File([workerBlob], "worker.mjs", { type: "text/javascript" });
const workerUrl = URL.createObjectURL(workerFile);

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

const arqFile = await fetch("/resources/frags/school_arq.frag");
const arqBuffer = await arqFile.arrayBuffer();
await fragments.core.load(arqBuffer, { modelId: "school_arq" });

/* MD
  ### 📐 Creating the drawing
  A `TechnicalDrawing` is a container in 3D space that holds all the flat geometry
  for a given section cut. Every drawing starts with a default layer `"0"` — the same
  convention as AutoCAD — so geometry always has somewhere to live even before you
  define your own layer structure. We'll add two more layers on top of it.
*/

const techDrawings = components.get(OBC.TechnicalDrawings);
const drawing = techDrawings.create(world);
// Align the drawing plane to the floor cut used when generating the projection data.
drawing.three.position.y = 11.427046;

/* MD
  ### 🗂️ Organising geometry into named layers
  Here is where layers earn their value. We create three named layers on top of the
  default `"0"`: one for the projection lines generated from the model, one for a
  small set of hand-crafted reference lines, and one for linear dimensions. Each
  layer is an independent channel — toggle it off, recolour it, and the others are
  untouched.

  The reference lines here are just two crossing baselines, but the same pattern
  applies to any hand-drawn geometry you want to keep separate from the model output:
  setout grids, detail boundaries, revision marks, or any other markup that does not
  come from the automated projection pipeline.
*/

const projData = await fetch("/resources/projections/projection.json").then((r) =>
  r.json(),
) as { positions: number[] };

drawing.layers.create("Geometry",   { material: new THREE.LineBasicMaterial({ color: 0xff0000 }) });
drawing.layers.create("Reference",  { material: new THREE.LineBasicMaterial({ color: 0x0055ff }) });
drawing.layers.create("Dimensions", { material: new THREE.LineBasicMaterial({ color: 0x4488ff }) });

const projGeo = new THREE.BufferGeometry();
projGeo.setAttribute(
  "position",
  new THREE.BufferAttribute(new Float32Array(projData.positions), 3),
);
drawing.addProjectionLines(new THREE.LineSegments(projGeo), "Geometry");

// Two crossing baselines placed near the centre of the plan.
const refGeo = new THREE.BufferGeometry();
refGeo.setAttribute(
  "position",
  new THREE.BufferAttribute(new Float32Array([
     6.5, 0,  5,   18.5, 0,  5,   // horizontal baseline
    12,   0, -0.5,  12,  0,  9.5, // vertical baseline
  ]), 3),
);
drawing.addProjectionLines(new THREE.LineSegments(refGeo), "Reference");

/* MD
  ### 📏 Giving dimensions their own layer
  We assign all linear dimensions to a dedicated `"dimensions"` layer. This gives
  us a single visibility switch for the entire annotation set — handy when you want
  to check the geometry without the measurement clutter, or export a clean base plan.

  One thing worth noting: the colour swatch for the `"dimensions"` layer in the panel
  has no effect on how the annotations actually look. Each annotation system renders
  with the colour defined in its own style, so the layer colour is purely
  organisational — it has no influence on the geometry.
*/

const dims = techDrawings.use(OBC.LinearAnnotations);

/* MD
  ### 🔤 Reacting to commits — rendering text labels
  Text rendering is consumer-side, as in the other tutorials. We await the font load
  before continuing so any programmatically added dimensions are guaranteed to show
  their label on the first commit event.
*/

// Forward reference — onCommit calls updatePanel() but BUI.Component.create()
// comes later. Starts as a no-op and gets reassigned after the panel is built.
let updatePanel = () => {};

const ttfLoader = new TTFLoader();
const font: Font = await new Promise((resolve) => {
  ttfLoader.load("/resources/fonts/PlusJakartaSans-Medium.ttf", (ttf: any) => {
    resolve(new Font(ttf));
  });
});

dims.onCommit.add((committed) => {
  for (const { item: dim, group } of committed) {
    // Assign to the Dimensions layer — applies current visibility immediately.
    drawing.layers.assign(group, "Dimensions");

    const style = dims.styles.get(dim.style) ?? dims.styles.get("default")!;
    const unit  = style.unit ?? OBC.Units.m;
    const text  = `${(dim.pointA.distanceTo(dim.pointB) * unit.factor).toFixed(2)} ${unit.suffix}`;

    const shapes = font.generateShapes(text, style.fontSize);
    const geo    = new THREE.ShapeGeometry(shapes);
    const mesh   = new THREE.Mesh(
      geo,
      new THREE.MeshBasicMaterial({ color: style.color, side: THREE.DoubleSide }),
    );
    // ShapeGeometry is built in the XY plane; rotating -90° around X maps it to
    // the XZ drawing plane so it lies flat alongside the other geometry.
    mesh.rotation.x = -Math.PI / 2;
    mesh.layers.set(1);

    // Centre the geometry pivot so the label stays centred over its anchor point.
    const bbox = new THREE.Box3().setFromObject(mesh);
    const bc   = bbox.getCenter(new THREE.Vector3());
    mesh.position.set(-bc.x, 0, -bc.z);

    const ab   = new THREE.Vector3().subVectors(dim.pointB, dim.pointA);
    const perp = new THREE.Vector3(-ab.z, 0, ab.x).normalize();
    const mid  = dim.pointA.clone().add(dim.pointB).multiplyScalar(0.5)
      .addScaledVector(perp, dim.offset);

    const labelGroup = new THREE.Group();
    labelGroup.layers.set(1);
    labelGroup.position
      .copy(mid)
      .addScaledVector(perp, Math.sign(dim.offset) * style.textOffset)
      .setY(0.005);
    labelGroup.add(mesh);
    group.add(labelGroup);
  }
  updatePanel();
});

dims.onDelete.add(() => updatePanel());

/* MD
  ### 🖱️ Interactive placement
  Hover over a projection line to preview it, then click to start a dimension.
  A second click sets the offset. `Escape` cancels at any point.

  One thing worth noting: the raycaster picks lines on any layer, including hidden
  ones. If your workflow calls for picking only visible lines, you can check
  `drawing.layers.get(hit.layer)?.visible` on the result and discard hidden hits.
*/

const hoverGeo  = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]);
const hoverLine = new THREE.Line(
  hoverGeo,
  new THREE.LineBasicMaterial({ color: 0x0077ff, depthTest: false }),
);
hoverLine.layers.set(1);
// renderOrder 999 ensures it always draws on top of other annotation geometry.
// frustumCulled = false prevents it from disappearing when its endpoints are near
// the screen edge and the bounding box falls partially outside the frustum.
hoverLine.renderOrder = 999;
hoverLine.frustumCulled = false;
hoverLine.visible = false;
drawing.three.add(hoverLine);

const raycaster     = new THREE.Raycaster();
const _drawingPlane = new THREE.Plane();

const getNDC = (e: MouseEvent): THREE.Vector2 => {
  const rect = container.getBoundingClientRect();
  return new THREE.Vector2(
    ((e.clientX - rect.left) / rect.width)  *  2 - 1,
    -((e.clientY - rect.top)  / rect.height) *  2 + 1,
  );
};

const getDrawingPoint = (ray: THREE.Ray): THREE.Vector3 => {
  const normal = new THREE.Vector3(0, 1, 0).transformDirection(drawing.three.matrixWorld);
  const origin = new THREE.Vector3().setFromMatrixPosition(drawing.three.matrixWorld);
  _drawingPlane.setFromNormalAndCoplanarPoint(normal, origin);
  const worldPt = new THREE.Vector3();
  ray.intersectPlane(_drawingPlane, worldPt);
  return drawing.three.worldToLocal(worldPt);
};

container.addEventListener("mousemove", (e) => {
  raycaster.setFromCamera(getNDC(e), world.camera.three);
  const hit = drawing.raycast(raycaster.ray);

  if (hit?.line) {
    const pos = hoverGeo.attributes.position as THREE.BufferAttribute;
    pos.setXYZ(0, hit.line.start.x, 0.01, hit.line.start.z);
    pos.setXYZ(1, hit.line.end.x,   0.01, hit.line.end.z);
    pos.needsUpdate = true;
    hoverLine.visible = true;
  } else {
    hoverLine.visible = false;
  }

  if (dims.machineState.kind === "positioningOffset") {
    dims.sendMachineEvent({ type: "MOUSE_MOVE", point: getDrawingPoint(raycaster.ray) });
  }
});

container.addEventListener("mouseleave", () => { hoverLine.visible = false; });

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") dims.sendMachineEvent({ type: "ESCAPE" });
});

container.addEventListener("click", (e) => {
  raycaster.setFromCamera(getNDC(e), world.camera.three);
  const hit = drawing.raycast(raycaster.ray);

  if (dims.machineState.kind === "awaitingFirstPoint" && hit?.line) {
    dims.sendMachineEvent({ type: "SELECT_LINE", line: hit.line, drawing });
    return;
  }

  if (dims.machineState.kind === "positioningOffset") {
    dims.sendMachineEvent({ type: "CLICK", point: getDrawingPoint(raycaster.ray), drawing });
  }
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

  The layers section renders one row per layer. Each row has a visibility toggle, a
  colour picker that recolours all geometry on that layer in one shot, and a line-type
  selector that swaps between solid and dashed. Switching to dashed also triggers a
  line-distance computation so Three.js knows where to place the gaps.
*/

// Convert a hex number to a CSS colour string for the native <input type="color">.
const toHexColor = (n: number) => "#" + n.toString(16).padStart(6, "0");

const [panel, _updatePanel] = BUI.Component.create<
  BUI.PanelSection,
  Record<string, never>
>(
  (_) => BUI.html`
    <bim-panel active label="Drawing Layers" class="options-menu">

      <bim-panel-section label="Layers">
        ${[...drawing.layers].map(([name, layer]) => BUI.html`
          <div style="display:flex; flex-direction:row; gap:0.5rem; justify-content:space-between;">
            <bim-checkbox
              style="flex:0"
              inverted
              label=${name}
              ?checked=${layer.visible}
              @change=${(e: any) => {
                drawing.layers.setVisibility(name, e.target.checked);
                updatePanel();
              }}>
            </bim-checkbox>
            <bim-color-input
              style="max-width:fit-content"
              color=${toHexColor(layer.material.color.getHex())}
              @input=${(e: any) => {
                drawing.layers.setColor(name, parseInt(e.target.color.slice(1), 16));
                updatePanel();
              }}>
            </bim-color-input>
            <bim-dropdown
              style="max-width:fit-content"
              @change=${(e: any) => {
                const isDashed = e.target.value[0] === "dashed";
                const color = layer.material.color.getHex();
                const mat = isDashed
                  ? new THREE.LineDashedMaterial({ color, dashSize: 0.3, gapSize: 0.2 })
                  : new THREE.LineBasicMaterial({ color });
                drawing.layers.setMaterial(name, mat);
                if (isDashed) {
                  drawing.three.traverse((child) => {
                    if (child.userData.layer === name && (child as THREE.LineSegments).isLineSegments) {
                      (child as THREE.LineSegments).computeLineDistances();
                    }
                  });
                }
                updatePanel();
              }}>
              <bim-option label="Solid" value="solid"
                ?checked=${!(layer.material instanceof THREE.LineDashedMaterial)}>
              </bim-option>
              <bim-option label="Dashed" value="dashed"
                ?checked=${layer.material instanceof THREE.LineDashedMaterial}>
              </bim-option>
            </bim-dropdown>
          </div>
        `)}
      </bim-panel-section>

      <bim-panel-section label="Linear Dimensions">
        <bim-label>Hover a projection line, then click to place a dimension</bim-label>
        <bim-label>Committed: ${drawing.annotations.getBySystem(dims).size}</bim-label>
        <bim-button
          label="Clear all"
          @click=${() => { dims.clear(); updatePanel(); }}>
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
  That's it! The layer system is intentionally minimal: a name, a colour, and a
  visibility flag — no complex inheritance or locking mechanics. That simplicity
  is exactly what makes it composable. You can extend it by subscribing to
  `drawing.layers.onItemSet` and `drawing.layers.onItemDeleted` to drive any external UI,
  or go further and map IFC building systems to layers automatically by reading
  discipline metadata from the model before the projection lines are loaded.
*/
