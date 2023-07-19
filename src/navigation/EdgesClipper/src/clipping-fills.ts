import * as THREE from "three";
import { Mesh } from "three";
import earcut from "earcut";
import { Components } from "../../../core";

export class ClippingFills {
  // readonly worker: Worker;

  mesh = new Mesh(
    new THREE.BufferGeometry(),
    new THREE.MeshBasicMaterial({
      color: "white",
      side: 2,
    })
  );

  private _components: Components;

  constructor(components: Components) {
    this._components = components;
    this._components.scene.get().add(this.mesh);

    this.mesh.position.y -= 0.01;
    // const code = `
    //   addEventListener("message", (event) => {
    //     const { buffer } = event.data;
    //     const vertices = new Map();
    //     for (let i = 0; i < buffer.length; i += 3) {
    //         const x = buffer[i];
    //         const y = buffer[i + 1];
    //         const code = \`\${x}-\${y}\`;
    //         if()
    //         const code = "" + r + "-" + g + "-" + b;
    //         colors.add(code);
    //     }
    //     postMessage({ colors });
    //   });
    // `;
    // const blob = new Blob([code], { type: "application/javascript" });
    // this.worker = new Worker(URL.createObjectURL(blob));
    // this.worker.addEventListener("message", this.handleWorkerMessage);
  }

  test(geometry: THREE.BufferGeometry, plane: THREE.Plane) {
    // temp
    this.mesh.geometry.attributes.position = geometry.attributes.position;

    const range = geometry.drawRange.count;
    const buffer = geometry.attributes.position.array as Float32Array;
    if (!buffer) return;

    const zAxis = plane.normal;

    const localCoordSystem = new THREE.Matrix4();

    // First, let's convert the 3d points to 2d to simplify
    // if z is up or down, we can just ignore it
    const isPlaneHorizontal = zAxis.y === 1 || zAxis.y === -1;
    if (isPlaneHorizontal) {
      const pos = new THREE.Vector3();
      plane.coplanarPoint(pos);

      const xAxis = new THREE.Vector3(1, 0, 0);
      const yAxis = new THREE.Vector3(0, 1, 0);
      const up = new THREE.Vector3(0, 1, 0);
      xAxis.crossVectors(up, zAxis).normalize();
      yAxis.crossVectors(zAxis, xAxis);

      // prettier-ignore
      localCoordSystem.fromArray([
        xAxis.x, xAxis.y, xAxis.z, 0,
        yAxis.x, yAxis.y, yAxis.z, 0,
        zAxis.x, zAxis.y, zAxis.z, 0,
        pos.x, pos.y, pos.z, 1
      ]);

      localCoordSystem.invert();
    }

    // -0.7851659380703032
    // 0.6351651018463915
    // -3.181819948588538

    const indices = new Map();
    const all2DVertices: { [index: number]: [number, number] } = {};
    const shapes = new Map<number, number[]>();
    let nextShapeID = 0;
    const shapesEnds = new Map();
    const shapesStarts = new Map();

    const tempVector = new THREE.Vector3();

    // precision
    const p = 1000;

    for (let i = 0; i < range * 3; i += 6) {
      // Convert vertices to indices

      let x1 = 0;
      let y1 = 0;
      let x2 = 0;
      let y2 = 0;

      const globalX1 = buffer[i];
      const globalY1 = buffer[i + 1];
      const globalZ1 = buffer[i + 2];
      const globalX2 = buffer[i + 3];
      const globalY2 = buffer[i + 4];
      const globalZ2 = buffer[i + 5];

      if (isPlaneHorizontal) {
        x1 = Math.trunc(globalX1 * p) / p;
        y1 = Math.trunc(globalZ1 * p) / p;
        x2 = Math.trunc(globalX2 * p) / p;
        y2 = Math.trunc(globalZ2 * p) / p;
      } else {
        tempVector.set(globalX1, globalY1, globalZ1);
        tempVector.applyMatrix4(localCoordSystem);
        x1 = Math.trunc(tempVector.x * p) / p;
        y1 = Math.trunc(tempVector.y * p) / p;

        tempVector.set(globalX2, globalY2, globalZ2);
        tempVector.applyMatrix4(localCoordSystem);
        x2 = Math.trunc(tempVector.x * p) / p;
        y2 = Math.trunc(tempVector.y * p) / p;
      }

      const startCode = `${x1}-${y1}`;
      const endCode = `${x2}-${y2}`;

      if (!indices.has(startCode)) indices.set(startCode, i / 3);
      if (!indices.has(endCode)) indices.set(endCode, i / 3 + 1);

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
          if (!endShape || !startShape) throw new Error("Shape error!");
          for (const index of startShape) {
            shapesEnds.set(index, endIndex);
            endShape.push(index);
          }
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
          if (!endShape || !startShape) throw new Error("Shape error!");
          for (const index of startShape) {
            shapesEnds.set(index, endIndex);
            endShape.push(index);
          }
        }
        shapesStarts.delete(end);
        shapesEnds.delete(start);
      } else if (startMatchesStart) {
        // existing contour on start - start
        const shapeIndex = shapesStarts.get(start);
        const shape = shapes.get(shapeIndex);
        if (!shape) throw new Error("Shape error!");
        shape.unshift(end);
        shapesStarts.delete(start);
        shapesStarts.set(end, shapeIndex);
      } else if (startMatchesEnd) {
        // existing contour on start - end
        const shapeIndex = shapesEnds.get(start);
        const shape = shapes.get(shapeIndex);
        if (!shape) throw new Error("Shape error!");
        shape.push(end);
        shapesEnds.delete(start);
        shapesEnds.set(end, shapeIndex);
      } else if (endMatchesStart) {
        // existing contour on end - start
        const shapeIndex = shapesStarts.get(end);
        const shape = shapes.get(shapeIndex);
        if (!shape) throw new Error("Shape error!");
        shape.unshift(start);
        shapesStarts.delete(end);
        shapesStarts.set(start, shapeIndex);
      } else if (endMatchesEnd) {
        // existing contour on end - end
        const shapeIndex = shapesEnds.get(end);
        const shape = shapes.get(shapeIndex);
        if (!shape) throw new Error("Shape error!");
        shape.push(start);
        shapesEnds.delete(end);
        shapesEnds.set(start, shapeIndex);
      }
    }

    if (shapes.size === 0) return;
    // first shape only
    const shapeIndices = shapes.get(1);
    if (!shapeIndices) throw new Error("ShapeIndices not found!");
    const vertices: number[] = [];
    const indexMap = new Map();
    let counter = 0;
    for (const index of shapeIndices) {
      const vertex = all2DVertices[index];
      vertices.push(vertex[0], vertex[1]);
      indexMap.set(counter++, index);
    }

    const result = earcut(vertices);
    if (result.length) {
      const mapped = result.map((index: number) => {
        const result = indexMap.get(index);
        if (result === undefined) throw new Error("Map error!");
        return result;
      });
      this.mesh.geometry.setIndex(mapped);
    }
  }
}
