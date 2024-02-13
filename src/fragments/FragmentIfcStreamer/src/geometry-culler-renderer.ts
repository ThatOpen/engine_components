import * as FRAGS from "bim-fragment";
import * as THREE from "three";
import { Event } from "../../../base-types";
import {
  CullerRenderer,
  CullerRendererSettings,
} from "../../../core/ScreenCuller/src";
import { Components } from "../../../core";
import { StreamedGeometries, StreamedAsset } from "./base-types";

type CullerBoundingBox = {
  modelIndex: number;
  geometryID: number;
  assetIDs: Set<number>;
  translucent: boolean;
  lostTime?: number;
  hiddenTime?: number;
};

/**
 * A renderer to determine a geometry visibility on screen
 */
export class GeometryCullerRenderer extends CullerRenderer {
  /* Pixels in screen a geometry must occupy to be considered "seen". */
  threshold = 400;

  boxes = new Map<number, FRAGS.Fragment>();

  private _geometry: THREE.BufferGeometry;
  private _material = new THREE.MeshBasicMaterial({
    transparent: true,
    opacity: 1,
  });

  private _maxLostTime = 30000;
  private _maxHiddenTime = 10000;

  private _lastUpdate = 0;

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

    this._geometry = new THREE.BoxGeometry(1, 1, 1);
    this._geometry.groups = [];
    this._geometry.deleteAttribute("uv");
    const position = this._geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < position.length; i++) {
      position[i] += 0.5;
    }
    this._geometry.attributes.position.needsUpdate = true;

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
    const modelIndex = this.createModelIndex(modelID);

    const colorEnabled = THREE.ColorManagement.enabled;
    THREE.ColorManagement.enabled = false;

    type NextColor = { r: number; g: number; b: number; code: string };
    const visitedGeometries = new Map<number, NextColor>();

    const tempMatrix = new THREE.Matrix4();

    const bboxes = new FRAGS.Fragment(this._geometry, this._material, 10);
    this.boxes.set(modelIndex, bboxes);
    this.scene.add(bboxes.mesh);

    const items = new Map<number, FRAGS.Item>();

    for (const asset of assets) {
      for (const geometryData of asset.geometries) {
        const { geometryID, transformation, color } = geometryData;

        const instanceID = this.getInstanceID(asset.id, geometryID);

        // if (geometryID !== 186) continue;

        const geometry = geometries[geometryID];
        if (!geometry) {
          throw new Error("Geometry not found!");
        }

        const { boundingBox, hasHoles } = geometry;

        // Get bounding box color

        let nextColor: NextColor;
        if (visitedGeometries.has(geometryID)) {
          nextColor = visitedGeometries.get(geometryID) as NextColor;
        } else {
          nextColor = this.getAvailableColor();
          visitedGeometries.set(geometryID, nextColor);
        }
        const { r, g, b, code } = nextColor;
        const threeColor = new THREE.Color();
        threeColor.setRGB(r / 255, g / 255, b / 255, "srgb");

        // Get bounding box transform

        const instanceMatrix = new THREE.Matrix4();
        const boundingBoxArray = Object.values(boundingBox);
        instanceMatrix.fromArray(transformation);
        tempMatrix.fromArray(boundingBoxArray);
        instanceMatrix.multiply(tempMatrix);

        if (items.has(instanceID)) {
          // This geometry exists multiple times in this asset
          const item = items.get(instanceID);
          if (item === undefined || !item.colors) {
            throw new Error("Malformed item!");
          }
          item.colors.push(threeColor);
          item.transforms.push(instanceMatrix);
        } else {
          // This geometry exists only once in this asset (for now)
          items.set(instanceID, {
            id: instanceID,
            colors: [threeColor],
            transforms: [instanceMatrix],
          });
        }

        const translucent = hasHoles || color[3] !== 1;

        if (!this._geometries.toFind.has(code)) {
          const assetIDs = new Set([asset.id]);
          this._geometries.toFind.set(code, {
            modelIndex,
            geometryID,
            translucent,
            assetIDs,
          });
        } else {
          const box = this._geometries.toFind.get(code) as CullerBoundingBox;
          // For simplicity, when a geometry is sometimes translucent, treat it
          // as if it was always translucent. Maybe this needs to be optimized
          box.translucent = box.translucent || translucent;
          box.assetIDs.add(asset.id);
        }
      }
    }

    const itemsArray = Array.from(items.values());
    bboxes.add(itemsArray);

    THREE.ColorManagement.enabled = colorEnabled;

    // const { geometry, material, count, instanceMatrix, instanceColor } = [
    //   ...this.boxes.values(),
    // ][0].mesh;
    // const mesh = new THREE.InstancedMesh(geometry, material, count);
    // mesh.instanceMatrix = instanceMatrix;
    // mesh.instanceColor = instanceColor;
    // this.components.scene.get().add(mesh);
  }

  applyTransformation(
    modelID: string,
    assets: StreamedAsset[],
    transform: THREE.Matrix4
  ) {
    const modelIndex = this._modelIDIndex.get(modelID);
    if (modelIndex === undefined) {
      throw new Error("Model not found!");
    }
    const bbox = this.boxes.get(modelIndex);
    if (bbox === undefined) {
      throw new Error("Bounding boxes not found!");
    }
    const ids = new Set<number>();
    for (const { id, geometries } of assets) {
      for (const { geometryID } of geometries) {
        const instanceID = this.getInstanceID(id, geometryID);
        ids.add(instanceID);
      }
    }
    bbox.applyTransform(ids, transform);
  }

  private handleWorkerMessage = async (event: MessageEvent) => {
    const colors = event.data.colors as Map<string, number>;

    const foundGeometries: { [modelID: string]: number[] } = {};
    const unFoundGeometries: { [modelID: string]: number[] } = {};
    let viewWasUpdated = false;

    let translucentExists = false;

    const boxesThatJustDissappeared = new Set(this._geometries.found.keys());

    const now = performance.now();

    for (const [code, pixels] of colors) {
      // Geometries that are too small in the screen to be considered found
      if (pixels < this.threshold) {
        continue;
      }

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
          translucentExists = true;
          this.setGeometryVisibility([found], false);
        }

        this._geometries.toFind.delete(code);
        this._geometries.found.set(code, found);
      } else if (this._geometries.found.has(code)) {
        const found = this._geometries.found.get(code) as CullerBoundingBox;

        // A box that was previously found is still visible
        boxesThatJustDissappeared.delete(code);

        if (found.translucent) {
          translucentExists = true;
          this.setGeometryVisibility([found], false);
        }
      } else if (this._geometries.lost.has(code)) {
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
        this.setGeometryVisibility([box], true);
      }
    }

    this._lastUpdate = now;

    if (viewWasUpdated) {
      await this.onViewUpdated.trigger({
        seen: foundGeometries,
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

  private setGeometryVisibility(
    geometries: CullerBoundingBox[],
    visible: boolean
  ) {
    for (const geometry of geometries) {
      const { modelIndex, geometryID, assetIDs } = geometry;
      const bbox = this.boxes.get(modelIndex);
      if (bbox === undefined) {
        throw new Error("Model not found!");
      }
      const instancesID = new Set<number>();
      for (const id of assetIDs) {
        const instanceID = this.getInstanceID(id, geometryID);
        instancesID.add(instanceID);
      }
      bbox.setVisibility(visible, instancesID);
      geometry.hiddenTime = visible ? undefined : performance.now();
    }
  }

  private createModelIndex(modelID: string) {
    if (this._modelIDIndex.has(modelID)) {
      throw new Error("Can't load the same model twice!");
    }
    const count = this._modelIDIndex.size;
    this._modelIDIndex.set(modelID, count);
    this._indexModelID.set(count, modelID);
    return count;
  }

  private getInstanceID(assetID: number, geometryID: number) {
    // src: https://stackoverflow.com/questions/14879691/get-number-of-digits-with-javascript
    // eslint-disable-next-line no-bitwise
    const size = (Math.log(geometryID) * Math.LOG10E + 1) | 0;
    const factor = 10 ** size;
    return assetID + geometryID / factor;
  }
}
