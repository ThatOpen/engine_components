import * as THREE from "three";
import {
  Createable,
  Disposable,
  Event,
  UI,
  Component,
  UIElement,
} from "../../base-types";
import { Components, Simple2DMarker, ToolComponent } from "../../core";
import { Button } from "../../ui";
import { DimensionLabelClassName } from "../SimpleDimensionLine";
import { MeasurementUtils } from "../MeasurementUtils";

export interface AreaSelection {
  area: number;
  perimeter: number;
  mesh: THREE.Mesh;
  label: Simple2DMarker;
}

export interface SerializedAreaMeasure {
  position: Float32Array;
  perimeter: number;
  area: number;
}

export class FaceMeasurement
  extends Component<void>
  implements Createable, UI, Disposable
{
  static readonly uuid = "30279548-1309-44f6-aa97-ce26eed73522" as const;

  uiElement = new UIElement<{ main: Button }>();

  selection: AreaSelection[] = [];

  preview = new THREE.Mesh(
    new THREE.BufferGeometry(),
    new THREE.MeshBasicMaterial({
      side: 2,
      depthTest: false,
      transparent: true,
      opacity: 0.25,
      color: "#BCF124",
    })
  );

  selectionMaterial = new THREE.MeshBasicMaterial({
    side: 2,
    depthTest: false,
    transparent: true,
    color: "#BCF124",
    opacity: 0.75,
  });

  readonly onBeforeCreate = new Event<any>();
  readonly onAfterCreate = new Event<any>();
  readonly onBeforeCancel = new Event<any>();
  readonly onAfterCancel = new Event<any>();
  readonly onBeforeDelete = new Event<any>();
  readonly onAfterDelete = new Event<any>();
  readonly onDisposed = new Event<any>();

  private _enabled: boolean = false;

  private _currentSelelection: {
    area: number;
    perimeter: number;
  } | null = null;

  set enabled(value: boolean) {
    this._enabled = value;
    if (this.components.uiEnabled) {
      const main = this.uiElement.get("main");
      main.active = value;
    }
    this.setupEvents(value);
    if (value) {
      const scene = this.components.scene.get();
      scene.add(this.preview);
    } else {
      this.preview.removeFromParent();
      this.cancelCreation();
    }
    this.setVisibility(value);
  }

  get enabled() {
    return this._enabled;
  }

  constructor(components: Components) {
    super(components);

    this.components.tools.add(FaceMeasurement.uuid, this);

    this.preview.frustumCulled = false;

    if (components.uiEnabled) {
      this.setUI();
    }
  }

  async dispose() {
    this.setupEvents(false);
    await this.deleteAll();
    this.preview.removeFromParent();
    this.preview.material.dispose();
    this.preview.geometry.dispose();
    this.selectionMaterial.dispose();
    this.onBeforeCreate.reset();
    this.onAfterCreate.reset();
    this.onBeforeCancel.reset();
    this.onAfterCancel.reset();
    this.onBeforeDelete.reset();
    this.onAfterDelete.reset();
    await this.uiElement.dispose();
    await this.onDisposed.trigger();
    this.onDisposed.reset();
    (this.components as any) = null;
  }

  private setUI() {
    const main = new Button(this.components);
    main.materialIcon = "check_box_outline_blank";
    main.onClick.add(() => {
      if (!this.enabled) {
        main.active = true;
        this.enabled = true;
      } else {
        this.enabled = false;
        main.active = false;
      }
    });
    this.uiElement.set({ main });
  }

  create = () => {
    if (!this.enabled || !this._currentSelelection) return;
    const scene = this.components.scene.get();

    const geometry = new THREE.BufferGeometry();
    const mesh = new THREE.Mesh(geometry, this.selectionMaterial);
    geometry.setAttribute(
      "position",
      this.preview.geometry.attributes.position
    );
    scene.add(mesh);

    geometry.computeBoundingSphere();
    const { area, perimeter } = this._currentSelelection;
    const label = this.newLabel(geometry, area);
    mesh.add(label.get());

    this.selection.push({ area, perimeter, mesh, label });
  };

  async delete() {
    const meshes = this.selection.map((item) => item.mesh);
    const result = this.components.raycaster.castRay(meshes);
    if (!result || !result.object) {
      return;
    }
    const found = this.selection.find((item) => item.mesh === result.object);
    if (!found) return;
    found.mesh.removeFromParent();
    found.mesh.geometry.dispose();
    await found.label.dispose();
    const index = this.selection.indexOf(found);
    this.selection.splice(index, 1);
  }

  async deleteAll() {
    for (const item of this.selection) {
      item.mesh.removeFromParent();
      item.mesh.geometry.dispose();
      await item.label.dispose();
    }
    this.selection = [];
  }

  endCreation() {}

  cancelCreation() {}

  get() {
    const serialized: SerializedAreaMeasure[] = [];
    for (const item of this.selection) {
      const geometry = item.mesh.geometry;
      const { area, perimeter } = item;
      const position = geometry.attributes.position.array as Float32Array;
      serialized.push({ position, area, perimeter });
    }
    return serialized;
  }

  set(serialized: SerializedAreaMeasure[]) {
    const scene = this.components.scene.get();
    for (const item of serialized) {
      const geometry = new THREE.BufferGeometry();
      const mesh = new THREE.Mesh(geometry, this.selectionMaterial);
      scene.add(mesh);
      const attr = new THREE.BufferAttribute(item.position, 3);
      geometry.setAttribute("position", attr);
      geometry.computeBoundingSphere();
      const { area, perimeter } = item;
      const label = this.newLabel(geometry, area);
      mesh.add(label.get());
      this.selection.push({ area, perimeter, mesh, label });
    }
  }

  private setupEvents(active: boolean) {
    const viewerContainer = this.components.ui.viewerContainer;
    if (active) {
      viewerContainer.addEventListener("click", this.create);
      viewerContainer.addEventListener("mousemove", this.onMouseMove);
      window.addEventListener("keydown", this.onKeydown);
    } else {
      viewerContainer.removeEventListener("click", this.create);
      viewerContainer.removeEventListener("mousemove", this.onMouseMove);
      window.removeEventListener("keydown", this.onKeydown);
    }
  }

  private setVisibility(active: boolean) {
    const scene = this.components.scene.get();
    for (const item of this.selection) {
      const label = item.label.get();
      if (active) {
        scene.add(item.mesh);
        item.mesh.add(label);
      } else {
        item.mesh.removeFromParent();
        label.removeFromParent();
      }
    }
  }

  private onMouseMove = () => {
    if (!this.enabled) {
      this.unselect();
      return;
    }
    const result = this.components.raycaster.castRay();
    if (!result || !result.object || result.faceIndex === undefined) {
      this.unselect();
      return;
    }
    const { object, faceIndex } = result;
    if (object instanceof THREE.Mesh || object instanceof THREE.InstancedMesh) {
      this.updateSelection(object, faceIndex, result.instanceId);
    } else {
      this.unselect();
    }
  };

  private onKeydown = (_e: KeyboardEvent) => {};

  private unselect() {
    this.preview.removeFromParent();
    this._currentSelelection = null;
  }

  private updateSelection(
    mesh: THREE.Mesh | THREE.InstancedMesh,
    faceIndex: number,
    instance?: number
  ) {
    const scene = this.components.scene.get();
    scene.add(this.preview);

    const result = MeasurementUtils.getFace(mesh, faceIndex, instance);
    if (result === null) {
      console.log("Hey!");
      return;
    }

    const area = this.regenerateHighlight(mesh, result.indices, instance);

    let perimeter = 0;
    for (const { distance } of result.edges) {
      perimeter += distance;
    }

    this._currentSelelection = { perimeter, area };
  }

  private newLabel(geometry: THREE.BufferGeometry, area: number) {
    if (!geometry.boundingSphere) {
      throw new Error("Error computing area geometry");
    }
    const { center } = geometry.boundingSphere;
    const htmlText = document.createElement("div");
    htmlText.className = DimensionLabelClassName;
    const formattedArea = Math.trunc(area * 100) / 100;
    htmlText.textContent = formattedArea.toString();
    const label = new Simple2DMarker(this.components, htmlText);
    const labelObject = label.get();
    labelObject.position.copy(center);
    return label;
  }

  private regenerateHighlight(
    mesh: THREE.Mesh | THREE.InstancedMesh,
    indices: Iterable<number>,
    instance?: number
  ) {
    const position: number[] = [];
    const index: number[] = [];
    let counter = 0;

    let area = 0;
    const areaTriangle = new THREE.Triangle();

    for (const i of indices) {
      const { p1, p2, p3 } = MeasurementUtils.getVerticesAndNormal(
        mesh,
        i,
        instance
      );

      position.push(p1.x, p1.y, p1.z);
      position.push(p2.x, p2.y, p2.z);
      position.push(p3.x, p3.y, p3.z);

      areaTriangle.set(p1, p2, p3);
      area += areaTriangle.getArea();

      index.push(counter, counter + 1, counter + 2);
      counter += 3;
    }

    const buffer = new Float32Array(position);
    const attr = new THREE.BufferAttribute(buffer, 3);
    this.preview.geometry.setAttribute("position", attr);
    this.preview.geometry.setIndex(index);

    return area;
  }
}

ToolComponent.libraryUUIDs.add(FaceMeasurement.uuid);
