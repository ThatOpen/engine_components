import * as THREE from "three";
import { EdgesClipper } from "../../navigation";
import { FragmentManager } from "../FragmentManager";
import { Disposable, UI } from "../../base-types";
import {
  Button,
  ColorInput,
  FloatingWindow,
  RangeInput,
  SimpleUIComponent,
  TextInput,
} from "../../ui";
import { Components } from "../../core";
import { FragmentClassifier } from "../FragmentClassifier";

export interface ClipStyleCardData {
  name: string;
  fillColor: string;
  lineColor: string;
  lineThickness: number;
  categories: string;
}

export class FragmentClipStyler implements UI, Disposable {
  _fragments: FragmentManager;
  _clipper: EdgesClipper;
  _components: Components;
  _classifier: FragmentClassifier;
  _localStorageID = "FragmentClipStyler";

  _styleCards: {
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

  uiElement: {
    mainButton: Button;
    mainWindow: FloatingWindow;
  };

  constructor(
    components: Components,
    fragments: FragmentManager,
    classifier: FragmentClassifier,
    clipper: EdgesClipper
  ) {
    this._components = components;
    this._fragments = fragments;
    this._clipper = clipper;
    this._classifier = classifier;

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

    mainButton.onclick = () => {
      mainWindow.visible = !mainWindow.visible;
    };

    const topButtonContainerHtml = `<div class="flex"></div>`;
    const topButtonContainer = new SimpleUIComponent(
      components,
      topButtonContainerHtml
    );

    const createButton = new Button(components, {
      materialIconName: "add",
    });
    createButton.onclick = () => this.createStyleCard();
    topButtonContainer.addChild(createButton);

    mainWindow.addChild(topButtonContainer);

    this.uiElement = { mainWindow, mainButton };

    this.loadCachedStyles();
  }

  dispose() {
    for (const id in this._styleCards) {
      this.deleteStyleCard(id, false);
    }
    this.uiElement.mainWindow.dispose();
    this.uiElement.mainButton.dispose();
    (this._clipper as any) = null;
    (this._classifier as any) = null;
    (this._components as any) = null;
    (this._fragments as any) = null;
  }

  private loadCachedStyles() {
    const savedData = localStorage.getItem(this._localStorageID);
    if (savedData) {
      const savedStyles = JSON.parse(savedData);
      for (const id in savedStyles) {
        const savedStyle = savedStyles[id] as ClipStyleCardData;
        this.createStyleCard(savedStyle);
      }
    }
  }

  private cacheStyles() {
    const styles: { [id: string]: ClipStyleCardData } = {};
    for (const id in this._styleCards) {
      const styleCard = this._styleCards[id];
      styles[id] = {
        name: styleCard.name.value,
        lineColor: styleCard.lineColor.value,
        lineThickness: styleCard.lineThickness.value,
        fillColor: styleCard.fillColor.value,
        categories: styleCard.categories.value,
      };
    }
    const serialized = JSON.stringify(styles);
    localStorage.setItem(this._localStorageID, serialized);
  }

  private deleteStyleCard(id: string, updateCache = true) {
    const found = this._styleCards[id];
    this._clipper.styles.deleteStyle(id, true);
    if (found) {
      found.styleCard.dispose();
      found.deleteButton.dispose();
      found.name.dispose();
      found.categories.dispose();
      found.lineThickness.dispose();
      found.lineColor.dispose();
      found.fillColor.dispose();
    }
    delete this._styleCards[id];
    this._clipper.updateEdges(true);
    if (updateCache) {
      this.cacheStyles();
    }
  }

  private createStyleCard(config?: ClipStyleCardData) {
    const styleCard = new SimpleUIComponent(this._components);
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

    const deleteButton = new Button(this._components, {
      materialIconName: "close",
    });

    deleteButton.onclick = () => this.deleteStyleCard(id);

    const firstRow = styleCard.getInnerElement("first-row");
    if (firstRow) {
      firstRow.insertBefore(deleteButton.domElement, firstRow.firstChild);
    }

    const nameInput = new TextInput(this._components);
    nameInput.label = "Name";
    if (config) {
      nameInput.value = config.name;
    }

    const name = styleCard.getInnerElement(`name`);
    if (name) {
      name.append(nameInput.domElement);
    }

    const lineColor = new ColorInput(this._components);
    lineColor.label = "Line color";

    const lineColorContainer = styleCard.getInnerElement("line-color");
    if (lineColorContainer) {
      lineColorContainer.append(lineColor.domElement);
    }
    lineColor.value = config ? config.lineColor : "#808080";

    const fillColor = new ColorInput(this._components);
    fillColor.label = "Fill color";

    if (config) {
      fillColor.value = config.fillColor;
    }

    const fillColorContainer = styleCard.getInnerElement("fill-color");
    if (fillColorContainer) {
      fillColorContainer.append(fillColor.domElement);
    }

    const lineThickness = new RangeInput(this._components);
    lineThickness.label = "Line thickness";
    lineThickness.min = 0;
    lineThickness.max = 1;
    lineThickness.step = 0.05;

    lineThickness.value = config ? config.lineThickness : 0.25;

    const range = styleCard.getInnerElement("range");
    if (range) {
      range.append(lineThickness.domElement);
    }

    const categories = new TextInput(this._components);
    categories.label = "Categories";

    const categoriesContainer = styleCard.getInnerElement("categories");
    if (categoriesContainer) {
      categoriesContainer.append(categories.domElement);
    }

    this._styleCards[id] = {
      styleCard,
      name: nameInput,
      lineThickness,
      categories,
      deleteButton,
      fillColor,
      lineColor,
    };

    this.uiElement.mainWindow.addChild(styleCard);

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

    fillColor.onChange.on(() => {
      fillMaterial.color.set(fillColor.value);
      saveStyles();
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

    lineThickness.onChange.on(() => {
      outlineMaterial.opacity = lineThickness.value;
      saveStyles();
    });

    lineColor.onChange.on(() => {
      lineMaterial.color.set(lineColor.value);
      outlineMaterial.color.set(lineColor.value);
      saveStyles();
    });

    const style = this._clipper.styles.create(
      id,
      new Set(),
      lineMaterial,
      fillMaterial,
      outlineMaterial
    );

    const updateCategory = () => {
      style.meshes.clear();

      const categoryList = categories.value.split(",");
      const entities = categoryList.map((item) => item.replace(" ", ""));

      const found = this._classifier.find({ entities });
      for (const fragID in found) {
        const { mesh } = this._fragments.list[fragID];
        style.fragments[fragID] = new Set(found[fragID]);
        style.meshes.add(mesh);
      }
      this._clipper.updateEdges(true);

      this.cacheStyles();
    };

    categories.domElement.addEventListener("focusout", updateCategory);

    if (config) {
      categories.value = config.categories;
      updateCategory();
    }

    this.cacheStyles();
  }
}
