import * as THREE from "three";
import * as OBC from "@thatopen/components";
import * as FRAGS from "@thatopen/fragments";
import { Mark } from "../core";

export enum GraphicVertexPickerMode {
  DEFAULT,
  SYNCHRONOUS,
}

/**
 * A class to provide a graphical marker for picking vertices in a 3D scene.
 */
export class GraphicVertexPicker implements OBC.Disposable {
  /** {@link OBC.Disposable.onDisposed} */
  readonly onDisposed = new OBC.Event();

  /** The marker used to indicate the picked vertex. */
  marker: Mark | null = null;

  world: OBC.World | null = null;

  mode = GraphicVertexPickerMode.DEFAULT;

  maxDistance = 1;

  private _pickerSize = 6;

  get pickerSize() {
    return this._pickerSize;
  }

  set pickerSize(value: number) {
    this._pickerSize = value;
    const size = `${value}px`;
    this._preview.style.width = size;
    this._preview.style.height = size;
    if (this.marker) {
      this.marker.three.element.style.width = size;
      this.marker.three.element.style.height = size;
    }
  }

  private _enabled = false;
  set enabled(value: boolean) {
    this._enabled = value;
    if (this.marker) this.marker.visible = value;
    if (value) {
      this.get();
    } else {
      this.hidePointer();
    }
  }

  get enabled() {
    return this._enabled;
  }

  private _components: OBC.Components;

  private _preview = document.createElement("div");
  private _pointerVisible = false;
  private _intersectionFound = false;

  static baseSnappingStyle: Partial<CSSStyleDeclaration> = {
    height: "6px",
    width: "6px",
    borderRadius: "100%",
    borderWidth: "2px",
    borderColor: "rgb(122, 75, 209)",
    borderStyle: "solid",
    zIndex: "-20",
  };

  static snappingStyles: Record<
    FRAGS.SnappingClass,
    Partial<CSSStyleDeclaration>
  > = {
    [FRAGS.SnappingClass.FACE]: { ...GraphicVertexPicker.baseSnappingStyle },
    [FRAGS.SnappingClass.POINT]: {
      ...GraphicVertexPicker.baseSnappingStyle,
      borderColor: "#e25959",
      borderRadius: "0",
    },
    [FRAGS.SnappingClass.LINE]: {
      ...GraphicVertexPicker.baseSnappingStyle,
      borderColor: "#2d2d2d",
      borderRadius: "0",
    },
  };

  constructor(components: OBC.Components) {
    this._components = components;
    for (const key in GraphicVertexPicker.baseSnappingStyle) {
      const value = GraphicVertexPicker.baseSnappingStyle[key];
      this._preview.style[key] = value as string;
    }
    this._preview.style.zIndex = "999";
    this._preview.style.pointerEvents = "none";
    this._preview.style.position = "absolute";
    this._preview.style.top = "0";
    this._preview.style.left = "0";
  }

  /** {@link OBC.Disposable.onDisposed} */
  dispose() {
    this.hidePointer();
    if (this.marker) {
      this.marker.dispose();
    }
  }

  /**
   * Retrieves the picked vertex from the world and updates the marker's position.
   * If no vertex is picked, the marker is hidden.
   *
   * @param world - The world in which to pick the vertex.
   * @returns The picked vertex, or null if no vertex was picked.
   */
  async get(config?: {
    world?: OBC.World;
    snappingClasses?: FRAGS.SnappingClass[];
  }) {
    if (this.mode === GraphicVertexPickerMode.SYNCHRONOUS) {
      return this.getSynchronous(config);
    }
    return this.getDefault(config);
  }

  private async getSynchronous(config?: {
    world?: OBC.World;
    snappingClasses?: FRAGS.SnappingClass[];
  }) {
    const world = config?.world ?? this.world;
    if (!world) {
      throw new Error(
        "GraphicVertexPicker: a world is need to get a casting result.",
      );
    }

    const casters = this._components.get(OBC.Raycasters);
    const caster = casters.get(world);

    let intersects: any = null;
    if (this.mode === GraphicVertexPickerMode.DEFAULT) {
      intersects = await caster.castRay({
        snappingClasses: config?.snappingClasses,
      });
    } else if (this.mode === GraphicVertexPickerMode.SYNCHRONOUS) {
      intersects = await caster.castRayToObjects();
    }

    this._intersectionFound = Boolean(intersects);

    if (intersects) {
      const { point } = intersects;
      if (!this.marker) {
        const element = document.createElement("div");
        this.marker = new Mark(world, element);
      }

      if (this.marker.world !== world) {
        this.marker.world = world;
        this.marker.three.removeFromParent();
        world.scene.three.add(this.marker.three);
      }

      this.hidePointer();

      this.marker.visible = true;

      const hasSnappingClass = Boolean(config?.snappingClasses);

      // Apply the marker style based on the snapping class
      if (hasSnappingClass) {
        const snappingClasses = config?.snappingClasses || [];
        let classToUse = FRAGS.SnappingClass.FACE;
        if (snappingClasses.includes(FRAGS.SnappingClass.POINT)) {
          classToUse = FRAGS.SnappingClass.POINT;
        } else if (snappingClasses.includes(FRAGS.SnappingClass.LINE)) {
          classToUse = FRAGS.SnappingClass.LINE;
        }

        // Apply snapping (if necessary)
        let snappingFound = false;
        if (classToUse !== FRAGS.SnappingClass.FACE) {
          snappingFound = this.applySnapping(intersects, classToUse);
        }

        if (!snappingFound) {
          // Tried to snap but failed, apply default style
          Object.assign(
            this.marker.three.element.style,
            GraphicVertexPicker.baseSnappingStyle,
          );
        } else {
          // Snapping successful, apply the style
          const style =
            GraphicVertexPicker.snappingStyles[classToUse] ??
            GraphicVertexPicker.baseSnappingStyle;
          Object.assign(this.marker.three.element.style, style);

          // Apply marker position
        }

        this.applyMarkerSize();
        this.marker.three.position.copy(point);
      } else {
        Object.assign(
          this.marker.three.element.style,
          GraphicVertexPicker.baseSnappingStyle,
        );
        this.applyMarkerSize();
      }
    } else if (this.marker) {
      this.marker.visible = false;
    }

    return intersects;
  }

  private async getDefault(config?: {
    world?: OBC.World;
    snappingClasses?: FRAGS.SnappingClass[];
  }) {
    const world = config?.world ?? this.world;
    if (!world) {
      throw new Error(
        "GraphicVertexPicker: a world is need to get a casting result.",
      );
    }

    const casters = this._components.get(OBC.Raycasters);
    const caster = casters.get(world);
    const intersects = await caster.castRay({
      snappingClasses: config?.snappingClasses,
    });

    this._intersectionFound = Boolean(intersects);

    if (intersects) {
      const { point } = intersects;
      if (!this.marker) {
        const element = document.createElement("div");
        this.marker = new Mark(world, element);
      }

      if (this.marker.world !== world) {
        this.marker.world = world;
        this.marker.three.removeFromParent();
        world.scene.three.add(this.marker.three);
      }

      this.hidePointer();

      this.marker.visible = true;
      this.marker.three.position.copy(point);

      // Apply the marker style based on the snapping class
      if (
        "snappingClass" in intersects &&
        typeof intersects.snappingClass === "number" &&
        (intersects.snappingClass === 0 ||
          intersects.snappingClass === 1 ||
          intersects.snappingClass === 2)
      ) {
        const style =
          GraphicVertexPicker.snappingStyles[intersects.snappingClass] ??
          GraphicVertexPicker.baseSnappingStyle;
        Object.assign(this.marker.three.element.style, style);
      } else {
        Object.assign(
          this.marker.three.element.style,
          GraphicVertexPicker.baseSnappingStyle,
        );
      }
      this.applyMarkerSize();
    } else if (this.marker) {
      this.marker.visible = false;
    }

    return intersects;
  }

  updatePointer() {
    if (!this.world) return;
    if (!this.marker) return;
    if (
      this.mode === GraphicVertexPickerMode.SYNCHRONOUS &&
      this._intersectionFound
    ) {
      this.hidePointer();
      return;
    }
    this.showPointer();
    if (this.marker.visible) {
      this.marker.visible = false;
    }
    const casters = this._components.get(OBC.Raycasters);
    const caster = casters.get(this.world);
    const mousePosition = caster.mouse.rawPosition;
    const domElement = this.world.renderer!.three.domElement;
    const rect = domElement.getBoundingClientRect();
    const x = mousePosition.x - rect.left;
    const y = mousePosition.y - rect.top;
    this._preview.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
  }

  private showPointer() {
    if (!this.world) return;
    if (this._pointerVisible) return;
    this._pointerVisible = true;
    const domElement = this.world.renderer!.three.domElement;
    const parent = domElement.parentElement;
    if (!parent) return;
    const style = getComputedStyle(parent);
    if (style.position === "static") {
      parent.style.position = "relative";
    }
    parent.appendChild(this._preview);
  }

  private hidePointer() {
    if (!this.world) return;
    if (!this._pointerVisible) return;
    this._pointerVisible = false;
    const domElement = this.world.renderer!.three.domElement;
    domElement.parentElement?.removeChild(this._preview);
  }

  private applyMarkerSize() {
    if (!this.marker) return;
    const size = `${this._pickerSize}px`;
    this.marker.three.element.style.width = size;
    this.marker.three.element.style.height = size;
  }

  private applySnapping(
    intersects: THREE.Intersection,
    snappingClass: FRAGS.SnappingClass,
  ): boolean {
    if (snappingClass === FRAGS.SnappingClass.FACE) {
      return true;
    }

    const mesh = intersects.object as THREE.Mesh;

    if (
      !intersects.face ||
      !mesh ||
      !mesh.geometry ||
      !mesh.geometry.index ||
      !mesh.geometry.attributes ||
      !mesh.geometry.attributes.position
    ) {
      return false;
    }

    const transform = intersects.object.matrixWorld;

    const geometry = mesh.geometry as THREE.BufferGeometry;
    const positionAttr = geometry.attributes.position.array;
    const point = intersects.point;

    const index1 = intersects.face.a;
    const index2 = intersects.face.b;
    const index3 = intersects.face.c;

    const vertex1 = new THREE.Vector3(
      positionAttr[index1 * 3],
      positionAttr[index1 * 3 + 1],
      positionAttr[index1 * 3 + 2],
    ).applyMatrix4(transform);

    const vertex2 = new THREE.Vector3(
      positionAttr[index2 * 3],
      positionAttr[index2 * 3 + 1],
      positionAttr[index2 * 3 + 2],
    ).applyMatrix4(transform);

    const vertex3 = new THREE.Vector3(
      positionAttr[index3 * 3],
      positionAttr[index3 * 3 + 1],
      positionAttr[index3 * 3 + 2],
    ).applyMatrix4(transform);

    // TODO: Computing the face like in async mode is slow
    // Try a faster method to get all the triangles of this face?
    // prettier-ignore
    (intersects as any).facePoints = [
      vertex1.x, vertex1.y, vertex1.z,
      vertex2.x, vertex2.y, vertex2.z,
      vertex3.x, vertex3.y, vertex3.z,
    ];

    if (snappingClass === FRAGS.SnappingClass.LINE) {
      // Find the closest point on each edge of the triangle
      const edges = [
        [vertex1, vertex2],
        [vertex2, vertex3],
        [vertex3, vertex1],
      ];

      const closestPointOnLine = new THREE.Vector3();
      const closestPoint = new THREE.Vector3();
      const tempLine = new THREE.Line3();
      let minDistSq = Number.MAX_SAFE_INTEGER;
      let lineFound = false;

      const maxDistanceSquared = this.maxDistance * this.maxDistance;

      for (const [start, end] of edges) {
        tempLine.set(start, end);
        tempLine.closestPointToPoint(point, true, closestPointOnLine);
        const distSq = point.distanceToSquared(closestPointOnLine);
        if (distSq < maxDistanceSquared && distSq < minDistSq) {
          (intersects as any).snappedEdgeP1 = start;
          (intersects as any).snappedEdgeP2 = end;
          minDistSq = distSq;
          closestPoint.copy(closestPointOnLine);
          lineFound = true;
        }
      }

      if (!lineFound) {
        return false;
      }

      // Snap the intersection point to the closest point on the edge
      intersects.point.copy(closestPoint);
      return true;
    }

    // Point
    // If the intersected object is a BufferGeometry mesh, snap to nearest vertex

    const vertices = [vertex1, vertex2, vertex3];

    const closestVertex = new THREE.Vector3();
    let minDistSq = Number.MAX_SAFE_INTEGER;

    let vertexFound = false;

    const maxDistanceSquared = this.maxDistance * this.maxDistance;

    for (let i = 0; i < vertices.length; i++) {
      const v = vertices[i];
      const distSq = point.distanceToSquared(v);
      if (distSq < maxDistanceSquared && distSq < minDistSq) {
        minDistSq = distSq;
        closestVertex.copy(v);
        vertexFound = true;
      }
    }

    if (!vertexFound) {
      return false;
    }

    // Snap the intersection point to the closest vertex
    intersects.point.copy(closestVertex);
    return true;
  }
}
