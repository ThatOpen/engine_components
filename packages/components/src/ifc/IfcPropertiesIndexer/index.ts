import * as WEBIFC from "web-ifc";
import { FragmentsGroup, IfcProperties } from "@thatopen/fragments";
import { Disposable, Event, Component, Components } from "../../core";
import { FragmentManager } from "../../fragments/FragmentManager";
import { IfcPropertiesManager } from "../IfcPropertiesManager";
import { IfcPropertiesUtils } from "../Utils";

interface IndexMap {
  [modelID: string]: { [expressID: string]: Set<number> };
}

export class IfcPropertiesIndexer extends Component implements Disposable {
  static readonly uuid = "23a889ab-83b3-44a4-8bee-ead83438370b" as const;

  /** {@link Disposable.onDisposed} */
  readonly onDisposed = new Event<string>();

  enabled: boolean = true;

  relationsToProcess = [
    WEBIFC.IFCRELDEFINESBYPROPERTIES,
    WEBIFC.IFCRELDEFINESBYTYPE,
    WEBIFC.IFCRELASSOCIATESMATERIAL,
    WEBIFC.IFCRELCONTAINEDINSPATIALSTRUCTURE,
    WEBIFC.IFCRELASSOCIATESCLASSIFICATION,
    WEBIFC.IFCRELASSIGNSTOGROUP,
  ];

  indexMap: IndexMap = {};

  private _propertiesManager: IfcPropertiesManager | null = null;
  readonly onPropertiesManagerSet = new Event<IfcPropertiesManager>();

  // private _entityUIPool: UIPool<TreeView>;

  set propertiesManager(manager: IfcPropertiesManager | null) {
    if (this._propertiesManager) return;
    this._propertiesManager = manager;
    if (manager) {
      manager.onElementToPset.add(async ({ model, psetID, elementID }) => {
        const modelIndexMap = this.indexMap[model.uuid];
        if (!modelIndexMap) return;
        this.setEntityIndex(model, elementID).add(psetID);
      });

      this.onPropertiesManagerSet.trigger(manager);
    }
  }

  get propertiesManager() {
    return this._propertiesManager;
  }

  constructor(components: Components) {
    super(components);
    this.components.add(IfcPropertiesIndexer.uuid, this);
    const fragmentManager = components.get(FragmentManager);
    fragmentManager.onFragmentsDisposed.add(this.onFragmentsDisposed);
  }

  private onFragmentsDisposed = (data: {
    groupID: string;
    fragmentIDs: string[];
  }) => {
    delete this.indexMap[data.groupID];
  };

  async dispose() {
    this.indexMap = {};
    (this.propertiesManager as any) = null;

    this.onPropertiesManagerSet.reset();
    const fragmentManager = this.components.get(FragmentManager);
    fragmentManager.onFragmentsDisposed.remove(this.onFragmentsDisposed);
    this.onDisposed.trigger(IfcPropertiesIndexer.uuid);
    this.onDisposed.reset();
  }

  async getProperties(model: FragmentsGroup, id: string) {
    if (!model.hasProperties) return null;
    const modelProperties: IfcProperties | undefined =
      model.getLocalProperties();
    if (modelProperties === undefined) {
      return null;
    }
    const map = this.indexMap[model.uuid];
    if (!map) return null;
    const indices = map[id];
    const idNumber = parseInt(id, 10);
    const props = await model.getProperties(idNumber);
    if (!props) {
      throw new Error("Properties not found!");
    }
    const nativeProperties = this.cloneProperty(props);

    if (!nativeProperties) {
      throw new Error("Properties not found!");
    }

    const properties = [nativeProperties] as any[];

    if (indices) {
      for (const index of indices) {
        const props = await model.getProperties(index);
        if (!props) continue;
        const pset = this.cloneProperty(props);
        if (!pset) continue;
        this.getPsetProperties(pset, modelProperties);
        this.getNestedPsets(pset, modelProperties);
        properties.push(pset);
      }
    }

    return properties;
  }

  private getNestedPsets(pset: { [p: string]: any }, props: any) {
    if (pset.HasPropertySets) {
      for (const subPSet of pset.HasPropertySets) {
        const psetID = subPSet.value;
        subPSet.value = this.cloneProperty(props[psetID]);
        this.getPsetProperties(subPSet.value, props);
      }
    }
  }

  private getPsetProperties(pset: { [p: string]: any }, props: any) {
    if (pset.HasProperties) {
      for (const property of pset.HasProperties) {
        const psetID = property.value;
        const result = this.cloneProperty(props[psetID]);
        property.value = { ...result };
      }
    }
  }

  async process(model: FragmentsGroup) {
    if (!model.hasProperties) {
      throw new Error("FragmentsGroup properties not found");
    }
    this.indexMap[model.uuid] = {};
    // const relations: number[] = [];
    // for (const typeID in IfcCategoryMap) {
    //   const name = IfcCategoryMap[typeID];
    //   if (name.startsWith("IFCREL")) relations.push(Number(typeID));
    // }
    const setEntities = [WEBIFC.IFCPROPERTYSET, WEBIFC.IFCELEMENTQUANTITY];
    for (const relation of this.relationsToProcess) {
      await IfcPropertiesUtils.getRelationMap(
        model,
        relation,
        // eslint-disable-next-line no-loop-func
        async (relationID, relatedIDs) => {
          const relationEntity = await model.getProperties(relationID);
          if (!relationEntity) {
            return;
          }
          if (!setEntities.includes(relationEntity.type)) {
            this.setEntityIndex(model, relationID);
          }
          for (const expressID of relatedIDs) {
            this.setEntityIndex(model, expressID).add(relationID);
          }
        },
      );
    }
  }

  private setEntityIndex(model: FragmentsGroup, expressID: number) {
    if (!this.indexMap[model.uuid][expressID])
      this.indexMap[model.uuid][expressID] = new Set();
    return this.indexMap[model.uuid][expressID];
  }

  private cloneProperty(
    item: { [name: string]: any },
    result: { [name: string]: any } = {},
  ) {
    if (!item) {
      return result;
    }
    for (const key in item) {
      const value = item[key];

      const isArray = Array.isArray(value);
      const isObject = typeof value === "object" && !isArray && value !== null;

      if (isArray) {
        result[key] = [];
        const subResult = result[key] as any[];
        this.clonePropertyArray(value, subResult);
      } else if (isObject) {
        result[key] = {};
        const subResult = result[key];
        this.cloneProperty(value, subResult);
      } else {
        result[key] = value;
      }
    }
    return result;
  }

  private clonePropertyArray(item: any[], result: any[]) {
    for (const value of item) {
      const isArray = Array.isArray(value);
      const isObject = typeof value === "object" && !isArray && value !== null;

      if (isArray) {
        const subResult = [] as any[];
        result.push(subResult);
        this.clonePropertyArray(value, subResult);
      } else if (isObject) {
        const subResult = {} as any;
        result.push(subResult);
        this.cloneProperty(value, subResult);
      } else {
        result.push(value);
      }
    }
  }
}
