import { FragmentsGroup } from "bim-fragment";
import { Disposable } from "../../base-types";
import { Component } from "../../base-types/component";
import { FragmentManager } from "../FragmentManager";
import { IfcCategoryMap } from "../../ifc";

// TODO: Clean up and document

export interface Classification {
  [system: string]: {
    [className: string]: { [fragmentID: string]: Set<string> };
  };
}

export class FragmentClassifier
  extends Component<Classification>
  implements Disposable
{
  /** {@link Component.name} */
  name = "FragmentClassifier";

  /** {@link Component.enabled} */
  enabled = true;

  private _groupSystems: Classification = {};
  private _fragments: FragmentManager;

  constructor(fragmentManager: FragmentManager) {
    super();
    this._fragments = fragmentManager;
  }

  /** {@link Component.get} */
  get(): Classification {
    return this._groupSystems;
  }

  dispose() {
    this._groupSystems = {};
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

  find(filter?: { [name: string]: string }) {
    if (!filter) {
      const result: { [p: string]: string[] } = {};
      const fragments = this._fragments.list;
      for (const id in fragments) {
        const fragment = fragments[id];
        const items = fragment.items;
        const hidden = Object.keys(fragment.hiddenInstances);
        result[id] = [...items, ...hidden];
      }
      return result;
    }
    const size = Object.keys(filter).length;
    const models: { [fragmentGuid: string]: { [id: string]: number } } = {};
    for (const name in filter) {
      const value = filter[name];
      if (!this._groupSystems[name]) {
        console.warn(`Classification ${name} does not exist.`);
        continue;
      }
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

  byModel(modelID: string, group: FragmentsGroup) {
    if (!this._groupSystems.model) {
      this._groupSystems.model = {};
    }
    const modelsClassification = this._groupSystems.model;
    if (!modelsClassification[modelID]) {
      modelsClassification[modelID] = {};
    }
    const currentModel = modelsClassification[modelID];
    for (const expressID in group.data) {
      const keys = group.data[expressID][0];
      for (const key of keys) {
        const fragID = group.keyFragments[key];
        if (!currentModel[fragID]) {
          currentModel[fragID] = new Set<string>();
        }
        currentModel[fragID].add(expressID);
      }
    }
  }

  byPredefinedType(group: FragmentsGroup) {
    if (!group.properties) {
      throw new Error("To group by predefined type, properties are needed");
    }

    if (!this._groupSystems.predefinedType) {
      this._groupSystems.predefinedType = {};
    }

    const currentTypes = this._groupSystems.predefinedType;

    for (const expressID in group.data) {
      const entity = group.properties[expressID];
      if (!entity) continue;

      const predefinedType = String(entity.PredefinedType?.value).toUpperCase();

      if (!currentTypes[predefinedType]) {
        currentTypes[predefinedType] = {};
      }
      const currentType = currentTypes[predefinedType];

      for (const expressID in group.data) {
        const keys = group.data[expressID][0];
        for (const key of keys) {
          const fragmentID = group.keyFragments[key];
          if (!currentType[fragmentID]) {
            currentType[fragmentID] = new Set<string>();
          }
          const currentFragment = currentType[fragmentID];
          currentFragment.add(entity.expressID);
        }
      }
    }
  }

  byEntity(group: FragmentsGroup) {
    if (!this._groupSystems.entities) {
      this._groupSystems.entities = {};
    }

    for (const expressID in group.data) {
      const rels = group.data[expressID][1];
      const type = rels[1];
      const entity = IfcCategoryMap[type];
      this.saveItem(group, "entities", entity, expressID);
    }
  }

  byStorey(group: FragmentsGroup) {
    if (!group.properties) {
      throw new Error("To group by storey, properties are needed");
    }

    for (const expressID in group.data) {
      const rels = group.data[expressID][1];
      const storeyID = rels[0];
      if (storeyID === -1) continue;
      const storey = group.properties[storeyID].Name.value;
      this.saveItem(group, "storeys", storey, expressID);
    }
  }

  private saveItem(
    group: FragmentsGroup,
    systemName: string,
    className: string,
    expressID: string
  ) {
    if (!this._groupSystems[systemName]) {
      this._groupSystems[systemName] = {};
    }
    const keys = group.data[expressID as any][0];
    for (const key of keys) {
      const fragmentID = group.keyFragments[key];
      if (fragmentID) {
        const system = this._groupSystems[systemName];
        if (!system[className]) {
          system[className] = {};
        }
        if (!system[className][fragmentID]) {
          system[className][fragmentID] = new Set<string>();
        }
        system[className][fragmentID].add(expressID);
      }
    }
  }
}
