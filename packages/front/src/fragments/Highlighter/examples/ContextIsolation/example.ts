/* MD
  ## Selection with translucent context
  Isolate highlighted items while retaining the surrounding model at a chosen opacity.
  `highlighter.isolation.isolate(0.15)` shows context at 15% of its original opacity;
  `setOpacity(0)` hides it and `reset()` restores original materials and shows all items.
  Isolation follows the select style, including Ctrl-click changes. Clearing selection
  exits isolation. Configure a non-null select material so selected items remain distinct.
  Translucent isolation rejects a selection covered by a higher-priority style; clear
  the overlapping items or adjust that style's priority explicitly before isolating.
  If such a conflict appears while isolation is active, isolation resets and reports
  the error. Style memberships and priorities are preserved.
  Disposal cancels pending isolation updates and restores materials synchronously.
  If retaining the scene, await `isolation.reset()` before disposing the Highlighter
  to restore item visibility as well.
  Call `isolation.refresh()` after loading more models while isolation is active.

  The component owns item visibility while active; reset shows all items, as Hider does.
  Positive slider changes modify existing graphics materials without enumerating model IDs.
  Streamed materials inherit the same factor. Original glass transparency is multiplied,
  not replaced. Independent styles retain their colors and participate in the context.
*/
import * as THREE from "three";
import * as OBC from "@thatopen/components";
import { Highlighter } from "../../index";

const container = document.getElementById("container")!;
const status = document.getElementById("status")!;
const slider = document.getElementById("opacity") as HTMLInputElement;
const value = document.getElementById("value")!;
const components = new OBC.Components();
const world = components
  .get(OBC.Worlds)
  .create<OBC.SimpleScene, OBC.OrthoPerspectiveCamera, OBC.SimpleRenderer>();
world.scene = new OBC.SimpleScene(components);
world.scene.setup();
world.scene.three.background = new THREE.Color("#171b22");
world.renderer = new OBC.SimpleRenderer(components, container);
world.camera = new OBC.OrthoPerspectiveCamera(components);
await world.camera.controls.setLookAt(68, 23, -8.5, 21.5, -5.5, 23);
components.init();
const fragments = components.get(OBC.FragmentsManager);
const highlighter = components.get(Highlighter);
const report = (error: unknown) => {
  status.textContent = String(error);
};
const update = () => fragments.core.update().catch(report);

try {
  const worker = await fetch(
    "https://thatopen.github.io/engine_fragment/resources/worker.mjs",
  );
  if (!worker.ok) throw new Error(`Worker download failed: ${worker.status}`);
  const workerUrl = URL.createObjectURL(
    new Blob([await worker.text()], { type: "text/javascript" }),
  );
  fragments.init(workerUrl);
  world.camera.controls.addEventListener("update", update);
  fragments.list.onItemSet.add(({ value: model }) => {
    model.useCamera(world.camera.three);
    world.scene.three.add(model.object);
  });
  const file = await fetch(
    "https://thatopen.github.io/engine_components/resources/frags/school_arq.frag",
  );
  if (!file.ok) throw new Error(`Model download failed: ${file.status}`);
  const model = await fragments.core.load(await file.arrayBuffer(), {
    modelId: "school",
  });
  highlighter.setup({ world });
  await fragments.core.update(true);
  const ids = await model.getItemsIdsWithGeometry();
  const run = async (operation: () => Promise<unknown>) => {
    try {
      await operation();
      status.textContent = highlighter.isolation.active
        ? `Isolated · context ${Math.round(highlighter.isolation.opacity * 100)}%`
        : "All items visible";
    } catch (error) {
      report(error);
    }
  };
  document.getElementById("sample")!.onclick = () =>
    run(() =>
      highlighter.highlightByID("select", { school: new Set(ids.slice(0, 3)) }),
    );
  document.getElementById("isolate")!.onclick = () =>
    run(() => highlighter.isolation.isolate(Number(slider.value) / 100));
  document.getElementById("reset")!.onclick = () =>
    run(() => highlighter.isolation.reset());
  document.getElementById("clear")!.onclick = () =>
    run(() => highlighter.clear("select"));
  slider.oninput = () => {
    value.textContent = `${slider.value}%`;
    void run(() =>
      highlighter.isolation.setOpacity(Number(slider.value) / 100),
    );
  };
  for (const control of document.querySelectorAll<
    HTMLButtonElement | HTMLInputElement
  >("button, input"))
    control.disabled = false;
  status.textContent = `Ready · ${ids.length} geometric items`;
} catch (error) {
  report(error);
}
