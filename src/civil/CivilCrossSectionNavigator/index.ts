import * as THREE from "three";
import * as FRAGS from "bim-fragment";
import { Component, UI, UIElement } from "../../base-types";
import { FloatingWindow } from "../../ui";
import { Components, Simple2DScene, ToolComponent } from "../../core";
import { CivilFloatingWindow } from "../CivilFloatingWindow";
import { EdgesClipper, EdgesPlane } from "../../navigation";

export class CivilCrossSectionNavigator extends Component<any> implements UI {
  static readonly uuid = "96b2c87e-d90b-4639-8257-8f01136fe324" as const;

  scene: Simple2DScene;

  uiElement = new UIElement<{
    floatingWindow: FloatingWindow;
  }>();

  enabled = true;

  plane: EdgesPlane;

  constructor(components: Components) {
    super(components);
    this.scene = new Simple2DScene(components);
    this.setUI();

    this.components.tools.add(CivilCrossSectionNavigator.uuid, this);

    const clipper = components.tools.get(EdgesClipper);

    this.plane = clipper.createFromNormalAndCoplanarPoint(
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3()
    );

    this.plane.visible = false;
    this.plane.enabled = false;
  }

  get() {
    return null as any;
  }

  async set(curveMesh: FRAGS.CurveMesh, point: THREE.Vector3) {
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

    const scene = this.scene.get();

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

  private setUI() {
    const name = "Cross section";
    const floatingWindow = CivilFloatingWindow.get(
      this.components,
      this.scene,
      name
    );
    this.uiElement.set({ floatingWindow });
  }
}

ToolComponent.libraryUUIDs.add(CivilCrossSectionNavigator.uuid);
