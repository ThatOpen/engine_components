import * as THREE from "three";
import { Components } from "../../core";
import { FragmentsGroup } from 'bim-fragment';

export function roundVector(vector: THREE.Vector3, factor = 100) {
  vector.x = Math.round(vector.x * factor) / factor;
  vector.y = Math.round(vector.y * factor) / factor;
  vector.z = Math.round(vector.z * factor) / factor;
}

export function getIndices(index: THREE.TypedArray, i: number) {
  const i1 = index[i] * 3;
  const i2 = index[i + 1] * 3;
  const i3 = index[i + 2] * 3;
  return [i1, i2, i3];
}

export function getIndexAndPos(mesh: THREE.Mesh | THREE.InstancedMesh) {
  const { geometry } = mesh;
  if (!geometry.index) {
    throw new Error("Geometry must be indexed!");
  }
  const index = geometry.index.array as THREE.TypedArray;
  const pos = geometry.attributes.position.array as THREE.TypedArray;
  return { index, pos };
}

export function getVertices(
  mesh: THREE.Mesh | THREE.InstancedMesh,
  i: number,
  instance: number | undefined
) {
  const { index, pos } = getIndexAndPos(mesh);
  const [i1, i2, i3] = getIndices(index, i);
  const v1 = new THREE.Vector3();
  const v2 = new THREE.Vector3();
  const v3 = new THREE.Vector3();

  v1.set(pos[i1], pos[i1 + 1], pos[i1 + 2]);
  v2.set(pos[i2], pos[i2 + 1], pos[i2 + 2]);
  v3.set(pos[i3], pos[i3 + 1], pos[i3 + 2]);

  v1.applyMatrix4(mesh.matrixWorld);
  v2.applyMatrix4(mesh.matrixWorld);
  v3.applyMatrix4(mesh.matrixWorld);

  if (mesh instanceof THREE.InstancedMesh && instance !== undefined) {
    const instanceTransform = new THREE.Matrix4();
    mesh.getMatrixAt(instance, instanceTransform);
    v1.applyMatrix4(instanceTransform);
    v2.applyMatrix4(instanceTransform);
    v3.applyMatrix4(instanceTransform);
  }
  return { v1, v2, v3 };
}

export function getPlane(
  mesh: THREE.Mesh | THREE.InstancedMesh,
  i: number,
  instance?: number
) {
  const { v1, v2, v3 } = getVertices(mesh, i, instance);

  roundVector(v1);
  roundVector(v2);
  roundVector(v3);

  const plane = new THREE.Plane().setFromCoplanarPoints(v1, v2, v3);

  roundVector(plane.normal);
  plane.constant = Math.round(plane.constant * 10) / 10;

  return { plane, v1, v2, v3 };
}

export function distanceFromPointToLine(
  point: THREE.Vector3,
  lineStart: THREE.Vector3,
  lineEnd: THREE.Vector3,
  clamp = false
) {
  const tempLine = new THREE.Line3();
  const tempPoint = new THREE.Vector3();
  tempLine.set(lineStart, lineEnd);
  tempLine.closestPointToPoint(point, clamp, tempPoint);
  return tempPoint.distanceTo(point);
}

// TODO: Not perfect, fails in more difficult geometries
export function getRaycastedFace(
  mesh: THREE.Mesh | THREE.InstancedMesh,
  faceIndex: number,
  instance?: number
) {
  const addTriangleToIsland = (
    loop: { indices: number[]; ids: Set<string> },
    e1: string,
    e2: string,
    e3: string
  ) => {
    loop.ids.delete(e1);
    if (loop.ids.has(e2)) {
      // When a triangle has 2 edges matching the island
      loop.ids.delete(e2);
    } else {
      loop.ids.add(e2);
    }
    if (loop.ids.has(e3)) {
      // When a triangle has 2 edges matching the island
      loop.ids.delete(e3);
    } else {
      loop.ids.add(e3);
    }
  };

  const addTriangleToFace = (
    face: { indices: number[]; ids: Set<string> }[],
    iterator: { found: null | number; i: number },
    e1: string,
    e2: string,
    e3: string,
    i: number,
    raycasted: { index: number; island: number }
  ) => {
    const loop = face[iterator.i];

    if (iterator.found === null) {
      // When a triangle matches an island of triangles for the first time
      addTriangleToIsland(loop, e1, e2, e3);
      loop.indices.push(i);
      iterator.found = iterator.i;
    } else {
      // This triangle has matched more than one island: fusion both islands
      const previous = face[iterator.found];
      for (const item of loop.ids) {
        if (previous.ids.has(item)) {
          previous.ids.delete(item);
        } else {
          previous.ids.add(item);
        }
      }
      for (const item of loop.indices) {
        previous.indices.push(item);
      }
      face.splice(iterator.i, 1);
      iterator.i--;
    }
    if (raycasted.index === i) {
      raycasted.island = iterator.found;
    }
  };

  const target = getPlane(mesh, faceIndex * 3, instance);
  const { index } = getIndexAndPos(mesh);

  const face = [] as { indices: number[]; ids: Set<string> }[];
  const allDistances = {} as { [id: string]: number };
  const allEdges = {} as { [id: string]: THREE.Vector3[] };

  // Which of the face island was hit by the raycaster
  const raycasted = { index: faceIndex * 3, island: 0 };

  for (let i = 0; i < index.length - 2; i += 3) {
    const current = getPlane(mesh, i, instance);

    const isCoplanar = target.plane.equals(current.plane);
    if (isCoplanar) {
      const vectors = [current.v1, current.v2, current.v3];
      vectors.sort((a, b) => a.x - b.x || a.y - b.y || a.z - b.z);
      const [v1, v2, v3] = vectors;
      const v1ID = `${v1.x}_${v1.y}_${v1.z}`;
      const v2ID = `${v2.x}_${v2.y}_${v2.z}`;
      const v3ID = `${v3.x}_${v3.y}_${v3.z}`;

      const e1 = `${v1ID}|${v2ID}`;
      const e2 = `${v2ID}|${v3ID}`;
      const e3 = `${v1ID}|${v3ID}`;

      allDistances[e1] = v1.distanceTo(v2);
      allDistances[e2] = v2.distanceTo(v3);
      allDistances[e3] = v3.distanceTo(v1);
      allEdges[e1] = [v1, v2];
      allEdges[e2] = [v2, v3];
      allEdges[e3] = [v3, v1];

      const iterator: { found: null | number; i: number } = {
        found: null,
        i: 0,
      };

      for (iterator.i; iterator.i < face.length; iterator.i++) {
        const loop = face[iterator.i];
        if (loop.ids.has(e1)) {
          addTriangleToFace(face, iterator, e1, e2, e3, i, raycasted);
        } else if (loop.ids.has(e2)) {
          addTriangleToFace(face, iterator, e2, e3, e1, i, raycasted);
        } else if (loop.ids.has(e3)) {
          addTriangleToFace(face, iterator, e3, e1, e2, i, raycasted);
        }
      }

      if (iterator.found === null) {
        if (raycasted.index === i) {
          raycasted.island = face.length;
        }
        face.push({ indices: [i], ids: new Set([e1, e2, e3]) });
      }
    }
  }

  const currentFace = face[raycasted.island];
  if (!currentFace) return null;

  const distances = {} as { [id: string]: number };
  const edges = {} as { [id: string]: THREE.Vector3[] };
  for (const id of currentFace.ids) {
    distances[id] = allDistances[id];
    edges[id] = allEdges[id];
  }

  return { face: currentFace, distances, edges };
}


export function createPhysicalEdges(components: Components, model: FragmentsGroup) {

  for (let index = 0; index < model.items.length; index++) {
    const element = model.items[index];
    const instancedMesh = element.mesh;

    const geometry = instancedMesh.geometry;
    const material = instancedMesh.material;

    for (let i = 0; i < instancedMesh.count; i++) {
      const mesh = new THREE.Mesh(geometry, material);

      instancedMesh.getMatrixAt(i, mesh.matrix);

      const position = new THREE.Vector3();
      const rotation = new THREE.Quaternion();
      const scale = new THREE.Vector3();
      mesh.matrix.decompose(position, rotation, scale);

      mesh.position.copy(position);
      mesh.setRotationFromQuaternion(rotation);
      mesh.scale.copy(scale);

      const edgesGeometry = new THREE.EdgesGeometry(geometry);

      const edgesMaterial = new THREE.LineBasicMaterial({ color: 0x333333 });
      const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);

      edges.position.copy(position);
      edges.setRotationFromQuaternion(rotation);
      edges.scale.copy(scale);
      const scene = components.scene.get()
      scene.add(edges);
    }
  }
}