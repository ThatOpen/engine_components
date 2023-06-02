import * as THREE from "three";

// Temporal id generator until the IFC id algorithm is implemented.
export function tooeenRandomId() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let id = "";

  for (let i = 0; i < 10; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    id += characters.charAt(randomIndex);
  }

  return id;
}

export function bufferGeometryToIndexed(geometry: THREE.BufferGeometry) {
  const bufferAttribute = geometry.getAttribute("position");
  const size = bufferAttribute.itemSize;
  const positions = bufferAttribute.array;
  const indices = [];
  const vertices = [];
  const outVertices: number[] = [];

  for (let i = 0; i < positions.length; i += size) {
    const x = positions[i];
    const y = positions[i + 1];
    let vertex = `${x},${y}`;
    const z = positions[i + 2];
    if (size >= 3) {
      vertex += `,${z}`;
    } else {
      vertex += `,0`;
    }
    const w = positions[i + 3];
    if (size === 4) {
      vertex += `,${w}`;
    }

    if (vertices.indexOf(vertex) === -1) {
      vertices.push(vertex);
      indices.push(vertices.length - 1);
      const split = vertex.split(",");
      split.forEach((component) => outVertices.push(Number(component)));
    } else {
      const index = vertices.indexOf(vertex);
      indices.push(index);
    }
  }

  const outIndices = new Uint16Array(indices);
  const realVertices = new Float32Array(outVertices);

  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(realVertices, size === 2 ? 3 : size)
  );
  geometry.setIndex(new THREE.BufferAttribute(outIndices, 1));
  geometry.getAttribute("position").needsUpdate = true;
}
