import * as THREE from "three";
import * as OBC from "@thatopen/components";
import { Mark } from "../../core";
import { newDimensionMark } from "../utils";

export interface AreaSelection {
  area: number;
  perimeter: number;
  mesh: THREE.Mesh;
  label: Mark;
}

export interface SerializedAreaMeasure {
  position: Float32Array;
  perimeter: number;
  area: number;
}

export class FaceMeasurement
  extends OBC.Component
  implements OBC.Createable, OBC.Disposable
{
  static readonly uuid = "30279548-1309-44f6-aa97-ce26eed73522" as const;

  selection: AreaSelection[] = [];

  preview = new THREE.Mesh(
    new THREE.BufferGeometry(),
    new THREE.MeshBasicMaterial({
      side: 2,
      depthTest: false,
      transparent: true,
      opacity: 0.25,
      color: "#BCF124",
    }),
  );

  selectionMaterial = new THREE.MeshBasicMaterial({
    side: 2,
    depthTest: false,
    transparent: true,
    color: "#BCF124",
    opacity: 0.75,
  });

  world?: OBC.World;

  readonly onDisposed = new OBC.Event();

  private _enabled: boolean = false;

  private _currentSelelection: {
    area: number;
    perimeter: number;
  } | null = null;

  set enabled(value: boolean) {
    if (!this.world) {
      throw new Error("No world given for the Face measurement!");
    }
    this._enabled = value;
    this.setupEvents(value);
    if (value) {
      const scene = this.world.scene.three;
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

  constructor(components: OBC.Components) {
    super(components);
    this.components.add(FaceMeasurement.uuid, this);
    this.preview.frustumCulled = false;
  }

  dispose() {
    this.setupEvents(false);
    this.deleteAll();
    this.preview.removeFromParent();
    this.preview.material.dispose();
    this.preview.geometry.dispose();
    this.selectionMaterial.dispose();
    this.onDisposed.trigger();
    this.onDisposed.reset();
    (this.components as any) = null;
  }

  create = () => {
    if (!this.world) {
      throw new Error("No world given to the face measurement!");
    }

    if (!this.enabled || !this._currentSelelection) return;

    const scene = this.world.scene.three;

    const geometry = new THREE.BufferGeometry();
    const mesh = new THREE.Mesh(geometry, this.selectionMaterial);
    geometry.setAttribute(
      "position",
      this.preview.geometry.attributes.position,
    );
    scene.add(mesh);

    geometry.computeBoundingSphere();
    const { area, perimeter } = this._currentSelelection;
    const label = this.newLabel(geometry, area);
    mesh.add(label.three);

    this.selection.push({ area, perimeter, mesh, label });
  };

  delete() {
    if (!this.world) {
      throw new Error("No world given to the face measurement!");
    }
    const meshes = this.selection.map((item) => item.mesh);

    const casters = this.components.get(OBC.Raycasters);
    const caster = casters.get(this.world);
    const result = caster.castRay(meshes);
    if (!result || !result.object) {
      return;
    }
    const found = this.selection.find((item) => item.mesh === result.object);
    if (!found) return;
    found.mesh.removeFromParent();
    found.mesh.geometry.dispose();
    found.label.dispose();
    const index = this.selection.indexOf(found);
    this.selection.splice(index, 1);
  }

  deleteAll() {
    for (const item of this.selection) {
      item.mesh.removeFromParent();
      item.mesh.geometry.dispose();
      item.label.dispose();
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
    if (!this.world) {
      throw new Error("No world given to the face measurement!");
    }
    const scene = this.world.scene.three;
    for (const item of serialized) {
      const geometry = new THREE.BufferGeometry();
      const mesh = new THREE.Mesh(geometry, this.selectionMaterial);
      scene.add(mesh);
      const attr = new THREE.BufferAttribute(item.position, 3);
      geometry.setAttribute("position", attr);
      geometry.computeBoundingSphere();
      const { area, perimeter } = item;
      const label = this.newLabel(geometry, area);
      mesh.add(label.three);
      this.selection.push({ area, perimeter, mesh, label });
    }
  }

  private setupEvents(active: boolean) {
    if (!this.world) {
      throw new Error("The face measurement needs a world to work!");
    }
    if (!this.world.renderer) {
      throw new Error("The world of the face measurement needs a renderer!");
    }
    const canvas = this.world.renderer.three.domElement;
    const viewerContainer = canvas.parentElement as HTMLElement;

    viewerContainer.removeEventListener("click", this.create);
    viewerContainer.removeEventListener("mousemove", this.onMouseMove);
    window.removeEventListener("keydown", this.onKeydown);

    if (active) {
      viewerContainer.addEventListener("click", this.create);
      viewerContainer.addEventListener("mousemove", this.onMouseMove);
      window.addEventListener("keydown", this.onKeydown);
    }
  }

  private setVisibility(active: boolean) {
    if (!this.world) {
      throw new Error("The face measurement needs a world to work!");
    }
    const scene = this.world.scene.three;
    for (const item of this.selection) {
      const label = item.label.three;
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
    if (!this.world) {
      throw new Error("The face measurement needs a world to work!");
    }
    if (!this.enabled) {
      this.unselect();
      return;
    }
    const casters = this.components.get(OBC.Raycasters);
    const caster = casters.get(this.world);
    const result = caster.castRay();
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
    instance?: number,
  ) {
    if (!this.world) {
      throw new Error("The face measurement needs a world to work!");
    }
    const scene = this.world.scene.three;
    scene.add(this.preview);

    const measurements = this.components.get(OBC.MeasurementUtils);
    const result = measurements.getFace(mesh, faceIndex, instance);
    if (result === null) {
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
    if (!this.world) {
      throw new Error("The face measurement needs a world to work!");
    }
    const { center } = geometry.boundingSphere;
    const htmlText = newDimensionMark();
    const formattedArea = Math.trunc(area * 100) / 100;
    htmlText.textContent = formattedArea.toString();
    const label = new Mark(this.world, htmlText);
    const labelObject = label.three;
    labelObject.position.copy(center);
    return label;
  }

  private regenerateHighlight(
    mesh: THREE.Mesh | THREE.InstancedMesh,
    indices: Iterable<number>,
    instance?: number,
  ) {
    const position: number[] = [];
    const index: number[] = [];
    let counter = 0;

    let area = 0;
    const areaTriangle = new THREE.Triangle();

    const measurements = this.components.get(OBC.MeasurementUtils);

    for (const i of indices) {
      const { p1, p2, p3 } = measurements.getVerticesAndNormal(
        mesh,
        i,
        instance,
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
