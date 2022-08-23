import {
  BufferAttribute,
  BufferGeometry,
  DynamicDrawUsage,
  InstancedMesh,
  Line3,
  LineSegments,
  Matrix4,
  Mesh,
  Plane,
  Vector3,
} from "three";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial";
import { LineSegmentsGeometry } from "three/examples/jsm/lines/LineSegmentsGeometry";
import { LineSegments2 } from "three/examples/jsm/lines/LineSegments2";
import { Components } from "../../components";
import { EdgesItems, StyleList } from "./types";

// Static elements are for defining the clipping edges styles without having to create a clipping plane first

export class ClippingEdges {
  edges: EdgesItems = {};

  static readonly styles: StyleList = {};
  // static forceStyleUpdate = false;

  private static components: Components;

  private static basicEdges = new LineSegments();
  private static defaultMaterial = new LineMaterial({
    color: 0x000000,
    linewidth: 0.001,
  });

  private isVisible = true;

  // Helpers
  private inverseMatrix = new Matrix4();
  private localPlane = new Plane();
  private tempLine = new Line3();
  private tempVector = new Vector3();

  constructor(private plane: Plane) {}

  get visible() {
    return this.isVisible;
  }

  set visible(visible: boolean) {
    this.isVisible = visible;

    for (const edgeName in this.edges) {
      this.updateEdgesVisibility(edgeName, visible);
    }

    if (visible) {
      this.updateEdges();
    }
  }

  dispose() {
    Object.values(this.edges).forEach((edge) => {
      if (edge.generatorGeometry.boundsTree)
        edge.generatorGeometry.disposeBoundsTree();
      edge.generatorGeometry.dispose();
      if (edge.mesh.geometry.boundsTree) edge.mesh.geometry.disposeBoundsTree();
      edge.mesh.geometry.dispose();
      edge.mesh.removeFromParent();
      (edge.mesh as any) = null;
    });

    (this.edges as any) = null;
    (this.plane as any) = null;
  }

  disposeStylesAndHelpers() {
    if (ClippingEdges.basicEdges) {
      ClippingEdges.basicEdges.removeFromParent();
      ClippingEdges.basicEdges.geometry.dispose();
      (ClippingEdges.basicEdges as any) = null;
      ClippingEdges.basicEdges = new LineSegments();
    }

    (ClippingEdges.components as any) = null;

    if (!ClippingEdges.styles) return;
    const styles = Object.values(ClippingEdges.styles);

    styles.forEach((style) => {
      style.ids.length = 0;
      style.meshes.forEach((mesh) => {
        mesh.removeFromParent();
        mesh.geometry.dispose();
        if (mesh.geometry.boundsTree) mesh.geometry.disposeBoundsTree();
        if (Array.isArray(mesh.material))
          mesh.material.forEach((mat) => mat.dispose());
        else mesh.material.dispose();
      });
      style.meshes.length = 0;
      style.categories.length = 0;
      style.material.dispose();
    });

    (ClippingEdges.styles as any) = null;
    (ClippingEdges.styles as any) = {};
  }

  async updateEdges() {
    for (const styleName in ClippingEdges.styles) {
      try {
        // this can trow error if there is an empty mesh, we still want to update other edges so we catch ere
        this.drawEdges(styleName);
      } catch (e: unknown) {
        console.error("error in drawing edges", e);
      }
    }
  }

  static initialize(components: Components) {
    if (!ClippingEdges.components) {
      ClippingEdges.components = components;
    }
  }

  // Creates a new style that applies to all clipping edges for generic models
  static async newStyleFromMesh(
    styleName: string,
    meshes: Mesh[],
    material = ClippingEdges.defaultMaterial
  ) {
    const ids = meshes.map((mesh) => mesh.uuid);

    meshes.forEach((mesh) => {
      if (!mesh.geometry.boundsTree) mesh.geometry.computeBoundsTree();
    });

    material.clippingPlanes = ClippingEdges.components.clippingPlanes;
    ClippingEdges.styles[styleName] = {
      ids,
      categories: [],
      material,
      meshes,
    };
  }

  // Initializes the helper geometry used to compute the vertices
  private static newGeneratorGeometry() {
    // create line geometry with enough data to hold 100000 segments
    const generatorGeometry = new BufferGeometry();
    const linePosAttr = new BufferAttribute(new Float32Array(300000), 3, false);
    linePosAttr.setUsage(DynamicDrawUsage);
    generatorGeometry.setAttribute("position", linePosAttr);
    return generatorGeometry;
  }

  // Creates the geometry of the clipping edges
  private newThickEdges(styleName: string) {
    const material = ClippingEdges.styles[styleName].material;
    const thickLineGeometry = new LineSegmentsGeometry();
    const thickEdges = new LineSegments2(thickLineGeometry, material);
    thickEdges.material.polygonOffset = true;
    thickEdges.material.polygonOffsetFactor = -2;
    thickEdges.material.polygonOffsetUnits = 1;
    thickEdges.renderOrder = 3;
    return thickEdges;
  }

  // Source: https://gkjohnson.github.io/three-mesh-bvh/example/bundle/clippedEdges.html
  private drawEdges(styleName: string) {
    const style = ClippingEdges.styles[styleName];

    // if (!style.subsets.geometry.boundsTree) return;

    if (!this.edges[styleName]) {
      this.edges[styleName] = {
        generatorGeometry: ClippingEdges.newGeneratorGeometry(),
        mesh: this.newThickEdges(styleName),
      };
    }

    const edges = this.edges[styleName];

    let index = 0;
    const posAttr = edges.generatorGeometry.attributes.position;
    // @ts-ignore
    posAttr.array.fill(0);

    const notEmptyMeshes = style.meshes.filter((subset) => subset.geometry);
    notEmptyMeshes.forEach((mesh) => {
      if (!mesh.geometry.boundsTree) {
        throw new Error("Boundstree not found for clipping edges subset.");
      }

      const instanced = mesh as InstancedMesh;
      if (instanced.count > 1) {
        for (let i = 0; i < instanced.count; i++) {
          const tempMesh = new Mesh(mesh.geometry);
          tempMesh.matrix.copy(mesh.matrix);

          const tempMatrix = new Matrix4();
          instanced.getMatrixAt(i, tempMatrix);
          tempMesh.applyMatrix4(tempMatrix);
          tempMesh.updateMatrix();
          tempMesh.updateMatrixWorld();

          this.inverseMatrix.copy(tempMesh.matrixWorld).invert();
          this.localPlane.copy(this.plane).applyMatrix4(this.inverseMatrix);

          index = this.shapecast(tempMesh, posAttr, index);
        }
      } else {
        this.inverseMatrix.copy(mesh.matrixWorld).invert();
        this.localPlane.copy(this.plane).applyMatrix4(this.inverseMatrix);
        index = this.shapecast(mesh, posAttr, index);
      }
    });

    // set the draw range to only the new segments and offset the lines so they don't intersect with the geometry
    edges.mesh.geometry.setDrawRange(0, index);
    edges.mesh.position.copy(this.plane.normal).multiplyScalar(0.0001);
    posAttr.needsUpdate = true;

    // Update the edges geometry only if there is no NaN in the output (which means there's been an error)
    if (!Number.isNaN(edges.generatorGeometry.attributes.position.array[0])) {
      ClippingEdges.basicEdges.geometry = edges.generatorGeometry;
      edges.mesh.geometry.fromLineSegments(ClippingEdges.basicEdges);
      const scene = ClippingEdges.components.scene.getScene();
      scene.add(edges.mesh);
      // ClippingEdges.context.renderer.postProduction.excludedItems.add(
      //   edges.mesh
      // );
    }
  }

  private shapecast(mesh: Mesh, posAttr: any, index: number) {
    // @ts-ignore
    mesh.geometry.boundsTree.shapecast({
      intersectsBounds: (box: any) => {
        return this.localPlane.intersectsBox(box) as any;
      },

      // @ts-ignore
      intersectsTriangle: (tri: any) => {
        // check each triangle edge to see if it intersects with the plane. If so then
        // add it to the list of segments.
        let count = 0;
        this.tempLine.start.copy(tri.a);
        this.tempLine.end.copy(tri.b);
        if (this.localPlane.intersectLine(this.tempLine, this.tempVector)) {
          const result = this.tempVector.applyMatrix4(mesh.matrixWorld);
          posAttr.setXYZ(index, result.x, result.y, result.z);
          count++;
          index++;
        }

        this.tempLine.start.copy(tri.b);
        this.tempLine.end.copy(tri.c);
        if (this.localPlane.intersectLine(this.tempLine, this.tempVector)) {
          const result = this.tempVector.applyMatrix4(mesh.matrixWorld);
          posAttr.setXYZ(index, result.x, result.y, result.z);
          count++;
          index++;
        }

        this.tempLine.start.copy(tri.c);
        this.tempLine.end.copy(tri.a);
        if (this.localPlane.intersectLine(this.tempLine, this.tempVector)) {
          const result = this.tempVector.applyMatrix4(mesh.matrixWorld);
          posAttr.setXYZ(index, result.x, result.y, result.z);
          count++;
          index++;
        }

        // If we only intersected with one or three sides then just remove it. This could be handled
        // more gracefully.
        if (count !== 2) {
          index -= count;
        }
      },
    });
    return index;
  }

  private updateEdgesVisibility(edgeName: string, visible: boolean) {
    const edges = this.edges[edgeName];
    edges.mesh.visible = visible;
    if (visible) {
      const scene = ClippingEdges.components.scene.getScene();
      scene.add(edges.mesh);
    } else {
      edges.mesh.removeFromParent();
    }
  }
}
