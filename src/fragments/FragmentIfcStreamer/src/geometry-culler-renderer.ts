import * as THREE from "three";
import { Event } from "../../../base-types";
import {
  CullerRenderer,
  CullerRendererSettings,
} from "../../../core/ScreenCuller/src";
import { Components } from "../../../core";
import { StreamedAsset, StreamedGeometries } from "./base-types";
import { BoundingBoxes } from "./bounding-boxes";

type CullerBoundingBox = {
  modelIndex: number;
  geometryID: number;
  indices: number[];
  translucent: boolean;
  transforms?: number[][];
  lostTime?: number;
  hiddenTime?: number;
};

/**
 * A renderer to determine a geometry visibility on screen
 */
export class GeometryCullerRenderer extends CullerRenderer {
  /* Pixels in screen a geometry must occupy to be considered "seen". */
  threshold = 400;

  private _maxLostTime = 30000;
  private _maxHiddenTime = 10000;
  private _lastUpdate = 0;

  private _boundingBoxes = new BoundingBoxes();

  readonly onViewUpdated = new Event<{
    seen: { [modelID: string]: number[] };
    hardlySeen: { [modelID: string]: number[] };
    unseen: { [modelID: string]: number[] };
  }>();

  private _modelIDIndex = new Map<string, number>();
  private _indexModelID = new Map<number, string>();

  private _geometries = {
    toFind: new Map() as Map<string, CullerBoundingBox>,
    found: new Map() as Map<string, CullerBoundingBox>,
    lost: new Map() as Map<string, CullerBoundingBox>,
  };

  constructor(components: Components, settings?: CullerRendererSettings) {
    super(components, settings);

    this.scene.add(this._boundingBoxes.mesh);
    // this.components.scene.get().add(this._boundingBoxes.mesh);

    this.worker.addEventListener("message", this.handleWorkerMessage);
    if (this.autoUpdate) {
      window.setInterval(this.updateVisibility, this.updateInterval);
    }
  }

  async dispose() {
    await super.dispose();
  }

  add(
    modelID: string,
    assets: StreamedAsset[],
    geometries: StreamedGeometries
  ): void {
    const modelIndex = this.getModelIndex(modelID);

    const colorEnabled = THREE.ColorManagement.enabled;
    THREE.ColorManagement.enabled = false;

    type NextColor = { r: number; g: number; b: number; code: string };
    const visitedGeometries = new Map<number, NextColor>();

    for (const asset of assets) {
      // if (asset.id !== 13365433) continue;

      for (const geometryData of asset.geometries) {
        const { geometryID, transformation, color } = geometryData;
        const { boundingBox, hasHoles } = geometries[geometryID];

        let nextColor: NextColor;
        if (visitedGeometries.has(geometryID)) {
          nextColor = visitedGeometries.get(geometryID) as NextColor;
        } else {
          nextColor = this.getNextColor();
          visitedGeometries.set(geometryID, nextColor);
        }
        const { r, g, b, code } = nextColor;

        const count = this._boundingBoxes.mesh.count;

        const colorArray = [r, g, b];
        const bbox = Object.values(boundingBox);
        this._boundingBoxes.add(bbox, transformation, colorArray);

        const translucent = hasHoles || color[3] !== 1;

        if (!this._geometries.toFind.has(code)) {
          this._geometries.toFind.set(code, {
            modelIndex,
            geometryID,
            translucent,
            indices: [count],
          });
        } else {
          const box = this._geometries.toFind.get(code) as CullerBoundingBox;
          box.indices.push(count);
          // For simplicity, when a geometry is sometimes translucent, treat it
          // as if it was always translucent. Maybe this needs to be optimized
          box.translucent = box.translucent || translucent;
        }
      }
    }

    this._boundingBoxes.update();
    THREE.ColorManagement.enabled = colorEnabled;
  }

  private handleWorkerMessage = async (event: MessageEvent) => {
    const colors = event.data.colors as Map<string, number>;

    const foundGeometries: { [modelID: string]: number[] } = {};
    const hardlyFoundGeometries: { [modelID: string]: number[] } = {};
    const unFoundGeometries: { [modelID: string]: number[] } = {};
    let viewWasUpdated = false;

    let translucentExists = false;

    const boxesThatJustDissappeared = new Set(this._geometries.found.keys());

    const now = performance.now();

    for (const [code, pixels] of colors) {
      const isHardlySeen = pixels < this.threshold;

      if (this._geometries.toFind.has(code)) {
        // New geometry was found
        const found = this._geometries.toFind.get(code) as CullerBoundingBox;

        const modelID = this._indexModelID.get(found.modelIndex) as string;

        const geoms = isHardlySeen ? hardlyFoundGeometries : foundGeometries;
        if (!geoms[modelID]) {
          geoms[modelID] = [];
        }
        geoms[modelID].push(found.geometryID);
        viewWasUpdated = true;

        // When a geometry is hardly seen, keep it in the "toFind" group
        // That way, we will be able to find it later again and
        // mark it as "found" if it's closer
        if (isHardlySeen) {
          continue;
        }

        if (found.translucent) {
          translucentExists = true;
          this.setVisibility([found], false);
        }

        this._geometries.toFind.delete(code);
        this._geometries.found.set(code, found);
      } else if (this._geometries.found.has(code)) {
        const found = this._geometries.found.get(code) as CullerBoundingBox;

        // A box that was previously found is now very far away
        // consider this geometry lost, so that the geometry can
        // get released in the future and substituted by a bbox
        if (isHardlySeen) {
          continue;
        }

        // A box that was previously found is still visible
        boxesThatJustDissappeared.delete(code);

        if (found.translucent) {
          translucentExists = true;
          this.setVisibility([found], false);
        }
      } else if (this._geometries.lost.has(code)) {
        // A box is too far away to be considered "found"
        if (isHardlySeen) {
          continue;
        }

        // We found back a lost box, put them back at the found group
        const found = this._geometries.lost.get(code) as CullerBoundingBox;
        found.lostTime = undefined;
        this._geometries.lost.delete(code);
        this._geometries.found.set(code, found);
      }
    }

    // Update previously found boxes that were just lost
    for (const code of boxesThatJustDissappeared) {
      const box = this._geometries.found.get(code);
      if (!box) continue;
      box.lostTime = now;
      this._geometries.found.delete(code);
      this._geometries.lost.set(code, box);
    }

    // Update lost boxes whose lost or hidden time has expired
    for (const [code, box] of this._geometries.lost) {
      if (!box || !box.lostTime) continue;

      // Make sure the box is not considered "lost" because the last update
      // was a long time ago
      const lastUpdateValid = now - this._lastUpdate < this._maxLostTime;

      if (lastUpdateValid && now - box.lostTime > this._maxLostTime) {
        // This box is not seen anymore, notify to remove from memory
        box.lostTime = undefined;
        box.hiddenTime = undefined;

        const modelID = this._indexModelID.get(box.modelIndex) as string;
        if (!unFoundGeometries[modelID]) {
          unFoundGeometries[modelID] = [];
        }
        unFoundGeometries[modelID].push(box.geometryID);
        viewWasUpdated = true;

        this._geometries.lost.delete(code);
        this._geometries.toFind.set(code, box);
      } else if (box.hiddenTime && now - box.hiddenTime > this._maxHiddenTime) {
        // This box was hidden for translucency and can be revealed again
        this.setVisibility([box], true);
      }
    }

    this._lastUpdate = now;

    if (viewWasUpdated) {
      await this.onViewUpdated.trigger({
        seen: foundGeometries,
        hardlySeen: hardlyFoundGeometries,
        unseen: unFoundGeometries,
      });
    }

    // When we find a translucent bboxes, we hide them and then force a re-render
    // to reveal what's behind. We will make them visible again after its hidden
    // time expires.
    if (translucentExists) {
      await this.updateVisibility(true);
    }
  };

  private setVisibility(boxes: CullerBoundingBox[], visible: boolean) {
    const now = performance.now();
    const tempMatrix = new THREE.Matrix4();
    const { mesh } = this._boundingBoxes;
    for (const box of boxes) {
      if (visible) {
        if (!box.transforms) {
          continue;
        }
        box.hiddenTime = undefined;
        for (let i = 0; i < box.indices.length; i++) {
          tempMatrix.fromArray(box.transforms[i]);
          mesh.setMatrixAt(box.indices[i], tempMatrix);
        }
        delete box.transforms;
      } else {
        box.hiddenTime = now;
        box.transforms = [];
        for (const index of box.indices) {
          mesh.getMatrixAt(index, tempMatrix);
          box.transforms.push([...tempMatrix.elements]);
          tempMatrix.makeScale(0, 0, 0);
          mesh.setMatrixAt(index, tempMatrix);
        }
      }
    }
    mesh.instanceMatrix.needsUpdate = true;
  }

  private getModelIndex(modelID: string) {
    if (this._modelIDIndex.has(modelID)) {
      throw new Error("Can't load the same model twice!");
    }
    const count = this._modelIDIndex.size;
    this._modelIDIndex.set(modelID, count);
    this._indexModelID.set(count, modelID);
    return count;
  }
}
