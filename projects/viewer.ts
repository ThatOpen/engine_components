/* eslint-disable import/no-extraneous-dependencies */
import * as THREE from "three";
import * as OBC from "../packages/core/src/index";

const container = document.getElementById("container")!;
const titleEl = document.getElementById("project-title")!;
const statusEl = document.getElementById("status")!;
const dropEl = document.getElementById("drop")!;
const fitBtn = document.getElementById("fit") as HTMLButtonElement;
const addInput = document.getElementById("ifc-add") as HTMLInputElement;
const openInput = document.getElementById("ifc-open") as HTMLInputElement;
const lblAdd = document.getElementById("lbl-add")!;
const lblOpen = document.getElementById("lbl-open")!;
const modelsList = document.getElementById("models-list")!;
const modelsCount = document.getElementById("models-count")!;
const alignSelect = document.getElementById("align") as HTMLSelectElement;

const PROCESS_NAMES: Record<string, string> = {
  geometries: "geometry",
  attributes: "attributes",
  relations: "relations",
  conversion: "conversion",
};

const setStatus = (text: string, isError = false) => {
  statusEl.textContent = text;
  statusEl.classList.toggle("visible", text.length > 0);
  statusEl.classList.toggle("error", isError);
};

let busy = false;

const setBusy = (value: boolean) => {
  busy = value;
  lblAdd.classList.toggle("disabled", value);
  lblOpen.classList.toggle("disabled", value);
};

const components = new OBC.Components();
const worlds = components.get(OBC.Worlds);
const world = worlds.create<
  OBC.SimpleScene,
  OBC.OrthoPerspectiveCamera,
  OBC.SimpleRenderer
>();

world.scene = new OBC.SimpleScene(components);
world.scene.setup();
world.scene.three.background = null;

world.renderer = new OBC.SimpleRenderer(components, container);
world.camera = new OBC.OrthoPerspectiveCamera(components);
await world.camera.controls.setLookAt(30, 30, 30, 0, 0, 0);

components.init();

components.get(OBC.Grids).create(world);

const ifcLoader = components.get(OBC.IfcLoader);
await ifcLoader.setup({
  autoSetWasm: false,
  wasm: {
    path: "https://unpkg.com/web-ifc@0.0.77/",
    absolute: true,
  },
});

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

(window as any).__bim = { components, world, fragments, ifcLoader };

const modelWord = (count: number) => (count === 1 ? "model" : "models");

let projectTitle: string | null = null;

const updateTitle = () => {
  let text = "IFC Viewer";
  if (projectTitle) {
    text = projectTitle;
  } else {
    const ids = [...fragments.list.keys()];
    if (ids.length === 1) [text] = ids;
    else if (ids.length > 1) text = `${ids.length} ${modelWord(ids.length)}`;
  }
  titleEl.textContent = text;
  document.title = `${text} — IFC Viewer`;
};

const uniqueModelId = (base: string) => {
  let id = base.trim() || "model";
  let n = 1;
  while (fragments.list.has(id)) {
    n += 1;
    id = `${base}-${n}`;
  }
  return id;
};

const fitToModels = async () => {
  const box = new THREE.Box3();
  for (const model of fragments.list.values()) {
    if (!model.object.visible) continue;
    box.union(model.box);
  }
  if (box.isEmpty()) return;
  const sphere = box.getBoundingSphere(new THREE.Sphere());
  await world.camera.controls.fitToSphere(sphere, true);
};

const applyAlignment = async () => {
  const models = [...fragments.list.values()];
  let base: number[] | null = null;
  if (alignSelect.value === "common" && models.length) {
    base = (await models[0].getCoordinates()).slice(0, 3);
  }
  for (const model of models) {
    const coords = await model.getCoordinates();
    if (base) {
      model.object.position.set(
        base[0] - coords[0],
        base[1] - coords[1],
        base[2] - coords[2],
      );
    } else {
      model.object.position.set(0, 0, 0);
    }
  }
  fragments.core.update(true);
};

let refreshModels: () => Promise<void> = async () => {};

const removeModel = async (modelId: string) => {
  if (busy) {
    setStatus("Wait for the current models to finish loading", true);
    return;
  }
  const model = fragments.list.get(modelId);
  if (!model) return;
  setBusy(true);
  try {
    await fragments.core.disposeModel(modelId);
    world.scene.three.remove(model.object);
    fragments.core.update(true);
    await refreshModels();
    await fitToModels();
    setStatus(`Model "${modelId}" unloaded`);
  } finally {
    setBusy(false);
  }
};

const clearModels = async () => {
  const ids = [...fragments.list.keys()];
  for (const modelId of ids) {
    const model = fragments.list.get(modelId);
    if (!model) continue;
    await fragments.core.disposeModel(modelId);
    world.scene.three.remove(model.object);
  }
  fragments.core.update(true);
  await refreshModels();
};

const renderModelList = () => {
  const models = [...fragments.list.values()];
  modelsCount.textContent = String(models.length);
  modelsList.replaceChildren();
  if (!models.length) {
    const empty = document.createElement("li");
    empty.className = "empty";
    empty.textContent = 'No models yet — click "Add IFC…"';
    modelsList.append(empty);
    updateTitle();
    return;
  }
  for (const model of models) {
    const { modelId } = model;
    const visible = model.object.visible;

    const item = document.createElement("li");

    const name = document.createElement("span");
    name.className = "model-name";
    name.classList.toggle("hidden-model", !visible);
    name.textContent = modelId;
    name.title = modelId;

    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "model-btn";
    toggle.textContent = visible ? "Hide" : "Show";
    toggle.addEventListener("click", () => {
      const current = fragments.list.get(modelId);
      if (!current) return;
      current.object.visible = !current.object.visible;
      fragments.core.update(true);
      renderModelList();
      setStatus(
        `Model "${modelId}" ${current.object.visible ? "shown" : "hidden"}`,
      );
    });

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "model-btn danger";
    remove.textContent = "×";
    remove.title = "Unload model";
    remove.addEventListener("click", () => {
      removeModel(modelId).catch((e) => setStatus(String(e), true));
    });

    item.append(name, toggle, remove);
    modelsList.append(item);
  }
  updateTitle();
};

refreshModels = async () => {
  renderModelList();
  await applyAlignment();
};

fitBtn.addEventListener("click", () => {
  fitToModels().catch((e) => setStatus(String(e), true));
});

alignSelect.addEventListener("change", () => {
  applyAlignment()
    .then(fitToModels)
    .then(() =>
      setStatus(
        alignSelect.value === "common"
          ? "Models aligned to shared coordinates"
          : "Each model kept the coordinates of its own file",
      ),
    )
    .catch((e) => setStatus(String(e), true));
});

type LoadSource = { label: string; read: () => Promise<Uint8Array> };

const decoder = new TextDecoder("utf-8", { fatal: false });

const assertIfc = (data: Uint8Array, label: string) => {
  const head = decoder.decode(data.slice(0, 128)).trim();
  if (!head.startsWith("ISO-10303-21")) {
    throw new Error(`"${label}" does not look like an IFC file`);
  }
};

const fileSources = (files: File[]): LoadSource[] =>
  files.map((file) => ({
    label: file.name,
    read: async () => {
      const data = new Uint8Array(await file.arrayBuffer());
      assertIfc(data, file.name);
      return data;
    },
  }));

const urlSource = (url: string): LoadSource => ({
  label: decodeURIComponent(url.split("?")[0].split("/").pop() ?? url),
  read: async () => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Could not download the file (HTTP ${response.status})`);
    }
    const type = response.headers.get("content-type") ?? "";
    if (type.includes("text/html")) {
      throw new Error(`File "${url}" not found (server returned HTML)`);
    }
    const data = new Uint8Array(await response.arrayBuffer());
    assertIfc(data, url);
    return data;
  },
});

const ifcFiles = (list: FileList | null) =>
  [...(list ?? [])].filter((file) => file.name.toLowerCase().endsWith(".ifc"));

const importModels = async (
  mode: "append" | "replace",
  sources: LoadSource[],
) => {
  if (busy) {
    setStatus("Wait for the current models to finish loading", true);
    return;
  }
  if (!sources.length) return;
  setBusy(true);
  const started = performance.now();
  try {
    if (mode === "replace") await clearModels();
    let ok = 0;
    let lastError = "";
    for (let i = 0; i < sources.length; i++) {
      const source = sources[i];
      const prefix = sources.length > 1 ? `[${i + 1}/${sources.length}] ` : "";
      try {
        const data = await source.read();
        const modelId = uniqueModelId(source.label.replace(/\.ifc$/i, ""));
        setStatus(`${prefix}Converting "${source.label}"…`);
        await ifcLoader.load(data, false, modelId, {
          processData: {
            progressCallback: (progress, info) => {
              const pct =
                progress <= 1
                  ? Math.round(progress * 100)
                  : Math.round(progress);
              const stage = PROCESS_NAMES[info.process] ?? info.process;
              setStatus(`${prefix}${stage}: ${pct}%`);
            },
          },
        });
        fragments.core.update(true);
        ok += 1;
      } catch (e) {
        lastError = e instanceof Error ? e.message : String(e);
        setStatus(
          `${prefix}Error loading "${source.label}": ${lastError}`,
          true,
        );
      }
      await refreshModels();
    }
    await fitToModels();
    const seconds = ((performance.now() - started) / 1000).toFixed(1);
    if (ok === 0) {
      setStatus(lastError || "Could not load the models", true);
    } else if (ok === sources.length) {
      const verb = mode === "replace" ? "Opened" : "Added";
      setStatus(`${verb} ${ok} ${modelWord(ok)} in ${seconds}s`);
    } else {
      setStatus(`Loaded ${ok} of ${sources.length}: ${lastError}`, true);
    }
  } catch (e) {
    setStatus(e instanceof Error ? e.message : String(e), true);
  } finally {
    setBusy(false);
  }
};

addInput.addEventListener("change", () => {
  const files = ifcFiles(addInput.files);
  addInput.value = "";
  if (!files.length) {
    setStatus("An .ifc file is required", true);
    return;
  }
  importModels("append", fileSources(files));
});

openInput.addEventListener("change", () => {
  const files = ifcFiles(openInput.files);
  openInput.value = "";
  if (!files.length) {
    setStatus("An .ifc file is required", true);
    return;
  }
  importModels("replace", fileSources(files));
});

let dragDepth = 0;
window.addEventListener("dragenter", (e) => {
  e.preventDefault();
  dragDepth++;
  dropEl.classList.add("visible");
});
window.addEventListener("dragleave", (e) => {
  e.preventDefault();
  dragDepth = Math.max(0, dragDepth - 1);
  if (!dragDepth) dropEl.classList.remove("visible");
});
window.addEventListener("dragover", (e) => e.preventDefault());
window.addEventListener("drop", (e) => {
  e.preventDefault();
  dragDepth = 0;
  dropEl.classList.remove("visible");
  const files = ifcFiles(e.dataTransfer?.files ?? null);
  if (!files.length) {
    setStatus("An .ifc file is required", true);
    return;
  }
  importModels("append", fileSources(files));
});

const params = new URLSearchParams(window.location.search);
projectTitle = params.get("title");
const modelUrls = params.getAll("model");

await refreshModels();

if (modelUrls.length) {
  importModels(
    "replace",
    modelUrls.map((url) => urlSource(url)),
  );
} else {
  setStatus("Open IFC files with the buttons above or drop them on this page");
}
