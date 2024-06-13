import * as THREE from "three";
import * as FRAGS from "@thatopen/fragments";
import * as OBC from "@thatopen/components";
import { Clipper } from "@thatopen/components";
import { EdgesPlane } from "../../core";

/**
 * This component is used to navigate and visualize cross sections of a 3D model. 📕 [Tutorial](https://docs.thatopen.com/Tutorials/Components/Front/CivilCrossSectionNavigator). 📘 [API](https://docs.thatopen.com/api/@thatopen/components-front/classes/CivilCrossSectionNavigator).
 */
export class CivilCrossSectionNavigator extends OBC.Component {
  /**
   * A unique identifier for the component. This UUID is used to register the component within the Components system.
   */
  static readonly uuid = "96b2c87e-d90b-4639-8257-8f01136fe324" as const;

  /** {@link OBC.Component.enabled} */
  enabled = true;

  /**
   * A property representing the world in which the component operates.
   */
  world: OBC.World | null = null;

  /**
   * A property representing the plane used for cross section visualization.
   */
  plane?: EdgesPlane;

  private _world3D: OBC.World | null = null;

  /**
   * A getter for the 3D world.
   * @returns The 3D world.
   */
  get world3D() {
    return this._world3D;
  }

  /**
   * A setter for the 3D world.
   * @param world - The new 3D world.
   */
  set world3D(world: OBC.World | null) {
    this._world3D = world;

    this.plane?.dispose();

    if (!world) {
      return;
    }

    const clipper = this.components.get(Clipper);
    const previousType = clipper.Type;
    clipper.Type = EdgesPlane;
    this.plane = clipper.createFromNormalAndCoplanarPoint(
      world,
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(),
    ) as EdgesPlane;
    clipper.Type = previousType;
    this.plane.visible = false;
    this.plane.enabled = false;
  }

  constructor(components: OBC.Components) {
    super(components);
    this.components.add(CivilCrossSectionNavigator.uuid, this);
  }

  /**
   * Sets the cross section plane based on the given curve mesh and point.
   *
   * @param curveMesh - The curve mesh to create the cross section from.
   * @param point - The point on the curve mesh where the cross section should be created.
   *
   * @throws Will throw an error if the world or plane is not set before calling this method.
   * @throws Will throw an error if the geometry is not indexed.
   *
   * @returns {Promise<void>}
   */
  async set(curveMesh: FRAGS.CurveMesh, point: THREE.Vector3) {
    if (!this.world || !this.plane) {
      throw new Error("You must set a world before using this component");
    }

    this.plane.enabled = true;

    const percentage = curveMesh.curve.getPercentageAt(point);
    if (percentage === null) return;
    const { startPoint, endPoint } = curveMesh.curve.getSegmentAt(percentage);

    if (curveMesh.geometry.index === null) {
      throw new Error("Geometry must be indexed!");
    }

    const direction = new THREE.Vector3();
    direction.subVectors(endPoint, startPoint);
    direction.normalize();

    this.plane.setFromNormalAndCoplanarPoint(direction, point);
    this.plane.edges.update();

    const transform = this.plane.helper.matrix.clone();
    transform.invert();

    const scene = this.world.scene.three;

    const edges = this.plane.edges.get();
    for (const styleName in edges) {
      const { mesh } = edges[styleName];
      mesh.position.set(0, 0, 0);
      mesh.rotation.set(0, 0, 0);
      mesh.updateMatrix();
      mesh.applyMatrix4(transform);
      if (mesh.parent !== scene) {
        scene.add(mesh);
      }
    }

    this.plane.enabled = false;
  }
}
