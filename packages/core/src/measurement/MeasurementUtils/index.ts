import * as THREE from "three";
import * as FRAGS from "@thatopen/fragments";
import { Component, Components } from "../../core";
import { FragmentsManager } from "../../fragments";

/**
 * Represents an edge measurement result.
 */
export interface MeasureEdge {
  /**
   * The distance between the two points of the edge.
   */
  distance: number;

  /**
   * The two points that define the edge.
   */
  points: THREE.Vector3[];
}

/**
 * Utility component for performing measurements on 3D meshes by providing methods for measuring distances between edges and faces. 📕 [Tutorial](https://docs.thatopen.com/Tutorials/Components/Core/MeasurementUtils). 📘 [API](https://docs.thatopen.com/api/@thatopen/components/classes/MeasurementUtils).
 */
export class MeasurementUtils extends Component {
  /**
   * A unique identifier for the component.
   * This UUID is used to register the component within the Components system.
   */
  static uuid = "267ca032-672f-4cb0-afa9-d24e904f39d6";

  /** {@link Component.enabled} */
  enabled = true;

  constructor(components: Components) {
    super(components);
    components.add(MeasurementUtils.uuid, this);
  }

  /**
   * Utility method to calculate the distance from a point to a line segment.
   *
   * @param point - The point from which to calculate the distance.
   * @param lineStart - The start point of the line segment.
   * @param lineEnd - The end point of the line segment.
   * @param clamp - If true, the distance will be clamped to the line segment's length.
   * @returns The distance from the point to the line segment.
   */
  static distanceFromPointToLine(
    point: THREE.Vector3,
    lineStart: THREE.Vector3,
    lineEnd: THREE.Vector3,
    clamp = false,
  ) {
    const tempLine = new THREE.Line3();
    const tempPoint = new THREE.Vector3();
    tempLine.set(lineStart, lineEnd);
    tempLine.closestPointToPoint(point, clamp, tempPoint);
    return tempPoint.distanceTo(point);
  }

  /**
   * Method to get the face of a mesh that contains a given triangle index.
   * It also returns the edges of the found face and their indices.
   *
   * @param mesh - The mesh to get the face from. It must be indexed.
   * @param triangleIndex - The index of the triangle within the mesh.
   * @param instance - The instance of the mesh (optional).
   * @returns An object containing the edges of the found face and their indices, or null if no face was found.
   */
  getFace(
    mesh: THREE.InstancedMesh | THREE.Mesh,
    triangleIndex: number,
    instance?: number,
  ) {
    if (!mesh.geometry.index) {
      throw new Error("Geometry must be indexed!");
    }

    const allEdges = new Map<string, MeasureEdge>();

    const indices = mesh.geometry.index.array;

    // Find out the raycasted face plane

    const { plane: targetPlane } = this.getFaceData(
      triangleIndex,
      instance,
      mesh,
    );

    // Get the face where the given triangle belongs

    const coplanarFacesIndices: {
      index: number;
      edges: { id: string; distance: number; points: THREE.Vector3[] }[];
    }[] = [];

    for (let faceIndex = 0; faceIndex < indices.length / 3; faceIndex++) {
      const { plane, edges } = this.getFaceData(faceIndex, instance, mesh);

      if (plane.equals(targetPlane)) {
        coplanarFacesIndices.push({ index: faceIndex, edges });
        for (const { id, points, distance } of edges) {
          allEdges.set(id, { points, distance });
        }
      }
    }

    // Now, let's get all faces (groups of adjacent triangles)
    // To visualize this, draw all possible cases on paper, it's easy

    let nextFaceID = 0;
    const edgeFaceMap = new Map<string, number>();
    const faceEdgesMap = new Map<
      number,
      { edges: Set<string>; indices: Set<number> }
    >();

    for (const { index, edges } of coplanarFacesIndices) {
      const commonEdgesFaces = new Map<string, number>();

      for (const { id: edge } of edges) {
        if (edgeFaceMap.has(edge)) {
          const commonFace = edgeFaceMap.get(edge) as number;
          commonEdgesFaces.set(edge, commonFace);
        }
      }

      const edgesIDs = edges.map((edge) => edge.id);

      // Triangle is isolated, just create a new face
      if (!commonEdgesFaces.size) {
        const faceID = nextFaceID++;

        for (const { id: edge } of edges) {
          edgeFaceMap.set(edge, faceID);
        }

        faceEdgesMap.set(faceID, {
          edges: new Set(edgesIDs),
          indices: new Set([index]),
        });

        continue;
      }

      // Triangle has common edges with existing faces

      let firstFaceID: number | null = null;
      const otherFaces = new Set<number>();
      const edgesToAdd = new Set(edgesIDs);

      // First, remove all common edges
      for (const [edge, faceID] of commonEdgesFaces) {
        if (firstFaceID === null) {
          firstFaceID = faceID;
        } else if (faceID !== firstFaceID) {
          otherFaces.add(faceID);
        }

        edgeFaceMap.delete(edge);
        const { edges: foundFaceEdges } = faceEdgesMap.get(faceID)!;
        foundFaceEdges.delete(edge);
        edgesToAdd.delete(edge);
      }

      // If we hadn't found a face, we wouldn't be here
      if (firstFaceID === null) {
        throw new Error("Error computing face!");
      }

      // Now, let's merge this triangle with the first face
      const firstFace = faceEdgesMap.get(firstFaceID)!;
      const { indices: firstFaceIndices } = firstFace;
      firstFaceIndices.add(index);

      for (const edge of edgesToAdd) {
        edgeFaceMap.set(edge, firstFaceID);
        const { edges: firstFaceEdges } = firstFace;
        firstFaceEdges.add(edge);
      }

      // Finally, if there were other faces in common
      // merge them with the first one
      for (const faceID of otherFaces) {
        const otherFace = faceEdgesMap.get(faceID)!;
        const { edges: otherEdges, indices: otherIndices } = otherFace;
        const firstFace = faceEdgesMap.get(firstFaceID)!;
        const { edges: firstEdges, indices: firstIndices } = firstFace;

        for (const edge of otherEdges) {
          firstEdges.add(edge);
          edgeFaceMap.set(edge, firstFaceID);
        }

        for (const index of otherIndices) {
          firstIndices.add(index);
        }

        faceEdgesMap.delete(faceID);
      }
    }

    for (const [_faceID, { indices, edges }] of faceEdgesMap) {
      if (indices.has(triangleIndex)) {
        const foundEdges: MeasureEdge[] = [];
        for (const edgeID of edges) {
          const foundEdge = allEdges.get(edgeID)!;
          foundEdges.push(foundEdge);
        }
        return { edges: foundEdges, indices };
      }
    }

    return null;
  }

  /**
   * Method to get the vertices and normal of a mesh face at a given index.
   * It also applies instance transformation if provided.
   *
   * @param mesh - The mesh to get the face from. It must be indexed.
   * @param faceIndex - The index of the face within the mesh.
   * @param instance - The instance of the mesh (optional).
   * @returns An object containing the vertices and normal of the face.
   * @throws Will throw an error if the geometry is not indexed.
   */
  getVerticesAndNormal(
    mesh: THREE.Mesh | THREE.InstancedMesh,
    faceIndex: number,
    instance: number | undefined,
  ) {
    if (!mesh.geometry.index) {
      throw new Error("Geometry must be indexed!");
    }

    const indices = mesh.geometry.index.array;

    const pos = mesh.geometry.attributes.position.array;
    const nor = mesh.geometry.attributes.normal.array;

    const i1 = indices[faceIndex * 3] * 3;
    const i2 = indices[faceIndex * 3 + 1] * 3;
    const i3 = indices[faceIndex * 3 + 2] * 3;

    const p1 = new THREE.Vector3(pos[i1], pos[i1 + 1], pos[i1 + 2]);
    const p2 = new THREE.Vector3(pos[i2], pos[i2 + 1], pos[i2 + 2]);
    const p3 = new THREE.Vector3(pos[i3], pos[i3 + 1], pos[i3 + 2]);

    const n1 = new THREE.Vector3(nor[i1], nor[i1 + 1], nor[i1 + 2]);
    const n2 = new THREE.Vector3(nor[i2], nor[i2 + 1], nor[i2 + 2]);
    const n3 = new THREE.Vector3(nor[i3], nor[i3 + 1], nor[i3 + 2]);

    const averageNx = (n1.x + n2.x + n3.x) / 3;
    const averageNy = (n1.y + n2.y + n3.y) / 3;
    const averageNz = (n1.z + n2.z + n3.z) / 3;
    const faceNormal = new THREE.Vector3(averageNx, averageNy, averageNz);

    // Apply instance transformation to vertex and normal

    if (instance !== undefined && mesh instanceof THREE.InstancedMesh) {
      const transform = new THREE.Matrix4();
      mesh.getMatrixAt(instance, transform);
      const rotation = new THREE.Matrix4();
      rotation.extractRotation(transform);
      faceNormal.applyMatrix4(rotation);
      p1.applyMatrix4(transform);
      p2.applyMatrix4(transform);
      p3.applyMatrix4(transform);
    }

    return { p1, p2, p3, faceNormal };
  }

  /**
   * Method to round the vector's components to a specified number of decimal places.
   * This is used to ensure numerical precision in edge detection.
   *
   * @param vector - The vector to round.
   * @returns The vector with rounded components.
   */
  round(vector: THREE.Vector3) {
    const factor = 1000;
    vector.x = Math.trunc(vector.x * factor) / factor;
    vector.y = Math.trunc(vector.y * factor) / factor;
    vector.z = Math.trunc(vector.z * factor) / factor;
  }

  /**
   * Calculates the volume of a set of fragments.
   *
   * @param frags - A map of fragment IDs to their corresponding item IDs.
   * @returns The total volume of the fragments and the bounding sphere.
   *
   * @remarks
   * This method creates a set of instanced meshes from the given fragments and item IDs.
   * It then calculates the volume of each mesh and returns the total volume and its bounding sphere.
   *
   * @throws Will throw an error if the geometry of the meshes is not indexed.
   * @throws Will throw an error if the fragment manager is not available.
   */
  getVolumeFromFragments(frags: FRAGS.FragmentIdMap) {
    const fragments = this.components.get(FragmentsManager);
    const tempMatrix = new THREE.Matrix4();

    const meshes: THREE.InstancedMesh[] = [];
    for (const fragID in frags) {
      const fragment = fragments.list.get(fragID);
      if (!fragment) continue;
      const itemIDs = frags[fragID];

      let instanceCount = 0;
      for (const id of itemIDs) {
        const instances = fragment.getInstancesIDs(id);
        if (!instances) continue;
        instanceCount += instances.size;
      }

      const mesh = new THREE.InstancedMesh(
        fragment.mesh.geometry,
        undefined,
        instanceCount,
      );

      let counter = 0;
      for (const id of itemIDs) {
        const instances = fragment.getInstancesIDs(id);
        if (!instances) continue;
        for (const instance of instances) {
          fragment.mesh.getMatrixAt(instance, tempMatrix);
          mesh.setMatrixAt(counter++, tempMatrix);
        }
      }

      meshes.push(mesh);
    }

    const result = this.getVolumeFromMeshes(meshes);

    for (const mesh of meshes) {
      mesh.geometry = null as any;
      mesh.material = [];
      mesh.dispose();
    }

    return result;
  }

  /**
   * Calculates the total volume of a set of meshes.
   *
   * @param meshes - An array of meshes or instanced meshes to calculate the volume from.
   * @returns The total volume of the meshes and the bounding sphere.
   *
   * @remarks
   * This method calculates the volume of each mesh in the provided array and returns the total volume
   * and its bounding sphere.
   *
   */
  getVolumeFromMeshes(meshes: THREE.InstancedMesh[] | THREE.Mesh[]) {
    let volume = 0;
    for (const mesh of meshes) {
      volume += this.getVolumeOfMesh(mesh);
    }
    return volume;
  }

  private getFaceData(
    faceIndex: number,
    instance: number | undefined,
    mesh: THREE.Mesh | THREE.InstancedMesh,
  ) {
    const found = this.getVerticesAndNormal(mesh, faceIndex, instance);
    const { p1, p2, p3, faceNormal } = found;

    // Round numbers to make sure numerical precision
    // doesn't affect edge detection

    this.round(p1);
    this.round(p2);
    this.round(p3);
    this.round(faceNormal);

    // To make sure the edge AB === the edge BA

    const vertices = [
      { id: `${p1.x}|${p1.y}|${p1.z}`, value: p1 },
      { id: `${p2.x}|${p2.y}|${p2.z}`, value: p2 },
      { id: `${p3.x}|${p3.y}|${p3.z}`, value: p3 },
    ];

    vertices.sort((a, b) => {
      if (a.id < b.id) {
        return -1;
      }
      if (a.id > b.id) {
        return 1;
      }
      return 0;
    });

    const [
      { id: id1, value: v1 },
      { id: id2, value: v2 },
      { id: id3, value: v3 },
    ] = vertices;

    // Create IDs to identify the edges

    const edges = [
      {
        id: `${id1}|${id2}`,
        distance: v1.distanceTo(v2),
        points: [v1, v2],
      },
      {
        id: `${id2}|${id3}`,
        distance: v2.distanceTo(v3),
        points: [v2, v3],
      },
      {
        id: `${id1}|${id3}`,
        distance: v1.distanceTo(v3),
        points: [v1, v3],
      },
    ];

    const plane = new THREE.Plane();
    plane.setFromNormalAndCoplanarPoint(faceNormal, p1);
    plane.constant = Math.round(plane.constant * 10) / 10;
    return { plane, edges };
  }

  // https://stackoverflow.com/a/1568551
  private getVolumeOfMesh(mesh: THREE.Mesh | THREE.InstancedMesh) {
    let volume = 0;
    const p1 = new THREE.Vector3();
    const p2 = new THREE.Vector3();
    const p3 = new THREE.Vector3();
    const { index } = mesh.geometry;
    const pos = mesh.geometry.attributes.position.array;
    if (!index) {
      console.warn("Geometry must be indexed to compute its volume!");
      return 0;
    }
    // prettier-ignore
    const instances: THREE.Matrix4[] = [];
    if (mesh instanceof THREE.InstancedMesh) {
      for (let i = 0; i < mesh.count; i++) {
        const matrix = new THREE.Matrix4();
        mesh.getMatrixAt(i, matrix);
        instances.push(matrix);
      }
    } else {
      instances.push(new THREE.Matrix4().identity());
    }
    const { matrixWorld } = mesh;
    for (let i = 0; i < index.array.length - 2; i += 3) {
      for (const instance of instances) {
        const transform = instance.multiply(matrixWorld);
        const i1 = index.array[i] * 3;
        const i2 = index.array[i + 1] * 3;
        const i3 = index.array[i + 2] * 3;
        p1.set(pos[i1], pos[i1 + 1], pos[i1 + 2]).applyMatrix4(transform);
        p2.set(pos[i2], pos[i2 + 1], pos[i2 + 2]).applyMatrix4(transform);
        p3.set(pos[i3], pos[i3 + 1], pos[i3 + 2]).applyMatrix4(transform);
        volume += this.getSignedVolumeOfTriangle(p1, p2, p3);
      }
    }
    return Math.abs(volume);
  }

  private getSignedVolumeOfTriangle(
    p1: THREE.Vector3,
    p2: THREE.Vector3,
    p3: THREE.Vector3,
  ) {
    const v321 = p3.x * p2.y * p1.z;
    const v231 = p2.x * p3.y * p1.z;
    const v312 = p3.x * p1.y * p2.z;
    const v132 = p1.x * p3.y * p2.z;
    const v213 = p2.x * p1.y * p3.z;
    const v123 = p1.x * p2.y * p3.z;
    return (1.0 / 6.0) * (-v321 + v231 + v312 - v132 - v213 + v123);
  }
}
