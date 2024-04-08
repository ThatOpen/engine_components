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
  exists: boolean;
  time: number;
  hidden: boolean;
  fragment?: FRAGS.Fragment;
};

/**
 * A renderer to determine a geometry visibility on screen
 */
export class GeometryCullerRenderer extends CullerRenderer {
  /* Pixels in screen a geometry must occupy to be considered "seen". */
  threshold = 50;

  bboxThreshold = 200;

  maxLostTime = 30000;
  maxHiddenTime = 5000;

  boxes = new Map<number, FRAGS.Fragment>();

  useLowLod = false;

  lowLod = new Map<number, FRAGS.Fragment>();

  private _geometry: THREE.BufferGeometry;

  private _material = new THREE.MeshBasicMaterial({
    transparent: true,
    side: 2,
    opacity: 1,
  });

  private _lodMaterial = new THREE.MeshLambertMaterial();

  readonly onViewUpdated = new Event<{
    toLoad: { [modelID: string]: Map<number, Set<number>> };
    toRemove: { [modelID: string]: Set<number> };
    toHide: { [modelID: string]: Set<number> };
    toShow: { [modelID: string]: Set<number> };
  }>();

  private _modelIDIndex = new Map<string, number>();
  private _indexModelID = new Map<number, string>();
  private _nextModelID = 0;

  private _geometries = new Map<string, CullerBoundingBox>();
  private _geometriesGroups = new Map<number, THREE.Group>();
  private _foundGeometries = new Set<string>();

  private codes = new Map<number, Map<number, string>>();

  constructor(components: Components, settings?: CullerRendererSettings) {
    super(components, settings);

    this.updateInterval = 500;

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
    this.onViewUpdated.reset();

    this._lodMaterial.dispose();
    for (const [_id, fragment] of this.lowLod) {
      fragment.dispose(true);
    }
    this.lowLod.clear();

    for (const [_id, group] of this._geometriesGroups) {
      group.removeFromParent();
      const children = [...group.children];
      for (const child of children) {
        child.removeFromParent();
      }
    }
    this._geometriesGroups.clear();

    for (const [_id, frag] of this.boxes) {
      frag.dispose(true);
    }
    this.boxes.clear();

    for (const [_id, box] of this._geometries) {
      if (box.fragment) {
        box.fragment.dispose(true);
        box.fragment = undefined;
      }
    }
    this._geometries.clear();

    this._geometry.dispose();
    this._material.dispose();
    this._modelIDIndex.clear();
    this._indexModelID.clear();
    this.codes.clear();
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

    if (this.useLowLod) {
      const lowLod = new FRAGS.Fragment(this._geometry, this._lodMaterial, 10);
      this.lowLod.set(modelIndex, lowLod);
    }

    const fragmentsGroup = new THREE.Group();
    this.scene.add(fragmentsGroup);
    this._geometriesGroups.set(modelIndex, fragmentsGroup);

    const items = new Map<
      number,
      FRAGS.Item & { geometryColors: THREE.Color[] }
    >();

    for (const asset of assets) {
      // if (asset.id !== 664833) continue;
      for (const geometryData of asset.geometries) {
        const { geometryID, transformation, color } = geometryData;

        const geometryColor = new THREE.Color();
        geometryColor.setRGB(color[0], color[1], color[2], "srgb");

        const instanceID = this.getInstanceID(asset.id, geometryID);

        const geometry = geometries[geometryID];
        if (!geometry) {
          console.log(`Geometry not found: ${geometryID}`);
          continue;
        }

        const { boundingBox } = geometry;

        // Get bounding box color

        let nextColor: NextColor;
        if (visitedGeometries.has(geometryID)) {
          nextColor = visitedGeometries.get(geometryID) as NextColor;
        } else {
          nextColor = this.getAvailableColor();
          this.increaseColor();
          visitedGeometries.set(geometryID, nextColor);
        }
        const { r, g, b, code } = nextColor;
        const threeColor = new THREE.Color();
        threeColor.setRGB(r / 255, g / 255, b / 255, "srgb");

        // Save color code by model and geometry

        if (!this.codes.has(modelIndex)) {
          this.codes.set(modelIndex, new Map());
        }
        const map = this.codes.get(modelIndex) as Map<number, string>;
        map.set(geometryID, code);

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
          item.geometryColors.push(geometryColor);
          item.transforms.push(instanceMatrix);
        } else {
          // This geometry exists only once in this asset (for now)
          items.set(instanceID, {
            id: instanceID,
            colors: [threeColor],
            geometryColors: [geometryColor],
            transforms: [instanceMatrix],
          });
        }

        if (!this._geometries.has(code)) {
          const assetIDs = new Set([asset.id]);
          this._geometries.set(code, {
            modelIndex,
            geometryID,
            assetIDs,
            exists: false,
            hidden: false,
            time: 0,
          });
        } else {
          const box = this._geometries.get(code) as CullerBoundingBox;
          box.assetIDs.add(asset.id);
        }
      }
    }

    const itemsArray = Array.from(items.values());
    bboxes.add(itemsArray);

    if (this.useLowLod) {
      for (const item of itemsArray) {
        item.colors = item.geometryColors;
      }
      const lowLod = this.lowLod.get(modelIndex) as FRAGS.Fragment;
      lowLod.add(itemsArray);
    }

    THREE.ColorManagement.enabled = colorEnabled;

    // const { geometry, material, count, instanceMatrix, instanceColor } = [
    //   ...this.boxes.values(),
    // ][0].mesh;
    // const mesh = new THREE.InstancedMesh(geometry, material, count);
    // mesh.instanceMatrix = instanceMatrix;
    // mesh.instanceColor = instanceColor;
    // this.components.scene.get().add(mesh);
  }

  remove(modelID: string) {
    const index = this._modelIDIndex.get(modelID);
    if (index === undefined) {
      throw new Error("Model doesn't exist!");
    }

    const group = this._geometriesGroups.get(index) as THREE.Group;
    group.removeFromParent();
    const children = [...group.children];
    for (const child of children) {
      child.removeFromParent();
    }
    this._geometriesGroups.delete(index);

    const box = this.boxes.get(index) as FRAGS.Fragment;
    box.dispose(false);
    this.boxes.delete(index);

    const frag = this.lowLod.get(index) as FRAGS.Fragment;
    frag.dispose(false);
    this.lowLod.delete(index);

    const codes = this.codes.get(index) as Map<number, string>;
    this.codes.delete(index);
    for (const [_id, code] of codes) {
      const geometry = this._geometries.get(code);
      if (geometry && geometry.fragment) {
        geometry.fragment.dispose(false);
        geometry.fragment = undefined;
      }
      this._geometries.delete(code);
    }

    this._modelIDIndex.delete(modelID);
    this._indexModelID.delete(index);
    this._foundGeometries.clear();
  }

  addFragment(modelID: string, geometryID: number, frag: FRAGS.Fragment) {
    const colorEnabled = THREE.ColorManagement.enabled;
    THREE.ColorManagement.enabled = false;

    const modelIndex = this._modelIDIndex.get(modelID) as number;

    // Hide bounding box

    const map = this.codes.get(modelIndex) as Map<number, string>;
    const code = map.get(geometryID) as string;
    const geometry = this._geometries.get(code) as CullerBoundingBox;
    this.setGeometryVisibility(geometry, false, false);

    // Substitute it by fragment with same color

    if (!geometry.fragment) {
      geometry.fragment = new FRAGS.Fragment(
        frag.mesh.geometry,
        this._material,
        frag.capacity
      );

      const group = this._geometriesGroups.get(modelIndex);
      if (!group) {
        throw new Error("Group not found!");
      }

      group.add(geometry.fragment.mesh);
    }

    const [r, g, b] = code.split("-").map((value) => parseInt(value, 10));

    const items: FRAGS.Item[] = [];
    for (const itemID of frag.ids) {
      const item = frag.get(itemID);
      if (!item.colors) {
        throw new Error("Malformed fragments!");
      }
      for (const color of item.colors) {
        color.setRGB(r / 255, g / 255, b / 255, "srgb");
      }
      items.push(item);
    }

    geometry.fragment.add(items);

    THREE.ColorManagement.enabled = colorEnabled;

    this.needsUpdate = true;
  }

  removeFragment(modelID: string, geometryID: number) {
    const modelIndex = this._modelIDIndex.get(modelID) as number;

    const map = this.codes.get(modelIndex) as Map<number, string>;
    const code = map.get(geometryID) as string;
    const geometry = this._geometries.get(code) as CullerBoundingBox;
    if (!geometry.hidden) {
      this.setGeometryVisibility(geometry, true, false);
    }

    if (geometry.fragment) {
      const { fragment } = geometry;
      fragment.dispose(false);
      geometry.fragment = undefined;
    }
  }

  setModelTransformation(modelID: string, transform: THREE.Matrix4) {
    const modelIndex = this._modelIDIndex.get(modelID);
    if (modelIndex === undefined) {
      throw new Error("Model not found!");
    }
    const bbox = this.boxes.get(modelIndex);
    if (bbox) {
      bbox.mesh.position.set(0, 0, 0);
      bbox.mesh.rotation.set(0, 0, 0);
      bbox.mesh.scale.set(1, 1, 1);
      bbox.mesh.applyMatrix4(transform);
    }
    const group = this._geometriesGroups.get(modelIndex);
    if (group) {
      group.position.set(0, 0, 0);
      group.rotation.set(0, 0, 0);
      group.scale.set(1, 1, 1);
      group.applyMatrix4(transform);
    }
  }

  setVisibility(
    visible: boolean,
    modelID: string,
    geometryIDsAssetIDs: Map<number, Set<number>>
  ) {
    const modelIndex = this._modelIDIndex.get(modelID);
    if (modelIndex === undefined) {
      return;
    }
    for (const [geometryID, assets] of geometryIDsAssetIDs) {
      const map = this.codes.get(modelIndex);
      if (map === undefined) {
        throw new Error("Map not found!");
      }
      const code = map.get(geometryID) as string;
      const geometry = this._geometries.get(code);
      if (geometry === undefined) {
        throw new Error("Geometry not found!");
      }
      geometry.hidden = !visible;
      this.setGeometryVisibility(geometry, visible, true, assets);
    }
  }

  private setGeometryVisibility(
    geometry: CullerBoundingBox,
    visible: boolean,
    includeFragments: boolean,
    assets?: Iterable<number>
  ) {
    const { modelIndex, geometryID, assetIDs } = geometry;
    const bbox = this.boxes.get(modelIndex);
    if (bbox === undefined) {
      throw new Error("Model not found!");
    }
    const items = assets || assetIDs;

    if (includeFragments && geometry.fragment) {
      geometry.fragment.setVisibility(visible, items);
    } else {
      const instancesID = new Set<number>();
      for (const id of items) {
        const instanceID = this.getInstanceID(id, geometryID);
        instancesID.add(instanceID);
      }
      bbox.setVisibility(visible, instancesID);
    }
  }

  private handleWorkerMessage = async (event: MessageEvent) => {
    const colors = event.data.colors as Map<string, number>;

    const toLoad: { [modelID: string]: Map<number, Set<number>> } = {};

    const toRemove: { [modelID: string]: Set<number> } = {};
    const toHide: { [modelID: string]: Set<number> } = {};
    const toShow: { [modelID: string]: Set<number> } = {};

    const now = performance.now();
    let viewWasUpdated = false;

    const lodsToShow = new Set<CullerBoundingBox>();
    const lodsToHide = new Set<CullerBoundingBox>();

    let bboxAmount = 0;
    for (const [color, number] of colors) {
      if (number < this.threshold) {
        continue;
      }
      const found = this._geometries.get(color);
      if (!found) {
        continue;
      }
      const isBoundingBox = found.fragment === undefined;
      if (isBoundingBox) {
        bboxAmount += number;
      }
    }

    const lostGeometries = new Set(this._foundGeometries);

    for (const [color, number] of colors) {
      const geometry = this._geometries.get(color);
      if (!geometry) {
        continue;
      }
      const isFound = number > this.threshold;
      const { exists } = geometry;

      if (!isFound && !exists) {
        // Geometry doesn't exist and is not visible
        continue;
      }

      const modelID = this._indexModelID.get(geometry.modelIndex) as string;

      lostGeometries.delete(color);

      if (isFound && exists) {
        // Geometry was visible, and still is
        geometry.time = now;
        if (!toShow[modelID]) {
          toShow[modelID] = new Set();
        }
        toShow[modelID].add(geometry.geometryID);
        this._foundGeometries.add(color);
        viewWasUpdated = true;
        if (this.useLowLod) {
          lodsToHide.add(geometry);
        }
      } else if (isFound && !exists) {
        // New geometry found
        if (!toLoad[modelID]) {
          toLoad[modelID] = new Map();
        }
        geometry.time = now;
        geometry.exists = true;

        if (!toLoad[modelID].has(number)) {
          toLoad[modelID].set(number, new Set());
        }
        const set = toLoad[modelID].get(number) as Set<number>;
        set.add(geometry.geometryID);
        this._foundGeometries.add(color);
        viewWasUpdated = true;

        if (this.useLowLod) {
          lodsToHide.add(geometry);
        }
      } else if (!isFound && exists) {
        // Geometry is hardly seen, so it can be considered lost
        if (bboxAmount < this.bboxThreshold) {
          // When too many bounding boxes on sight
          // don't hide / destroy geometry to prevent flickering
          this.handleLostGeometries(now, color, geometry, toRemove, toHide);
          if (this.useLowLod) {
            lodsToShow.add(geometry);
          }
          viewWasUpdated = true;
        }
      }
    }

    if (bboxAmount <= this.bboxThreshold) {
      // When too many bounding boxes on sight
      // don't hide / destroy geometry to prevent flickering
      for (const color of lostGeometries) {
        const geometry = this._geometries.get(color);
        if (!geometry) {
          throw new Error("Geometry not found!");
        }
        this.handleLostGeometries(now, color, geometry, toRemove, toHide);
        if (this.useLowLod) {
          lodsToShow.add(geometry);
        }
        viewWasUpdated = true;
      }
    }

    if (viewWasUpdated) {
      await this.onViewUpdated.trigger({ toLoad, toRemove, toHide, toShow });
    }

    if (this.useLowLod) {
      for (const geometry of lodsToShow) {
        this.setLodVisibility(true, geometry);
      }
      for (const geometry of lodsToHide) {
        this.setLodVisibility(false, geometry);
      }
    }

    if (bboxAmount > this.bboxThreshold) {
      this.needsUpdate = true;
    }
  };

  private handleLostGeometries(
    now: number,
    color: string,
    geometry: CullerBoundingBox,
    toRemove: {
      [p: string]: Set<number>;
    },
    toHide: { [p: string]: Set<number> }
  ) {
    const modelID = this._indexModelID.get(geometry.modelIndex) as string;
    const lostTime = now - geometry.time;
    if (lostTime > this.maxLostTime) {
      // This geometry was lost too long - delete it
      if (!toRemove[modelID]) {
        toRemove[modelID] = new Set();
      }
      geometry.exists = false;
      toRemove[modelID].add(geometry.geometryID);
      this._foundGeometries.delete(color);
    } else if (lostTime > this.maxHiddenTime) {
      // This geometry was lost for a while - hide it
      if (!toHide[modelID]) {
        toHide[modelID] = new Set();
      }
      toHide[modelID].add(geometry.geometryID);
    }
  }

  private setLodVisibility(visible: boolean, geometry: CullerBoundingBox) {
    const lod = this.lowLod.get(geometry.modelIndex) as FRAGS.Fragment;
    for (const assetID of geometry.assetIDs) {
      const instanceID = this.getInstanceID(assetID, geometry.geometryID);
      lod.setVisibility(visible, [instanceID]);
    }
  }

  private createModelIndex(modelID: string) {
    if (this._modelIDIndex.has(modelID)) {
      throw new Error("Can't load the same model twice!");
    }
    const count = this._nextModelID;
    this._nextModelID++;
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
