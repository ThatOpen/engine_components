import { Disposable } from "../../base-types";
import { Component } from "../../base-types/component";
import { Components } from "../../core/Components";
import { FragmentManager } from "../FragmentManager";

// TODO: Clean up and document

export interface ItemGroupSystems {
  [systemName: string]: { [groupName: string]: string[] };
}

export interface GroupSystems {
  [systemName: string]: { [groupName: string]: { [guid: string]: string[] } };
}

export class FragmentGrouper
  extends Component<GroupSystems>
  implements Disposable
{
  private _groupSystems: GroupSystems = { models: {} };
  /** {@link Component.name} */
  name = "FragmentGrouper";

  /** {@link Component.enabled} */
  enabled = true;

  private _fragmentManager: FragmentManager;

  // @ts-ignore
  private _components: Components;

  constructor(components: Components, fragmentManager: FragmentManager) {
    super();
    this._components = components;
    this._fragmentManager = fragmentManager;
  }

  /** {@link Component.get} */
  get(): GroupSystems {
    return this._groupSystems;
  }

  dispose() {
    this._groupSystems = {};
  }

  add(guid: string, groupsSystems: ItemGroupSystems) {
    for (const system in groupsSystems) {
      if (!this._groupSystems[system]) {
        this._groupSystems[system] = {};
      }
      const existingGroups = this._groupSystems[system];
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
    const fragmentsMap = this._groupSystems[systemName][groupName];
    for (const fragmentId in fragmentsMap) {
      const fragment = this._fragmentManager.list[fragmentId];
      const ids = fragmentsMap[fragmentId];
      fragment.setVisibility(ids, visible);
    }
  }

  remove(guid: string) {
    for (const systemName in this._groupSystems) {
      const system = this._groupSystems[systemName];
      for (const groupName in system) {
        const group = system[groupName];
        delete group[guid];
      }
    }
  }

  find(filter: { [name: string]: string }) {
    const size = Object.keys(filter).length;
    const models: { [fragmentGuid: string]: { [id: string]: number } } = {};
    for (const name in filter) {
      const value = filter[name];
      const found = this._groupSystems[name][value];
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
