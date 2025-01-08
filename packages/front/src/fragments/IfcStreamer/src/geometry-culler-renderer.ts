import * as FRAGS from "@thatopen/fragments";
import * as THREE from "three";
import * as OBC from "@thatopen/components";

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
export class GeometryCullerRenderer extends OBC.CullerRenderer {
  /* Pixels in screen a geometry must occupy to be considered "seen". */
  threshold = 50;

  bboxThreshold = 200;

  maxLostTime = 30000;
  maxHiddenTime = 5000;

  boxes = new Map<number, FRAGS.Fragment>();

  private _staticGeometries: {
    culled: { [modelID: string]: Set<number> };
    unculled: { [modelID: string]: Set<number> };
  } = { culled: {}, unculled: {} };

  private readonly _geometry: THREE.BufferGeometry;

  private _material = new THREE.MeshBasicMaterial({
    transparent: true,
    side: 2,
    opacity: 1,
  });

  readonly onViewUpdated = new OBC.AsyncEvent<{
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
  private _geometriesInMemory = new Set<string>();
  private _intervalID: number | null = null;

  private codes = new Map<number, Map<number, string>>();

  constructor(components: OBC.Components, world: OBC.World) {
    super(components, world);

    this.config.updateInterval = 500;

    this._geometry = new THREE.BoxGeometry(1, 1, 1);
    this._geometry.groups = [];
    this._geometry.deleteAttribute("uv");
    const position = this._geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < position.length; i++) {
      position[i] += 0.5;
    }
    this._geometry.attributes.position.needsUpdate = true;

    this.worker.addEventListener("message", this.handleWorkerMessage);
  }

  dispose() {
    super.dispose();
    this.onViewUpdated.reset();

    if (this._intervalID !== null) {
      window.clearInterval(this._intervalID);
      this._intervalID = null;
    }

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

    this._staticGeometries = { culled: {}, unculled: {} };

    this._geometry.dispose();
    this._material.dispose();
    this._modelIDIndex.clear();
    this._indexModelID.clear();
    this.codes.clear();
  }

  add(
    modelID: string,
    assets: OBC.StreamedAsset[],
    geometries: OBC.StreamedGeometries,
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

    const fragmentsGroup = new THREE.Group();
    this.scene.add(fragmentsGroup);
    this._geometriesGroups.set(modelIndex, fragmentsGroup);

    const items = new Map<
      number,
      FRAGS.Item & { geometryColors: THREE.Color[] }
    >();

    for (const asset of assets) {
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
    this._geometriesInMemory.clear();
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
        frag.capacity,
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

  // TODO: Is this neccesary anymore?
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
    geometryIDsAssetIDs: Map<number, Set<number>>,
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

  updateTransformations(modelID: string) {
    const key = this._modelIDIndex.get(modelID);
    if (key === undefined) return;
    const fragments = this.components.get(OBC.FragmentsManager);
    const originalModel = fragments.groups.get(modelID);
    if (originalModel) {
      originalModel.updateWorldMatrix(true, false);
      originalModel.updateMatrix();
      const bboxes = this.boxes.get(key);
      if (bboxes) {
        bboxes.mesh.position.set(0, 0, 0);
        bboxes.mesh.rotation.set(0, 0, 0);
        bboxes.mesh.scale.set(1, 1, 1);
        bboxes.mesh.updateMatrix();
        bboxes.mesh.applyMatrix4(originalModel.matrixWorld);
        bboxes.mesh.updateMatrix();
      }

      const group = this._geometriesGroups.get(key);
      if (group) {
        group.position.set(0, 0, 0);
        group.rotation.set(0, 0, 0);
        group.scale.set(1, 1, 1);
        group.updateMatrix();
        group.applyMatrix4(originalModel.matrixWorld);
        group.updateMatrix();
      }
    }
  }

  async addStaticGeometries(
    geometries: { [modelID: string]: Set<number> },
    culled = true,
  ) {
    const event = {
      data: {
        colors: new Map<string, number>(),
      },
    };
    const dummyPixelValue = this.threshold + 1000;

    for (const modelID in geometries) {
      const modelKey = this._modelIDIndex.get(modelID);
      if (modelKey === undefined) {
        continue;
      }
      const map = this.codes.get(modelKey);
      if (!map) {
        continue;
      }

      const geometryIDs = geometries[modelID];

      for (const geometryID of geometryIDs) {
        const colorCode = map.get(geometryID);
        if (!colorCode) {
          continue;
        }

        const geometry = this._geometries.get(colorCode);
        if (!geometry) {
          continue;
        }

        geometry.exists = true;
        if (!culled) {
          // Static unculled geometries are always visible
          geometry.hidden = false;
          geometry.time = performance.now();
          event.data.colors.set(colorCode, dummyPixelValue);
        }

        this._geometriesInMemory.add(colorCode);

        const statics = culled
          ? this._staticGeometries.culled
          : this._staticGeometries.unculled;

        if (!statics[modelID]) {
          statics[modelID] = new Set();
        }

        statics[modelID].add(geometryID);
      }
    }

    if (!culled) {
      // If unculled, we'll make these geometries visible by forcing its discovery
      await this.handleWorkerMessage(event as any);
    }
  }

  removeStaticGeometries(
    geometries: { [modelID: string]: Set<number> },
    culled?: boolean,
  ) {
    const options: ("culled" | "unculled")[] = [];
    if (culled === undefined) {
      options.push("culled", "unculled");
    } else if (culled === true) {
      options.push("culled");
    } else {
      options.push("unculled");
    }

    for (const modelID in geometries) {
      const geometryIDs = geometries[modelID];
      for (const option of options) {
        const set = this._staticGeometries[option][modelID];
        if (set) {
          for (const geometryID of geometryIDs) {
            set.delete(geometryID);
          }
        }
      }
    }
  }

  cancel(items: { [modelID: string]: Set<number> }) {
    for (const modelID in items) {
      const modelIndex = this._modelIDIndex.get(modelID);
      if (modelIndex === undefined) {
        throw new Error("Model not found.");
      }
      const map = this.codes.get(modelIndex);
      if (map === undefined) {
        throw new Error("Codes not found.");
      }
      for (const id of items[modelID]) {
        const colorCode = map.get(id);
        if (colorCode === undefined) {
          throw new Error("Color code not found.");
        }
        this._geometriesInMemory.delete(colorCode);
        const found = this._geometries.get(colorCode);
        if (!found) {
          throw new Error("Geometry not found.");
        }
        found.exists = false;
      }
    }
  }

  getBoundingBoxes(items: { [modelID: number]: Iterable<number> }) {
    const boxGroup = new FRAGS.FragmentsGroup();
    for (const modelID in items) {
      const ids = items[modelID];
      const modelIndex = this._modelIDIndex.get(modelID);
      if (modelIndex === undefined) {
        continue;
      }
      const bboxes = this.boxes.get(modelIndex);
      if (!bboxes) {
        continue;
      }
      const clone = bboxes.clone(ids);
      boxGroup.add(clone.mesh);
      boxGroup.items.push(clone);
    }
    return boxGroup;
  }

  getInstanceID(assetID: number, geometryID: number) {
    // src: https://stackoverflow.com/questions/14879691/get-number-of-digits-with-javascript
    // eslint-disable-next-line no-bitwise
    const size = (Math.log(geometryID) * Math.LOG10E + 1) | 0;
    const factor = 10 ** size;
    return assetID + geometryID / factor;
  }

  private setGeometryVisibility(
    geometry: CullerBoundingBox,
    visible: boolean,
    includeFragments: boolean,
    assets?: Iterable<number>,
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

    // We can only lose geometries that were previously found
    const lostGeometries = new Set(this._geometriesInMemory);

    for (const [color, number] of colors) {
      const geometry = this._geometries.get(color);
      if (!geometry) {
        continue;
      }

      const isGeometryBigEnough = number > this.threshold;
      if (!isGeometryBigEnough) {
        continue;
      }

      // The geometry is big enough to be considered seen, so remove it
      // from the geometries to be considered lost
      lostGeometries.delete(color);

      const { exists } = geometry;
      const modelID = this._indexModelID.get(geometry.modelIndex) as string;

      if (exists) {
        // Geometry was present in memory, and still is, so show it
        geometry.time = now;
        if (!toShow[modelID]) {
          toShow[modelID] = new Set();
        }
        toShow[modelID].add(geometry.geometryID);
        this._geometriesInMemory.add(color);
        viewWasUpdated = true;
      } else {
        // New geometry found that is not in memory
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
        this._geometriesInMemory.add(color);
        viewWasUpdated = true;
      }
    }

    // Handle geometries that were lost
    for (const color of lostGeometries) {
      const geometry = this._geometries.get(color);
      if (geometry) {
        this.handleLostGeometries(now, color, geometry, toRemove, toHide);
        viewWasUpdated = true;
      }
    }

    if (viewWasUpdated) {
      await this.onViewUpdated.trigger({ toLoad, toRemove, toHide, toShow });
    }

    this._isWorkerBusy = false;
  };

  private handleLostGeometries(
    now: number,
    color: string,
    geometry: CullerBoundingBox,
    toRemove: {
      [p: string]: Set<number>;
    },
    toHide: { [p: string]: Set<number> },
  ) {
    const modelID = this._indexModelID.get(geometry.modelIndex) as string;
    const lostTime = now - geometry.time;

    const { culled, unculled } = this._staticGeometries;

    if (lostTime > this.maxLostTime) {
      // This geometry was lost too long - delete it

      // If it's any kind of static geometry, skip it
      if (
        culled[modelID]?.has(geometry.geometryID) ||
        unculled[modelID]?.has(geometry.geometryID)
      ) {
        return;
      }

      if (!toRemove[modelID]) {
        toRemove[modelID] = new Set();
      }
      geometry.exists = false;
      toRemove[modelID].add(geometry.geometryID);
      this._geometriesInMemory.delete(color);
    } else if (lostTime > this.maxHiddenTime) {
      // If it's an unculled static geometry, skip it
      if (unculled[modelID]?.has(geometry.geometryID)) {
        return;
      }

      // This geometry was lost for a while - hide it
      if (!toHide[modelID]) {
        toHide[modelID] = new Set();
      }
      toHide[modelID].add(geometry.geometryID);
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
}
