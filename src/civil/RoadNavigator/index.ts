import * as THREE from "three";
import { FragmentsGroup, IfcAlignmentData } from "bim-fragment";
import { Components, Simple2DScene, ToolComponent } from "../../core";
import { Component, UI, UIElement } from "../../base-types";
import { Drawer, FloatingWindow } from "../../ui";

export class RoadNavigator extends Component<any> implements UI {
  /** {@link Component.uuid} */
  static readonly uuid = "85f2c89c-4c6b-4c7d-bc20-5b675874b228" as const;

  enabled = true;

  uiElement = new UIElement<{
    horizontalAlignment: FloatingWindow;
    verticalAlignment: Drawer;
  }>();

  private _selected: FragmentsGroup | null = null;

  private _points: {
    horizontal: THREE.Points;
  };

  private _scenes: {
    horizontal: Simple2DScene;
    vertical: Simple2DScene;
  };

  private _alignments: {
    horizontal: THREE.LineSegments;
    vertical: THREE.LineSegments;
  };

  private _caster = new THREE.Raycaster();

  constructor(components: Components) {
    super(components);

    const threshold = 5;
    this._caster.params.Line = { threshold };

    this.components.tools.add(RoadNavigator.uuid, this);

    this._scenes = {
      horizontal: new Simple2DScene(this.components, false),
      vertical: new Simple2DScene(this.components, false),
    };

    this._points = {
      horizontal: new THREE.Points(
        new THREE.BufferGeometry(),
        new THREE.PointsMaterial({
          size: 10,
        })
      ),
    };
    this._points.horizontal.frustumCulled = false;
    this._scenes.horizontal.scene.add(this._points.horizontal);

    this._alignments = {
      horizontal: new THREE.LineSegments(
        new THREE.BufferGeometry(),
        new THREE.LineBasicMaterial()
      ),
      vertical: new THREE.LineSegments(
        new THREE.BufferGeometry(),
        new THREE.LineBasicMaterial()
      ),
    };

    this._scenes.vertical.get().add(this._alignments.vertical);
    this._scenes.horizontal.get().add(this._alignments.horizontal);

    const hRenderer = this._scenes.horizontal.renderer.get();
    const hCamera = this._scenes.horizontal.camera;
    hRenderer.domElement.addEventListener("click", (event) => {
      if (!this._selected || !this._selected.ifcCivil) return;
      const lim = hRenderer.domElement.getBoundingClientRect();
      const y = -((event.clientY - lim.top) / (lim.bottom - lim.top)) * 2 + 1;
      const x = ((event.clientX - lim.left) / (lim.right - lim.left)) * 2 - 1;
      const position = new THREE.Vector2(x, y);
      this._caster.setFromCamera(position, hCamera);
      const result = this._caster.intersectObject(this._alignments.horizontal);
      if (result.length) {
        console.log(result);
        const { index, point } = result[0];
        if (index === undefined) return;
        const geom = this._alignments.horizontal.geometry;
        if (!geom.index) return;

        const pos = geom.attributes.position;
        const pointIndex1 = geom.index.array[index];
        const pointIndex2 = geom.index.array[index + 1];
        const x1 = pos.getX(pointIndex1);
        const y1 = pos.getY(pointIndex1);
        const x2 = pos.getX(pointIndex2);
        const y2 = pos.getY(pointIndex2);
        const dist1 = new THREE.Vector3(x1, y1, 0).distanceTo(point);
        const dist2 = new THREE.Vector3(x2, y2, 0).distanceTo(point);

        const isFirst = dist1 < dist2;
        const x = isFirst ? x1 : x2;
        const y = isFirst ? y1 : y2;

        const { horizontal } = this._points;
        const coordsBuffer = new Float32Array([x, y, 0]);
        const coordsAttr = new THREE.BufferAttribute(coordsBuffer, 3);
        horizontal.geometry.setAttribute("position", coordsAttr);

        // const { alignmentIndex } = this._selected.ifcCivil.horizontalAlignments;
        // let counter = 0;
        // for (let i = 0; i < alignmentIndex.length; i++) {
        // const currentAlignment = alignmentIndex[i];
        // if (currentAlignment > index) {
        //   console.log(`Selected alignment: ${counter - 1}`);
        //   break;
        // }
        // counter++;
        // }
      }
    });

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

    this._selected = model;

    this.getAlignmentGeometry(
      model.ifcCivil.horizontalAlignments,
      this._alignments.horizontal.geometry
    );
  }

  setAnchor() {
    if (!this._selected) return;
    const result = this.components.raycaster.castRay([this._selected]);
    if (result === null) return;
    console.log(result);
  }

  private getAlignmentGeometry(
    alignment: IfcAlignmentData,
    geometry: THREE.BufferGeometry
  ) {
    const data = this.getAlignmentData(alignment);
    const coordsBuffer = new Float32Array(data.coords);
    const coordsAttr = new THREE.BufferAttribute(coordsBuffer, 3);
    geometry.setAttribute("position", coordsAttr);
    geometry.setIndex(data.index);
  }

  private getAlignmentData(alignment: IfcAlignmentData) {
    const coords: number[] = [];
    const index: number[] = [];
    const { coordinates, curveIndex } = alignment;
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
        coords.push(x, y, 0);
        if (isSegmentStart) {
          isSegmentStart = false;
        } else {
          index.push(j - 1, j);
        }
      }
    }
    return { coords, index };
  }

  private setUI() {
    const horizontalAlignment = new FloatingWindow(this.components);
    this.components.ui.add(horizontalAlignment);
    horizontalAlignment.visible = false;
    const hContainer = this._scenes.horizontal.uiElement.get("container");
    horizontalAlignment.addChild(hContainer);

    horizontalAlignment.onResized.add(() =>
      this._scenes.horizontal.grid.regenerate()
    );

    horizontalAlignment.slots.content.domElement.style.padding = "0";
    horizontalAlignment.slots.content.domElement.style.overflow = "hidden";

    horizontalAlignment.onResized.add(() => {
      const { width, height } = horizontalAlignment.containerSize;
      this._scenes.horizontal.setSize(height, width);
    });

    horizontalAlignment.domElement.style.width = "20rem";
    horizontalAlignment.domElement.style.height = "20rem";

    horizontalAlignment.onVisible.add(() => {
      if (horizontalAlignment.visible) {
        this._scenes.horizontal.grid.regenerate();
      }
    });

    const verticalAlignment = new Drawer(this.components);
    this.components.ui.add(verticalAlignment);
    verticalAlignment.alignment = "top";

    verticalAlignment.onVisible.add(() => {
      this._scenes.vertical.grid.regenerate();
    });
    verticalAlignment.visible = false;

    verticalAlignment.slots.content.domElement.style.padding = "0";
    verticalAlignment.slots.content.domElement.style.overflow = "hidden";

    const { clientWidth, clientHeight } = verticalAlignment.domElement;
    this._scenes.vertical.setSize(clientHeight, clientWidth);

    const vContainer = this._scenes.vertical.uiElement.get("container");
    verticalAlignment.addChild(vContainer);

    if (this.components.renderer.isUpdateable()) {
      this.components.renderer.onAfterUpdate.add(async () => {
        if (horizontalAlignment.visible) {
          await this._scenes.horizontal.update();
        }
        if (verticalAlignment.visible) {
          await this._scenes.vertical.update();
        }
      });
    }

    this.uiElement.set({
      horizontalAlignment,
      verticalAlignment,
    });
  }
}

ToolComponent.libraryUUIDs.add(RoadNavigator.uuid);
