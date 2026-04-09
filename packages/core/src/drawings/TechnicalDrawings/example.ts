/* MD
  ## 📐 Technical Drawings
  ---
  Technical drawings are 2D annotations anchored in 3D space, used in architecture,
  engineering, and construction to communicate design intent precisely. In That Open
  Engine, a drawing is a container you place anywhere in your 3D scene — move it,
  rotate it, or scale it and everything inside follows. Annotation systems plug into
  it, and all data can be exported to DXF for use in any CAD application. Let's see
  how it works!

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
import * as OBC from "../../index";

/* MD
  ### 🌎 Setting up the scene
  Nothing special here — just a regular 3D scene with a camera, renderer, and scene.
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
  A technical drawing is most useful when it has real geometry to annotate. Here we
  load the architectural model in Fragment format — a worker-based geometry system
  that keeps the main thread free while processing large models. The model gives the
  drawing spatial context: the projection lines we'll add later are wall outlines
  extracted directly from it.
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

const arqFile = await fetch("https://thatopen.github.io/engine_components/resources/frags/school_arq.frag");
const arqBuffer = await arqFile.arrayBuffer();
await fragments.core.load(arqBuffer, { modelId: "school_arq" });

/* MD
  ### 📐 Creating a TechnicalDrawing
  The `TechnicalDrawings` manager creates and tracks all drawings in your app. Each
  drawing is a group that holds all annotation geometry as one unit — moving or
  rotating it repositions everything at once, with no extra bookkeeping required.

  We also load a pre-computed set of projection lines here — wall outlines already
  flattened to the drawing plane. Adding them through the drawing rather than directly
  to the scene enables BVH-accelerated raycasting, which is what lets the app snap to
  individual segments efficiently. Without it, hit detection degrades to brute-force
  across every segment — noticeably slow for dense projections.
*/

const techDrawings = components.get(OBC.TechnicalDrawings);
// Passing the world configures it automatically: the drawing's group is added to
// the scene, its lifecycle is tied to the world, and Three.js rendering layer 1
// (where all annotation geometry lives) is enabled on the world camera.
const drawing = techDrawings.create(world);
drawing.three.position.y = 11.427046;

const projData = await fetch("/resources/projections/projection.json").then((r) => r.json()) as { positions: number[] };
const projGeo = new THREE.BufferGeometry();
projGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(projData.positions), 3));
drawing.layers.create("projection", { material: new THREE.LineBasicMaterial({ color: 0xff0000 }) });
const projLines = new THREE.LineSegments(projGeo);
drawing.addProjectionLines(projLines, "projection");

/* MD
  ### 🔌 Registering a system and reacting to commits
  Annotation systems are registered once on `TechnicalDrawings` and work across as
  many drawings as you create. Configure styles and event handlers once; they apply
  everywhere without any extra bookkeeping per drawing.

  The most important thing to understand about annotation systems is that **text
  rendering is entirely consumer-side**. The system stores the measurement data and
  fires events when annotations are created, updated, or deleted — but how you turn
  that data into visible text is completely up to you. This keeps the core library
  free of DOM and font dependencies, so it runs equally well in Node.js and the
  browser.

  Here we load a TTF font once and generate a label mesh on every commit, then attach
  it as a child of the annotation group so it moves, rotates, and disappears together
  with the rest of the annotation automatically.

  :::info

  If you need production-ready text labels with correct positioning, rotation, and
  multi-style support out of the box, components-front ships a `DrawingEditor` that
  handles all of this for you. What you see here is intentionally minimal — it shows
  the pattern, not the full implementation.

  :::
*/

// Register LinearDimensions once — works across all drawings
const dims = techDrawings.use(OBC.LinearAnnotations);

// Forward reference — onCommit calls updatePanel() but BUI.Component.create()
// comes later. It starts as a no-op and gets reassigned after the panel is built.
let updatePanel = () => {};

let font: Font | null = null;
const ttfLoader = new TTFLoader();
ttfLoader.load("/resources/fonts/PlusJakartaSans-Medium.ttf", (ttf: any) => {
  font = new Font(ttf);
});

dims.onCommit.add((committed) => {
  for (const { item: dim, group } of committed) {
    if (!font) continue;
    const style = dims.styles.get(dim.style) ?? dims.styles.get("default")!;
    const dist = dim.pointA.distanceTo(dim.pointB);
    const text = `${dist.toFixed(2)} m`;

    const shapes = font.generateShapes(text, style.fontSize);
    const geo = new THREE.ShapeGeometry(shapes);
    const mesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: style.color, side: THREE.DoubleSide }));
    // ShapeGeometry is built in the XY plane; rotating -90° around X maps it to
    // the XZ drawing plane so it lies flat on the ground alongside the other geometry.
    mesh.rotation.x = -Math.PI / 2;
    mesh.layers.set(1);

    // Centre the geometry pivot so the label stays centred over its anchor point.
    const bbox = new THREE.Box3().setFromObject(mesh);
    const bc = bbox.getCenter(new THREE.Vector3());
    mesh.position.set(-bc.x, 0, -bc.z);

    const ab = new THREE.Vector3().subVectors(dim.pointB, dim.pointA);
    const perp = new THREE.Vector3(-ab.z, 0, ab.x).normalize();
    const mid = dim.pointA.clone().add(dim.pointB).multiplyScalar(0.5).addScaledVector(perp, dim.offset);

    const labelGroup = new THREE.Group();
    labelGroup.layers.set(1);
    labelGroup.position.copy(mid).addScaledVector(perp, Math.sign(dim.offset) * style.textOffset).setY(0.005);
    labelGroup.add(mesh);
    group.add(labelGroup);
  }
  updatePanel();
});

dims.onDelete.add(() => updatePanel());

/* MD
  ### 🕹️ Interactive placement via state machine
  Every annotation system in That Open Engine is driven by a **state machine**. Instead
  of managing interaction logic yourself, you feed pointer events to the system and it
  handles all state transitions internally. The available events are typed, so
  TypeScript tells you exactly what each state accepts.

  For linear dimensions, a single click on a projection line locks onto both of its
  endpoints at once, then a second click sets how far the dimension line sits from the
  measured segment. This is the most natural way to annotate geometry that already
  exists in the drawing.

  The target drawing is passed only when a dimension is committed — the final click.
  This keeps the state machine stateless with respect to drawings, so you can freely
  switch which drawing is active between interactions.

  We also do our own raycasting against the drawing to find which segment the cursor
  is hovering over, and keep a hover highlight updated on every mouse move.
*/

// Hover highlight — a single line slightly above Y=0 so it always renders on top.
const hoverGeo = new THREE.BufferGeometry().setFromPoints([
  new THREE.Vector3(),
  new THREE.Vector3(),
]);
const hoverLine = new THREE.Line(
  hoverGeo,
  new THREE.LineBasicMaterial({ color: 0x0077ff, depthTest: false }),
);
hoverLine.layers.set(1);
// renderOrder 999 ensures it always draws on top of other annotation geometry.
// frustumCulled = false prevents it from disappearing when the endpoints are
// near the screen edge and the bounding box falls partially outside the frustum.
hoverLine.renderOrder = 999;
hoverLine.frustumCulled = false;
hoverLine.visible = false;
drawing.three.add(hoverLine);

/* MD
  To update the highlight and forward cursor positions to the state machine, we need
  to translate mouse events into 3D coordinates. One helper maps pixel coordinates to
  normalized device coordinates for the raycaster; another projects the resulting ray
  onto the drawing's local plane, so positions sent to the state machine are always
  expressed in drawing space rather than world space.
*/

const raycaster = new THREE.Raycaster();

const getNDC = (e: MouseEvent): THREE.Vector2 => {
  const rect = container.getBoundingClientRect();
  return new THREE.Vector2(
    ((e.clientX - rect.left) / rect.width) * 2 - 1,
    -((e.clientY - rect.top) / rect.height) * 2 + 1,
  );
};

// Resolve a ray to a point in drawing local space (XZ plane, Y = 0).
const _drawingPlane = new THREE.Plane();
const getDrawingPoint = (ray: THREE.Ray): THREE.Vector3 => {
  const normal = new THREE.Vector3(0, 1, 0).transformDirection(drawing.three.matrixWorld);
  const origin = new THREE.Vector3().setFromMatrixPosition(drawing.three.matrixWorld);
  _drawingPlane.setFromNormalAndCoplanarPoint(normal, origin);
  const worldPt = new THREE.Vector3();
  ray.intersectPlane(_drawingPlane, worldPt);
  return drawing.three.worldToLocal(worldPt);
};

/* MD
  With those helpers in place, the event listeners are the glue between raw browser
  input and the drawing. On every mouse move we update the hover highlight and, if the
  state machine is waiting for an offset position, forward the latest drawing-space
  point to it. Clicks and Escape are sent as typed events — the state machine simply
  ignores anything that doesn't apply to its current state.

  The `drawing` is passed to both the line-selection event and the final offset click —
  the system needs it as soon as placement begins so it can render the live preview
  geometry on the right drawing while you move the cursor.
*/

container.addEventListener("mousemove", (e) => {
  raycaster.setFromCamera(getNDC(e), world.camera.three);
  const hit = drawing.raycast(raycaster.ray);

  if (hit?.line) {
    const pos = hoverGeo.attributes.position as THREE.BufferAttribute;
    pos.setXYZ(0, hit.line.start.x, 0.01, hit.line.start.z);
    pos.setXYZ(1, hit.line.end.x, 0.01, hit.line.end.z);
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
    // drawing is required here so the system knows where to render the live preview.
    dims.sendMachineEvent({ type: "SELECT_LINE", line: hit.line, drawing });
    return;
  }

  if (dims.machineState.kind === "positioningOffset") {
    dims.sendMachineEvent({ type: "CLICK", point: getDrawingPoint(raycaster.ray), drawing });
  }
});

/* MD
  ### 📤 Exporting to DXF
  A built-in exporter converts any drawing to a DXF string — the standard format for
  technical drawings in CAD applications. All annotation systems are exported
  automatically, including their text labels. Here we build the file client-side and
  trigger a browser download without any server round-trip.
*/

const dxfExporter = components.get(OBC.DxfManager).exporter;

const exportDxf = () => {
  const dxf = dxfExporter.export([{ drawing, viewports: [{}] }]);
  const blob = new Blob([dxf], { type: "application/dxf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "technical-drawing.dxf";
  a.click();
  URL.revokeObjectURL(url);
};

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

const [panel, _updatePanel] = BUI.Component.create<BUI.PanelSection, Record<string, never>>(
  (_) => BUI.html`
    <bim-panel active label="Technical Drawings" class="options-menu">
      <bim-panel-section label="Linear Dimensions">
        <bim-label>Hover a projection line to highlight it</bim-label>
        <bim-label>Click it to start a dimension</bim-label>
        <bim-label>Click again to set the offset distance</bim-label>
        <bim-label>Committed: ${drawing.annotations.getBySystem(dims).size}</bim-label>
        <bim-label style="width: 14rem; white-space: normal; opacity: 0.6; font-size: 0.8em;">Note: text labels are always horizontal in this example. See components-front for full rotation support.</bim-label>
        <bim-button label="Clear all"
          @click=${() => { dims.clear([drawing]); updatePanel(); }}>
        </bim-button>
      </bim-panel-section>
      <bim-panel-section label="Export">
        <bim-button label="Export DXF" @click=${exportDxf}>
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
  That's it! You now know how to create a drawing, register annotation systems,
  react to commits for text rendering, feed events to the state machine for
  interactive placement, and export to DXF. Check the other examples to go deeper:
  custom styles, multi-viewport drawings, and model-driven annotations.
*/
