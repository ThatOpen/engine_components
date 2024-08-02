import * as THREE from "three";
import { FragmentMesh } from "@thatopen/fragments";
import * as OBC from "@thatopen/components";
import { ClipStyle, Edge, IndexFragmentMap } from "./types";
import { LineStyles } from "./edges-styles";
import { ClippingFills } from "./clipping-fills";
import { PostproductionRenderer } from "../../PostproductionRenderer";
import { ClipEdges } from "../index";

/**
 * Type definition for the Edges object. The Edges object is a dictionary where the keys are strings and the values are of type {@link Edge}. It is used to store and manage multiple {@link Edge} instances, each identified by a unique name.
 */
export type Edges = {
  [name: string]: Edge;
};

/**
 * Class representing the ClippingEdges component. This is responsible for managing and rendering the edges of clipped objects.
 */
export class ClippingEdges
  implements OBC.Hideable, OBC.Disposable, OBC.Updateable
{
  /** {@link OBC.Disposable.onDisposed} */
  readonly onDisposed = new OBC.Event();

  /** {@link OBC.Updateable.onAfterUpdate} */
  onAfterUpdate = new OBC.Event<Edge[]>();

  /** {@link OBC.Updateable.onBeforeUpdate} */
  onBeforeUpdate = new OBC.Event<Edge[]>();

  /** Indicates whether the component is enabled. */
  enabled = true;

  /** Indicates whether the fill needs to be updated. */
  fillNeedsUpdate = false;

  /** Reference to the components manager. */
  components: OBC.Components;

  /** Reference to the world. */
  world: OBC.World;

  protected _edges: Edges = {};
  protected _visible = true;
  protected _inverseMatrix = new THREE.Matrix4();
  protected _localPlane = new THREE.Plane();
  protected _tempLine = new THREE.Line3();
  protected _tempVector = new THREE.Vector3();
  protected _plane: THREE.Plane;

  /** {@link OBC.Hideable.visible} */
  get visible() {
    return this._visible;
  }

  /** {@link OBC.Hideable.visible} */
  set visible(visible: boolean) {
    this._visible = visible;
    for (const name in this._edges) {
      const edges = this._edges[name];
      if (visible) {
        const scene = this.world.scene.three;
        scene.add(edges.mesh);
      } else {
        edges.mesh.removeFromParent();
      }
      if (edges.fill) {
        edges.fill.visible = visible;
      }
    }
  }

  /**
   * Getter that returns an array of THREE.Mesh instances representing the fills of the edges.
   *
   * @returns An array of THREE.Mesh instances representing the fills of the edges.
   */
  get fillMeshes() {
    const fills: THREE.Mesh[] = [];
    for (const name in this._edges) {
      const edge = this._edges[name];
      if (edge.fill) {
        fills.push(edge.fill.mesh);
      }
    }
    return fills;
  }

  constructor(
    components: OBC.Components,
    world: OBC.World,
    plane: THREE.Plane,
  ) {
    this.components = components;
    this.world = world;
    this._plane = plane;
  }

  /** {@link OBC.Updateable.update} */
  update() {
    const edges = this.components.get(ClipEdges);
    const styles = edges.styles.list;
    this.updateDeletedEdges(styles);
    for (const name in styles) {
      this.drawEdges(name);
    }
    this.fillNeedsUpdate = false;
  }

  // TODO: Remove?
  get(): Edges {
    return this._edges;
  }

  /** {@link OBC.Disposable.dispose} */
  dispose() {
    const names = Object.keys(this._edges);
    for (const name of names) {
      this.disposeEdge(name);
    }
    this.onDisposed.trigger();
    this.onDisposed.reset();
  }

  private newEdgesMesh(styleName: string) {
    const edges = this.components.get(ClipEdges);
    const styles = edges.styles.list;
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
    const edges = this.components.get(ClipEdges);
    const styles = edges.styles.list;
    const style = styles[name];
    const fillMaterial = style.fillMaterial;
    if (fillMaterial) {
      const fills = new ClippingFills(
        this.components,
        this.world,
        this._plane,
        geometry,
        fillMaterial,
      );
      this.newFillOutline(name, fills, style);
      return fills;
    }
    return undefined;
  }

  private newFillOutline(name: string, fills: ClippingFills, style: ClipStyle) {
    if (!style.outlineMaterial) return;
    if (!this.world.renderer) return;
    const renderer = this.world.renderer;
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
    const edges = this.components.get(ClipEdges);
    const style = edges.styles.list[styleName];

    if (!this._edges[styleName]) {
      this.initializeStyle(styleName);
    }

    const currentEdges = this._edges[styleName];

    let index = 0;
    const posAttr = currentEdges.mesh.geometry.attributes.position;

    // @ts-ignore
    posAttr.array.fill(0);

    // The indexex of the points that draw the lines
    const indexes: number[] = [];
    let lastIndex = 0;

    const indexFragMap: IndexFragmentMap = new Map();

    for (const mesh of style.meshes) {
      if (!mesh.geometry) {
        continue;
      }
      // @ts-ignore
      if (!mesh.geometry.boundsTree) {
        throw new Error("Bounds tree not found for clipping edges subset.");
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
          tempMesh.applyMatrix4(mesh.matrixWorld);
          tempMesh.updateMatrix();
          tempMesh.updateMatrixWorld();

          this._inverseMatrix.copy(tempMesh.matrixWorld).invert();
          this._localPlane.copy(this._plane).applyMatrix4(this._inverseMatrix);

          index = this.shapecast(tempMesh, posAttr, index);

          if (index !== lastIndex) {
            // Store a reference to the original fragment so that we can trace it back
            // from the fill mesh
            if (isFragment && ids) {
              const itemID = fMesh.fragment.getItemID(i);
              if (itemID !== null) {
                indexFragMap.set(index, {
                  [fMesh.fragment.id]: new Set([itemID]),
                });
              }
            }

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
    currentEdges.mesh.geometry.setDrawRange(0, index);

    currentEdges.mesh.position.copy(this._plane.normal).multiplyScalar(0.0001);
    posAttr.needsUpdate = true;

    // Update the edges geometry only if there is no NaN in the output (which means there's been an error)
    const attributes = currentEdges.mesh.geometry.attributes;
    const position = attributes.position as THREE.BufferAttribute;
    if (!Number.isNaN(position.array[0])) {
      if (this.fillNeedsUpdate && currentEdges.fill) {
        currentEdges.fill.geometry = currentEdges.mesh.geometry;
        currentEdges.fill.update(indexes, indexFragMap);
        currentEdges.fill.visible = this._visible;
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

  private updateDeletedEdges(styles: LineStyles) {
    const names = Object.keys(this._edges);
    for (const name of names) {
      if (styles[name] === undefined) {
        this.disposeEdge(name);
        this.disposeOutline(name);
      }
    }
  }

  private disposeOutline(name: string) {
    if (!this.world.renderer) return;
    const renderer = this.world.renderer;
    if (renderer instanceof PostproductionRenderer) {
      const outlines = renderer.postproduction.customEffects.outlinedMeshes;
      delete outlines[name];
    }
  }

  private disposeEdge(name: string) {
    const disposer = this.components.get(OBC.Disposer);
    const edge = this._edges[name];
    if (edge.fill) {
      edge.fill.dispose();
    }
    disposer.destroy(edge.mesh, false);
    delete this._edges[name];
  }
}
