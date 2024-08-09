import * as WEBIFC from "web-ifc";
import { FragmentsGroup } from "@thatopen/fragments";
import { Disposable, Event, Component, Components } from "../../core";
import { FragmentsManager } from "../../fragments/FragmentsManager";
import {
  RelationsMap,
  ModelsRelationMap,
  InverseAttributes,
  InverseAttribute,
  IfcRelations,
} from "./src/types";
import { relToAttributesMap } from "./src/relToAttributesMap";

// TODO: Refactor to combine logic from process and processFromWebIfc

export type { InverseAttribute, RelationsMap } from "./src/types";

/**
 * Indexer component for IFC entities, facilitating the indexing and retrieval of IFC entity relationships. It is designed to process models properties by indexing their IFC entities' relations based on predefined inverse attributes, and provides methods to query these relations. 📕 [Tutorial](https://docs.thatopen.com/Tutorials/Components/Core/IfcRelationsIndexer). 📘 [API](https://docs.thatopen.com/api/@thatopen/components/classes/IfcRelationsIndexer).
 */
export class IfcRelationsIndexer extends Component implements Disposable {
  /**
   * A unique identifier for the component.
   * This UUID is used to register the component within the Components system.
   */
  static readonly uuid = "23a889ab-83b3-44a4-8bee-ead83438370b" as const;

  /** {@link Disposable.onDisposed} */
  readonly onDisposed = new Event<string>();

  /**
   * Event triggered when relations for a model have been indexed.
   * This event provides the model's UUID and the relations map generated for that model.
   *
   * @property {string} modelID - The UUID of the model for which relations have been indexed.
   * @property {RelationsMap} relationsMap - The relations map generated for the specified model.
   * The map keys are expressIDs of entities, and the values are maps where each key is a relation type ID and its value is an array of expressIDs of entities related through that relation type.
   */
  readonly onRelationsIndexed = new Event<{
    modelID: string;
    relationsMap: RelationsMap;
  }>();

  /**
   * Holds the relationship mappings for each model processed by the indexer.
   * The structure is a map where each key is a model's UUID, and the value is another map.
   * This inner map's keys are entity expressIDs, and its values are maps where each key is an index
   * representing a specific relation type, and the value is an array of expressIDs of entities
   * that are related through that relation type. This structure allows for efficient querying
   * of entity relationships within a model.
   */
  readonly relationMaps: ModelsRelationMap = {};

  /** {@link Component.enabled} */
  enabled: boolean = true;

  private _relToAttributesMap = relToAttributesMap;

  private _inverseAttributes: InverseAttributes = [
    "IsDecomposedBy",
    "Decomposes",
    "AssociatedTo",
    "HasAssociations",
    "ClassificationForObjects",
    "IsGroupedBy",
    "HasAssignments",
    "IsDefinedBy",
    "DefinesOcurrence",
    "IsTypedBy",
    "Types",
    "Defines",
    "ContainedInStructure",
    "ContainsElements",
    "HasControlElements",
    "AssignedToFlowElement",
    "ConnectedTo",
    "ConnectedFrom",
    "ReferencedBy",
    "Declares",
    "HasContext",
    "Controls",
    "IsNestedBy",
    "Nests",
  ];

  private _ifcRels: IfcRelations = [
    WEBIFC.IFCRELAGGREGATES,
    WEBIFC.IFCRELASSOCIATESMATERIAL,
    WEBIFC.IFCRELASSOCIATESCLASSIFICATION,
    WEBIFC.IFCRELASSIGNSTOGROUP,
    WEBIFC.IFCRELDEFINESBYPROPERTIES,
    WEBIFC.IFCRELDEFINESBYTYPE,
    WEBIFC.IFCRELDEFINESBYTEMPLATE,
    WEBIFC.IFCRELCONTAINEDINSPATIALSTRUCTURE,
    WEBIFC.IFCRELFLOWCONTROLELEMENTS,
    WEBIFC.IFCRELCONNECTSELEMENTS,
    WEBIFC.IFCRELASSIGNSTOPRODUCT,
    WEBIFC.IFCRELDECLARES,
    WEBIFC.IFCRELASSIGNSTOCONTROL,
    WEBIFC.IFCRELNESTS,
  ];

  constructor(components: Components) {
    super(components);
    this.components.add(IfcRelationsIndexer.uuid, this);
    const fragmentManager = components.get(FragmentsManager);
    fragmentManager.onFragmentsDisposed.add(this.onFragmentsDisposed);
  }

  private onFragmentsDisposed = (data: {
    groupID: string;
    fragmentIDs: string[];
  }) => {
    delete this.relationMaps[data.groupID];
  };

  private indexRelations(
    relationsMap: RelationsMap,
    relAttrs: any,
    related: InverseAttribute,
    relating: InverseAttribute,
  ) {
    const relatingKey = Object.keys(relAttrs).find((key) =>
      key.startsWith("Relating"),
    );
    const relatedKey = Object.keys(relAttrs).find((key) =>
      key.startsWith("Related"),
    );
    if (!(relatingKey && relatedKey)) return;
    const relatingID = relAttrs[relatingKey].value;
    const relatedIDs = relAttrs[relatedKey].map((el: any) => el.value);

    // forRelating
    const currentMap =
      relationsMap.get(relatingID) ?? new Map<number, number[]>();
    const index = this.getAttributeIndex(relating);
    if (index !== null) {
      currentMap.set(index, relatedIDs);
      relationsMap.set(relatingID, currentMap);
    }

    // forRelated
    for (const id of relatedIDs) {
      const currentMap = relationsMap.get(id) ?? new Map<number, number[]>();
      const index = this.getAttributeIndex(related);
      if (!index) continue;
      const relations = currentMap.get(index) ?? [];
      relations.push(relatingID);
      currentMap.set(index, relations);
      relationsMap.set(id, currentMap);
    }
  }

  private getAttributeIndex(inverseAttribute: InverseAttribute) {
    const index = this._inverseAttributes.indexOf(inverseAttribute);
    if (index === -1) return null;
    return index;
  }

  /**
   * Adds a relation map to the model's relations map.
   *
   * @param model - The `FragmentsGroup` model to which the relation map will be added.
   * @param relationMap - The `RelationsMap` to be added to the model's relations map.
   *
   * @fires onRelationsIndexed - Triggers an event with the model's UUID and the added relation map.
   */
  setRelationMap(model: FragmentsGroup, relationMap: RelationsMap) {
    this.relationMaps[model.uuid] = relationMap;
    this.onRelationsIndexed.trigger({
      modelID: model.uuid,
      relationsMap: relationMap,
    });
  }

  /**
   * Processes a given model to index its IFC entities relations based on predefined inverse attributes.
   * This method iterates through each specified inverse attribute, retrieves the corresponding relations,
   * and maps them in a structured way to facilitate quick access to related entities.
   *
   * The process involves querying the model for each relation type associated with the inverse attributes
   * and updating the internal relationMaps with the relationships found. This map is keyed by the model's UUID
   * and contains a nested map where each key is an entity's expressID and its value is another map.
   * This inner map's keys are the indices of the inverse attributes, and its values are arrays of expressIDs
   * of entities that are related through that attribute.
   *
   * @param model The `FragmentsGroup` model to be processed. It must have properties loaded.
   * @returns A promise that resolves to the relations map for the processed model. This map is a detailed
   * representation of the relations indexed by entity expressIDs and relation types.
   * @throws An error if the model does not have properties loaded.
   */
  async process(model: FragmentsGroup) {
    if (!model.hasProperties)
      throw new Error("FragmentsGroup properties not found");

    let relationsMap = this.relationMaps[model.uuid];
    if (relationsMap) {
      return relationsMap;
    }

    relationsMap = new Map();

    for (const relType of this._ifcRels) {
      const relsAttrs = await model.getAllPropertiesOfType(relType);
      if (!relsAttrs) {
        continue;
      }

      const relInverseAttributes = this._relToAttributesMap.get(relType);
      if (!relInverseAttributes) {
        continue;
      }

      const { forRelated: related, forRelating: relating } =
        relInverseAttributes;

      for (const expressID in relsAttrs) {
        const relAttrs = relsAttrs[expressID];
        this.indexRelations(relationsMap, relAttrs, related, relating);
      }
    }

    this.setRelationMap(model, relationsMap);
    return relationsMap;
  }

  /**
   * Processes a given model from a WebIfc API to index its IFC entities relations.
   *
   * @param ifcApi - The WebIfc API instance from which to retrieve the model's properties.
   * @param modelID - The unique identifier of the model within the WebIfc API.
   * @returns A promise that resolves to the relations map for the processed model.
   *          This map is a detailed representation of the relations indexed by entity expressIDs and relation types.
   */
  async processFromWebIfc(ifcApi: WEBIFC.IfcAPI, modelID: number) {
    const relationsMap: RelationsMap = new Map();

    for (const relType of this._ifcRels) {
      const relInverseAttributes = this._relToAttributesMap.get(relType);
      if (!relInverseAttributes) continue;
      const { forRelated: related, forRelating: relating } =
        relInverseAttributes;
      const relExpressIDs = ifcApi.GetLineIDsWithType(modelID, relType);
      for (let i = 0; i < relExpressIDs.size(); i++) {
        const relAttrs = await ifcApi.properties.getItemProperties(
          modelID,
          relExpressIDs.get(i),
        );
        this.indexRelations(relationsMap, relAttrs, related, relating);
      }
    }

    this.onRelationsIndexed.trigger({
      modelID: modelID.toString(),
      relationsMap,
    });

    return relationsMap;
  }

  /**
   * Retrieves the relations of a specific entity within a model based on the given relation name.
   * This method searches the indexed relation maps for the specified model and entity,
   * returning the IDs of related entities if a match is found.
   *
   * @param model The `FragmentsGroup` model containing the entity.
   * @param expressID The unique identifier of the entity within the model.
   * @param relationName The IFC schema inverse attribute of the relation to search for (e.g., "IsDefinedBy", "ContainsElements").
   * @returns An array of express IDs representing the related entities, or `null` if no relations are found
   * or the specified relation name is not indexed.
   */
  getEntityRelations(
    model: FragmentsGroup,
    expressID: number,
    relationName: InverseAttribute,
  ) {
    const indexMap = this.relationMaps[model.uuid];
    if (!indexMap) {
      throw new Error(
        `IfcRelationsIndexer: model ${model.uuid} has no relations indexed.`,
      );
    }
    const entityRelations = indexMap.get(expressID);
    const attributeIndex = this.getAttributeIndex(relationName);
    if (entityRelations === undefined || attributeIndex === null) {
      return null;
    }
    const relations = entityRelations.get(attributeIndex);
    if (!relations) {
      return null;
    }
    return relations;
  }

  /**
   * Serializes the relations of a given relation map into a JSON string.
   * This method iterates through the relations in the given map, organizing them into a structured object where each key is an expressID of an entity,
   * and its value is another object mapping relation indices to arrays of related entity expressIDs.
   * The resulting object is then serialized into a JSON string.
   *
   * @param relationMap - The map of relations to be serialized. The map keys are expressIDs of entities, and the values are maps where each key is a relation type ID and its value is an array of expressIDs of entities related through that relation type.
   * @returns A JSON string representing the serialized relations of the given relation map.
   */
  serializeRelations(relationMap: RelationsMap) {
    const object: Record<string, Record<string, number[]>> = {};
    for (const [expressID, relations] of relationMap.entries()) {
      if (!object[expressID]) object[expressID] = {};
      for (const [relationID, relationEntities] of relations.entries()) {
        object[expressID][relationID] = relationEntities;
      }
    }
    return JSON.stringify(object);
  }

  /**
   * Serializes the relations of a specific model into a JSON string.
   * This method iterates through the relations indexed for the given model,
   * organizing them into a structured object where each key is an expressID of an entity,
   * and its value is another object mapping relation indices to arrays of related entity expressIDs.
   * The resulting object is then serialized into a JSON string.
   *
   * @param model The `FragmentsGroup` model whose relations are to be serialized.
   * @returns A JSON string representing the serialized relations of the specified model.
   * If the model has no indexed relations, `null` is returned.
   */
  serializeModelRelations(model: FragmentsGroup) {
    const relationsMap = this.relationMaps[model.uuid];
    if (!relationsMap) return null;
    const json = this.serializeRelations(relationsMap);
    return json;
  }

  /**
   * Serializes all relations of every model processed by the indexer into a JSON string.
   * This method iterates through each model's relations indexed in `relationMaps`, organizing them
   * into a structured JSON object. Each top-level key in this object corresponds to a model's UUID,
   * and its value is another object mapping entity expressIDs to their related entities, categorized
   * by relation types. The structure facilitates easy access to any entity's relations across all models.
   *
   * @returns A JSON string representing the serialized relations of all models processed by the indexer.
   *          If no relations have been indexed, an empty object is returned as a JSON string.
   */
  serializeAllRelations() {
    const jsonObject: Record<
      string,
      Record<string, Record<string, number[]>>
    > = {};
    for (const uuid in this.relationMaps) {
      const indexMap = this.relationMaps[uuid];
      const object: Record<string, Record<string, number[]>> = {};
      for (const [expressID, relations] of indexMap.entries()) {
        if (!object[expressID]) object[expressID] = {};
        for (const [relationID, relationEntities] of relations.entries()) {
          object[expressID][relationID] = relationEntities;
        }
      }
      jsonObject[uuid] = object;
    }
    return JSON.stringify(jsonObject);
  }

  /**
   * Converts a JSON string representing relations between entities into a structured map.
   * This method parses the JSON string to reconstruct the relations map that indexes
   * entity relations by their express IDs. The outer map keys are the express IDs of entities,
   * and the values are maps where each key is a relation type ID and its value is an array
   * of express IDs of entities related through that relation type.
   *
   * @param json The JSON string to be parsed into the relations map.
   * @returns A `Map` where the key is the express ID of an entity as a number, and the value
   * is another `Map`. This inner map's key is the relation type ID as a number, and its value
   * is an array of express IDs (as numbers) of entities related through that relation type.
   */
  getRelationsMapFromJSON(json: string) {
    const relations = JSON.parse(json);
    const indexMap: RelationsMap = new Map();
    for (const expressID in relations) {
      const expressIDRelations = relations[expressID];
      const relationMap = new Map<number, number[]>();
      for (const relationID in expressIDRelations) {
        relationMap.set(Number(relationID), expressIDRelations[relationID]);
      }
      indexMap.set(Number(expressID), relationMap);
    }
    return indexMap;
  }

  /** {@link Disposable.dispose} */
  dispose() {
    (this.relationMaps as any) = {};
    const fragmentManager = this.components.get(FragmentsManager);
    fragmentManager.onFragmentsDisposed.remove(this.onFragmentsDisposed);
    this.onDisposed.trigger(IfcRelationsIndexer.uuid);
    this.onDisposed.reset();
  }

  /**
   * Adds relations between an entity and other entities in a BIM model.
   *
   * @param model - The BIM model to which the relations will be added.
   * @param expressID - The expressID of the entity within the model.
   * @param relationName - The IFC schema inverse attribute of the relation to add (e.g., "IsDefinedBy", "ContainsElements").
   * @param relIDs - The expressIDs of the related entities within the model.
   *
   * @throws An error if the relation name is not a valid relation name.
   */
  addEntityRelations(
    model: FragmentsGroup,
    expressID: number,
    relationName: InverseAttribute,
    ...relIDs: number[]
  ) {
    const existingRelations = this.getEntityRelations(
      model,
      expressID,
      relationName,
    );
    if (!existingRelations) {
      const attributeIndex = this.getAttributeIndex(relationName);
      if (!attributeIndex) {
        throw new Error(
          `IfcRelationsIndexer: ${relationName} is not a valid relation name.`,
        );
      }
      const entityRelations = this.relationMaps[model.uuid].get(expressID);
      entityRelations?.set(attributeIndex, relIDs);
    } else {
      existingRelations.push(...relIDs);
    }
  }

  /**
   * Gets the children of the given element recursively. E.g. in a model with project - site - building - storeys - rooms, passing a storey will include all its children and the children of the rooms contained in it.
   *
   * @param model The BIM model whose children to get.
   * @param expressID The expressID of the item whose children to get.
   * @param found An optional parameter that includes a set of expressIDs where the found element IDs will be added.
   *
   * @returns A `Set` with the expressIDs of the found items.
   */
  getEntityChildren(
    model: FragmentsGroup,
    expressID: number,
    found = new Set<number>(),
  ) {
    found.add(expressID);

    const modelRelations = this.relationMaps[model.uuid];
    if (modelRelations === undefined) {
      throw new Error(
        "The provided model has no indices. You have to generate them first.",
      );
    }

    // Spatial structure elements contained in this item
    const spatialRels = this.getEntityRelations(
      model,
      expressID,
      "IsDecomposedBy",
    );
    if (spatialRels) {
      for (const id of spatialRels) {
        this.getEntityChildren(model, id, found);
      }
    }

    // Elements contained in this item
    const rels = this.getEntityRelations(model, expressID, "ContainsElements");
    if (rels) {
      for (const id of rels) {
        this.getEntityChildren(model, id, found);
      }
    }

    return found;
  }
}
