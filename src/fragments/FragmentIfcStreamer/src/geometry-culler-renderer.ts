import * as THREE from "three";
import { Event } from "../../../base-types";
import {
  CullerRenderer,
  CullerRendererSettings,
} from "../../../core/ScreenCuller/src";
import { Components } from "../../../core";
import { StreamedAsset, StreamedGeometries } from "./base-types";

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
  private _capacity = 1000;
  private _resizeStep = 1000;
  private _maxLostTime = 60000;
  private _maxHiddenTime = 10000;

  private _boundingBoxes: THREE.InstancedMesh;

  readonly onViewUpdated = new Event<{
    seen: { [modelID: string]: number[] };
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

    this._boundingBoxes = this.initializeBoundingBoxes();
    // this.components.scene.get().add(this._boundingBoxes);
    this.scene.add(this._boundingBoxes);

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

    const geometryTransform = new THREE.Matrix4();
    const globalTransform = new THREE.Matrix4();
    const translation = new THREE.Matrix4();
    const inverseTranslation = new THREE.Matrix4();
    const scale = new THREE.Matrix4();
    const tempColor = new THREE.Color();

    type NextColor = { r: number; g: number; b: number; code: string };
    const visitedGeometries = new Map<number, NextColor>();

    if (!this._boundingBoxes.instanceColor) {
      throw new Error("Error with boundinb box color");
    }

    for (const asset of assets) {
      for (const geometryData of asset.geometries) {
        if (this._boundingBoxes.count === this._capacity) {
          this.resizeBoundingBoxes();
        }

        const { geometryID, transformation, color } = geometryData;

        globalTransform.fromArray(transformation);
        const { boundingBox, hasHoles } = geometries[geometryID];

        geometryTransform.identity();
        const [minX, minY, minZ, maxX, maxY, maxZ] = Object.values(boundingBox);

        translation.makeTranslation(minX, minY, minZ);
        inverseTranslation.copy(translation).invert();

        const scaleX = Math.abs(maxX - minX);
        const scaleY = Math.abs(maxY - minY);
        const scaleZ = Math.abs(maxZ - minZ);

        scale.makeScale(scaleX, scaleY, scaleZ);

        geometryTransform.multiply(globalTransform);
        geometryTransform.multiply(translation);
        geometryTransform.multiply(scale);

        const count = this._boundingBoxes.count;
        this._boundingBoxes.setMatrixAt(count, geometryTransform);

        let nextColor: NextColor;
        if (visitedGeometries.has(geometryID)) {
          nextColor = visitedGeometries.get(geometryID) as NextColor;
        } else {
          nextColor = this.getNextColor();
          visitedGeometries.set(geometryID, nextColor);
        }

        const { r, g, b, code } = nextColor;

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

        tempColor.set(`rgb(${r}, ${g}, ${b})`);
        this._boundingBoxes.setColorAt(count, tempColor);
        this._boundingBoxes.count++;
      }
    }

    const { instanceMatrix, instanceColor } = this._boundingBoxes;
    instanceMatrix.needsUpdate = true;
    instanceColor.needsUpdate = true;
    THREE.ColorManagement.enabled = colorEnabled;
  }

  private handleWorkerMessage = async (event: MessageEvent) => {
    const colors = event.data.colors as Set<string>;

    const foundGeometries: { [modelID: string]: number[] } = {};
    const unFoundGeometries: { [modelID: string]: number[] } = {};
    let viewWasUpdated = false;

    const translucentFound = false;

    const boxesThatJustDissappeared = new Set(this._geometries.found.keys());

    for (const code of colors.values()) {
      if (this._geometries.toFind.has(code)) {
        // New geometry was found
        const found = this._geometries.toFind.get(code) as CullerBoundingBox;

        const modelID = this._indexModelID.get(found.modelIndex) as string;
        if (!foundGeometries[modelID]) {
          foundGeometries[modelID] = [];
        }
        foundGeometries[modelID].push(found.geometryID);
        viewWasUpdated = true;

        if (found.translucent) {
          this.setVisibility([found], false);
        }

        this._geometries.toFind.delete(code);
        this._geometries.found.set(code, found);
      } else if (this._geometries.found.has(code)) {
        // A box that was previously found is still visible
        boxesThatJustDissappeared.delete(code);

        const found = this._geometries.found.get(code) as CullerBoundingBox;
        if (found.translucent) {
          this.setVisibility([found], false);
        }
      } else if (this._geometries.lost.has(code)) {
        // We found back a lost box, put them back at the found group
        const found = this._geometries.lost.get(code) as CullerBoundingBox;
        found.lostTime = undefined;
        this._geometries.lost.delete(code);
        this._geometries.found.set(code, found);
      }
    }

    const now = performance.now();

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
      if (now - box.lostTime > this._maxLostTime) {
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

    if (viewWasUpdated) {
      await this.onViewUpdated.trigger({
        seen: foundGeometries,
        unseen: unFoundGeometries,
      });
    }

    // When we find a translucent bboxes, we hide them and then force a re-render
    // to reveal what's behind. We will make them visible again after its hidden
    // time expires.
    if (translucentFound) {
      await this.updateVisibility(true);
    }
  };

  private setVisibility(boxes: CullerBoundingBox[], visible: boolean) {
    const now = performance.now();
    const tempMatrix = new THREE.Matrix4();
    for (const box of boxes) {
      if (visible) {
        if (!box.transforms) {
          continue;
        }
        box.hiddenTime = undefined;
        for (let i = 0; i < box.indices.length; i++) {
          tempMatrix.fromArray(box.transforms[i]);
          this._boundingBoxes.setMatrixAt(box.indices[i], tempMatrix);
        }
        delete box.transforms;
      } else {
        box.hiddenTime = now;
        box.transforms = [];
        for (const index of box.indices) {
          this._boundingBoxes.getMatrixAt(index, tempMatrix);
          box.transforms.push([...tempMatrix.elements]);
          tempMatrix.makeScale(0, 0, 0);
          this._boundingBoxes.setMatrixAt(index, tempMatrix);
        }
      }
    }
    this._boundingBoxes.instanceMatrix.needsUpdate = true;
  }

  private resizeBoundingBoxes() {
    this._capacity += this._resizeStep;
    const { geometry, material } = this._boundingBoxes;
    this._boundingBoxes.removeFromParent();
    const newBoundingBox = new THREE.InstancedMesh(
      geometry,
      material,
      this._capacity
    );
    newBoundingBox.frustumCulled = false;
    this.initializeBboxColor(newBoundingBox);
    newBoundingBox.count = this._boundingBoxes.count;

    const { instanceMatrix, instanceColor } = this._boundingBoxes;
    if (!instanceColor) {
      throw new Error("Error with bounding box color!");
    }

    newBoundingBox.instanceMatrix = instanceMatrix.clone() as any;
    newBoundingBox.instanceColor = instanceColor.clone() as any;
    this._boundingBoxes.geometry = null as any;
    this._boundingBoxes.material = null as any;
    this._boundingBoxes.dispose();
    this._boundingBoxes = newBoundingBox;
    // this.components.scene.get().add(newBoundingBox);
    this.scene.add(newBoundingBox);
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

  private initializeBoundingBoxes() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    geometry.deleteAttribute("uv");
    const position = geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < position.length; i++) {
      position[i] += 0.5;
    }
    geometry.attributes.position.needsUpdate = true;

    const material = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 1,
    });

    const bbox = new THREE.InstancedMesh(geometry, material, this._capacity);
    bbox.frustumCulled = false;
    this.initializeBboxColor(bbox);
    bbox.count = 0;
    return bbox;
  }

  private initializeBboxColor(bbox: THREE.InstancedMesh) {
    const color = new THREE.Color("rgb(255, 0, 0)");
    for (let i = 0; i < bbox.count; i++) {
      bbox.setColorAt(i, color);
    }
  }

  // private handleWorkerMessage = async (event: MessageEvent) => {
  //   const colors = event.data.colors as Set<string>;
  // };
}
