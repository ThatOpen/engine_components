import * as WEBIFC from "web-ifc";
import { Component } from "../../base-types";
import { Components } from "../../core/Components";
import { generateIfcGUID } from "../../utils";

interface PropertyChange {
  expressID: number;
  propName: string;
  newValue: string | boolean | number;
}

interface PsetProp {
  name: string;
  type: "IfcBoolean" | "IfcText" | "IfcReal";
  value: string | number | boolean;
}

interface Pset {
  name: string;
  description: string | null;
  elements: number[];
  props: PsetProp[];
}

export class IfcPropertiesManager extends Component<null> {
  name: string = "PropertiesManager";
  enabled: boolean = true;
  // @ts-ignore
  private _components: Components;
  private _ifcApi: WEBIFC.IfcAPI;
  private _changesList: (PropertyChange & { id: string })[] = [];
  private _psetsList: (Pset & { id: string })[] = [];
  private _allowedSchemas = ["IFC2X3", "IFC4", "IFC4X3"];

  constructor(components: Components, ifcApi?: WEBIFC.IfcAPI) {
    super();
    this._components = components;
    this._ifcApi = ifcApi ?? new WEBIFC.IfcAPI();
    this._ifcApi.SetWasmPath("/", true);
    this._ifcApi.Init();
  }

  addPset(name: string, description: string | null, groupId: string) {
    const pset: Pset = {
      name,
      description,
      elements: [],
      props: [],
    };
    this._psetsList.push({ ...pset, id: groupId });
    return pset;
  }

  addProperty(pset: Pset, prop: PsetProp) {
    pset.props.push(prop);
  }

  addChange(change: PropertyChange, id: string) {
    const _id = `${id}/${change.expressID}/${change.propName}`;
    this._changesList = this._changesList.filter((_change) => {
      return `${_change.id}/${_change.expressID}/${_change.propName}` !== _id;
    });
    this._changesList.push({
      ...change,
      id,
    });
  }

  saveOnIfc(ifc: Uint8Array, ids?: string[]): Uint8Array | null {
    const modelID = this._ifcApi.OpenModel(ifc);
    const schema = this._ifcApi.GetModelSchema(modelID) as
      | "IFC2X3"
      | "IFC4"
      | "IFC4X3";
    if (!this._allowedSchemas.includes(schema)) {
      return null;
    }

    // #region Property changes
    const matchingChanges = this._changesList.filter((change) => {
      return ids ? ids.includes(change.id) : true;
    });

    matchingChanges.forEach((change) => {
      const { expressID, propName, newValue } = change;
      const line = this._ifcApi.GetLine(modelID, expressID);
      if (!line) {
        console.warn(
          `ExpressID: ${expressID}} doesn't exists in the IFC file.`
        );
        return;
      }
      line[propName] = newValue;
      this._ifcApi.WriteLine(modelID, line);
    });
    // #endregion Property changes

    // #region Psets
    let maxExpressId = this._ifcApi.GetMaxExpressID(modelID);
    const ownerHistory = this._ifcApi.GetLineIDsWithType(
      modelID,
      WEBIFC.IFCOWNERHISTORY
    );

    const matchingPsets = this._psetsList.filter((pset) => {
      return ids ? ids.includes(pset.id) : true;
    });

    matchingPsets.forEach((pset) => {
      const _pset = new WEBIFC[schema].IfcPropertySet(
        maxExpressId++,
        new WEBIFC[schema].IfcGloballyUniqueId(generateIfcGUID()),
        new WEBIFC.Handle(ownerHistory.get(0)),
        new WEBIFC[schema].IfcLabel(pset.name),
        null,
        []
      );
      if (pset.description) {
        _pset.Description = new WEBIFC[schema].IfcText(pset.description);
      }

      pset.props.forEach((prop) => {
        const _prop = new WEBIFC[schema].IfcPropertySingleValue(
          maxExpressId++,
          new WEBIFC.IFC2X3.IfcIdentifier(prop.name),
          null,
          // @ts-ignore
          new WEBIFC.IFC2X3[prop.type](prop.value.toString()),
          null
        );
        _pset.HasProperties.push(new WEBIFC.Handle(_prop.expressID));
        this._ifcApi.WriteLine(modelID, _prop);
      });

      const rel = new WEBIFC[schema].IfcRelDefinesByProperties(
        maxExpressId++,
        new WEBIFC[schema].IfcGloballyUniqueId(generateIfcGUID()),
        new WEBIFC.Handle(ownerHistory.get(0)),
        null,
        null,
        [],
        new WEBIFC.Handle(_pset.expressID)
      );

      pset.elements.forEach((element) => {
        rel.RelatedObjects.push(new WEBIFC.Handle(element));
      });

      this._ifcApi.WriteLine(modelID, _pset);
      this._ifcApi.WriteLine(modelID, rel);
    });
    // #endregion Psets

    const modifiedIFC = this._ifcApi.SaveModel(modelID);
    this._ifcApi.CloseModel(modelID);
    return modifiedIFC;
  }

  get(): null {
    return null;
  }
}
