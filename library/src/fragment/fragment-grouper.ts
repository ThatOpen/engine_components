import { Fragments } from './fragment';

export interface ItemGroupSystems {
  [systemName: string]: { [groupName: string]: string[] };
}

export interface GroupSystems {
  [systemName: string]: { [groupName: string]: { [guid: string]: string[] } };
}

export class FragmentGrouper {
  groupSystems: GroupSystems = {
    category: {},
    floor: {},
  };

  fragments: Fragments

  constructor(fragments: Fragments) {
    this.fragments = fragments
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
    const fragmentsMap = this.groupSystems[systemName][groupName]
    for (const fragmentId in fragmentsMap) {
      const fragment = this.fragments.fragments[fragmentId]
      const ids = fragmentsMap[fragmentId]
      fragment.setVisibility(ids, visible)
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
    const models: { [fragmentGuid: string]: string[] } = {};
    for (const name in filter) {
      const value = filter[name];
      const found = this.groupSystems[name][value];
      if (found) {
        for (const guid in found) {
          if (!models[guid]) {
            models[guid] = [];
          }
          models[guid].push(...found[guid]);
        }
      }
    }
    return models;
  }

  /**
   * @description Takes two filters to find the matching groups and return the common fragmentIds and items in them.
   */
  intersectGroups(filterA: {[systemName: string]: string}, filterB: {[systemName: string]: string}) {
      const groupA = this.get(filterA)
      const groupB = this.get(filterB)
      const intersection: {[fragmentId: string]: string[]} = {}
      for (const fragmentId in groupA) {
          const itemsB = groupB[fragmentId]
          if (!itemsB) {continue}
          const itemsA = groupA[fragmentId]
          intersection[fragmentId] = [...new Set([...itemsA, ...itemsB])]
      }
      return intersection
  }

  update(_delta: number): void {}
}
