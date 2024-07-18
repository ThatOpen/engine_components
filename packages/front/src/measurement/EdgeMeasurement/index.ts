import * as THREE from "three";
import * as OBC from "@thatopen/components";
import { SimpleDimensionLine } from "../SimpleDimensionLine";
import { LengthMeasurement } from "../LengthMeasurement";

/**
 * This component allows users to measure geometry edges in a 3D scene. 📕 [Tutorial](https://docs.thatopen.com/Tutorials/Components/Front/EdgeMeasurement). 📘 [API](https://docs.thatopen.com/api/@thatopen/components-front/classes/EdgeMeasurement).
 */
export class EdgeMeasurement
  extends OBC.Component
  implements OBC.Createable, OBC.Disposable
{
  /**
   * A unique identifier for the component.
   * This UUID is used to register the component within the Components system.
   */
  static readonly uuid = "e7be5749-89df-4514-8d25-83aa38ce12d8" as const;

  /** {@link OBC.Disposable.onDisposed} */
  readonly onDisposed = new OBC.Event();

  /**
   * A reference to the preview dimension line.
   * This line is used to visualize the measurement while creating it.
   */
  preview?: SimpleDimensionLine;

  /**
   * The tolerance value for edge selection.
   * This value determines the maximum distance from the mouse cursor to an edge for it to be selected.
   */
  tolerance = 0.3;

  /**
   * The world in which the measurements are performed.
   */
  world?: OBC.World;

  private _enabled: boolean = false;

  private _lineMaterial = new THREE.LineBasicMaterial({
    color: "#DC2626",
    linewidth: 2,
    depthTest: false,
    transparent: true,
  });

  /** {@link OBC.Component.enabled} */
  set enabled(value: boolean) {
    this._enabled = value;

    this.setupEvents(value);
    if (value) {
      // const scene = this.components.scene.get();
      if (!this.world) {
        throw new Error("The edge measurement needs a world to work!");
      }

      if (!this.preview) {
        const endpointElement = document.createElement("div");
        endpointElement.className = "w-2 h-2 bg-red-600 rounded-full";
        this.preview = new SimpleDimensionLine(this.components, this.world, {
          start: new THREE.Vector3(),
          end: new THREE.Vector3(),
          lineMaterial: this._lineMaterial,
          endpointElement,
        });

        this.preview.visible = false;
      }
    } else {
      this.cancelCreation();
    }
    // this.setVisibility(value);
  }

  /** {@link OBC.Component.enabled} */
  get enabled() {
    return this._enabled;
  }

  constructor(components: OBC.Components) {
    super(components);
    this.components.add(EdgeMeasurement.uuid, this);
  }

  /** {@link OBC.Disposable.dispose} */
  dispose() {
    if (this.preview) {
      this.preview.dispose();
    }
    this._lineMaterial.dispose();
    this.setupEvents(false);
    this.onDisposed.trigger();
    this.onDisposed.reset();
    (this.components as any) = null;
  }

  /** {@link OBC.Createable.create} */
  create = async () => {
    if (!this.preview) return;
    if (!this.enabled || !this.preview.visible) return;
    const dims = this.components.get(LengthMeasurement);
    dims.world = this.world;
    const start = this.preview.startPoint.clone();
    const end = this.preview.endPoint.clone();
    dims.createOnPoints(start, end);
  };

  // TODO: this could be better. Fusion this class with lengthmeasurement?
  /** {@link OBC.Createable.delete} */
  delete() {
    if (!this.enabled) return;
    const dims = this.components.get(LengthMeasurement);
    const previous = dims.enabled;
    dims.enabled = true;
    dims.delete();
    dims.enabled = previous;
  }

  /**
   * Deletes all the measurements created by the EdgeMeasurement component.
   */
  deleteAll() {
    const dims = this.components.get(LengthMeasurement);
    dims.deleteAll();
  }

  /** {@link OBC.Createable.endCreation} */
  endCreation() {}

  /** {@link OBC.Createable.cancelCreation} */
  cancelCreation() {}

  /**
   * Retrieves the current state of the measurements created by the EdgeMeasurement component.
   * The state is serialized as an array of arrays, where each inner array represents a line measurement.
   * Each line measurement is represented by six numbers: the x, y, and z coordinates of the start and end points.
   */
  get() {
    const dims = this.components.get(LengthMeasurement);
    const lines = dims.list;
    const serialized: number[][] = [];
    for (const line of lines) {
      const start = line.startPoint;
      const end = line.endPoint;
      const data = [start.x, start.y, start.z, end.x, end.y, end.z];
      serialized.push(data);
    }
    return serialized;
  }

  /**
   * Sets the state of the measurements created by the EdgeMeasurement component.
   * The state is serialized as an array of arrays, where each inner array represents a line measurement.
   * Each line measurement is represented by six numbers: the x, y, and z coordinates of the start and end points.
   *
   * @param dimensions - The serialized state of the measurements.
   * Each inner array should contain six numbers representing the x, y, and z coordinates of the start and end points of a line measurement.
   *
   */
  set(dimensions: number[][]) {
    const dims = this.components.get(LengthMeasurement);
    dims.world = this.world;
    for (const dim of dimensions) {
      const [x1, y1, z1, x2, y2, z2] = dim;
      const v1 = new THREE.Vector3(x1, y1, z1);
      const v2 = new THREE.Vector3(x2, y2, z2);
      dims.createOnPoints(v1, v2);
    }
  }

  private setupEvents(active: boolean) {
    if (!this.world) {
      throw new Error("The edge measurement needs a world to work!");
    }
    if (this.world.isDisposing) {
      return;
    }
    if (!this.world.renderer) {
      throw new Error("The world of the edge measurement needs a renderer!");
    }
    const canvas = this.world.renderer.three.domElement;
    const viewerContainer = canvas.parentElement as HTMLElement;
    if (active) {
      viewerContainer.addEventListener("pointermove", this.onMouseMove);
      window.addEventListener("keydown", this.onKeydown);
    } else {
      viewerContainer.removeEventListener("pointermove", this.onMouseMove);
      window.removeEventListener("keydown", this.onKeydown);
    }
  }

  private onMouseMove = () => {
    if (!this.preview) return;
    if (!this.world) {
      throw new Error("The edge measurement needs a world to work!");
    }
    if (!this.enabled) {
      this.preview.visible = false;
      return;
    }
    const casters = this.components.get(OBC.Raycasters);
    const caster = casters.get(this.world);
    const result = caster.castRay();
    if (!result || !result.object) {
      this.preview.visible = false;
      return;
    }
    const { object, faceIndex, point } = result;
    if (faceIndex === undefined) {
      this.preview.visible = false;
      return;
    }
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
    instance?: number,
  ) {
    if (!this.preview) {
      return;
    }
    if (!mesh.geometry.index) {
      return;
    }

    const measurements = this.components.get(OBC.MeasurementUtils);
    const result = measurements.getFace(mesh, faceIndex, instance);
    if (!result) return;
    const { edges } = result;

    let minDistance = Number.MAX_VALUE;
    let currentEdge: THREE.Vector3[] = [];
    for (const edge of edges) {
      const [v1, v2] = edge.points;

      const distance = OBC.MeasurementUtils.distanceFromPointToLine(
        point,
        v1,
        v2,
        true,
      );

      if (distance < this.tolerance && distance < minDistance) {
        minDistance = distance;
        currentEdge = edge.points;
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
