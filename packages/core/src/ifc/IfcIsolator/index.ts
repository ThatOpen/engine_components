import * as WEBIFC from "web-ifc";
import { Component, Components } from "../../core";

/**
 * Component to isolate certain elements from an IFC and export to another IFC. 📕 [Tutorial](https://docs.thatopen.com/Tutorials/Components/Core/IfcIsolator). 📘 [API](https://docs.thatopen.com/api/@thatopen/components/classes/IfcIsolator).
 */
export class IfcIsolator extends Component {
  /**
   * A unique identifier for the component.
   * This UUID is used to register the component within the Components system.
   */
  static readonly uuid = "6eb0ba2f-71c0-464e-bcec-2d7c335186b2" as const;

  /** {@link Component.enabled} */
  enabled = true;

  constructor(components: Components) {
    super(components);
    components.add(IfcIsolator.uuid, this);
  }

  async getIsolatedElements(
    webIfc: WEBIFC.IfcAPI,
    modelID: number,
    elementIDs: Array<number>,
  ) {
    const isolatedElementIDs: Set<number> = new Set();

    //	Helper function to recursively add references
    function addElementAndReferences(elementID: number) {
      if (isolatedElementIDs.has(elementID)) return;

      //	Get the element and add it to the set
      const element = webIfc.GetLine(modelID, elementID);
      if (!element) return;
      isolatedElementIDs.add(elementID);

      //	Check for references in the element's properties
      for (const prop in element) {
        const value = element[prop];
        if (value && value.constructor.name === "Handle" && value.value > 0) {
          addElementAndReferences(value.value);
        } else if (Array.isArray(value)) {
          //	Handle arrays of references
          value.forEach((refID) => {
            if (
              refID &&
              refID.constructor.name === "Handle" &&
              refID.value > 0
            ) {
              addElementAndReferences(refID.value);
            }
          });
        }
      }
    }

    //	Iterate through all elements
    for (const elementID of elementIDs) {
      addElementAndReferences(elementID);
    }

    const arr: Array<number> = [];
    for (const elementID of isolatedElementIDs) {
      //	Set elements pushed into the array
      arr.push(elementID);
    }
    //	Sort the elements by ID
    arr.sort((a, b) => {
      return a - b;
    });

    const isolatedElements: Array<any> = [];
    arr.forEach((elementID) => {
      const element = webIfc.GetLine(modelID, elementID);
      isolatedElements.push(element);
    });

    return isolatedElements;
  }

  /**
   * Exports isolated elements to the new model.
   * @param webIfc The instance of [web-ifc](https://github.com/ThatOpen/engine_web-ifc) to use.
   * @param modelID ID of the new IFC model.
   * @param isolatedElements The array of isolated elements
   */
  async export(
    webIfc: WEBIFC.IfcAPI,
    modelID: number,
    isolatedElements: Array<any>,
  ) {
    isolatedElements.forEach((element) => {
      webIfc.WriteLine(modelID, element);
    });
    const data = webIfc.SaveModel(modelID);
    return data;
  }

  async splitIfc(
    webIfc: WEBIFC.IfcAPI,
    ifcFile: ArrayBuffer,
    idsToExtract: Array<number>,
  ) {
    const ifcBuffer = new Uint8Array(ifcFile);
    const modelID = webIfc.OpenModel(ifcBuffer);
    const isolated = await this.getIsolatedElements(
      webIfc,
      modelID,
      idsToExtract,
    );
    const newModelID = webIfc.CreateModel({ schema: WEBIFC.Schemas.IFC2X3 });
    const data = await this.export(webIfc, newModelID, isolated);
    return data;
  }
}
