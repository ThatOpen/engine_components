import * as THREE from "three";
// import * as FRAGS from "@thatopen/fragments";
import { Component, Components } from "../../core";
import { FragmentsManager, ModelIdMap } from "../../fragments";
// import { FragmentsManager } from "../../fragments";

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
 * Utility component for performing measurements on 3D meshes by providing methods for measuring distances between edges and faces. 📘 [API](https://docs.thatopen.com/api/@thatopen/components/classes/MeasurementUtils).
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

  // /**
  //  * Method to get the face of a mesh that contains a given triangle index.
  //  * It also returns the edges of the found face and their indices.
  //  *
  //  * @param mesh - The mesh to get the face from. It must be indexed.
  //  * @param triangleIndex - The index of the triangle within the mesh.
  //  * @param instance - The instance of the mesh (optional).
  //  * @returns An object containing the edges of the found face and their indices, or null if no face was found.
  //  */
  // getFace(
  //   mesh: THREE.InstancedMesh | THREE.Mesh,
  //   triangleIndex: number,
  //   instance?: number,
  // ) {
  //   if (!mesh.geometry.index) {
  //     throw new Error("Geometry must be indexed!");
  //   }

  //   const allEdges = new Map<string, MeasureEdge>();

  //   const indices = mesh.geometry.index.array;

  //   // Find out the raycasted face plane

  //   const { plane: targetPlane } = this.getFaceData(
  //     triangleIndex,
  //     instance,
  //     mesh,
  //   );

  //   // Get the face where the given triangle belongs

  //   const coplanarFacesIndices: {
  //     index: number;
  //     edges: { id: string; distance: number; points: THREE.Vector3[] }[];
  //   }[] = [];

  //   for (let faceIndex = 0; faceIndex < indices.length / 3; faceIndex++) {
  //     const { plane, edges } = this.getFaceData(faceIndex, instance, mesh);

  //     if (plane.equals(targetPlane)) {
  //       coplanarFacesIndices.push({ index: faceIndex, edges });
  //       for (const { id, points, distance } of edges) {
  //         allEdges.set(id, { points, distance });
  //       }
  //     }
  //   }

  //   // Now, let's get all faces (groups of adjacent triangles)
  //   // To visualize this, draw all possible cases on paper, it's easy

  //   let nextFaceID = 0;
  //   const edgeFaceMap = new Map<string, number>();
  //   const faceEdgesMap = new Map<
  //     number,
  //     { edges: Set<string>; indices: Set<number> }
  //   >();

  //   for (const { index, edges } of coplanarFacesIndices) {
  //     const commonEdgesFaces = new Map<string, number>();

  //     for (const { id: edge } of edges) {
  //       if (edgeFaceMap.has(edge)) {
  //         const commonFace = edgeFaceMap.get(edge) as number;
  //         commonEdgesFaces.set(edge, commonFace);
  //       }
  //     }

  //     const edgesIDs = edges.map((edge) => edge.id);

  //     // Triangle is isolated, just create a new face
  //     if (!commonEdgesFaces.size) {
  //       const faceID = nextFaceID++;

  //       for (const { id: edge } of edges) {
  //         edgeFaceMap.set(edge, faceID);
  //       }

  //       faceEdgesMap.set(faceID, {
  //         edges: new Set(edgesIDs),
  //         indices: new Set([index]),
  //       });

  //       continue;
  //     }

  //     // Triangle has common edges with existing faces

  //     let firstFaceID: number | null = null;
  //     const otherFaces = new Set<number>();
  //     const edgesToAdd = new Set(edgesIDs);

  //     // First, remove all common edges
  //     for (const [edge, faceID] of commonEdgesFaces) {
  //       if (firstFaceID === null) {
  //         firstFaceID = faceID;
  //       } else if (faceID !== firstFaceID) {
  //         otherFaces.add(faceID);
  //       }

  //       edgeFaceMap.delete(edge);
  //       const { edges: foundFaceEdges } = faceEdgesMap.get(faceID)!;
  //       foundFaceEdges.delete(edge);
  //       edgesToAdd.delete(edge);
  //     }

  //     // If we hadn't found a face, we wouldn't be here
  //     if (firstFaceID === null) {
  //       throw new Error("Error computing face!");
  //     }

  //     // Now, let's merge this triangle with the first face
  //     const firstFace = faceEdgesMap.get(firstFaceID)!;
  //     const { indices: firstFaceIndices } = firstFace;
  //     firstFaceIndices.add(index);

  //     for (const edge of edgesToAdd) {
  //       edgeFaceMap.set(edge, firstFaceID);
  //       const { edges: firstFaceEdges } = firstFace;
  //       firstFaceEdges.add(edge);
  //     }

  //     // Finally, if there were other faces in common
  //     // merge them with the first one
  //     for (const faceID of otherFaces) {
  //       const otherFace = faceEdgesMap.get(faceID)!;
  //       const { edges: otherEdges, indices: otherIndices } = otherFace;
  //       const firstFace = faceEdgesMap.get(firstFaceID)!;
  //       const { edges: firstEdges, indices: firstIndices } = firstFace;

  //       for (const edge of otherEdges) {
  //         firstEdges.add(edge);
  //         edgeFaceMap.set(edge, firstFaceID);
  //       }

  //       for (const index of otherIndices) {
  //         firstIndices.add(index);
  //       }

  //       faceEdgesMap.delete(faceID);
  //     }
  //   }

  //   for (const [_faceID, { indices, edges }] of faceEdgesMap) {
  //     if (indices.has(triangleIndex)) {
  //       const foundEdges: MeasureEdge[] = [];
  //       for (const edgeID of edges) {
  //         const foundEdge = allEdges.get(edgeID)!;
  //         foundEdges.push(foundEdge);
  //       }
  //       return { edges: foundEdges, indices };
  //     }
  //   }

  //   return null;
  // }

  // /**
  //  * Method to get the vertices and normal of a mesh face at a given index.
  //  * It also applies instance transformation if provided.
  //  *
  //  * @param mesh - The mesh to get the face from. It must be indexed.
  //  * @param faceIndex - The index of the face within the mesh.
  //  * @param instance - The instance of the mesh (optional).
  //  * @returns An object containing the vertices and normal of the face.
  //  * @throws Will throw an error if the geometry is not indexed.
  //  */
  // getVerticesAndNormal(
  //   mesh: THREE.Mesh | THREE.InstancedMesh,
  //   faceIndex: number,
  //   instance: number | undefined,
  // ) {
  //   if (!mesh.geometry.index) {
  //     throw new Error("Geometry must be indexed!");
  //   }

  //   const indices = mesh.geometry.index.array;

  //   const pos = mesh.geometry.attributes.position.array;
  //   const nor = mesh.geometry.attributes.normal.array;

  //   const i1 = indices[faceIndex * 3] * 3;
  //   const i2 = indices[faceIndex * 3 + 1] * 3;
  //   const i3 = indices[faceIndex * 3 + 2] * 3;

  //   const p1 = new THREE.Vector3(pos[i1], pos[i1 + 1], pos[i1 + 2]);
  //   const p2 = new THREE.Vector3(pos[i2], pos[i2 + 1], pos[i2 + 2]);
  //   const p3 = new THREE.Vector3(pos[i3], pos[i3 + 1], pos[i3 + 2]);

  //   const n1 = new THREE.Vector3(nor[i1], nor[i1 + 1], nor[i1 + 2]);
  //   const n2 = new THREE.Vector3(nor[i2], nor[i2 + 1], nor[i2 + 2]);
  //   const n3 = new THREE.Vector3(nor[i3], nor[i3 + 1], nor[i3 + 2]);

  //   const averageNx = (n1.x + n2.x + n3.x) / 3;
  //   const averageNy = (n1.y + n2.y + n3.y) / 3;
  //   const averageNz = (n1.z + n2.z + n3.z) / 3;
  //   const faceNormal = new THREE.Vector3(averageNx, averageNy, averageNz);

  //   // Apply instance transformation to vertex and normal

  //   if (instance !== undefined && mesh instanceof THREE.InstancedMesh) {
  //     const transform = new THREE.Matrix4();
  //     mesh.getMatrixAt(instance, transform);
  //     const rotation = new THREE.Matrix4();
  //     rotation.extractRotation(transform);
  //     faceNormal.applyMatrix4(rotation);
  //     p1.applyMatrix4(transform);
  //     p2.applyMatrix4(transform);
  //     p3.applyMatrix4(transform);
  //   }

  //   return { p1, p2, p3, faceNormal };
  // }

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
   * @deprecated Use {@link getItemsVolume} instead.
   *
   * Calculates the volume of a set of items.
   */
  async getVolumeFromFragments(modelIdMap: ModelIdMap) {
    console.warn(
      "getVolumeFromFragments is deprecated. Use getItemsVolume instead.",
    );
    return this.getItemsVolume(modelIdMap);
  }

  /**
   * Calculates the total volume of items for a given map of model IDs to local IDs.
   * @param modelIdMap A map where the key is the model ID and the value is an array of local IDs.
   * @returns A promise that resolves to the total volume of the specified items.
   */
  async getItemsVolume(modelIdMap: ModelIdMap) {
    let volume = 0;
    const fragments = this.components.get(FragmentsManager);
    for (const [modelId, localIds] of Object.entries(modelIdMap)) {
      const model = fragments.list.get(modelId);
      if (!model) continue;
      volume += await model.getItemsVolume([...localIds]);
    }
    return volume;
  }

  // private getFaceData(
  //   faceIndex: number,
  //   instance: number | undefined,
  //   mesh: THREE.Mesh | THREE.InstancedMesh,
  // ) {
  //   const found = this.getVerticesAndNormal(mesh, faceIndex, instance);
  //   const { p1, p2, p3, faceNormal } = found;

  //   // Round numbers to make sure numerical precision
  //   // doesn't affect edge detection

  //   this.round(p1);
  //   this.round(p2);
  //   this.round(p3);
  //   this.round(faceNormal);

  //   // To make sure the edge AB === the edge BA

  //   const vertices = [
  //     { id: `${p1.x}|${p1.y}|${p1.z}`, value: p1 },
  //     { id: `${p2.x}|${p2.y}|${p2.z}`, value: p2 },
  //     { id: `${p3.x}|${p3.y}|${p3.z}`, value: p3 },
  //   ];

  //   vertices.sort((a, b) => {
  //     if (a.id < b.id) {
  //       return -1;
  //     }
  //     if (a.id > b.id) {
  //       return 1;
  //     }
  //     return 0;
  //   });

  //   const [
  //     { id: id1, value: v1 },
  //     { id: id2, value: v2 },
  //     { id: id3, value: v3 },
  //   ] = vertices;

  //   // Create IDs to identify the edges

  //   const edges = [
  //     {
  //       id: `${id1}|${id2}`,
  //       distance: v1.distanceTo(v2),
  //       points: [v1, v2],
  //     },
  //     {
  //       id: `${id2}|${id3}`,
  //       distance: v2.distanceTo(v3),
  //       points: [v2, v3],
  //     },
  //     {
  //       id: `${id1}|${id3}`,
  //       distance: v1.distanceTo(v3),
  //       points: [v1, v3],
  //     },
  //   ];

  //   const plane = new THREE.Plane();
  //   plane.setFromNormalAndCoplanarPoint(faceNormal, p1);
  //   plane.constant = Math.round(plane.constant * 10) / 10;
  //   return { plane, edges };
  // }

  /**
   * Converts a value from one unit to another for length, area, or volume without using external libraries.
   *
   * @param value - The value to convert.
   * @param fromUnit - The unit of the input value (e.g., "m", "cm", "mm" for lengths; "m2", "cm2" for areas; "m3", "cm3" for volumes).
   * @param toUnit - The unit to convert to (e.g., "cm", "mm", "m" for lengths; "cm2", "m2" for areas; "cm3", "m3" for volumes).
   * @param precision - The number of decimal places to round the result to, as number between 0 and 5. (default is 2).
   * @throws {Error} If the rounding value is not a valid integer or is out of range (0-5).
   * @returns The converted value rounded to the specified precision.
   */
  static convertUnits(
    value: number,
    fromUnit: string,
    toUnit: string,
    precision = 2,
  ): number {
    const unitFactors: Record<string, number> = {
      // Length
      m: 1,
      cm: 0.01,
      mm: 0.001,
      km: 1000,
      // Area
      m2: 1,
      cm2: 0.0001,
      mm2: 0.000001,
      km2: 1000000,
      // Volume
      m3: 1,
      cm3: 0.000001,
      mm3: 0.000000001,
      km3: 1000000000,
    };

    if (!unitFactors[fromUnit] || !unitFactors[toUnit]) {
      throw new Error("Invalid units provided for conversion.");
    }

    if (!Number.isInteger(precision) || precision < 0 || precision > 5) {
      throw new Error("Precision must be an integer between 0 and 5.");
    }

    let factor = unitFactors[fromUnit] / unitFactors[toUnit];

    // Adjust factor for area or volume conversions
    if (fromUnit.endsWith("2") && toUnit.endsWith("2")) {
      factor **= 2;
    } else if (fromUnit.endsWith("3") && toUnit.endsWith("3")) {
      factor **= 3;
    }

    const convertedValue = value * factor;
    const roundingFactor = 10 ** precision;
    return Math.round(convertedValue * roundingFactor) / roundingFactor;
  }
}
