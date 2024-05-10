import * as THREE from "three";
import * as FRAGS from "@thatopen/fragments";
import { Disposable, Component, Event, Components } from "../../core";
import { IfcCategoryMap, IfcPropertiesUtils } from "../../ifc";

import { FragmentManager } from "../FragmentManager";

// TODO: Clean up and document

export interface Classification {
  [system: string]: {
    [className: string]: FRAGS.FragmentIdMap;
  };
}

export class FragmentClassifier extends Component implements Disposable {
  static readonly uuid = "e25a7f3c-46c4-4a14-9d3d-5115f24ebeb7" as const;

  /** {@link Component.enabled} */
  enabled = true;

  list: Classification = {};

  /** {@link Disposable.onDisposed} */
  readonly onDisposed = new Event();

  constructor(components: Components) {
    super(components);
    components.add(FragmentClassifier.uuid, this);
    const fragmentManager = components.get(FragmentManager);
    fragmentManager.onFragmentsDisposed.add(this.onFragmentsDisposed);
  }

  private onFragmentsDisposed = (data: {
    groupID: string;
    fragmentIDs: string[];
  }) => {
    const { groupID, fragmentIDs } = data;
    for (const systemName in this.list) {
      const system = this.list[systemName];
      const groupNames = Object.keys(system);
      if (groupNames.includes(groupID)) {
        delete system[groupID];
        if (Object.values(system).length === 0) {
          delete this.list[systemName];
        }
      } else {
        for (const groupName of groupNames) {
          const group = system[groupName];
          for (const fragmentID of fragmentIDs) {
            delete group[fragmentID];
          }
          if (Object.values(group).length === 0) {
            delete system[groupName];
          }
        }
      }
    }
  };

  dispose() {
    this.list = {};
    const fragmentManager = this.components.get(FragmentManager);
    fragmentManager.onFragmentsDisposed.remove(this.onFragmentsDisposed);
    this.onDisposed.trigger();
    this.onDisposed.reset();
  }

  remove(guid: string) {
    for (const systemName in this.list) {
      const system = this.list[systemName];
      for (const groupName in system) {
        const group = system[groupName];
        delete group[guid];
      }
    }
  }

  find(filter?: { [name: string]: string[] }) {
    const fragments = this.components.get(FragmentManager);
    if (!filter) {
      const result: FRAGS.FragmentIdMap = {};
      for (const [id, fragment] of fragments.list) {
        result[id] = new Set(fragment.ids);
      }
      return result;
    }

    // There must be as many matches as conditions.
    // E.g.: if the filter is "floor 1 and category wall",
    // this gets the items with 2 matches (1 match per condition)
    const filterCount = Object.keys(filter).length;

    const models: { [fragmentGuid: string]: Map<number, number> } = {};

    for (const name in filter) {
      const values = filter[name];
      if (!this.list[name]) {
        console.warn(`Classification ${name} does not exist.`);
        continue;
      }
      for (const value of values) {
        const found = this.list[name][value];
        if (found) {
          for (const guid in found) {
            if (!models[guid]) {
              models[guid] = new Map();
            }
            for (const id of found[guid]) {
              const matchCount = models[guid].get(id);
              if (matchCount === undefined) {
                models[guid].set(id, 1);
              } else {
                models[guid].set(id, matchCount + 1);
              }
            }
          }
        }
      }
    }

    const result: FRAGS.FragmentIdMap = {};
    for (const guid in models) {
      const model = models[guid];
      for (const [id, numberOfMatches] of model) {
        if (numberOfMatches === undefined) {
          throw new Error("Malformed fragments map!");
        }
        if (numberOfMatches === filterCount) {
          if (!result[guid]) {
            result[guid] = new Set();
          }
          result[guid].add(id);
        }
      }
    }

    return result;
  }

  byModel(modelID: string, group: FRAGS.FragmentsGroup) {
    if (!this.list.model) {
      this.list.model = {};
    }
    const modelsClassification = this.list.model;
    if (!modelsClassification[modelID]) {
      modelsClassification[modelID] = {};
    }
    const currentModel = modelsClassification[modelID];
    for (const [expressID, data] of group.data) {
      const keys = data[0];
      for (const key of keys) {
        const fragID = group.keyFragments.get(key);
        if (!fragID) continue;
        if (!currentModel[fragID]) {
          currentModel[fragID] = new Set<number>();
        }
        currentModel[fragID].add(expressID);
      }
    }
  }

  async byPredefinedType(group: FRAGS.FragmentsGroup) {
    if (!this.list.predefinedTypes) {
      this.list.predefinedTypes = {};
    }

    const currentTypes = this.list.predefinedTypes;

    const ids = group.getAllPropertiesIDs();
    for (const id of ids) {
      const entity = await group.getProperties(id);

      if (!entity) continue;

      const predefinedType = String(entity.PredefinedType?.value).toUpperCase();

      if (!currentTypes[predefinedType]) {
        currentTypes[predefinedType] = {};
      }
      const currentType = currentTypes[predefinedType];

      for (const [_expressID, data] of group.data) {
        const keys = data[0];
        for (const key of keys) {
          const fragmentID = group.keyFragments.get(key);
          if (!fragmentID) {
            throw new Error("Fragment ID not found!");
          }
          if (!currentType[fragmentID]) {
            currentType[fragmentID] = new Set<number>();
          }
          const currentFragment = currentType[fragmentID];
          currentFragment.add(entity.expressID);
        }
      }
    }
  }

  byEntity(group: FRAGS.FragmentsGroup) {
    if (!this.list.entities) {
      this.list.entities = {};
    }

    for (const [expressID, data] of group.data) {
      const rels = data[1];
      const type = rels[1];
      const entity = IfcCategoryMap[type];
      this.saveItem(group, "entities", entity, expressID);
    }
  }

  byStorey(group: FRAGS.FragmentsGroup) {
    for (const [expressID, data] of group.data) {
      const rels = data[1];
      const storeyID = rels[0];
      const storeyName = storeyID.toString();
      this.saveItem(group, "storeys", storeyName, expressID);
    }
  }

  async byIfcRel(
    group: FRAGS.FragmentsGroup,
    ifcRel: number,
    systemName: string,
  ) {
    if (!IfcPropertiesUtils.isRel(ifcRel)) return;
    await IfcPropertiesUtils.getRelationMap(
      group,
      ifcRel,
      async (relatingID, relatedIDs) => {
        const { name: relatingName } = await IfcPropertiesUtils.getEntityName(
          group,
          relatingID,
        );
        for (const expressID of relatedIDs) {
          this.saveItem(
            group,
            systemName,
            relatingName ?? "NO REL NAME",
            expressID,
          );
        }
      },
    );
  }

  setColor(items: FRAGS.FragmentIdMap, color: THREE.Color, _override?: boolean) {
    const fragments = this.components.get(FragmentManager);
    for (const fragID in items) {
      const found = fragments.list.get(fragID);
      if (!found) continue;
      const ids = items[fragID];
      found.setColor(color, ids);
    }
  }

  resetColor(items: FRAGS.FragmentIdMap) {
    const fragments = this.components.get(FragmentManager);
    for (const fragID in items) {
      const found = fragments.list.get(fragID);
      if (!found) continue;
      const ids = items[fragID];
      found.resetColor(ids);
    }
  }

  private saveItem(
    group: FRAGS.FragmentsGroup,
    systemName: string,
    className: string,
    expressID: number,
  ) {
    if (!this.list[systemName]) {
      this.list[systemName] = {};
    }
    const keys = group.data.get(expressID);
    if (!keys) return;
    for (const key of keys[0]) {
      const fragmentID = group.keyFragments.get(key);
      if (fragmentID) {
        const system = this.list[systemName];
        if (!system[className]) {
          system[className] = {};
        }
        if (!system[className][fragmentID]) {
          system[className][fragmentID] = new Set<number>();
        }
        system[className][fragmentID].add(expressID);
      }
    }
  }
}
