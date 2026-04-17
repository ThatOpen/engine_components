/* MD
  ## 🔖 Annotation Systems
  ---
  A technical drawing typically needs more than one type of annotation — wall lengths require linear dimensions, corners need angle dimensions, and specific elements need callout leaders. Managing multiple annotation tools at once, each with its own interaction flow, can quickly turn into a tangle of event handlers and state. Annotation systems solve this by encapsulating each tool's state machine independently, so they can coexist on the same drawing with a single shared input dispatcher.

  This tutorial covers registering linear, leader, and angle annotation systems on the same drawing, wiring a single set of mouse and keyboard events to route input to whichever tool is active, rendering text labels on commit for each system, and switching between tools from a UI dropdown. By the end, you'll have a multi-tool annotation setup ready to place dimensions, leaders, and angles on any technical drawing.

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
  A technical drawing is most useful when it has real geometry to annotate. We load
  the architectural model in Fragment format — a worker-based geometry system that
  keeps the main thread free while processing large models. The drawing's Y position
  is aligned to the floor cut plane used when generating the projection lines, so the
  wall outlines land exactly where they should in the scene.
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
  We create the drawing, align its Y position to the floor cut plane, and load a
  pre-computed set of projection lines — wall outlines already flattened to the
  drawing plane — onto a named layer. Two of the three systems snap to these lines
  when the user clicks, so they are the geometry the placement workflows pivot around.
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
  ### 🔌 Registering the systems
  Three systems, three lines — each registered independently on the same drawing.
  Their geometry coexists in the same container group with no extra scene management
  needed.
*/

const dims     = techDrawings.use(OBC.LinearAnnotations);
const leaders  = techDrawings.use(OBC.LeaderAnnotations);
const angleDims = techDrawings.use(OBC.AngleAnnotations);

/* MD
  ### 🔤 Text labels
  All three systems render lines and ticks, but text labels are always your
  responsibility as the consumer — you generate them in the commit handler and attach
  them to the annotation group so they move, hide, and delete together with the
  geometry automatically. We load a single font here and share it across all systems.
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
  const geo    = new THREE.ShapeGeometry(shapes);
  const mesh   = new THREE.Mesh(
    geo,
    new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide }),
  );
  // ShapeGeometry is built in the XY plane; rotating −90° around X maps it to
  // the XZ drawing plane so it lies flat alongside the annotation geometry.
  mesh.rotation.x = -Math.PI / 2;
  mesh.layers.set(1);
  // Centre the pivot so the label stays centred over its anchor point.
  const bbox = new THREE.Box3().setFromObject(mesh);
  const bc   = bbox.getCenter(new THREE.Vector3());
  mesh.position.set(-bc.x, 0, -bc.z);
  return mesh;
};

// Forward reference — commit handlers call updatePanel() but
// BUI.Component.create() comes later. Starts as a no-op, reassigned after the panel.
let updatePanel = () => {};

dims.onCommit.add((committed) => {
  for (const { item: dim, group } of committed) {
    const style = dims.styles.get(dim.style) ?? dims.styles.get("default")!;
    const text  = `${dim.pointA.distanceTo(dim.pointB).toFixed(2)} m`;
    const mesh  = createTextMesh(text, style.fontSize, style.color);
    if (!mesh) continue;
    const ab   = new THREE.Vector3().subVectors(dim.pointB, dim.pointA);
    const perp = new THREE.Vector3(-ab.z, 0, ab.x).normalize();
    const mid  = dim.pointA.clone().add(dim.pointB).multiplyScalar(0.5)
      .addScaledVector(perp, dim.offset);
    const g = new THREE.Group();
    g.layers.set(1);
    g.position.copy(mid)
      .addScaledVector(perp, Math.sign(dim.offset) * style.textOffset)
      .setY(0.005);
    g.add(mesh);
    group.add(g);
  }
  updatePanel();
});

leaders.onCommit.add((committed) => {
  for (const { item: ann, group } of committed) {
    const style  = leaders.styles.get(ann.style) ?? leaders.styles.get("default")!;
    const extDir = new THREE.Vector3()
      .subVectors(ann.extensionEnd, ann.elbow)
      .setY(0)
      .normalize();
    const mesh = createTextMesh(ann.text, style.fontSize, style.color);
    if (!mesh) continue;
    // Offset by the text's half-extent in the extension direction so the near
    // edge of the label starts at textOffset — never overlapping the line.
    const size = new THREE.Box3().setFromObject(mesh).getSize(new THREE.Vector3());
    const halfExtent = Math.abs(extDir.x) * (size.x / 2) + Math.abs(extDir.z) * (size.z / 2);
    const g = new THREE.Group();
    g.layers.set(1);
    g.position.copy(ann.extensionEnd)
      .addScaledVector(extDir, style.textOffset + halfExtent)
      .setY(0.005);
    g.add(mesh);
    group.add(g);
  }
  updatePanel();
});

angleDims.onCommit.add((committed) => {
  for (const { item: dim, group } of committed) {
    const style    = angleDims.styles.get(dim.style) ?? angleDims.styles.get("default")!;
    const angleRad = OBC.computeAngle(dim);
    const text     = `${THREE.MathUtils.radToDeg(angleRad).toFixed(1)}°`;
    const bisector = OBC.computeBisectorAngle(dim);
    const radius   = dim.arcRadius + style.textOffset;
    const mesh = createTextMesh(text, style.fontSize, style.color);
    if (!mesh) continue;
    const g = new THREE.Group();
    g.layers.set(1);
    g.position.set(
      dim.vertex.x + Math.cos(bisector) * radius,
      0.005,
      dim.vertex.z + Math.sin(bisector) * radius,
    );
    g.add(mesh);
    group.add(g);
  }
  updatePanel();
});

/* MD
  ### 🎯 Hover highlight and shared utilities
  Linear dimensions and angle dimensions both snap to projection lines, so we add a
  highlight that follows the cursor and lights up whichever line is beneath it. We
  also set up the raycaster and two coordinate helpers that all three state machines
  share.
*/

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
  const normal = new THREE.Vector3(0, 1, 0).transformDirection(
    drawing.three.matrixWorld,
  );
  const origin = new THREE.Vector3().setFromMatrixPosition(
    drawing.three.matrixWorld,
  );
  _drawingPlane.setFromNormalAndCoplanarPoint(normal, origin);
  const worldPt = new THREE.Vector3();
  ray.intersectPlane(_drawingPlane, worldPt);
  return drawing.three.worldToLocal(worldPt);
};

const hoverGeo  = new THREE.BufferGeometry().setFromPoints([
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
  ### 📏 Linear dimensions
  The first click snaps to a projection line and locks the two measured endpoints.
  Moving the cursor then drags the dimension line along the perpendicular; a second
  click commits it at the current offset. Hovering before the first click shows which
  segment would be picked.
*/

type ActiveTool = "linear" | "leader" | "angle" | null;
let activeTool: ActiveTool = null;

const handleLinearMove = (
  _hit: OBC.DrawingIntersection | null,
  ray: THREE.Ray,
): void => {
  if (dims.machineState.kind === "positioningOffset") {
    dims.sendMachineEvent({ type: "MOUSE_MOVE", point: getDrawingPoint(ray) });
  }
};

const handleLinearClick = (
  hit: OBC.DrawingIntersection | null,
  ray: THREE.Ray,
): void => {
  if (dims.machineState.kind === "awaitingFirstPoint" && hit?.line) {
    dims.sendMachineEvent({ type: "SELECT_LINE", line: hit.line, drawing });
  } else if (dims.machineState.kind === "positioningOffset") {
    dims.sendMachineEvent({ type: "CLICK", point: getDrawingPoint(ray), drawing });
  }
};

/* MD
  ### 🏷️ Leader annotations
  Leaders are placed freely — no snapping needed. Three successive clicks set the
  arrow tip, the bend point, and the far end of the extension. After the third click
  the state machine enters a text-entry state; we listen to that transition and call
  the browser prompt immediately so the flow feels like one uninterrupted gesture.
*/

leaders.onMachineStateChanged.add((state: OBC.LeaderAnnotationState) => {
  if (state.kind !== "enteringText") return;
  const text = window.prompt("Label text:") ?? "";
  leaders.sendMachineEvent(
    text.trim()
      ? { type: "SUBMIT_TEXT", text: text.trim() }
      : { type: "ESCAPE" },
  );
});

const handleLeaderMove = (ray: THREE.Ray): void => {
  const s = leaders.machineState;
  if (s.kind === "placingElbow" || s.kind === "placingExtension") {
    leaders.sendMachineEvent({ type: "MOUSE_MOVE", point: getDrawingPoint(ray) });
  }
};

const handleLeaderClick = (ray: THREE.Ray): void => {
  const s = leaders.machineState;
  if (
    s.kind === "awaitingArrowTip" ||
    s.kind === "placingElbow"     ||
    s.kind === "placingExtension"
  ) {
    leaders.sendMachineEvent({ type: "CLICK", point: getDrawingPoint(ray), drawing });
  }
};

/* MD
  ### 📐 Angle dimensions
  Angle dimensions share the hover-and-snap mechanic with linear ones: two projection-
  line clicks define the two arms, and the system computes their intersection as the
  vertex automatically. After both lines are selected, moving the cursor sets the arc
  radius; a final click commits.
*/

const handleAngleMove = (
  hit: OBC.DrawingIntersection | null,
  ray: THREE.Ray,
): void => {
  const s = angleDims.machineState;
  if (s.kind === "awaitingFirstLine" || s.kind === "committed") return;
  angleDims.sendMachineEvent({
    type: "MOUSE_MOVE",
    point: getDrawingPoint(ray),
    line:  hit?.line ?? undefined,
  });
};

const handleAngleClick = (
  hit: OBC.DrawingIntersection | null,
  ray: THREE.Ray,
): void => {
  const s = angleDims.machineState;
  if (
    (s.kind === "awaitingFirstLine" || s.kind === "awaitingSecondLine") &&
    hit?.line
  ) {
    // Snap to the closest point on the hit line so the arm direction is exact.
    const snapped = new THREE.Vector3();
    hit.line.closestPointToPoint(hit.point, true, snapped);
    angleDims.sendMachineEvent({ type: "CLICK", point: snapped, line: hit.line, drawing });
  } else if (s.kind === "positioningArc") {
    angleDims.sendMachineEvent({ type: "CLICK", point: getDrawingPoint(ray), drawing });
  }
};

/* MD
  ### 🖱️ Wiring the event listeners
  A single set of DOM listeners drives all three systems. The active tool decides
  which handler gets each event, and Escape resets every system at once so there is
  never any ambiguous state left behind when the user switches tools.
*/

container.addEventListener("mousemove", (e) => {
  raycaster.setFromCamera(getNDC(e), world.camera.three);
  const hit = drawing.raycast(raycaster.ray);

  // Hover highlight — only relevant for the two systems that snap to lines.
  if (hit?.line && (activeTool === "linear" || activeTool === "angle")) {
    const pos = hoverGeo.attributes.position as THREE.BufferAttribute;
    pos.setXYZ(0, hit.line.start.x, 0.01, hit.line.start.z);
    pos.setXYZ(1, hit.line.end.x,   0.01, hit.line.end.z);
    pos.needsUpdate = true;
    hoverLine.visible = true;
  } else {
    hoverLine.visible = false;
  }

  if (activeTool === "linear") handleLinearMove(hit, raycaster.ray);
  if (activeTool === "leader") handleLeaderMove(raycaster.ray);
  if (activeTool === "angle")  handleAngleMove(hit, raycaster.ray);
});

container.addEventListener("mouseleave", () => { hoverLine.visible = false; });

container.addEventListener("click", (e) => {
  raycaster.setFromCamera(getNDC(e), world.camera.three);
  const hit = drawing.raycast(raycaster.ray);

  if (activeTool === "linear") handleLinearClick(hit, raycaster.ray);
  if (activeTool === "leader") handleLeaderClick(raycaster.ray);
  if (activeTool === "angle")  handleAngleClick(hit, raycaster.ray);
});

document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  dims.sendMachineEvent({ type: "ESCAPE" });
  leaders.sendMachineEvent({ type: "ESCAPE" });
  angleDims.sendMachineEvent({ type: "ESCAPE" });
  hoverLine.visible = false;
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
    <bim-panel active label="Annotation Systems" class="options-menu">

      <bim-panel-section label="Active Tool">
        <bim-dropdown label="Tool"
          @change=${(e: any) => {
            const val = e.target.value[0] as string;
            activeTool = (val || null) as ActiveTool;
            // Reset all systems when switching so no placement is left dangling.
            dims.sendMachineEvent({ type: "ESCAPE" });
            leaders.sendMachineEvent({ type: "ESCAPE" });
            angleDims.sendMachineEvent({ type: "ESCAPE" });
            hoverLine.visible = false;
          }}>
          <bim-option label="None"               value=""       ?checked=${!activeTool}></bim-option>
          <bim-option label="Linear Dimension"   value="linear" ?checked=${activeTool === "linear"}></bim-option>
          <bim-option label="Leader Annotation"  value="leader" ?checked=${activeTool === "leader"}></bim-option>
          <bim-option label="Angle Dimension"    value="angle"  ?checked=${activeTool === "angle"}></bim-option>
        </bim-dropdown>
      </bim-panel-section>

      <bim-panel-section label="Annotations">
        <bim-label>Linear: ${drawing.annotations.getBySystem(dims).size} · Leader: ${drawing.annotations.getBySystem(leaders).size} · Angle: ${drawing.annotations.getBySystem(angleDims).size}</bim-label>
        <bim-button label="Clear all"
          @click=${() => {
            dims.clear();
            leaders.clear();
            angleDims.clear();
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
  That's it! The routing pattern is the key takeaway: each system owns its state
  machine and the DOM events simply forward to whichever one is active. Adding a
  fourth system — built-in or custom — means registering it on the drawing and adding
  one branch to the dispatcher. Head to the next examples to learn about styles,
  custom systems, and model-driven annotations.
*/
