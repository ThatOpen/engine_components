import * as THREE from "three";
import { FragmentsGroup } from "bim-fragment";
import { Components, Simple2DScene, ToolComponent } from "../../core";
import { Component, UI, UIElement } from "../../base-types";
import { FloatingWindow } from "../../ui";

export class RoadNavigator extends Component<any> implements UI {
  /** {@link Component.uuid} */
  static readonly uuid = "85f2c89c-4c6b-4c7d-bc20-5b675874b228" as const;

  enabled = true;

  uiElement = new UIElement<{
    horizontalAlignment: FloatingWindow;
  }>();

  private _horizontalScene: Simple2DScene;

  constructor(components: Components) {
    super(components);

    this.components.tools.add(RoadNavigator.uuid, this);

    this._horizontalScene = new Simple2DScene(this.components, false);

    if (this.components.uiEnabled) {
      this.setUI();
    }
  }

  get() {}

  select(model: FragmentsGroup) {
    if (!model.ifcCivil) {
      console.warn("The provided model doesn't have civil data!");
      return;
    }
    if (!this._horizontalScene) {
      throw new Error("Civil horizontal scene not initialized");
    }
    const hGeometry = new THREE.BufferGeometry();
    const hMaterial = new THREE.LineBasicMaterial();
    const hLineSegments = new THREE.LineSegments(hGeometry, hMaterial);
    const horizontalRoot = this._horizontalScene.get();
    horizontalRoot.add(hLineSegments);

    const hCoords: number[] = [];
    const hIndex: number[] = [];

    const { horizontalAlignments } = model.ifcCivil;

    const { coordinates, curveIndex } = horizontalAlignments;

    const offsetX = coordinates[0];
    const offsetY = coordinates[1];

    let isSegmentStart = true;
    const last = coordinates.length / 2 - 1;
    for (let i = 0; i < curveIndex.length; i++) {
      const start = curveIndex[i];
      const isLast = i === curveIndex.length - 1;
      const end = isLast ? last : curveIndex[i + 1];
      isSegmentStart = true;
      for (let j = start; j < end; j++) {
        const x = coordinates[j * 2] - offsetX;
        const y = coordinates[j * 2 + 1] - offsetY;
        hCoords.push(x, y, 0);
        if (isSegmentStart) {
          isSegmentStart = false;
        } else {
          hIndex.push(j - 1, j);
        }
      }
    }

    const hCoordsBuffer = new Float32Array(hCoords);
    const hCoordsAttr = new THREE.BufferAttribute(hCoordsBuffer, 3);
    hGeometry.setAttribute("position", hCoordsAttr);
    hGeometry.setIndex(hIndex);
  }

  private setUI() {
    const horizontalAlignment = new FloatingWindow(this.components);
    this.components.ui.add(horizontalAlignment);
    horizontalAlignment.visible = false;
    horizontalAlignment.domElement.style.height = "20rem";
    const horContainer = this._horizontalScene.uiElement.get("container");
    horizontalAlignment.addChild(horContainer);

    horizontalAlignment.onResized.add(() =>
      this._horizontalScene.grid.regenerate()
    );

    if (this.components.renderer.isUpdateable()) {
      this.components.renderer.onAfterUpdate.add(async () => {
        if (horizontalAlignment.visible) {
          await this._horizontalScene.update();
        }
      });
    }

    horizontalAlignment.slots.content.domElement.style.padding = "0";
    horizontalAlignment.slots.content.domElement.style.overflow = "hidden";

    horizontalAlignment.onResized.add(() => {
      const { width, height } = horizontalAlignment.containerSize;
      this._horizontalScene.setSize(height, width);
    });

    horizontalAlignment.domElement.style.width = "20rem";
    horizontalAlignment.domElement.style.height = "20rem";

    horizontalAlignment.onVisible.add(() => {
      if (horizontalAlignment.visible) {
        this._horizontalScene.grid.regenerate();
      }
    });

    this.uiElement.set({
      horizontalAlignment,
    });
  }
}

ToolComponent.libraryUUIDs.add(RoadNavigator.uuid);
