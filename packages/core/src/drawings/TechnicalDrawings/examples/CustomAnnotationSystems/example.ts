/* MD
  ## 🔧 Custom Annotation Systems
  ---
  Every built-in annotation system in That Open Engine is just a subclass of the
  same abstract base. There is no privileged API for built-ins: if you follow the
  same structural contract, your custom system integrates with the drawing manager,
  the DXF exporter, and every other utility exactly like the ones that ship with
  the library.

  In this tutorial we build `CrossMarkers` — a system that places a cross-shaped
  marker at any point in the drawing. Along the way we cover the structural contract,
  a minimal state machine for interactive placement, and DXF export registration.

  ### 🖖 Importing our Libraries
  First, let's install all necessary dependencies to make this example work:
*/

import * as THREE from "three";
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
  ### 📐 Creating the drawing and loading projection lines
  We create the drawing, align its Y position to the floor cut plane, and load a
  pre-computed set of projection lines — wall outlines already flattened to the
  drawing plane — onto a named layer so there is some geometry to look at while
  we explore custom systems.
*/

const techDrawings = components.get(OBC.TechnicalDrawings);
const drawing = techDrawings.create(world);
drawing.three.position.y = 11.427046;

const projData = await fetch("/resources/projections/projection.json").then((r) =>
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
  ### 🔧 Defining a custom annotation system

  The abstract base class handles the full CRUD lifecycle — adding, updating,
  deleting, clearing, picking, disposing, and material caching are all provided out
  of the box. To build a custom system you only need to implement two things:
  geometry construction for a single item, and handle-picking for interactive
  editing. Everything else — storing the data, managing Three.js groups, and
  cleaning up on dispose — happens automatically.

  Optionally, override the preview update hook to drive a live cursor-follow object
  while the state machine is waiting for input.

  #### Types
*/

interface CrossMarkerStyle extends OBC.BaseAnnotationStyle {
  /** Half-length of each bar of the cross, in drawing local units. */
  lineSize: number;
}

interface CrossMarker {
  uuid:     string;
  position: THREE.Vector3;
  style:    string;
}

interface CrossMarkerData {
  position: THREE.Vector3;
  style?:   string;
}

interface CrossMarkerSystem extends OBC.DrawingSystemDescriptor {
  item:   CrossMarker;
  data:   CrossMarkerData;
  style:  CrossMarkerStyle;
  handle: never;
}

/* MD
  #### State machine

  Our system has a single interactive state with a nullable preview position — the
  simplest possible state machine, but it demonstrates the full pattern. The events
  carry an optional `drawing` reference so the system knows which drawing to commit
  to on click — the same convention used by all built-in systems.
*/

type CrossMarkerState = { kind: "awaitingPoint"; preview: THREE.Vector3 | null };

type CrossMarkerEvent =
  | { type: "MOUSE_MOVE"; point: THREE.Vector3; drawing?: OBC.TechnicalDrawing }
  | { type: "CLICK";      point: THREE.Vector3; drawing?: OBC.TechnicalDrawing }
  | { type: "ESCAPE" };

function crossMarkerMachine(
  state: CrossMarkerState,
  event: CrossMarkerEvent,
): CrossMarkerState {
  switch (state.kind) {
    case "awaitingPoint": {
      if (event.type === "MOUSE_MOVE") {
        return { kind: "awaitingPoint", preview: event.point.clone().setY(0) };
      }
      if (event.type === "ESCAPE") {
        return { kind: "awaitingPoint", preview: null };
      }
      // CLICK does not change state — handled in sendMachineEvent().
      return state;
    }
  }
}

/* MD
  #### The CrossMarkers class

  The class extends the abstract drawing system base and implements the state
  machine interface. The constructor receives `Components` (not a drawing), so the
  system is a global singleton: one instance shared across all drawings, with data
  stored per-drawing inside the drawing itself.
*/

class CrossMarkers
  extends OBC.AnnotationSystem<CrossMarkerSystem>
  implements OBC.Transitionable<CrossMarkerState, CrossMarkerEvent>, OBC.Disposable
{
  enabled = true;

  // ── State machine ──────────────────────────────────────────────────────────

  machineState: CrossMarkerState = { kind: "awaitingPoint", preview: null };
  readonly onMachineStateChanged = new OBC.Event<CrossMarkerState>();

  constructor(components: OBC.Components) {
    super(components);

    this.styles.set("default",  { color: 0xff6600, textOffset: 0, fontSize: 0, lineSize: 0.25 });
    this.styles.set("emphasis", { color: 0x0066ff, textOffset: 0, fontSize: 0, lineSize: 0.45 });

    // Preview geometry: 4 vertices (two line segments) updated on every MOUSE_MOVE.
    // Configured here; attached to a drawing the first time a MOUSE_MOVE arrives.
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(12), 3));
    this._previewObject = new THREE.LineSegments(geo, this._previewMaterial);
    this._previewObject.userData.isDimension = true;
    this._previewObject.layers.set(1);
    // renderOrder 999 ensures it always draws on top of other annotation geometry.
    // frustumCulled = false prevents it from disappearing when endpoints are near the screen edge.
    this._previewObject.renderOrder = 999;
    this._previewObject.frustumCulled = false;
    this._previewObject.visible = false;

    // Override the base preview material colour to distinguish it from committed geometry.
    this._previewMaterial.color.setHex(0x0077ff);
    this._previewMaterial.transparent = true;
    this._previewMaterial.opacity = 0.5;
  }

  // ── Transitionable ─────────────────────────────────────────────────────────

  sendMachineEvent(event: CrossMarkerEvent): void {
    const eventDrawing = (event as { drawing?: OBC.TechnicalDrawing }).drawing ?? null;
    if (eventDrawing) this._previewDrawing = eventDrawing;

    // Commit before transitioning so the preview stays at the clicked position
    // until the next MOUSE_MOVE arrives.
    if (event.type === "CLICK" && this._previewDrawing) {
      this.add(this._previewDrawing, { position: event.point.clone().setY(0) });
    }

    const next = crossMarkerMachine(this.machineState, event);
    if (next !== this.machineState) {
      this.machineState = next;
      this._updatePreview();
      this.onMachineStateChanged.trigger(this.machineState);
    }
  }

  // ── AnnotationSystem abstract ──────────────────────────────────────────────

  protected _buildGroup(marker: CrossMarker, style: CrossMarkerStyle): THREE.Group {
    const { x, z } = marker.position;
    const s = style.lineSize;
    const positions = new Float32Array([
      x - s, 0, z,     x + s, 0, z,    // horizontal bar
      x,     0, z - s, x,     0, z + s, // vertical bar
    ]);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const ls = new THREE.LineSegments(geo, this._getMaterial(marker.style));
    // Exporters traverse children looking for this flag.
    ls.userData.isDimension = true;
    ls.layers.set(1);
    const group = new THREE.Group();
    group.add(ls);
    return group;
  }

  pickHandle(
    drawing: OBC.TechnicalDrawing,
    ray: THREE.Ray,
    threshold = 0.15,
  ): { uuid: string; handle: never } | null {
    // Simple point-to-ray check for the cross centres.
    for (const [uuid, entry] of drawing.annotations) {
      if (entry.system !== (this as any)) continue;
      const marker = entry.data as CrossMarker;
      const worldPos = drawing.three.localToWorld(marker.position.clone());
      if (ray.distanceToPoint(worldPos) < threshold) return { uuid, handle: null as never };
    }
    return null;
  }

  // ── Preview ────────────────────────────────────────────────────────────────

  protected _updatePreview(): void {
    if (!this.machineState.preview || !this._previewDrawing || !this._previewObject) {
      if (this._previewObject) this._previewObject.visible = false;
      return;
    }
    // Move preview to the correct drawing's container when the active drawing changes.
    if (this._previewObject.parent !== this._previewDrawing.three) {
      this._previewDrawing.three.add(this._previewObject);
    }
    const style = this._resolveStyle(this.activeStyle);
    const { x, z } = this.machineState.preview;
    const s = style.lineSize;
    const pos = this._previewObject.geometry.attributes.position as THREE.BufferAttribute;
    pos.setXYZ(0, x - s, 0, z);     pos.setXYZ(1, x + s, 0, z);
    pos.setXYZ(2, x,     0, z - s); pos.setXYZ(3, x,     0, z + s);
    pos.needsUpdate = true;
    this._previewObject.visible = true;
  }

  protected _onDispose(): void {
    this.onMachineStateChanged.reset();
  }
}

/* MD
  ### 🔌 Registering the system

  Registering the system on `techDrawings` makes it a global singleton — one instance
  shared across all drawings, exactly like the built-in systems. The first call
  instantiates it; any subsequent call returns the same instance, so it is safe to
  call from multiple places without creating duplicates.
*/

const markers = techDrawings.use(CrossMarkers);

// Forward reference — onCommit/onUpdate/onDelete call updatePanel() but
// BUI.Component.create() comes later. Starts as a no-op, reassigned after the panel.
let updatePanel = () => {};

markers.onCommit.add(() => updatePanel());
markers.onUpdate.add(() => updatePanel());
markers.onDelete.add(() => updatePanel());

/* MD
  ### 🖱️ Wiring the state machine

  We wire the DOM events to the system's state machine: moving the cursor keeps
  the live preview in sync, clicking commits a marker at that position, and pressing
  Escape — or moving the cursor outside the canvas — hides the preview. Each event
  carries the active drawing so the system knows where to commit the marker.
*/

const raycaster    = new THREE.Raycaster();
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

container.addEventListener("mousemove", (e) => {
  raycaster.setFromCamera(getNDC(e), world.camera.three);
  markers.sendMachineEvent({ type: "MOUSE_MOVE", point: getDrawingPoint(raycaster.ray), drawing });
});

container.addEventListener("mouseleave", () => {
  markers.sendMachineEvent({ type: "ESCAPE" });
});

container.addEventListener("click", (e) => {
  raycaster.setFromCamera(getNDC(e), world.camera.three);
  markers.sendMachineEvent({ type: "CLICK", point: getDrawingPoint(raycaster.ray), drawing });
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") markers.sendMachineEvent({ type: "ESCAPE" });
});

/* MD
  ### 📤 Registering a DXF exporter

  Custom systems are silently skipped during DXF export unless you explicitly
  register an exporter for them — built-in systems take care of this internally.
  The registration callback receives your typed system instance and a write context
  with helpers for emitting DXF entities.

  One detail worth knowing: the write helpers accept drawing-space coordinates
  directly — the axis transformation to DXF space is handled internally, so no
  manual remapping is needed.
*/

const dxfExporter = components.get(OBC.DxfManager).exporter;

dxfExporter.registerSystemExporter(CrossMarkers, (sys, ctx) => {
  // drawing is captured from the outer scope — one drawing in this tutorial.
  for (const [, marker] of drawing.annotations.getBySystem(sys)) {
    const style    = sys.styles.get(marker.style) ?? sys.styles.get("default")!;
    const aciColor = ctx.hexToAci(style.color);
    const layer    = drawing.activeLayer;
    const x = marker.position.x;
    const z = marker.position.z; // pass drawing-space Z directly — writeLine maps it internally
    const s = style.lineSize;
    ctx.writeLine(x - s, z,     x + s, z,     layer, aciColor); // horizontal bar
    ctx.writeLine(x,     z - s, x,     z + s, layer, aciColor); // vertical bar
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
*/

const [panel, _updatePanel] = BUI.Component.create<
  BUI.PanelSection,
  Record<string, never>
>(
  (_) => BUI.html`
    <bim-panel active label="Custom Annotation Systems" class="options-menu">

      <bim-panel-section label="Cross Markers">
        <bim-label>Move the cursor over the drawing to preview, click to place</bim-label>
        <bim-label>Committed: ${drawing.annotations.getBySystem(markers).size}</bim-label>
        <bim-button
          label="Toggle style (all)"
          ?disabled=${drawing.annotations.getBySystem(markers).size === 0}
          @click=${() => {
            const data = drawing.annotations.getBySystem(markers);
            const uuids = [...data.keys()];
            // Pick the next style based on the first marker so all markers stay in sync.
            const first = data.get(uuids[0])!;
            const next  = first.style === "default" ? "emphasis" : "default";
            markers.update(drawing, uuids, { style: next });
          }}>
        </bim-button>
        <bim-button
          label="Clear all"
          @click=${() => { markers.clear([drawing]); updatePanel(); }}>
        </bim-button>
      </bim-panel-section>

      <bim-panel-section label="Export">
        <bim-button
          label="Export DXF"
          @click=${() => {
            const dxf = dxfExporter.export([{ drawing, viewports: [{}] }]);
            const blob = new Blob([dxf], { type: "application/dxf" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "custom-annotations.dxf";
            a.click();
            URL.revokeObjectURL(url);
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
  That's it! You've built a fully custom annotation system that integrates with the
  drawing manager, the DXF exporter, and the interactive state machine infrastructure
  exactly like the built-in systems. The state machine shown here is intentionally
  minimal, but the same pattern scales to systems as complex as any of the built-ins
  without any changes to the surrounding infrastructure.
*/
