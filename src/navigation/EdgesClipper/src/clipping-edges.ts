import * as THREE from "three";
import { Edge } from "./types";
import { EdgesStyles } from "./edges-styles";
import {
  Component,
  Disposable,
  Hideable,
  Updateable,
  Event,
} from "../../../base-types";
import { Components, Disposer } from "../../../core";
import { ClippingFills } from "./clipping-fills";

export type Edges = {
  [name: string]: Edge;
};

/**
 * The edges that are drawn when the {@link EdgesPlane} sections a mesh.
 */
export class ClippingEdges
  extends Component<Edges>
  implements Hideable, Disposable, Updateable
{
  /** {@link Component.name} */
  name = "ClippingEdges";

  /** {@link Component.enabled}. */
  enabled = true;

  protected _edges: Edges = {};
  protected _styles: EdgesStyles;
  protected _disposer = new Disposer();
  protected _visible = true;
  protected _inverseMatrix = new THREE.Matrix4();
  protected _localPlane = new THREE.Plane();
  protected _tempLine = new THREE.Line3();
  protected _tempVector = new THREE.Vector3();
  protected _components: Components;
  protected _plane: THREE.Plane;

  /** {@link Hideable.visible} */
  get visible() {
    return this._visible;
  }

  /** {@link Hideable.visible} */
  set visible(visible: boolean) {
    this._visible = visible;

    const names = Object.keys(this._edges);
    for (const edgeName of names) {
      this.updateEdgesVisibility(edgeName, visible);
    }

    if (visible) {
      this.update();
    }
  }

  constructor(components: Components, plane: THREE.Plane, styles: EdgesStyles) {
    super();
    this._components = components;
    this._plane = plane;
    this._styles = styles;
  }

  /** {@link Updateable.afterUpdate} */
  afterUpdate = new Event<Edge[]>();

  /** {@link Updateable.beforeUpdate} */
  beforeUpdate = new Event<Edge[]>();

  /** {@link Updateable.update} */
  update() {
    const styles = Object.values(this._styles.get());
    for (const style of styles) {
      this.drawEdges(style.name);
    }
  }

  /** {@link Component.get} */
  get(): Edges {
    return this._edges;
  }

  /** {@link Disposable.dispose} */
  dispose() {
    const edges = Object.values(this._edges);
    for (const edge of edges) {
      edge.fill.dispose();
      this._disposer.dispose(edge.mesh, false);
    }
  }

  private newEdgesMesh(styleName: string) {
    const styles = this._styles.get();
    const material = styles[styleName].lineMaterial;
    const edgesGeometry = new THREE.BufferGeometry();
    const buffer = new Float32Array(300000);
    const linePosAttr = new THREE.BufferAttribute(buffer, 3, false);
    linePosAttr.setUsage(THREE.DynamicDrawUsage);
    edgesGeometry.setAttribute("position", linePosAttr);
    return new THREE.LineSegments(edgesGeometry, material);
  }

  private newFillMesh(name: string, geometry: THREE.BufferGeometry) {
    const styles = this._styles.get();
    const fillMaterial = styles[name].fillMaterial;
    return new ClippingFills(this._plane, geometry, fillMaterial);
  }

  // Source: https://gkjohnson.github.io/three-mesh-bvh/example/bundle/clippedEdges.html
  private drawEdges(styleName: string) {
    const style = this._styles.get()[styleName];

    if (!this._edges[styleName]) {
      this.initializeStyle(styleName);
    }

    const edges = this._edges[styleName];

    let index = 0;
    const posAttr = edges.mesh.geometry.attributes.position;

    // @ts-ignore
    posAttr.array.fill(0);

    const notEmptyMeshes = style.meshes.filter((mesh) => mesh.geometry);
    notEmptyMeshes.forEach((mesh) => {
      if (!mesh.geometry.boundsTree) {
        throw new Error("Boundstree not found for clipping edges subset.");
      }

      const instanced = mesh as THREE.InstancedMesh;
      if (instanced.count > 1) {
        for (let i = 0; i < instanced.count; i++) {
          const tempMesh = new THREE.Mesh(mesh.geometry);
          tempMesh.matrix.copy(mesh.matrix);

          const tempMatrix = new THREE.Matrix4();
          instanced.getMatrixAt(i, tempMatrix);
          tempMesh.applyMatrix4(tempMatrix);
          tempMesh.applyMatrix4(mesh.matrix);
          tempMesh.updateMatrix();
          tempMesh.updateMatrixWorld();

          this._inverseMatrix.copy(tempMesh.matrixWorld).invert();
          this._localPlane.copy(this._plane).applyMatrix4(this._inverseMatrix);

          index = this.shapecast(tempMesh, posAttr, index);
        }
      } else {
        this._inverseMatrix.copy(mesh.matrixWorld).invert();
        this._localPlane.copy(this._plane).applyMatrix4(this._inverseMatrix);
        index = this.shapecast(mesh, posAttr, index);
      }
    });

    // set the draw range to only the new segments and offset the lines so they don't intersect with the geometry
    edges.mesh.geometry.setDrawRange(0, index);
    edges.mesh.position.copy(this._plane.normal).multiplyScalar(0.0001);
    posAttr.needsUpdate = true;

    // Update the edges geometry only if there is no NaN in the output (which means there's been an error)
    const attributes = edges.mesh.geometry.attributes;
    const position = attributes.position as THREE.BufferAttribute;
    if (!Number.isNaN(position.array[0])) {
      const scene = this._components.scene.get();
      scene.add(edges.mesh);
      edges.fill.update();
      scene.add(edges.fill.mesh);
    }
  }

  private initializeStyle(name: string) {
    const mesh = this.newEdgesMesh(name);
    const geometry = mesh.geometry;
    const fill = this.newFillMesh(name, geometry);
    this._edges[name] = { mesh, name, fill };
  }

  private shapecast(mesh: THREE.Mesh, posAttr: any, index: number) {
    // @ts-ignore
    mesh.geometry.boundsTree.shapecast({
      intersectsBounds: (box: any) => {
        return this._localPlane.intersectsBox(box) as any;
      },

      // @ts-ignore
      intersectsTriangle: (tri: any) => {
        // check each triangle edge to see if it intersects with the plane. If so then
        // add it to the list of segments.
        let count = 0;
        this._tempLine.start.copy(tri.a);
        this._tempLine.end.copy(tri.b);
        if (this._localPlane.intersectLine(this._tempLine, this._tempVector)) {
          const result = this._tempVector.applyMatrix4(mesh.matrixWorld);
          posAttr.setXYZ(index, result.x, result.y, result.z);
          count++;
          index++;
        }

        this._tempLine.start.copy(tri.b);
        this._tempLine.end.copy(tri.c);
        if (this._localPlane.intersectLine(this._tempLine, this._tempVector)) {
          const result = this._tempVector.applyMatrix4(mesh.matrixWorld);
          posAttr.setXYZ(index, result.x, result.y, result.z);
          count++;
          index++;
        }

        this._tempLine.start.copy(tri.c);
        this._tempLine.end.copy(tri.a);
        if (this._localPlane.intersectLine(this._tempLine, this._tempVector)) {
          const result = this._tempVector.applyMatrix4(mesh.matrixWorld);
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
    const edges = this._edges[edgeName];
    edges.mesh.visible = visible;
    if (visible) {
      const scene = this._components.scene.get();
      scene.add(edges.mesh);
    } else {
      edges.mesh.removeFromParent();
    }
  }
}
