import * as THREE from "three";
import * as FRAGS from "bim-fragment";
import { FragmentsGroup } from "bim-fragment";
import { Component } from "../../base-types";
import { Components, Simple2DScene } from "../../core";

export abstract class RoadNavigator extends Component<any> {
  enabled = true;

  caster = new THREE.Raycaster();

  scene: Simple2DScene;

  abstract view: "horizontal" | "vertical";

  private totalBBox: THREE.Box3 = new THREE.Box3();

  protected _curves = new Set<FRAGS.CivilCurve>();

  protected constructor(components: Components) {
    super(components);
    this.caster.params.Line = { threshold: 5 };
    this.scene = new Simple2DScene(this.components, false);
  }

  get() {
    return null as any;
  }

  draw(model: FragmentsGroup, ids?: Iterable<number>) {
    if (!model.civilData) {
      throw new Error("The provided model doesn't have civil data!");
    }
    const { alignments } = model.civilData;
    const allIDs = ids || alignments.keys();

    const scene = this.scene.get();
    this.totalBBox.makeEmpty();

    for (const id of allIDs) {
      const alignment = alignments.get(id);
      if (!alignment) {
        throw new Error("Alignment not found!");
      }

      let firstCurve = true;

      for (const curve of alignment[this.view]) {
        this._curves.add(curve);
        scene.add(curve.mesh);

        if (firstCurve) {
          const pos = curve.mesh.geometry.attributes.position.array;
          const [x, y, z] = pos;
          this.scene.controls.setTarget(x, y, z);
          this.scene.camera.position.set(x, y, z + 10);
          firstCurve = false;
        }
      }
    }
    this.totalBBox.min.x = Number.MAX_VALUE;
    this.totalBBox.min.y = Number.MAX_VALUE;
    this.totalBBox.min.z = Number.MAX_VALUE;
    this.totalBBox.max.x = -Number.MAX_VALUE;
    this.totalBBox.max.y = -Number.MAX_VALUE;
    this.totalBBox.max.z = -Number.MAX_VALUE;
    for (const curve of this._curves) {
      curve.mesh.geometry.computeBoundingBox();
      const cbox = curve.mesh.geometry.boundingBox;
      if (!(cbox instanceof THREE.Box3)) {
        return;
      }
      const max = cbox.max.clone().applyMatrix4(curve.mesh.matrixWorld);
      const min = cbox.min.clone().applyMatrix4(curve.mesh.matrixWorld);
      if (min instanceof THREE.Vector3 && max instanceof THREE.Vector3) {
        if (max.x > this.totalBBox.max.x) this.totalBBox.max.x = min.x;
        if (max.y > this.totalBBox.max.y) this.totalBBox.max.y = max.y;
        if (min.x < this.totalBBox.min.x) this.totalBBox.min.x = min.x;
        if (min.y < this.totalBBox.min.y) this.totalBBox.min.y = max.y;
      }
    }
  }

  getTotalBBox(): THREE.Box3 {
    return this.totalBBox;
  }

  clear() {
    for (const curve of this._curves) {
      curve.mesh.removeFromParent();
    }
    this._curves.clear();
  }
}
