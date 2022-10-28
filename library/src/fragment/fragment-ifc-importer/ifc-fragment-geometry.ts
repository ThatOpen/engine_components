import * as WEBIFC from "web-ifc";
import * as THREE from "three";

export class IfcFragmentGeometry {
  streamMesh(mesh: WEBIFC.FlatMesh) {
    const placedGeometries = mesh.geometries;
    const size = placedGeometries.size();

    let geometryID = "";
    let referenceMatrix = new THREE.Matrix4();
    let isFirstMatrix = true;

    const geoms: {
      [color: string]: THREE.BufferGeometry[];
    } = {};

    // Find the ID of this geometry. The ID is a concatenation of all the IDs
    // of the individual geometries that compose this object
    for (let i = 0; i < size; i++) {
      const placedGeometry = placedGeometries.get(i);
      geometryID += placedGeometry.geometryExpressID;
    }

    // If it's the first time that we find this geometry
    if (!this.items[geometryID]) {
      // Get all buffergeometries
      for (let i = 0; i < size; i++) {
        const placedGeometry = placedGeometries.get(i);
        const geom = this.getBufferGeometry(modelID, placedGeometry);
        if (!geom) {
          return;
        }

        const matrix = this.getMeshMatrix(placedGeometry.flatTransformation);

        // We apply the tranformation only to the first geometry, and then
        // apply the inverse to the rest of the instances
        geom.applyMatrix4(matrix);

        // We store this matrix to use it as a reference point. We'll apply this
        // later to the rest of the instances
        if (isFirstMatrix) {
          const inverse = new Matrix4().copy(matrix).invert();
          referenceMatrix = inverse;
          isFirstMatrix = false;
        }

        // Save this geometry by material
        const color = placedGeometry.color;
        const colorID = `${color.x}${color.y}${color.z}${color.w}`;

        // Share materials across the model
        if (!this.materials[colorID]) {
          this.materials[colorID] = new MeshLambertMaterial({
            color: new Color(color.x, color.y, color.z),
            transparent: color.w !== 1,
            opacity: color.w,
          });
        }

        if (!geoms[colorID]) {
          geoms[colorID] = [geom];
        } else {
          geoms[colorID].push(geom);
        }
      }

      this.items[geometryID] = {
        instances: [
          {
            id: mesh.expressID,
            matrix: new Matrix4(),
          },
        ],
        geometriesByMaterial: geoms,
        referenceMatrix,
      };

      // If it's not the first time we find this geometry, just find out its
      // transformation relative to the first item that was found
    } else {
      const referenceMatrix = this.items[geometryID].referenceMatrix;
      const placedGeometry = placedGeometries.get(0);
      const transform = this.getMeshMatrix(placedGeometry.flatTransformation);
      transform.multiply(referenceMatrix);

      this.items[geometryID].instances.push({
        id: mesh.expressID,
        matrix: transform,
      });
    }
  }

  private getBufferGeometry(modelID: number, placedGeometry: PlacedGeometry) {
    const geometry = this.state.api.GetGeometry(
      modelID,
      placedGeometry.geometryExpressID
    ) as IfcGeometry;
    const verts = this.state.api.GetVertexArray(
      geometry.GetVertexData(),
      geometry.GetVertexDataSize()
    ) as Float32Array;
    if (!verts.length) return null;
    const indices = this.state.api.GetIndexArray(
      geometry.GetIndexData(),
      geometry.GetIndexDataSize()
    ) as Uint32Array;
    if (!indices.length) return null;
    const buffer = this.ifcGeometryToBuffer(verts, indices);
    // @ts-ignore
    geometry.delete();
    return buffer;
  }

  private getMeshMatrix(matrix: Array<number>) {
    const mat = new Matrix4();
    mat.fromArray(matrix);
    return mat;
  }

  private ifcGeometryToBuffer(
    vertexData: Float32Array,
    indexData: Uint32Array
  ) {
    const geometry = new BufferGeometry();

    const posFloats = new Float32Array(vertexData.length / 2);
    const normFloats = new Float32Array(vertexData.length / 2);
    // const idAttribute = new Uint32Array(vertexData.length / 6);

    for (let i = 0; i < vertexData.length; i += 6) {
      posFloats[i / 2] = vertexData[i];
      posFloats[i / 2 + 1] = vertexData[i + 1];
      posFloats[i / 2 + 2] = vertexData[i + 2];

      normFloats[i / 2] = vertexData[i + 3];
      normFloats[i / 2 + 1] = vertexData[i + 4];
      normFloats[i / 2 + 2] = vertexData[i + 5];

      // idAttribute[i / 6] = expressID;
    }

    geometry.setAttribute("position", new BufferAttribute(posFloats, 3));
    geometry.setAttribute("normal", new BufferAttribute(normFloats, 3));

    geometry.setIndex(new BufferAttribute(indexData, 1));
    return geometry;
  }
}
