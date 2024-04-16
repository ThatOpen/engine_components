import * as THREE from "three";
import {
  Component,
  Configurable,
  Disposable,
  Event,
  UI,
  UIElement,
} from "../../base-types";
import {
  Button,
  ColorInput,
  FloatingWindow,
  RangeInput,
  SimpleUIComponent,
  TextInput,
} from "../../ui";
import { Components, ToolComponent } from "../../core";
import { EdgesClipper } from "../../navigation/EdgesClipper";
import { FragmentManager } from "../FragmentManager";
import { FragmentClassifier } from "../FragmentClassifier";

export interface ClipStyleCardData {
  name: string;
  fillColor: string;
  lineColor: string;
  lineThickness: number;
  categories: string;
}

export interface FragmentClipStylerConfig {
  force: boolean;
}

export class FragmentClipStyler
  extends Component<ClipStyleCardData[]>
  implements UI, Disposable, Configurable<FragmentClipStylerConfig>
{
  static readonly uuid = "14de9fbd-2151-4c01-8e07-22a2667e1126" as const;

  readonly onChange = new Event();

  /** {@link Disposable.onDisposed} */
  readonly onDisposed = new Event<string>();

  /** {@link Configurable.isSetup} */
  isSetup = false;

  enabled = true;

  localStorageID = "FragmentClipStyler";

  styleCards: {
    [id: string]: {
      styleCard: SimpleUIComponent<any>;
      name: TextInput;
      lineThickness: RangeInput;
      categories: TextInput;
      deleteButton: Button;
      lineColor: ColorInput;
      fillColor: ColorInput;
    };
  } = {};

  uiElement = new UIElement<{
    mainButton: Button;
    mainWindow: FloatingWindow;
  }>();

  private _defaultStyles = `
     {
        "B0ebxzZQvZ": {
            "name": "thick",
            "lineColor": "#36593e",
            "lineThickness": 0.5,
            "fillColor": "#ccdb9a",
            "categories": "IFCWALLSTANDARDCASE, IFCWALL,IFCSLAB, IFCROOF"
        },
        "kG9B1Ojv08": {
            "name": "thin",
            "lineColor": "#92a59b",
            "lineThickness": 0.25,
            "fillColor": "#e6ffdb",
            "categories": "IFCWINDOW, IFCDOOR, IFCBUILDINGELEMENTPROXY"
        }
    }
  `;

  constructor(components: Components) {
    super(components);

    this.components.tools.add(FragmentClipStyler.uuid, this);

    if (components.uiEnabled) {
      this.setupUI(components);
    }
  }

  config: FragmentClipStylerConfig = {
    force: false,
  };
  readonly onSetup = new Event<FragmentClipStyler>();
  async setup(config?: Partial<FragmentClipStylerConfig>) {
    this.config = { ...this.config, ...config };
    const { force } = this.config;
    const noCards = Object.keys(this.styleCards).length === 0;
    if (force || noCards) {
      localStorage.setItem(this.localStorageID, this._defaultStyles);
      await this.loadCachedStyles();
    }
    this.isSetup = true;
    await this.onSetup.trigger(this);
  }

  get() {
    const saved = localStorage.getItem(this.localStorageID);
    if (saved) {
      const parsed = JSON.parse(saved) as any;
      return Object.values(parsed) as ClipStyleCardData[];
    }
    return [];
  }

  async dispose() {
    for (const id in this.styleCards) {
      await this.deleteStyleCard(id, false);
    }
    await this.uiElement.dispose();
    this.onChange.reset();
    await this.onDisposed.trigger(FragmentClipStyler.uuid);
    this.onDisposed.reset();
  }

  async update(ids = Object.keys(this.styleCards)) {
    const clipper = this.components.tools.get(EdgesClipper);
    const fragments = this.components.tools.get(FragmentManager);
    const classifier = this.components.tools.get(FragmentClassifier);

    for (const id of ids) {
      const card = this.styleCards[id];
      if (!card) return;

      const allStyles = clipper.styles.get();
      const style = allStyles[id];
      if (!style) return;

      style.meshes.clear();

      const categoryList = card.categories.value.split(",");
      const entities = categoryList.map((item) => item.replace(" ", ""));

      const found = classifier.find({ entities });
      for (const fragID in found) {
        const frag = fragments.list[fragID];
        if (!frag) continue;
        const { mesh } = frag;
        style.fragments[fragID] = new Set(found[fragID]);
        style.meshes.add(mesh);
      }
    }

    await clipper.updateEdges(true);
    this.cacheStyles();
  }

  async loadCachedStyles() {
    const savedData = localStorage.getItem(this.localStorageID);
    if (savedData) {
      const savedStyles = JSON.parse(savedData);
      for (const id in savedStyles) {
        const savedStyle = savedStyles[id] as ClipStyleCardData;
        await this.createStyleCard(savedStyle);
      }
    }
  }

  private setupUI(components: Components) {
    const mainWindow = new FloatingWindow(components);
    mainWindow.title = "Clipping styles";

    mainWindow.visible = false;
    components.ui.add(mainWindow);

    mainWindow.domElement.style.width = "530px";
    mainWindow.domElement.style.height = "400px";

    const mainButton = new Button(components, {
      materialIconName: "format_paint",
      tooltip: "Clipping styles",
    });

    mainButton.onClick.add(() => {
      mainWindow.visible = !mainWindow.visible;
    });

    const topButtonContainerHtml = `<div class="flex"></div>`;
    const topButtonContainer = new SimpleUIComponent(
      components,
      topButtonContainerHtml
    );

    const createButton = new Button(components, {
      materialIconName: "add",
    });
    createButton.onClick.add(() => this.createStyleCard());
    topButtonContainer.addChild(createButton);

    mainWindow.addChild(topButtonContainer);

    this.uiElement.set({ mainWindow, mainButton });
  }

  private cacheStyles() {
    const styles: { [id: string]: ClipStyleCardData } = {};
    for (const id in this.styleCards) {
      const styleCard = this.styleCards[id];
      styles[id] = {
        name: styleCard.name.value,
        lineColor: styleCard.lineColor.value,
        lineThickness: styleCard.lineThickness.value,
        fillColor: styleCard.fillColor.value,
        categories: styleCard.categories.value,
      };
    }
    const serialized = JSON.stringify(styles);
    localStorage.setItem(this.localStorageID, serialized);
  }

  private async deleteStyleCard(id: string, updateCache = true) {
    const found = this.styleCards[id];
    const clipper = this.components.tools.get(EdgesClipper);
    clipper.styles.deleteStyle(id, true);
    if (found) {
      await found.styleCard.dispose();
      await found.deleteButton.dispose();
      await found.name.dispose();
      await found.categories.dispose();
      await found.lineThickness.dispose();
      await found.lineColor.dispose();
      await found.fillColor.dispose();
    }
    delete this.styleCards[id];
    await clipper.updateEdges(true);
    if (updateCache) {
      this.cacheStyles();
    }
  }

  private async createStyleCard(config?: ClipStyleCardData) {
    const styleCard = new SimpleUIComponent(this.components);
    const { id } = styleCard;

    const styleRowClass = `flex gap-4`;
    styleCard.domElement.className = `m-4 p-4 border-1 border-solid border-[#3A444E] rounded-md flex flex-col gap-4`;

    styleCard.domElement.innerHTML = `
        <div id="first-row-${id}" class="${styleRowClass}">
        </div>
        <div class="${styleRowClass}">
            <div id="name-${id}" class="flex-1">
            </div>
            <div id="line-color-${id}">
            </div>
        </div>
        <div class="${styleRowClass}">
            <div id="range-${id}" class="flex-1">
            </div>
            <div id="fill-color-${id}">
            </div>
        </div>
        <div id="categories-${id}">
        </div>
    `;

    const deleteButton = new Button(this.components, {
      materialIconName: "close",
    });

    deleteButton.onClick.add(() => this.deleteStyleCard(id));

    const firstRow = styleCard.getInnerElement("first-row");
    if (firstRow) {
      firstRow.insertBefore(deleteButton.domElement, firstRow.firstChild);
    }

    const nameInput = new TextInput(this.components);
    nameInput.label = "Name";
    if (config) {
      nameInput.value = config.name;
    }

    const name = styleCard.getInnerElement(`name`);
    if (name) {
      name.append(nameInput.domElement);
    }

    nameInput.domElement.addEventListener("focusout", () => this.cacheStyles());

    const lineColor = new ColorInput(this.components);
    lineColor.label = "Line color";

    const lineColorContainer = styleCard.getInnerElement("line-color");
    if (lineColorContainer) {
      lineColorContainer.append(lineColor.domElement);
    }
    lineColor.value = config ? config.lineColor : "#808080";

    const fillColor = new ColorInput(this.components);
    fillColor.label = "Fill color";

    if (config) {
      fillColor.value = config.fillColor;
    }

    const fillColorContainer = styleCard.getInnerElement("fill-color");
    if (fillColorContainer) {
      fillColorContainer.append(fillColor.domElement);
    }

    const lineThickness = new RangeInput(this.components);
    lineThickness.label = "Line thickness";
    lineThickness.min = 0;
    lineThickness.max = 1;
    lineThickness.step = 0.05;

    lineThickness.value = config ? config.lineThickness : 0.25;

    const range = styleCard.getInnerElement("range");
    if (range) {
      range.append(lineThickness.domElement);
    }

    const categories = new TextInput(this.components);
    categories.label = "Categories";

    const categoriesContainer = styleCard.getInnerElement("categories");
    if (categoriesContainer) {
      categoriesContainer.append(categories.domElement);
    }

    this.styleCards[id] = {
      styleCard,
      name: nameInput,
      lineThickness,
      categories,
      deleteButton,
      fillColor,
      lineColor,
    };

    this.uiElement.get("mainWindow").addChild(styleCard);

    // this._clipper.styles.dispose();

    const fillMaterial = new THREE.MeshBasicMaterial({
      color: fillColor.value,
      side: 2,
    });

    let saveTimer: ReturnType<typeof setTimeout>;

    const saveStyles = () => {
      if (saveTimer) {
        clearTimeout(saveTimer);
      }
      saveTimer = setTimeout(() => this.cacheStyles(), 2000);
    };

    fillColor.onChange.add(() => {
      fillMaterial.color.set(fillColor.value);
      saveStyles();
      this.onChange.trigger();
    });

    const lineMaterial = new THREE.LineBasicMaterial({
      color: lineColor.value,
    });

    const outlineMaterial = new THREE.MeshBasicMaterial({
      color: lineColor.value,
      opacity: lineThickness.value,
      side: 2,
      transparent: true,
    });

    lineThickness.onChange.add(() => {
      outlineMaterial.opacity = lineThickness.value;
      saveStyles();
      this.onChange.trigger();
    });

    lineColor.onChange.add(() => {
      lineMaterial.color.set(lineColor.value);
      outlineMaterial.color.set(lineColor.value);
      saveStyles();
      this.onChange.trigger();
    });

    const clipper = this.components.tools.get(EdgesClipper);

    clipper.styles.create(
      id,
      new Set(),
      lineMaterial,
      fillMaterial,
      outlineMaterial
    );

    categories.domElement.addEventListener("focusout", () => this.update([id]));

    if (config) {
      categories.value = config.categories;
    }

    this.cacheStyles();
  }
}

ToolComponent.libraryUUIDs.add(FragmentClipStyler.uuid);
