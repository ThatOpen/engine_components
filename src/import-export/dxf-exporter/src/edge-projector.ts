import * as THREE from "three";
import { MeshBVH } from "three-mesh-bvh";
import { FragmentMesh } from "bim-fragment/fragment-mesh";
import {
  compressEdgeOverlaps,
  edgesToGeometry,
  generateEdges,
  getProjectedOverlaps,
  isLineAbovePlane,
  isLineTriangleEdge,
  isYProjectedLineDegenerate,
  isYProjectedTriangleDegenerate,
  overlapsToLines,
  trimToBeneathTriPlane,
} from "./edge-utils";

// Source: https://github.com/gkjohnson/three-mesh-bvh/blob/master/example/edgeProjection.js

export class EdgeProjector {
  params = {
    displayModel: "color",
    displayEdges: false,
    displayProjection: true,
    useBVH: true,
    sortEdges: true,
    amount: 50,
    color: 0x666666,
  };

  private _defaultMaterial = new THREE.LineBasicMaterial({
    color: this.params.color,
  });

  projectedEdges: THREE.LineSegments[] = [];

  dispose() {
    this.disposeGeometry();
    this._defaultMaterial.dispose();
  }

  disposeGeometry() {
    this.projectedEdges.forEach((edge) => {
      edge.geometry.dispose();
      if (Array.isArray(edge.material))
        edge.material.forEach((mat) => mat.dispose());
      else edge.material.dispose();
    });

    this.projectedEdges = [];
  }

  async project(meshes: FragmentMesh[], height: number) {
    // create projection display mesh
    const projection = new THREE.LineSegments(
      new THREE.BufferGeometry(),
      this._defaultMaterial
    );

    const tempMatrix = new THREE.Matrix4();
    const v1 = new THREE.Vector3();
    const v2 = new THREE.Vector3();
    const v3 = new THREE.Vector3();

    const vertices: number[] = [];
    const indices: number[] = [];
    let nextIndex = 0;

    for (const mesh of meshes) {
      mesh.updateWorldMatrix(false, false);
      const transform = mesh.matrixWorld.clone();
      const pos = mesh.geometry.attributes.position.array;
      const index = mesh.geometry.index.array;
      for (let i = 0; i < mesh.count; i++) {
        const pastIndices = new Map<number, number>();
        mesh.getMatrixAt(i, tempMatrix);
        tempMatrix.multiply(transform);
        for (let j = 0; j < index.length; j += 3) {
          const index1 = index[j] * 3;
          const index2 = index[j + 1] * 3;
          const index3 = index[j + 2] * 3;
          v1.set(pos[index1], pos[index1 + 1], pos[index1 + 2]);
          v2.set(pos[index2], pos[index2 + 1], pos[index2 + 2]);
          v3.set(pos[index3], pos[index3 + 1], pos[index3 + 2]);
          v1.applyMatrix4(tempMatrix);
          v2.applyMatrix4(tempMatrix);
          v3.applyMatrix4(tempMatrix);
          if (v1.y > height && v2.y > height && v3.y > height) {
            continue;
          }
          if (!pastIndices.has(index1)) {
            pastIndices.set(index1, nextIndex++);
            vertices.push(v1.x, v1.y, v1.z);
          }
          if (!pastIndices.has(index2)) {
            pastIndices.set(index2, nextIndex++);
            vertices.push(v2.x, v2.y, v2.z);
          }
          if (!pastIndices.has(index3)) {
            pastIndices.set(index3, nextIndex++);
            vertices.push(v3.x, v3.y, v3.z);
          }
          const i1 = pastIndices.get(index1);
          const i2 = pastIndices.get(index2);
          const i3 = pastIndices.get(index3);
          if (i1 !== undefined && i2 !== undefined && i3 !== undefined) {
            indices.push(i1, i2, i3);
          }
        }
      }
    }

    const buffer = new Float32Array(vertices);
    const mergedGeometry = new THREE.BufferGeometry();
    mergedGeometry.setIndex(indices);
    const attribute = new THREE.BufferAttribute(buffer, 3);
    mergedGeometry.setAttribute("position", attribute);

    let task: any = this.updateEdges(this.params, mergedGeometry, projection);

    while (task) {
      const res = task.next();
      if (res.done) {
        task = null;
      }
    }

    this.projectedEdges.push(projection);

    mergedGeometry.dispose();

    return projection;
  }

  *updateEdges(
    params: any,
    mergedGeometry: THREE.BufferGeometry,
    projection: THREE.LineSegments
  ) {
    yield;

    // generate the bvh for acceleration
    const bvh = new MeshBVH(mergedGeometry);

    yield;

    // generate the candidate edges
    const edges = generateEdges(mergedGeometry, new THREE.Vector3(0, 1, 0), 50);

    if (params.sortEdges) {
      edges.sort((a, b) => {
        return Math.min(a.start.y, a.end.y) - Math.min(b.start.y, b.end.y);
      });
    }

    yield;

    // trim the candidate edges
    const finalEdges: any[] = [];
    const tempLine = new THREE.Line3();
    const tempRay = new THREE.Ray();
    const tempVec = new THREE.Vector3();

    for (let i = 0, l = edges.length; i < l; i++) {
      const line = edges[i];
      if (isYProjectedLineDegenerate(line)) {
        continue;
      }

      const lowestLineY = Math.min(line.start.y, line.end.y);
      const overlaps: any[] = [];
      bvh.shapecast({
        intersectsBounds: (box) => {
          if (!params.useBVH) {
            return true;
          }

          // check if the box bounds are above the lowest line point
          box.min.y = Math.min(lowestLineY, box.min.y);
          tempRay.origin.copy(line.start);
          line.delta(tempRay.direction).normalize();

          if (box.containsPoint(tempRay.origin)) {
            return true;
          }

          if (tempRay.intersectBox(box, tempVec)) {
            return (
              tempRay.origin.distanceToSquared(tempVec) < line.distanceSq()
            );
          }

          return false;
        },

        intersectsTriangle: (tri: any) => {
          // skip the triangle if it is completely below the line
          const highestTriangleY = Math.max(tri.a.y, tri.b.y, tri.c.y);

          if (highestTriangleY < lowestLineY) {
            return false;
          }

          // if the projected triangle is just a line then don't check it
          if (isYProjectedTriangleDegenerate(tri)) {
            return false;
          }

          // if this line lies on a triangle edge then don't check it
          if (isLineTriangleEdge(tri, line)) {
            return false;
          }

          trimToBeneathTriPlane(tri, line, tempLine);

          if (isLineAbovePlane(tri.plane, tempLine)) {
            return false;
          }

          if (tempLine.distance() < 1e-10) {
            return false;
          }

          // compress the edge overlaps so we can easily tell if the whole edge is hidden already
          // and exit early
          if (getProjectedOverlaps(tri, line, overlaps)) {
            compressEdgeOverlaps(overlaps);
          }

          // if we're hiding the edge entirely now then skip further checks
          if (overlaps.length !== 0) {
            const [d0, d1] = overlaps[overlaps.length - 1];
            return d0 === 0.0 && d1 === 1.0;
          }

          return false;
        },
      });

      overlapsToLines(line, overlaps, finalEdges);
    }

    projection.geometry.dispose();
    projection.geometry = edgesToGeometry(finalEdges, 0);
  }
}
