// TODO: Clean up and document

import { Disposable } from "../base-types";
import { FragmentManager } from "./index";

export interface ItemGroupSystems {
  [systemName: string]: { [groupName: string]: string[] };
}

export interface GroupSystems {
  [systemName: string]: { [groupName: string]: { [guid: string]: string[] } };
}

export class FragmentGrouper implements Disposable {
  groupSystems: GroupSystems = {
    category: {},
    floor: {},
  };

  private _fragments: FragmentManager;

  constructor(fragments: FragmentManager) {
    this._fragments = fragments;
  }

  dispose() {
    this.groupSystems = {};
  }

  add(guid: string, groupsSystems: ItemGroupSystems) {
    for (const system in groupsSystems) {
      if (!this.groupSystems[system]) {
        this.groupSystems[system] = {};
      }
      const existingGroups = this.groupSystems[system];
      const currentGroups = groupsSystems[system];
      for (const groupName in currentGroups) {
        if (!existingGroups[groupName]) {
          existingGroups[groupName] = {};
        }
        existingGroups[groupName][guid] = currentGroups[groupName];
      }
    }
  }

  setVisibility(systemName: string, groupName: string, visible: boolean) {
    const fragmentsMap = this.groupSystems[systemName][groupName];
    for (const fragmentId in fragmentsMap) {
      const fragment = this._fragments.list[fragmentId];
      const ids = fragmentsMap[fragmentId];
      fragment.setVisibility(ids, visible);
    }
  }

  remove(guid: string) {
    for (const systemName in this.groupSystems) {
      const system = this.groupSystems[systemName];
      for (const groupName in system) {
        const group = system[groupName];
        delete group[guid];
      }
    }
  }

  get(filter: { [name: string]: string }) {
    const size = Object.keys(filter).length;
    const models: { [fragmentGuid: string]: { [id: string]: number } } = {};
    for (const name in filter) {
      const value = filter[name];
      const found = this.groupSystems[name][value];
      if (found) {
        for (const guid in found) {
          if (!models[guid]) {
            models[guid] = {};
          }
          for (const id of found[guid]) {
            if (!models[guid][id]) {
              models[guid][id] = 1;
            } else {
              models[guid][id]++;
            }
          }
        }
      }
    }
    const result: { [fragmentGuid: string]: string[] } = {};
    for (const guid in models) {
      const model = models[guid];
      for (const id in model) {
        const numberOfMatches = model[id];
        if (numberOfMatches === size) {
          if (!result[guid]) {
            result[guid] = [];
          }
          result[guid].push(id);
        }
      }
    }
    return result;
  }
}
