import * as THREE from "three";
import { Disposable, Event } from "../../base-types/base-types";
import { Component } from "../../base-types/component";
import { Components } from "../../core/Components";
import { Simple2DMarker } from "../../core/Simple2DMarker";

export interface VertexPickerConfig {
  showOnlyVertex: boolean;
  snapDistance: number;
  previewElement: HTMLElement;
}

export class VertexPicker
  extends Component<THREE.Vector3 | null>
  implements Disposable
{
  name: string = "VertexPicker";
  afterUpdate: Event<VertexPicker> = new Event();
  beforeUpdate: Event<VertexPicker> = new Event();
  private _pickedPoint: THREE.Vector3 | null = null;
  private _config!: VertexPickerConfig;
  private _components: Components;
  private _marker: Simple2DMarker;
  private _enabled: boolean = false;
  private _workingPlane: THREE.Plane | null = null;

  set enabled(value: boolean) {
    this._enabled = value;
    if (!value) {
      this._marker.visible = false;
      this._pickedPoint = null;
    }
  }

  get enabled() {
    return this._enabled;
  }

  private get _raycaster() {
    return this._components.raycaster;
  }

  constructor(components: Components, config?: Partial<VertexPickerConfig>) {
    super(components);
    this._components = components;
    this.config = {
      snapDistance: 0.25,
      showOnlyVertex: false,
      ...config,
    };
    this._marker = new Simple2DMarker(components, this.config.previewElement);
    this._marker.visible = false;
    this.setupEvents(true);
    this.enabled = false;
  }

  set workingPlane(plane: THREE.Plane | null) {
    this._workingPlane = plane;
  }

  get workingPlane() {
    return this._workingPlane;
  }

  set config(value: Partial<VertexPickerConfig>) {
    this._config = { ...this._config, ...value };
  }

  get config() {
    return this._config;
  }

  async dispose() {
    this.setupEvents(false);
    await this._marker.dispose();
    this.afterUpdate.reset();
    this.beforeUpdate.reset();
    (this._components as any) = null;
  }

  get(): THREE.Vector3 | null {
    return this._pickedPoint;
  }

  private update = () => {
    if (!this.enabled) return;
    this.beforeUpdate.trigger(this);

    const intersects = this._raycaster.castRay();
    if (!intersects) {
      this._marker.visible = false;
      this._pickedPoint = null;
      return;
    }

    const point = this.getClosestVertex(intersects);
    if (!point) {
      this._marker.visible = false;
      this._pickedPoint = null;
      return;
    }

    const isOnPlane = !this.workingPlane
      ? true
      : Math.abs(this.workingPlane.distanceToPoint(point)) < 0.001;
    if (!isOnPlane) {
      this._marker.visible = false;
      this._pickedPoint = null;
      return;
    }

    this._pickedPoint = point;
    this._marker.visible = true;
    this._marker
      .get()
      .position.set(
        this._pickedPoint.x,
        this._pickedPoint.y,
        this._pickedPoint.z
      );
    this.afterUpdate.trigger(this);
  };

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
    if (vertexFound) return closestVertex;
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

  private setupEvents(active: boolean) {
    const container = this._components.ui.viewerContainer;
    if (active) {
      container.addEventListener("mousemove", this.update);
    } else {
      container.addEventListener("mousemove", this.update);
    }
  }
}
