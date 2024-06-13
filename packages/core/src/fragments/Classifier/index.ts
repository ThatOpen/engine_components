import * as THREE from "three";
import * as FRAGS from "@thatopen/fragments";
import { Disposable, Component, Event, Components } from "../../core";
import { IfcCategoryMap, IfcPropertiesUtils } from "../../ifc";
import { IfcRelationsIndexer } from "../../ifc/IfcRelationsIndexer";
import { FragmentsManager } from "../FragmentsManager";

/**
 * Interface representing a classification system. The classification is organized by system and class name, and each class contains a map of fragment IDs to their respective express IDs.
 */
export interface Classification {
  /**
   * A system within the classification.
   * The key is the system name, and the value is an object representing the classes within the system.
   */
  [system: string]: {
    /**
     * A class within the system.
     * The key is the class name, and the value is a map of fragment IDs to their respective express IDs.
     */
    [className: string]: FRAGS.FragmentIdMap;
  };
}

/**
 * The Classifier component is responsible for classifying and categorizing fragments based on various criteria. It provides methods to add, remove, find, and filter fragments based on their classification. 📕 [Tutorial](https://docs.thatopen.com/Tutorials/Components/Core/Classifier). 📘 [API](https://docs.thatopen.com/api/@thatopen/components/classes/Classifier).
 */
export class Classifier extends Component implements Disposable {
  /**
   * A unique identifier for the component.
   * This UUID is used to register the component within the Components system.
   */
  static readonly uuid = "e25a7f3c-46c4-4a14-9d3d-5115f24ebeb7" as const;

  /** {@link Component.enabled} */
  enabled = true;

  /**
   * A map representing the classification systems.
   * The key is the system name, and the value is an object representing the classes within the system.
   */
  list: Classification = {};

  /** {@link Disposable.onDisposed} */
  readonly onDisposed = new Event();

  constructor(components: Components) {
    super(components);
    components.add(Classifier.uuid, this);
    const fragmentManager = components.get(FragmentsManager);
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

  /** {@link Disposable.dispose} */
  dispose() {
    this.list = {};
    const fragmentManager = this.components.get(FragmentsManager);
    fragmentManager.onFragmentsDisposed.remove(this.onFragmentsDisposed);
    this.onDisposed.trigger();
    this.onDisposed.reset();
  }

  /**
   * Removes a fragment from the classification based on its unique identifier (guid).
   * This method iterates through all classification systems and classes, and deletes the fragment with the specified guid from the respective group.
   *
   * @param guid - The unique identifier of the fragment to be removed.
   */
  remove(guid: string) {
    for (const systemName in this.list) {
      const system = this.list[systemName];
      for (const groupName in system) {
        const group = system[groupName];
        delete group[guid];
      }
    }
  }

  /**
   * Finds and returns fragments based on the provided filter criteria.
   * If no filter is provided, it returns all fragments.
   *
   * @param filter - An optional object containing filter criteria.
   * The keys of the object represent the classification system names,
   * and the values are arrays of class names to match.
   *
   * @returns A map of fragment GUIDs to their respective express IDs,
   * where the express IDs are filtered based on the provided filter criteria.
   *
   * @throws Will throw an error if the fragments map is malformed.
   */
  find(filter?: { [name: string]: string[] }) {
    const fragments = this.components.get(FragmentsManager);
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

  /**
   * Classifies fragments based on their modelID.
   *
   * @param modelID - The unique identifier of the model to classify fragments by.
   * @param group - The FragmentsGroup containing the fragments to be classified.
   *
   * @remarks
   * This method iterates through the fragments in the provided group,
   * and classifies them based on their modelID.
   * The classification is stored in the `list.models` property,
   * with the modelID as the key and a map of fragment IDs to their respective express IDs as the value.
   *
   */
  byModel(modelID: string, group: FRAGS.FragmentsGroup) {
    if (!this.list.models) {
      this.list.models = {};
    }
    const modelsClassification = this.list.models;
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

  /**
   * Classifies fragments based on their PredefinedType property.
   *
   * @param group - The FragmentsGroup containing the fragments to be classified.
   *
   * @remarks
   * This method iterates through the properties of the fragments in the provided group,
   * and classifies them based on their PredefinedType property.
   * The classification is stored in the `list.predefinedTypes` property,
   * with the PredefinedType as the key and a map of fragment IDs to their respective express IDs as the value.
   *
   * @throws Will throw an error if the fragment ID is not found.
   */
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

  /**
   * Classifies fragments based on their entity type.
   *
   * @param group - The FragmentsGroup containing the fragments to be classified.
   *
   * @remarks
   * This method iterates through the relations of the fragments in the provided group,
   * and classifies them based on their entity type.
   * The classification is stored in the `list.entities` property,
   * with the entity type as the key and a map of fragment IDs to their respective express IDs as the value.
   *
   * @throws Will throw an error if the fragment ID is not found.
   */
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

  /**
   * Classifies fragments based on a specific IFC relationship.
   *
   * @param group - The FragmentsGroup containing the fragments to be classified.
   * @param ifcRel - The IFC relationship number to classify fragments by.
   * @param systemName - The name of the classification system to store the classification.
   *
   * @remarks
   * This method iterates through the relations of the fragments in the provided group,
   * and classifies them based on the specified IFC relationship.
   * The classification is stored in the `list` property under the specified system name,
   * with the relationship name as the class name and a map of fragment IDs to their respective express IDs as the value.
   *
   * @throws Will throw an error if the fragment ID is not found or if the IFC relationship is not valid.
   */
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

  /**
   * Classifies fragments based on their spatial structure in the IFC model.
   *
   * @param model - The FragmentsGroup containing the fragments to be classified.
   *
   * @remarks
   * This method iterates through the relations of the fragments in the provided group,
   * and classifies them based on their spatial structure in the IFC model.
   * The classification is stored in the `list` property under the system name "spatialStructures",
   * with the relationship name as the class name and a map of fragment IDs to their respective express IDs as the value.
   *
   * @throws Will throw an error if the fragment ID is not found or if the model relations do not exist.
   */
  async bySpatialStructure(model: FRAGS.FragmentsGroup) {
    const indexer = this.components.get(IfcRelationsIndexer);
    const modelRelations = indexer.relationMaps[model.uuid];
    if (!modelRelations)
      throw new Error(
        `Classifier: model relations of ${model.name || model.uuid} have to exists to group by spatial structure.`,
      );
    const systemName = "spatialStructures";
    for (const [expressID] of modelRelations) {
      const rels = indexer.getEntityRelations(
        model,
        expressID,
        "ContainsElements",
      );
      const relAttrs = await model.getProperties(expressID);
      if (!(rels && relAttrs)) continue;
      const relName = relAttrs.Name?.value;
      for (const id of rels) {
        this.saveItem(model, systemName, relName, id);
        const decompositionRelations = indexer.getEntityRelations(
          model,
          Number(id),
          "IsDecomposedBy",
        );
        if (!decompositionRelations) continue;
        for (const decomposedID of decompositionRelations) {
          this.saveItem(model, systemName, relName, decomposedID);
        }
      }
    }
  }

  /**
   * Sets the color of the specified fragments.
   *
   * @param items - A map of fragment IDs to their respective express IDs.
   * @param color - The color to set for the fragments.
   * @param override - A boolean indicating whether to override the existing color of the fragments.
   *
   * @remarks
   * This method iterates through the provided fragment IDs, retrieves the corresponding fragments,
   * and sets their color using the `setColor` method of the FragmentsGroup class.
   *
   * @throws Will throw an error if the fragment with the specified ID is not found.
   */
  setColor(items: FRAGS.FragmentIdMap, color: THREE.Color, override = false) {
    const fragments = this.components.get(FragmentsManager);
    for (const fragID in items) {
      const found = fragments.list.get(fragID);
      if (!found) continue;
      const ids = items[fragID];
      found.setColor(color, ids, override);
    }
  }

  /**
   * Resets the color of the specified fragments to their original color.
   *
   * @param items - A map of fragment IDs to their respective express IDs.
   *
   * @remarks
   * This method iterates through the provided fragment IDs, retrieves the corresponding fragments,
   * and resets their color using the `resetColor` method of the FragmentsGroup class.
   *
   * @throws Will throw an error if the fragment with the specified ID is not found.
   */
  resetColor(items: FRAGS.FragmentIdMap) {
    const fragments = this.components.get(FragmentsManager);
    for (const fragID in items) {
      const found = fragments.list.get(fragID);
      if (!found) continue;
      const ids = items[fragID];
      found.resetColor(ids);
    }
  }

  protected saveItem(
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
