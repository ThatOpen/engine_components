import * as THREE from "three";
import * as OBC from "@thatopen/components";
import { CivilPoint } from "../Types";
// import { CurveHighlighter } from "../CivilNavigator/src/curve-highlighter";

/**
 * This component provides functionality for navigating and interacting with civil engineering data in a 3D environment. 📕 [Tutorial](https://docs.thatopen.com/Tutorials/Components/Front/CivilNavigators). 📘 [API](https://docs.thatopen.com/api/@thatopen/components-front/classes/CivilRaycaster).
 *
 */
export class CivilRaycaster {
  alignments: THREE.Group[] = [];

  /** {@link OBC.Component.enabled} */
  enabled = true;

  world: OBC.World | null = null;

  private _raycastable: THREE.Line[] = [];

  private _components: OBC.Components;

  constructor(components: OBC.Components) {
    this._components = components;
  }

  update() {
    this.dispose();

    // Generate all simple line meshes from alignments and remove previous if any
    for (const alignmentSet of this.alignments) {
      for (const i of alignmentSet.children) {
        const alignment = i as THREE.Group;
        alignment.updateWorldMatrix(true, true);
        for (const j of alignment.children) {
          const curve = j as any;
          if (curve.isLine2 && curve.userData.points) {
            const geometry = new THREE.BufferGeometry();
            const line = new THREE.Line();
            line.geometry.setIndex(curve.geometry.index);
            const buffer = new Float32Array(curve.userData.points);
            const bufferAttribute = new THREE.BufferAttribute(buffer, 3);
            geometry.setAttribute("position", bufferAttribute);
            line.geometry = geometry;
            line.userData.curve = curve;
            line.applyMatrix4(curve.matrixWorld);
            line.updateMatrixWorld();
            this._raycastable.push(line);
          }
        }
      }
    }
  }

  dispose() {
    for (const line of this._raycastable) {
      line.geometry.dispose();
      line.geometry = undefined as any;
    }
    this._raycastable = [];
  }

  castRay(): CivilPoint | null {
    // Cast a ray to the raycastable alignments and return:
    // - The intersection point
    // - The normal vector of the intersected edge
    // - The curve
    // - The alignment
    // - The percentage along the alignment

    if (!this.enabled || !this.world) {
      return null;
    }

    const casters = this._components.get(OBC.Raycasters) as OBC.Raycasters;
    const raycaster = casters.get(this.world);
    const intersects = raycaster.castRayToObjects(this._raycastable);
    if (!intersects) {
      return null;
    }

    const object = intersects.object as THREE.Line;
    const geometry = object.geometry as THREE.BufferGeometry;
    const index = intersects.index as number;

    const x1 = geometry.attributes.position.array[index * 3];
    const y1 = geometry.attributes.position.array[index * 3 + 1];
    const z1 = geometry.attributes.position.array[index * 3 + 2];

    const x2 = geometry.attributes.position.array[index * 3 + 3];
    const y2 = geometry.attributes.position.array[index * 3 + 4];
    const z2 = geometry.attributes.position.array[index * 3 + 5];

    const normal = new THREE.Vector3(x2 - x1, y2 - y1, z2 - z1).normalize();

    return {
      point: intersects.point,
      normal,
      curve: object.userData.curve,
      alignment: object.userData.curve.parent,
    };
  }
}
