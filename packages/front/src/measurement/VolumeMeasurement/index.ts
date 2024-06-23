import * as THREE from "three";
import * as FRAGS from "@thatopen/fragments";
import * as OBC from "@thatopen/components";
import { Mark } from "../../core";
import { newDimensionMark } from "../utils";

/**
 * This component allows users to measure geometry volumes in a 3D scene. 📕 [Tutorial](https://docs.thatopen.com/Tutorials/Components/Front/VolumeMeasurement). 📘 [API](https://docs.thatopen.com/api/@thatopen/components-front/classes/VolumeMeasurement).
 */
export class VolumeMeasurement
  extends OBC.Component
  implements OBC.Createable, OBC.Disposable
{
  /**
   * A unique identifier for the component.
   * This UUID is used to register the component within the Components system.
   */
  static readonly uuid = "811da532-7af3-4635-b592-1c06ae494af5" as const;

  /** {@link OBC.Disposable.onDisposed} */
  readonly onDisposed = new OBC.Event();

  /**
   * Event triggered when a volume is found.
   * The event passes the calculated volume as a parameter.
   */
  readonly onVolumeFound = new OBC.Event<number>();

  /**
   * Label used to display the calculated volume.
   * It is initially set to null and will be created when needed.
   */
  label: Mark | null = null;

  /**
   * The world in which the measurements are performed.
   */
  world?: OBC.World;

  private _enabled: boolean = false;

  /** {@link OBC.Component.enabled} */
  set enabled(value: boolean) {
    this._enabled = value;
    this.setupEvents(value);
    if (!value) {
      this.cancelCreation();
    }
  }

  /** {@link OBC.Component.enabled} */
  get enabled() {
    return this._enabled;
  }

  constructor(components: OBC.Components) {
    super(components);
    this.components.add(VolumeMeasurement.uuid, this);
  }

  /** {@link OBC.Disposable.dispose} */
  async dispose() {
    this.setupEvents(false);
    this.label?.dispose();
    this.onDisposed.trigger();
    this.onDisposed.reset();
    (this.components as any) = null;
  }

  /** {@link OBC.Createable.create} */
  create = () => {
    if (!this.enabled) return;

    if (!this.world) {
      throw new Error("World is needed for Volume Measurement!");
    }

    const casters = this.components.get(OBC.Raycasters);
    const caster = casters.get(this.world);
    const result = caster.castRay();

    if (!result || !result.object) return;
    const { object } = result;
    if (object instanceof THREE.Mesh) {
      const volume = this.getVolumeOfMesh(object);
      this.onVolumeFound.trigger(volume);
    }
  };

  /** {@link OBC.Createable.delete} */
  delete() {}

  /**
   * Deletes all the measurements created by this component.
   */
  async deleteAll() {}

  /** {@link OBC.Createable.endCreation} */
  endCreation() {}

  /** {@link OBC.Createable.cancelCreation} */
  cancelCreation() {}

  /**
   * Calculates the volume of a set of fragments.
   *
   * @param frags - A map of fragment IDs to their corresponding item IDs.
   * @returns The total volume of the fragments.
   *
   * @remarks
   * This method creates a set of instanced meshes from the given fragments and item IDs.
   * It then calculates the volume of each mesh and returns the total volume.
   *
   * @throws Will throw an error if the world is not set.
   * @throws Will throw an error if the label is not created.
   * @throws Will throw an error if the world's renderer is not set.
   * @throws Will throw an error if the geometry of the meshes is not indexed.
   * @throws Will throw an error if the fragment manager is not available.
   */
  getVolumeFromFragments(frags: FRAGS.FragmentIdMap) {
    const fragments = this.components.get(OBC.FragmentsManager);
    const tempMatrix = new THREE.Matrix4();

    const meshes: THREE.InstancedMesh[] = [];
    for (const fragID in frags) {
      const fragment = fragments.list.get(fragID);
      if (!fragment) continue;
      const itemIDs = frags[fragID];

      let instanceCount = 0;
      for (const id of itemIDs) {
        const instances = fragment.getInstancesIDs(id);
        if (!instances) continue;
        instanceCount += instances.size;
      }

      const mesh = new THREE.InstancedMesh(
        fragment.mesh.geometry,
        undefined,
        instanceCount,
      );

      let counter = 0;
      for (const id of itemIDs) {
        const instances = fragment.getInstancesIDs(id);
        if (!instances) continue;
        for (const instance of instances) {
          fragment.mesh.getMatrixAt(instance, tempMatrix);
          mesh.setMatrixAt(counter++, tempMatrix);
        }
      }

      meshes.push(mesh);
    }

    return this.getVolumeFromMeshes(meshes);
  }

  /**
   * Calculates the total volume of a set of meshes.
   *
   * @param meshes - An array of meshes or instanced meshes to calculate the volume from.
   * @returns The total volume of the meshes.
   *
   * @throws Will throw an error if the world is not set.
   * @throws Will throw an error if the label is not created.
   *
   * @remarks
   * This method calculates the volume of each mesh in the provided array and returns the total volume.
   * It also handles the creation of a label if it doesn't exist, adds the label to the world's scene,
   * and positions the label at the center of the bounding sphere of the meshes.
   *
   */
  getVolumeFromMeshes(meshes: THREE.InstancedMesh[] | THREE.Mesh[]) {
    if (!this.world) {
      throw new Error("World is needed for Volume Measurement!");
    }

    if (!this.label) {
      this.label = this.newLabel();
      this.label.three.removeFromParent();
    }

    let volume = 0;
    for (const mesh of meshes) {
      volume += this.getVolumeOfMesh(mesh);
    }

    this.label.visible = true;
    this.world.scene.three.add(this.label.three);

    const bbox = this.components.get(OBC.BoundingBoxer);
    for (const mesh of meshes) {
      mesh.geometry.computeBoundingSphere();
      bbox.addMesh(mesh);
    }

    const sphere = bbox.getSphere();
    bbox.reset();

    this.label.three.position.copy(sphere.center);

    const formattedVolume = Math.trunc(volume * 100) / 100;
    this.label.three.element.textContent = formattedVolume.toString();

    return volume;
  }

  /**
   * Clears the label associated with the volume measurement.
   *
   * @remarks
   * This method is used to hide the label when the volume measurement is no longer needed.
   * If the label exists, it sets its visibility to false.
   *
   */
  clear() {
    if (this.label) {
      this.label.visible = false;
    }
  }

  private newLabel() {
    if (!this.world) {
      throw new Error("World is needed for Volume Measurement!");
    }
    const htmlText = newDimensionMark();
    return new Mark(this.world, htmlText);
  }

  private setupEvents(active: boolean) {
    if (!this.world) {
      throw new Error("The volume measurement needs a world to work!");
    }
    if (this.world.isDisposing) {
      return;
    }
    if (!this.world.renderer) {
      throw new Error("The world of the volume measurement needs a renderer!");
    }
    const canvas = this.world.renderer.three.domElement;
    const viewerContainer = canvas.parentElement as HTMLElement;
    if (active) {
      viewerContainer.addEventListener("click", this.create);
      viewerContainer.addEventListener("pointermove", this.onMouseMove);
      window.addEventListener("keydown", this.onKeydown);
    } else {
      viewerContainer.removeEventListener("click", this.create);
      viewerContainer.removeEventListener("pointermove", this.onMouseMove);
      window.removeEventListener("keydown", this.onKeydown);
    }
  }

  private onMouseMove = () => {};

  private onKeydown = (_e: KeyboardEvent) => {};

  // https://stackoverflow.com/a/1568551
  private getVolumeOfMesh(mesh: THREE.Mesh | THREE.InstancedMesh) {
    let volume = 0;
    const p1 = new THREE.Vector3();
    const p2 = new THREE.Vector3();
    const p3 = new THREE.Vector3();
    const { index } = mesh.geometry;
    const pos = mesh.geometry.attributes.position.array;
    if (!index) {
      console.warn("Geometry must be indexed to compute its volume!");
      return 0;
    }
    // prettier-ignore
    const instances: THREE.Matrix4[] = [];
    if (mesh instanceof THREE.InstancedMesh) {
      for (let i = 0; i < mesh.count; i++) {
        const matrix = new THREE.Matrix4();
        mesh.getMatrixAt(i, matrix);
        instances.push(matrix);
      }
    } else {
      instances.push(new THREE.Matrix4().identity());
    }
    const { matrixWorld } = mesh;
    for (let i = 0; i < index.array.length - 2; i += 3) {
      for (const instance of instances) {
        const transform = instance.multiply(matrixWorld);
        const i1 = index.array[i] * 3;
        const i2 = index.array[i + 1] * 3;
        const i3 = index.array[i + 2] * 3;
        p1.set(pos[i1], pos[i1 + 1], pos[i1 + 2]).applyMatrix4(transform);
        p2.set(pos[i2], pos[i2 + 1], pos[i2 + 2]).applyMatrix4(transform);
        p3.set(pos[i3], pos[i3 + 1], pos[i3 + 2]).applyMatrix4(transform);
        volume += this.getSignedVolumeOfTriangle(p1, p2, p3);
      }
    }
    return Math.abs(volume);
  }

  private getSignedVolumeOfTriangle(
    p1: THREE.Vector3,
    p2: THREE.Vector3,
    p3: THREE.Vector3,
  ) {
    const v321 = p3.x * p2.y * p1.z;
    const v231 = p2.x * p3.y * p1.z;
    const v312 = p3.x * p1.y * p2.z;
    const v132 = p1.x * p3.y * p2.z;
    const v213 = p2.x * p1.y * p3.z;
    const v123 = p1.x * p2.y * p3.z;
    return (1.0 / 6.0) * (-v321 + v231 + v312 - v132 - v213 + v123);
  }
}
