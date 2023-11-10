import * as WEBIFC from "web-ifc";
import { FragmentsGroup } from "bim-fragment";
import { Component, Disposable, Event, UI, UIElement } from "../../base-types";
import { Components, ToolComponent } from "../../core";
import { generateIfcGUID } from "../../utils";
import { IfcPropertiesUtils } from "../IfcPropertiesUtils";
import { EntityActionsUI } from "./src/entity-actions";
import { PsetActionsUI } from "./src/pset-actions";
import { PropActionsUI } from "./src/prop-actions";
import { Button } from "../../ui";

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
  implements Disposable, UI
{
  static readonly uuid = "58c2d9f0-183c-48d6-a402-dfcf5b9a34df" as const;

  readonly onRequestFile = new Event();
  ifcToExport: ArrayBuffer | null = null;

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

  wasm = {
    path: "/",
    absolute: false,
  };

  enabled: boolean = true;
  attributeListeners: AttributeListener = {};
  selectedModel?: FragmentsGroup;

  uiElement = new UIElement<{
    entityActions: EntityActionsUI;
    psetActions: PsetActionsUI;
    propActions: PropActionsUI;
    exportButton: Button;
  }>();

  private _ifcApi: WEBIFC.IfcAPI;
  private _changeMap: ChangeMap = {};

  constructor(components: Components) {
    super(components);

    this.components.tools.add(IfcPropertiesManager.uuid, this);

    this._ifcApi = new WEBIFC.IfcAPI();

    // TODO: Save original IFC file so that opening it again is not necessary
    if (components.uiEnabled) {
      this.setUI(components);
      this.setUIEvents();
    }
  }

  get(): ChangeMap {
    return this._changeMap;
  }

  async init() {
    const { path, absolute } = this.wasm;
    this._ifcApi.SetWasmPath(path, absolute);
    await this._ifcApi.Init();
  }

  async dispose() {
    (this._ifcApi as any) = null;
    this.selectedModel = undefined;
    this.attributeListeners = {};
    this._changeMap = {};
    this.onElementToPset.reset();
    this.onPropToPset.reset();
    this.onPsetRemoved.reset();
    this.onDataChanged.reset();
    await this.uiElement.dispose();
  }

  private setUI(components: Components) {
    const exportButton = new Button(components);
    exportButton.tooltip = "Export IFC";
    exportButton.materialIcon = "exit_to_app";
    exportButton.onClick.add(async () => {
      await this.onRequestFile.trigger();
      if (!this.ifcToExport || !this.selectedModel) return;
      const fileData = new Uint8Array(this.ifcToExport);
      const name = this.selectedModel.name;
      const resultBuffer = await this.saveToIfc(this.selectedModel, fileData);
      const resultFile = new File([new Blob([resultBuffer])], name);
      const link = document.createElement("a");
      link.download = name;
      link.href = URL.createObjectURL(resultFile);
      link.click();
      link.remove();
    });

    this.uiElement.set({
      exportButton,
      entityActions: new EntityActionsUI(components),
      psetActions: new PsetActionsUI(components),
      propActions: new PropActionsUI(components),
    });
  }

  private setUIEvents() {
    const entityActions = this.uiElement.get<EntityActionsUI>("entityActions");
    const propActions = this.uiElement.get<PropActionsUI>("propActions");
    const psetActions = this.uiElement.get<PsetActionsUI>("psetActions");

    entityActions.onNewPset.add(
      async ({ model, elementIDs, name, description }) => {
        const { pset } = await this.newPset(
          model,
          name,
          description === "" ? undefined : description
        );

        for (const expressID of elementIDs ?? []) {
          await this.addElementToPset(model, pset.expressID, expressID);
        }

        entityActions.cleanData();
      }
    );

    propActions.onEditProp.add(async ({ model, expressID, name, value }) => {
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

      await this.registerChange(model, expressID);

      propActions.cleanData();
    });

    propActions.onRemoveProp.add(async ({ model, expressID, setID }) => {
      await this.removePsetProp(model, setID, expressID);
      propActions.cleanData();
    });

    psetActions.onEditPset.add(async ({ model, psetID, name, description }) => {
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

      await this.registerChange(model, psetID);
    });

    psetActions.onRemovePset.add(async ({ model, psetID }) => {
      await this.removePset(model, psetID);
    });

    psetActions.onNewProp.add(async ({ model, psetID, name, type, value }) => {
      const prop = await this.newSingleStringProperty(
        model,
        type as StringPropTypes,
        name,
        value
      );
      await this.addPropToPset(model, psetID, prop.expressID);
    });
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

  private async registerChange(model: FragmentsGroup, ...expressID: number[]) {
    if (!this._changeMap[model.uuid]) {
      this._changeMap[model.uuid] = new Set();
    }
    for (const id of expressID) {
      this._changeMap[model.uuid].add(id);
      await this.onDataChanged.trigger({ model, expressID: id });
    }
  }

  async setData(model: FragmentsGroup, ...dataToSave: Record<string, any>[]) {
    const { properties } = IfcPropertiesManager.getIFCInfo(model);
    for (const data of dataToSave) {
      const expressID = data.expressID;
      if (!expressID) continue;
      properties[expressID] = data;
      await this.registerChange(model, expressID);
    }
  }

  async newPset(model: FragmentsGroup, name: string, description?: string) {
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
      relGlobalId,
      ownerHistoryHandle,
      null,
      null,
      [],
      new WEBIFC.Handle(pset.expressID)
    );

    await this.setData(model, pset, rel);

    return { pset, rel };
  }

  async removePset(model: FragmentsGroup, ...psetID: number[]) {
    const { properties } = IfcPropertiesManager.getIFCInfo(model);
    for (const expressID of psetID) {
      const pset = properties[expressID];
      if (pset?.type !== WEBIFC.IFCPROPERTYSET) continue;
      const relID = IfcPropertiesUtils.getPsetRel(properties, expressID);
      if (relID) {
        delete properties[relID];
        await this.registerChange(model, relID);
      }
      if (pset) {
        for (const propHandle of pset.HasProperties)
          delete properties[propHandle.value];
        delete properties[expressID];
        await this.onPsetRemoved.trigger({ model, psetID: expressID });
        await this.registerChange(model, expressID);
      }
    }
  }

  private async newSingleProperty(
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
      propName,
      null,
      propValue,
      null
    );
    await this.setData(model, prop);
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

  async removePsetProp(model: FragmentsGroup, psetID: number, propID: number) {
    const { properties } = IfcPropertiesManager.getIFCInfo(model);
    const pset = properties[psetID];
    const prop = properties[propID];
    if (!(pset.type === WEBIFC.IFCPROPERTYSET && prop)) return;
    pset.HasProperties = pset.HasProperties.filter((handle: any) => {
      return handle.value !== propID;
    });
    delete properties[propID];
    await this.registerChange(model, psetID, propID);
  }

  async addElementToPset(
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
      await this.onElementToPset.trigger({
        model,
        psetID,
        elementID: expressID,
      });
    }
    await this.registerChange(model, psetID);
  }

  async addPropToPset(
    model: FragmentsGroup,
    psetID: number,
    ...propID: number[]
  ) {
    const { properties } = IfcPropertiesManager.getIFCInfo(model);
    const pset = properties[psetID];
    if (!pset) return;
    for (const expressID of propID) {
      const elementHandle = new WEBIFC.Handle(expressID);
      pset.HasProperties.push(elementHandle);
      await this.onPropToPset.trigger({ model, psetID, propID: expressID });
    }
    await this.registerChange(model, psetID);
  }

  async saveToIfc(model: FragmentsGroup, ifcToSaveOn: Uint8Array) {
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
    const { path, absolute } = this.wasm;
    this._ifcApi.SetWasmPath(path, absolute);
    await this._ifcApi.Init();

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

    // TODO: Is it good to set all the above as errors? Or better return null?

    // TODO: Do we need an async-await in the following set function?

    const event = new Event<String | Number | Boolean>();
    Object.defineProperty(entity[attributeName], "value", {
      get() {
        return this._value;
      },
      async set(value) {
        this._value = value;
        await event.trigger(value);
      },
    });

    entity[attributeName].value = value;

    if (!this.attributeListeners[model.uuid][expressID])
      this.attributeListeners[model.uuid][expressID] = {};
    this.attributeListeners[model.uuid][expressID][attributeName] = event;

    return event;
  }
}

ToolComponent.libraryUUIDs.add(IfcPropertiesManager.uuid);
