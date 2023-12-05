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

export interface AreaSelection {
  area: number;
  perimeter: number;
  mesh: THREE.Mesh;
  label: Simple2DMarker;
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
      opacity: 0.5,
    })
  );

  selectionMaterial = new THREE.MeshBasicMaterial({
    side: 2,
    depthTest: false,
    transparent: true,
  });

  readonly onBeforeCreate = new Event<any>();
  readonly onAfterCreate = new Event<any>();
  readonly onBeforeCancel = new Event<any>();
  readonly onAfterCancel = new Event<any>();
  readonly onBeforeDelete = new Event<any>();
  readonly onAfterDelete = new Event<any>();

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
    if (!geometry.boundingSphere) {
      throw new Error("Error computing area geometry");
    }
    const { center } = geometry.boundingSphere;

    const { area, perimeter } = this._currentSelelection;
    const htmlText = document.createElement("div");
    htmlText.className = DimensionLabelClassName;
    const formattedArea = Math.trunc(area * 100) / 100;
    htmlText.textContent = formattedArea.toString();
    const label = new Simple2DMarker(this.components, htmlText);
    const labelObject = label.get();
    labelObject.position.copy(center);
    mesh.add(labelObject);

    this.selection.push({
      area,
      perimeter,
      mesh,
      label,
    });
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

  get() {}

  set() {}

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
    if (!result || !result.object || !result.faceIndex) {
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

    const target = this.getPlane(mesh, faceIndex * 3, instance);
    const { index } = this.getIndexAndPos(mesh);

    const face = [] as { indices: number[]; ids: Set<string> }[];
    const distances = {} as { [id: string]: number };

    // Which of the face island was hit by the raycaster
    const raycasted = { index: faceIndex * 3, island: 0 };

    for (let i = 0; i < index.length - 2; i += 3) {
      const current = this.getPlane(mesh, i, instance);

      const isCoplanar = target.plane.equals(current.plane);
      if (isCoplanar) {
        const vectors = [current.v1, current.v2, current.v3];
        vectors.sort((a, b) => a.x - b.x || a.y - b.y || a.z - b.z);
        const [v1, v2, v3] = vectors;
        const v1ID = `${v1.x}_${v1.y}_${v1.z}`;
        const v2ID = `${v2.x}_${v2.y}_${v2.z}`;
        const v3ID = `${v3.x}_${v3.y}_${v3.z}`;

        const e1 = `${v1ID}|${v2ID}`;
        const e2 = `${v2ID}|${v3ID}`;
        const e3 = `${v1ID}|${v3ID}`;

        distances[e1] = v1.distanceTo(v2);
        distances[e2] = v2.distanceTo(v3);
        distances[e3] = v3.distanceTo(v1);

        const iterator: { found: null | number; i: number } = {
          found: null,
          i: 0,
        };

        for (iterator.i; iterator.i < face.length; iterator.i++) {
          const loop = face[iterator.i];
          if (loop.ids.has(e1)) {
            this.addTriangleToFace(face, iterator, e1, e2, e3, i, raycasted);
          } else if (loop.ids.has(e2)) {
            this.addTriangleToFace(face, iterator, e2, e3, e1, i, raycasted);
          } else if (loop.ids.has(e3)) {
            this.addTriangleToFace(face, iterator, e3, e1, e2, i, raycasted);
          }
        }

        if (iterator.found === null) {
          if (raycasted.index === i) {
            raycasted.island = face.length;
          }
          face.push({ indices: [i], ids: new Set([e1, e2, e3]) });
        }
      }
    }

    // TODO: Find out real face by checking the index of the raycasted triangle
    const currentFace = face[raycasted.island];
    if (currentFace === undefined) return;
    const area = this.regenerateHighlight(mesh, currentFace.indices, instance);

    let perimeter = 0;
    for (const id of currentFace.ids) {
      const number = distances[id];
      if (number !== undefined) {
        perimeter += number;
      }
    }

    if (face.length > 1) {
      console.log("Hey");
    }

    this._currentSelelection = { perimeter, area };
  }

  private regenerateHighlight(
    mesh: THREE.Mesh | THREE.InstancedMesh,
    indices: number[],
    instance?: number
  ) {
    const position: number[] = [];
    const index: number[] = [];
    let counter = 0;

    let area = 0;
    const areaTriangle = new THREE.Triangle();

    for (const i of indices) {
      const { v1, v2, v3 } = this.getVertices(mesh, i, instance);
      position.push(v1.x, v1.y, v1.z);
      position.push(v2.x, v2.y, v2.z);
      position.push(v3.x, v3.y, v3.z);

      areaTriangle.set(v1, v2, v3);
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

  private getVertices(
    mesh: THREE.Mesh | THREE.InstancedMesh,
    i: number,
    instance: number | undefined
  ) {
    const { index, pos } = this.getIndexAndPos(mesh);
    const [i1, i2, i3] = this.getIndices(index, i);
    const v1 = new THREE.Vector3();
    const v2 = new THREE.Vector3();
    const v3 = new THREE.Vector3();

    v1.set(pos[i1], pos[i1 + 1], pos[i1 + 2]);
    v2.set(pos[i2], pos[i2 + 1], pos[i2 + 2]);
    v3.set(pos[i3], pos[i3 + 1], pos[i3 + 2]);

    v1.applyMatrix4(mesh.matrixWorld);
    v2.applyMatrix4(mesh.matrixWorld);
    v3.applyMatrix4(mesh.matrixWorld);

    if (mesh instanceof THREE.InstancedMesh && instance !== undefined) {
      const instanceTransform = new THREE.Matrix4();
      mesh.getMatrixAt(instance, instanceTransform);
      v1.applyMatrix4(instanceTransform);
      v2.applyMatrix4(instanceTransform);
      v3.applyMatrix4(instanceTransform);
    }
    return { v1, v2, v3 };
  }

  private getPlane(
    mesh: THREE.Mesh | THREE.InstancedMesh,
    i: number,
    instance?: number
  ) {
    const { v1, v2, v3 } = this.getVertices(mesh, i, instance);

    this.roundVector(v1);
    this.roundVector(v2);
    this.roundVector(v3);

    const plane = new THREE.Plane().setFromCoplanarPoints(v1, v2, v3);

    this.roundVector(plane.normal);
    plane.constant = Math.round(plane.constant * 10) / 10;

    return { plane, v1, v2, v3 };
  }

  private getIndexAndPos(mesh: THREE.Mesh | THREE.InstancedMesh) {
    const { geometry } = mesh;
    if (!geometry.index) {
      throw new Error("Geometry must be indexed!");
    }
    const index = geometry.index.array as number[];
    const pos = geometry.attributes.position.array as number[];
    return { index, pos };
  }

  private roundVector(vector: THREE.Vector3) {
    vector.x = Math.round(vector.x * 100) / 100;
    vector.y = Math.round(vector.y * 100) / 100;
    vector.z = Math.round(vector.z * 100) / 100;
  }

  private getIndices(index: number[], i: number) {
    const i1 = index[i] * 3;
    const i2 = index[i + 1] * 3;
    const i3 = index[i + 2] * 3;
    return [i1, i2, i3];
  }

  private addTriangleToFace(
    face: { indices: number[]; ids: Set<string> }[],
    iterator: { found: null | number; i: number },
    e1: string,
    e2: string,
    e3: string,
    i: number,
    raycasted: { index: number; island: number }
  ) {
    const loop = face[iterator.i];
    if (iterator.found === null) {
      // When a triangle matches an island of triangles for the first time
      loop.ids.delete(e1);
      loop.ids.add(e2);
      loop.ids.add(e3);
      loop.indices.push(i);
      iterator.found = iterator.i;
    } else {
      // This triangle has matched more than one island: fusion both islands
      loop.ids.delete(e1);
      const previous = face[iterator.found];
      for (const item of loop.ids) {
        previous.ids.add(item);
      }
      for (const item of loop.indices) {
        previous.indices.push(item);
      }
      face.splice(iterator.i, 1);
      iterator.i--;
    }
    if (raycasted.index === i) {
      raycasted.island = iterator.found;
    }
  }
}

ToolComponent.libraryUUIDs.add(FaceMeasurement.uuid);
