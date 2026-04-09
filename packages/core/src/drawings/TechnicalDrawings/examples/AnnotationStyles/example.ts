/* MD
  ## 🎨 Annotation Styles
  ---
  Every annotation system in That Open Engine renders its geometry using a named
  style. A style is a plain object that controls colours, line sizes, text
  properties — and, most importantly, the **tick mark** at the endpoints of a
  dimension. In this tutorial we'll register styles using the built-in tick
  builders, then write a custom mesh builder and register a fully custom style.

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
  We create the drawing, align its Y position to the floor cut plane, and load a
  pre-computed set of projection lines — wall outlines already flattened to the
  drawing plane — onto a named layer, then register the linear dimensions system
  that we'll style in the next sections.
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

const dims = techDrawings.use(OBC.LinearAnnotations);

/* MD
  ### 🎨 Registering styles with built-in tick builders

  The dimensions system already comes with a default style pre-registered. You can
  add more named styles at any time — they are plain objects, so there is no
  boilerplate. The library ships several line tick builders and filled (mesh) tick
  builders ready to combine. Here we register one style per builder so you can
  switch between them from the panel and see how each looks on the drawing. For the
  filled shapes, the line tick is suppressed so only the solid mark appears at each
  endpoint — the same technique used any time you want a mesh-only endpoint.
*/

const baseStyle = {
  tickSize: 0.4,
  extensionGap: 0.05,
  extensionOvershoot: 0.2,
  textOffset: 0.4,
  fontSize: 0.45,
};

dims.styles.set("arrow",         { ...baseStyle, lineTick: OBC.ArrowTick,    color: 0x0055ff });
dims.styles.set("dot",           { ...baseStyle, lineTick: OBC.DotTick,      color: 0x009999 });
dims.styles.set("none",          { ...baseStyle, lineTick: OBC.NoTick,       color: 0x00aa44 });
dims.styles.set("filled-arrow",  { ...baseStyle, lineTick: OBC.NoTick, meshTick: OBC.FilledArrowTick,  color: 0xff6600 });
dims.styles.set("filled-circle", { ...baseStyle, lineTick: OBC.NoTick, meshTick: OBC.FilledCircleTick, color: 0xaa00cc });
dims.styles.set("filled-square", { ...baseStyle, lineTick: OBC.NoTick, meshTick: OBC.FilledSquareTick, color: 0xcc0044 });

/* MD
  ### 🔷 Creating a custom mesh tick builder

  A mesh tick builder has the same inputs as a line tick builder, but returns
  coordinates for **non-indexed triangles** instead of line segments — every three
  triplets form one filled triangle. This lets you render a solid shape at the
  endpoint, which is something you can't achieve with line geometry alone.

  Here we implement a **diamond tick** (a rhombus pointing toward the endpoint).
  We suppress the line tick so only the solid diamond appears — giving the dimension
  a clean, filled mark with no line arrowhead on top.

  :::info

  If you want both a line mark and a filled shape at the same endpoint, just supply
  both builders in the style — they render independently and compose naturally.

  :::
*/

const DiamondTick: OBC.MeshTickBuilder = (tip, lineDir, size) => {
  const perp  = new THREE.Vector3(-lineDir.z, 0, lineDir.x);
  const mid   = tip.clone().addScaledVector(lineDir, -size * 0.5);
  const back  = tip.clone().addScaledVector(lineDir, -size);
  const left  = mid.clone().addScaledVector(perp, -size * 0.3);
  const right = mid.clone().addScaledVector(perp,  size * 0.3);
  // Two triangles: tip→left→back and tip→back→right.
  return [
    tip.x,   tip.y,   tip.z,   left.x,  left.y,  left.z,  back.x,  back.y,  back.z,
    tip.x,   tip.y,   tip.z,   back.x,  back.y,  back.z,  right.x, right.y, right.z,
  ];
};

/* MD
  ### 📐 Registering the custom style

  With the builder ready we register the custom style exactly as we did for the
  built-in ones. We also set a unit on this style — annotations can display
  measurements in any unit you like, and the library ships several common presets
  ready to use. You can also supply your own by providing a conversion factor and
  a display suffix.
*/

dims.styles.set("custom", {
  lineTick: OBC.NoTick,
  meshTick: DiamondTick,
  tickSize: 0.4,
  extensionGap: 0.05,
  extensionOvershoot: 0.2,
  color: 0xff6600,
  textOffset: 0.4,
  fontSize: 0.45,
  unit: OBC.Units.cm,
});

/* MD
  ### 🔤 Reacting to commits — rendering text labels

  Text rendering is consumer-side — the system fires commit events with the
  measurement data and we build the label geometry ourselves. Here we await the
  font load as a proper promise rather than holding a nullable reference, so the
  font is guaranteed to be ready the moment any dimension is committed.
*/

// Forward reference — onCommit calls updatePanel() but BUI.Component.create()
// comes later. It starts as a no-op and gets reassigned after the panel is built.
let updatePanel = () => {};

const ttfLoader = new TTFLoader();
const font: Font = await new Promise((resolve) => {
  ttfLoader.load("https://thatopen.github.io/engine_components/resources/fonts/PlusJakartaSans-Medium.ttf", (ttf: any) => {
    resolve(new Font(ttf));
  });
});

dims.onCommit.add((committed) => {
  for (const { item: dim, group } of committed) {
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
    // the XZ drawing plane so it lies flat on the ground alongside the other geometry.
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

  To try the styles live we need a hover highlight and the standard event wiring. The
  hover highlight tracks the projection line under the cursor so the user knows what
  will be snapped; the event listeners route clicks and key presses to the state
  machine. The style-specific detail worth noting: whichever style is active in the
  dropdown at the moment the second click lands is the one recorded on the dimension —
  switching styles mid-placement is perfectly valid.
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
*/

const styleNames = ["default", "arrow", "dot", "none", "filled-arrow", "filled-circle", "filled-square", "custom"];

const [panel, _updatePanel] = BUI.Component.create<
  BUI.PanelSection,
  Record<string, never>
>(
  (_) => BUI.html`
    <bim-panel active label="Annotation Styles" class="options-menu">

      <bim-panel-section label="Linear Dimensions">
        <bim-label>Hover a projection line, then click to place a dimension</bim-label>
        <bim-label>Committed: ${drawing.annotations.getBySystem(dims).size}</bim-label>
        <bim-dropdown
          label="Active style"
          @change=${(e: any) => { dims.activeStyle = e.target.value[0]; }}>
          ${styleNames.map(
            (name) => BUI.html`
              <bim-option label=${name} value=${name}
                ?checked=${dims.activeStyle === name}>
              </bim-option>`,
          )}
        </bim-dropdown>
        <bim-button label="Clear all"
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
  That's it! You now know how to register named styles, use the built-in tick
  builders, and implement your own from scratch. Both flavours are just plain
  functions — plug them into any style and they integrate with rendering, picking,
  and DXF export exactly like the built-in ones. Head to the next examples to
  learn about multiple viewports and model-driven annotations.
*/
