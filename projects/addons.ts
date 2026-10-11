/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-use-before-define */
import * as THREE from "three";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import * as OBC from "../packages/core/src/index";
import { Highlighter } from "../packages/front/src/fragments/Highlighter";
import { Hoverer } from "../packages/front/src/fragments/Hoverer";
import { Mesher } from "../packages/front/src/fragments/Mesher";
import { ClipStyler } from "../packages/front/src/core/ClipStyler";
import { Marker } from "../packages/front/src/core/Marker";
import { LengthMeasurement } from "../packages/front/src/measurement/LengthMeasurement";
import { AreaMeasurement } from "../packages/front/src/measurement/AreaMeasurement";
import { AngleMeasurement } from "../packages/front/src/measurement/AngleMeasurement";
import { VolumeMeasurement } from "../packages/front/src/measurement/VolumeMeasurement";
import { formatUnits } from "../packages/front/src/utils/format-units";

export type AddOnHandle = {
  enable: () => Promise<void>;
  disable: () => Promise<void>;
  onModelRemoved?: (modelId: string) => Promise<void> | void;
  component?: unknown;
};

export type AddOnPanel = {
  update: () => void;
  dispose: () => void;
};

export type CategoryInfo = { name: string; count: number };

export type AddOnPanelHelpers = {
  hasModels: () => boolean;
  setStatus: (text: string, isError?: boolean) => void;
  categories: () => Promise<CategoryInfo[]>;
};

export type AddOnDef = {
  id: string;
  name: string;
  create: () => AddOnHandle;
  panel: (root: HTMLElement, helpers: AddOnPanelHelpers) => AddOnPanel;
};

export type AddOnsContext = {
  components: OBC.Components;
  world: OBC.World;
  fragments: OBC.FragmentsManager;
  setStatus: (text: string, isError?: boolean) => void;
};

export type AddOnsManager = {
  defs: AddOnDef[];
  isEnabled: (id: string) => boolean;
  getComponent: (id: string) => unknown;
  toggle: (id: string, on: boolean, silent?: boolean) => Promise<void>;
  onModelRemoved: (modelId: string) => Promise<void>;
};

// eslint-disable-next-line no-undef -- DOM lib type, known to TypeScript
const el = <K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  text?: string,
) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
};

const errorText = (e: unknown) => (e instanceof Error ? e.message : String(e));

const attrText = (data: Record<string, any> | undefined, name: string) => {
  const attr = data?.[name];
  if (attr && typeof attr === "object" && "value" in attr) {
    return String(attr.value);
  }
  return "";
};

const propValueText = (prop: Record<string, any>) => {
  for (const key of Object.keys(prop)) {
    if (key.startsWith("_") || !/value/i.test(key)) continue;
    const attr = prop[key];
    if (
      attr &&
      typeof attr === "object" &&
      !Array.isArray(attr) &&
      "value" in attr
    ) {
      return String(attr.value);
    }
  }
  return "";
};

const countSelection = (selection: OBC.ModelIdMap | undefined) => {
  let total = 0;
  for (const ids of Object.values(selection ?? {})) total += ids.size;
  return total;
};

const singleSelection = (selection: OBC.ModelIdMap | undefined) => {
  for (const [modelId, ids] of Object.entries(selection ?? {})) {
    if (ids.size === 1) return { modelId, localId: [...ids][0] };
  }
  return null;
};

const categoryRegex = (category: string) =>
  new RegExp(`^${category.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`);

const collectCategories = async (
  fragments: OBC.FragmentsManager,
): Promise<CategoryInfo[]> => {
  const counts = new Map<string, number>();
  const names = new Set<string>();
  for (const model of fragments.list.values()) {
    const categories = (await model.getItemsWithGeometryCategories()).filter(
      (category): category is string => Boolean(category),
    );
    if (!categories.length) continue;
    const byCategory = await model.getItemsOfCategories(
      categories.map(categoryRegex),
    );
    for (const [category, localIds] of Object.entries(byCategory)) {
      names.add(category);
      counts.set(category, (counts.get(category) ?? 0) + localIds.length);
    }
  }
  return [...names]
    .sort()
    .map((name) => ({ name, count: counts.get(name) ?? 0 }));
};

const itemsOfCategory = async (
  fragments: OBC.FragmentsManager,
  category: string,
): Promise<OBC.ModelIdMap> => {
  const modelIdMap: OBC.ModelIdMap = {};
  const regex = categoryRegex(category);
  for (const model of fragments.list.values()) {
    const byCategory = await model.getItemsOfCategories([regex]);
    const localIds = byCategory[category];
    if (localIds?.length) modelIdMap[model.modelId] = new Set(localIds);
  }
  return modelIdMap;
};

export function createAddOns(
  ctx: AddOnsContext,
  dom: { listEl: HTMLElement; panelEl: HTMLElement },
): AddOnsManager {
  const helpers: AddOnPanelHelpers = {
    hasModels: () => ctx.fragments.list.size > 0,
    setStatus: ctx.setStatus,
    categories: () => collectCategories(ctx.fragments),
  };

  const defs: AddOnDef[] = [
    createHighlighterAddOn(ctx),
    createHovererAddOn(ctx),
    createHiderAddOn(ctx),
    createClipperAddOn(ctx),
    createMeasurementsAddOn(ctx),
    createItemsFinderAddOn(ctx),
    createClassifierAddOn(ctx),
    createBoundingBoxerAddOn(ctx),
    createMesherAddOn(ctx),
    createViewsAddOn(ctx),
    createViewpointsAddOn(ctx),
    createMarkerAddOn(ctx),
  ];

  const handles = new Map<string, AddOnHandle>();
  const enabledIds: string[] = [];
  let activeId: string | null = null;
  let activePanel: AddOnPanel | null = null;

  const renderList = () => {
    dom.listEl.replaceChildren();
    for (const def of defs) {
      const item = el("li");
      const label = el("label", "addon-check");
      label.title = "Add-ons are exclusive: pick one, click it again to stop";
      const radio = document.createElement("input");
      radio.type = "radio";
      radio.name = "bim-viewer-addon";
      radio.value = def.id;
      radio.checked = enabledIds.includes(def.id);
      // Add-ons are mutually exclusive (R-012): a radio button turns one on
      // and all the others off. Native radios cannot be unchecked, so a
      // second click on the active one switches the add-on off.
      radio.addEventListener("click", () => {
        const wasEnabled = enabledIds.includes(def.id);
        toggle(def.id, !wasEnabled).catch((e) =>
          ctx.setStatus(errorText(e), true),
        );
      });
      const name = el("span", undefined, def.name);
      label.append(radio, name);
      item.append(label);
      dom.listEl.append(item);
    }
  };

  const showPanel = (id: string | null) => {
    if (activePanel) {
      try {
        activePanel.dispose();
      } catch (e) {
        ctx.setStatus(errorText(e), true);
      }
      activePanel = null;
    }
    dom.panelEl.replaceChildren();
    activeId = null;
    if (!id) {
      dom.panelEl.append(
        el("p", "addon-hint", "Enable an add-on to see its tools"),
      );
      return;
    }
    const def = defs.find((candidate) => candidate.id === id);
    if (!def) return;
    const root = el("div", "addon-root");
    dom.panelEl.append(el("div", "addon-title", def.name), root);
    activeId = id;
    try {
      activePanel = def.panel(root, helpers);
      activePanel.update();
    } catch (e) {
      activePanel = null;
      root.replaceChildren(el("p", "addon-hint", errorText(e)));
      ctx.setStatus(`"${def.name}" panel failed: ${errorText(e)}`, true);
    }
  };

  const updateActivePanel = () => {
    if (!activePanel) return;
    try {
      activePanel.update();
    } catch (e) {
      ctx.setStatus(errorText(e), true);
    }
  };

  async function toggle(id: string, on: boolean, silent = false) {
    const def = defs.find((candidate) => candidate.id === id);
    if (!def) return;
    if (on) {
      if (enabledIds.includes(id)) return;
      // Radio-button behaviour: enabling one add-on disables every other.
      for (const other of defs) {
        if (other.id !== id && enabledIds.includes(other.id)) {
          await toggle(other.id, false, true);
        }
      }
      let handle = handles.get(id);
      if (!handle) {
        try {
          handle = await def.create();
        } catch (e) {
          renderList();
          ctx.setStatus(`"${def.name}" failed to start: ${errorText(e)}`, true);
          return;
        }
        handles.set(id, handle);
      }
      try {
        await handle.enable();
      } catch (e) {
        renderList();
        ctx.setStatus(`"${def.name}" failed to enable: ${errorText(e)}`, true);
        return;
      }
      enabledIds.push(id);
      renderList();
      showPanel(id);
      if (!silent) ctx.setStatus(`${def.name} enabled`);
      return;
    }
    const index = enabledIds.indexOf(id);
    if (index === -1) return;
    enabledIds.splice(index, 1);
    const handle = handles.get(id);
    if (handle) {
      try {
        await handle.disable();
      } catch (e) {
        ctx.setStatus(`"${def.name}" failed to disable: ${errorText(e)}`, true);
      }
    }
    if (!silent) {
      if (activeId === id) showPanel(enabledIds[enabledIds.length - 1] ?? null);
      renderList();
      ctx.setStatus(`${def.name} disabled`);
    }
  }

  ctx.fragments.list.onItemSet.add(() => updateActivePanel());
  ctx.fragments.list.onItemDeleted.add(() => updateActivePanel());

  renderList();
  showPanel(null);

  return {
    defs,
    isEnabled: (id) => enabledIds.includes(id),
    getComponent: (id) => handles.get(id)?.component,
    toggle,
    onModelRemoved: async (modelId) => {
      for (const handle of handles.values()) {
        if (!handle.onModelRemoved) continue;
        try {
          await handle.onModelRemoved(modelId);
        } catch (e) {
          ctx.setStatus(errorText(e), true);
        }
      }
      updateActivePanel();
    },
  };
}

function createHighlighterAddOn(ctx: AddOnsContext): AddOnDef {
  const updateRequested = new OBC.Event<void>();
  let highlighter: Highlighter | null = null;

  return {
    id: "highlighter",
    name: "Highlighter",
    create: () => {
      highlighter = ctx.components.get(Highlighter);
      highlighter.setup({
        world: ctx.world,
        selectMaterialDefinition: {
          color: new THREE.Color("#BCF124"),
          opacity: 1,
          transparent: false,
          renderedFaces: 0,
        },
      });
      highlighter.events.select.onHighlight.add(() => {
        updateRequested.trigger();
      });
      highlighter.events.select.onClear.add(() => {
        updateRequested.trigger();
      });
      return {
        component: highlighter,
        enable: async () => {
          highlighter.enabled = true;
        },
        disable: async () => {
          await highlighter.clear();
          highlighter.enabled = false;
        },
        onModelRemoved: async (modelId) => {
          if (!highlighter) return;
          const ids = highlighter.selection.select?.[modelId];
          if (!ids || !ids.size) return;
          await highlighter.clear("select", { [modelId]: ids });
          updateRequested.trigger();
        },
      };
    },
    panel: (root, panelHelpers) => {
      let disposed = false;
      let renderGen = 0;

      const render = async () => {
        const gen = ++renderGen;
        root.replaceChildren();
        if (!highlighter) return;
        const selection = highlighter.selection.select;
        const total = countSelection(selection);
        if (!panelHelpers.hasModels()) {
          root.append(el("p", "addon-hint", "Load an IFC to use this tool"));
          return;
        }
        if (total === 0) {
          root.append(
            el("p", "addon-hint", "Click an element to see its properties"),
          );
          return;
        }
        if (total > 1) {
          root.append(el("p", "addon-hint", `${total} elements selected`));
          return;
        }
        const single = singleSelection(selection);
        if (!single) return;
        const model = ctx.fragments.list.get(single.modelId);
        if (!model) {
          root.append(el("p", "addon-hint", "Model not found"));
          return;
        }
        root.append(el("p", "addon-hint", "Loading properties…"));
        let data: Record<string, any> | undefined;
        try {
          [data] = await model.getItemsData([single.localId], {
            attributesDefault: true,
            relations: {
              IsDefinedBy: { attributes: true, relations: true },
            },
          });
        } catch (e) {
          if (disposed || gen !== renderGen) return;
          root.replaceChildren(el("p", "addon-hint", errorText(e)));
          return;
        }
        if (disposed || gen !== renderGen) return;
        if (!data) {
          root.replaceChildren(el("p", "addon-hint", "Element data not found"));
          return;
        }
        root.replaceChildren();
        const header = el("p", "addon-hint", "Selected: 1 element");
        root.append(header);
        const rows = el("div", "addon-rows");
        const addRow = (container: HTMLElement, key: string, value: string) => {
          const row = el("div", "addon-row");
          const keyEl = el("span", "addon-key", key);
          const valueEl = el("span", "addon-value", value);
          valueEl.title = value;
          row.append(keyEl, valueEl);
          container.append(row);
        };
        addRow(rows, "expressID", String(single.localId));
        addRow(rows, "localId", String(single.localId));
        addRow(rows, "GlobalId", attrText(data, "_guid"));
        addRow(rows, "Name", attrText(data, "Name"));
        addRow(rows, "Type", attrText(data, "_category"));
        root.append(rows);
        const psets = Array.isArray(data.IsDefinedBy) ? data.IsDefinedBy : [];
        const titledPsets = psets.filter(
          (set: Record<string, any>) =>
            Array.isArray(set.HasProperties) ||
            Array.isArray(set.Quantities) ||
            Array.isArray(set.HasPropertySets),
        );
        if (!titledPsets.length) return;
        root.append(el("div", "addon-section", "Property Sets"));
        const addPropertySet = (
          set: Record<string, any>,
          container: HTMLElement,
        ) => {
          const setName = attrText(set, "Name") || attrText(set, "_category");
          let props: any[] = [];
          if (Array.isArray(set.HasProperties)) props = set.HasProperties;
          else if (Array.isArray(set.Quantities)) props = set.Quantities;
          if (!props.length) return;
          container.append(el("div", "addon-pset-name", setName));
          const propRows = el("div", "addon-rows");
          for (const prop of props) {
            const propName = attrText(prop, "Name");
            if (!propName) continue;
            addRow(propRows, propName, propValueText(prop));
          }
          container.append(propRows);
        };
        const list = el("div", "addon-psets");
        for (const set of titledPsets) {
          addPropertySet(set, list);
          if (Array.isArray(set.HasPropertySets)) {
            for (const typeSet of set.HasPropertySets) {
              addPropertySet(typeSet, list);
            }
          }
        }
        root.append(list);
      };

      const requestRender = () => {
        render().catch((e) => {
          if (!disposed) ctx.setStatus(errorText(e), true);
        });
      };
      updateRequested.add(requestRender);
      requestRender();
      return {
        update: requestRender,
        dispose: () => {
          disposed = true;
          updateRequested.remove(requestRender);
        },
      };
    },
  };
}

function createHovererAddOn(ctx: AddOnsContext): AddOnDef {
  let hoverer: Hoverer | null = null;
  let color = "#ff9f43";

  const applyColor = () => {
    if (!hoverer) return;
    hoverer.material = new THREE.MeshBasicMaterial({
      color: new THREE.Color(color),
      transparent: true,
      opacity: 0.45,
      depthTest: false,
      side: THREE.DoubleSide,
    });
  };

  return {
    id: "hoverer",
    name: "Hoverer",
    create: () => {
      hoverer = ctx.components.get(Hoverer);
      hoverer.world = ctx.world;
      applyColor();
      return {
        component: hoverer,
        enable: async () => {
          hoverer.enabled = true;
        },
        disable: async () => {
          hoverer.clear();
          hoverer.enabled = false;
        },
      };
    },
    panel: (root, panelHelpers) => {
      const row = el("div", "addon-row");
      row.append(el("span", "addon-key", "Color"));
      const input = document.createElement("input");
      input.type = "color";
      input.className = "addon-color";
      input.value = color;
      input.addEventListener("input", () => {
        color = input.value;
        applyColor();
      });
      row.append(input);
      const hint = el("p", "addon-hint");
      root.append(row, hint);
      return {
        update: () => {
          hint.textContent = panelHelpers.hasModels()
            ? "Move the cursor over an element to preview it"
            : "Load an IFC to use this tool";
        },
        dispose: () => {},
      };
    },
  };
}

function createHiderAddOn(ctx: AddOnsContext): AddOnDef {
  const updateRequested = new OBC.Event<void>();
  let hider: OBC.Hider | null = null;
  let categories: CategoryInfo[] = [];
  const hidden = new Set<string>();

  const setCategoryVisible = async (category: string, visible: boolean) => {
    if (!hider) return;
    const modelIdMap = await itemsOfCategory(ctx.fragments, category);
    await hider.set(visible, modelIdMap);
    if (visible) hidden.delete(category);
    else hidden.add(category);
    updateRequested.trigger();
  };

  return {
    id: "hider",
    name: "Hider",
    create: () => {
      hider = ctx.components.get(OBC.Hider);
      return {
        component: hider,
        enable: async () => {
          categories = await collectCategories(ctx.fragments);
        },
        disable: async () => {
          hidden.clear();
          await hider.set(true);
        },
        onModelRemoved: async () => {
          hidden.clear();
          await hider.set(true);
          categories = await collectCategories(ctx.fragments);
        },
      };
    },
    panel: (root, panelHelpers) => {
      const listRoot = el("div", "addon-rows");
      root.append(listRoot);
      let disposed = false;

      const render = async () => {
        listRoot.replaceChildren();
        if (!panelHelpers.hasModels()) {
          listRoot.append(
            el("p", "addon-hint", "Load an IFC to use this tool"),
          );
          return;
        }
        categories = await panelHelpers.categories();
        if (disposed) return;
        listRoot.replaceChildren();
        if (!categories.length) {
          listRoot.append(el("p", "addon-hint", "No categories found"));
          return;
        }
        for (const category of categories) {
          const label = el("label", "addon-check");
          const checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          checkbox.checked = !hidden.has(category.name);
          checkbox.addEventListener("change", () => {
            setCategoryVisible(category.name, checkbox.checked).catch((e) =>
              panelHelpers.setStatus(errorText(e), true),
            );
          });
          label.append(
            checkbox,
            el("span", undefined, `${category.name} (${category.count})`),
          );
          listRoot.append(label);
        }
      };

      const requestRender = () => {
        render().catch((e) => {
          if (!disposed) panelHelpers.setStatus(errorText(e), true);
        });
      };
      updateRequested.add(requestRender);
      requestRender();
      return {
        update: requestRender,
        dispose: () => {
          disposed = true;
          updateRequested.remove(requestRender);
        },
      };
    },
  };
}

function createClipperAddOn(ctx: AddOnsContext): AddOnDef {
  const updateRequested = new OBC.Event<void>();
  let clipper: OBC.Clipper | null = null;
  let clipStyler: ClipStyler | null = null;
  const planeBases = new Map<string, THREE.Vector3>();
  let canvas: HTMLCanvasElement | null = null;

  // A newly created plane clips the side the clicked surface faces away from
  // (the engine negates the hit normal). That is right when you click a roof
  // from above, but if you click a floor from below/inside the plane faces
  // down and clips the camera's own side, so nothing is rendered. After each
  // creation, make sure the camera stays on the kept side; flip the plane if
  // it would otherwise clip the camera away.
  const keepCameraSide = (plane: OBC.SimplePlane) => {
    const camera = ctx.world.camera?.three;
    if (!camera) return;
    // A THREE.Plane keeps points where normal·p + constant >= 0.
    const onKeptSide =
      plane.three.normal.dot(camera.position) + plane.three.constant >= 0;
    if (onKeptSide) return;
    plane.setFromNormalAndCoplanarPoint(
      plane.normal.clone().negate(),
      plane.origin.clone(),
    );
  };

  // The plane must stay PARALLEL to the face that was double-clicked (the engine
  // already gives us that normal). The engine anchors the plane to the clicked
  // surface, so a wall click hides just the thin slice behind that wall. Slide
  // the plane (keeping its orientation) until it passes through the model's
  // bounding-box center, so the model visibly splits into two halves that are
  // still parallel to the clicked face.
  const bisectThroughModelCenter = (plane: OBC.SimplePlane) => {
    let cx = 0;
    let cy = 0;
    let cz = 0;
    let count = 0;
    for (const model of ctx.fragments.list.values()) {
      const box = (model as unknown as { box?: THREE.Box3 }).box;
      if (!box) continue;
      cx += (box.min.x + box.max.x) / 2;
      cy += (box.min.y + box.max.y) / 2;
      cz += (box.min.z + box.max.z) / 2;
      count++;
    }
    if (!count) return;
    const center = new THREE.Vector3(cx / count, cy / count, cz / count);
    plane.setFromNormalAndCoplanarPoint(plane.normal.clone(), center);
  };

  // Force the fragment worker to re-read the clipping planes after every plane
  // mutation. The worker only pulls `getClippingPlanesEvent` when a fresh view
  // is pushed, and adding/removing a plane does not move the camera. The
  // forced update's FINISH fence can hang forever when the worker is idle, so
  // this is fire-and-forget.
  const refreshModels = () => {
    ctx.fragments.core.update(true).catch(() => {});
  };

  // The renderer clips through the GLOBAL `three.clippingPlanes` list: local
  // per-material planes don't clip fragment meshes (their shaders are baked
  // once at load, before any plane exists). three.js applies global planes to
  // every scene object at draw time, so a plane pushed into
  // `renderer.three.clippingPlanes` reliably cuts the fragment model in two.
  const onDblClick = () => {
    if (!clipper) return;
    clipper
      .create(ctx.world)
      .then((plane) => {
        if (!plane) return;
        keepCameraSide(plane);
        refreshModels();
        updateRequested.trigger();
        ctx.setStatus(
          "Section plane added. Half of the model is hidden; drag the plane to move it, or press Delete / use Delete all to restore the model.",
        );
      })
      .catch((e) => ctx.setStatus(errorText(e), true));
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key !== "Delete" && event.key !== "Backspace") return;
    const target = event.target as HTMLElement | null;
    if (
      target &&
      (target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable)
    ) {
      return;
    }
    if (!clipper) return;
    clipper
      .delete(ctx.world)
      .then(() => {
        refreshModels();
        updateRequested.trigger();
      })
      .catch((e) => ctx.setStatus(errorText(e), true));
  };

  return {
    id: "clipper",
    name: "Clipper",
    create: () => {
      clipper = ctx.components.get(OBC.Clipper);
      // Use the renderer's GLOBAL clipping list: three.js clips fragment meshes
      // reliably through `renderer.three.clippingPlanes` (their shaders are
      // compiled once at load with the clipping chunk because the renderer
      // keeps `localClippingEnabled`, so global planes apply at draw time).
      // Per-material local planes don't cut fragment tiles, so keep the engine
      // default (global).
      clipper.localClippingPlanes = false;
      clipStyler = ctx.components.get(ClipStyler);
      clipStyler.world = ctx.world;
      clipStyler.styles.set("Section", {
        linesMaterial: new LineMaterial({ color: "#14181d", linewidth: 2 }),
        fillsMaterial: new THREE.MeshBasicMaterial({
          color: "#c5cbd4",
          side: THREE.DoubleSide,
        }),
      });

      // Feed the planes to the fragment worker too: it culls tile boxes behind
      // the cut once it learns about them on a view refresh.
      const setModelPlanes = (model: { getClippingPlanesEvent?: unknown }) => {
        model.getClippingPlanesEvent = () =>
          Array.from(ctx.world.renderer?.clippingPlanes ?? []);
      };
      for (const model of ctx.fragments.list.values()) setModelPlanes(model);
      const onModelSet = ({
        value,
      }: {
        value: { getClippingPlanesEvent?: unknown };
      }) => setModelPlanes(value);
      ctx.fragments.list.onItemSet.add(onModelSet);

      const onAfterCreate = (plane: OBC.SimplePlane) => {
        if (!clipper || !clipStyler) return;
        const key = clipper.list.getKey(plane);
        if (!key) return;
        // Keep the plane parallel to the clicked face but slide it through the
        // model center so the cut is clearly visible, then generate the section.
        bisectThroughModelCenter(plane);
        planeBases.set(key, plane.origin.clone());
        plane.onDraggingEnded.add(() => {
          planeBases.set(key, plane.origin.clone());
          refreshModels();
          updateRequested.trigger();
        });
        try {
          clipStyler.createFromClipping(key, {
            items: { All: { style: "Section" } },
          });
        } catch (e) {
          ctx.setStatus(errorText(e), true);
        }
        updateRequested.trigger();
      };
      clipper.onAfterCreate.add(onAfterCreate);
      clipper.list.onItemDeleted.add(() => updateRequested.trigger());

      return {
        component: clipper,
        enable: async () => {
          canvas = ctx.world.renderer?.three.domElement ?? null;
          canvas?.addEventListener("dblclick", onDblClick);
          window.addEventListener("keydown", onKeyDown);
          clipper.enabled = true;
        },
        disable: async () => {
          canvas?.removeEventListener("dblclick", onDblClick);
          window.removeEventListener("keydown", onKeyDown);
          clipper.deleteAll();
          clipper.enabled = false;
          planeBases.clear();
          refreshModels();
        },
      };
    },
    panel: (root, panelHelpers) => {
      const listRoot = el("div", "addon-rows");
      const hint = el(
        "p",
        "addon-hint",
        "Double-click a surface to add a plane; press Delete to remove the plane under the cursor",
      );
      const actions = el("div", "addon-actions");
      const deleteAllBtn = el("button", "model-btn", "Delete all");
      deleteAllBtn.type = "button";
      deleteAllBtn.addEventListener("click", () => {
        if (!clipper) return;
        try {
          clipper.deleteAll();
          planeBases.clear();
          refreshModels();
          updateRequested.trigger();
        } catch (e) {
          panelHelpers.setStatus(errorText(e), true);
        }
      });
      actions.append(deleteAllBtn);
      root.append(hint, listRoot, actions);

      const render = () => {
        listRoot.replaceChildren();
        if (!panelHelpers.hasModels()) {
          listRoot.append(
            el("p", "addon-hint", "Load an IFC to use this tool"),
          );
          return;
        }
        if (!clipper || !clipper.list.size) {
          listRoot.append(el("p", "addon-hint", "No planes yet"));
          return;
        }
        const clipperRef = clipper;
        let index = 0;
        for (const [key, plane] of clipperRef.list) {
          index += 1;
          const row = el("div", "addon-plane");
          const enabled = document.createElement("input");
          enabled.type = "checkbox";
          enabled.checked = plane.enabled;
          enabled.title = "Toggle plane";
          enabled.addEventListener("change", () => {
            plane.enabled = enabled.checked;
            updateRequested.trigger();
          });
          row.append(enabled, el("span", undefined, `Plane ${index}`));
          const slider = document.createElement("input");
          slider.type = "range";
          slider.min = "-20";
          slider.max = "20";
          slider.step = "0.1";
          slider.value = "0";
          slider.title = "Position along the plane normal";
          slider.addEventListener("input", () => {
            const base = planeBases.get(key) ?? plane.origin.clone();
            const offset = Number(slider.value);
            const point = base
              .clone()
              .addScaledVector(plane.normal.clone(), offset);
            plane.setFromNormalAndCoplanarPoint(plane.normal.clone(), point);
          });
          row.append(slider);
          const remove = el("button", "model-btn", "×");
          remove.type = "button";
          remove.title = "Remove plane";
          remove.addEventListener("click", () => {
            clipperRef
              .delete(ctx.world, key)
              .then(() => updateRequested.trigger())
              .catch((e) => panelHelpers.setStatus(errorText(e), true));
          });
          row.append(remove);
          listRoot.append(row);
        }
      };
      updateRequested.add(render);
      render();
      return {
        update: render,
        dispose: () => updateRequested.remove(render),
      };
    },
  };
}

type AnyMeasurer = {
  world: OBC.World | null;
  enabled: boolean;
  units: string;
  unitsList: string[];
  list: Set<any> & {
    clear: () => void;
    onItemAdded: {
      add: (fn: () => void) => void;
      remove: (fn: () => void) => void;
    };
    onCleared: {
      add: (fn: () => void) => void;
      remove: (fn: () => void) => void;
    };
  };
  create: () => Promise<void> | void;
  cancelCreation: () => void;
};

function createMeasurementsAddOn(ctx: AddOnsContext): AddOnDef {
  const updateRequested = new OBC.Event<void>();
  const measurers = new Map<string, AnyMeasurer>();
  let active: "length" | "area" | "angle" | "volume" = "length";
  let enabled = false;
  let canvas: HTMLCanvasElement | null = null;

  const getMeasurer = (id: string): AnyMeasurer => {
    let measurer = measurers.get(id);
    if (!measurer) {
      if (id === "length") {
        measurer = ctx.components.get(LengthMeasurement) as AnyMeasurer;
      } else if (id === "area") {
        measurer = ctx.components.get(AreaMeasurement) as AnyMeasurer;
      } else if (id === "angle") {
        measurer = ctx.components.get(AngleMeasurement) as AnyMeasurer;
      } else {
        measurer = ctx.components.get(VolumeMeasurement) as AnyMeasurer;
      }
      measurer.world = ctx.world;
      measurer.list.onItemAdded.add(() => updateRequested.trigger());
      measurer.list.onCleared.add(() => updateRequested.trigger());
      measurers.set(id, measurer);
    }
    return measurer;
  };

  const switchType = (id: "length" | "area" | "angle" | "volume") => {
    if (id === active) return;
    const previous = measurers.get(active);
    if (previous && enabled) {
      previous.enabled = false;
      previous.cancelCreation();
    }
    active = id;
    if (enabled) getMeasurer(active).enabled = true;
    updateRequested.trigger();
  };

  const onDblClick = () => {
    const measurer = getMeasurer(active);
    Promise.resolve(measurer.create()).catch((e) =>
      ctx.setStatus(errorText(e), true),
    );
  };

  return {
    id: "measurements",
    name: "Measurements",
    create: () => ({
      enable: async () => {
        enabled = true;
        getMeasurer(active).enabled = true;
        canvas = ctx.world.renderer?.three.domElement ?? null;
        canvas?.addEventListener("dblclick", onDblClick);
      },
      disable: async () => {
        enabled = false;
        canvas?.removeEventListener("dblclick", onDblClick);
        for (const measurer of measurers.values()) {
          measurer.enabled = false;
          measurer.cancelCreation();
          measurer.list.clear();
        }
      },
    }),
    panel: (root, panelHelpers) => {
      const typesRow = el("div", "addon-types");
      const typeDefs = [
        ["length", "Length"],
        ["area", "Area"],
        ["angle", "Angle"],
        ["volume", "Volume"],
      ] as const;
      const buttons = new Map<string, HTMLButtonElement>();
      for (const [id, label] of typeDefs) {
        const button = el("button", "addon-type", label);
        button.type = "button";
        button.addEventListener("click", () => switchType(id));
        buttons.set(id, button);
        typesRow.append(button);
      }
      const unitsRow = el("div", "addon-row");
      unitsRow.append(el("span", "addon-key", "Units"));
      const unitsSelect = document.createElement("select");
      unitsSelect.className = "addon-select";
      unitsRow.append(unitsSelect);
      const hint = el("p", "addon-hint");
      const section = el("div", "addon-section");
      const valuesList = el("ul", "addon-values");
      const actions = el("div", "addon-actions");
      const clearBtn = el("button", "model-btn", "Clear");
      clearBtn.type = "button";
      clearBtn.addEventListener("click", () => {
        getMeasurer(active).list.clear();
        updateRequested.trigger();
      });
      actions.append(clearBtn);
      root.append(typesRow, unitsRow, hint, section, valuesList, actions);

      let disposed = false;
      let renderGen = 0;

      const render = async () => {
        const gen = ++renderGen;
        for (const [id, button] of buttons) {
          button.classList.toggle("active", id === active);
        }
        if (!panelHelpers.hasModels()) {
          hint.textContent = "Load an IFC to use this tool";
          unitsRow.style.display = "none";
          section.textContent = "";
          valuesList.replaceChildren();
          actions.style.display = "none";
          return;
        }
        unitsRow.style.display = "";
        actions.style.display = "";
        hint.textContent =
          "Double-click in the scene to place measurement points";
        const measurer = getMeasurer(active);
        unitsSelect.replaceChildren();
        for (const unit of measurer.unitsList) {
          const option = document.createElement("option");
          option.value = unit;
          option.textContent = formatUnits(unit);
          option.selected = unit === measurer.units;
          unitsSelect.append(option);
        }
        const values: string[] = [];
        for (const item of measurer.list) {
          let value: unknown;
          try {
            if (typeof item?.value === "number") value = item.value;
            else if (typeof item?.getValue === "function") {
              value = await item.getValue();
            }
          } catch {
            value = "?";
          }
          values.push(`${value} ${formatUnits(measurer.units)}`);
        }
        if (disposed || gen !== renderGen) return;
        section.textContent = values.length
          ? `${values.length} measurement${values.length === 1 ? "" : "s"}`
          : "No measurements yet";
        valuesList.replaceChildren();
        values.forEach((value, index) => {
          valuesList.append(el("li", undefined, `${index + 1}. ${value}`));
        });
      };

      const requestRender = () => {
        render().catch((e) => {
          if (!disposed) panelHelpers.setStatus(errorText(e), true);
        });
      };
      unitsSelect.addEventListener("change", () => {
        getMeasurer(active).units = unitsSelect.value;
        requestRender();
      });
      updateRequested.add(requestRender);
      requestRender();
      return {
        update: requestRender,
        dispose: () => {
          disposed = true;
          updateRequested.remove(requestRender);
        },
      };
    },
  };
}

function createItemsFinderAddOn(ctx: AddOnsContext): AddOnDef {
  const updateRequested = new OBC.Event<void>();
  let finder: OBC.ItemsFinder | null = null;

  return {
    id: "items-finder",
    name: "ItemsFinder",
    create: () => {
      finder = ctx.components.get(OBC.ItemsFinder);
      return {
        component: finder,
        enable: async () => {},
        disable: async () => {
          finder.list.clear();
          updateRequested.trigger();
        },
        onModelRemoved: async () => {
          finder.list.clear();
          updateRequested.trigger();
        },
      };
    },
    panel: (root, panelHelpers) => {
      const controls = el("div", "addon-row");
      controls.append(el("span", "addon-key", "Category"));
      const select = document.createElement("select");
      select.className = "addon-select";
      controls.append(select);

      const actions = el("div", "addon-actions");
      const findBtn = el("button", "model-btn", "Find");
      findBtn.type = "button";
      const clearBtn = el("button", "model-btn", "Clear queries");
      clearBtn.type = "button";
      actions.append(findBtn, clearBtn);

      const hint = el("p", "addon-hint");
      const results = el("div", "addon-rows");
      root.append(controls, actions, hint, results);

      const runFind = () => {
        if (!finder) return;
        const category = select.value;
        if (!category) return;
        finder.create(category, [{ categories: [categoryRegex(category)] }]);
        const instance = finder.list.get(category);
        if (!instance) return;
        instance
          .test()
          .then(() => updateRequested.trigger())
          .catch((e) => panelHelpers.setStatus(errorText(e), true));
      };

      findBtn.addEventListener("click", runFind);
      clearBtn.addEventListener("click", () => {
        finder?.list.clear();
        updateRequested.trigger();
      });

      let disposed = false;

      const render = async () => {
        results.replaceChildren();
        if (!panelHelpers.hasModels()) {
          hint.textContent = "Load an IFC to use this tool";
          select.replaceChildren();
          return;
        }
        const categories = await panelHelpers.categories();
        if (disposed) return;
        const current = select.value;
        select.replaceChildren();
        for (const category of categories) {
          const option = document.createElement("option");
          option.value = category.name;
          option.textContent = `${category.name} (${category.count})`;
          select.append(option);
        }
        if (current && categories.some((item) => item.name === current)) {
          select.value = current;
        }
        hint.textContent =
          "Pick a category and press Find to run an items query";
        results.replaceChildren();
        if (!finder || !finder.list.size) {
          results.append(el("p", "addon-hint", "No queries yet"));
          return;
        }
        for (const [name, instance] of finder.list) {
          const total = countSelection(instance.result ?? undefined);
          results.append(
            el("p", "addon-pset-name", `${name}: ${total} elements`),
          );
        }
      };

      const requestRender = () => {
        render().catch((e) => {
          if (!disposed) panelHelpers.setStatus(errorText(e), true);
        });
      };
      updateRequested.add(requestRender);
      requestRender();
      return {
        update: requestRender,
        dispose: () => {
          disposed = true;
          updateRequested.remove(requestRender);
        },
      };
    },
  };
}

function createClassifierAddOn(ctx: AddOnsContext): AddOnDef {
  const updateRequested = new OBC.Event<void>();
  let classifier: OBC.Classifier | null = null;

  return {
    id: "classifier",
    name: "Classifier",
    create: () => {
      classifier = ctx.components.get(OBC.Classifier);
      return {
        component: classifier,
        enable: async () => {},
        disable: async () => {
          classifier.list.clear();
          updateRequested.trigger();
        },
        onModelRemoved: async () => updateRequested.trigger(),
      };
    },
    panel: (root, panelHelpers) => {
      const actions = el("div", "addon-actions");
      const addButton = (label: string, run: () => Promise<void>) => {
        const button = el("button", "model-btn", label);
        button.type = "button";
        button.addEventListener("click", () => {
          button.classList.add("disabled");
          run()
            .then(() => updateRequested.trigger())
            .catch((e) => panelHelpers.setStatus(errorText(e), true))
            .finally(() => button.classList.remove("disabled"));
        });
        actions.append(button);
      };
      addButton("By category", async () => {
        await classifier?.byCategory();
      });
      addButton("By storey", async () => {
        await classifier?.byIfcBuildingStorey();
      });
      addButton("By model", async () => {
        await classifier?.byModel();
      });
      const clearBtn = el("button", "model-btn", "Clear");
      clearBtn.type = "button";
      clearBtn.addEventListener("click", () => {
        classifier?.list.clear();
        updateRequested.trigger();
      });
      actions.append(clearBtn);

      const hint = el("p", "addon-hint");
      const tree = el("div", "addon-rows");
      root.append(actions, hint, tree);

      let disposed = false;
      let renderGen = 0;

      const render = async () => {
        const gen = ++renderGen;
        tree.replaceChildren();
        if (!panelHelpers.hasModels()) {
          hint.textContent = "Load an IFC to use this tool";
          return;
        }
        if (!classifier || !classifier.list.size) {
          hint.textContent = "Group the elements with the buttons above";
          return;
        }
        hint.textContent = "Groups of the created classifications";
        for (const [classification, groups] of classifier.list) {
          if (disposed || gen !== renderGen) return;
          tree.append(el("div", "addon-section", classification));
          for (const [name, groupData] of groups) {
            if (disposed || gen !== renderGen) return;
            let total = countSelection(groupData.map);
            if (groupData.query) {
              try {
                total = countSelection(await groupData.get());
              } catch (e) {
                if (disposed || gen !== renderGen) return;
                tree.append(el("p", "addon-hint", `${name}: ${errorText(e)}`));
                continue;
              }
            }
            if (disposed || gen !== renderGen) return;
            tree.append(el("p", "addon-pset-name", `${name} (${total})`));
          }
        }
      };

      const requestRender = () => {
        render().catch((e) => {
          if (!disposed) panelHelpers.setStatus(errorText(e), true);
        });
      };
      updateRequested.add(requestRender);
      requestRender();
      return {
        update: requestRender,
        dispose: () => {
          disposed = true;
          updateRequested.remove(requestRender);
        },
      };
    },
  };
}

function createBoundingBoxerAddOn(ctx: AddOnsContext): AddOnDef {
  const updateRequested = new OBC.Event<void>();
  let boxer: OBC.BoundingBoxer | null = null;

  const getModelsBox = () => {
    if (!boxer) return null;
    boxer.list.clear();
    boxer.addFromModels();
    const box = boxer.get();
    boxer.list.clear();
    return box;
  };

  return {
    id: "bounding-boxer",
    name: "BoundingBoxer",
    create: () => {
      boxer = ctx.components.get(OBC.BoundingBoxer);
      return {
        component: boxer,
        enable: async () => {},
        disable: async () => {
          boxer.list.clear();
        },
        onModelRemoved: async () => updateRequested.trigger(),
      };
    },
    panel: (root, panelHelpers) => {
      const hint = el(
        "p",
        "addon-hint",
        "Measure the bounding box of the loaded models or jump the camera to a side",
      );
      const rows = el("div", "addon-rows");
      const orientations = el("div", "addon-types");
      root.append(hint, rows, orientations);

      const addRow = (key: string, value: string) => {
        const row = el("div", "addon-row");
        row.append(
          el("span", "addon-key", key),
          el("span", "addon-value", value),
        );
        rows.append(row);
      };

      const boxerRef = boxer;
      for (const orientation of [
        "front",
        "back",
        "left",
        "right",
        "top",
        "bottom",
      ] as const) {
        const button = el("button", "addon-type", orientation);
        button.type = "button";
        button.addEventListener("click", async () => {
          if (!boxerRef) return;
          button.classList.add("disabled");
          try {
            const { position, target } =
              await boxerRef.getCameraOrientation(orientation);
            await ctx.world.camera.controls.setLookAt(
              position.x,
              position.y,
              position.z,
              target.x,
              target.y,
              target.z,
              true,
            );
            ctx.fragments.core.update();
            panelHelpers.setStatus(`Camera moved to the ${orientation} side`);
          } catch (e) {
            panelHelpers.setStatus(errorText(e), true);
          } finally {
            button.classList.remove("disabled");
          }
        });
        orientations.append(button);
      }

      let disposed = false;

      const render = () => {
        rows.replaceChildren();
        if (!panelHelpers.hasModels()) {
          hint.textContent = "Load an IFC to use this tool";
          return;
        }
        hint.textContent =
          "Measure the bounding box of the loaded models or jump the camera to a side";
        const box = getModelsBox();
        if (!box || box.isEmpty()) {
          rows.append(el("p", "addon-hint", "The models have no bounding box"));
          return;
        }
        const size = box.getSize(new THREE.Vector3());
        addRow(
          "Size",
          `${size.x.toFixed(2)} × ${size.y.toFixed(2)} × ${size.z.toFixed(2)}`,
        );
        addRow(
          "Min",
          `${box.min.x.toFixed(2)}, ${box.min.y.toFixed(2)}, ${box.min.z.toFixed(2)}`,
        );
        addRow(
          "Max",
          `${box.max.x.toFixed(2)}, ${box.max.y.toFixed(2)}, ${box.max.z.toFixed(2)}`,
        );
      };

      const requestRender = () => {
        try {
          render();
        } catch (e) {
          if (!disposed) panelHelpers.setStatus(errorText(e), true);
        }
      };
      updateRequested.add(requestRender);
      requestRender();
      return {
        update: requestRender,
        dispose: () => {
          disposed = true;
          updateRequested.remove(requestRender);
        },
      };
    },
  };
}

function createMesherAddOn(ctx: AddOnsContext): AddOnDef {
  const updateRequested = new OBC.Event<void>();
  let mesher: Mesher | null = null;
  const created: THREE.Mesh[] = [];
  let maxItems = 100;

  const clearMeshes = () => {
    for (const mesh of created) mesh.removeFromParent();
    created.length = 0;
    mesher?.remove();
    ctx.fragments.core.update(true);
  };

  const createFromCategory = async (category: string) => {
    if (!mesher) return;
    const modelIdMap: OBC.ModelIdMap = {};
    let total = 0;
    for (const [modelId, model] of ctx.fragments.list) {
      const byCategory = await model.getItemsOfCategories([
        categoryRegex(category),
      ]);
      const localIds = byCategory[category] ?? [];
      const room = Math.max(0, maxItems - total);
      const capped = localIds.slice(0, room);
      if (capped.length) modelIdMap[modelId] = new Set(capped);
      total += capped.length;
      if (total >= maxItems) break;
    }
    if (!total) {
      ctx.setStatus(`No elements found in "${category}"`, true);
      return;
    }
    const material = new THREE.MeshLambertMaterial({ color: "#8ab4ff" });
    const result = await mesher.get(modelIdMap, { material });
    for (const modelMeshes of result.values()) {
      for (const meshes of modelMeshes.values()) {
        for (const mesh of meshes) {
          ctx.world.scene.three.add(mesh);
          created.push(mesh);
        }
      }
    }
    ctx.fragments.core.update(true);
    updateRequested.trigger();
    ctx.setStatus(`Created ${created.length} meshes from "${category}"`);
  };

  return {
    id: "mesher",
    name: "Mesher",
    create: () => {
      mesher = ctx.components.get(Mesher);
      return {
        component: mesher,
        enable: async () => {},
        disable: async () => clearMeshes(),
        onModelRemoved: async () => clearMeshes(),
      };
    },
    panel: (root, panelHelpers) => {
      const controls = el("div", "addon-row");
      controls.append(el("span", "addon-key", "Category"));
      const select = document.createElement("select");
      select.className = "addon-select";
      controls.append(select);

      const limitRow = el("div", "addon-row");
      limitRow.append(el("span", "addon-key", "Max items"));
      const limitInput = document.createElement("input");
      limitInput.type = "number";
      limitInput.className = "addon-number";
      limitInput.min = "1";
      limitInput.max = "5000";
      limitInput.value = String(maxItems);
      limitInput.addEventListener("change", () => {
        const value = Number(limitInput.value);
        if (Number.isFinite(value) && value > 0) maxItems = Math.floor(value);
        limitInput.value = String(maxItems);
      });
      limitRow.append(limitInput);

      const actions = el("div", "addon-actions");
      const createBtn = el("button", "model-btn", "Create meshes");
      createBtn.type = "button";
      createBtn.addEventListener("click", () => {
        const category = select.value;
        if (!category) return;
        createBtn.classList.add("disabled");
        createFromCategory(category)
          .catch((e) => panelHelpers.setStatus(errorText(e), true))
          .finally(() => createBtn.classList.remove("disabled"));
      });
      const removeBtn = el("button", "model-btn", "Remove meshes");
      removeBtn.type = "button";
      removeBtn.addEventListener("click", () => {
        clearMeshes();
        updateRequested.trigger();
      });
      actions.append(createBtn, removeBtn);

      const hint = el("p", "addon-hint");
      root.append(controls, limitRow, actions, hint);

      let disposed = false;

      const render = async () => {
        if (!panelHelpers.hasModels()) {
          hint.textContent = "Load an IFC to use this tool";
          select.replaceChildren();
          return;
        }
        const categories = await panelHelpers.categories();
        if (disposed) return;
        const current = select.value;
        select.replaceChildren();
        for (const category of categories) {
          const option = document.createElement("option");
          option.value = category.name;
          option.textContent = `${category.name} (${category.count})`;
          select.append(option);
        }
        if (current && categories.some((item) => item.name === current)) {
          select.value = current;
        }
        hint.textContent = created.length
          ? `${created.length} meshes in the scene`
          : "Build standalone meshes for the elements of a category";
      };

      const requestRender = () => {
        render().catch((e) => {
          if (!disposed) panelHelpers.setStatus(errorText(e), true);
        });
      };
      updateRequested.add(requestRender);
      requestRender();
      return {
        update: requestRender,
        dispose: () => {
          disposed = true;
          updateRequested.remove(requestRender);
        },
      };
    },
  };
}

function createViewsAddOn(ctx: AddOnsContext): AddOnDef {
  const updateRequested = new OBC.Event<void>();
  let views: OBC.Views | null = null;

  return {
    id: "views",
    name: "Views",
    create: () => {
      views = ctx.components.get(OBC.Views);
      views.world = ctx.world;
      views.list.onItemSet.add(() => updateRequested.trigger());
      views.list.onItemDeleted.add(() => updateRequested.trigger());
      views.list.onItemUpdated.add(() => updateRequested.trigger());
      return {
        component: views,
        enable: async () => {
          views.world = ctx.world;
        },
        disable: async () => {
          views.close();
        },
        onModelRemoved: async () => updateRequested.trigger(),
      };
    },
    panel: (root, panelHelpers) => {
      const hint = el(
        "p",
        "addon-hint",
        "Create plan views from the storeys or elevation views from the bounding boxes",
      );
      const actions = el("div", "addon-actions");
      const storeysBtn = el("button", "model-btn", "Storey views");
      storeysBtn.type = "button";
      storeysBtn.addEventListener("click", () => {
        if (!views) return;
        storeysBtn.classList.add("disabled");
        Promise.resolve(views.createFromIfcStoreys())
          .then((created) => {
            panelHelpers.setStatus(`${created.length} storey views created`);
            updateRequested.trigger();
          })
          .catch((e) => panelHelpers.setStatus(errorText(e), true))
          .finally(() => storeysBtn.classList.remove("disabled"));
      });
      const elevationsBtn = el("button", "model-btn", "Elevations");
      elevationsBtn.type = "button";
      elevationsBtn.addEventListener("click", () => {
        if (!views) return;
        try {
          const created = views.createElevations({ combine: true });
          panelHelpers.setStatus(`${created.length} elevation views created`);
          updateRequested.trigger();
        } catch (e) {
          panelHelpers.setStatus(errorText(e), true);
        }
      });
      const clearBtn = el("button", "model-btn", "Clear");
      clearBtn.type = "button";
      clearBtn.addEventListener("click", () => {
        if (!views) return;
        for (const id of [...views.list.keys()]) views.list.delete(id);
        updateRequested.trigger();
      });
      actions.append(storeysBtn, elevationsBtn, clearBtn);

      const listRoot = el("div", "addon-rows");
      root.append(hint, actions, listRoot);

      const render = () => {
        listRoot.replaceChildren();
        if (!panelHelpers.hasModels()) {
          listRoot.append(
            el("p", "addon-hint", "Load an IFC to use this tool"),
          );
          return;
        }
        if (!views || !views.list.size) {
          listRoot.append(el("p", "addon-hint", "No views yet"));
          return;
        }
        const viewsRef = views;
        for (const [id, view] of viewsRef.list) {
          const row = el("div", "addon-row");
          row.append(el("span", "addon-value", id));
          const openBtn = el(
            "button",
            "model-btn",
            view.open ? "Close" : "Open",
          );
          openBtn.type = "button";
          openBtn.addEventListener("click", () => {
            try {
              if (view.open) viewsRef.close(id);
              else viewsRef.open(id);
              updateRequested.trigger();
            } catch (e) {
              panelHelpers.setStatus(errorText(e), true);
            }
          });
          const remove = el("button", "model-btn", "×");
          remove.type = "button";
          remove.title = "Delete view";
          remove.addEventListener("click", () => {
            viewsRef.list.delete(id);
            updateRequested.trigger();
          });
          row.append(openBtn, remove);
          listRoot.append(row);
        }
      };

      updateRequested.add(render);
      render();
      return {
        update: render,
        dispose: () => updateRequested.remove(render),
      };
    },
  };
}

function createViewpointsAddOn(ctx: AddOnsContext): AddOnDef {
  const updateRequested = new OBC.Event<void>();
  let viewpoints: OBC.Viewpoints | null = null;

  return {
    id: "viewpoints",
    name: "Viewpoints",
    create: () => {
      viewpoints = ctx.components.get(OBC.Viewpoints);
      viewpoints.world = ctx.world;
      viewpoints.list.onItemSet.add(() => updateRequested.trigger());
      viewpoints.list.onItemDeleted.add(() => updateRequested.trigger());
      viewpoints.list.onItemUpdated.add(() => updateRequested.trigger());
      return {
        component: viewpoints,
        enable: async () => {
          viewpoints.world = ctx.world;
        },
        disable: async () => {},
        onModelRemoved: async () => updateRequested.trigger(),
      };
    },
    panel: (root, panelHelpers) => {
      const hint = el(
        "p",
        "addon-hint",
        "Save the current camera as a viewpoint and jump back to it later",
      );
      const actions = el("div", "addon-actions");
      const saveBtn = el("button", "model-btn", "Save viewpoint");
      saveBtn.type = "button";
      saveBtn.addEventListener("click", () => {
        if (!viewpoints) return;
        saveBtn.classList.add("disabled");
        const viewpoint = viewpoints.create();
        viewpoint.title = `Viewpoint ${viewpoints.list.size}`;
        viewpoint
          .updateCamera(false)
          .then(() => {
            panelHelpers.setStatus(`"${viewpoint.title}" saved`);
            updateRequested.trigger();
          })
          .catch((e) => panelHelpers.setStatus(errorText(e), true))
          .finally(() => saveBtn.classList.remove("disabled"));
      });
      const clearBtn = el("button", "model-btn", "Clear");
      clearBtn.type = "button";
      clearBtn.addEventListener("click", () => {
        if (!viewpoints) return;
        for (const guid of [...viewpoints.list.keys()]) {
          viewpoints.list.delete(guid);
        }
        viewpoints.snapshots.clear();
        updateRequested.trigger();
      });
      actions.append(saveBtn, clearBtn);

      const listRoot = el("div", "addon-rows");
      root.append(hint, actions, listRoot);

      const render = () => {
        listRoot.replaceChildren();
        if (!panelHelpers.hasModels()) {
          listRoot.append(
            el("p", "addon-hint", "Load an IFC to use this tool"),
          );
          return;
        }
        if (!viewpoints || !viewpoints.list.size) {
          listRoot.append(el("p", "addon-hint", "No viewpoints yet"));
          return;
        }
        const viewpointsRef = viewpoints;
        for (const [guid, viewpoint] of viewpointsRef.list) {
          const row = el("div", "addon-row");
          row.append(
            el("span", "addon-value", viewpoint.title ?? guid.slice(0, 8)),
          );
          const goBtn = el("button", "model-btn", "Go");
          goBtn.type = "button";
          goBtn.addEventListener("click", () => {
            goBtn.classList.add("disabled");
            viewpoint
              .go()
              .then(() => panelHelpers.setStatus("Viewpoint applied"))
              .catch((e) => panelHelpers.setStatus(errorText(e), true))
              .finally(() => goBtn.classList.remove("disabled"));
          });
          const remove = el("button", "model-btn", "×");
          remove.type = "button";
          remove.title = "Delete viewpoint";
          remove.addEventListener("click", () => {
            viewpointsRef.list.delete(guid);
            updateRequested.trigger();
          });
          row.append(goBtn, remove);
          listRoot.append(row);
        }
      };

      updateRequested.add(render);
      render();
      return {
        update: render,
        dispose: () => updateRequested.remove(render),
      };
    },
  };
}

function createMarkerAddOn(ctx: AddOnsContext): AddOnDef {
  const updateRequested = new OBC.Event<void>();
  let marker: Marker | null = null;
  let threshold = 50;

  const worldMarkers = () => marker?.list.get(ctx.world.uuid)?.size ?? 0;

  const clearMarkers = () => {
    marker?.dispose();
    ctx.fragments.core.update(true);
  };

  const markModels = () => {
    if (!marker) return;
    for (const [modelId, model] of ctx.fragments.list) {
      const element = document.createElement("div");
      element.textContent = modelId;
      element.style.cssText =
        "background:#27405f;color:#cfe1ff;border:1px solid #3f6fae;" +
        "border-radius:6px;padding:2px 6px;font-size:11px;white-space:nowrap;" +
        "pointer-events:none;";
      marker.create(
        ctx.world,
        element,
        model.box.getCenter(new THREE.Vector3()),
      );
    }
    marker.cluster(ctx.world);
    ctx.fragments.core.update(true);
  };

  return {
    id: "marker",
    name: "Marker",
    create: () => {
      marker = ctx.components.get(Marker);
      marker.threshold = threshold;
      return {
        component: marker,
        enable: async () => {
          marker.threshold = threshold;
        },
        disable: async () => clearMarkers(),
        onModelRemoved: async () => {
          clearMarkers();
          updateRequested.trigger();
        },
      };
    },
    panel: (root, panelHelpers) => {
      const thresholdRow = el("div", "addon-row");
      thresholdRow.append(el("span", "addon-key", "Threshold"));
      const thresholdInput = document.createElement("input");
      thresholdInput.type = "number";
      thresholdInput.className = "addon-number";
      thresholdInput.min = "5";
      thresholdInput.max = "500";
      thresholdInput.value = String(threshold);
      thresholdInput.addEventListener("change", () => {
        const value = Number(thresholdInput.value);
        if (Number.isFinite(value) && value > 0) threshold = value;
        thresholdInput.value = String(threshold);
        if (marker) marker.threshold = threshold;
      });
      thresholdRow.append(thresholdInput);

      const actions = el("div", "addon-actions");
      const markBtn = el("button", "model-btn", "Mark models");
      markBtn.type = "button";
      markBtn.addEventListener("click", () => {
        try {
          markModels();
          updateRequested.trigger();
          panelHelpers.setStatus(`${worldMarkers()} markers in the scene`);
        } catch (e) {
          panelHelpers.setStatus(errorText(e), true);
        }
      });
      const clearBtn = el("button", "model-btn", "Clear");
      clearBtn.type = "button";
      clearBtn.addEventListener("click", () => {
        clearMarkers();
        updateRequested.trigger();
      });
      actions.append(markBtn, clearBtn);

      const hint = el("p", "addon-hint");
      root.append(thresholdRow, actions, hint);

      return {
        update: () => {
          const count = worldMarkers();
          if (!panelHelpers.hasModels()) {
            hint.textContent = "Load an IFC to use this tool";
          } else if (count) {
            hint.textContent = `${count} markers (labels merge below the threshold)`;
          } else {
            hint.textContent =
              "Press Mark models to drop a label on every model";
          }
        },
        dispose: () => {},
      };
    },
  };
}
