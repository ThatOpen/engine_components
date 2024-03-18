import * as THREE from "three";
import * as FRAGS from "bim-fragment";
import { FragmentsGroup } from "bim-fragment";
import { Component, Event } from "../../base-types";
import { Components, Simple2DScene } from "../../core";
import { CurveHighlighter } from "./src/curve-highlighter";

export abstract class RoadNavigator extends Component<any> {
  enabled = true;

  caster = new THREE.Raycaster();

  scene: Simple2DScene;

  abstract view: "horizontal" | "vertical";

  protected _curves = new Set<FRAGS.CivilCurve>();

  readonly onHighlight = new Event();
  highlighter: CurveHighlighter;

  protected constructor(components: Components) {
    super(components);
    this.caster.params.Line = { threshold: 5 };
    this.scene = new Simple2DScene(this.components, false);
    this.highlighter = new CurveHighlighter(this.scene.get());
  }

  get() {
    return null as any;
  }

  async draw(model: FragmentsGroup, ids?: Iterable<number>) {
    if (!model.civilData) {
      throw new Error("The provided model doesn't have civil data!");
    }
    const { alignments } = model.civilData;
    const allIDs = ids || alignments.keys();

    const scene = this.scene.get();

    const totalBBox: THREE.Box3 = new THREE.Box3();
    totalBBox.makeEmpty();
    totalBBox.min.set(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
    totalBBox.max.set(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE);

    for (const id of allIDs) {
      const alignment = alignments.get(id);
      if (!alignment) {
        throw new Error("Alignment not found!");
      }

      for (const curve of alignment[this.view]) {
        this._curves.add(curve);
        scene.add(curve.mesh);
        if (firstCurve) {
          const pos = curve.mesh.geometry.attributes.position.array;
          const [x, y, z] = pos;
          this.scene.controls.target.set(x, y, z);
          this.scene.camera.position.set(x, y, z + 10);
          firstCurve = false;
        }
      }
    }

    const curveMesh: THREE.Object3D[] = [];
    for (const curve of this._curves) {
      curveMesh.push(curve.mesh);
    }
    const mousePositionSphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.5),
      new THREE.MeshBasicMaterial({ color: 0xff0000 })
    );
    scene.add(mousePositionSphere);
    this.scene.uiElement
      .get("container")
      .domElement.addEventListener("mousemove", (event) => {
        const dom = this.scene.uiElement.get("container").domElement;
        const mouse = new THREE.Vector2();
        const rect = dom.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, this.scene.camera);
        const intersects = raycaster.intersectObjects(curveMesh);
        if (intersects.length > 0) {
          const intersect = intersects[0];
          const { point } = intersect;
          mousePositionSphere.position.copy(point);
        }
      });

    this.setupEvents();
  }

  setupEvents() {
    const curveMesh: THREE.Object3D[] = [];
    for (const curve of this._curves) {
      curveMesh.push(curve.mesh);
    }

    this.scene.uiElement
      .get("container")
      .domElement.addEventListener("click", (event) => {
        const dom = this.scene.uiElement.get("container").domElement;
        const mouse = new THREE.Vector2();
        const rect = dom.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, this.scene.camera);
        const intersects = raycaster.intersectObjects(curveMesh);
        if (intersects.length > 0) {
          const curve = intersects[0].object as THREE.LineSegments;
          this.onHighlight.trigger(curve);
        }
      });
  }

  dispose() {
    this.highlighter.dispose();
    this.clear();
    this.onHighlight.reset();
    this.caster = null as any;
    this.scene.dispose();
    this._curves = null as any;
  }

  clear() {
    for (const curve of this._curves) {
      curve.mesh.removeFromParent();
    }
    this._curves.clear();
  }
}
