import * as THREE from "three";
import * as OBC from "@thatopen/components";
import { SimpleDimensionLine } from "../SimpleDimensionLine";
import { LengthMeasurement } from "../LengthMeasurement";

export class EdgeMeasurement
  extends OBC.Component
  implements OBC.Createable, OBC.Disposable
{
  static readonly uuid = "e7be5749-89df-4514-8d25-83aa38ce12d8" as const;

  preview?: SimpleDimensionLine;

  tolerance = 0.3;

  world?: OBC.World;

  readonly onDisposed = new OBC.Event();

  private _enabled: boolean = false;

  private _lineMaterial = new THREE.LineBasicMaterial({
    color: "#DC2626",
    linewidth: 2,
    depthTest: false,
    transparent: true,
  });

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

  get enabled() {
    return this._enabled;
  }

  constructor(components: OBC.Components) {
    super(components);
    this.components.add(EdgeMeasurement.uuid, this);
  }

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
  delete() {
    if (!this.enabled) return;
    const dims = this.components.get(LengthMeasurement);
    const previous = dims.enabled;
    dims.enabled = true;
    dims.delete();
    dims.enabled = previous;
  }

  deleteAll() {
    const dims = this.components.get(LengthMeasurement);
    dims.deleteAll();
  }

  endCreation() {}

  cancelCreation() {}

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
      viewerContainer.addEventListener("click", this.create);
      viewerContainer.addEventListener("mousemove", this.onMouseMove);
      window.addEventListener("keydown", this.onKeydown);
    } else {
      viewerContainer.removeEventListener("click", this.create);
      viewerContainer.removeEventListener("mousemove", this.onMouseMove);
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
