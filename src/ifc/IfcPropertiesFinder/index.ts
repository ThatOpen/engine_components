import * as WEBIFC from "web-ifc";
import { FragmentsGroup } from "bim-fragment";
import { Event, UI } from "../../base-types";
import { Component } from "../../base-types/component";
import { IfcProperties, IfcPropertiesUtils } from "../IfcPropertiesUtils";
import { IfcCategoryMap } from "../ifc-category-map";
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

interface QueryResult {
  [modelID: string]: Set<number>;
}

export class IfcPropertiesFinder extends Component<null> implements UI {
  name: string = "IfcPropertiesFinder";
  enabled: boolean = true;
  uiElement: { main: Button; queryWindow: FloatingWindow };

  private _components: Components;
  private _fragmentManager: FragmentManager;
  private _indexedModels: {
    [modelID: string]: { [expressID: number]: Set<number> };
  } = {};
  private _noHandleAttributes = ["type"];
  private _conditionFunctions: ConditionFunctions;

  readonly onFound = new Event<QueryResult>();

  constructor(components: Components, fragmentManager: FragmentManager) {
    super();
    this._components = components;
    this._fragmentManager = fragmentManager;
    this.uiElement = {
      main: new Button(components, {
        materialIconName: "manage_search",
      }),
      queryWindow: new FloatingWindow(components),
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

  private setUI() {
    const mainButton = this.uiElement.main;
    this.uiElement.queryWindow = new FloatingWindow(this._components);
    this._components.ui.add(this.uiElement.queryWindow);
    this.uiElement.queryWindow.get().classList.add("overflow-visible");
    this.uiElement.queryWindow.get().style.width = "500px";
    this.uiElement.queryWindow.visible = false;
    this.uiElement.queryWindow.resizeable = false;
    this.uiElement.queryWindow.title = "Model Queries";
    mainButton.onclick = () =>
      (this.uiElement.queryWindow.visible =
        !this.uiElement.queryWindow.visible);
    this.uiElement.queryWindow.onVisible.on(() => (mainButton.active = true));
    this.uiElement.queryWindow.onHidden.on(() => (mainButton.active = false));

    const query = new QueryBuilder(this._components);
    query.findButton.onClicked.on((query: QueryGroup[]) => {
      const model = this._fragmentManager.groups[0];
      if (!model) return;
      this.find(model, query);
    });
    this.uiElement.queryWindow.addChild(query);
  }

  private indexEntityRelations(model: FragmentsGroup) {
    const map: { [expressID: number]: Set<number> } = {};

    IfcPropertiesUtils.getRelationMap(
      model.properties,
      WEBIFC.IFCRELDEFINESBYPROPERTIES,
      (relatingID, relatedIDs) => {
        if (!map[relatingID]) map[relatingID] = new Set();
        const props: number[] = [];
        IfcPropertiesUtils.getPsetProps(
          model.properties,
          relatingID,
          (propID) => {
            props.push(propID);
            map[relatingID].add(propID);
            if (!map[propID]) map[propID] = new Set();
            map[propID].add(relatingID);
          }
        );
        for (const relatedID of relatedIDs) {
          map[relatingID].add(relatedID);
          for (const propID of props) map[propID].add(relatedID);
          // if (!map[relatedID]) map[relatedID] = [];
          // map[relatedID].add(relatingID, ...props);
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
        model.properties,
        relation,
        (relatingID, relatedIDs) => {
          if (!map[relatingID]) map[relatingID] = new Set();
          for (const relatedID of relatedIDs) {
            map[relatingID].add(relatedID);
            // if (!map[relatedID]) map[relatedID] = [];
            // map[relatedID].add(relatingID);
            if (!map[relatedID]) map[relatedID] = new Set();
            map[relatedID].add(relatedID);
          }
        }
      );
    }

    this._indexedModels[model.uuid] = map;
    return map;
  }

  find(model: FragmentsGroup, queryGroups: QueryGroup[]) {
    let map = this._indexedModels[model.uuid];
    if (!map) map = this.indexEntityRelations(model);
    let relations: number[] = [];
    for (const [index, group] of queryGroups.entries()) {
      const groupResult = this.simpleQuery(model, group);
      const groupRelations: number[] = [];
      for (const expressID of groupResult) {
        const relations = map[expressID];
        if (!relations) continue;
        groupRelations.push(...relations, expressID);
      }
      relations =
        group.operator === "AND" && index > 0
          ? this.getCommonElements(relations, groupRelations)
          : [...relations, ...groupRelations];
    }
    const result = { [model.uuid]: new Set(relations) };
    const categoriesMap: { [category: string]: number[] } = {};
    result[model.uuid].forEach((r) => {
      const entity = model.properties[r];
      if (!entity) return;
      const entityName = IfcCategoryMap[entity.type];
      if (!categoriesMap[entityName]) categoriesMap[entityName] = [];
      categoriesMap[entityName].push(r);
    });
    console.log(categoriesMap);
    this.onFound.trigger(result);
    return result;
  }

  private simpleQuery(model: FragmentsGroup, queryGroup: QueryGroup) {
    const properties = model.properties as IfcProperties;
    if (!properties) throw new Error("Model has no properties");
    let filteredProps = {};
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
          query as AttributeQuery
        );
        queryResult = matchingResult.expressIDs;
        filteredProps = { ...filteredProps, ...matchingResult.entities };
      } else {
        queryResult = [...this.simpleQuery(model, query as QueryGroup)];
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
    entities: Record<string, Record<string, any>>,
    query: AttributeQuery
  ) {
    const { attribute: attributeName, condition, value } = query;
    const handleAttribute = !this._noHandleAttributes.includes(attributeName);
    const expressIDs: number[] = [];
    const matchingEntities: Record<string, Record<string, any>>[] = [];
    for (const expressID in entities) {
      const entity = entities[expressID];
      const attribute = entity[attributeName];
      const attributeValue = handleAttribute ? attribute?.value : attribute;
      if (attributeValue === undefined || attributeValue === null) continue;
      let conditionMatches = this._conditionFunctions[condition](
        attributeValue,
        value
      );
      if (query.negateResult) conditionMatches = !conditionMatches;
      if (!conditionMatches) continue;
      expressIDs.push(entity.expressID);
      matchingEntities.push(entity);
    }
    return { expressIDs, entities: matchingEntities };
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

  get(): null {
    throw new Error("Method not implemented.");
  }
}
