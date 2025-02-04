import * as THREE from "three";
import * as OBC from "@thatopen/components";
import { Mark } from "../../core";
import { newDimensionMark } from "../utils";

/**
 * Represents a selection made by the user, containing area, perimeter, mesh, and label.
 */
export interface AreaSelection {
  /**
   * The calculated area of the selection.
   */
  area: number;

  /**
   * The calculated perimeter of the selection.
   */
  perimeter: number;

  /**
   * The 3D mesh representing the selection.
   */
  mesh: THREE.Mesh;

  /**
   * The label associated with the selection.
   */
  label: Mark;
}

/**
 * Represents a serialized version of an AreaSelection, used for saving and loading measurements.
 */
export interface SerializedAreaMeasure {
  /**
   * The position of the vertices in the selection.
   */
  position: Float32Array;

  /**
   * The calculated perimeter of the selection.
   */
  perimeter: number;

  /**
   * The calculated area of the selection.
   */
  area: number;
}

/**
 * This component allows users to measure geometry faces in a 3D scene. 📕 [Tutorial](https://docs.thatopen.com/Tutorials/Components/Front/FaceMeasurement). 📘 [API](https://docs.thatopen.com/api/@thatopen/components-front/classes/FaceMeasurement).
 */
export class FaceMeasurement
  extends OBC.Component
  implements OBC.Createable, OBC.Disposable
{
  /**
   * A unique identifier for the component.
   * This UUID is used to register the component within the Components system.
   */
  static readonly uuid = "30279548-1309-44f6-aa97-ce26eed73522" as const;

  /** {@link OBC.Disposable.onDisposed} */
  readonly onDisposed = new OBC.Event();

  /**
   * An array of AreaSelection objects representing the user's selections.
   * This array is used to store the selected areas, their meshes, and labels.
   */
  selection: AreaSelection[] = [];

  /**
   * A reference to the preview dimension face.
   * This line is used to visualize the measurement while creating it.
   */
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

  /**
   * Represents the material used for the selected area in the FaceMeasurement component.
   * This material is applied to the 3D mesh representing the selected area.
   */
  selectionMaterial = new THREE.MeshBasicMaterial({
    side: 2,
    depthTest: false,
    transparent: true,
    color: "#BCF124",
    opacity: 0.75,
  });

  /**
   * The world in which the measurements are performed.
   */
  world?: OBC.World;

  private _enabled: boolean = false;

  private _currentSelelection: {
    area: number;
    perimeter: number;
  } | null = null;

  /** {@link OBC.Component.enabled} */
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

  /** {@link OBC.Component.enabled} */
  get enabled() {
    return this._enabled;
  }

  constructor(components: OBC.Components) {
    super(components);
    this.components.add(FaceMeasurement.uuid, this);
    this.preview.frustumCulled = false;
  }

  /** {@link OBC.Disposable.dispose} */
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

  /** {@link OBC.Createable.create} */
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
    mesh.position.copy(this.preview.position);
    scene.add(mesh);

    geometry.computeBoundingSphere();
    const { area, perimeter } = this._currentSelelection;
    const label = this.newLabel(geometry, area);
    mesh.add(label.three);

    this.selection.push({ area, perimeter, mesh, label });
  };

  /** {@link OBC.Createable.delete} */
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

  /**
   * Deletes all the selections made by the user.
   * It iterates over the `selection` array, removes each mesh and label from the scene,
   * disposes the geometry and material of the mesh, and finally clears the `selection` array.
   */
  deleteAll() {
    for (const item of this.selection) {
      item.mesh.removeFromParent();
      item.mesh.geometry.dispose();
      item.label.dispose();
    }
    this.selection = [];
  }

  /** {@link OBC.Createable.endCreation} */
  endCreation() {}

  /** {@link OBC.Createable.cancelCreation} */
  cancelCreation() {}

  /**
   * Retrieves the current state of the AreaMeasurement component in a serialized format.
   * This method is used for saving measurements.
   *
   * @returns {SerializedAreaMeasure[]} An array of SerializedAreaMeasure objects,
   * each representing a single selection made by the user.
   */
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

  /**
   * Sets the state of the AreaMeasurement component from a serialized format.
   * This method is used for loading measurements.
   *
   * @param serialized - An array of SerializedAreaMeasure objects,
   * each representing a single selection made by the user.
   *
   * @throws Will throw an error if no world is given to the face measurement.
   */
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
    if (this.world.isDisposing) {
      return;
    }
    if (!this.world.renderer) {
      throw new Error("The world of the face measurement needs a renderer!");
    }
    const canvas = this.world.renderer.three.domElement;
    const viewerContainer = canvas.parentElement as HTMLElement;

    viewerContainer.removeEventListener("pointermove", this.onMouseMove);
    window.removeEventListener("keydown", this.onKeydown);

    if (active) {
      viewerContainer.addEventListener("pointermove", this.onMouseMove);
      window.addEventListener("keydown", this.onKeydown);
    }
  }

  private setVisibility(active: boolean) {
    if (!this.world) {
      throw new Error("The face measurement needs a world to work!");
    }
    if (this.world.isDisposing) {
      return;
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

    this.preview.position.set(0, 0, 0);
    this.preview.rotation.set(0, 0, 0);
    this.preview.scale.set(1, 1, 1);
    this.preview.updateMatrix();

    this.preview.applyMatrix4(mesh.matrixWorld);

    const buffer = new Float32Array(position);
    const attr = new THREE.BufferAttribute(buffer, 3);
    this.preview.geometry.setAttribute("position", attr);
    this.preview.geometry.setIndex(index);

    return area;
  }
}
