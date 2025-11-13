import * as THREE from "three";
import * as OBC from "@thatopen/components";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import { LineSegments2 } from "three/examples/jsm/lines/LineSegments2.js";
import { LineSegmentsGeometry } from "three/examples/jsm/lines/LineSegmentsGeometry.js";

/**
 * This component is used to navigate and visualize cross sections of a 3D model. 📕 [Tutorial](https://docs.thatopen.com/Tutorials/Components/Front/CivilNavigators). 📘 [API](https://docs.thatopen.com/api/@thatopen/components-front/classes/CivilCrossSectionNavigator).
 */
export class CivilCrossSectionNavigator
  extends OBC.Component
  implements OBC.Disposable
{
  /**
   * A unique identifier for the component. This UUID is used to register the component within the Components system.
   */
  static readonly uuid = "96b2c87e-d90b-4639-8257-8f01136fe324" as const;

  /** {@link OBC.Component.enabled} */
  enabled = true;

  /** {@link OBC.Disposable.onDisposed} */
  readonly onDisposed = new OBC.Event();

  private _world: OBC.World | null = null;

  private _flip = false;

  private _plane?: OBC.SimplePlane;

  private _point = new THREE.Vector3();

  private _edgeMeshes: LineSegments2[] = [];

  private _sectionVisible = false;

  private _sectionOffset = 0.1;

  edgeMaterial = new LineMaterial({
    color: 0x000000,
    linewidth: 5,
    depthTest: false,
  });

  /**
   * A property representing the plane used for cross section visualization.
   */
  get plane() {
    if (!this._plane) {
      throw new Error("Plane is not set. You must give a world.");
    }
    return this._plane;
  }

  /**
   * A property representing the plane used for cross section visualization.
   */
  set plane(plane: OBC.SimplePlane) {
    this._plane = plane;
  }

  get sectionVisible() {
    return this._sectionVisible;
  }

  set sectionVisible(visible: boolean) {
    this._sectionVisible = visible;
    for (const mesh of this._edgeMeshes) {
      mesh.visible = visible;
    }
  }

  /**
   * A getter for the 3D world.
   * @returns The 3D world.
   */
  get world() {
    return this._world;
  }

  /**
   * A setter for the 3D world.
   * @param world - The new 3D world.
   */
  set world(world: OBC.World | null) {
    this._world = world;

    this._plane?.dispose();

    if (!world) {
      return;
    }

    const clipper = this.components.get(OBC.Clipper);
    // const previousType = clipper.Type;
    // clipper.Type = EdgesPlane;
    const planeId = clipper.createFromNormalAndCoplanarPoint(
      world,
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(),
    );
    this.plane = clipper.list.get(planeId)!;
    // clipper.Type = previousType;
    this.plane.visible = false;
    this.plane.enabled = false;
  }

  constructor(components: OBC.Components) {
    super(components);
    this.components.add(CivilCrossSectionNavigator.uuid, this);
  }

  get flip() {
    return this._flip;
  }

  set flip(flip: boolean) {
    if (flip === this._flip) {
      return;
    }
    this._flip = flip;
    const newNormal = this.plane?.normal.clone().multiplyScalar(-1);
    // So that the section is not clipped by the plane
    for (const mesh of this._edgeMeshes) {
      mesh.position.add(newNormal.clone().multiplyScalar(this._sectionOffset));
    }
    this.plane.setFromNormalAndCoplanarPoint(newNormal, this._point);
    this.plane.update();
  }

  dispose() {
    this.clearMeshes();
    this.plane?.dispose();
    this.onDisposed.trigger();
    this.onDisposed.reset();
  }

  /**
   * Sets the cross section plane based on the given curve mesh and point.
   *
   * @param point - The point on the curve mesh where the cross section should be created.
   * @param normal - The normal of the plane.
   *
   * @throws Will throw an error if the world or plane is not set before calling this method.
   * @throws Will throw an error if the geometry is not indexed.
   *
   * @returns {Promise<void>}
   */
  async set(point: THREE.Vector3, normal: THREE.Vector3) {
    if (this.flip) {
      normal.multiplyScalar(-1);
    }
    this.plane.setFromNormalAndCoplanarPoint(normal, point);
    this._point.copy(point);
  }

  async update() {
    this.clearMeshes();

    const fragments = this.components.get(OBC.FragmentsManager);
    this.plane.update();

    const promises = [];
    for (const [, model] of fragments.list) {
      promises.push(this.generateModelSection(model));
    }
    await Promise.all(promises);
  }

  private async generateModelSection(model: any) {
    if (!this.world) {
      return;
    }

    const plane = this.plane.three.clone();
    plane.constant -= 0.01; // So that the section is not clipped by the plane

    const { buffer } = await model.getSection(plane);
    const edgesGeometry = new THREE.BufferGeometry();
    const posAttr = new THREE.BufferAttribute(buffer, 3, false);
    edgesGeometry.setAttribute("position", posAttr);
    const edges = new THREE.LineSegments(edgesGeometry);

    const geometry = new LineSegmentsGeometry();
    geometry.fromLineSegments(edges);
    const line = new LineSegments2(geometry, this.edgeMaterial);
    line.frustumCulled = false;
    this.world.scene.three.add(line);
    this._edgeMeshes.push(line);
    line.renderOrder = 3;
    edges.geometry.dispose();
  }

  private clearMeshes() {
    for (const mesh of this._edgeMeshes) {
      mesh.removeFromParent();
      mesh.geometry.dispose();
      mesh.material = undefined as any;
    }
    this._edgeMeshes = [];
  }
}
