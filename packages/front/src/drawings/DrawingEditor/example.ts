/* MD
  ## 🖊️ Drawing Editor
  ---
  The core TechnicalDrawings setup requires writing coordinate plumbing by hand — converting mouse positions to drawing-space, maintaining a hover highlight, forwarding events to state machines step by step. That code says nothing about annotations; it's just infrastructure to make clicks land in the right place.

  The DrawingEditor absorbs that entire interaction pipeline. You register a world, pick a tool, and click — snapping, hover feedback, and coordinate conversion are handled automatically.

  This tutorial covers projecting BIM model edges onto a drawing with visible and hidden layers; loading a font and setting up the editor with a 3D world as input source; activating linear dimension, angle dimension, and callout annotation tools with a single setter; configuring annotation styles (color, font size, tick shapes — diagonal, arrow, dot, filled arrow, filled circle — and callout enclosures — cloud, rectangle, circle); setting up a SheetBoard with a PaperSpace element for paper-space rendering; entering paper-space edit mode by double-clicking a viewport so input routes through the viewport camera; advancing placement state with a single `editor.step()` call; handling Escape to cancel, exit paper space, or deactivate the tool; toggling layer visibility; and exporting individual viewports or the full sheet to DXF.

  By the end, you'll have a fully interactive annotation setup — snapping, hover, label rendering, configurable styles, paper-space editing, and DXF export — in a fraction of the code the core tutorial requires.

  ### 🖖 Importing our Libraries
  First, let's install all necessary dependencies to make this example work:
*/

import * as THREE from "three";
import Stats from "stats.js";
import * as BUI from "@thatopen/ui";
import * as CUI from "@thatopen/ui-obc";
import * as OBC from "@thatopen/components";
// You have to import * as OBF from "@thatopen/components-front"
import * as OBF from "../../index.ts";

BUI.Manager.init();
CUI.Manager.init();

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
  drawing spatial context: the projection lines we'll add come from its wall outlines.
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
  // Tell fragments which clipping planes are active for this model
  // so the worker skips processing of clipped items entirely.
  model.getClippingPlanesEvent = () => {
    return Array.from(world.renderer!.three.clippingPlanes) || [];
  };
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
const model = await fragments.core.load(arqBuffer, { modelId: "school_arq" });

/* MD
  ### 📐 Creating a TechnicalDrawing
  The drawing setup matches the core tutorial exactly: a group anchored in 3D space,
  fed a pre-computed set of projection lines from the model. Registering those lines
  through the drawing rather than directly to the scene is what enables BVH-accelerated
  raycasting — the mechanism that makes snapping to individual segments fast and
  precise even on dense geometry.
*/

const techDrawings = components.get(OBC.TechnicalDrawings);
// The drawing is created in the hidden world so the SheetBoard can render it
// through its own WebGL renderer. The main world stays clean for the BIM model.
const drawing = techDrawings.create(world);
// Orient the drawing as a top-down floor plan: local -Y points toward world -Y
// so the drawing projects straight down onto its horizontal XZ plane.
drawing.orientTo(new THREE.Vector3(0, -1, 0));
// Place the drawing plane at the cut elevation (~1.2 m above the floor) and
// capture everything within the next 4 m below it (one-floor depth).
drawing.three.position.set(0, 1.2, 0);

drawing.far = 4;

drawing.layers.create("Visible",     { material: new THREE.LineBasicMaterial({ color: 0x000000 }) });
drawing.layers.create("Hidden",      { material: new THREE.LineDashedMaterial({ color: 0x888888, dashSize: 0.2, gapSize: 0.1 }), visible: false });
drawing.layers.create("Annotations", { material: new THREE.LineBasicMaterial({ color: 0x000000 }) });
drawing.activeLayer = "Annotations";

const viewport = drawing.viewports.create({ left: -25, right: 25, top: 15, bottom: -15, scale: 100, name: "Floor Plan" });

/* MD
  ### 🔭 Projecting model edges onto the drawing
  With the layers defined, we can generate the 2D edge projection directly from the
  loaded model — no pre-baked JSON files involved. The drawing already knows its own
  world, so all we provide is the set of items to project and which layers to put the
  results on. The projection direction is inferred automatically from the drawing's
  current orientation, and the capture volume is bounded by `drawing.far`.

  We trigger this from a button in the panel so you can reproject after repositioning
  the drawing — useful for checking how a different orientation or depth setting
  changes the output.
*/

const clipper = components.get(OBC.Clipper);
clipper.enabled = true;

let sectionClipId: string | null = null;
let projected = false;

async function projectFromModel(button: BUI.Button) {
  const target = editor.activeDrawing;
  if (!target) return;
  button.loading = true
  updatePanel();

  // Remove the previous section plane before creating a new one.
  if (sectionClipId) {
    await clipper.delete(world, sectionClipId);
    sectionClipId = null;
  }

  const ids = await model.getItemsIdsWithGeometry();
  if (ids.length > 0) {
    const modelIdMap: OBC.ModelIdMap = { [model.modelId]: new Set(ids) };
    await target.addProjectionFromItems(modelIdMap, {
      layers: { visible: "Visible", hidden: "Hidden" }
    });
  }

  // Clip everything above the drawing plane so only what was projected is visible.
  target.three.updateWorldMatrix(true, false);
  const clipNormal = new THREE.Vector3(0, -1, 0)
    .transformDirection(target.three.matrixWorld)
    .normalize();
  // Offset slightly opposite to the projection direction so the drawing lines
  // sit clearly inside the kept half-space and don't z-fight with the clip plane.
  const clipPoint = new THREE.Vector3()
    .setFromMatrixPosition(target.three.matrixWorld)
    .addScaledVector(clipNormal, -0.05);
  sectionClipId = clipper.createFromNormalAndCoplanarPoint(world, clipNormal, clipPoint);
  const plane = clipper.list.get(sectionClipId);
  if (plane) plane.visible = false;

  projected = true;
  updatePanel();
  board.requestRender();
  button.loading = false;
}

/* MD
  ### 🖊️ Setting up the Drawing Editor
  In the core tutorial this was the long part: building a hover highlight mesh,
  computing normalized device coordinates on every mouse move, projecting rays onto
  the drawing plane, and manually advancing the state machine. That code said nothing
  about annotations — it was pure coordinate plumbing.

  Here we load a font for the label renderer, set the active drawing, and register
  the world. Those three lines replace the entire interaction pipeline. From this
  point on, snap detection, hover feedback, and coordinate conversion are the
  editor's responsibility — ours is just to decide which tool is active and what
  clicking means.
*/

const editor = components.get(OBF.DrawingEditor);
await editor.fonts.load("https://thatopen.github.io/engine_components/resources/fonts/PlusJakartaSans-Medium.ttf");

editor.onStateChanged.add((key) => {
  if (key.includes("activeDrawing")) updatePanel();
});

editor.setSource(world);

/* MD
  ### 🔌 Getting tools
  Each annotation type has a tool singleton on the editor, retrieved via `use()`.
  Beyond routing pointer events, each tool subscribes to its system's `onCommit`,
  `onDelete`, and `onUpdate` events — so labels are created, updated, and removed
  automatically without any per-annotation wiring on our side.

  The five systems each ship with a single `"default"` style. In this tutorial we
  extend them with a full set of named styles — one per tick variant — so the style
  dropdown in the UI controls exactly which tick shape gets applied to new annotations.
  Styles with a line tick leave `meshTick` undefined; styles with a mesh tick set
  `lineTick` to `NoTick` so the two are never combined in the same annotation. Two
  extra styles vary only the font size to show how text scale affects readability.
*/

const dimTool     = editor.use(OBF.LinearAnnotationsTool);
const angleTool   = editor.use(OBF.AngleAnnotationsTool);
const calloutTool = editor.use(OBF.CalloutAnnotationsTool);

// The callout tool fires onEnterText when the state machine pauses for user input —
// either for a brand-new annotation or when the text handle of a selected one is clicked.
// Here we use a simple prompt; a real app would render a floating input instead.
calloutTool.onEnterText.add(({ isEdit, currentText }) => {
  setTimeout(() => {
    const label = isEdit ? "Editar texto:" : "Texto del callout:";
    const text = prompt(label, currentText) ?? (isEdit ? currentText : "Label");
    calloutTool.submitText(text);
  }, 0);
});

// Forward reference — event handlers call updatePanel() but BUI.Component.create()
// comes later. Starts as a no-op and gets reassigned after the panel is built.
let updatePanel = () => {};

dimTool.system.onMachineStateChanged.add(() => { updatePanel(); board.requestRender(); });

angleTool.system.onMachineStateChanged.add(() => { updatePanel(); board.requestRender(); });

/* MD
  The style `DataMap` on each system maps a name to a style object that drives all
  visual parameters: tick shape, tick size, font size, color, and unit. Each
  annotation stores only the style name, so changing a style object later updates
  every annotation that references it without touching the stored data. `activeStyle`
  controls which style new annotations pick up at placement time.
*/

dimTool.system.styles.set("default",     { color: 0xe13333, fontSize: 0.3, textOffset: 0.4, tickSize: 0.25, extensionGap: 0.05, extensionOvershoot: 0.2, unit: OBC.Units.m,  lineTick: OBC.NoTick,  meshTick: OBC.FilledCircleTick });
angleTool.system.styles.set("default",   { color: 0xe13333, fontSize: 0.3, textOffset: 0.5, tickSize: 0.25,                     extensionGap: 0.05,                        lineTick: OBC.NoTick,  meshTick: OBC.FilledArrowTick  });
calloutTool.system.styles.set("default", { color: 0xe13333, fontSize: 0.3, textOffset: 0.1, tickSize: 0.25, enclosure: OBC.CloudEnclosure,                                  meshTick: OBC.FilledArrowTick  });

/* MD
  ### 📄 Setting up the SheetBoard
  Alongside the 3D view, a SheetBoard renders the same drawing in paper space — a
  fixed-scale, print-ready projection with a title block around it. The board needs
  a reference to `components` so it can reach the annotation systems when rendering.
  A single `PaperSpace` element acts as the sheet: its title block template is just a
  thin border that frames the drawing area without any extra metadata.
*/

const board = document.getElementById("board") as CUI.SheetBoard;
board.components = components;

const paper = document.getElementById("paper") as BUI.PaperSpace;
paper.sheetNumber = "A-01";
paper.titleBlockTemplate = (mm, drawingArea) => BUI.html`
  <div style="width:100%;height:100%;border:${mm(0.7)} solid #222;overflow:hidden;">${drawingArea}</div>
`;

board.addViewport(paper, drawing.uuid, viewport.uuid, { x: 30, y: 20 });

// Re-render the board whenever drawing content changes.
editor.onDrawingMouseMove.add(() => board.requestRender());
dimTool.system.onCommit.add(() => board.requestRender());
dimTool.system.onDelete.add(() => board.requestRender());
angleTool.system.onCommit.add(() => board.requestRender());
angleTool.system.onDelete.add(() => board.requestRender());
calloutTool.system.onCommit.add(() => board.requestRender());
calloutTool.system.onDelete.add(() => board.requestRender());

/* MD
  ### 🖱️ Handling clicks and switching tools
  The editor monitors the cursor automatically once the world is registered. A single
  `editor.step()` call dispatches the current cursor position to whichever tool is
  active — no per-tool wiring needed on our side.

  Swapping between annotation types is a single setter assignment. The editor
  deactivates the previous tool, cancels any in-progress placement, and activates
  the new one — no teardown needed.
*/

type ActiveTool = "linear" | "angle" | "callout" | null;
let activeTool: ActiveTool = null;

function setActiveTool(key: ActiveTool) {
  activeTool = key;
  editor.activeTool =
    key === "linear"   ? OBF.LinearAnnotationsTool      :
    key === "angle"    ? OBF.AngleAnnotationsTool        :
    key === "callout"  ? OBF.CalloutAnnotationsTool     :
    null;
  updatePanel();
}

/* MD
  ### 📐 Annotating from paper space
  Double-clicking a viewport in the SheetBoard enters paper-space edit mode:
  the editor switches its input surface from the 3D canvas to the viewport
  element on the board, so pointer events are converted to drawing coordinates
  through the viewport's orthographic camera rather than the perspective one.
  The same tool that is active in the panel is used — no mode-specific setup
  needed. Pressing Escape exits paper-space mode and returns input to the 3D
  canvas automatically.
*/

let paperEditMode = false;
let activeVpEl: HTMLElement | null = null;

function exitPaperMode() {
  editor.cancel();
  if (activeVpEl) {
    editor.clearSource(activeVpEl);
    activeVpEl = null;
  }
  editor.setSource(world);
  board.exitEditMode();
  board.requestRender();
  paperEditMode = false;
  updatePanel();
}

// Double-click a viewport border → enter paper-space edit mode.
board.addEventListener("viewportactivate", (e) => {
  const { drawingId, viewportId } = (e as CustomEvent<{ drawingId: string; viewportId: string }>).detail;
  const td = components.get(OBC.TechnicalDrawings);
  const d = td.list.get(drawingId);
  const vp = d?.viewports.get(viewportId);
  if (!d || !vp) return;

  // If another viewport was being edited, cancel it first.
  if (paperEditMode) exitPaperMode();

  editor.activeDrawing = d;
  const vpEl = board.getViewportElement(drawingId, viewportId);
  activeVpEl = vpEl;
  if (vpEl) editor.setSource(vpEl, vp);
  board.enterEditMode(drawingId, viewportId);
  // Override the default white crosshair with a dark one visible on white paper.
  if (vpEl) {
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20'><line x1='10' y1='0' x2='10' y2='20' stroke='white' stroke-width='3'/><line x1='0' y1='10' x2='20' y2='10' stroke='white' stroke-width='3'/><line x1='10' y1='0' x2='10' y2='20' stroke='#222' stroke-width='1.5'/><line x1='0' y1='10' x2='20' y2='10' stroke='#222' stroke-width='1.5'/></svg>`;
    vpEl.style.cursor = `url("data:image/svg+xml,${encodeURIComponent(svg)}") 10 10, crosshair`;
  }
  paperEditMode = true;
  updatePanel();
});

// Clicks inside the board advance the tool only in paper-space mode.
board.addEventListener("click", () => {
  if (paperEditMode && editor.activeDrawing) {
    editor.step();
    board.requestRender();
  }
});

const worldCanvas = world.renderer.three.domElement;

// Clicks on the 3D canvas advance the tool only when not in paper-space mode.
worldCanvas.addEventListener("click", () => {
  if (!paperEditMode) { editor.step(); board.requestRender(); }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    const hasOpenMenu = !!document.body.querySelector("[data-context-dialog]");
    if (hasOpenMenu) return;

    const currentTool =
      activeTool === "linear"  ? dimTool :
      activeTool === "angle"   ? angleTool :
      activeTool === "callout" ? calloutTool : null;
    const isIdle = currentTool?.isIdle ?? true;

    if (!isIdle) {
      // Placement or drag in progress → cancel it, stay on tool and mode.
      editor.cancel();
      board.requestRender();
    } else if (paperEditMode) {
      // Idle in paper space → exit paper-space edit mode.
      exitPaperMode();
    } else if (activeTool !== null) {
      // Idle, outside paper space → deactivate tool.
      setActiveTool(null);
    }
  }
  if (e.key === "Delete") { editor.delete(); board.requestRender(); }
});

// Single-viewport DXF export — triggered by the viewport toolbar.
board.addEventListener("viewportdxfexport", (e) => {
  const { drawingId, viewportId, dxf } = (e as CustomEvent<{ drawingId: string; viewportId: string; dxf: string }>).detail;
  const name = techDrawings.list.get(drawingId)?.viewports.get(viewportId)?.name ?? viewportId;
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([dxf], { type: "application/dxf" }));
  a.download = `${name}.dxf`;
  a.click();
  URL.revokeObjectURL(a.href);
});

// Full-paper DXF export — triggered by the paper toolbar.
board.addEventListener("paperdxfexport", (e) => {
  const { paper, dxf } = (e as CustomEvent<{ paper: BUI.PaperSpace; dxf: string }>).detail;
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([dxf], { type: "application/dxf" }));
  a.download = `${paper.getAttribute("label") || "drawing"}.dxf`;
  a.click();
  URL.revokeObjectURL(a.href);
});

/* MD
  ### 🧩 Adding some UI
  We will use the `@thatopen/ui` library to add some simple and cool UI elements to
  our app. For more information about the UI library, you can check the specific
  documentation for it!
*/

// ─── Style lookup maps ────────────────────────────────────────────────────────

const LINE_TICKS: Record<string, OBC.LineTickBuilder> = {
  "Diagonal":   OBC.DiagonalTick,
  "Arrow":      OBC.ArrowTick,
  "Open Arrow": OBC.OpenArrowTick,
  "Dot":        OBC.DotTick,
  "None":       OBC.NoTick,
};

const MESH_TICKS: Record<string, OBC.MeshTickBuilder | undefined> = {
  "Filled Arrow":  OBC.FilledArrowTick,
  "Filled Circle": OBC.FilledCircleTick,
  "Filled Square": OBC.FilledSquareTick,
  "None":          undefined,
};

const ENCLOSURES: Record<string, OBC.EnclosureBuilder> = {
  "Cloud":     OBC.CloudEnclosure,
  "Rectangle": OBC.RectEnclosure,
  "Circle":    OBC.CircleEnclosure,
};

/** Returns the key in `map` whose value matches `val`, or `fallback`. */
function lookupKey<T>(map: Record<string, T>, val: T, fallback = "None"): string {
  return Object.entries(map).find(([, v]) => v === val)?.[0] ?? fallback;
}

/** Converts a hex-number color to a CSS `#rrggbb` string. */
function hexStr(n: number): string {
  return "#" + n.toString(16).padStart(6, "0");
}

// ─── Panel ────────────────────────────────────────────────────────────────────

const [panel, _updatePanel] = BUI.Component.create<BUI.PanelSection, Record<string, never>>(
  (_) => BUI.html`
    <bim-panel active label="Drawing Editor" class="options-menu">
      <bim-panel-section style="width:15rem" label="Drawing">
        <bim-label style="max-width:13rem;white-space:normal">
          Click "Project from model" to generate the drawing, then pick an annotation tool and click to place dimensions. Double-click a viewport on the sheet to annotate in paper space.
        </bim-label>

        ${!projected ? BUI.html`
          <bim-button label="Project from model"
            @click=${({target}: {target: BUI.Button}) => projectFromModel(target)}>
          </bim-button>
        ` : ""}

        ${editor.activeDrawing ? BUI.html`
          ${[...editor.activeDrawing.layers].filter(([name]) => name !== "0").map(([name, layer]) => BUI.html`
            <bim-checkbox
              label=${name}
              ?checked=${layer.visible}
              @change=${(e: any) => {
                editor.activeDrawing!.layers.setVisibility(name, e.target.checked);
                updatePanel();
                board.requestRender();
              }}>
            </bim-checkbox>
          `)}
        ` : ""}
      </bim-panel-section>

      <bim-panel-section style="width:15rem" label="Drawing Tools">
        <bim-label style="white-space:normal">
          Input: ${paperEditMode ? "Paper space (Esc to exit)" : "3D canvas"}
        </bim-label>
        <bim-dropdown
          required
          label="Active tool"
          @change=${({ target }: { target: BUI.Dropdown }) => {
            setActiveTool(target.value[0] as ActiveTool);
          }}>
          <bim-option label="None"                  value=${null}      ?checked=${activeTool === null}></bim-option>
          <bim-option label="Linear Dimensions"   value="linear"   ?checked=${activeTool === "linear"}></bim-option>
          <bim-option label="Angle Dimensions"    value="angle"    ?checked=${activeTool === "angle"}></bim-option>
          <bim-option label="Callout Annotations" value="callout"  ?checked=${activeTool === "callout"}></bim-option>
        </bim-dropdown>
      </bim-panel-section>

      ${activeTool === "linear" ? BUI.html`
        <bim-panel-section style="width:15rem" label="Linear Dimensions">
          ${(() => {
            const s = dimTool.system.styles.get("default")!;
            const set = (patch: Partial<typeof s>) => { const cur = dimTool.system.styles.get("default")!; dimTool.system.styles.set("default", { ...cur, ...patch }); board.requestRender(); };
            return BUI.html`
              <bim-color-input label="Color" color=${hexStr(s.color)}
                @input=${({ target }: { target: BUI.ColorInput }) => set({ color: parseInt(target.color.replace("#", ""), 16) })}>
              </bim-color-input>
              <bim-number-input slider label="Font size" min="0.05" max="2" step="0.05" .value=${s.fontSize}
                @change=${({ target }: { target: BUI.NumberInput }) => set({ fontSize: target.value })}>
              </bim-number-input>
              <bim-number-input slider label="Text offset" min="0" max="2" step="0.05" .value=${s.textOffset}
                @change=${({ target }: { target: BUI.NumberInput }) => set({ textOffset: target.value })}>
              </bim-number-input>
              <bim-number-input slider label="Tick size" min="0.05" max="1" step="0.05" .value=${s.tickSize}
                @change=${({ target }: { target: BUI.NumberInput }) => set({ tickSize: target.value })}>
              </bim-number-input>
              <bim-number-input slider label="Extension gap" min="0" max="0.5" step="0.01" .value=${s.extensionGap}
                @change=${({ target }: { target: BUI.NumberInput }) => set({ extensionGap: target.value })}>
              </bim-number-input>
              <bim-number-input slider label="Extension overshoot" min="0" max="0.5" step="0.01" .value=${s.extensionOvershoot}
                @change=${({ target }: { target: BUI.NumberInput }) => set({ extensionOvershoot: target.value })}>
              </bim-number-input>
              <bim-dropdown label="Line tick"
                @change=${({ target }: { target: BUI.Dropdown }) => set({ lineTick: LINE_TICKS[target.value[0]] })}>
                ${Object.keys(LINE_TICKS).map((k) => BUI.html`
                  <bim-option label=${k} value=${k} ?checked=${lookupKey(LINE_TICKS, s.lineTick) === k}></bim-option>`)}
              </bim-dropdown>
              <bim-dropdown label="Mesh tick"
                @change=${({ target }: { target: BUI.Dropdown }) => set({ meshTick: MESH_TICKS[target.value[0]] })}>
                ${Object.keys(MESH_TICKS).map((k) => BUI.html`
                  <bim-option label=${k} value=${k} ?checked=${lookupKey(MESH_TICKS, s.meshTick) === k}></bim-option>`)}
              </bim-dropdown>
            `;
          })()}
          <bim-dropdown label="Placement mode"
            @change=${({ target }: { target: BUI.Dropdown }) => {
              dimTool.setMode(target.value[0] as string);
              updatePanel();
            }}>
            ${[...dimTool.modes.keys()].map((key) => BUI.html`
              <bim-option label=${key} value=${key} ?checked=${dimTool.activeMode === key}></bim-option>
            `)}
          </bim-dropdown>
          <bim-label style="white-space:normal">State: ${dimTool.state.kind}</bim-label>

          <bim-button label="Clear all"
            @click=${() => { dimTool.system.clear([drawing]); updatePanel(); }}>
          </bim-button>
        </bim-panel-section>
      ` : activeTool === "angle" ? BUI.html`
        <bim-panel-section style="width:15rem" label="Angle Dimensions">
          ${(() => {
            const s = angleTool.system.styles.get("default")!;
            const set = (patch: Partial<typeof s>) => { const cur = angleTool.system.styles.get("default")!; angleTool.system.styles.set("default", { ...cur, ...patch }); board.requestRender(); };
            return BUI.html`
              <bim-color-input label="Color" color=${hexStr(s.color)}
                @input=${({ target }: { target: BUI.ColorInput }) => set({ color: parseInt(target.color.replace("#", ""), 16) })}>
              </bim-color-input>
              <bim-number-input slider label="Font size" min="0.05" max="2" step="0.05" .value=${s.fontSize}
                @change=${({ target }: { target: BUI.NumberInput }) => set({ fontSize: target.value })}>
              </bim-number-input>
              <bim-number-input slider label="Text offset" min="0" max="2" step="0.05" .value=${s.textOffset}
                @change=${({ target }: { target: BUI.NumberInput }) => set({ textOffset: target.value })}>
              </bim-number-input>
              <bim-number-input slider label="Tick size" min="0.05" max="1" step="0.05" .value=${s.tickSize}
                @change=${({ target }: { target: BUI.NumberInput }) => set({ tickSize: target.value })}>
              </bim-number-input>
              <bim-number-input slider label="Extension gap" min="0" max="0.5" step="0.01" .value=${s.extensionGap}
                @change=${({ target }: { target: BUI.NumberInput }) => set({ extensionGap: target.value })}>
              </bim-number-input>
              <bim-dropdown label="Line tick"
                @change=${({ target }: { target: BUI.Dropdown }) => set({ lineTick: LINE_TICKS[target.value[0]] })}>
                ${Object.keys(LINE_TICKS).map((k) => BUI.html`
                  <bim-option label=${k} value=${k} ?checked=${lookupKey(LINE_TICKS, s.lineTick) === k}></bim-option>`)}
              </bim-dropdown>
              <bim-dropdown label="Mesh tick"
                @change=${({ target }: { target: BUI.Dropdown }) => set({ meshTick: MESH_TICKS[target.value[0]] })}>
                ${Object.keys(MESH_TICKS).map((k) => BUI.html`
                  <bim-option label=${k} value=${k} ?checked=${lookupKey(MESH_TICKS, s.meshTick) === k}></bim-option>`)}
              </bim-dropdown>
            `;
          })()}
          <bim-label style="white-space:normal">State: ${angleTool.state.kind}</bim-label>

          <bim-button label="Clear all"
            @click=${() => { angleTool.system.clear([drawing]); updatePanel(); }}>
          </bim-button>
        </bim-panel-section>
      ` : activeTool === "callout" ? BUI.html`
        <bim-panel-section style="width:15rem" label="Callout Annotations">
          ${(() => {
            const s = calloutTool.system.styles.get("default")!;
            const set = (patch: Partial<typeof s>) => { const cur = calloutTool.system.styles.get("default")!; calloutTool.system.styles.set("default", { ...cur, ...patch }); board.requestRender(); };
            return BUI.html`
              <bim-color-input label="Color" color=${hexStr(s.color)}
                @input=${({ target }: { target: BUI.ColorInput }) => set({ color: parseInt(target.color.replace("#", ""), 16) })}>
              </bim-color-input>
              <bim-number-input slider label="Font size" min="0.05" max="2" step="0.05" .value=${s.fontSize}
                @change=${({ target }: { target: BUI.NumberInput }) => set({ fontSize: target.value })}>
              </bim-number-input>
              <bim-number-input slider label="Text offset" min="0" max="2" step="0.05" .value=${s.textOffset}
                @change=${({ target }: { target: BUI.NumberInput }) => set({ textOffset: target.value })}>
              </bim-number-input>
              <bim-number-input slider label="Tick size" min="0.05" max="1" step="0.05" .value=${s.tickSize}
                @change=${({ target }: { target: BUI.NumberInput }) => set({ tickSize: target.value })}>
              </bim-number-input>
              <bim-dropdown label="Enclosure"
                @change=${({ target }: { target: BUI.Dropdown }) => set({ enclosure: ENCLOSURES[target.value[0]] })}>
                ${Object.keys(ENCLOSURES).map((k) => BUI.html`
                  <bim-option label=${k} value=${k} ?checked=${lookupKey(ENCLOSURES, s.enclosure) === k}></bim-option>`)}
              </bim-dropdown>
              <bim-dropdown label="Line tick"
                @change=${({ target }: { target: BUI.Dropdown }) => set({ lineTick: LINE_TICKS[target.value[0]] })}>
                ${Object.keys(LINE_TICKS).map((k) => BUI.html`
                  <bim-option label=${k} value=${k} ?checked=${lookupKey(LINE_TICKS, s.lineTick ?? OBC.NoTick) === k}></bim-option>`)}
              </bim-dropdown>
              <bim-dropdown label="Mesh tick"
                @change=${({ target }: { target: BUI.Dropdown }) => set({ meshTick: MESH_TICKS[target.value[0]] })}>
                ${Object.keys(MESH_TICKS).map((k) => BUI.html`
                  <bim-option label=${k} value=${k} ?checked=${lookupKey(MESH_TICKS, s.meshTick) === k}></bim-option>`)}
              </bim-dropdown>
            `;
          })()}
          <bim-label style="white-space:normal">State: ${calloutTool.state.kind}</bim-label>

          <bim-button label="Clear all"
            @click=${() => { calloutTool.system.clear([drawing]); updatePanel(); }}>
          </bim-button>
        </bim-panel-section>
      ` : BUI.html``}

      <bim-panel-section style="width:15rem" label="Model">
        <bim-checkbox
          label="Show model"
          checked
          @change=${(e: any) => { model.object.visible = e.target.checked; }}>
        </bim-checkbox>
      </bim-panel-section>

    </bim-panel>
  `,
  {},
);

updatePanel = _updatePanel;
editor.activeDrawing = drawing;
container.append(panel);

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

container.append(button);

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
  That's it! In a fraction of the code from the core tutorial you have a fully
  interactive annotation setup — snapping, hover feedback, label rendering, and
  now a complete style catalogue all included. From here, check the other Drawing
  Editor examples to explore paper-space viewports, multi-selection, and per-viewport
  DXF export.
*/
