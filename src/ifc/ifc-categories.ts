import * as WEBIFC from "web-ifc";
import { IfcElements } from "./ifc-elements-map";

// TODO: Export elements and category maps from web-ifc

export interface IfcItemsCategories {
  [itemID: number]: number;
}

export class IfcCategories {
  getAll(webIfc: WEBIFC.IfcAPI, modelID: number) {
    const elementsCategories: IfcItemsCategories = {};
    const categoriesIDs = Object.keys(IfcElements).map((e) => parseInt(e, 10));

    for (let i = 0; i < categoriesIDs.length; i++) {
      const element = categoriesIDs[i];
      const lines = webIfc.GetLineIDsWithType(modelID, element);
      const size = lines.size();
      for (let i = 0; i < size; i++) {
        elementsCategories[lines.get(i)] = element;
      }
    }

    return elementsCategories;
  }
}
