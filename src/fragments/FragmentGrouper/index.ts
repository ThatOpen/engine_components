import * as WEBIFC from "web-ifc";
import { Disposable } from "../../base-types";
import { Component } from "../../base-types/component";
import { Components } from "../../core/Components";
import { FragmentManager } from "../FragmentManager";

// TODO: Clean up and document

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

  groupByPredefinedType(model: any) {
    const group: any = {};
    const arrayProperties = Object.values(model.properties) as any[];
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
      const entity = model.properties[element];
      if (!entity) {
        return;
      }
      const fragmentID = model.expressIDFragmentIDMap[entity.expressID];
      const predefinedType = String(entity.PredefinedType?.value).toUpperCase();
      if (!group[predefinedType]) {
        group[predefinedType] = {};
      }
      if (!group[predefinedType][fragmentID]) {
        group[predefinedType][fragmentID] = [];
      }
      group[predefinedType][fragmentID].push(entity.expressID);
    });
    return group;
  }

  groupByEntity(model: any) {
    const group: any = {};
    for (const expressID in model.itemTypes) {
      const entity = model.allTypes[model.itemTypes[expressID]];
      const fragment = model.expressIDFragmentIDMap[expressID];
      if (!fragment) {
        continue;
      }
      if (!group[entity]) {
        group[entity] = {};
      }
      if (!group[entity][fragment]) {
        group[entity][fragment] = [];
      }
      group[entity][fragment].push(expressID);
    }
    return group;
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
        const fragment = expressIDFragmentIDMap[expressID];
        if (!fragment) {
          return;
        }
        if (!storey[fragment]) {
          storey[fragment] = [];
        }
        storey[fragment].push(expressID);
      });
    });
  }
}
