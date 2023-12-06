import * as THREE from "three";
import {
  Createable,
  Disposable,
  Event,
  UI,
  Component,
  UIElement,
} from "../../base-types";
import { Components, ToolComponent } from "../../core";
import { Button } from "../../ui";
import { SimpleDimensionLine } from "../SimpleDimensionLine";
import { distanceFromPointToLine, getRaycastedFace } from "../../utils";

export class EdgeMeasurement
  extends Component<void>
  implements Createable, UI, Disposable
{
  static readonly uuid = "e7be5749-89df-4514-8d25-83aa38ce12d8" as const;

  uiElement = new UIElement<{ main: Button }>();

  selection: SimpleDimensionLine[] = [];
  preview: SimpleDimensionLine;

  tolerance = 0.3;

  readonly onBeforeCreate = new Event<any>();
  readonly onAfterCreate = new Event<any>();
  readonly onBeforeCancel = new Event<any>();
  readonly onAfterCancel = new Event<any>();
  readonly onBeforeDelete = new Event<any>();
  readonly onAfterDelete = new Event<any>();

  private _enabled: boolean = false;

  private _lineMaterial = new THREE.LineBasicMaterial({
    color: "#DC2626",
    linewidth: 2,
    depthTest: false,
    transparent: true,
  });

  set enabled(value: boolean) {
    this._enabled = value;
    if (this.components.uiEnabled) {
      const main = this.uiElement.get("main");
      main.active = value;
    }
    this.setupEvents(value);
    if (value) {
      // const scene = this.components.scene.get();
    } else {
      this.cancelCreation();
    }
    // this.setVisibility(value);
  }

  get enabled() {
    return this._enabled;
  }

  constructor(components: Components) {
    super(components);

    this.components.tools.add(EdgeMeasurement.uuid, this);

    this.preview = this.newDimensionLine();
    this.preview.visible = false;

    if (components.uiEnabled) {
      this.setUI();
    }
  }

  async dispose() {
    this.setupEvents(false);
    this.onBeforeCreate.reset();
    this.onAfterCreate.reset();
    this.onBeforeCancel.reset();
    this.onAfterCancel.reset();
    this.onBeforeDelete.reset();
    this.onAfterDelete.reset();
    await this.uiElement.dispose();
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
    if (!this.enabled || !this.preview.visible) return;
    const dimension = this.newDimensionLine();
    dimension.startPoint = this.preview.startPoint.clone();
    dimension.endPoint = this.preview.endPoint.clone();
    this.selection.push(dimension);
  };

  async delete() {
    // const meshes = this.selection.map((item) => item.mesh);
    // const result = this.components.raycaster.castRay(meshes);
    // if (!result || !result.object) {
    //   return;
    // }
    // const found = this.selection.find((item) => item.mesh === result.object);
    // if (!found) return;
    // found.mesh.removeFromParent();
    // found.mesh.geometry.dispose();
    // await found.label.dispose();
    // const index = this.selection.indexOf(found);
    // this.selection.splice(index, 1);
  }

  async deleteAll() {
    // for (const item of this.selection) {
    //   item.mesh.removeFromParent();
    //   item.mesh.geometry.dispose();
    //   await item.label.dispose();
    // }
    // this.selection = [];
  }

  endCreation() {}

  cancelCreation() {}

  get() {
    // const serialized: SerializedAreaMeasure[] = [];
    // for (const item of this.selection) {
    //   const geometry = item.mesh.geometry;
    //   const { area, perimeter } = item;
    //   const position = geometry.attributes.position.array as Float32Array;
    //   serialized.push({ position, area, perimeter });
    // }
    // return serialized;
  }

  set() {
    // const scene = this.components.scene.get();
    // for (const item of serialized) {
    //   const geometry = new THREE.BufferGeometry();
    //   const mesh = new THREE.Mesh(geometry, this.selectionMaterial);
    //   scene.add(mesh);
    //   const attr = new THREE.BufferAttribute(item.position, 3);
    //   geometry.setAttribute("position", attr);
    //   geometry.computeBoundingSphere();
    //   const { area, perimeter } = item;
    //   const label = this.newLabel(geometry, area);
    //   mesh.add(label.get());
    //   this.selection.push({ area, perimeter, mesh, label });
    // }
  }

  private newDimensionLine() {
    return new SimpleDimensionLine(this.components, {
      start: new THREE.Vector3(),
      end: new THREE.Vector3(),
      lineMaterial: this._lineMaterial,
      endpointElement: this.newEndpoint(),
    });
  }

  private newEndpoint() {
    const element = document.createElement("div");
    element.className = "w-2 h-2 bg-red-600 rounded-full";
    return element;
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

  // private setVisibility() {
  // const scene = this.components.scene.get();
  // for (const item of this.selection) {
  //   const label = item.label.get();
  //   if (active) {
  //     scene.add(item.mesh);
  //     item.mesh.add(label);
  //   } else {
  //     item.mesh.removeFromParent();
  //     label.removeFromParent();
  //   }
  // }
  // }

  private onMouseMove = () => {
    if (!this.enabled) {
      this.preview.visible = false;
      return;
    }
    const result = this.components.raycaster.castRay();
    if (!result || !result.object || !result.faceIndex) {
      this.preview.visible = false;
      return;
    }
    const { object, faceIndex, point } = result;
    if (object instanceof THREE.Mesh || object instanceof THREE.InstancedMesh) {
      this.updateSelection(object, point, faceIndex, result.instanceId);
    } else {
      this.preview.visible = false;
    }
  };

  private onKeydown = (_e: KeyboardEvent) => {};

  private updateSelection(
    mesh: THREE.Mesh | THREE.InstancedMesh,
    point: THREE.Vector3,
    faceIndex: number,
    instance?: number
  ) {
    if (!mesh.geometry.index) {
      return;
    }
    const result = getRaycastedFace(mesh, faceIndex, instance);
    if (!result) return;
    const { edges } = result;

    let minDistance = Number.MAX_VALUE;
    let currentEdge: THREE.Vector3[] = [];
    for (const id in edges) {
      const edge = edges[id];
      const [v1, v2] = edge;
      const distance = distanceFromPointToLine(point, v1, v2, true);
      if (distance < this.tolerance && distance < minDistance) {
        minDistance = distance;
        currentEdge = edge;
      }
    }

    if (!currentEdge.length) {
      this.preview.visible = false;
      return;
    }
    const [start, end] = currentEdge;
    this.preview.startPoint = start;
    this.preview.endPoint = end;

    // const scene = this.components.scene.get();
    this.preview.visible = true;
  }
}

ToolComponent.libraryUUIDs.add(EdgeMeasurement.uuid);
