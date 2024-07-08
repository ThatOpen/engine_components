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

    const utils = this.components.get(OBC.MeasurementUtils);

    if (!result || !result.object) return;
    const { object } = result;
    if (object instanceof THREE.Mesh) {
      const volume = utils.getVolumeFromMeshes([object]);
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
    const utils = this.components.get(OBC.MeasurementUtils);
    const volume = utils.getVolumeFromFragments(frags);
    const bb = this.components.get(OBC.BoundingBoxer);
    bb.reset();
    bb.addFragmentIdMap(frags);
    const sphere = bb.getSphere();
    this.setLabel(sphere, volume);
    return volume;
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
    const utils = this.components.get(OBC.MeasurementUtils);
    const bb = this.components.get(OBC.BoundingBoxer);
    bb.reset();
    for (const mesh of meshes) bb.addMesh(mesh);
    const sphere = bb.getSphere();
    const volume = utils.getVolumeFromMeshes(meshes);
    this.setLabel(sphere, volume);
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

  private setLabel(sphere: THREE.Sphere, volume: number) {
    if (!this.world) {
      throw new Error("World is needed for Volume Measurement!");
    }

    if (!this.label) {
      this.label = this.newLabel();
      this.label.three.removeFromParent();
    }

    this.label.visible = true;
    this.world.scene.three.add(this.label.three);
    this.label.three.position.copy(sphere.center);
    const formattedVolume = Math.trunc(volume * 100) / 100;
    this.label.three.element.textContent = formattedVolume.toString();
  }

  private onMouseMove = () => {};

  private onKeydown = (_e: KeyboardEvent) => {};
}
