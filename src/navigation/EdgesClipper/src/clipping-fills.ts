import * as THREE from "three";
import { Mesh } from "three";
import earcut from "earcut";

export class ClippingFills {
  // readonly worker: Worker;

  mesh = new Mesh(new THREE.BufferGeometry());

  private _precission = 10000;
  private _tempVector = new THREE.Vector3();
  private _plane: THREE.Plane;
  private _geometry: THREE.BufferGeometry;
  private _coordinateSystem = new THREE.Matrix4();

  private _isPlaneHorizontal: boolean;

  constructor(
    plane: THREE.Plane,
    geometry: THREE.BufferGeometry,
    material: THREE.Material
  ) {
    this.mesh.material = material;

    this._plane = plane;
    const vertical = plane.normal.y;
    this._isPlaneHorizontal = vertical === 1 || vertical === -1;

    this._geometry = geometry;

    this.mesh.geometry.attributes.position = geometry.attributes.position;

    // To prevent clipping plane overlapping the filling mesh
    const offset = plane.normal.clone().multiplyScalar(0.01);
    this.mesh.position.copy(offset);
  }

  dispose() {
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

    this.updateCoordinateSystem();

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
        if (!vertices.length) continue;
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

      if (this._isPlaneHorizontal) {
        x1 = Math.trunc(globalX1 * p) / p;
        y1 = Math.trunc(globalZ1 * p) / p;
        x2 = Math.trunc(globalX2 * p) / p;
        y2 = Math.trunc(globalZ2 * p) / p;
      } else {
        this._tempVector.set(globalX1, globalY1, globalZ1);
        this._tempVector.applyMatrix4(this._coordinateSystem);
        x1 = Math.trunc(this._tempVector.x * p) / p;
        y1 = Math.trunc(this._tempVector.y * p) / p;

        this._tempVector.set(globalX2, globalY2, globalZ2);
        this._tempVector.applyMatrix4(this._coordinateSystem);
        x2 = Math.trunc(this._tempVector.x * p) / p;
        y2 = Math.trunc(this._tempVector.y * p) / p;
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
          shapes.delete(startIndex);
          openShapes.delete(startIndex);
          if (!endShape || !startShape) {
            throw new Error("Shape error!");
          }
          for (const index of startShape) {
            shapesEnds.set(index, endIndex);
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
          shapes.delete(startIndex);
          openShapes.delete(startIndex);
          if (!endShape || !startShape) {
            throw new Error("Shape error!");
          }
          for (const index of startShape) {
            shapesEnds.set(index, endIndex);
            endShape.push(index);
          }
        } else {
          openShapes.delete(endIndex);
        }
        shapesStarts.delete(end);
        shapesEnds.delete(start);
      } else if (startMatchesStart) {
        // existing contour on start - start
        const shapeIndex = shapesStarts.get(start);
        const shape = shapes.get(shapeIndex);
        if (!shape) {
          throw new Error("Shape error!");
        }
        shape.unshift(end);
        shapesStarts.delete(start);
        shapesStarts.set(end, shapeIndex);
      } else if (startMatchesEnd) {
        // existing contour on start - end
        const shapeIndex = shapesEnds.get(start);
        const shape = shapes.get(shapeIndex);
        if (!shape) {
          throw new Error("Shape error!");
        }
        shape.push(end);
        shapesEnds.delete(start);
        shapesEnds.set(end, shapeIndex);
      } else if (endMatchesStart) {
        // existing contour on end - start
        const shapeIndex = shapesStarts.get(end);
        const shape = shapes.get(shapeIndex);
        if (!shape) {
          throw new Error("Shape error!");
        }
        shape.unshift(start);
        shapesStarts.delete(end);
        shapesStarts.set(start, shapeIndex);
      } else if (endMatchesEnd) {
        // existing contour on end - end
        const shapeIndex = shapesEnds.get(end);
        const shape = shapes.get(shapeIndex);
        if (!shape) {
          throw new Error("Shape error!");
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

  private updateCoordinateSystem() {
    this._coordinateSystem = new THREE.Matrix4();
    const zAxis = this._plane.normal;

    // First, let's convert the 3d points to 2d to simplify
    // if z is up or down, we can just ignore it
    if (this._isPlaneHorizontal) {
      const pos = new THREE.Vector3();
      this._plane.coplanarPoint(pos);

      const xAxis = new THREE.Vector3(1, 0, 0);
      const yAxis = new THREE.Vector3(0, 1, 0);
      const up = new THREE.Vector3(0, 1, 0);
      xAxis.crossVectors(up, zAxis).normalize();
      yAxis.crossVectors(zAxis, xAxis);

      // prettier-ignore
      this._coordinateSystem.fromArray([
        xAxis.x, xAxis.y, xAxis.z, 0,
        yAxis.x, yAxis.y, yAxis.z, 0,
        zAxis.x, zAxis.y, zAxis.z, 0,
        pos.x, pos.y, pos.z, 1,
      ]);

      this._coordinateSystem.invert();
    }
  }
}
