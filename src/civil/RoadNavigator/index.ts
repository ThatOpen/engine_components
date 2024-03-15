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

  protected _curves = new Set<FRAGS.CivilCurve>();

  protected constructor(components: Components) {
    super(components);
    this.caster.params.Line = { threshold: 5 };
    this.scene = new Simple2DScene(this.components, false);
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

        if (!totalBBox.isEmpty()) {
          totalBBox.expandByObject(curve.mesh);
        } else {
          curve.mesh.geometry.computeBoundingBox();
          const cbox = curve.mesh.geometry.boundingBox;

          if (cbox instanceof THREE.Box3) {
            totalBBox.copy(cbox).applyMatrix4(curve.mesh.matrixWorld);
          }
        }
      }
    }
    await this.scene.controls.fitToBox(totalBBox, false);
  }

  clear() {
    for (const curve of this._curves) {
      curve.mesh.removeFromParent();
    }
    this._curves.clear();
  }
}
