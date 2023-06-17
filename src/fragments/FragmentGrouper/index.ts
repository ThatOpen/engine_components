import * as WEBIFC from "web-ifc";
import { Disposable } from "../../base-types";
import { Component } from "../../base-types/component";
import { Components } from "../../core/Components";
import { FragmentManager } from "../FragmentManager";

// TODO: Clean up and document

export interface GroupSystems {
  [system: string]: { [group: string]: { [fragment: string]: Set<string> } };
}

export class FragmentGrouper
  extends Component<GroupSystems>
  implements Disposable
{
  private _groupSystems: GroupSystems = {};
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

  setVisibility(systemName: string, groupName: string, visible: boolean) {
    const fragmentsMap = this._groupSystems[systemName][groupName];
    for (const fragmentId in fragmentsMap) {
      const fragment = this._fragmentManager.list[fragmentId];
      const ids = fragmentsMap[fragmentId];
      const idsArray = Array.from(ids);
      fragment.setVisibility(idsArray, visible);
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

  groupByModel(modelID: string, expressIDFragmentIDMap: any) {
    if (!this._groupSystems.model) {
      this._groupSystems.model = {};
    }
    const currentModels = this._groupSystems.model;
    if (!currentModels[modelID]) {
      currentModels[modelID] = {};
    }
    const currentModel = currentModels[modelID];
    for (const expressID in expressIDFragmentIDMap) {
      const fragID = expressIDFragmentIDMap[expressID];
      if (!currentModel[fragID]) {
        currentModel[fragID] = new Set<string>();
      }
      currentModel[fragID].add(expressID);
    }
  }

  groupByPredefinedType(props: any, expressIDFragmentIDMap: any) {
    const arrayProperties = Object.values(props) as any[];
    if (!this._groupSystems.predefinedType) {
      this._groupSystems.predefinedType = {};
    }

    const currentTypes = this._groupSystems.predefinedType;

    const levelRelations = arrayProperties.filter(
      (prop) => prop.type === WEBIFC.IFCRELCONTAINEDINSPATIALSTRUCTURE
    );

    const elements: any[] = [];

    levelRelations.forEach((rel) => {
      const expressIDs = rel.RelatedElements.map(
        (element: any) => element.value
      );
      elements.push(...expressIDs);
    });

    elements.forEach((element) => {
      const entity = props[element];
      if (!entity) {
        return;
      }

      const fragmentID = expressIDFragmentIDMap[entity.expressID];

      const predefinedType = String(entity.PredefinedType?.value).toUpperCase();

      if (!currentTypes[predefinedType]) {
        currentTypes[predefinedType] = {};
      }

      const currentType = currentTypes[predefinedType];

      if (!currentType[fragmentID]) {
        currentType[fragmentID] = new Set<string>();
      }

      const currentFragment = currentType[fragmentID];
      currentFragment.add(entity.expressID);
    });
  }

  groupByEntity(itemTypes: any, allTypes: any, expressIDFragmentIDMap: any) {
    if (!this._groupSystems.entity) {
      this._groupSystems.entity = {};
    }
    const currentEntities = this._groupSystems.entity;

    for (const expressID in itemTypes) {
      const entity = allTypes[itemTypes[expressID]];
      const fragment = expressIDFragmentIDMap[expressID];
      if (!fragment) {
        continue;
      }
      if (!currentEntities[entity]) {
        currentEntities[entity] = {};
      }
      if (!currentEntities[entity][fragment]) {
        currentEntities[entity][fragment] = new Set<string>();
      }

      currentEntities[entity][fragment].add(expressID);
    }
  }

  groupByStorey(props: any, expressIDFragmentIDMap: any) {
    const properties = Object.values(props) as any[];
    if (!this._groupSystems.storeys) {
      this._groupSystems.storeys = {};
    }

    const storeys = this._groupSystems.storeys;

    const spatialRels = properties.filter(
      (entity) => entity.type === WEBIFC.IFCRELCONTAINEDINSPATIALSTRUCTURE
    );

    const aggregates = properties.filter(
      (entity) => entity.type === WEBIFC.IFCRELAGGREGATES
    );

    const nestedItems: { [id: number]: number[] } = {};
    for (const item of aggregates) {
      if (!item.RelatingObject.value) continue;
      const id = item.RelatingObject.value;
      nestedItems[id] = item.RelatedObjects.map((item: any) =>
        item.value.toString()
      );
    }

    spatialRels.forEach((rel) => {
      if (!rel.RelatingStructure || !rel.RelatingStructure.value) {
        return;
      }

      const storeyProps = properties.find(
        (prop) => prop.expressID === rel.RelatingStructure.value
      );
      const storeyName = storeyProps.Name.value;

      if (!storeys[storeyName]) {
        storeys[storeyName] = {};
      }
      const storey = storeys[storeyName];

      const storeyElements = rel.RelatedElements.map((element: any) => {
        return element.value.toString();
      });

      storeyElements.forEach((expressID: any) => {
        this.savePerStorey(expressIDFragmentIDMap, expressID, storey);
        if (nestedItems[expressID]) {
          for (const item of nestedItems[expressID]) {
            this.savePerStorey(expressIDFragmentIDMap, item, storey);
          }
        }
      });
    });
  }

  private savePerStorey(idFragmentMap: any, expressID: any, storey: any) {
    const fragment = idFragmentMap[expressID];
    if (!fragment) {
      return;
    }
    if (!storey[fragment]) {
      storey[fragment] = new Set<string>();
    }
    storey[fragment].add(expressID);
  }
}
