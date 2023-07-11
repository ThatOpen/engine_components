import * as WEBIFC from "web-ifc";
import { FragmentsGroup } from "bim-fragment";
import { Component } from "../../base-types";
import { Components } from "../../core/Components";
import { generateIfcGUID } from "../../utils";
import { IfcPropertiesUtils, IfcProperties } from "../IfcPropertiesUtils";

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

export class IfcPropertiesManager extends Component<null> {
  name: string = "PropertiesManager";
  enabled: boolean = true;
  // @ts-ignore
  private _components: Components;
  private _ifcApi: WEBIFC.IfcAPI;
  private _changeMap: { [modelID: string]: Set<number> } = {};

  constructor(components: Components, ifcApi?: WEBIFC.IfcAPI) {
    super();
    this._components = components;
    this._ifcApi = ifcApi ?? new WEBIFC.IfcAPI();
    this._ifcApi.SetWasmPath("/", true);
    this._ifcApi.Init();
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

  private registerChange(model: ExtendedFragmentsGroup, expressID: number) {
    if (!this._changeMap[model.uuid]) this._changeMap[model.uuid] = new Set();
    this._changeMap[model.uuid].add(expressID);
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

  addElementToPset(
    model: ExtendedFragmentsGroup,
    psetID: number,
    ...elementExpressID: number[]
  ) {
    const { properties } = this.getIFCInfo(model);
    const rel = IfcPropertiesUtils.getPsetRel(properties, psetID);
    if (!rel) return;
    for (const expressID of elementExpressID) {
      const elementHandle = new WEBIFC.Handle(expressID);
      rel.RelatedObjects.push(elementHandle);
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
    if (!pset)
      throw new Error(
        `PsetID: ${psetID} not found in FragmentsGroup properties.`
      );
    for (const expressID of propID) {
      const elementHandle = new WEBIFC.Handle(expressID);
      pset.HasProperties.push(elementHandle);
    }
    this.registerChange(model, psetID);
  }

  saveOnIfc(
    model: ExtendedFragmentsGroup,
    ifcToSaveOn: Uint8Array
  ): Uint8Array | null {
    const { properties } = this.getIFCInfo(model);
    const modelID = this._ifcApi.OpenModel(ifcToSaveOn);
    for (const expressID of this._changeMap[model.uuid]) {
      const data = properties[expressID] as any;
      if (!data) continue;
      this._ifcApi.WriteLine(modelID, data);
    }
    const modifiedIFC = this._ifcApi.SaveModel(modelID);
    this._ifcApi.CloseModel(modelID);
    return modifiedIFC;
  }

  get(): null {
    return null;
  }
}
