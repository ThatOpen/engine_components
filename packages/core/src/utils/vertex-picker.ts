import * as THREE from "three";
import { Component, Components, Event, Raycasters, World } from "../core";

export interface VertexPickerConfig {
  showOnlyVertex: boolean;
  snapDistance: number;
  previewElement: HTMLElement;
}

export class VertexPicker extends Component {
  onVertexFound = new Event<THREE.Vector3>();
  onVertexLost = new Event<THREE.Vector3>();

  components: Components;

  private _pickedPoint: THREE.Vector3 | null = null;

  private _config!: VertexPickerConfig;

  private _enabled: boolean = false;

  private _workingPlane: THREE.Plane | null = null;

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
    super(components);
    this.components = components;
    this.config = {
      snapDistance: 0.25,
      showOnlyVertex: false,
      ...config,
    };
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

  dispose() {
    this.onVertexFound.reset();
    this.onVertexLost.reset();
    (this.components as any) = null;
  }

  get(world: World) {
    if (!this.enabled) return this._pickedPoint;

    const casters = this.components.get(Raycasters);
    const caster = casters.get(world);

    const intersects = caster.castRay();
    if (!intersects) {
      if (this._pickedPoint !== null) {
        this.onVertexLost.trigger();
        this._pickedPoint = null;
      }
      return this._pickedPoint;
    }

    const point = this.getClosestVertex(intersects);
    if (!point) {
      if (this._pickedPoint !== null) {
        this.onVertexLost.trigger();
        this._pickedPoint = null;
      }
      return this._pickedPoint;
    }

    const isOnPlane = !this.workingPlane
      ? true
      : Math.abs(this.workingPlane.distanceToPoint(point)) < 0.001;
    if (!isOnPlane) {
      this._pickedPoint = null;
      return this._pickedPoint;
    }

    if (this._pickedPoint === null || !this._pickedPoint.equals(point)) {
      this._pickedPoint = point.clone();
      this.onVertexFound.trigger(this._pickedPoint);
    }

    return this._pickedPoint;
  }

  private getClosestVertex(intersects: THREE.Intersection) {
    let closestVertex = new THREE.Vector3();
    let vertexFound = false;
    let closestDistance = Number.MAX_SAFE_INTEGER;
    const vertices = this.getVertices(intersects);
    if (vertices === null) {
      return null;
    }

    for (const vertex of vertices) {
      if (!vertex) {
        continue;
      }
      const distance = intersects.point.distanceTo(vertex);
      if (distance > closestDistance || distance > this._config.snapDistance) {
        continue;
      }
      vertexFound = true;
      closestVertex = vertex;
      closestDistance = intersects.point.distanceTo(vertex);
    }

    if (vertexFound) {
      return closestVertex;
    }

    return this.config.showOnlyVertex ? null : intersects.point;
  }

  private getVertices(intersects: THREE.Intersection) {
    const mesh = intersects.object as THREE.Mesh | THREE.InstancedMesh;
    if (!intersects.face || !mesh) return null;
    const geom = mesh.geometry;

    const instanceTransform = new THREE.Matrix4();
    const { instanceId } = intersects;
    const instanceFound = instanceId !== undefined;
    const isInstance = mesh instanceof THREE.InstancedMesh;
    if (isInstance && instanceFound) {
      mesh.getMatrixAt(instanceId, instanceTransform);
    }

    return [
      this.getVertex(intersects.face.a, geom),
      this.getVertex(intersects.face.b, geom),
      this.getVertex(intersects.face.c, geom),
    ].map((vertex) => {
      if (vertex) {
        if (isInstance && instanceFound) {
          vertex.applyMatrix4(instanceTransform);
        }
        vertex.applyMatrix4(mesh.matrixWorld);
      }
      return vertex;
    });
  }

  private getVertex(index: number, geom: THREE.BufferGeometry) {
    if (index === undefined) return null;
    const vertices = geom.attributes.position as THREE.BufferAttribute;
    return new THREE.Vector3(
      vertices.getX(index),
      vertices.getY(index),
      vertices.getZ(index),
    );
  }
}
