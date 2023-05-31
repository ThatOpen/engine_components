import * as THREE from "three";
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";
import { Event, Updateable } from "../../base-types/base-types";
import { Component } from "../../base-types/component";
import { Components } from "../../core/Components";

export interface VertexPickerConfig {
  showOnlyVertex: boolean;
  snapDistance: number;
}

export class VertexPicker
  extends Component<THREE.Vector3 | null>
  implements Updateable
{
  name: string = "VertexPicker";
  afterUpdate: Event<VertexPicker> = new Event();
  beforeUpdate: Event<VertexPicker> = new Event();
  private _pickedPoint: THREE.Vector3 | null = null;
  private _config!: VertexPickerConfig;
  private _enabled!: boolean;
  private _components: Components;
  private _marker: CSS2DObject;

  set enabled(value: boolean) {
    this._enabled = value;
    if (!value) {
      this._pickedPoint = null;
    }
  }

  get enabled() {
    return this._enabled;
  }

  constructor(components: Components, config?: Partial<VertexPickerConfig>) {
    super();
    this._components = components;
    this.config = {
      snapDistance: 0.25,
      showOnlyVertex: true,
      ...config,
    };
    const marker = document.createElement("div");
    marker.className =
      "rounded-full w-[15px] h-[15px] border-3 border-solid border-red-500";
    this._marker = new CSS2DObject(marker);
    this._marker.visible = false;
    this._components.scene.get().add(this._marker);
    this.enabled = false;
  }

  set config(value: Partial<VertexPickerConfig>) {
    this._config = { ...this._config, ...value };
  }

  get config() {
    return this._config;
  }

  private get _raycaster() {
    return this._components.raycaster;
  }

  /** {@link Updateable.update} */
  update() {
    if (!this.enabled) {
      return;
    }
    this.beforeUpdate.trigger(this);
    const intersects = this._raycaster.castRay();
    if (!intersects) {
      this._marker.visible = false;
      this._pickedPoint = null;
      return;
    }
    this._pickedPoint = this.getClosestVertex(intersects);
    if (!this._pickedPoint) {
      this._marker.visible = false;
      return;
    }
    this._marker.visible = true;
    this._marker.position.set(
      this._pickedPoint.x,
      this._pickedPoint.y,
      this._pickedPoint.z
    );
    this.afterUpdate.trigger(this);
  }

  private getClosestVertex(intersects: THREE.Intersection) {
    let closestVertex = new THREE.Vector3();
    let vertexFound = false;
    let closestDistance = Number.MAX_SAFE_INTEGER;
    const vertices = this.getVertices(intersects);
    vertices?.forEach((vertex) => {
      if (!vertex) return;
      const distance = intersects.point.distanceTo(vertex);
      if (distance > closestDistance || distance > this._config.snapDistance)
        return;
      vertexFound = true;
      closestVertex = vertex;
      closestDistance = intersects.point.distanceTo(vertex);
    });
    if (vertexFound) {
      return closestVertex;
    }
    return this.config.showOnlyVertex ? null : intersects.point;
  }

  private getVertices(intersects: THREE.Intersection) {
    const mesh = intersects.object as THREE.Mesh;
    if (!intersects.face || !mesh) return null;
    const geom = mesh.geometry;
    return [
      this.getVertex(intersects.face.a, geom),
      this.getVertex(intersects.face.b, geom),
      this.getVertex(intersects.face.c, geom),
    ].map((vertex) => vertex?.applyMatrix4(mesh.matrixWorld));
  }

  private getVertex(index: number, geom: THREE.BufferGeometry) {
    if (index === undefined) return null;
    const vertices = geom.attributes.position as THREE.BufferAttribute;
    return new THREE.Vector3(
      vertices.getX(index),
      vertices.getY(index),
      vertices.getZ(index)
    );
  }

  get(): THREE.Vector3 | null {
    return this._pickedPoint;
  }
}
