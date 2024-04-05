import * as THREE from "three";
import * as FRAGS from "bim-fragment";
import { Component, UI, UIElement } from "../../base-types";
import { FloatingWindow } from "../../ui";
import { Components, Simple2DScene, ToolComponent } from "../../core";
import { CivilFloatingWindow } from "../CivilFloatingWindow";
import { EdgesClipper, EdgesPlane } from "../../navigation";

export class RoadCrossSectionNavigator extends Component<any> implements UI {
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

    this.components.tools.add(RoadCrossSectionNavigator.uuid, this);

    const clipper = components.tools.get(EdgesClipper);

    this.plane = clipper.createFromNormalAndCoplanarPoint(
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3()
    );
  }

  get() {
    return null as any;
  }

  updateStyles() {
    const scene = this.scene.get();
    const edges = this.plane.edges.get();
    for (const styleName in edges) {
      const { mesh } = edges[styleName];
      scene.add(mesh);
    }
  }

  async set(curve: FRAGS.CurveMesh, point: THREE.Vector3, curveIndex: number) {
    if (curve.geometry.index === null) {
      throw new Error("Geometry must be indexed!");
    }

    const pos = curve.geometry.attributes.position.array;
    const index = curve.geometry.index.array;

    const start = index[curveIndex] * 3;
    const end = index[curveIndex + 1] * 3;

    const startX = pos[start];
    const startY = pos[start + 1];
    const startZ = pos[start + 2];

    const endX = pos[end];
    const endY = pos[end + 1];
    const endZ = pos[end + 2];

    const direction = new THREE.Vector3(
      endX - startX,
      endY - startY,
      endZ - startZ
    );
    direction.normalize();

    await this.plane.setFromNormalAndCoplanarPoint(direction, point);

    const transform = this.plane.helper.matrix.clone();
    transform.invert();

    const edges = this.plane.edges.get();
    for (const styleName in edges) {
      const { mesh } = edges[styleName];
      mesh.position.set(0, 0, 0);
      mesh.rotation.set(0, 0, 0);
      mesh.updateMatrix();
      mesh.applyMatrix4(transform);
    }
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

ToolComponent.libraryUUIDs.add(RoadCrossSectionNavigator.uuid);
