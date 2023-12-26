import * as THREE from "three";
import { Event } from "../../../base-types";
import {
  CullerRenderer,
  CullerRendererSettings,
} from "../../../core/ScreenCuller/src";
import { Components } from "../../../core";
import { StreamedAsset, StreamedGeometries } from "./base-types";

/**
 * A renderer to determine a geometry visibility on screen
 */
export class GeometryCullerRenderer extends CullerRenderer {
  private _capacity = 1000;
  private _resizeStep = 1000;

  private _transparentBboxesReload = 30000;
  private _lastTransparentReload = 0;

  private _boundingBoxes: THREE.InstancedMesh;

  readonly onViewUpdated = new Event<{
    seen: { [modelID: string]: number[] };
    // unseen: Set<{ modelID: string; geometryID: number }>;
  }>();

  private _modelIDIndex = new Map<string, number>();
  private _indexModelID = new Map<number, string>();

  private _geometriesToFind = new Map<
    string,
    { modelIndex: number; geometryID: number }
  >();

  private _hiddenBBoxes = new Map<number, number[]>();
  private _translucentIndices = new Map<string, number[]>();

  // private _geometriesFound = new Map<
  //   string,
  //   { modelIndex: number; geometryID: number }
  // >();
  //
  // private _geometriesLost = new Map<
  //   string,
  //   { modelIndex: number; geometryID: number; time: number }
  // >();

  // private _whiteMaterial = new THREE.MeshBasicMaterial({ color: "white" });

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

        this._geometriesToFind.set(code, { modelIndex, geometryID });

        // Save translucent bboxes index so that we can hide them later
        const isTranslucent = hasHoles || color[3] !== 1;
        if (isTranslucent) {
          if (!this._translucentIndices.has(code)) {
            this._translucentIndices.set(code, []);
          }
          const colorMap = this._translucentIndices.get(code) as number[];
          colorMap.push(count);
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

    // Restore transparent bounding boxes that were hidden to reveal
    // the boxes that are behind
    const now = performance.now();
    if (now - this._lastTransparentReload > this._transparentBboxesReload) {
      const invisibleBoxes = Array.from(this._hiddenBBoxes.keys());
      this.setBoundingBoxesVisibility(invisibleBoxes, true);
      this._lastTransparentReload = now;
    }

    const foundGeometries: { [modelID: string]: number[] } = {};
    let viewWasUpdated = false;

    const translucentIndices: number[] = [];

    for (const code of colors.values()) {
      if (this._geometriesToFind.has(code)) {
        const found = this._geometriesToFind.get(code);

        if (!found) {
          throw new Error("Error with bounding box color map.");
        }

        const { modelIndex, geometryID } = found;
        const modelID = this._indexModelID.get(modelIndex);

        if (!modelID) {
          throw new Error("Error getting the modelID.");
        }

        if (!foundGeometries[modelID]) {
          foundGeometries[modelID] = [];
        }

        foundGeometries[modelID].push(geometryID);
        this._geometriesToFind.delete(code);
        viewWasUpdated = true;

        if (this._translucentIndices.has(code)) {
          const indices = this._translucentIndices.get(code) as number[];
          for (const index of indices) {
            translucentIndices.push(index);
          }
        }
      }
    }

    if (viewWasUpdated) {
      await this.onViewUpdated.trigger({ seen: foundGeometries });
    }

    // When we find a transparent bboxes, we hide them to reveal what's
    // behind. We will put them all back after some time
    if (translucentIndices.length) {
      this.setBoundingBoxesVisibility(translucentIndices, false);
      await this.updateVisibility(true);
    }
  };

  private setBoundingBoxesVisibility(indices: number[], visible: boolean) {
    const tempMatrix = new THREE.Matrix4();
    for (const index of indices) {
      if (visible) {
        if (!this._hiddenBBoxes.has(index)) {
          continue;
        }
        const transform = this._hiddenBBoxes.get(index) as number[];
        tempMatrix.fromArray(transform);
        this._boundingBoxes.setMatrixAt(index, tempMatrix);
        this._hiddenBBoxes.delete(index);
      } else {
        this._boundingBoxes.getMatrixAt(index, tempMatrix);
        this._hiddenBBoxes.set(index, [...tempMatrix.elements]);
        tempMatrix.makeScale(0, 0, 0);
        this._boundingBoxes.setMatrixAt(index, tempMatrix);
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
