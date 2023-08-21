import * as WEBIFC from "web-ifc";
import { FragmentsGroup } from "bim-fragment";
import { Disposable, Event, Component } from "../../base-types";
import { Components } from "../../core";
import { generateIfcGUID } from "../../utils";
import { IfcPropertiesUtils } from "../IfcPropertiesUtils";
import { EntityActionsUI } from "./src/entity-actions";
import { PsetActionsUI } from "./src/pset-actions";
import { PropActionsUI } from "./src/prop-actions";

type BooleanPropTypes = "IfcBoolean" | "IfcLogical";
type StringPropTypes = "IfcText" | "IfcLabel" | "IfcIdentifier";
type NumericPropTypes = "IfcInteger" | "IfcReal";

interface ChangeMap {
  [modelID: string]: Set<number>;
}

interface AttributeListener {
  [modelID: string]: {
    [expressID: number]: {
      [attributeName: string]: Event<String | Boolean | Number>;
    };
  };
}

export class IfcPropertiesManager
  extends Component<ChangeMap>
  implements Disposable
{
  name: string = "PropertiesManager";
  enabled: boolean = true;
  attributeListeners: AttributeListener = {};

  uiElement: {
    entityActions: EntityActionsUI;
    psetActions: PsetActionsUI;
    propActions: PropActionsUI;
  };

  private _ifcApi: WEBIFC.IfcAPI;
  private _changeMap: ChangeMap = {};

  readonly onElementToPset = new Event<{
    model: FragmentsGroup;
    psetID: number;
    elementID: number;
  }>();

  readonly onPropToPset = new Event<{
    model: FragmentsGroup;
    psetID: number;
    propID: number;
  }>();

  readonly onPsetRemoved = new Event<{
    model: FragmentsGroup;
    psetID: number;
  }>();

  readonly onDataChanged = new Event<{
    model: FragmentsGroup;
    expressID: number;
  }>();

  wasmPath = "/";

  constructor(components: Components, ifcApi?: WEBIFC.IfcAPI) {
    super();
    this._ifcApi = ifcApi ?? new WEBIFC.IfcAPI();
    this._ifcApi.SetWasmPath(this.wasmPath, true);
    this._ifcApi.Init();

    this.uiElement = {
      entityActions: new EntityActionsUI(components),
      psetActions: new PsetActionsUI(components),
      propActions: new PropActionsUI(components),
    };

    this.setUIEvents();
  }

  dispose() {
    (this._ifcApi as any) = null;
    this.attributeListeners = {};
    this._changeMap = {};
    this.onElementToPset.reset();
    this.onPropToPset.reset();
    this.onPsetRemoved.reset();
    this.onDataChanged.reset();
    this.uiElement.entityActions.dispose();
    this.uiElement.psetActions.dispose();
    this.uiElement.propActions.dispose();
  }

  private setUIEvents() {
    this.uiElement.entityActions.onNewPset.on(
      ({ model, elementIDs, name, description }) => {
        const { pset } = this.newPset(
          model,
          name,
          description === "" ? undefined : description
        );

        for (const expressID of elementIDs ?? []) {
          this.addElementToPset(model, pset.expressID, expressID);
        }

        this.uiElement.entityActions.cleanData();
      }
    );
    this.uiElement.propActions.onEditProp.on(
      ({ model, expressID, name, value }) => {
        const { properties } = IfcPropertiesManager.getIFCInfo(model);
        const prop = properties[expressID];
        const { key: valueKey } = IfcPropertiesUtils.getQuantityValue(
          properties,
          expressID
        );

        const { key: nameKey } = IfcPropertiesUtils.getEntityName(
          properties,
          expressID
        );

        if (name !== "" && nameKey) {
          if (prop[nameKey]?.value) {
            prop[nameKey].value = name;
          } else {
            prop.Name = { type: 1, value: name };
          }
        }

        if (value !== "" && valueKey) {
          if (prop[valueKey]?.value) {
            prop[valueKey].value = value;
          } else {
            prop.NominalValue = { type: 1, value }; // Need to change type based on property 1:STRING, 2: LABEL, 3: ENUM, 4: REAL
          }
        }
        this.uiElement.propActions.cleanData();
      }
    );
    this.uiElement.propActions.onRemoveProp.on(
      ({ model, expressID, setID }) => {
        this.removePsetProp(model, setID, expressID);
        this.uiElement.propActions.cleanData();
      }
    );
    this.uiElement.psetActions.onEditPset.on(
      ({ model, psetID, name, description }) => {
        const { properties } = IfcPropertiesManager.getIFCInfo(model);
        const pset = properties[psetID];

        if (name !== "") {
          if (pset.Name?.value) {
            pset.Name.value = name;
          } else {
            pset.Name = { type: 1, value: name };
          }
        }

        if (description !== "") {
          if (pset.Description?.value) {
            pset.Description.value = description;
          } else {
            pset.Description = { type: 1, value: description };
          }
        }
      }
    );
    this.uiElement.psetActions.onRemovePset.on(({ model, psetID }) => {
      this.removePset(model, psetID);
    });
    this.uiElement.psetActions.onNewProp.on(
      ({ model, psetID, name, type, value }) => {
        const prop = this.newSingleStringProperty(
          model,
          type as StringPropTypes,
          name,
          value
        );
        this.addPropToPset(model, psetID, prop.expressID);
      }
    );
  }

  private increaseMaxID(model: FragmentsGroup) {
    model.ifcMetadata.maxExpressID++;
  }

  static getIFCInfo(model: FragmentsGroup) {
    const properties = model.properties;
    if (!properties) throw new Error("FragmentsGroup properties not found");
    const schema = model.ifcMetadata.schema;
    if (!schema) throw new Error("IFC Schema not found");
    return { properties, schema };
  }

  private newGUID(model: FragmentsGroup) {
    const { schema } = IfcPropertiesManager.getIFCInfo(model);
    return new WEBIFC[schema].IfcGloballyUniqueId(generateIfcGUID());
  }

  private getOwnerHistory(model: FragmentsGroup) {
    const { properties } = IfcPropertiesManager.getIFCInfo(model);
    const ownerHistory = IfcPropertiesUtils.findItemOfType(
      properties,
      WEBIFC.IFCOWNERHISTORY
    );
    if (!ownerHistory) throw new Error("No OwnerHistory was found.");
    const ownerHistoryHandle = new WEBIFC.Handle(ownerHistory.expressID);
    return { ownerHistory, ownerHistoryHandle };
  }

  private registerChange(model: FragmentsGroup, ...expressID: number[]) {
    if (!this._changeMap[model.uuid]) this._changeMap[model.uuid] = new Set();
    for (const id of expressID) {
      this._changeMap[model.uuid].add(id);
      this.onDataChanged.trigger({ model, expressID: id });
    }
  }

  setData(model: FragmentsGroup, ...dataToSave: Record<string, any>[]) {
    const { properties } = IfcPropertiesManager.getIFCInfo(model);
    for (const data of dataToSave) {
      const expressID = data.expressID;
      if (!expressID) continue;
      properties[expressID] = data;
      this.registerChange(model, expressID);
    }
  }

  newPset(model: FragmentsGroup, name: string, description?: string) {
    const { schema } = IfcPropertiesManager.getIFCInfo(model);
    const { ownerHistoryHandle } = this.getOwnerHistory(model);

    // Create the Pset
    this.increaseMaxID(model);
    const psetGlobalId = this.newGUID(model);
    const psetName = new WEBIFC[schema].IfcLabel(name);
    const psetDescription = description
      ? new WEBIFC[schema].IfcText(description)
      : null;
    const pset = new WEBIFC[schema].IfcPropertySet(
      model.ifcMetadata.maxExpressID,
      psetGlobalId,
      ownerHistoryHandle,
      psetName,
      psetDescription,
      []
    );

    // Create the Pset relation
    this.increaseMaxID(model);
    const relGlobalId = this.newGUID(model);
    const rel = new WEBIFC[schema].IfcRelDefinesByProperties(
      model.ifcMetadata.maxExpressID,
      relGlobalId,
      ownerHistoryHandle,
      null,
      null,
      [],
      new WEBIFC.Handle(pset.expressID)
    );

    this.setData(model, pset, rel);

    return { pset, rel };
  }

  removePset(model: FragmentsGroup, ...psetID: number[]) {
    const { properties } = IfcPropertiesManager.getIFCInfo(model);
    for (const expressID of psetID) {
      const pset = properties[expressID];
      if (pset?.type !== WEBIFC.IFCPROPERTYSET) continue;
      const relID = IfcPropertiesUtils.getPsetRel(properties, expressID);
      if (relID) {
        delete properties[relID];
        this.registerChange(model, relID);
      }
      if (pset) {
        for (const propHandle of pset.HasProperties)
          delete properties[propHandle.value];
        delete properties[expressID];
        this.onPsetRemoved.trigger({ model, psetID: expressID });
        this.registerChange(model, expressID);
      }
    }
  }

  private newSingleProperty(
    model: FragmentsGroup,
    type: string,
    name: string,
    value: string | number | boolean
  ) {
    const { schema } = IfcPropertiesManager.getIFCInfo(model);
    this.increaseMaxID(model);
    const propName = new WEBIFC[schema].IfcIdentifier(name);
    // @ts-ignore
    const propValue = new WEBIFC[schema][type](value);
    const prop = new WEBIFC[schema].IfcPropertySingleValue(
      model.ifcMetadata.maxExpressID,
      propName,
      null,
      propValue,
      null
    );
    this.setData(model, prop);
    return prop;
  }

  newSingleStringProperty(
    model: FragmentsGroup,
    type: StringPropTypes,
    name: string,
    value: string
  ) {
    return this.newSingleProperty(model, type, name, value);
  }

  newSingleNumericProperty(
    model: FragmentsGroup,
    type: NumericPropTypes,
    name: string,
    value: number
  ) {
    return this.newSingleProperty(model, type, name, value);
  }

  newSingleBooleanProperty(
    model: FragmentsGroup,
    type: BooleanPropTypes,
    name: string,
    value: boolean
  ) {
    return this.newSingleProperty(model, type, name, value);
  }

  removePsetProp(model: FragmentsGroup, psetID: number, propID: number) {
    const { properties } = IfcPropertiesManager.getIFCInfo(model);
    const pset = properties[psetID];
    const prop = properties[propID];
    if (!(pset.type === WEBIFC.IFCPROPERTYSET && prop)) return;
    const propHandlers = pset.HasProperties.filter((handle: any) => {
      return handle.value !== propID;
    });
    pset.HasProperties = propHandlers;
    delete properties[propID];
    this.registerChange(model, psetID, propID);
  }

  addElementToPset(
    model: FragmentsGroup,
    psetID: number,
    ...elementID: number[]
  ) {
    const { properties } = IfcPropertiesManager.getIFCInfo(model);
    const relID = IfcPropertiesUtils.getPsetRel(properties, psetID);
    if (!relID) return;
    const rel = properties[relID];
    for (const expressID of elementID) {
      const elementHandle = new WEBIFC.Handle(expressID);
      rel.RelatedObjects.push(elementHandle);
      this.onElementToPset.trigger({ model, psetID, elementID: expressID });
    }
    this.registerChange(model, psetID);
  }

  addPropToPset(model: FragmentsGroup, psetID: number, ...propID: number[]) {
    const { properties } = IfcPropertiesManager.getIFCInfo(model);
    const pset = properties[psetID];
    if (!pset) return;
    for (const expressID of propID) {
      const elementHandle = new WEBIFC.Handle(expressID);
      pset.HasProperties.push(elementHandle);
      this.onPropToPset.trigger({ model, psetID, propID: expressID });
    }
    this.registerChange(model, psetID);
  }

  saveToIfc(model: FragmentsGroup, ifcToSaveOn: Uint8Array) {
    const { properties } = IfcPropertiesManager.getIFCInfo(model);
    const modelID = this._ifcApi.OpenModel(ifcToSaveOn);
    const changes = this._changeMap[model.uuid] ?? [];
    for (const expressID of changes) {
      const data = properties[expressID] as any;
      if (!data) {
        this._ifcApi.DeleteLine(modelID, expressID);
      } else {
        this._ifcApi.WriteLine(modelID, data);
      }
    }
    const modifiedIFC = this._ifcApi.SaveModel(modelID);
    this._ifcApi.CloseModel(modelID);

    (this._ifcApi as any) = null;
    this._ifcApi = new WEBIFC.IfcAPI();
    this._ifcApi.SetWasmPath(this.wasmPath, true);
    this._ifcApi.Init();

    return modifiedIFC;
  }

  setAttributeListener(
    model: FragmentsGroup,
    expressID: number,
    attributeName: string
  ) {
    if (!this.attributeListeners[model.uuid])
      this.attributeListeners[model.uuid] = {};
    const existingListener = this.attributeListeners[model.uuid][expressID]
      ? this.attributeListeners[model.uuid][expressID][attributeName]
      : null;
    if (existingListener) return existingListener;

    const { properties } = IfcPropertiesManager.getIFCInfo(model);
    const entity = properties[expressID];
    if (!entity) {
      throw new Error(`Entity with expressID ${expressID} doesn't exists.`);
    }
    const attribute = entity[attributeName];
    if (Array.isArray(attribute) || !attribute) {
      throw new Error(
        `Attribute ${attributeName} is array or null, and it can't have a listener.`
      );
    }
    const value = attribute.value;
    if (value === undefined || value == null) {
      throw new Error(`Attribute ${attributeName} has a badly defined handle.`);
    }
    // Is it good to set all the above as errors? Or better return null?

    const event = new Event<String | Number | Boolean>();
    Object.defineProperty(entity[attributeName], "value", {
      get() {
        return this._value;
      },
      set(value) {
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

  get(): ChangeMap {
    return this._changeMap;
  }
}
