import * as WEBIFC from "web-ifc";
import { FragmentsGroup } from "@thatopen/fragments";
import { Component, Disposable, Event, Components } from "../../core";
import { IfcPropertiesUtils } from "../Utils";
import { IfcLoader } from "../../fragments/IfcLoader";
import { UUID } from "../../utils";
import { IfcRelation, IfcRelationsIndexer } from "../IfcRelationsIndexer";
import { ifcRelAttrsPosition, ifcRelClassNames } from "./src";

/**
 * Types for boolean properties in IFC schema.
 */
export type BooleanPropTypes = "IfcBoolean" | "IfcLogical";

/**
 * Types for string properties in IFC schema.
 */
export type StringPropTypes = "IfcText" | "IfcLabel" | "IfcIdentifier";

/**
 * Types for numeric properties in IFC schema.
 */
export type NumericPropTypes = "IfcInteger" | "IfcReal";

/**
 * Interface representing a map of changed entities in a model. The keys are model UUIDs, and the values are sets of express IDs of changed entities.
 */
export interface ChangeMap {
  [modelID: string]: Set<number>;
}

/**
 * Interface representing a map of attribute listeners. The keys are model UUIDs, and the values are objects with express IDs as keys, and objects with attribute names as keys, and Event objects as values.
 */
export interface AttributeListener {
  [modelID: string]: {
    [expressID: number]: {
      [attributeName: string]: Event<String | Boolean | Number>;
    };
  };
}

/**
 * Component to manage and edit properties and Psets in IFC files.
 */
export class IfcPropertiesManager extends Component implements Disposable {
  /**
   * A unique identifier for the component.
   * This UUID is used to register the component within the Components system.
   */
  static readonly uuid = "58c2d9f0-183c-48d6-a402-dfcf5b9a34df" as const;

  /** {@link Disposable.onDisposed} */
  readonly onDisposed = new Event<string>();

  /**
   * Event triggered when a file is requested for export.
   */
  readonly onRequestFile = new Event();

  /**
   * ArrayBuffer containing the IFC data to be exported.
   */
  ifcToExport: ArrayBuffer | null = null;

  /**
   * Event triggered when an element is added to a Pset.
   */
  readonly onElementToPset = new Event<{
    model: FragmentsGroup;
    psetID: number;
    elementID: number;
  }>();

  /**
   * Event triggered when a property is added to a Pset.
   */
  readonly onPropToPset = new Event<{
    model: FragmentsGroup;
    psetID: number;
    propID: number;
  }>();

  /**
   * Event triggered when a Pset is removed.
   */
  readonly onPsetRemoved = new Event<{
    model: FragmentsGroup;
    psetID: number;
  }>();

  /**
   * Event triggered when data in the model changes.
   */
  readonly onDataChanged = new Event<{
    model: FragmentsGroup;
    expressID: number;
  }>();

  /**
   * Configuration for the WebAssembly module.
   */
  wasm = {
    path: "/",
    absolute: false,
  };

  /** {@link Component.enabled} */
  enabled = true;

  /**
   * Map of attribute listeners.
   */
  attributeListeners: AttributeListener = {};

  /**
   * The currently selected model.
   */
  selectedModel?: FragmentsGroup;

  /**
   * Map of changed entities in the model.
   */
  changeMap: ChangeMap = {};

  constructor(components: Components) {
    super(components);
    this.components.add(IfcPropertiesManager.uuid, this);
  }

  /** {@link Disposable.dispose} */
  dispose() {
    this.selectedModel = undefined;
    this.attributeListeners = {};
    this.changeMap = {};
    this.onElementToPset.reset();
    this.onPropToPset.reset();
    this.onPsetRemoved.reset();
    this.onDataChanged.reset();
    this.onDisposed.trigger(IfcPropertiesManager.uuid);
    this.onDisposed.reset();
  }

  /**
   * Static method to retrieve the IFC schema from a given model.
   *
   * @param model - The FragmentsGroup model from which to retrieve the IFC schema.
   * @throws Will throw an error if the IFC schema is not found in the model.
   * @returns The IFC schema associated with the given model.
   */
  static getIFCSchema(model: FragmentsGroup) {
    const schema = model.ifcMetadata.schema;
    if (!schema) {
      throw new Error("IFC Schema not found");
    }
    if (schema.startsWith("IFC2X3")) {
      return "IFC2X3";
    }
    if (schema.startsWith("IFC4") && schema.replace("IFC4", "") === "") {
      return "IFC4";
    }
    if (schema.startsWith("IFC4X3")) {
      return "IFC4X3";
    }
    return schema;
  }

  /**
   * Method to add or update entity attributes in the model.
   *
   * @param model - The FragmentsGroup model in which to set the properties.
   * @param dataToSave - An array of objects representing the properties to be saved.
   * Each object must have an `expressID` property, which is the express ID of the entity in the model.
   * The rest of the properties will be set as the properties of the entity.
   *
   * @returns A promise that resolves when all the properties have been set.
   *
   * @throws Will throw an error if any of the `expressID` properties are missing in the `dataToSave` array.
   */
  async setData(model: FragmentsGroup, ...dataToSave: Record<string, any>[]) {
    for (const data of dataToSave) {
      const { expressID } = data;
      if (!expressID || expressID === -1) {
        data.expressID = this.getNewExpressID(model);
      }
      await model.setProperties(data.expressID, data);
      this.registerChange(model, data.expressID);
    }
  }

  /**
   * Creates a new Property Set (Pset) in the given model.
   *
   * @param model - The FragmentsGroup model in which to create the Pset.
   * @param name - The name of the Pset.
   * @param description - (Optional) The description of the Pset.
   *
   * @returns A promise that resolves with an object containing the newly created Pset and its relation.
   *
   * @throws Will throw an error if the IFC schema is not found in the model.
   * @throws Will throw an error if no OwnerHistory is found in the model.
   */
  async newPset(model: FragmentsGroup, name: string, description?: string) {
    const schema = IfcPropertiesManager.getIFCSchema(model);
    const { handle: ownerHistoryHandle } = await this.getOwnerHistory(model);

    const psetGlobalId = this.newGUID(model);
    const psetName = new WEBIFC[schema].IfcLabel(name);
    const psetDescription = description
      ? new WEBIFC[schema].IfcText(description)
      : null;
    const pset = new WEBIFC[schema].IfcPropertySet(
      psetGlobalId,
      ownerHistoryHandle,
      psetName,
      psetDescription,
      [],
    );

    pset.expressID = this.getNewExpressID(model);
    await this.setData(model, pset);

    return { pset };
  }

  /**
   * Removes a Property Set (Pset) from the given model.
   *
   * @param model - The FragmentsGroup model from which to remove the Pset.
   * @param psetID - The express IDs of the Psets to be removed.
   *
   * @returns A promise that resolves when all the Psets have been removed.
   *
   * @throws Will throw an error if any of the `expressID` properties are missing in the `psetID` array.
   * @throws Will throw an error if the Pset to be removed is not of type `IFCPROPERTYSET`.
   * @throws Will throw an error if no relation is found between the Pset and the model.
   */
  async removePset(model: FragmentsGroup, ...psetID: number[]) {
    for (const expressID of psetID) {
      const pset = await model.getProperties(expressID);
      if (pset?.type !== WEBIFC.IFCPROPERTYSET) continue;
      const relID = await IfcPropertiesUtils.getPsetRel(model, expressID);
      if (relID) {
        await model.setProperties(relID, null);
        this.registerChange(model, relID);
      }
      if (pset) {
        for (const propHandle of pset.HasProperties) {
          await model.setProperties(propHandle.value, null);
        }
        await model.setProperties(expressID, null);
        this.onPsetRemoved.trigger({ model, psetID: expressID });
        this.registerChange(model, expressID);
      }
    }
  }

  /**
   * Creates a new single-value property of type string in the given model.
   *
   * @param model - The FragmentsGroup model in which to create the property.
   * @param type - The type of the property value. Must be a string property type.
   * @param name - The name of the property.
   * @param value - The value of the property. Must be a string.
   *
   * @returns The newly created single-value property.
   *
   * @throws Will throw an error if the IFC schema is not found in the model.
   * @throws Will throw an error if no OwnerHistory is found in the model.
   */
  newSingleStringProperty(
    model: FragmentsGroup,
    type: StringPropTypes,
    name: string,
    value: string,
  ) {
    return this.newSingleProperty(model, type, name, value);
  }

  /**
   * Creates a new single-value property of type numeric in the given model.
   *
   * @param model - The FragmentsGroup model in which to create the property.
   * @param type - The type of the property value. Must be a numeric property type.
   * @param name - The name of the property.
   * @param value - The value of the property. Must be a number.
   *
   * @returns The newly created single-value property.
   *
   * @throws Will throw an error if the IFC schema is not found in the model.
   * @throws Will throw an error if no OwnerHistory is found in the model.
   */
  newSingleNumericProperty(
    model: FragmentsGroup,
    type: NumericPropTypes,
    name: string,
    value: number,
  ) {
    return this.newSingleProperty(model, type, name, value);
  }

  /**
   * Creates a new single-value property of type boolean in the given model.
   *
   * @param model - The FragmentsGroup model in which to create the property.
   * @param type - The type of the property value. Must be a boolean property type.
   * @param name - The name of the property.
   * @param value - The value of the property. Must be a boolean.
   *
   * @returns The newly created single-value property.
   *
   * @throws Will throw an error if the IFC schema is not found in the model.
   * @throws Will throw an error if no OwnerHistory is found in the model.
   */
  newSingleBooleanProperty(
    model: FragmentsGroup,
    type: BooleanPropTypes,
    name: string,
    value: boolean,
  ) {
    return this.newSingleProperty(model, type, name, value);
  }

  /**
   * Removes a property from a Property Set (Pset) in the given model.
   *
   * @param model - The FragmentsGroup model from which to remove the property.
   * @param psetID - The express ID of the Pset from which to remove the property.
   * @param propID - The express ID of the property to be removed.
   *
   * @returns A promise that resolves when the property has been removed.
   *
   * @throws Will throw an error if the Pset or the property to be removed are not found in the model.
   * @throws Will throw an error if the Pset to be removed is not of type `IFCPROPERTYSET`.
   */
  async removePsetProp(model: FragmentsGroup, psetID: number, propID: number) {
    const pset = await model.getProperties(psetID);
    const prop = await model.getProperties(propID);
    if (!pset || !prop) return;
    if (!(pset.type === WEBIFC.IFCPROPERTYSET && prop)) return;
    pset.HasProperties = pset.HasProperties.filter((handle: any) => {
      return handle.value !== propID;
    });
    await model.setProperties(propID, null);
    this.registerChange(model, psetID, propID);
  }

  /**
   * @deprecated Use indexer.addEntitiesRelation instead. This will be removed in future releases.
   */
  addElementToPset(
    model: FragmentsGroup,
    psetID: number,
    ...expressIDs: number[]
  ) {
    const indexer = this.components.get(IfcRelationsIndexer);
    indexer.addEntitiesRelation(
      model,
      psetID,
      { type: WEBIFC.IFCRELDEFINESBYPROPERTIES, inv: "DefinesOcurrence" },
      ...expressIDs,
    );
  }

  /**
   * Adds elements to a Property Set (Pset) in the given model.
   *
   * @param model - The FragmentsGroup model in which to add the elements.
   * @param psetID - The express ID of the Pset to which to add the elements.
   * @param elementID - The express IDs of the elements to be added.
   *
   * @returns A promise that resolves when all the elements have been added.
   *
   * @throws Will throw an error if the Pset or the elements to be added are not found in the model.
   * @throws Will throw an error if the Pset to be added to is not of type `IFCPROPERTYSET`.
   * @throws Will throw an error if no relation is found between the Pset and the model.
   */
  async addPropToPset(
    model: FragmentsGroup,
    psetID: number,
    ...propID: number[]
  ) {
    const pset = await model.getProperties(psetID);
    if (!pset) return;
    for (const expressID of propID) {
      if (pset.HasProperties.includes(expressID)) {
        continue;
      }
      const elementHandle = new WEBIFC.Handle(expressID);
      pset.HasProperties.push(elementHandle);
      this.onPropToPset.trigger({ model, psetID, propID: expressID });
    }
    this.registerChange(model, psetID);
  }

  /**
   * Creates a new instance of a relationship between entities in the IFC model.
   *
   * @param model - The FragmentsGroup model in which to create the relationship.
   * @param type - The type of the relationship to create.
   * @param relatingID - The express ID of the entity that is related to the other entities.
   * @param relatedIDs - The express IDs of the entities that are related to the relating entity.
   *
   * @returns A promise that resolves with the newly created relationship.
   *
   * @throws Will throw an error if the relationship type is unsupported.
   */
  async createIfcRel(
    model: FragmentsGroup,
    type: IfcRelation,
    relatingID: number,
    relatedIDs: number[],
  ) {
    const relName = ifcRelClassNames[type];
    if (!relName) {
      throw new Error(`IfcPropertiesManager: ${relName} is unsoported.`);
    }

    const schema = IfcPropertiesManager.getIFCSchema(model);
    const attributePositions = ifcRelAttrsPosition[relName];
    // @ts-ignore safe to use ts-ignore as we are checking in the following line if the class exists.
    const RelClass = WEBIFC[schema][relName];
    if (!(attributePositions && RelClass)) {
      throw new Error(`IfcPropertiesManager: ${relName} is unsoported.`);
    }

    const args: any[] = [new WEBIFC[schema].IfcGloballyUniqueId(UUID.create())];

    // const { related, relating } = attributePositions;

    // if (related < relating) {
    //   for (let i = 1; i < related - 1; i++) args.push(null);
    //   const relatedIDsSet = new Set(relatedIDs);
    //   const relatingHandles = [...relatedIDsSet].map(
    //     (expressID) => new WEBIFC.Handle(expressID),
    //   );
    //   args.push(relatingHandles);

    //   for (let i = related; i < relating - 1; i++) args.push(null);
    //   args.push(new WEBIFC.Handle(relatingID));
    // } else {
    //   for (let i = 1; i < relating - 1; i++) args.push(null);
    //   for (let i = relating; i < related - 1; i++) args.push(null);
    //   args.push(new WEBIFC.Handle(relatingID));

    //   const relatedIDsSet = new Set(relatedIDs);
    //   const relatingHandles = [...relatedIDsSet].map(
    //     (expressID) => new WEBIFC.Handle(expressID),
    //   );
    //   args.push(relatingHandles);
    // }

    const { related, relating } = attributePositions;
    const relatedIDsSet = new Set(relatedIDs);
    const relatingHandles = [...relatedIDsSet].map(
      (expressID) => new WEBIFC.Handle(expressID),
    );

    const addNulls = (start: number, end: number) => {
      for (let i = start; i < end - 1; i++) args.push(null);
    };

    if (related < relating) {
      addNulls(1, related);
      args.push(relatingHandles);
      addNulls(related, relating);
      args.push(new WEBIFC.Handle(relatingID));
    } else {
      addNulls(1, relating);
      addNulls(relating, related);
      args.push(new WEBIFC.Handle(relatingID));
      args.push(relatingHandles);
    }

    // @ts-ignore
    const ifcRel = new RelClass(...args);
    await this.setData(model, ifcRel);
    return ifcRel;
  }

  /**
   * Saves the changes made to the model to a new IFC file.
   *
   * @param model - The FragmentsGroup model from which to save the changes.
   * @param ifcToSaveOn - The Uint8Array representing the original IFC file.
   *
   * @returns A promise that resolves with the modified IFC data as a Uint8Array.
   *
   * @throws Will throw an error if any issues occur during the saving process.
   */
  async saveToIfc(model: FragmentsGroup, ifcToSaveOn: Uint8Array) {
    const ifcLoader = this.components.get(IfcLoader);
    const ifcApi = ifcLoader.webIfc;
    const modelID = await ifcLoader.readIfcFile(ifcToSaveOn);
    const indexer = this.components.get(IfcRelationsIndexer);
    await indexer.applyRelationChanges();
    const changes = this.changeMap[model.uuid] ?? [];
    for (const expressID of changes) {
      const data = (await model.getProperties(expressID)) as any;
      if (!data) {
        // If the expressID doesn't exist in the original file, then do nothing.
        // This prevents a memory access out of bounds error from WebIfc.
        const existed = ifcApi.GetLine(modelID, expressID);
        if (existed) ifcApi.DeleteLine(modelID, expressID);
      } else {
        ifcApi.WriteLine(modelID, data);
      }
    }
    const modifiedIFC = ifcApi.SaveModel(modelID);
    ifcLoader.webIfc.CloseModel(modelID);
    ifcLoader.cleanUp();

    return modifiedIFC;
  }

  /**
   * Retrieves all the entities of a specific type from the model and returns their express IDs wrapped in Handles.
   * This is used to make references of an entity inside another entity attributes.
   *
   * @param model - The FragmentsGroup model from which to retrieve the entities.
   * @param type - The type of the entities to retrieve. This should be the express ID of the IFC type.
   *
   * @returns A promise that resolves with an array of Handles, each containing the express ID of an entity of the specified type.
   * @returns null if the model doesn't have any entity of that type
   */
  async getEntityRef(model: FragmentsGroup, type: number) {
    // This can be done very quickly if we add the expressID to IfcType map in FragmentsGroup
    const entities = await model.getAllPropertiesOfType(type);
    if (!entities) return null;
    const handles: WEBIFC.Handle<unknown>[] = [];
    for (const id in entities) {
      const handle = new WEBIFC.Handle(Number(id));
      handles.push(handle);
    }
    return handles;
  }

  /**
   * Sets an attribute listener for a specific attribute of an entity in the model.
   * The listener will trigger an event whenever the attribute's value changes.
   *
   * @param model - The FragmentsGroup model in which to set the attribute listener.
   * @param expressID - The express ID of the entity for which to set the listener.
   * @param attributeName - The name of the attribute for which to set the listener.
   *
   * @returns The event that will be triggered when the attribute's value changes.
   *
   * @throws Will throw an error if the entity with the given expressID doesn't exist.
   * @throws Will throw an error if the attribute is an array or null, and it can't have a listener.
   * @throws Will throw an error if the attribute has a badly defined handle.
   */
  async setAttributeListener(
    model: FragmentsGroup,
    expressID: number,
    attributeName: string,
  ) {
    if (!this.attributeListeners[model.uuid])
      this.attributeListeners[model.uuid] = {};
    const existingListener = this.attributeListeners[model.uuid][expressID]
      ? this.attributeListeners[model.uuid][expressID][attributeName]
      : null;
    if (existingListener) return existingListener;

    const entity = await model.getProperties(expressID);
    if (!entity) {
      throw new Error(`Entity with expressID ${expressID} doesn't exists.`);
    }
    const attribute = entity[attributeName];
    if (Array.isArray(attribute) || !attribute) {
      throw new Error(
        `Attribute ${attributeName} is array or null, and it can't have a listener.`,
      );
    }
    const value = attribute.value;
    if (value === undefined || value == null) {
      throw new Error(`Attribute ${attributeName} has a badly defined handle.`);
    }

    // TODO: Is it good to set all the above as errors? Or better return null?

    // TODO: Do we need an async-await in the following set function?

    const event = new Event<String | Number | Boolean>();
    Object.defineProperty(entity[attributeName], "value", {
      get() {
        return this._value;
      },
      async set(value) {
        this._value = value;
        event.trigger(value);
      },
    });

    entity[attributeName].value = value;

    if (!this.attributeListeners[model.uuid][expressID])
      this.attributeListeners[model.uuid][expressID] = {};
    this.attributeListeners[model.uuid][expressID][attributeName] = event;

    return event;
  }

  private getNewExpressID(model: FragmentsGroup) {
    model.ifcMetadata.maxExpressID++;
    return model.ifcMetadata.maxExpressID;
  }

  private newGUID(model: FragmentsGroup) {
    const schema = IfcPropertiesManager.getIFCSchema(model);
    return new WEBIFC[schema].IfcGloballyUniqueId(UUID.create());
  }

  async getOwnerHistory(model: FragmentsGroup) {
    const ownerHistories = await model.getAllPropertiesOfType(
      WEBIFC.IFCOWNERHISTORY,
    );
    if (!ownerHistories) {
      throw new Error("No OwnerHistory was found.");
    }
    const keys = Object.keys(ownerHistories).map((key) => parseInt(key, 10));
    const entity = ownerHistories[keys[0]];
    const handle = new WEBIFC.Handle(entity.expressID);
    return { entity, handle };
  }

  registerChange(model: FragmentsGroup, ...expressID: number[]) {
    if (!this.changeMap[model.uuid]) {
      this.changeMap[model.uuid] = new Set();
    }
    for (const id of expressID) {
      this.changeMap[model.uuid].add(id);
      this.onDataChanged.trigger({ model, expressID: id });
    }
  }

  async newSingleProperty(
    model: FragmentsGroup,
    type: string,
    name: string,
    value: string | number | boolean,
  ) {
    const schema = IfcPropertiesManager.getIFCSchema(model);
    const propName = new WEBIFC[schema].IfcIdentifier(name);
    // @ts-ignore
    const propValue = new WEBIFC[schema][type](value);
    const prop = new WEBIFC[schema].IfcPropertySingleValue(
      propName,
      null,
      propValue,
      null,
    );
    prop.expressID = this.getNewExpressID(model);
    await this.setData(model, prop);
    return prop;
  }
}

export * from "./src";
