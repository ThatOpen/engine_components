import * as THREE from "three";
import { EdgesClipper } from "../../navigation";
import { FragmentManager } from "../FragmentManager";
import { UI } from "../../base-types";
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

export class FragmentClipStyler implements UI {
  _fragments: FragmentManager;
  _clipper: EdgesClipper;
  _components: Components;
  _classifier: FragmentClassifier;

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

    const mainWindow = new FloatingWindow(components, {
      title: "Clipping styles",
    });

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

    const topButtonContainerDom = document.createElement("div");
    topButtonContainerDom.className = "flex";
    const topButtonContainer = new SimpleUIComponent(
      components,
      topButtonContainerDom
    );

    const createButton = new Button(components, {
      materialIconName: "add",
    });
    createButton.onclick = () => this.createStyle();
    topButtonContainer.addChild(createButton);

    mainWindow.addChild(topButtonContainer);

    this.uiElement = { mainWindow, mainButton };
  }

  private deleteStyle(id: string) {
    const found = this._styleCards[id];
    if (found) {
      found.styleCard.dispose();
      found.deleteButton.dispose();
      found.name.dispose();
      found.categories.dispose();
      found.lineThickness.dispose();
      found.lineColor.dispose();
      found.fillColor.dispose();
    }
  }

  private createStyle() {
    const styleCardDom = document.createElement("div");
    const styleCard = new SimpleUIComponent(this._components, styleCardDom);
    const { id } = styleCard;

    styleCardDom.className = `m-4 p-4 border-1 border-solid border-[#3A444E] rounded-md flex flex-col gap-4 
      bg-ifcjs-100
    `;

    const styleRowClass = `flex gap-4`;

    styleCardDom.innerHTML = `
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
    deleteButton.onclick = () => this.deleteStyle(id);
    const firstRow = styleCardDom.querySelector(`#first-row-${id}`);
    if (firstRow) {
      firstRow.insertBefore(deleteButton.domElement, firstRow.firstChild);
    }

    const nameInput = new TextInput(this._components, {
      name: "Name",
      label: "Name",
    });
    const name = styleCardDom.querySelector(`#name-${id}`);
    if (name) {
      name.append(nameInput.domElement);
    }

    const lineColor = new ColorInput(this._components, {
      label: "Line color",
    });
    const lineColorContainer = styleCardDom.querySelector(`#line-color-${id}`);
    if (lineColorContainer) {
      lineColorContainer.append(lineColor.domElement);
    }

    const fillColor = new ColorInput(this._components, {
      label: "Fill color",
    });
    const fillColorContainer = styleCardDom.querySelector(`#fill-color-${id}`);
    if (fillColorContainer) {
      fillColorContainer.append(fillColor.domElement);
    }

    const lineThickness = new RangeInput(this._components, {
      label: "Line thickness",
      min: 0,
      max: 1,
      step: 0.05,
    });
    const range = styleCardDom.querySelector(`#range-${id}`);
    if (range) {
      range.append(lineThickness.domElement);
    }

    const categories = new TextInput(this._components, {
      name: "Categories",
      label: "Categories",
    });
    const categoriesContainer = styleCardDom.querySelector(`#categories-${id}`);
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
      color: fillColor.inputValue,
      side: 2,
    });

    fillColor.onChange.on(() => {
      fillMaterial.color.set(fillColor.inputValue);
    });

    const lineMaterial = new THREE.LineBasicMaterial({
      color: lineColor.inputValue,
    });

    const outlineMaterial = new THREE.MeshBasicMaterial({
      color: lineColor.inputValue,
      opacity: lineThickness.inputValue,
      side: 2,
      transparent: true,
    });

    lineThickness.onChange.on(() => {
      outlineMaterial.opacity = lineThickness.inputValue;
    });

    lineColor.onChange.on(() => {
      lineMaterial.color.set(lineColor.inputValue);
      outlineMaterial.color.set(lineColor.inputValue);
    });

    const style = this._clipper.styles.create(
      id,
      new Set(),
      lineMaterial,
      fillMaterial,
      outlineMaterial
    );

    categories.domElement.addEventListener("focusout", () => {
      style.meshes.clear();
      const categoryList = categories.inputValue.replace(" ", "").split(",");
      const found = this._classifier.find({ entities: categoryList });
      for (const fragID in found) {
        const { mesh } = this._fragments.list[fragID];
        style.fragments[fragID] = new Set(found[fragID]);
        style.meshes.add(mesh);
      }
      this._clipper.updateEdges(true);
    });
  }
}
