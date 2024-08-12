import * as THREE from "three";
import * as FRAGS from "@thatopen/fragments";
import { FragmentsGroup } from "@thatopen/fragments";
import { Component, Components, Disposer, Disposable, Event } from "../../core";
import { FragmentsManager } from "../FragmentsManager";

/**
 * A simple implementation of bounding box that works for fragments. The resulting bbox is not 100% precise, but it's fast, and should suffice for general use cases such as camera zooming or general boundary determination. 📕 [Tutorial](https://docs.thatopen.com/Tutorials/Components/Core/BoundingBoxer). 📘 [API](https://docs.thatopen.com/api/@thatopen/components/classes/BoundingBoxer).
 */
export class BoundingBoxer extends Component implements Disposable {
  static readonly uuid = "d1444724-dba6-4cdd-a0c7-68ee1450d166" as const;

  /** {@link Component.enabled} */
  enabled = true;

  /** {@link Disposable.onDisposed} */
  readonly onDisposed = new Event();

  private _absoluteMin: THREE.Vector3;
  private _absoluteMax: THREE.Vector3;
  private _meshes: THREE.Mesh[] = [];

  constructor(components: Components) {
    super(components);
    this.components.add(BoundingBoxer.uuid, this);
    this._absoluteMin = BoundingBoxer.newBound(true);
    this._absoluteMax = BoundingBoxer.newBound(false);
  }

  /**
   * A static method to calculate the dimensions of a given bounding box.
   *
   * @param bbox - The bounding box to calculate the dimensions for.
   * @returns An object containing the width, height, depth, and center of the bounding box.
   */
  static getDimensions(bbox: THREE.Box3): {
    width: number;
    height: number;
    depth: number;
    center: THREE.Vector3;
  } {
    const { min, max } = bbox;
    const width = Math.abs(max.x - min.x);
    const height = Math.abs(max.y - min.y);
    const depth = Math.abs(max.z - min.z);
    const center = new THREE.Vector3();
    center.subVectors(max, min).divideScalar(2).add(min);
    return { width, height, depth, center };
  }

  /**
   * A static method to create a new bounding box boundary.
   *
   * @param positive - A boolean indicating whether to create a boundary for positive or negative values.
   * @returns A new THREE.Vector3 representing the boundary.
   *
   * @remarks
   * This method is used to create a new boundary for calculating bounding boxes.
   * It sets the x, y, and z components of the returned vector to positive or negative infinity,
   * depending on the value of the `positive` parameter.
   *
   * @example
   * ```typescript
   * const positiveBound = BoundingBoxer.newBound(true);
   * console.log(positiveBound); // Output: Vector3 { x: Infinity, y: Infinity, z: Infinity }
   *
   * const negativeBound = BoundingBoxer.newBound(false);
   * console.log(negativeBound); // Output: Vector3 { x: -Infinity, y: -Infinity, z: -Infinity }
   * ```
   */
  static newBound(positive: boolean) {
    const factor = positive ? 1 : -1;
    return new THREE.Vector3(
      factor * Number.MAX_VALUE,
      factor * Number.MAX_VALUE,
      factor * Number.MAX_VALUE,
    );
  }

  /**
   * A static method to calculate the bounding box of a set of points.
   *
   * @param points - An array of THREE.Vector3 representing the points.
   * @param min - An optional THREE.Vector3 representing the minimum bounds. If not provided, it will be calculated.
   * @param max - An optional THREE.Vector3 representing the maximum bounds. If not provided, it will be calculated.
   * @returns A THREE.Box3 representing the bounding box of the given points.
   *
   * @remarks
   * This method calculates the bounding box of a set of points by iterating through each point and updating the minimum and maximum bounds accordingly.
   * If the `min` or `max` parameters are provided, they will be used as the initial bounds. Otherwise, the initial bounds will be set to positive and negative infinity.
   *
   * @example
   * ```typescript
   * const points = [
   *   new THREE.Vector3(1, 2, 3),
   *   new THREE.Vector3(4, 5, 6),
   *   new THREE.Vector3(7, 8, 9),
   * ];
   *
   * const bbox = BoundingBoxer.getBounds(points);
   * console.log(bbox); // Output: Box3 { min: Vector3 { x: 1, y: 2, z: 3 }, max: Vector3 { x: 7, y: 8, z: 9 } }
   * ```
   */
  static getBounds(
    points: THREE.Vector3[],
    min?: THREE.Vector3,
    max?: THREE.Vector3,
  ) {
    const maxPoint = max || this.newBound(false);
    const minPoint = min || this.newBound(true);
    for (const point of points) {
      if (point.x < minPoint.x) minPoint.x = point.x;
      if (point.y < minPoint.y) minPoint.y = point.y;
      if (point.z < minPoint.z) minPoint.z = point.z;
      if (point.x > maxPoint.x) maxPoint.x = point.x;
      if (point.y > maxPoint.y) maxPoint.y = point.y;
      if (point.z > maxPoint.z) maxPoint.z = point.z;
    }
    return new THREE.Box3(min, max);
  }

  /** {@link Disposable.dispose} */
  dispose() {
    const disposer = this.components.get(Disposer);
    for (const mesh of this._meshes) {
      disposer.destroy(mesh);
    }
    this._meshes = [];
    this.onDisposed.trigger(BoundingBoxer.uuid);
    this.onDisposed.reset();
  }

  /**
   * Returns the bounding box of the calculated fragments.
   *
   * @returns A new THREE.Box3 instance representing the bounding box.
   *
   * @remarks
   * This method clones the internal minimum and maximum vectors and returns a new THREE.Box3 instance.
   * The returned box represents the bounding box of the calculated fragments.
   *
   * @example
   * ```typescript
   * const boundingBox = boundingBoxer.get();
   * console.log(boundingBox); // Output: Box3 { min: Vector3 { x: -10, y: -10, z: -10 }, max: Vector3 { x: 10, y: 10, z: 10 } }
   * ```
   */
  get() {
    const min = this._absoluteMin.clone();
    const max = this._absoluteMax.clone();
    return new THREE.Box3(min, max);
  }

  /**
   * Calculates and returns a sphere that encompasses the entire bounding box.
   *
   * @returns A new THREE.Sphere instance representing the calculated sphere.
   *
   * @remarks
   * This method calculates the center and radius of a sphere that encompasses the entire bounding box.
   * The center is calculated as the midpoint between the minimum and maximum bounds of the bounding box.
   * The radius is calculated as the distance from the center to the minimum bound.
   *
   * @example
   * ```typescript
   * const boundingBoxer = components.get(BoundingBoxer);
   * boundingBoxer.add(fragmentsGroup);
   * const boundingSphere = boundingBoxer.getSphere();
   * console.log(boundingSphere); // Output: Sphere { center: Vector3 { x: 0, y: 0, z: 0 }, radius: 10 }
   * ```
   */
  getSphere() {
    const min = this._absoluteMin.clone();
    const max = this._absoluteMax.clone();
    const dx = Math.abs((max.x - min.x) / 2);
    const dy = Math.abs((max.y - min.y) / 2);
    const dz = Math.abs((max.z - min.z) / 2);
    const center = new THREE.Vector3(min.x + dx, min.y + dy, min.z + dz);
    const radius = center.distanceTo(min);
    return new THREE.Sphere(center, radius);
  }

  /**
   * Returns a THREE.Mesh instance representing the bounding box.
   *
   * @returns A new THREE.Mesh instance representing the bounding box.
   *
   * @remarks
   * This method calculates the dimensions of the bounding box using the `getDimensions` method.
   * It then creates a new THREE.BoxGeometry with the calculated dimensions.
   * A new THREE.Mesh is created using the box geometry, and it is added to the `_meshes` array.
   * The position of the mesh is set to the center of the bounding box.
   *
   * @example
   * ```typescript
   * const boundingBoxer = components.get(BoundingBoxer);
   * boundingBoxer.add(fragmentsGroup);
   * const boundingBoxMesh = boundingBoxer.getMesh();
   * scene.add(boundingBoxMesh);
   * ```
   */
  getMesh() {
    const bbox = new THREE.Box3(this._absoluteMin, this._absoluteMax);
    const dimensions = BoundingBoxer.getDimensions(bbox);
    const { width, height, depth, center } = dimensions;
    const box = new THREE.BoxGeometry(width, height, depth);
    const mesh = new THREE.Mesh(box);
    this._meshes.push(mesh);
    mesh.position.copy(center);
    return mesh;
  }

  /**
   * Resets the internal minimum and maximum vectors to positive and negative infinity, respectively.
   * This method is used to prepare the BoundingBoxer for a new set of fragments.
   *
   * @remarks
   * This method is called when a new set of fragments is added to the BoundingBoxer.
   * It ensures that the bounding box calculations are accurate and up-to-date.
   *
   * @example
   * ```typescript
   * const boundingBoxer = components.get(BoundingBoxer);
   * boundingBoxer.add(fragmentsGroup);
   * // ...
   * boundingBoxer.reset();
   * ```
   */
  reset() {
    this._absoluteMin = BoundingBoxer.newBound(true);
    this._absoluteMax = BoundingBoxer.newBound(false);
  }

  /**
   * Adds a FragmentsGroup to the BoundingBoxer.
   *
   * @param group - The FragmentsGroup to add.
   *
   * @remarks
   * This method iterates through each fragment in the provided FragmentsGroup,
   * and calls the `addMesh` method for each fragment's mesh.
   *
   * @example
   * ```typescript
   * const boundingBoxer = components.get(BoundingBoxer);
   * boundingBoxer.add(fragmentsGroup);
   * ```
   */
  add(group: FragmentsGroup) {
    for (const frag of group.items) {
      this.addMesh(frag.mesh);
    }
  }

  /**
   * Adds a mesh to the BoundingBoxer and calculates the bounding box.
   *
   * @param mesh - The mesh to add. It can be an instance of THREE.InstancedMesh, THREE.Mesh, or FRAGS.CurveMesh.
   * @param itemIDs - An optional iterable of numbers representing the item IDs.
   *
   * @remarks
   * This method calculates the bounding box of the provided mesh and updates the internal minimum and maximum vectors.
   * If the mesh is an instance of THREE.InstancedMesh, it calculates the bounding box for each instance.
   * If the mesh is an instance of FRAGS.FragmentMesh and itemIDs are provided, it calculates the bounding box for the specified item IDs.
   *
   * @example
   * ```typescript
   * const boundingBoxer = components.get(BoundingBoxer);
   * boundingBoxer.addMesh(mesh);
   * ```
   */
  addMesh(
    mesh: THREE.InstancedMesh | THREE.Mesh | FRAGS.CurveMesh,
    itemIDs?: Iterable<number>,
  ) {
    if (!mesh.geometry.index) {
      return;
    }

    const bbox = BoundingBoxer.getFragmentBounds(mesh);

    mesh.updateMatrixWorld();
    const meshTransform = mesh.matrixWorld;

    const instanceTransform = new THREE.Matrix4();
    const isInstanced = mesh instanceof THREE.InstancedMesh;
    // const count = isInstanced ? mesh.count : 1;

    const instances = new Set<number>();

    if (mesh instanceof FRAGS.FragmentMesh) {
      if (!itemIDs) {
        itemIDs = mesh.fragment.ids;
      }
      for (const itemID of itemIDs) {
        const ids = mesh.fragment.getInstancesIDs(itemID);
        if (!ids) continue;
        for (const id of ids) {
          instances.add(id);
        }
      }
    } else {
      instances.add(0);
    }

    for (const instance of instances) {
      const min = bbox.min.clone();
      const max = bbox.max.clone();

      if (isInstanced) {
        mesh.getMatrixAt(instance, instanceTransform);
        min.applyMatrix4(instanceTransform);
        max.applyMatrix4(instanceTransform);
      }

      min.applyMatrix4(meshTransform);
      max.applyMatrix4(meshTransform);

      if (min.x < this._absoluteMin.x) this._absoluteMin.x = min.x;
      if (min.y < this._absoluteMin.y) this._absoluteMin.y = min.y;
      if (min.z < this._absoluteMin.z) this._absoluteMin.z = min.z;

      if (min.x > this._absoluteMax.x) this._absoluteMax.x = min.x;
      if (min.y > this._absoluteMax.y) this._absoluteMax.y = min.y;
      if (min.z > this._absoluteMax.z) this._absoluteMax.z = min.z;

      if (max.x > this._absoluteMax.x) this._absoluteMax.x = max.x;
      if (max.y > this._absoluteMax.y) this._absoluteMax.y = max.y;
      if (max.z > this._absoluteMax.z) this._absoluteMax.z = max.z;

      if (max.x < this._absoluteMin.x) this._absoluteMin.x = max.x;
      if (max.y < this._absoluteMin.y) this._absoluteMin.y = max.y;
      if (max.z < this._absoluteMin.z) this._absoluteMin.z = max.z;
    }
  }

  /**
   * Uses a FragmentIdMap to add its meshes to the bb calculation.
   *
   * This method iterates through the provided `fragmentIdMap`, retrieves the corresponding fragment from the `FragmentsManager`,
   * and then calls the `addMesh` method for each fragment's mesh, passing the expression IDs as the second parameter.
   *
   * @param fragmentIdMap - A mapping of fragment IDs to their corresponding expression IDs.
   *
   * @remarks
   * This method is used to add a mapping of fragment IDs to their corresponding expression IDs.
   * It ensures that the bounding box calculations are accurate and up-to-date by updating the internal minimum and maximum vectors.
   *
   * @example
   * ```typescript
   * const boundingBoxer = components.get(BoundingBoxer);
   * const fragmentIdMap: FRAGS.FragmentIdMap = {
   *   '5991fa75-2eef-4825-90b3-85177f51a9c9': [123, 245, 389],
   *   '3469077e-39bf-4fc9-b3e6-4a1d78ad52b0': [454, 587, 612],
   * };
   * boundingBoxer.addFragmentIdMap(fragmentIdMap);
   * ```
   */
  addFragmentIdMap(fragmentIdMap: FRAGS.FragmentIdMap) {
    const fragments = this.components.get(FragmentsManager);
    for (const fragmentID in fragmentIdMap) {
      const fragment = fragments.list.get(fragmentID);
      if (!fragment) continue;
      const expressIDs = fragmentIdMap[fragmentID];
      this.addMesh(fragment.mesh, expressIDs);
    }
  }

  private static getFragmentBounds(
    mesh: THREE.InstancedMesh | THREE.Mesh | FRAGS.CurveMesh,
  ) {
    const position = mesh.geometry.attributes.position;

    const maxNum = Number.MAX_VALUE;
    const minNum = -maxNum;
    const min = new THREE.Vector3(maxNum, maxNum, maxNum);
    const max = new THREE.Vector3(minNum, minNum, minNum);

    if (!mesh.geometry.index) {
      throw new Error("Geometry must be indexed!");
    }

    const indices = Array.from(mesh.geometry.index.array);

    for (let i = 0; i < indices.length; i++) {
      if (i % 3 === 0) {
        if (indices[i] === 0 && indices[i + 1] === 0 && indices[i + 2] === 0) {
          i += 2;
          continue;
        }
      }

      const index = indices[i];
      const x = position.getX(index);
      const y = position.getY(index);
      const z = position.getZ(index);

      if (x < min.x) min.x = x;
      if (y < min.y) min.y = y;
      if (z < min.z) min.z = z;
      if (x > max.x) max.x = x;
      if (y > max.y) max.y = y;
      if (z > max.z) max.z = z;
    }

    return new THREE.Box3(min, max);
  }
}
