import * as WEBIFC from "web-ifc";
import { FragmentsGroup, IfcProperties } from "bim-fragment";
import {
  Disposable,
  Event,
  FragmentIdMap,
  UI,
  Component,
  UIElement,
} from "../../base-types";
import { IfcPropertiesUtils } from "../IfcPropertiesUtils";
import { Button, FloatingWindow } from "../../ui";
import { Components } from "../../core";
import {
  QueryOperators,
  QueryGroup,
  AttributeQuery,
  ConditionFunctions,
} from "./src/types";
import { FragmentManager } from "../../fragments/FragmentManager";
import { QueryBuilder } from "./src/query-builder";

// TODO: This works only for local properties, implement for streaming

export interface QueryResult {
  [modelID: string]: {
    modelEntities: Set<number>;
    otherEntities: Set<number>;
  };
}

export interface IndexedModels {
  [modelID: string]: { [expressID: number]: Set<number> };
}

export class IfcPropertiesFinder
  extends Component<IndexedModels>
  implements UI, Disposable
{
  readonly onFound = new Event<FragmentIdMap>();

  /** {@link Disposable.onDisposed} */
  readonly onDisposed = new Event<undefined>();

  enabled: boolean = true;

  uiElement = new UIElement<{
    main: Button;
    queryWindow: FloatingWindow;
    query: QueryBuilder;
  }>();

  private readonly _conditionFunctions: ConditionFunctions;

  private _localStorageID = "IfcPropertiesFinder";
  private _indexedModels: IndexedModels = {};
  private _noHandleAttributes = ["type"];

  constructor(components: Components) {
    super(components);
    this._conditionFunctions = this.getConditionFunctions();
    const fragmentManager = components.tools.get(FragmentManager);
    fragmentManager.onFragmentsDisposed.add(this.onFragmentsDisposed);
  }

  private onFragmentsDisposed = (data: {
    groupID: string;
    fragmentIDs: string[];
  }) => {
    delete this._indexedModels[data.groupID];
  };

  init() {
    if (this.components.uiEnabled) {
      this.setUI();
    }
  }

  get() {
    return this._indexedModels;
  }

  async dispose() {
    this._indexedModels = {};
    this.onFound.reset();
    await this.uiElement.dispose();
    await this.onDisposed.trigger();
    this.onDisposed.reset();
  }

  loadCached(id?: string) {
    if (id) {
      this._localStorageID = `IfcPropertiesFinder-${id}`;
    }
    const serialized = localStorage.getItem(this._localStorageID);
    if (!serialized) return;
    const groups = JSON.parse(serialized);
    const queryBuilder = this.uiElement.get<QueryBuilder>("query");
    queryBuilder.query = groups;
  }

  deleteCache() {
    localStorage.removeItem(this._localStorageID);
  }

  private setUI() {
    const main = new Button(this.components, {
      materialIconName: "manage_search",
    });

    const queryWindow = new FloatingWindow(this.components);
    this.components.ui.add(queryWindow);

    const fragments = this.components.tools.get(FragmentManager);

    // queryWindow.get().classList.add("overflow-visible");
    queryWindow.get().style.width = "700px";
    queryWindow.get().style.height = "420px";
    queryWindow.visible = false;
    // queryWindow.resizeable = false;
    queryWindow.title = "Model Queries";

    main.onClick.add(() => {
      queryWindow.visible = !queryWindow.visible;
    });

    queryWindow.onVisible.add(() => (main.active = true));
    queryWindow.onHidden.add(() => (main.active = false));

    const query = new QueryBuilder(this.components);

    query.findButton.onClick.add(async () => {
      const model = fragments.groups[0];
      if (!model) return;
      await this.find();
    });

    queryWindow.addChild(query);

    this.uiElement.set({
      main,
      queryWindow,
      query,
    });
  }

  private async indexEntityRelations(model: FragmentsGroup) {
    const map: { [expressID: number]: Set<number> } = {};

    await IfcPropertiesUtils.getRelationMap(
      model,
      WEBIFC.IFCRELDEFINESBYPROPERTIES,
      async (relatingID, relatedIDs) => {
        if (!map[relatingID]) map[relatingID] = new Set();
        const props: number[] = [];
        await IfcPropertiesUtils.getPsetProps(model, relatingID, (propID) => {
          props.push(propID);
          map[relatingID].add(propID);
          if (!map[propID]) map[propID] = new Set();
          map[propID].add(relatingID);
        });
        for (const relatedID of relatedIDs) {
          map[relatingID].add(relatedID);
          for (const propID of props) map[propID].add(relatedID);
          if (!map[relatedID]) map[relatedID] = new Set();
          map[relatedID].add(relatedID);
        }
      }
    );

    const ifcRelations = [
      WEBIFC.IFCRELCONTAINEDINSPATIALSTRUCTURE,
      WEBIFC.IFCRELDEFINESBYTYPE,
      WEBIFC.IFCRELASSIGNSTOGROUP,
    ];

    for (const relation of ifcRelations) {
      await IfcPropertiesUtils.getRelationMap(
        model,
        relation,
        async (relatingID, relatedIDs) => {
          if (!map[relatingID]) map[relatingID] = new Set();
          for (const relatedID of relatedIDs) {
            map[relatingID].add(relatedID);
            if (!map[relatedID]) map[relatedID] = new Set();
            map[relatedID].add(relatedID);
          }
        }
      );
    }

    this._indexedModels[model.uuid] = map;
    return map;
  }

  async find(queryGroups?: QueryGroup[], queryModels?: FragmentsGroup[]) {
    const fragments = this.components.tools.get(FragmentManager);

    const queries = this.uiElement.get<QueryBuilder>("query");
    const models = queryModels || fragments.groups;
    const groups = queryGroups || queries.query;
    const result: QueryResult = {};

    this.cache();

    for (const model of models) {
      let map = this._indexedModels[model.uuid];
      if (!map) {
        map = await this.indexEntityRelations(model);
      }
      let relations: number[] = [];
      for (const [index, group] of groups.entries()) {
        const excludedItems = new Set<number>();
        const groupResult = this.simpleQuery(model, group, excludedItems);
        const groupRelations: number[] = [];
        for (const expressID of groupResult) {
          const relations = map[expressID];
          if (!relations) continue;
          groupRelations.push(expressID);
          for (const id of relations) {
            if (!excludedItems.has(id)) {
              groupRelations.push(id);
            }
          }
        }
        relations =
          group.operator === "AND" && index > 0
            ? this.getCommonElements(relations, groupRelations)
            : [...relations, ...groupRelations];
      }

      const modelEntities = new Set<number>();

      for (const [expressID] of model.data) {
        const included = relations.includes(expressID);
        if (included) {
          modelEntities.add(expressID);
        }
      }

      const otherEntities = new Set<number>();

      for (const expressID of relations) {
        const included = modelEntities.has(expressID);
        if (included) continue;
        otherEntities.add(expressID);
      }

      result[model.uuid] = { modelEntities, otherEntities };
    }

    const foundFragments = this.toFragmentMap(result);
    await this.onFound.trigger(foundFragments);
    return foundFragments;
  }

  private toFragmentMap(data: QueryResult) {
    const fragments = this.components.tools.get(FragmentManager);
    const fragmentMap: FragmentIdMap = {};
    for (const modelID in data) {
      const model = fragments.groups.find((m) => m.uuid === modelID);
      if (!model) continue;
      const matchingEntities = data[modelID].modelEntities;
      for (const expressID of matchingEntities) {
        const data = model.data.get(expressID);
        if (!data) continue;
        for (const key of data[0]) {
          const fragmentID = model.keyFragments.get(key);
          if (!fragmentID) {
            throw new Error("Fragment ID not found!");
          }
          if (!fragmentMap[fragmentID]) {
            fragmentMap[fragmentID] = new Set();
          }
          fragmentMap[fragmentID].add(expressID);
        }
      }
    }
    return fragmentMap;
  }

  private simpleQuery(
    model: FragmentsGroup,
    queryGroup: QueryGroup,
    excludedItems: Set<number>
  ) {
    const properties = model.getLocalProperties() as IfcProperties;
    if (!properties) throw new Error("Model has no properties");
    let filteredProps: {
      [expressID: number]: { [attributeName: string]: any };
    } = {};
    let iterations = 0;
    let matchingEntities: number[] = [];
    for (const query of queryGroup.queries) {
      let queryResult: number[] = [];
      const workingProps =
        query.operator === "AND" ? filteredProps : properties;
      const isAttributeQuery = (query as AttributeQuery).condition; // Is there a better way?
      if (isAttributeQuery) {
        const matchingResult = this.getMatchingEntities(
          workingProps,
          query as AttributeQuery,
          excludedItems
        );
        queryResult = matchingResult.expressIDs;
        filteredProps = { ...filteredProps, ...matchingResult.entities };
      } else {
        queryResult = [
          ...this.simpleQuery(model, query as QueryGroup, excludedItems),
        ];
      }
      matchingEntities =
        iterations === 0
          ? queryResult
          : this.combineArrays(
              matchingEntities,
              queryResult,
              query.operator ?? "AND" // Defaults to AND if iterations > 0 and query.operator is not defined
            );
      iterations++;
    }
    return new Set(matchingEntities);
  }

  private getMatchingEntities(
    entities: { [expressID: number]: { [attributeName: string]: any } },
    query: AttributeQuery,
    excludedItems: Set<number>
  ) {
    const { attribute: attributeName, condition } = query;
    let { value } = query;

    const handleAttribute = !this._noHandleAttributes.includes(attributeName);
    const expressIDs: number[] = [];
    const matchingEntities: {
      [expressID: number]: { [attributeName: string]: any };
    }[] = [];
    for (const expressID in entities) {
      const entity = entities[expressID];
      if (entity === undefined) {
        continue;
      }
      const attribute = entity[attributeName];
      let attributeValue = handleAttribute ? attribute?.value : attribute;
      if (attributeValue === undefined || attributeValue === null) continue;

      // TODO: Maybe the user can specify the value type in the finder menu, so we don't need this
      const type1 = typeof value;
      const type2 = typeof attributeValue;
      if (type1 === "number" && type2 === "string") {
        value = value.toString();
      } else if (type1 === "string" && type2 === "number") {
        attributeValue = attributeValue.toString();
      }

      let conditionMatches = this._conditionFunctions[condition](
        attributeValue,
        value
      );
      if (query.negateResult) {
        conditionMatches = !conditionMatches;
      }
      if (!conditionMatches) {
        if (query.negateResult) {
          excludedItems.add(entity.expressID);
        }
        continue;
      }
      expressIDs.push(entity.expressID);
      matchingEntities.push(entity);
    }
    return { expressIDs, entities: matchingEntities, excludedItems };
  }

  private combineArrays(
    arrA: number[],
    arrB: number[],
    operator?: QueryOperators
  ) {
    if (!operator) return arrB;
    return operator === "AND"
      ? this.arrayIntersection(arrA, arrB)
      : this.arrayUnion(arrA, arrB);
  }

  private getCommonElements(...lists: number[][]) {
    const result: number[] = [];

    const elementsCount = new Map<number, number>();

    for (const list of lists) {
      const uniqueElements = new Set(list);
      for (const element of uniqueElements) {
        if (elementsCount.has(element)) {
          elementsCount.set(element, elementsCount.get(element)! + 1);
        } else {
          elementsCount.set(element, 1);
        }
      }
    }

    for (const [element, count] of elementsCount) {
      if (count === lists.length) {
        result.push(element);
      }
    }

    return result;
  }

  private arrayIntersection(arrA: number[], arrB: number[]) {
    return arrA.filter((x) => arrB.includes(x));
  }

  private arrayUnion(arrA: number[], arrB: number[]) {
    return [...arrA, ...arrB];
  }

  private cache() {
    const queryBuilder = this.uiElement.get<QueryBuilder>("query");
    const query = queryBuilder.query;
    const serialized = JSON.stringify(query);
    localStorage.setItem(this._localStorageID, serialized);
  }

  private getConditionFunctions() {
    return {
      is: (
        leftValue: string | boolean | number,
        rightValue: string | boolean | number
      ) => {
        return leftValue === rightValue;
      },
      includes: (
        leftValue: string | boolean | number,
        rightValue: string | boolean | number
      ) => {
        return leftValue.toString().includes(rightValue.toString());
      },
      startsWith: (
        leftValue: string | boolean | number,
        rightValue: string | boolean | number
      ) => {
        return leftValue.toString().startsWith(rightValue.toString());
      },
      endsWith: (
        leftValue: string | boolean | number,
        rightValue: string | boolean | number
      ) => {
        return leftValue.toString().endsWith(rightValue.toString());
      },
      matches: (
        leftValue: string | boolean | number,
        rightValue: string | boolean | number
      ) => {
        const regex = new RegExp(rightValue.toString());
        return regex.test(leftValue.toString());
      },
    };
  }
}
