/* MD
  ## 🗂️ Multiple Drawing Viewports
  ---
  A technical drawing is just a group in 3D space that you can move, rotate,
  and scale freely. The interesting part is that you can define multiple *views*
  into the same drawing, each one an independent rectangle with its own scale
  and bounds.

  In this tutorial we'll create two viewports on a single drawing and render them into a
  dedicated paper-space canvas. The canvas never re-renders every frame; it only
  updates when annotation data actually changes. We'll also wire up direct
  dimensioning from the paper-space canvas itself, so you can place measurements
  without ever touching the 3D view. Let's see how it all fits together!

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

  Nothing special here — just a regular 3D scene setup. We'll keep the 3D canvas
  filling the entire viewport and float the paper-space panel over it in the
  bottom-left corner. That overlay approach keeps both views accessible at the
  same time without splitting the page.
*/

document.body.style.cssText = "margin:0; width:100vw; height:100vh; overflow:hidden; position:relative;";

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
container.style.cssText = "position:absolute; inset:0;";
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
  ### 📐 Creating the drawing and loading projection lines

  Here we create the drawing and load a set of pre-computed projection lines —
  wall outlines already flattened to drawing space. We register them for picking,
  which enables efficient raycasting against individual segments. We'll use that
  later to let the user click projection lines and place dimensions on them. The
  lines live on layer 1 so the viewport cameras pick them up in the paper-space
  render automatically.
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
  ### 🗂️ Creating the viewports

  Let's add two viewports to the drawing. Each one is defined by a bounding
  rectangle and a scale — the library handles the camera and anchors everything
  to the drawing, so both viewports move together if you ever reposition it in
  3D space.

  Here we frame two different areas of the same plan — a wider view and a smaller
  detail area. Both start at 1:100, but we'll let the user change each scale
  independently from the UI panel.
*/

const viewportA = drawing.viewports.create({
  left:   -0.996,
  right:  16.493,
  top:    -57.877,
  bottom: -64.375,
  scale:   100,
});

const viewportB = drawing.viewports.create({
  left:   -5.040,
  right:  -1.434,
  top:     0.568,
  bottom: -5.934,
  scale:   100,
});

/* MD
  Here's something really nice: each viewport comes with an optional helper that
  draws its boundary rectangle in the 3D view. Thanks to how rendering layers
  work, it shows up in the 3D perspective but never bleeds into the paper-space
  canvas — clean separation with zero extra effort!

  In this tutorial we'll make both helpers interactive. The user can drag the
  corner and edge handles to resize a viewport's bounds live, or drag the border
  itself to move the entire viewport. Every time the bounds change, the next
  paper-space render reflects the updated window automatically. Because the
  helpers have no browser dependencies, we forward pointer events to them
  manually — keeping the core library portable across environments.
*/

viewportA.helperVisible = true;
viewportB.helperVisible = true;
viewportA.helper.resizable = true;
viewportA.helper.movable = true;
viewportB.helper.resizable = true;
viewportB.helper.movable = true;

/* MD
  ### 📄 Paper-space renderer

  Here's the heart of this tutorial: a separate paper-space canvas that renders
  both viewports side by side. Each viewport gets its own independent region on
  the canvas, and since the viewport bounds already define exactly what each one
  should show, no additional camera setup is needed.

  The key design decision we're making here is that this canvas **never renders
  from the animation loop**. It only updates when annotation data actually changes.
  The 3D perspective view keeps updating every frame as usual, but the paper-space
  canvas stays still unless something meaningful happens — a great pattern for
  output-oriented views!

  We'll control the visual size of the panel with a scale constant — tweaking it
  zooms the entire panel without touching the drawing scales. The panel floats
  over the 3D view, and areas where no viewport is rendered stay transparent so
  the grid background shows through.
*/

// ── Floating paper-space panel ────────────────────────────────────────────
// Pixels per drawing unit in paper space. Changing this value zooms the
// entire paper panel in or out uniformly; it never affects the drawing scale.
const PPU = 40;
// Gap in CSS px between the two viewport regions.
const PAPER_GAP = 16;
// Padding around all viewports inside the paper panel.
const PAPER_PAD = 20;

const paperWrapper = document.createElement("div");
paperWrapper.style.cssText = `
  position: absolute;
  bottom: 24px;
  left: 24px;
  background-color: #e8e8e8;
  background-image:
    linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px);
  background-size: ${PPU}px ${PPU}px;
  border: 2px solid #888;
  border-radius: 4px;
  overflow: hidden;
`;

const paperCanvas = document.createElement("canvas");
paperCanvas.style.cssText = "position:absolute; top:0; left:0; display:block;";

/* MD
  One of the nicest things about viewports is that you can export each one to
  DXF independently. Pass a viewport to the exporter and it automatically clips
  the geometry to that viewport's bounds and normalises the coordinates — the
  exported file reflects exactly what's visible in that view. Resize a viewport
  and the next export reflects the new bounds automatically. Very handy!
*/

const dxfExporter = components.get(OBC.DxfManager).exporter;

const exportViewport = (viewport: OBC.DrawingViewport, filename: string) => {
  const dxf  = dxfExporter.export([{ drawing, viewports: [{ viewport }] }]);
  const blob = new Blob([dxf], { type: "application/dxf" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
};

/* MD
  Let's add a simple selection interaction: clicking a viewport in the paper
  panel selects it, and the side panel then shows controls for that viewport —
  like changing its scale or exporting it to DXF. We add a thin border overlay
  over each rendered region that doubles as the visual outline and the click
  target. Nothing fancy, but it makes the whole thing feel interactive!
*/

// ── Viewport selection state ──────────────────────────────────────────────
type ViewportEntry = { id: string; viewport: OBC.DrawingViewport; borderEl: HTMLElement };
const viewportEntries: ViewportEntry[] = [];

let selectedViewport: OBC.DrawingViewport | null = null;
let selectedId = "";
let editingViewport: OBC.DrawingViewport | null = null;

const selectViewport = (viewport: OBC.DrawingViewport) => {
  const entry = viewportEntries.find(e => e.viewport === viewport);
  if (!entry) return;
  selectedViewport = viewport;
  selectedId = entry.id;
  for (const e of viewportEntries) {
    e.borderEl.style.border = `1.5px solid ${e.viewport === viewport ? "#0055ff" : "#000"}`;
  }
  updatePanel();
};

// ── Border divs (outline + click to select) ───────────────────────────────
const makeViewportBorderEl = (id: string, viewport: OBC.DrawingViewport) => {
  const el = document.createElement("div");
  el.style.cssText = `
    position: absolute;
    box-sizing: border-box;
    border: 1.5px solid #000;
    cursor: pointer;
    pointer-events: auto;
    user-select: none;
  `;
  const tag = document.createElement("span");
  tag.textContent = id;
  tag.style.cssText = `
    position: absolute;
    top: 3px; left: 4px;
    font: 10px/1 monospace;
    color: #000;
    background: rgba(255,255,255,0.75);
    padding: 1px 4px;
    border-radius: 2px;
    pointer-events: none;
  `;
  el.appendChild(tag);
  // stopPropagation prevents the click from reaching the 3D container listener
  // below, which would otherwise interpret it as a dimension placement event.
  el.addEventListener("click", (e) => { e.stopPropagation(); selectViewport(viewport); });

  // Expose tag so renderPaperSpace can update the scale label.
  (el as any)._tag = tag;
  return el;
};

const borderElA = makeViewportBorderEl("A", viewportA);
const borderElB = makeViewportBorderEl("B", viewportB);
viewportEntries.push(
  { id: "A", viewport: viewportA, borderEl: borderElA },
  { id: "B", viewport: viewportB, borderEl: borderElB },
);

paperWrapper.append(paperCanvas, borderElA, borderElB);
document.body.append(paperWrapper);

/* MD
  Here's the render function. Each time it's called, it recomputes the canvas
  size to fit both viewports side by side at their current scales, then renders
  each one into its region. It also repositions the clickable overlays and
  refreshes the scale labels so they stay in sync with what's on screen.
*/

// Black crosshair SVG cursor used in edit mode.
const CROSSHAIR_CURSOR = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20'%3E%3Cline x1='10' y1='0' x2='10' y2='8' stroke='black' stroke-width='1.5'/%3E%3Cline x1='10' y1='12' x2='10' y2='20' stroke='black' stroke-width='1.5'/%3E%3Cline x1='0' y1='10' x2='8' y2='10' stroke='black' stroke-width='1.5'/%3E%3Cline x1='12' y1='10' x2='20' y2='10' stroke='black' stroke-width='1.5'/%3E%3C/svg%3E") 10 10, crosshair`;

// alpha:true so transparent areas of the canvas let the CSS grid show through.
const paperRenderer = new THREE.WebGLRenderer({ canvas: paperCanvas, antialias: true, alpha: true });

// Pixel-space bounds of each viewport in the paper canvas (CSS pixels, updated every render).
const paperRegions = new Map<OBC.DrawingViewport, { x: number; y: number; w: number; h: number }>();
// Disable autoclear so we can render multiple viewports in one frame using scissor regions
// and clear each region manually with a different background colour.
paperRenderer.autoClear = false;

function renderPaperSpace() {
  // Physical pixels per CSS pixel — needed for sharp rendering on high-DPI screens.
  const dpr = window.devicePixelRatio;

  // Per-viewport CSS pixel dimensions. Base PPU is calibrated at 1:100;
  // scaling by 100/drawingScale keeps physical size consistent across scales.
  const vpDims = viewportEntries.map(({ viewport }) => {
    const ppu = (PPU * 100) / viewport.drawingScale;
    return {
      w: Math.round((viewport.right  - viewport.left)   * ppu),
      h: Math.round((viewport.top    - viewport.bottom) * ppu),
    };
  });

  const totalW = vpDims.reduce((s, d, i) => s + d.w + (i > 0 ? PAPER_GAP : 0), 0) + 2 * PAPER_PAD;
  const totalH = Math.max(...vpDims.map(d => d.h)) + 2 * PAPER_PAD;

  paperWrapper.style.width  = `${totalW}px`;
  paperWrapper.style.height = `${totalH}px`;

  paperRenderer.setPixelRatio(dpr);
  paperRenderer.setSize(totalW, totalH);

  // WebGL scissor/viewport calls use physical pixels, not CSS pixels.
  // We round to integers to prevent subpixel misalignment between adjacent regions.
  const W    = Math.round(totalW   * dpr);
  const H    = Math.round(totalH   * dpr);
  const padD = Math.round(PAPER_PAD * dpr);

  paperRenderer.setScissorTest(true);

  // Clear full canvas to transparent so CSS grid shows through.
  paperRenderer.setClearColor(0x000000, 0);
  paperRenderer.setViewport(0, 0, W, H);
  paperRenderer.setScissor(0, 0, W, H);
  paperRenderer.clear();

  // Each viewport gets an opaque white background then its scene render.
  paperRenderer.setClearColor(0xffffff, 1);

  let xOffset = PAPER_PAD;
  for (let i = 0; i < viewportEntries.length; i++) {
    const { id, viewport, borderEl } = viewportEntries[i];
    const { w, h } = vpDims[i];
    const wd = Math.round(w * dpr);
    const hd = Math.round(h * dpr);
    const xd = Math.round(xOffset * dpr);

    paperRenderer.setViewport(xd, H - padD - hd, wd, hd);
    paperRenderer.setScissor(xd, H - padD - hd, wd, hd);
    paperRenderer.clear();
    paperRenderer.render(world.scene.three, viewport.camera);

    paperRegions.set(viewport, { x: xOffset, y: PAPER_PAD, w, h });

    (borderEl as any)._tag.textContent = `${id} — 1:${viewport.drawingScale}`;
    borderEl.style.left   = `${xOffset}px`;
    borderEl.style.top    = `${PAPER_PAD}px`;
    borderEl.style.width  = `${w}px`;
    borderEl.style.height = `${h}px`;

    xOffset += w + PAPER_GAP;
  }

  paperRenderer.setScissorTest(false);
}

/* MD
  ### 📏 Annotation system and text rendering

  In this tutorial we'll use a linear dimensions system to give the paper-space
  canvas something meaningful to display and to demonstrate the event-driven
  render pattern. Worth noting: text rendering is intentionally left to your app —
  the system stores the measurement data and fires events, but how you visualise
  the labels is entirely up to you. That keeps the core library free of DOM and
  font dependencies, so it works the same in Node.js and the browser.

  We'll load a TTF font once up front and reuse it whenever a dimension is
  committed.
*/

const dims = techDrawings.use(OBC.LinearAnnotations);
dims.styles.get("default")!.textOffset = 0.3;

const ttfLoader = new TTFLoader();
const font: Font = await new Promise((resolve) => {
  ttfLoader.load("https://thatopen.github.io/engine_components/resources/fonts/PlusJakartaSans-Medium.ttf", (ttf: any) => {
    resolve(new Font(ttf));
  });
});

/* MD
  When a dimension is committed, we create a text label from the measured
  distance and attach it to the annotation so it moves and disappears together
  with it — no extra bookkeeping needed. We also kick off a paper-space re-render
  so the canvas immediately reflects the new annotation.
*/

// Forward reference — onCommit calls updatePanel() but BUI.Component.create()
// comes later. It starts as a no-op and gets reassigned after the panel is built.
let updatePanel = () => {};
dims.onCommit.add((committed) => {
  for (const { item: dim, group } of committed) {
    const style = dims.styles.get(dim.style) ?? dims.styles.get("default")!;
    const text  = `${dim.pointA.distanceTo(dim.pointB).toFixed(2)} m`;
    const shapes = font.generateShapes(text, style.fontSize);
    const geo    = new THREE.ShapeGeometry(shapes);
    const mesh   = new THREE.Mesh(
      geo,
      new THREE.MeshBasicMaterial({ color: style.color, side: THREE.DoubleSide }),
    );
    // ShapeGeometry is built in the XY plane; rotating -90° around X maps it to
    // the XZ drawing plane so it lies flat on the ground alongside the other geometry.
    mesh.rotation.x = -Math.PI / 2;
    mesh.layers.set(1);
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
  renderPaperSpace();
  updatePanel();
});

dims.onDelete.add(() => { renderPaperSpace(); updatePanel(); });

/* MD
  ### 🔵 Pre-populated dimensions

  Let's seed a few dimensions at startup so the viewports show something right
  away — it's much easier to understand the paper-space layout when there's
  actual annotation data to look at.
*/

dims.add(drawing, { pointA: new THREE.Vector3(-3.054, 0.000, -0.347), pointB: new THREE.Vector3(-3.054, 0.000, 5.754), offset: 0.6, style: "default" });
dims.add(drawing, { pointA: new THREE.Vector3(-0.378, 0.000, 61.239), pointB: new THREE.Vector3(2.260, 0.000, 61.239), offset: 0.2, style: "default" });
dims.add(drawing, { pointA: new THREE.Vector3(2.260, 0.000, 61.239), pointB: new THREE.Vector3(5.000, 0.000, 61.239), offset: 0.2, style: "default" });
dims.add(drawing, { pointA: new THREE.Vector3(5.000, 0.000, 61.239), pointB: new THREE.Vector3(7.740, 0.000, 61.239), offset: 0.2, style: "default" });
dims.add(drawing, { pointA: new THREE.Vector3(7.740, 0.000, 61.239), pointB: new THREE.Vector3(10.480, 0.000, 61.239), offset: 0.2, style: "default" });
dims.add(drawing, { pointA: new THREE.Vector3(10.480, 0.000, 61.239), pointB: new THREE.Vector3(13.220, 0.000, 61.239), offset: 0.2, style: "default" });
dims.add(drawing, { pointA: new THREE.Vector3(13.220, 0.000, 61.239), pointB: new THREE.Vector3(15.960, 0.000, 61.239), offset: 0.2, style: "default" });

renderPaperSpace();

/* MD
  ### 🖱️ Interactive placement

  Now let's wire up the interactions on the 3D canvas. Two things share the same
  pointer events here: viewport manipulation (moving and resizing bounds) and
  dimension placement from the 3D view. We give priority to the viewport helper
  — if it has an active operation in progress, dimension placement is suppressed
  until the operation completes.
*/

const hoverGeo  = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]);
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

const anyHelperDragging = () => viewportEntries.some(e => e.viewport.helper.isDragging);


container.addEventListener("mousemove", (e) => {
  raycaster.setFromCamera(getNDC(e), world.camera.three);
  const ray = raycaster.ray;

  // Always forward to helpers: hover detection + live bound updates.
  for (const { viewport } of viewportEntries) viewport.helper.onPointerMove(ray);

  // While a helper operation is active, keep paper space in sync and skip
  // dimension-related logic.
  if (anyHelperDragging()) {
    renderPaperSpace();
    return;
  }

  const hit = drawing.raycast(ray);
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
    dims.sendMachineEvent({ type: "MOUSE_MOVE", point: getDrawingPoint(ray) });
  }
});

container.addEventListener("mouseleave", () => { hoverLine.visible = false; });

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (creatingViewport) { creatingViewport = false; updatePanel(); return; }
    for (const { viewport } of viewportEntries) viewport.helper.onPointerUp();
    if (editingViewport && dims.machineState.kind === "awaitingFirstPoint") {
      // No dimension in progress — exit edit mode.
      exitEditMode();
    } else {
      // Dimension in progress — cancel it but stay in edit mode.
      dims.sendMachineEvent({ type: "ESCAPE" });
      hoverLine.visible = false;
      renderPaperSpace();
    }
  }
});

container.addEventListener("click", (e) => {
  raycaster.setFromCamera(getNDC(e), world.camera.three);
  const ray = raycaster.ray;

  // ── Viewport helper: click–move–click model ───────────────────────────
  // Second click while a helper operation is active → confirm.
  if (anyHelperDragging()) {
    for (const { viewport } of viewportEntries) viewport.helper.onPointerUp();
    renderPaperSpace();
    return;
  }
  // First click → try to start a helper operation on any viewport.
  for (const { viewport } of viewportEntries) viewport.helper.onPointerDown(ray);
  if (anyHelperDragging()) return; // helper consumed the click

  // ── New viewport creation ─────────────────────────────────────────────
  if (creatingViewport) {
    addNewViewport(getDrawingPoint(ray));
    creatingViewport = false;
    updatePanel();
    return;
  }

  // ── Dimension placement ───────────────────────────────────────────────
  const hit = drawing.raycast(ray);
  if (dims.machineState.kind === "awaitingFirstPoint" && hit?.line) {
    dims.sendMachineEvent({ type: "SELECT_LINE", line: hit.line, drawing });
    return;
  }
  if (dims.machineState.kind === "positioningOffset") {
    dims.sendMachineEvent({ type: "CLICK", point: getDrawingPoint(ray), drawing });
  }
});

/* MD
  ### 📏 Dimensioning directly in paper space

  One of the most useful things we can add is the ability to place dimensions
  directly from the paper-space canvas — without having to switch back to the 3D
  view. The key insight is that a viewport's camera is already a fully valid
  camera for raycasting: pointing a ray from it at the drawing plane gives exactly
  the same drawing-local coordinates that the 3D view would produce. So all the
  snapping, state machine, and geometry logic works identically — the only
  difference is where the ray originates.

  To avoid conflicts with the single-click selection, we use a two-mode approach:
  a single click selects a viewport, and a double-click activates edit mode for
  it. While edit mode is active, pointer events on that viewport's overlay are
  transparent, so clicks reach the paper canvas beneath and drive the dimension
  state machine directly. Pressing Escape cancels any dimension in progress; a
  second Escape exits edit mode entirely. Clicking any viewport border also exits
  edit mode.
*/

// ── Paper-space edit mode ─────────────────────────────────────────────────
// Double-clicking a viewport border enters edit mode: pointer-events on that
// border div are disabled so subsequent clicks reach the paper canvas below.
const enterEditMode = (vp: OBC.DrawingViewport, el: HTMLElement) => {
  // Reset all border divs first in case one was already transparent to events.
  for (const e of viewportEntries) e.borderEl.style.pointerEvents = "auto";
  selectViewport(vp);
  editingViewport = vp;
  el.style.pointerEvents = "none";
  el.style.border = "1.5px dashed #0055ff";
  paperCanvas.style.cursor = CROSSHAIR_CURSOR;
  updatePanel();
};

const exitEditMode = () => {
  if (!editingViewport) return;
  editingViewport = null;
  for (const e of viewportEntries) {
    e.borderEl.style.pointerEvents = "auto";
    e.borderEl.style.border = `1.5px solid ${e.viewport === selectedViewport ? "#0055ff" : "#000"}`;
  }
  paperCanvas.style.cursor = "";
  hoverLine.visible = false;
  renderPaperSpace();
  updatePanel();
};

// A single click on any viewport border exits edit mode (and cancels any dimension
// in progress). Double-click is the only way to enter edit mode.
const leaveEditOnClick = () => {
  if (!editingViewport) return;
  dims.sendMachineEvent({ type: "ESCAPE" });
  hoverLine.visible = false;
  exitEditMode();
};

for (const { viewport, borderEl } of viewportEntries) {
  borderEl.addEventListener("dblclick", (e) => { e.stopPropagation(); enterEditMode(viewport, borderEl); });
  borderEl.addEventListener("click", leaveEditOnClick);
}

// ── Viewport creation mode ────────────────────────────────────────────────
// vpCounter starts after A and B so the first new viewport gets label C.
let creatingViewport = false;
let vpCounter = viewportEntries.length;

const addNewViewport = (center: THREE.Vector3) => {
  const R = 2.5;
  // top/bottom use negated drawing-Z: the viewport camera looks down with up = -Z,
  // so more negative Z in drawing space = higher on paper = larger top value.
  const vp = drawing.viewports.create({
    left:   center.x - R, right:  center.x + R,
    top:   -center.z + R, bottom: -center.z - R,
    scale: 100,
  });
  vp.helperVisible = true;
  vp.helper.resizable = true;
  vp.helper.movable = true;
  const label = String.fromCharCode(65 + vpCounter % 26) + (vpCounter >= 26 ? String(Math.floor(vpCounter / 26)) : "");
  vpCounter++;
  const borderEl = makeViewportBorderEl(label, vp);
  paperWrapper.appendChild(borderEl);
  const entry: ViewportEntry = { id: label, viewport: vp, borderEl };
  viewportEntries.push(entry);
  borderEl.addEventListener("dblclick", (e2) => { e2.stopPropagation(); enterEditMode(vp, borderEl); });
  borderEl.addEventListener("click", leaveEditOnClick);
  renderPaperSpace();
};

// ── Paper-space dimensioning ──────────────────────────────────────────────
// Resolves which viewport (if any) the cursor is over and returns a ray from
// that viewport's orthographic camera. Everything downstream (raycast, snap,
// getDrawingPoint) works identically to the 3D-canvas path.
const getPaperRay = (e: MouseEvent): { ray: THREE.Ray; viewport: OBC.DrawingViewport } | null => {
  const rect = paperCanvas.getBoundingClientRect();
  const cx = e.clientX - rect.left;
  const cy = e.clientY - rect.top;

  for (const { viewport: vp } of viewportEntries) {
    const r = paperRegions.get(vp);
    if (!r || cx < r.x || cx > r.x + r.w || cy < r.y || cy > r.y + r.h) continue;
    raycaster.setFromCamera(
      new THREE.Vector2(
        ((cx - r.x) / r.w) * 2 - 1,
        -((cy - r.y) / r.h) * 2 + 1,
      ),
      vp.camera,
    );
    return { ray: raycaster.ray, viewport: vp };
  }
  return null;
};

paperCanvas.addEventListener("mousemove", (e) => {
  const result = getPaperRay(e);
  if (!result) { hoverLine.visible = false; return; }

  const hit = drawing.raycast(result.ray, result.viewport);
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
    dims.sendMachineEvent({ type: "MOUSE_MOVE", point: getDrawingPoint(result.ray) });
  }

  renderPaperSpace();
});

paperCanvas.addEventListener("mouseleave", () => { hoverLine.visible = false; });

paperCanvas.addEventListener("click", (e) => {
  const result = getPaperRay(e);
  if (!result) return;

  const hit = drawing.raycast(result.ray, result.viewport);
  if (dims.machineState.kind === "awaitingFirstPoint" && hit?.line) {
    dims.sendMachineEvent({ type: "SELECT_LINE", line: hit.line, drawing });
    return;
  }
  if (dims.machineState.kind === "positioningOffset") {
    dims.sendMachineEvent({ type: "CLICK", point: getDrawingPoint(result.ray), drawing });
  }
});

/* MD
  ### 🧩 Adding some UI (optional but recommended)
  We will use the `@thatopen/ui` library to add some simple and cool UI elements to
  our app. For more information about the UI library, you can check the specific
  documentation for it!
*/

BUI.Manager.init();

const [panel, _updatePanel] = BUI.Component.create<
  BUI.PanelSection,
  Record<string, never>
>(
  (_) => BUI.html`
    <bim-panel active label="Multiple Viewports" class="options-menu" style="max-width: 20rem;">

      <bim-panel-section label="Viewports">
        ${creatingViewport ? BUI.html`
          <bim-label style="white-space: normal;">Click anywhere on the drawing to place a 5 m viewport. Press Esc to cancel.</bim-label>
          <bim-button label="Cancel"
            @click=${() => { creatingViewport = false; updatePanel(); }}>
          </bim-button>
        ` : BUI.html`
          <bim-button label="Add Viewport"
            @click=${() => { creatingViewport = true; updatePanel(); }}>
          </bim-button>
        `}
      </bim-panel-section>

      <bim-panel-section label="Linear Dimensions">
        ${editingViewport ? BUI.html`
          <bim-label style="white-space: normal;">Hover a projection line and click to anchor the first point, then click to set the offset. Press Esc to cancel a dimension in progress, or Esc again to exit edit mode.</bim-label>
        ` : BUI.html`
          <bim-label style="white-space: normal;">Double-click a viewport to enter edit mode and start placing dimensions.</bim-label>
        `}
        <bim-label style="white-space: normal;">Committed: ${dims.get([drawing]).size}</bim-label>
        <bim-button label="Clear all"
          @click=${() => { dims.clear([drawing]); renderPaperSpace(); updatePanel(); }}>
        </bim-button>
      </bim-panel-section>

      <bim-panel-section label="Viewport">
        ${selectedViewport ? BUI.html`
          <bim-label style="white-space: normal;">Click: select · Double-click: edit mode</bim-label>
          <bim-label style="white-space: normal;">Viewport ${selectedId} — 1:${selectedViewport.drawingScale}</bim-label>
          <bim-dropdown
            label="Scale"
            @change=${(e: Event) => {
              const val = (e.target as BUI.Dropdown).value as string[];
              if (!val.length) return;
              selectedViewport!.drawingScale = parseInt(val[0], 10);
              renderPaperSpace();
              updatePanel();
            }}>
            ${[50, 100, 200].map((s) => BUI.html`
              <bim-option
                label="1:${s}"
                value="${s}"
                ?checked=${s === selectedViewport!.drawingScale}>
              </bim-option>
            `)}
          </bim-dropdown>
          <bim-button label="Export DXF"
            @click=${() => exportViewport(selectedViewport!, `viewport-${selectedId.toLowerCase()}.dxf`)}>
          </bim-button>
        ` : BUI.html`
          <bim-label style="white-space: normal;">Click a viewport to select it · Double-click to edit</bim-label>
        `}
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
  That's it! You now know how to host multiple viewports on a single drawing,
  render them into a shared event-driven canvas, let users resize and reposition
  viewport bounds interactively, place dimensions directly from paper space, and
  export each view to DXF independently. The key takeaway is that the library
  handles all the spatial logic with no browser dependencies — your app just
  decides how to display and interact with it. Pretty powerful combination!
*/
