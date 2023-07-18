import * as THREE from "three";
import { Fragment, FragmentsGroup } from "bim-fragment";
import { Component, Disposable } from "../../base-types";

/**
 * A simple implementation of bounding box that works for fragments. The resulting bbox is not 100% precise, but
 * it's fast, and should suffice for general use cases such as camera zooming.
 */
export class FragmentBoundingBox
  extends Component<THREE.Mesh>
  implements Disposable
{
  name = "FragmentBoundingBox";
  enabled = true;

  private _absoluteMin: THREE.Vector3;
  private _absoluteMax: THREE.Vector3;

  private _mesh = new THREE.Mesh(
    new THREE.BoxGeometry(),
    new THREE.MeshBasicMaterial({
      color: "red",
      depthTest: false,
      depthWrite: false,
      transparent: true,
      opacity: 0.3,
    })
  );

  constructor() {
    super();
    this._mesh.renderOrder = 1;
    this._absoluteMin = FragmentBoundingBox.newBound(true);
    this._absoluteMax = FragmentBoundingBox.newBound(false);
  }

  get() {
    return this._mesh;
  }

  dispose() {
    this._mesh.removeFromParent();
    this._mesh.geometry.dispose();
    this._mesh.material.dispose();
    (this._mesh.geometry as any) = null;
    (this._mesh.material as any) = null;
  }

  update() {
    const width = this._absoluteMax.x - this._absoluteMin.x;
    const height = this._absoluteMax.y - this._absoluteMin.y;
    const depth = this._absoluteMax.z - this._absoluteMin.z;

    if (this._mesh.geometry) {
      this._mesh.geometry.dispose();
      this._mesh.geometry = new THREE.BoxGeometry(width, height, depth);
    }

    this._mesh.position.set(
      this._absoluteMax.x - width / 2,
      this._absoluteMax.y - height / 2,
      this._absoluteMax.z - depth / 2
    );
  }

  reset() {
    this._mesh.geometry.dispose();
    this._absoluteMin = FragmentBoundingBox.newBound(false);
    this._absoluteMax = FragmentBoundingBox.newBound(true);
  }

  addGroup(group: FragmentsGroup) {
    for (const frag of group.items) {
      this.add(frag);
    }
  }

  add(fragment: any) {
    const bbox = FragmentBoundingBox.getBounds(fragment);

    const instanceTransform = new THREE.Matrix4();
    for (let i = 0; i < fragment.mesh.count; i++) {
      fragment.getInstance(i, instanceTransform);
      const min = bbox.min.clone();
      const max = bbox.max.clone();

      min.applyMatrix4(instanceTransform);
      max.applyMatrix4(instanceTransform);

      if (min.x < this._absoluteMin.x) this._absoluteMin.x = min.x;
      if (min.y < this._absoluteMin.y) this._absoluteMin.y = min.y;
      if (min.z < this._absoluteMin.z) this._absoluteMin.z = min.z;
      if (max.x > this._absoluteMax.x) this._absoluteMax.x = max.x;
      if (max.y > this._absoluteMax.y) this._absoluteMax.y = max.y;
      if (max.z > this._absoluteMax.z) this._absoluteMax.z = max.z;
    }
  }

  private static getBounds(fragment: Fragment) {
    const position = fragment.mesh.geometry.attributes.position;

    const maxNum = Number.MAX_VALUE;
    const minNum = -maxNum;
    const min = new THREE.Vector3(maxNum, maxNum, maxNum);
    const max = new THREE.Vector3(minNum, minNum, minNum);

    const indices = Array.from(fragment.mesh.geometry.index.array);

    for (const index of indices) {
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

  private static newBound(positive: boolean) {
    const factor = positive ? 1 : -1;
    return new THREE.Vector3(
      factor * Number.MAX_VALUE,
      factor * Number.MAX_VALUE,
      factor * Number.MAX_VALUE
    );
  }
}
