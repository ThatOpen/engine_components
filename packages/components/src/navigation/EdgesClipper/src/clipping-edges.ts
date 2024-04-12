import * as THREE from "three";
import { FragmentMesh } from "bim-fragment";
import { ClipStyle, Edge } from "./types";
import { EdgesStyles, LineStyles } from "./edges-styles";
import {
  Component,
  Disposable,
  Hideable,
  Updateable,
  Event,
} from "../../../base-types";
import { Components, Disposer } from "../../../core";
import { ClippingFills } from "./clipping-fills";
import { PostproductionRenderer } from "../../PostproductionRenderer";

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
  /** {@link Disposable.onDisposed} */
  readonly onDisposed = new Event<undefined>();

  /** {@link Updateable.onAfterUpdate} */
  onAfterUpdate = new Event<Edge[]>();

  /** {@link Updateable.onBeforeUpdate} */
  onBeforeUpdate = new Event<Edge[]>();

  /** {@link Component.name} */
  name = "ClippingEdges";

  /** {@link Component.enabled}. */
  enabled = true;

  fillNeedsUpdate = false;

  protected _edges: Edges = {};
  protected _styles: EdgesStyles;
  protected _visible = true;
  protected _inverseMatrix = new THREE.Matrix4();
  protected _localPlane = new THREE.Plane();
  protected _tempLine = new THREE.Line3();
  protected _tempVector = new THREE.Vector3();
  protected _plane: THREE.Plane;

  /** {@link Hideable.visible} */
  get visible() {
    return this._visible;
  }

  get fillVisible() {
    for (const name in this._edges) {
      const edges = this._edges[name];
      if (edges.fill) {
        return edges.fill.visible;
      }
    }
    return false;
  }

  set fillVisible(visible: boolean) {
    for (const name in this._edges) {
      const edges = this._edges[name];
      if (edges.fill) {
        edges.fill.visible = visible;
      }
    }
  }

  constructor(components: Components, plane: THREE.Plane, styles: EdgesStyles) {
    super(components);
    this._plane = plane;
    this._styles = styles;
  }

  async setVisible(visible: boolean) {
    this._visible = visible;

    const names = Object.keys(this._edges);
    for (const edgeName of names) {
      this.updateEdgesVisibility(edgeName, visible);
    }

    if (visible) {
      await this.update();
    }
  }

  /** {@link Updateable.update} */
  async update() {
    const styles = this._styles.get();
    await this.updateDeletedEdges(styles);
    for (const name in styles) {
      this.drawEdges(name);
    }
    this.fillNeedsUpdate = false;
  }

  /** {@link Component.get} */
  get(): Edges {
    return this._edges;
  }

  /** {@link Disposable.dispose} */
  async dispose() {
    const names = Object.keys(this._edges);
    for (const name of names) {
      this.disposeEdge(name);
    }
    await this.onDisposed.trigger();
    this.onDisposed.reset();
  }

  private newEdgesMesh(styleName: string) {
    const styles = this._styles.get();
    const material = styles[styleName].lineMaterial;
    const edgesGeometry = new THREE.BufferGeometry();
    const buffer = new Float32Array(300000);
    const linePosAttr = new THREE.BufferAttribute(buffer, 3, false);
    linePosAttr.setUsage(THREE.DynamicDrawUsage);
    edgesGeometry.setAttribute("position", linePosAttr);
    const lines = new THREE.LineSegments(edgesGeometry, material);
    lines.frustumCulled = false;
    return lines;
  }

  private newFillMesh(name: string, geometry: THREE.BufferGeometry) {
    const styles = this._styles.get();
    const style = styles[name];
    const fillMaterial = style.fillMaterial;
    if (fillMaterial) {
      const fills = new ClippingFills(
        this.components,
        this._plane,
        geometry,
        fillMaterial
      );
      this.newFillOutline(name, fills, style);
      return fills;
    }
    return undefined;
  }

  private newFillOutline(name: string, fills: ClippingFills, style: ClipStyle) {
    if (!style.outlineMaterial) return;
    const renderer = this.components.renderer;
    if (renderer instanceof PostproductionRenderer) {
      const pRenderer = renderer as PostproductionRenderer;
      const outlines = pRenderer.postproduction.customEffects.outlinedMeshes;
      if (!outlines[name]) {
        outlines[name] = {
          meshes: new Set(),
          material: style.outlineMaterial,
        };
      }
      fills.styleName = name;
    }
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

    // The indexex of the points that draw the lines
    const indexes: number[] = [];
    let lastIndex = 0;

    for (const mesh of style.meshes) {
      if (!mesh.geometry) {
        continue;
      }
      if (!mesh.geometry.boundsTree) {
        throw new Error("Boundstree not found for clipping edges subset.");
      }

      if (mesh instanceof THREE.InstancedMesh) {
        if (mesh.count === 0) {
          continue;
        }
        const instanced = mesh as THREE.InstancedMesh;
        for (let i = 0; i < instanced.count; i++) {
          // Exclude fragment instances that don't belong to this style
          const isFragment = instanced instanceof FragmentMesh;
          const fMesh = instanced as FragmentMesh;
          const ids = style.fragments[fMesh.fragment.id];
          if (isFragment && ids) {
            const itemID = fMesh.fragment.getItemID(i);
            if (itemID === null || !ids.has(itemID)) {
              continue;
            }
          }

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

          if (index !== lastIndex) {
            indexes.push(index);
            lastIndex = index;
          }
        }
      } else {
        this._inverseMatrix.copy(mesh.matrixWorld).invert();
        this._localPlane.copy(this._plane).applyMatrix4(this._inverseMatrix);

        index = this.shapecast(mesh, posAttr, index);

        if (index !== lastIndex) {
          indexes.push(index);
          lastIndex = index;
        }
      }
    }

    // set the draw range to only the new segments and offset the lines so they don't intersect with the geometry
    edges.mesh.geometry.setDrawRange(0, index);

    edges.mesh.position.copy(this._plane.normal).multiplyScalar(0.0001);
    posAttr.needsUpdate = true;

    // Update the edges geometry only if there is no NaN in the output (which means there's been an error)
    const attributes = edges.mesh.geometry.attributes;
    const position = attributes.position as THREE.BufferAttribute;
    if (!Number.isNaN(position.array[0])) {
      if (!edges.mesh.parent) {
        const scene = this.components.scene.get();
        scene.add(edges.mesh);
      }
      if (this.fillNeedsUpdate && edges.fill) {
        edges.fill.geometry = edges.mesh.geometry;
        edges.fill.update(indexes);
      }
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
    if (edges.fill) {
      edges.fill.visible = visible;
    }
    edges.mesh.visible = visible;
    if (visible) {
      const scene = this.components.scene.get();
      scene.add(edges.mesh);
    } else {
      edges.mesh.removeFromParent();
    }
  }

  private async updateDeletedEdges(styles: LineStyles) {
    const names = Object.keys(this._edges);
    for (const name of names) {
      if (styles[name] === undefined) {
        this.disposeEdge(name);
        this.disposeOutline(name);
      }
    }
  }

  private disposeOutline(name: string) {
    const renderer = this.components.renderer;
    if (renderer instanceof PostproductionRenderer) {
      const outlines = renderer.postproduction.customEffects.outlinedMeshes;
      delete outlines[name];
    }
  }

  private disposeEdge(name: string) {
    const disposer = this.components.tools.get(Disposer);
    const edge = this._edges[name];
    if (edge.fill) {
      edge.fill.dispose();
    }
    disposer.destroy(edge.mesh, false);
    delete this._edges[name];
  }
}
