import { FragmentsGroup } from "bim-fragment";
import { Disposable, FragmentIdMap, Component } from "../../base-types";
import { IfcCategoryMap, IfcPropertiesUtils } from "../../ifc";
import { toCompositeID } from "../../utils";
import { Components, ToolComponent } from "../../core";
import { FragmentManager } from "../FragmentManager";

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
  static readonly uuid = "e25a7f3c-46c4-4a14-9d3d-5115f24ebeb7" as const;

  /** {@link Component.enabled} */
  enabled = true;

  private _groupSystems: Classification = {};

  constructor(components: Components) {
    super(components);

    components.tools.add(FragmentClassifier.uuid, this);
  }

  /** {@link Component.get} */
  get(): Classification {
    return this._groupSystems;
  }

  async dispose() {
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

  async find(filter?: { [name: string]: string[] }) {
    const fragments = await this.components.tools.get(FragmentManager);
    if (!filter) {
      const result: FragmentIdMap = {};
      const fragList = fragments.list;
      for (const id in fragList) {
        const fragment = fragList[id];
        const items = fragment.items;
        const hidden = Object.keys(fragment.hiddenInstances);
        result[id] = new Set(...items, ...hidden);
      }
      return result;
    }
    const size = Object.keys(filter).length;
    const models: { [fragmentGuid: string]: { [id: string]: number } } = {};
    for (const name in filter) {
      const values = filter[name];
      if (!this._groupSystems[name]) {
        console.warn(`Classification ${name} does not exist.`);
        continue;
      }
      for (const value of values) {
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
    }
    const result: FragmentIdMap = {};
    for (const guid in models) {
      const model = models[guid];
      for (const id in model) {
        const numberOfMatches = model[id];
        if (numberOfMatches === size) {
          if (!result[guid]) {
            result[guid] = new Set();
          }
          result[guid].add(id);
          const fragment = fragments.list[guid];
          const composites = fragment.composites[id];
          if (composites) {
            const idNum = parseInt(id, 10);
            for (let i = 1; i < composites; i++) {
              const compositeID = toCompositeID(idNum, i);
              result[guid].add(compositeID);
            }
          }
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

    if (!this._groupSystems.predefinedTypes) {
      this._groupSystems.predefinedTypes = {};
    }

    const currentTypes = this._groupSystems.predefinedTypes;

    for (const expressID in group.data) {
      const entity = group.properties[expressID] as {
        [attribute: string]: any;
      };
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
      const storey = group.properties[storeyID];
      if (storey === undefined) continue;
      const storeyName = group.properties[storeyID].Name.value;
      this.saveItem(group, "storeys", storeyName, expressID);
    }
  }

  byIfcRel(group: FragmentsGroup, ifcRel: number, systemName: string) {
    const properties = group.properties;
    if (!properties)
      throw new Error("To group by IFC Rel, properties are needed");
    if (!IfcPropertiesUtils.isRel(ifcRel)) return;
    IfcPropertiesUtils.getRelationMap(
      properties,
      ifcRel,
      (relatingID, relatedIDs) => {
        const { name: relatingName } = IfcPropertiesUtils.getEntityName(
          properties,
          relatingID
        );
        for (const expressID of relatedIDs) {
          this.saveItem(
            group,
            systemName,
            relatingName ?? "NO REL NAME",
            String(expressID)
          );
        }
      }
    );
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
    const keys = group.data[expressID as any];
    if (!keys) return;
    for (const key of keys[0]) {
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

ToolComponent.libraryUUIDs.add(FragmentClassifier.uuid);
