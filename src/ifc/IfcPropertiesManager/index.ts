import * as WEBIFC from "web-ifc";
import { FragmentsGroup } from "bim-fragment";
import { Component, UI, Event } from "../../base-types";
import { Components } from "../../core/Components";
import { generateIfcGUID } from "../../utils";
import { IfcPropertiesUtils, IfcProperties } from "../IfcPropertiesUtils";
import { Button } from "../../ui/ButtonComponent";
import { UIComponentsStack } from "../../ui/UIComponentsStack";

type BooleanPropTypes = "IfcBoolean" | "IfcLogical";
type StringPropTypes = "IfcText" | "IfcLabel" | "IfcIdentifier";
type NumericPropTypes = "IfcInteger" | "IfcReal";

interface ExtendedFragmentsGroup extends FragmentsGroup {
  ifcFileData: {
    name: string;
    description: string;
    schema: "IFC2X3" | "IFC4" | "IFC4X3";
    maxExpressID: number;
  };
}

interface ChangeMap {
  [modelID: string]: Set<number>;
}

export class IfcPropertiesManager extends Component<ChangeMap> implements UI {
  name: string = "PropertiesManager";
  enabled: boolean = true;
  uiElement: {
    entityActions: UIComponentsStack;
    psetActions: UIComponentsStack;
    propActions: UIComponentsStack;
  };

  private _components: Components;
  private _ifcApi: WEBIFC.IfcAPI;
  private _changeMap: ChangeMap = {};

  readonly onElementToPset = new Event<{
    model: ExtendedFragmentsGroup;
    psetID: number;
    elementID: number;
  }>();

  constructor(components: Components, ifcApi?: WEBIFC.IfcAPI) {
    super();
    this._components = components;
    this._ifcApi = ifcApi ?? new WEBIFC.IfcAPI();
    this._ifcApi.SetWasmPath("/", true);
    this._ifcApi.Init();
    this.uiElement = {
      entityActions: new UIComponentsStack(this._components, "Horizontal"),
      psetActions: new UIComponentsStack(this._components, "Horizontal"),
      propActions: new UIComponentsStack(this._components, "Horizontal"),
    };
    this.setUI();
  }

  private setUI() {
    const addPset = new Button(this._components, { materialIconName: "add" });
    addPset.onclick = () => {
      const { model, elementID } = this.uiElement.entityActions.data;
      if (!(model && elementID)) return;
      const { pset } = this.newPset(model, "My new pset");
      this.addElementToPset(model, pset.expressID, elementID);
    };

    this.uiElement.entityActions.addChild(addPset);

    const editPset = new Button(this._components, { materialIconName: "edit" });
    editPset.onclick = () => {
      const { model, psetID } = this.uiElement.psetActions.data;
      if (!(model && psetID)) return;
      const { properties } = this.getIFCInfo(model);
      const pset = properties[psetID];
      if (!pset) return;
      const name = prompt("Enter a new pset name", pset.Name?.value);
      const description = prompt(
        "Enter a new pset description",
        pset.Description?.value
      );
      if (name && pset.Name) pset.Name.value = name;
      if (description && pset.Description) pset.Description.value = description;
    };

    const removePset = new Button(this._components, {
      materialIconName: "delete",
    });
    removePset.onclick = () => {
      const { model, psetID } = this.uiElement.psetActions.data;
      if (!(model && psetID)) return;
      this.removePset(model, psetID);
    };

    const addProp = new Button(this._components, {
      materialIconName: "add",
    });
    addProp.onclick = () => {
      const { model, psetID } = this.uiElement.psetActions.data;
      if (!(model && psetID)) return;
      const { properties } = this.getIFCInfo(model);
      const pset = properties[psetID];
      if (!pset) return;
      const prop = this.newSingleStringProperty(
        model,
        "IfcText",
        "My prop",
        "My value"
      );
      this.addPropToPset(model, psetID, prop.expressID);
    };

    this.uiElement.psetActions.addChild(addProp, editPset, removePset);

    const editProp = new Button(this._components, {
      materialIconName: "edit",
    });
    editProp.onclick = () => {
      const { model, expressID, valueKey } = this.uiElement.propActions.data;
      if (!(model && expressID && valueKey)) return;
      const { properties } = this.getIFCInfo(model);
      const entity = properties[expressID];
      // const currentName = entity.Name?.value;
      const currentValue = entity[valueKey]?.value;
      const name = prompt("Enter a new Name", entity.Name?.value);
      const value = prompt(`Enter a new ${valueKey}`, entity[valueKey]?.value);
      entity.Name.value = name;
      if (currentValue) entity[valueKey].value = value;
      this.setData(model, entity);
    };

    const removeProp = new Button(this._components, {
      materialIconName: "delete",
    });
    removeProp.onclick = () => {
      const { model, setID, expressID } = this.uiElement.propActions.data;
      if (!(model && setID && expressID)) return;
      this.removePsetProp(model, setID, expressID);
    };

    this.uiElement.propActions.addChild(editProp, removeProp);
  }

  private increaseMaxID(model: ExtendedFragmentsGroup) {
    model.ifcFileData.maxExpressID++;
  }

  private getIFCInfo(model: ExtendedFragmentsGroup) {
    const properties: IfcProperties = model.properties;
    if (!properties) throw new Error("FragmentsGroup properties not found");
    const schema = model.ifcFileData.schema;
    if (!schema) throw new Error("IFC Schema not found");
    return { properties, schema };
  }

  private newGUID(model: ExtendedFragmentsGroup) {
    const { schema } = this.getIFCInfo(model);
    return new WEBIFC[schema].IfcGloballyUniqueId(generateIfcGUID());
  }

  private getOwnerHistory(model: ExtendedFragmentsGroup) {
    const { properties } = this.getIFCInfo(model);
    const ownerHistory = IfcPropertiesUtils.findItemOfType(
      properties,
      WEBIFC.IFCOWNERHISTORY
    );
    if (!ownerHistory) throw new Error("No OwnerHistory was found.");
    const ownerHistoryHandle = new WEBIFC.Handle(ownerHistory.expressID);
    return { ownerHistory, ownerHistoryHandle };
  }

  private registerChange(
    model: ExtendedFragmentsGroup,
    ...expressID: number[]
  ) {
    if (!this._changeMap[model.uuid]) this._changeMap[model.uuid] = new Set();
    for (const id of expressID) this._changeMap[model.uuid].add(id);
  }

  setData(model: ExtendedFragmentsGroup, ...dataToSave: Record<string, any>[]) {
    const { properties } = this.getIFCInfo(model);
    for (const data of dataToSave) {
      const expressID = data.expressID;
      if (!expressID) continue;
      properties[expressID] = data;
      this.registerChange(model, expressID);
    }
  }

  newPset(model: ExtendedFragmentsGroup, name: string, description?: string) {
    const { schema } = this.getIFCInfo(model);
    const { ownerHistoryHandle } = this.getOwnerHistory(model);

    this.increaseMaxID(model);
    const psetGlobalId = this.newGUID(model);
    const psetName = new WEBIFC[schema].IfcLabel(name);
    const psetDescription = description
      ? new WEBIFC[schema].IfcText(description)
      : null;
    const pset = new WEBIFC[schema].IfcPropertySet(
      model.ifcFileData.maxExpressID,
      psetGlobalId,
      ownerHistoryHandle,
      psetName,
      psetDescription,
      []
    );

    this.increaseMaxID(model);
    const relGlobalId = this.newGUID(model);
    const rel = new WEBIFC[schema].IfcRelDefinesByProperties(
      model.ifcFileData.maxExpressID,
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

  removePset(model: ExtendedFragmentsGroup, psetID: number) {
    const { properties } = this.getIFCInfo(model);
    const pset = properties[psetID];
    if (pset.type !== WEBIFC.IFCPROPERTYSET) return;
    const relID = IfcPropertiesUtils.getPsetRel(properties, psetID);
    if (relID) {
      delete properties[relID];
      this.registerChange(model, relID);
    }
    if (pset) {
      for (const propHandle of pset.HasProperties)
        delete properties[propHandle.value];
      delete properties[psetID];
      this.registerChange(model, psetID);
    }
  }

  private newSingleProperty(
    model: ExtendedFragmentsGroup,
    type: string,
    name: string,
    value: string | number | boolean
  ) {
    const { schema } = this.getIFCInfo(model);
    this.increaseMaxID(model);
    const propName = new WEBIFC[schema].IfcIdentifier(name);
    // @ts-ignore
    const propValue = new WEBIFC[schema][type](value);
    const prop = new WEBIFC[schema].IfcPropertySingleValue(
      model.ifcFileData.maxExpressID,
      propName,
      null,
      propValue,
      null
    );
    this.setData(model, prop);
    return prop;
  }

  newSingleStringProperty(
    model: ExtendedFragmentsGroup,
    type: StringPropTypes,
    name: string,
    value: string
  ) {
    return this.newSingleProperty(model, type, name, value);
  }

  newSingleNumericProperty(
    model: ExtendedFragmentsGroup,
    type: NumericPropTypes,
    name: string,
    value: number
  ) {
    return this.newSingleProperty(model, type, name, value);
  }

  newSingleBooleanProperty(
    model: ExtendedFragmentsGroup,
    type: BooleanPropTypes,
    name: string,
    value: boolean
  ) {
    return this.newSingleProperty(model, type, name, value);
  }

  removePsetProp(
    model: ExtendedFragmentsGroup,
    psetID: number,
    propID: number
  ) {
    const { properties } = this.getIFCInfo(model);
    const pset = properties[psetID];
    const prop = properties[propID];
    if (!(pset.type === WEBIFC.IFCPROPERTYSET && prop)) return;
    const propHandlers = pset.HasProperties.filter(
      (handle: { value: number }) => {
        return handle.value !== propID;
      }
    );
    pset.HasProperties = propHandlers;
    delete properties[propID];
    this.registerChange(model, psetID, propID);
  }

  addElementToPset(
    model: ExtendedFragmentsGroup,
    psetID: number,
    ...elementID: number[]
  ) {
    const { properties } = this.getIFCInfo(model);
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

  addPropToPset(
    model: ExtendedFragmentsGroup,
    psetID: number,
    ...propID: number[]
  ) {
    const { properties } = this.getIFCInfo(model);
    const pset = properties[psetID];
    if (!pset) return;
    for (const expressID of propID) {
      const elementHandle = new WEBIFC.Handle(expressID);
      pset.HasProperties.push(elementHandle);
    }
    this.registerChange(model, psetID);
  }

  saveToIfc(model: ExtendedFragmentsGroup, ifcToSaveOn: Uint8Array) {
    const { properties } = this.getIFCInfo(model);
    const modelID = this._ifcApi.OpenModel(ifcToSaveOn);
    for (const expressID of this._changeMap[model.uuid]) {
      const data = properties[expressID] as any;
      if (!data) {
        this._ifcApi.DeleteLine(modelID, expressID);
      } else {
        this._ifcApi.WriteLine(modelID, data);
      }
    }
    const modifiedIFC = this._ifcApi.SaveModel(modelID);
    this._ifcApi.CloseModel(modelID);
    return modifiedIFC;
  }

  get(): ChangeMap {
    return this._changeMap;
  }
}
