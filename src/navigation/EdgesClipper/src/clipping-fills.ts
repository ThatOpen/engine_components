import * as THREE from "three";
import earcut from "earcut";
import { Components } from "../../../core";
import { PostproductionRenderer } from "../../PostproductionRenderer";

export class ClippingFills {
  // readonly worker: Worker;

  mesh = new THREE.Mesh(new THREE.BufferGeometry());

  styleName?: string;

  private _components: Components;
  private _precission = 10000;
  private _tempVector = new THREE.Vector3();
  private _plane: THREE.Plane;
  private _geometry: THREE.BufferGeometry;

  // Used to work in the 2D coordinate system of the plane
  private _plane2DCoordinateSystem = new THREE.Matrix4();

  // Used if the plane is orthogonal to the cartesian planes
  private _planeAxis?: "x" | "y" | "z";

  get visible() {
    return this.mesh.parent !== null;
  }

  set visible(value: boolean) {
    const style = this.getStyle();
    if (value) {
      const scene = this._components.scene.get();
      scene.add(this.mesh);
      if (style) {
        style.meshes.add(this.mesh);
      }
    } else {
      this.mesh.removeFromParent();
      if (style) {
        style.meshes.delete(this.mesh);
      }
    }
  }

  set geometry(geometry: THREE.BufferGeometry) {
    this._geometry = geometry;
    this.mesh.geometry.attributes.position = geometry.attributes.position;
  }

  constructor(
    components: Components,
    plane: THREE.Plane,
    geometry: THREE.BufferGeometry,
    material: THREE.Material
  ) {
    this._components = components;
    this.mesh.material = material;
    this.mesh.frustumCulled = false;

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
    this.mesh.position.copy(offset);

    this.visible = true;
  }

  dispose() {
    const style = this.getStyle();
    if (style) {
      style.meshes.delete(this.mesh);
    }
    this.mesh.geometry.dispose();
    this.mesh.removeFromParent();
    (this.mesh.geometry as any) = null;
    (this.mesh as any) = null;
    (this._plane as any) = null;
    (this._geometry as any) = null;
  }

  update(elements: number[], blockByIndex: { [index: number]: number }) {
    const buffer = this._geometry.attributes.position.array as Float32Array;
    if (!buffer) return;

    this.updatePlane2DCoordinateSystem();

    const allIndices: number[] = [];
    let start = 0;
    for (let i = 0; i < elements.length; i++) {
      const end = elements[i];

      const verticesByBlock: { [block: number]: number[] } = {};

      for (let j = start; j < end; j += 2) {
        let block = blockByIndex[j];
        if (block === undefined) {
          block = -1;
        }
        if (!verticesByBlock[block]) {
          verticesByBlock[block] = [];
        }
        verticesByBlock[block].push(j * 3);
      }

      for (const block in verticesByBlock) {
        const vertices = verticesByBlock[block];
        if (!vertices.length) {
          continue;
        }
        const indices = this.computeFill(vertices, buffer);
        for (const index of indices) {
          allIndices.push(index);
        }
      }

      start = end;
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

  private getStyle() {
    const renderer = this._components.renderer as PostproductionRenderer;
    if (this.styleName && renderer instanceof PostproductionRenderer) {
      const effects = renderer.postproduction.customEffects;
      return effects.outlinedMeshes[this.styleName];
    }
    return null;
  }
}
