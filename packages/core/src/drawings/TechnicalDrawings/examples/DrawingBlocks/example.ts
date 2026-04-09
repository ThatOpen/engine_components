/* MD
  ## 🧱 Drawing Blocks
  ---
  A block is a named, reusable geometry definition. You register it once on the
  system — a column symbol, a door swing, a stair pattern — and then stamp it
  anywhere across any drawing, each instance carrying its own position, rotation,
  and scale. All insertions of the same block share a single `BufferGeometry`,
  so adding a hundred columns is no heavier than adding one.

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

const arqFile = await fetch("https://thatopen.github.io/engine_components/resources/frags/school_arq.frag");
const arqBuffer = await arqFile.arrayBuffer();
await fragments.core.load(arqBuffer, { modelId: "school_arq" });

/* MD
  ### 📐 Creating the drawing and loading projection lines
  We create the drawing, align its Y position to the floor cut plane used when
  generating the projection lines, and load them onto a named layer. The layer
  gives all geometry added through it a shared colour — here red — so the projection
  lines appear without needing an explicit material. The block insertions will sit on
  top of this plan so you can see them in context.
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
  ### 🔷 Defining block geometry
  A block definition is plain `BufferGeometry` in block-local XZ space, centered at
  the origin. When geometry comes from a 3D model you can use the static
  `TechnicalDrawing.toDrawingSpace()` helper to project it flat; here we build the
  symbols by hand since the shapes are simple enough to describe mathematically.

  We define two blocks: a circular column symbol and an architectural door swing.
  Block definitions are global to the system — you register them once and they're
  available to every drawing you create.
*/

const blocks = techDrawings.use(OBC.BlockAnnotations);

blocks.styles.set("COLUMN", { color: 0x0055cc, textOffset: 0, fontSize: 0 });
blocks.styles.set("DOOR",   { color: 0xcc4400, textOffset: 0, fontSize: 0 });

// ── Column: 16-sided polygon ──────────────────────────────────────────────────

const colPts: number[] = [];
const COL_R = 0.35;
const COL_SEGS = 16;
for (let i = 0; i < COL_SEGS; i++) {
  const a0 = (i / COL_SEGS) * Math.PI * 2;
  const a1 = ((i + 1) / COL_SEGS) * Math.PI * 2;
  colPts.push(Math.cos(a0) * COL_R, 0, Math.sin(a0) * COL_R);
  colPts.push(Math.cos(a1) * COL_R, 0, Math.sin(a1) * COL_R);
}
const columnGeo = new THREE.BufferGeometry();
columnGeo.setAttribute(
  "position",
  new THREE.BufferAttribute(new Float32Array(colPts), 3),
);
blocks.define("COLUMN", { lines: columnGeo });

// ── Door: quarter-arc sweep + door leaf + wall opening ────────────────────────

const DOOR_W = 0.9;
const DOOR_SEGS = 12;
const doorPts: number[] = [];
// Quarter-circle sweep showing the door's range of motion.
for (let i = 0; i < DOOR_SEGS; i++) {
  const a0 = (i / DOOR_SEGS) * (Math.PI / 2);
  const a1 = ((i + 1) / DOOR_SEGS) * (Math.PI / 2);
  doorPts.push(Math.cos(a0) * DOOR_W, 0, Math.sin(a0) * DOOR_W);
  doorPts.push(Math.cos(a1) * DOOR_W, 0, Math.sin(a1) * DOOR_W);
}
// Door leaf in the closed position.
doorPts.push(0, 0, 0, DOOR_W, 0, 0);
// Wall opening — the two jamb lines.
doorPts.push(0, 0, 0, 0, 0, DOOR_W);
const doorGeo = new THREE.BufferGeometry();
doorGeo.setAttribute(
  "position",
  new THREE.BufferAttribute(new Float32Array(doorPts), 3),
);
blocks.define("DOOR", { lines: doorGeo });

/* MD
  ### 📍 Inserting blocks
  Clicking anywhere on the drawing stamps the active block at that position. Each
  insertion is independent — it carries its own position, rotation, and scale — but
  all insertions of the same block share the underlying geometry, so nothing is
  duplicated in memory.
*/

// Forward reference — onCommit calls updatePanel() but BUI.Component.create()
// comes later. Starts as a no-op, reassigned after the panel is built.
let updatePanel = () => {};

let lastInsertedUuid: string | null = null;

blocks.onCommit.add(([{ item }]) => {
  lastInsertedUuid = item.uuid;
  updatePanel();
});

let activeBlock: "COLUMN" | "DOOR" = "COLUMN";
let nextRotation = 0;

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

container.addEventListener("click", (e) => {
  raycaster.setFromCamera(getNDC(e), world.camera.three);
  const position = getDrawingPoint(raycaster.ray);
  blocks.add(drawing, {
    blockName: activeBlock,
    position,
    rotation: nextRotation,
    scale: 1,
    style: activeBlock,
  });
});

/* MD
  ### 🔄 Updating insertions
  Any property of a committed insertion can be changed after the fact — position,
  rotation, scale, and colour are all live. Here we expose a rotation step so you
  can spin the last-placed block in 45° increments to see how a single definition
  looks at different orientations.
*/

const rotateLastBlock = () => {
  if (!lastInsertedUuid) return;
  const ins = drawing.annotations.getBySystem(blocks).get(lastInsertedUuid)!;
  blocks.update(drawing, [lastInsertedUuid], { rotation: ins.rotation + Math.PI / 4 });
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

const [panel, _updatePanel] = BUI.Component.create<
  BUI.PanelSection,
  Record<string, never>
>(
  (_) => BUI.html`
    <bim-panel active label="Drawing Blocks" class="options-menu">

      <bim-panel-section label="Active Block">
        <bim-dropdown label="Block"
          @change=${(e: any) => { activeBlock = e.target.value[0]; }}>
          <bim-option label="Column" value="COLUMN" ?checked=${activeBlock === "COLUMN"}></bim-option>
          <bim-option label="Door"   value="DOOR"   ?checked=${activeBlock === "DOOR"}></bim-option>
        </bim-dropdown>
        <bim-label>Click anywhere on the drawing to place</bim-label>
      </bim-panel-section>

      <bim-panel-section label="Insertions">
        ${(() => {
          const insertions = [...drawing.annotations.getBySystem(blocks).values()];
          return BUI.html`
            <bim-label>Columns: ${insertions.filter((i) => i.blockName === "COLUMN").length} · Doors: ${insertions.filter((i) => i.blockName === "DOOR").length}</bim-label>
          `;
        })()}
        <bim-button
          label="Rotate last 45°"
          ?disabled=${!lastInsertedUuid}
          @click=${rotateLastBlock}>
        </bim-button>
        <bim-button
          label="Clear all"
          @click=${() => {
            blocks.clear([drawing]);
            lastInsertedUuid = null;
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
  That's it! The define-once, insert-many pattern keeps your drawing lean: no matter
  how many columns or doors you place, the geometry lives in memory exactly once per
  block. Swap the hand-crafted symbols for geometry projected from a loaded IFC model
  using `TechnicalDrawing.toDrawingSpace()` and the rest of the code stays identical.
*/
