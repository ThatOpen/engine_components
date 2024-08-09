import * as THREE from "three";
import * as OBC from "@thatopen/components";
import earcut from "earcut";
import { PostproductionRenderer } from "../../PostproductionRenderer";
import { IndexFragmentMap } from "./types";

/**
 * Class for managing and rendering the fills of a clipping plane.
 */
export class ClippingFills {
  /**
   * The THREE.js mesh representing the fills.
   */
  mesh = new THREE.Mesh(new THREE.BufferGeometry());

  /**
   * The components instance associated with the clipping fills.
   */
  components: OBC.Components;

  /**
   * The world in which the clipping plane and fills exist.
   */
  world: OBC.World;

  /**
   * The name of the style associated with this clipping fills.
   */
  styleName?: string;

  private _precission = 10000;
  private _tempVector = new THREE.Vector3();
  private _plane: THREE.Plane;
  private _geometry: THREE.BufferGeometry;
  private _outlinedMesh: THREE.Mesh;

  // Used to work in the 2D coordinate system of the plane
  private _plane2DCoordinateSystem = new THREE.Matrix4();

  // Used if the plane is orthogonal to the cartesian planes
  private _planeAxis?: "x" | "y" | "z";

  /**
   * Gets the visibility of the clipping fills mesh.
   * @returns {boolean} Returns true if the mesh is visible, false otherwise.
   */
  get visible() {
    return this.mesh.parent !== null;
  }

  /**
   * Sets the visibility of the clipping fills mesh.
   * @param {boolean} value - The new visibility state. If true, the mesh will be added to the scene and the style's meshes set. If false, the mesh will be removed from the scene and the style's meshes set.
   */
  set visible(value: boolean) {
    const styleAndScene = this.getStyleAndScene();
    if (value) {
      const scene = this.world.scene.three;
      scene.add(this.mesh);
      if (styleAndScene) {
        const { style, outlineScene } = styleAndScene;
        this._outlinedMesh.material = style.material;
        style.meshes.add(this._outlinedMesh);
        outlineScene.add(this._outlinedMesh);
      }
    } else {
      this.mesh.removeFromParent();
      if (styleAndScene) {
        const { style } = styleAndScene;
        style.meshes.delete(this._outlinedMesh);
        this._outlinedMesh.removeFromParent();
      }
    }
  }

  /**
   * Sets the geometry of the clipping fills mesh.
   * @param {THREE.BufferGeometry} geometry - The new geometry for the mesh. The position attribute of the geometry will be assigned to the mesh's geometry.
   */
  set geometry(geometry: THREE.BufferGeometry) {
    this._geometry = geometry;
    this.mesh.geometry.attributes.position = geometry.attributes.position;
  }

  constructor(
    components: OBC.Components,
    world: OBC.World,
    plane: THREE.Plane,
    geometry: THREE.BufferGeometry,
    material: THREE.Material,
  ) {
    this.components = components;
    this.world = world;
    this.mesh.material = material;
    this.mesh.frustumCulled = false;

    // TODO: Add this to the mesh definition instead of using userData?
    this.mesh.userData.indexFragmentMap = new Map() as IndexFragmentMap;

    this._plane = plane;

    const { x, y, z } = plane.normal;
    if (Math.abs(x) === 1) {
      this._planeAxis = "x";
    } else if (Math.abs(y) === 1) {
      this._planeAxis = "y";
    } else if (Math.abs(z) === 1) {
      this._planeAxis = "z";
    }

    this._geometry = geometry;
    this.mesh.geometry.attributes.position = geometry.attributes.position;

    // To prevent clipping plane overlapping the filling mesh
    const offset = plane.normal.clone().multiplyScalar(0.01);
    this._outlinedMesh = new THREE.Mesh(this.mesh.geometry);

    this.mesh.position.copy(offset);
    this._outlinedMesh.position.copy(offset);

    this.visible = true;
  }

  /**
   * Disposes of the clipping fills mesh and its associated resources.
   * This method should be called when the clipping fills are no longer needed to free up memory.
   */
  dispose() {
    const styleAndScene = this.getStyleAndScene();
    if (styleAndScene) {
      const { style } = styleAndScene;
      style.meshes.delete(this._outlinedMesh);
      this._outlinedMesh.removeFromParent();
    }
    this.mesh.material = [];
    this._outlinedMesh.material = [];
    this.mesh.userData.indexFragmentMap.clear();
    this.mesh.userData = {};
    this.mesh.geometry.dispose();
    this.mesh.removeFromParent();
    (this.mesh.geometry as any) = null;
    (this._outlinedMesh.geometry as any) = null;
    (this.mesh as any) = null;
    (this._plane as any) = null;
    (this._geometry as any) = null;
    (this.components as any) = null;
  }

  /**
   * Updates the clipping fills mesh with new indices.
   *
   * @param trianglesIndices - An array of indices representing triangles in the geometry.
   * @param indexFragMap - A map that allows to trace back the original fragment and id from each triangle of the fill mesh.
   *
   */
  update(trianglesIndices: number[], indexFragMap: IndexFragmentMap) {
    const buffer = this._geometry.attributes.position.array as Float32Array;
    if (!buffer) return;

    this.updatePlane2DCoordinateSystem();

    const { userData } = this.mesh;
    const currentFragMap = userData.indexFragmentMap as IndexFragmentMap;
    currentFragMap.clear();
    let faceIndex = 0;

    const allIndices: number[] = [];
    let currentTriangle = 0;

    // TODO: Add fills to the FragmentMesh definition instead of userData?
    // Add a reference to this fill to the frag mesh, to be able to trace all
    // fills from a given fragment mesh (e.g. for highlighting)
    const fragments = this.components.get(OBC.FragmentsManager);
    for (const [_index, fragmentIdMap] of indexFragMap) {
      for (const fragID in fragmentIdMap) {
        const frag = fragments.list.get(fragID);
        if (!frag) continue;
        if (!frag.mesh.userData.fills) {
          frag.mesh.userData.fills = new Set();
        }
        frag.mesh.userData.fills.add(this.mesh);
      }
    }

    for (let i = 0; i < trianglesIndices.length; i++) {
      const nextTriangle = trianglesIndices[i];

      const vertices: number[] = [];

      for (let j = currentTriangle; j < nextTriangle; j += 2) {
        vertices.push(j * 3);
      }

      const indices = this.computeFill(vertices, buffer);

      const fragments = indexFragMap.get(nextTriangle);
      let indexCounter = 0;

      for (const index of indices) {
        allIndices.push(index);
        // Save the reference faceIndex->fragmentIdMap, so that when raycasting
        // the fill we can now to which element it belongs (e.g. for highlighting)
        if (fragments && indexCounter % 3 === 0) {
          currentFragMap.set(faceIndex++, fragments);
        }
        indexCounter++;
      }

      currentTriangle = nextTriangle;
    }
    this.mesh.geometry.setIndex(allIndices);
  }

  private computeFill(vertices: number[], buffer: Float32Array) {
    const indices = new Map();
    const all2DVertices: { [index: number]: [number, number] } = {};
    const shapes = new Map<number, number[]>();
    let nextShapeID = 0;
    const shapesEnds = new Map();
    const shapesStarts = new Map();
    const openShapes = new Set();

    const p = this._precission;

    for (let i = 0; i < vertices.length; i++) {
      // Convert vertices to indices

      const startVertexIndex = vertices[i];

      let x1 = 0;
      let y1 = 0;
      let x2 = 0;
      let y2 = 0;

      const globalX1 = buffer[startVertexIndex];
      const globalY1 = buffer[startVertexIndex + 1];
      const globalZ1 = buffer[startVertexIndex + 2];
      const globalX2 = buffer[startVertexIndex + 3];
      const globalY2 = buffer[startVertexIndex + 4];
      const globalZ2 = buffer[startVertexIndex + 5];

      this._tempVector.set(globalX1, globalY1, globalZ1);
      this._tempVector.applyMatrix4(this._plane2DCoordinateSystem);
      x1 = Math.trunc(this._tempVector.x * p) / p;
      y1 = Math.trunc(this._tempVector.y * p) / p;

      this._tempVector.set(globalX2, globalY2, globalZ2);
      this._tempVector.applyMatrix4(this._plane2DCoordinateSystem);
      x2 = Math.trunc(this._tempVector.x * p) / p;
      y2 = Math.trunc(this._tempVector.y * p) / p;

      if (x1 === x2 && y1 === y2) {
        continue;
      }

      const startCode = `${x1}|${y1}`;
      const endCode = `${x2}|${y2}`;

      if (!indices.has(startCode)) {
        indices.set(startCode, startVertexIndex / 3);
      }
      if (!indices.has(endCode)) {
        indices.set(endCode, startVertexIndex / 3 + 1);
      }

      const start = indices.get(startCode);
      const end = indices.get(endCode);

      all2DVertices[start] = [x1, y1];
      all2DVertices[end] = [x2, y2];

      const startMatchesStart = shapesStarts.has(start);
      const startMatchesEnd = shapesEnds.has(start);
      const endMatchesStart = shapesStarts.has(end);
      const endMatchesEnd = shapesEnds.has(end);

      const noMatches =
        !startMatchesStart &&
        !startMatchesEnd &&
        !endMatchesStart &&
        !endMatchesEnd;

      if (noMatches) {
        // New shape
        shapesStarts.set(start, nextShapeID);
        shapesEnds.set(end, nextShapeID);
        openShapes.add(nextShapeID);
        shapes.set(nextShapeID, [start, end]);
        nextShapeID++;
      } else if (startMatchesStart && endMatchesEnd) {
        // Close shape or merge 2 shapes
        const startIndex = shapesStarts.get(start);
        const endIndex = shapesEnds.get(end);
        const isShapeMerge = startIndex !== endIndex;
        if (isShapeMerge) {
          // merge start to end
          const endShape = shapes.get(endIndex);
          const startShape = shapes.get(startIndex);
          if (!endShape || !startShape) {
            continue;
          }

          shapes.delete(startIndex);
          openShapes.delete(startIndex);

          shapesEnds.set(startShape[startShape.length - 1], endIndex);
          shapesEnds.delete(endShape[endShape.length - 1]);

          for (const index of startShape) {
            endShape.push(index);
          }
        } else {
          openShapes.delete(endIndex);
        }
        shapesStarts.delete(start);
        shapesEnds.delete(end);
      } else if (startMatchesEnd && endMatchesStart) {
        // Close shape or merge 2 shapes
        const startIndex = shapesStarts.get(end);
        const endIndex = shapesEnds.get(start);
        const isShapeMerge = startIndex !== endIndex;
        if (isShapeMerge) {
          // merge start to end
          const endShape = shapes.get(endIndex);
          const startShape = shapes.get(startIndex);
          if (!endShape || !startShape) {
            continue;
          }

          shapes.delete(startIndex);
          openShapes.delete(startIndex);

          shapesEnds.set(startShape[startShape.length - 1], endIndex);
          shapesEnds.delete(endShape[endShape.length - 1]);

          for (const index of startShape) {
            endShape.push(index);
          }
        } else {
          openShapes.delete(endIndex);
        }
        shapesStarts.delete(end);
        shapesEnds.delete(start);
      } else if (startMatchesStart && endMatchesStart) {
        // Merge 2 shapes, mirroring one of them
        const startIndex1 = shapesStarts.get(end);
        const startIndex2 = shapesStarts.get(start);
        // merge start to end
        const startShape2 = shapes.get(startIndex2);
        const startShape1 = shapes.get(startIndex1);
        if (!startShape2 || !startShape1) {
          continue;
        }

        shapes.delete(startIndex1);
        openShapes.delete(startIndex1);

        shapesStarts.delete(startShape2[0]);
        shapesStarts.delete(startShape1[0]);
        shapesEnds.delete(startShape1[startShape1.length - 1]);
        shapesStarts.set(startShape1[startShape1.length - 1], startIndex2);

        startShape1.reverse();
        startShape2.splice(0, 0, ...startShape1);
      } else if (startMatchesEnd && endMatchesEnd) {
        // Merge 2 shapes, mirroring one of them
        const endIndex1 = shapesEnds.get(end);
        const endIndex2 = shapesEnds.get(start);
        // merge start to end
        const endShape2 = shapes.get(endIndex2);
        const endShape1 = shapes.get(endIndex1);
        if (!endShape2 || !endShape1) {
          continue;
        }

        shapes.delete(endIndex1);
        openShapes.delete(endIndex1);

        shapesEnds.delete(endShape2[endShape2.length - 1]);
        shapesEnds.delete(endShape1[endShape1.length - 1]);
        shapesStarts.delete(endShape1[0]);
        shapesEnds.set(endShape1[0], endIndex2);

        endShape1.reverse();
        endShape2.push(...endShape1);
      } else if (startMatchesStart) {
        // existing contour on start - start
        const shapeIndex = shapesStarts.get(start);
        const shape = shapes.get(shapeIndex);
        if (!shape) {
          continue;
        }
        shape.unshift(end);
        shapesStarts.delete(start);
        shapesStarts.set(end, shapeIndex);
      } else if (startMatchesEnd) {
        // existing contour on start - end
        const shapeIndex = shapesEnds.get(start);
        const shape = shapes.get(shapeIndex);
        if (!shape) {
          continue;
        }
        shape.push(end);
        shapesEnds.delete(start);
        shapesEnds.set(end, shapeIndex);
      } else if (endMatchesStart) {
        // existing contour on end - start
        const shapeIndex = shapesStarts.get(end);
        const shape = shapes.get(shapeIndex);
        if (!shape) {
          continue;
        }
        shape.unshift(start);
        shapesStarts.delete(end);
        shapesStarts.set(start, shapeIndex);
      } else if (endMatchesEnd) {
        // existing contour on end - end
        const shapeIndex = shapesEnds.get(end);
        const shape = shapes.get(shapeIndex);
        if (!shape) {
          continue;
        }
        shape.push(start);
        shapesEnds.delete(end);
        shapesEnds.set(start, shapeIndex);
      }
    }

    const trueIndices: number[] = [];

    for (const [id, shape] of shapes) {
      if (openShapes.has(id)) {
        continue;
      }

      const vertices: number[] = [];
      const indexMap = new Map();
      let counter = 0;
      for (const index of shape) {
        const vertex = all2DVertices[index];
        vertices.push(vertex[0], vertex[1]);
        indexMap.set(counter++, index);
      }

      const result = earcut(vertices);
      for (const index of result) {
        const trueIndex = indexMap.get(index);
        if (trueIndex === undefined) {
          throw new Error("Map error!");
        }
        trueIndices.push(trueIndex);
      }
    }

    return trueIndices;
  }

  private updatePlane2DCoordinateSystem() {
    // Assuming the normal of the plane is called Z

    this._plane2DCoordinateSystem = new THREE.Matrix4();

    const xAxis = new THREE.Vector3(1, 0, 0);
    const yAxis = new THREE.Vector3(0, 1, 0);
    const zAxis = this._plane.normal;

    const pos = new THREE.Vector3();
    this._plane.coplanarPoint(pos);

    if (this._planeAxis === "x") {
      xAxis.crossVectors(yAxis, zAxis);
    } else if (this._planeAxis === "y") {
      yAxis.crossVectors(zAxis, xAxis);
    } else if (this._planeAxis === "z") {
      // Axes XYZ stay the same
    } else {
      // Non-orthogonal to cardinal axis
      xAxis.crossVectors(yAxis, zAxis).normalize();
      yAxis.crossVectors(zAxis, xAxis);
    }

    // prettier-ignore
    this._plane2DCoordinateSystem.fromArray([
      xAxis.x, xAxis.y, xAxis.z, 0,
      yAxis.x, yAxis.y, yAxis.z, 0,
      zAxis.x, zAxis.y, zAxis.z, 0,
      pos.x, pos.y, pos.z, 1,
    ]);

    this._plane2DCoordinateSystem.invert();
  }

  private getStyleAndScene() {
    if (!this.world.renderer) return null;
    const postProduction =
      this.world.renderer instanceof PostproductionRenderer;
    if (this.styleName && postProduction) {
      const renderer = this.world.renderer as PostproductionRenderer;
      const effects = renderer.postproduction.customEffects;
      const style = effects.outlinedMeshes[this.styleName];
      const outlineScene = renderer.postproduction.customEffects.outlineScene;
      return { style, outlineScene };
    }
    return null;
  }
}
