import * as THREE from "three";
import * as FRAGS from "@thatopen/fragments";
import * as OBC from "@thatopen/components";
import { EdgesClipper, EdgesPlane } from "../../navigation";

export class CivilCrossSectionNavigator extends OBC.Component {
  static readonly uuid = "96b2c87e-d90b-4639-8257-8f01136fe324" as const;

  private _world: OBC.World | null = null;

  enabled = true;

  plane?: EdgesPlane;

  get world() {
    return this._world;
  }

  set world(world: OBC.World | null) {
    this._world = world;

    this.plane?.dispose();

    if (!world) {
      return;
    }

    const clipper = this.components.get(EdgesClipper);
    this.plane = clipper.createFromNormalAndCoplanarPoint(
      world,
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(),
    );
    this.plane.visible = false;
    this.plane.enabled = false;
  }

  constructor(components: OBC.Components) {
    super(components);
    this.components.add(CivilCrossSectionNavigator.uuid, this);
  }

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

    await this.plane.setFromNormalAndCoplanarPoint(direction, point);

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
