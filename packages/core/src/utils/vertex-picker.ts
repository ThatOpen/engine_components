import * as THREE from "three";
import {
  Component,
  Components,
  Disposable,
  Event,
  Raycasters,
  World,
} from "../core";

// TODO: Make a component?

/**
 * Configuration interface for the VertexPicker component.
 */
export interface VertexPickerConfig {
  /**
   * If true, only vertices will be picked, not the closest point on the face.
   */
  showOnlyVertex: boolean;

  /**
   * The maximum distance for snapping to a vertex.
   */
  snapDistance: number;

  /**
   * The HTML element to use for previewing the picked vertex.
   */
  previewElement: HTMLElement;
}

/**
 * A class that provides functionality for picking vertices in a 3D scene.
 */
export class VertexPicker extends Component implements Disposable {
  /** {@link Disposable.onDisposed} */
  readonly onDisposed = new Event();

  /**
   * An event that is triggered when a vertex is found.
   * The event passes a THREE.Vector3 representing the position of the found vertex.
   */
  readonly onVertexFound = new Event<THREE.Vector3>();

  /**
   * An event that is triggered when a vertex is lost.
   * The event passes a THREE.Vector3 representing the position of the lost vertex.
   */
  readonly onVertexLost = new Event<THREE.Vector3>();

  /**
   * An event that is triggered when the picker is enabled or disabled
   */
  readonly onEnabled = new Event<boolean>();

  /**
   * A reference to the Components instance associated with this VertexPicker.
   */
  components: Components;

  /**
   * A reference to the working plane used for vertex picking.
   * This plane is used to determine which vertices are considered valid for picking.
   * If this value is null, all vertices are considered valid.
   */
  workingPlane: THREE.Plane | null = null;

  private _pickedPoint: THREE.Vector3 | null = null;

  private _config!: VertexPickerConfig;

  private _enabled: boolean = false;

  /**
   * Sets the enabled state of the VertexPicker.
   * When enabled, the VertexPicker will actively search for vertices in the 3D scene.
   * When disabled, the VertexPicker will stop searching for vertices and reset the picked point.
   *
   * @param value - The new enabled state.
   */
  set enabled(value: boolean) {
    this._enabled = value;
    if (!value) {
      this._pickedPoint = null;
    }
    this.onEnabled.trigger(value);
  }

  /**
   * Gets the current enabled state of the VertexPicker.
   *
   * @returns The current enabled state.
   */
  get enabled() {
    return this._enabled;
  }

  /**
   * Sets the configuration for the VertexPicker component.
   *
   * @param value - A Partial object containing the configuration properties to update.
   * The properties not provided in the value object will retain their current values.
   *
   * @example
   * ```typescript
   * vertexPicker.config = {
   *   snapDistance: 0.5,
   *   showOnlyVertex: true,
   * };
   * ```
   */
  set config(value: Partial<VertexPickerConfig>) {
    this._config = { ...this._config, ...value };
  }

  /**
   * Gets the current configuration for the VertexPicker component.
   *
   * @returns A copy of the current VertexPickerConfig object.
   *
   * @example
   * ```typescript
   * const currentConfig = vertexPicker.config;
   * console.log(currentConfig.snapDistance); // Output: 0.25
   * ```
   */
  get config() {
    return this._config;
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

  /** {@link Disposable.dispose} */
  dispose() {
    this.onVertexFound.reset();
    this.onVertexLost.reset();
    (this.components as any) = null;
    this.onDisposed.trigger();
    this.onDisposed.reset();
  }

  /**
   * Performs the vertex picking operation based on the current state of the VertexPicker.
   *
   * @param world - The World instance to use for raycasting.
   *
   * @returns The current picked point, or null if no point is picked.
   *
   * @remarks
   * This method checks if the VertexPicker is enabled. If not, it returns the current picked point.
   * If enabled, it performs raycasting to find the closest intersecting object.
   * It then determines the closest vertex or point on the face, based on the configuration settings.
   * If the picked point is on the working plane (if defined), it triggers the `onVertexFound` event and updates the `pickedPoint`.
   * If the picked point is not on the working plane, it resets the `pickedPoint`.
   * If no intersecting object is found, it triggers the `onVertexLost` event and resets the `pickedPoint`.
   */
  async get(world: World) {
    if (!this.enabled) return this._pickedPoint;

    const casters = this.components.get(Raycasters);
    const caster = casters.get(world);

    const intersects = await caster.castRay();
    if (!intersects) {
      if (this._pickedPoint !== null) {
        this.onVertexLost.trigger();
        this._pickedPoint = null;
      }
      return this._pickedPoint;
    }

    const point = intersects.point;

    // TODO: Review from here closest vertex on Fragments 2.0

    // const point = this.getClosestVertex(intersects);
    // if (!point) {
    //   if (this._pickedPoint !== null) {
    //     this.onVertexLost.trigger();
    //     this._pickedPoint = null;
    //   }
    //   return this._pickedPoint;
    // }

    // const isOnPlane = !this.workingPlane
    //   ? true
    //   : Math.abs(this.workingPlane.distanceToPoint(point)) < 0.001;
    // if (!isOnPlane) {
    //   this._pickedPoint = null;
    //   return this._pickedPoint;
    // }

    if (this._pickedPoint === null || !this._pickedPoint.equals(point)) {
      this._pickedPoint = point.clone();
      this.onVertexFound.trigger(this._pickedPoint);
    }

    return this._pickedPoint;
  }

  // private getClosestVertex(intersects: THREE.Intersection) {
  //   let closestVertex = new THREE.Vector3();
  //   let vertexFound = false;
  //   let closestDistance = Number.MAX_SAFE_INTEGER;
  //   const vertices = this.getVertices(intersects);
  //   if (vertices === null) {
  //     return null;
  //   }

  //   for (const vertex of vertices) {
  //     if (!vertex) {
  //       continue;
  //     }
  //     const distance = intersects.point.distanceTo(vertex);
  //     if (distance > closestDistance || distance > this._config.snapDistance) {
  //       continue;
  //     }
  //     vertexFound = true;
  //     closestVertex = vertex;
  //     closestDistance = intersects.point.distanceTo(vertex);
  //   }

  //   if (vertexFound) {
  //     return closestVertex;
  //   }

  //   return this.config.showOnlyVertex ? null : intersects.point;
  // }

  // private getVertices(intersects: THREE.Intersection) {
  //   const mesh = intersects.object as THREE.Mesh | THREE.InstancedMesh;
  //   if (!intersects.face || !mesh) return null;
  //   const geom = mesh.geometry;

  //   const instanceTransform = new THREE.Matrix4();
  //   const { instanceId } = intersects;
  //   const instanceFound = instanceId !== undefined;
  //   const isInstance = mesh instanceof THREE.InstancedMesh;
  //   if (isInstance && instanceFound) {
  //     mesh.getMatrixAt(instanceId, instanceTransform);
  //   }

  //   return [
  //     this.getVertex(intersects.face.a, geom),
  //     this.getVertex(intersects.face.b, geom),
  //     this.getVertex(intersects.face.c, geom),
  //   ].map((vertex) => {
  //     if (vertex) {
  //       if (isInstance && instanceFound) {
  //         vertex.applyMatrix4(instanceTransform);
  //       }
  //       vertex.applyMatrix4(mesh.matrixWorld);
  //     }
  //     return vertex;
  //   });
  // }

  // private getVertex(index: number, geom: THREE.BufferGeometry) {
  //   if (index === undefined) return null;
  //   const vertices = geom.attributes.position as THREE.BufferAttribute;
  //   return new THREE.Vector3(
  //     vertices.getX(index),
  //     vertices.getY(index),
  //     vertices.getZ(index),
  //   );
  // }
}
