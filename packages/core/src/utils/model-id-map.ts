import { ModelIdMap } from "../fragments";

/**
 * Utility class for manipulating and managing `ModelIdMap` objects. A `ModelIdMap` is a mapping of model identifiers (strings) to sets of local IDs (numbers). This class provides methods for joining, intersecting, cloning, adding, removing, and comparing `ModelIdMap` objects, as well as converting between `ModelIdMap` and plain JavaScript objects.
 */
export class ModelIdMapUtils {
  /**
   * Creates a new ModelIdMap from the union of multiple ModelIdMaps.
   * @param maps - An array of ModelIdMaps to join.
   * @returns A new ModelIdMap containing all model identifiers and localIds from all input maps.
   */
  static join(maps: ModelIdMap[]) {
    const result: ModelIdMap = {};

    for (const map of maps) {
      for (const modelID in map) {
        if (!result[modelID]) {
          result[modelID] = new Set(map[modelID]);
        } else {
          for (const id of map[modelID]) {
            result[modelID].add(id);
          }
        }
      }
    }

    return result;
  }

  /**
   * Creates a new ModelIdMap from the intersection of multiple ModelIdMaps.
   * @param maps - An array of ModelIdMaps.
   * @returns A new ModelIdMap containing only model identifiers and localIds present in all input maps.
   */
  static intersect(maps: ModelIdMap[]) {
    if (maps.length === 0) {
      return {};
    }

    let result = ModelIdMapUtils.clone(maps[0]);

    for (let i = 1; i < maps.length; i++) {
      const currentMap = maps[i];
      const newResult: ModelIdMap = {};

      for (const modelID in result) {
        if (currentMap[modelID]) {
          const intersection = new Set<number>();
          for (const id of result[modelID]) {
            if (currentMap[modelID].has(id)) {
              intersection.add(id);
            }
          }
          if (intersection.size > 0) {
            newResult[modelID] = intersection;
          }
        }
      }
      result = newResult;
    }

    return result;
  }

  /**
   * Creates a deep clone of a ModelIdMap.
   * @param source - The ModelIdMap to clone.
   * @returns A new ModelIdMap with the same model identifiers and localIds as the original.
   */
  static clone(source: ModelIdMap) {
    const clone: ModelIdMap = {};

    for (const modelID in source) {
      clone[modelID] = new Set(source[modelID]);
    }

    return clone;
  }

  /**
   * Remove all entries from one ModelIdMap to another.
   * @param target - The ModelIdMap to subtract from.
   * @param source - The ModelIdMap to subtract.
   */
  static remove(target: ModelIdMap, source: ModelIdMap, clone = false) {
    if (clone) target = ModelIdMapUtils.clone(target);
    for (const modelID in source) {
      if (target[modelID]) {
        for (const id of source[modelID]) {
          target[modelID].delete(id);
        }
        if (target[modelID].size === 0) {
          delete target[modelID];
        }
      }
    }
  }

  /**
   * Adds all entries from one ModelIdMap to another.
   * @param target - The ModelIdMap to add to.
   * @param source - The ModelIdMap to add from.
   */
  static add(target: ModelIdMap, source: ModelIdMap, clone = false) {
    if (clone) target = ModelIdMapUtils.clone(target);
    for (const modelID in source) {
      if (!target[modelID]) {
        target[modelID] = new Set(source[modelID]);
      } else {
        for (const id of source[modelID]) {
          target[modelID].add(id);
        }
      }
    }
  }

  static append(target: ModelIdMap, modelId: string, ...localIds: number[]) {
    let values = target[modelId];
    if (!values) {
      values = new Set();
      target[modelId] = values;
    }
    for (const localId of localIds) {
      values.add(localId);
    }
  }

  /**
   * Checks if two ModelIdMaps are equal.
   * @param a - The first ModelIdMap.
   * @param b - The second ModelIdMap.
   * @returns True if the ModelIdMaps are equal, false otherwise.
   */
  static isEqual(a: ModelIdMap, b: ModelIdMap) {
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);

    if (aKeys.length !== bKeys.length) {
      return false;
    }

    for (const modelID of aKeys) {
      if (!b[modelID]) {
        return false;
      }

      if (a[modelID].size !== b[modelID].size) {
        return false;
      }

      for (const id of a[modelID]) {
        if (!b[modelID].has(id)) {
          return false;
        }
      }
    }

    return true;
  }

  /**
   * Checks if a ModelIdMap is empty.
   * @param map - The ModelIdMap to check.
   * @returns True if the ModelIdMap is empty, false otherwise.
   */
  static isEmpty(map: ModelIdMap) {
    const totalItems = Object.values(map).reduce(
      (sum, set) => sum + set.size,
      0,
    );
    return totalItems === 0;
  }

  /**
   * Converts a ModelIdMap into a plain JavaScript object with array values.
   * @param map - The ModelIdMap to convert.
   * @returns A plain JavaScript object where each key (model ID) maps to an array of local IDs.
   */
  static toRaw(map: ModelIdMap) {
    const result: { [modelID: string]: number[] } = {};

    for (const modelID in map) {
      result[modelID] = Array.from(map[modelID]);
    }

    return result;
  }

  /**
   * Creates a ModelIdMap from a plain JavaScript object with array values.
   * @param raw - A plain JavaScript object where each key (model ID) maps to an array of local IDs.
   * @returns A ModelIdMap.
   */
  static fromRaw(raw: { [modelID: string]: number[] }) {
    const result: ModelIdMap = {};

    for (const modelID in raw) {
      result[modelID] = new Set(raw[modelID]);
    }

    return result;
  }
}
