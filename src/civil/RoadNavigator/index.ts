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

  private _data = {
    id: "thatopen-roadnavigator-data",
    anchor: new THREE.Vector3(),
    verticalIndex: null as null | number,
  };

  private _anchors = {
    horizontal: new THREE.Vector2(),
    horizontalIndex: 0,
    real: new THREE.Vector3(),
  };

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
    real: THREE.LineSegments;
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
      real: new THREE.LineSegments(
        new THREE.BufferGeometry(),
        new THREE.LineBasicMaterial()
      ),
    };

    this._alignments.vertical.frustumCulled = false;
    this._alignments.horizontal.frustumCulled = false;
    this._alignments.real.frustumCulled = false;

    this._scenes.vertical.get().add(this._alignments.vertical);
    this._scenes.horizontal.get().add(this._alignments.horizontal);

    const scene = this.components.scene.get();
    scene.add(this._alignments.real);

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

        this._anchors.horizontal.set(x, y);
        this._anchors.horizontalIndex = isFirst ? pointIndex1 : pointIndex2;

        const { horizontal } = this._points;
        const coordsBuffer = new Float32Array([x, y, 0]);
        const coordsAttr = new THREE.BufferAttribute(coordsBuffer, 3);
        horizontal.geometry.setAttribute("position", coordsAttr);

        this._data.verticalIndex = null;
        const alignmentIndex =
          this._selected.ifcCivil.horizontalAlignments.alignmentIndex;
        if (pointIndex1 >= alignmentIndex[alignmentIndex.length - 1]) {
          this._data.verticalIndex = null;
        } else {
          for (let i = 0; i < alignmentIndex.length - 1; i++) {
            const start = alignmentIndex[i];
            const end = alignmentIndex[i + 1];
            if (pointIndex1 >= start && pointIndex1 < end) {
              this._data.verticalIndex = i;
              break;
            }
          }
        }

        this.getAlignmentGeometry(
          this._selected.ifcCivil.verticalAlignments,
          this._alignments.vertical.geometry,
          false,
          this._data.verticalIndex
        );

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
      this._alignments.horizontal.geometry,
      false
    );

    this.getAlignmentGeometry(
      model.ifcCivil.realAlignments,
      this._alignments.real.geometry,
      true
    );
  }

  setAnchor() {
    if (!this._selected || !this._selected.ifcCivil) return;
    const result = this.components.raycaster.castRay([this._selected]);
    if (result === null) return;
    this._anchors.real.copy(result.point);
    const { horizontal, real, horizontalIndex } = this._anchors;

    const geom = this._alignments.real.geometry;
    const yPosition3D = geom.attributes.position.getY(horizontalIndex);

    const { anchor } = this._data;
    anchor.set(
      real.x - horizontal.x,
      real.z + horizontal.y,
      real.y - yPosition3D
    );

    this.updateAnchor();
  }

  save() {
    const { anchor } = this._data;
    const horCam = this._scenes.horizontal.camera.position;
    const horTar = this._scenes.horizontal.controls.target;
    const verCam = this._scenes.vertical.camera.position;
    const verTar = this._scenes.vertical.controls.target;
    const data = {
      anchor: { x: anchor.x, y: anchor.y, z: anchor.z },
      horizontal: {
        camera: { x: horCam.x, y: horCam.y, z: horCam.z },
        target: { x: horTar.x, y: horTar.y, z: horTar.z },
      },
      vertical: {
        camera: { x: verCam.x, y: verCam.y, z: verCam.z },
        target: { x: verTar.x, y: verTar.y, z: verTar.z },
        index: this._data.verticalIndex,
      },
    };
    const serialized = JSON.stringify(data);
    localStorage.setItem(this._data.id, serialized);
  }

  load() {
    const serialized = localStorage.getItem(this._data.id);
    if (!serialized) return;
    const data = JSON.parse(serialized);
    const { anchor, horizontal, vertical } = data;
    this._scenes.horizontal.camera.position.copy(horizontal.camera);
    this._scenes.horizontal.controls.target.copy(horizontal.target);
    this._scenes.vertical.camera.position.copy(vertical.camera);
    this._scenes.vertical.controls.target.copy(vertical.target);
    this._data.anchor.copy(anchor);
    this.updateAnchor();
    this._data.verticalIndex = data.vertical.index;
    if (this._selected && this._selected.ifcCivil) {
      this.getAlignmentGeometry(
        this._selected.ifcCivil.verticalAlignments,
        this._alignments.vertical.geometry,
        false,
        this._data.verticalIndex
      );
    }
  }

  private updateAnchor() {
    const position = this._alignments.real.position;
    position.copy(this._data.anchor);
  }

  private getAlignmentGeometry(
    alignment: IfcAlignmentData,
    geometry: THREE.BufferGeometry,
    is3D: boolean,
    selectedIndex: number | null = null
  ) {
    const data = this.getAlignmentData(alignment, is3D, selectedIndex);
    const coordsBuffer = new Float32Array(data.coords);
    const coordsAttr = new THREE.BufferAttribute(coordsBuffer, 3);
    geometry.setAttribute("position", coordsAttr);
    geometry.setIndex(data.index);
  }

  private getAlignmentData(
    alignment: IfcAlignmentData,
    is3D: boolean,
    selectedIndex: number | null = null
  ) {
    const coords: number[] = [];
    const index: number[] = [];
    const { coordinates, curveIndex } = alignment;
    const offsetX = coordinates[0];
    const offsetY = coordinates[1];
    const offsetZ = is3D ? coordinates[2] : 0;
    let isSegmentStart = true;
    const factor = is3D ? 3 : 2;
    const last = coordinates.length / factor - 1;
    if (selectedIndex === null) {
      for (let i = 0; i < curveIndex.length; i++) {
        const start = curveIndex[i];
        const isLast = i === curveIndex.length - 1;
        const end = isLast ? last : curveIndex[i + 1];
        isSegmentStart = true;
        for (let j = start; j < end; j++) {
          const x = coordinates[j * factor] - offsetX;
          const y = coordinates[j * factor + 1] - offsetY;
          const z = is3D ? coordinates[j * factor + 2] - offsetZ : 0;
          coords.push(x, y, z);
          if (isSegmentStart) {
            isSegmentStart = false;
          } else {
            index.push(j - 1, j);
          }
        }
      }
    } else {
      let counter = 0;
      for (let i = 0; i < curveIndex.length; i++) {
        if (selectedIndex === this.currentAlignment(alignment, curveIndex[i])) {
          const start = curveIndex[i];
          const isLast = i === curveIndex.length - 1;
          const end = isLast ? last : curveIndex[i + 1];
          isSegmentStart = true;
          for (let j = start; j < end; j++) {
            const x = coordinates[j * factor] - offsetX;
            const y = coordinates[j * factor + 1] - offsetY;
            const z = is3D ? coordinates[j * factor + 2] - offsetZ : 0;
            coords.push(x, y, z);
            if (isSegmentStart) {
              isSegmentStart = false;
            } else {
              index.push(counter - 1, counter);
            }
            counter++;
          }
        }
      }
    }
    return { coords, index };
  }

  private currentAlignment(alignment: IfcAlignmentData, curveIndex: number) {
    const last = alignment.alignmentIndex.length - 1;
    if (curveIndex >= alignment.alignmentIndex[last]) {
      return last;
    }
    for (let i = 0; i < alignment.alignmentIndex.length - 1; i++) {
      const start = alignment.alignmentIndex[i];
      const end = alignment.alignmentIndex[i + 1];
      if (curveIndex >= start && curveIndex < end) {
        return i;
      }
    }
    return null;
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
