import * as WEBIFC from "web-ifc";
import { FragmentsGroup, IfcProperties } from "bim-fragment";
import { Event, FragmentIdMap, UI } from "../../base-types";
import { Component } from "../../base-types/component";
import { IfcPropertiesUtils } from "../IfcPropertiesUtils";
import { Button, FloatingWindow } from "../../ui";
import { Components } from "../../core/Components";
import {
  QueryOperators,
  QueryGroup,
  AttributeQuery,
  ConditionFunctions,
} from "./src/types";
import { FragmentManager } from "../../fragments";
import { QueryBuilder } from "./src/query-builder";
import { IfcPropertiesManager } from "../IfcPropertiesManager";

interface QueryResult {
  [modelID: string]: {
    modelEntities: Set<number>;
    otherEntities: Set<number>;
  };
}

export class IfcPropertiesFinder extends Component<null> implements UI {
  name: string = "IfcPropertiesFinder";
  enabled: boolean = true;
  uiElement: { main: Button; queryWindow: FloatingWindow; query: QueryBuilder };

  private _localStorageID = "FragmentHiderCache";
  private _components: Components;
  private _fragments: FragmentManager;
  private _indexedModels: {
    [modelID: string]: { [expressID: number]: Set<number> };
  } = {};
  private _noHandleAttributes = ["type"];
  private _conditionFunctions: ConditionFunctions;

  readonly onFound = new Event<FragmentIdMap>();

  constructor(components: Components, fragmentManager: FragmentManager) {
    super();
    this._components = components;
    this._fragments = fragmentManager;
    this.uiElement = {
      main: new Button(components, {
        materialIconName: "manage_search",
      }),
      queryWindow: new FloatingWindow(components),
      query: new QueryBuilder(components),
    };
    this.setUI();
    this._conditionFunctions = {
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

  dispose() {
    this._indexedModels = {};
    this.uiElement.main.dispose();
    this.uiElement.queryWindow.dispose();
  }

  loadCached(id?: string) {
    if (id) {
      this._localStorageID = `FragmentHiderCache-${id}`;
    }
    const serialized = localStorage.getItem(this._localStorageID);
    if (!serialized) return;
    const groups = JSON.parse(serialized);
    this.uiElement.query.query = groups;
  }

  deleteCache() {
    localStorage.removeItem(this._localStorageID);
  }

  private setUI() {
    const mainButton = this.uiElement.main;
    this.uiElement.queryWindow = new FloatingWindow(this._components);
    this._components.ui.add(this.uiElement.queryWindow);
    this.uiElement.queryWindow.get().classList.add("overflow-visible");
    this.uiElement.queryWindow.get().style.width = "700px";
    this.uiElement.queryWindow.visible = false;
    this.uiElement.queryWindow.resizeable = false;
    this.uiElement.queryWindow.title = "Model Queries";
    mainButton.onclick = () =>
      (this.uiElement.queryWindow.visible =
        !this.uiElement.queryWindow.visible);
    this.uiElement.queryWindow.onVisible.on(() => (mainButton.active = true));
    this.uiElement.queryWindow.onHidden.on(() => (mainButton.active = false));

    const { query } = this.uiElement;
    query.findButton.onClicked.on((query: QueryGroup[]) => {
      const model = this._fragments.groups[0];
      if (!model) return;
      this.find(query);
    });
    this.uiElement.queryWindow.addChild(query);
  }

  private indexEntityRelations(model: FragmentsGroup) {
    const map: { [expressID: number]: Set<number> } = {};
    const { properties } = IfcPropertiesManager.getIFCInfo(model);

    IfcPropertiesUtils.getRelationMap(
      properties,
      WEBIFC.IFCRELDEFINESBYPROPERTIES,
      (relatingID, relatedIDs) => {
        if (!map[relatingID]) map[relatingID] = new Set();
        const props: number[] = [];
        IfcPropertiesUtils.getPsetProps(properties, relatingID, (propID) => {
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
      IfcPropertiesUtils.getRelationMap(
        properties,
        relation,
        (relatingID, relatedIDs) => {
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

  find(
    queryGroups = this.uiElement.query.query,
    models = this._fragments.groups
  ) {
    const result: QueryResult = {};

    this.cache();

    for (const model of models) {
      let map = this._indexedModels[model.uuid];
      if (!map) map = this.indexEntityRelations(model);
      let relations: number[] = [];
      for (const [index, group] of queryGroups.entries()) {
        const excludedItems = new Set<number>();
        const groupResult = this.simpleQuery(model, group, excludedItems);
        const groupRelations: number[] = [];
        for (const expressID of groupResult) {
          const relations = map[expressID];
          if (!relations) continue;
          groupRelations.push(expressID);
          for (const id of relations) {
            if (!excludedItems.has(id)) {
              groupRelations.push();
            }
          }
        }
        relations =
          group.operator === "AND" && index > 0
            ? this.getCommonElements(relations, groupRelations)
            : [...relations, ...groupRelations];
      }

      const modelEntities = new Set<number>();

      for (const expressID in model.data) {
        const included = relations.includes(Number(expressID));
        if (!included) continue;
        modelEntities.add(Number(expressID));
      }

      const otherEntities = new Set<number>();

      for (const expressID of relations) {
        const included = modelEntities.has(expressID);
        if (included) continue;
        otherEntities.add(expressID);
      }

      result[model.uuid] = { modelEntities, otherEntities };
    }

    const fragments = this.toFragmentMap(result);
    this.onFound.trigger(fragments);
    return fragments;
  }

  private toFragmentMap(data: QueryResult) {
    const fragmentMap: FragmentIdMap = {};
    for (const modelID in data) {
      const model = this._fragments.groups.find((m) => m.uuid === modelID);
      if (!model) continue;
      const matchingEntities = data[modelID].modelEntities;
      for (const expressID of matchingEntities) {
        const data = model.data[expressID];
        if (!data) continue;
        for (const key of data[0]) {
          const fragmentID = model.keyFragments[key];
          if (!fragmentMap[fragmentID]) {
            fragmentMap[fragmentID] = new Set();
          }
          fragmentMap[fragmentID].add(String(expressID));
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
    const properties = model.properties as IfcProperties;
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
    const { attribute: attributeName, condition, value } = query;
    const handleAttribute = !this._noHandleAttributes.includes(attributeName);
    const expressIDs: number[] = [];
    const matchingEntities: {
      [expressID: number]: { [attributeName: string]: any };
    }[] = [];
    for (const expressID in entities) {
      const entity = entities[expressID];
      const attribute = entity[attributeName];
      const attributeValue = handleAttribute ? attribute?.value : attribute;
      if (attributeValue === undefined || attributeValue === null) continue;
      let conditionMatches = this._conditionFunctions[condition](
        attributeValue,
        value
      );
      if (query.negateResult) {
        conditionMatches = !conditionMatches;
      }
      if (!conditionMatches) {
        excludedItems.add(entity.expressID);
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
    const query = this.uiElement.query.query;
    const serialized = JSON.stringify(query);
    localStorage.setItem(this._localStorageID, serialized);
  }

  get(): null {
    throw new Error("Method not implemented.");
  }
}
